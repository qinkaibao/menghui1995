'use strict';
// Music, place, weather and foreground effects are mixed separately.
// Each loop is requested only when needed; scene changes crossfade.
window.VillageAudio = (() => {
  const KEY='menghui1995-sound-v2';
  const levels={theme:.60,village:.54,field:.74,grove:.68,river:.67,courtyard:.63,coop:.63,market:.89,street:.71,school:.64,classroom:.42,home:.48,shop:.43,arcade:.65,bowling:.62,night:.66,rain:.72,'roof-rain':.50,wind:.62,leaves:.46,spring:.30};
  const places={village:'village',courtyard:'courtyard',farm:'field',coop:'coop',market:'market',street:'street',funstreet:'market',grove:'grove',picnic:'grove',arcade:'arcade',bowling:'bowling',home:'home',living:'home',bedroom:'home',bathroom:'home',storage:'home',shop:'shop',toyShop:'shop',snackShop:'shop',photoStudio:'home',bikeRepair:'shop',field:'field',river:'river',school:'school',classroom:'classroom',playground:'school',artroom:'classroom'};
  const out=new Set(['village','courtyard','farm','coop','market','street','funstreet','grove','picnic','field','river','school','playground']);
  const nature=new Set(['village','courtyard','farm','field','river','grove','picnic']);
  let enabled=true,ctx,master,noiseBuffer,button,theme,lastStep=0,hidden=false,themeStarted=false,themeFailed=false,unlocked=false;
  let status={scene:'village',season:2,weather:'晴天',time:420};
  try{enabled=localStorage.getItem(KEY)!=='off'}catch{}
  const channels={music:{},place:{},weather:{}};
  const cache=new Map();
  function isPlaying(){return enabled&&!hidden&&((themeStarted&&theme&&!theme.paused&&!theme.ended)||(themeFailed&&ctx?.state==='running'&&channels.music.current))}
  function paint(){const playing=!!isPlaying(),label=playing?'关闭音乐和环境声音':'开启音乐和环境声音',title=playing?'音乐正在播放，点击关闭':'点击开启背景音乐和环境声';if(button){button.textContent=playing?'♫ 开':enabled?'♫ 音乐':'♫ 关';button.title=title;button.setAttribute('aria-label',label);button.setAttribute('aria-pressed',String(playing))}document.querySelectorAll('[data-menu="music"]').forEach(b=>{b.textContent=playing?'♫ 音乐开':enabled?'♫ 开启音乐':'♫ 音乐关';b.title=title;b.setAttribute('aria-label',label);b.setAttribute('aria-pressed',String(playing))})}
  function ramp(param,value,secs=.75){if(!ctx)return;const t=ctx.currentTime;try{if(param.cancelAndHoldAtTime)param.cancelAndHoldAtTime(t);else{const v=param.value;param.cancelScheduledValues(t);param.setValueAtTime(v,t)}param.linearRampToValueAtTime(value,t+secs)}catch{param.value=value}}
  function fetchLoop(name){if(cache.has(name)){const hit=cache.get(name);cache.delete(name);cache.set(name,hit);return hit}const p=fetch('assets/audio/'+name+'.mp3').then(r=>{if(!r.ok)throw Error('Audio '+r.status);return r.arrayBuffer()}).then(bytes=>ctx.decodeAudioData(bytes)).catch(e=>{if(cache.get(name)===p)cache.delete(name);throw e});cache.set(name,p);while(cache.size>6)cache.delete(cache.keys().next().value);return p}
  function retire(channel,seconds=.85){const old=channel.current;if(!old)return;channel.current=null;ramp(old.gain.gain,0,seconds);try{old.source.stop(ctx.currentTime+seconds+.04)}catch{}old.source.onended=()=>{old.source.disconnect();old.gain.disconnect()}}
  async function switchLoop(channel,name,volume){
    if(channel.want===name){if(channel.current?.name===name)ramp(channel.current.gain.gain,volume,.8);return}
    channel.want=name;const revision=(channel.revision||0)+1;channel.revision=revision;
    if(!name){retire(channel);return}
    try{const buffer=await fetchLoop(name);if(channel.revision!==revision||!enabled||hidden)return;
      retire(channel);const source=ctx.createBufferSource(),gain=ctx.createGain();source.buffer=buffer;source.loop=true;gain.gain.value=0;source.connect(gain);gain.connect(master);source.start();channel.current={name,source,gain};ramp(gain.gain,volume,.9);if(channel===channels.music)paint();
    }catch{if(channel.revision===revision){channel.want=null}}
  }
  function themeVolume(){const {scene,time}=status,night=time>=1200||time<330;return scene==='menu'?.94:(night?.78:scene==='arcade'?.77:.9)}
  function mix(){
    if(theme)try{theme.volume=themeVolume()}catch{}
    if(!enabled||hidden||!ctx||ctx.state!=='running')return;
    const {scene,season,weather,time}=status, outside=out.has(scene),night=time>=1200||time<330;
    if(scene==='menu'){switchLoop(channels.music,themeFailed?'theme-mobile':null,.9);switchLoop(channels.place,null,0);switchLoop(channels.weather,null,0);return}
    let place=places[scene]||'village';
    if(night&&nature.has(scene))place='night';
    let sky=null;if(weather==='下雨')sky=outside?'rain':'roof-rain';else if(outside){if(weather==='下雪'||season===3)sky='wind';else if(season===2&&nature.has(scene))sky='leaves';else if(season===0&&nature.has(scene)&&!night)sky='spring'}
    const damp=weather==='下雨'&&outside?.52:1;
    switchLoop(channels.music,themeFailed?'theme-mobile':null,themeVolume());
    switchLoop(channels.place,place,(levels[place]||.5)*damp);
    switchLoop(channels.weather,sky,sky?levels[sky]*(weather==='下雨'?([1,.65,.94,1.32][status.rainStrength]||1):1):0);
  }
  function prepareTheme(){if(theme)return;theme=document.createElement('audio');theme.id='villageTheme';theme.loop=true;theme.preload='auto';theme.setAttribute('playsinline','');theme.setAttribute('webkit-playsinline','');theme.setAttribute('aria-hidden','true');theme.style.display='none';for(const [src,type] of [['assets/audio/theme.m4a?v=3','audio/mp4'],['assets/audio/theme-mobile.mp3?v=3','audio/mpeg']]){const s=document.createElement('source');s.src=src;s.type=type;theme.append(s)}document.body.append(theme);theme.addEventListener('playing',()=>{if(!enabled||hidden){theme.pause();return}themeStarted=true;themeFailed=false;paint();mix()});theme.addEventListener('pause',()=>{themeStarted=false;paint()});theme.addEventListener('error',()=>{themeFailed=true;themeStarted=false;paint();mix()})}
  function playTheme(){if(!enabled||hidden)return;prepareTheme();if(themeStarted&&!theme.paused)return;try{theme.muted=false;theme.volume=themeVolume();const result=theme.play();if(result&&typeof result.catch==='function')result.catch(e=>{if(!enabled||hidden)return;if(e?.name!=='NotAllowedError'&&e?.name!=='AbortError'){themeFailed=true;mix()}paint()})}catch{themeFailed=true;mix();paint()}}
  function ready(){if(!enabled||hidden)return;unlocked=true;playTheme();try{if(!ctx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;ctx=new AC();master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);noiseBuffer=ctx.createBuffer(1,Math.round(ctx.sampleRate*.25),ctx.sampleRate);const d=noiseBuffer.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;ctx.onstatechange=()=>{paint();if(ctx.state==='running'&&enabled&&!hidden){ramp(master.gain,.82,.3);mix()}}}
      const done=()=>{paint();if(enabled&&!hidden){ramp(master.gain,.82,.3);mix()}};if(ctx.state==='running')done();else ctx.resume().then(done).catch(()=>paint());
    }catch{paint()}}
  function stop(){if(theme){themeStarted=false;theme.pause()}if(!ctx){paint();return}ramp(master.gain,0,.18);for(const channel of Object.values(channels)){channel.want=null;channel.revision=(channel.revision||0)+1;retire(channel,.18)}setTimeout(()=>{if((!enabled||hidden)&&ctx.state==='running')ctx.suspend().catch(()=>{})},230);paint()}
  function toggle(){if(enabled&&!isPlaying()){ready();paint();return true}enabled=!enabled;try{localStorage.setItem(KEY,enabled?'on':'off')}catch{}if(enabled)ready();else stop();paint();return enabled}
  function setup(el){button=el;prepareTheme();paint();const onGesture=e=>{if(e.target.closest?.('#sound,[data-menu="music"]'))return;if(enabled)ready()};for(const type of ['click','pointerup','touchend','keydown'])document.addEventListener(type,onGesture,{passive:true,capture:true});document.addEventListener('visibilitychange',()=>{hidden=document.hidden;if(hidden)stop();else if(enabled&&unlocked)ready();paint()});window.addEventListener('pageshow',()=>{hidden=document.hidden;if(enabled&&unlocked&&!hidden)ready()});}
  function sync(scene,season,weather,time,rainStrength=0){const old=status;status={scene,season,weather,time,rainStrength};if(old.scene!==scene||old.season!==season||old.weather!==weather||old.rainStrength!==rainStrength||Math.floor(old.time/60)!==Math.floor(time/60))mix()}
  function tone(hz,duration,volume,offset=0,type='sine',end=hz){if(!enabled||hidden||ctx?.state!=='running')return;const t=ctx.currentTime+offset,o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(hz,t);o.frequency.exponentialRampToValueAtTime(Math.max(30,end),t+duration);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(volume,t+.013);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(master);o.start(t);o.stop(t+duration+.01);o.onended=()=>{o.disconnect();g.disconnect()}}
  function rustle(freq=900,amp=.028,duration=.15){if(!enabled||hidden||ctx?.state!=='running')return;const t=ctx.currentTime,s=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),g=ctx.createGain();s.buffer=noiseBuffer;filter.type='bandpass';filter.frequency.value=freq;g.gain.setValueAtTime(.001,t);g.gain.linearRampToValueAtTime(amp,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+duration);s.connect(filter);filter.connect(g);g.connect(master);s.start(t);s.stop(t+duration);s.onended=()=>{s.disconnect();filter.disconnect();g.disconnect()}}
  function effect(n=1){if(n>=4){tone(523,.18,.026);tone(659,.20,.025,.10);tone(n===5?1047:784,.31,.024,.22)}else if(n===3){tone(660,.16,.025);tone(990,.19,.018,.08)}else if(n===2){tone(392,.16,.022);tone(523,.17,.019,.08)}else tone(470,.11,.022,0,'sine',610)}
  function action(id){if(['well','garden','wash','washface','tea','skip'].includes(id)){rustle(2300,.044,.23);tone(380,.13,.017,0,'sine',660)}else if(/marble|pebbles|brick|tile/i.test(id)){tone(1260,.12,.021,0,'triangle',850);rustle(750,.018,.08)}else if(/counter|market|Seeds|Toys|Snacks/.test(id)){tone(1300,.22,.025);tone(1950,.18,.016,.075)}else if(id==='lesson'){tone(820,.34,.035);tone(1640,.27,.016)}else if(/feed|animalInfo/.test(id)){tone(780,.11,.023,0,'triangle',480);tone(740,.14,.018,.16,'triangle',420)}else if(/expTwig|sweep|expBug/.test(id)){rustle(3400,.042,.22)}else effect(1)}
  function walking(moving,scene){if(!moving||!ctx||ctx.state!=='running'||!enabled||hidden)return;const now=ctx.currentTime;if(now-lastStep<.40)return;lastStep=now;rustle(out.has(scene)?(status.season===2?1700:740):400,.016,.13);if(out.has(scene)&&status.season===2)rustle(3300,.012,.16)}
  return {setup,toggle,sync,effect,action,walking,unlock:ready,refresh:paint};
})();
