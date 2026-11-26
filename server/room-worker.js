const ALLOWED=new Set(['https://qinkaibao.github.io','https://menghui1995-xiaocun.r8ctsft66b.chatgpt.site']);
const TTL=90000, SEAT=45000;
const enc=new TextEncoder();
const hash=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(s))),v=>v.toString(16).padStart(2,'0')).join('');
const token=()=>Array.from(crypto.getRandomValues(new Uint8Array(24)),v=>v.toString(16).padStart(2,'0')).join('');
const goodCode=v=>typeof v==='string'&&/^\d{6,12}$/.test(v);
const goodToken=v=>typeof v==='string'&&/^[a-f0-9]{48}$/.test(v);
function safeState(s){if(!s||typeof s.scene!=='string'||!/^[a-zA-Z]{1,32}$/.test(s.scene)||!Number.isFinite(s.x)||!Number.isFinite(s.y))return null;const a=s.avatar||{};const clean=v=>typeof v==='string'&&/^[a-zA-Z0-9-]{1,25}$/.test(v)?v:'';return {scene:s.scene,x:Math.max(.09,Math.min(.91,s.x)),y:Math.max(.57,Math.min(.94,s.y)),dir:['up','down','left','right'].includes(s.dir)?s.dir:'down',frame:[0,1,2].includes(s.frame)?s.frame:0,avatar:{gender:clean(a.gender),outfit:clean(a.outfit),hair:clean(a.hair),hairColor:clean(a.hairColor),shoes:clean(a.shoes)},umbrella:!!s.umbrella,wet:Math.max(0,Math.min(1,Number(s.wet)||0)),playing:s.playing===true,day:Math.min(50000,Math.max(1,Number(s.day)||1)),time:Math.min(1440,Math.max(0,Number(s.time)||0))}}
const response=(origin,data,status=200)=>{const headers={'content-type':'application/json; charset=utf-8','access-control-allow-methods':'POST,GET,OPTIONS','access-control-allow-headers':'content-type','cache-control':'no-store','vary':'Origin'};if(ALLOWED.has(origin))headers['access-control-allow-origin']=origin;return new Response(JSON.stringify(data),{status,headers})};
export default {async fetch(req,env){const url=new URL(req.url),origin=req.headers.get('origin'),result=(data,status)=>response(origin,data,status);if(req.method==='OPTIONS')return result({ok:ALLOWED.has(origin)},ALLOWED.has(origin)?200:403);if(req.method==='GET')return result({ok:true,service:'梦回1995 双人房间',version:1,database:!!env.DB});if(req.method!=='POST'||url.pathname!=='/room')return result({error:'not found'},404);if(!ALLOWED.has(origin))return result({error:'origin'},403);if(!env.DB)return result({error:'房间数据库尚未连接'},503);let b;try{const raw=await req.text();if(raw.length>5000)return result({error:'invalid'},400);b=JSON.parse(raw)}catch{return result({error:'invalid'},400)}if(!goodCode(b.code))return result({error:'请输入有效密码'},400);const db=env.DB,id=await hash('mh95:'+b.code),now=Date.now(),state=safeState(b.state),stateJson=state?JSON.stringify(state):null;
try{
  if(b.action==='create'||b.action==='join'){
    if(!state)return result({error:'无效角色状态'},400);
    const key=await hash('mh95-limit:'+String(req.headers.get('CF-Connecting-IP')||'unknown')+':'+Math.floor(now/60000));
    const limit=await db.prepare('INSERT INTO room_limits (id,attempts,expires) VALUES (?,1,?) ON CONFLICT(id) DO UPDATE SET attempts=attempts+1 RETURNING attempts').bind(key,now+120000).first();
    if(limit.attempts>20)return result({error:'尝试次数过多，请稍后再试'},429);
    const t=token(),th=await hash(t);
    if(b.action==='create'){
      const row=await db.prepare('INSERT INTO rooms (id,host_token,host_state,host_seen) VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET host_token=excluded.host_token,host_state=excluded.host_state,host_seen=excluded.host_seen,guest_token=NULL,guest_state=NULL,guest_seen=NULL,host_claps=0,guest_claps=0 WHERE rooms.host_seen<? RETURNING id').bind(id,th,stateJson,now,now-TTL).first();
      if(!row)return result({error:'此密码已经有人创建房间，请换一个密码'},409);
      return result({token:t,role:'host',remote:null});
    }
    const row=await db.prepare('UPDATE rooms SET guest_token=?,guest_state=?,guest_seen=?,guest_claps=0 WHERE id=? AND host_seen>? AND (guest_token IS NULL OR guest_seen<?) RETURNING host_state,host_claps').bind(th,stateJson,now,id,now-TTL,now-SEAT).first();
    if(!row)return result({error:'房间不存在、密码错误或房间已满'},404);
    return result({token:t,role:'guest',remote:JSON.parse(row.host_state),claps:row.host_claps});
  }
  if(!goodToken(b.token)||!['host','guest'].includes(b.role))return result({error:'连接已失效'},401);
  const th=await hash(b.token),host=b.role==='host',own=host?'host':'guest',other=host?'guest':'host';
  if(b.action==='leave'){
    if(host)await db.prepare('DELETE FROM rooms WHERE id=? AND host_token=?').bind(id,th).run();else await db.prepare('UPDATE rooms SET guest_token=NULL,guest_state=NULL,guest_seen=NULL WHERE id=? AND guest_token=?').bind(id,th).run();
    return result({ok:true});
  }
  if(b.action!=='sync'||!state)return result({error:'invalid'},400);
  const row=await db.prepare(`UPDATE rooms SET ${own}_state=?,${own}_seen=?,${own}_claps=${own}_claps+? WHERE id=? AND ${own}_token=? AND host_seen>? RETURNING ${other}_state AS remote_state,${other}_seen AS remote_seen,${other}_claps AS claps`).bind(stateJson,now,b.clap===true?1:0,id,th,now-TTL).first();
  if(!row)return result({error:'房间已关闭或你已离开，请重新加入'},410);
  const remote=row.remote_state&&row.remote_seen>now-SEAT?JSON.parse(row.remote_state):null;
  if(Math.random()<.01){await db.batch([db.prepare('DELETE FROM rooms WHERE host_seen<?').bind(now-TTL*3),db.prepare('DELETE FROM room_limits WHERE expires<?').bind(now)])}
  return result({remote,claps:row.claps||0});
}catch(e){return result({error:'房间服务暂时不可用'},503)}}};
