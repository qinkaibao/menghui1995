'use strict';

const $ = id => document.getElementById(id);
const STORE = 'menghui1995-xiaocun-v1'; // Existing players keep their saves.
const spot = (id,label,x,y,lx,ly,dest) => ({id,label,x,y,lx,ly,dest});
const scenes = {
  village:{name:'村口',subtitle:'夏日午后',art:'village',spots:[spot('yard','回家 · 院子',.174,.65,.17,.49,'courtyard'),spot('shop','小卖部',.817,.68,.83,.45,'shop'),spot('well','老井',.625,.65,.62,.47),spot('marbles','玩弹珠',.47,.81,.43,.65),spot('field','去田野',.468,.58,.47,.40,'field'),spot('market','去集市',.69,.76,.73,.64,'market'),spot('street','去镇上街道',.88,.87,.87,.80,'street'),spot('school','上学去',.42,.60,.35,.33,'school')]},
  courtyard:{name:'家里的院子',subtitle:'鸡鸣与炊烟',art:'courtyard',spots:[spot('kitchen','厨房',.20,.63,.20,.40,'home'),spot('living','堂屋',.40,.64,.40,.40,'living'),spot('bedroom','卧室',.68,.64,.68,.40,'bedroom'),spot('storage','储物间',.87,.70,.90,.43,'storage'),spot('feed','喂小鸡',.15,.77,.12,.62),spot('garden','给菜浇水',.83,.83,.81,.76),spot('farm','去菜园',.87,.85,.82,.58,'farm'),spot('coop','鸡鸭棚',.22,.76,.15,.30,'coop'),spot('sweep','扫院子',.48,.82,.44,.68),spot('clothes','收衣服',.72,.67,.76,.26),spot('bicycle','擦自行车',.56,.69,.55,.48),spot('expTile','院里旧屋瓦',.77,.76,.75,.56),spot('expBrick','找旧砖块',.30,.86,.29,.63),spot('expBuild','扩建家园',.52,.88,.53,.73),spot('village','出院门',.29,.90,.26,.82,'village')]},
  farm:{name:'菜园',subtitle:'种菜与收获',art:'farm',spots:[spot('expFarm','自由菜地',.68,.80,.66,.60),spot('farmInfo','管理菜地',.45,.82,.45,.79),spot('coop','去鸡鸭棚',.82,.78,.82,.75,'coop'),spot('exit','回院子',.14,.88,.12,.83,'courtyard')]},
  coop:{name:'鸡鸭棚',subtitle:'喂食与小伙伴',art:'coop',spots:[spot('animalInfo','照顾动物',.47,.84,.47,.78),spot('farm','去菜园',.82,.88,.83,.90,'farm'),spot('exit','回院子',.17,.88,.15,.85,'courtyard')]},
  market:{name:'集市',subtitle:'卖菜与水果面包',art:'market',spots:[spot('marketSell','摆摊卖菜',.22,.74,.20,.43),spot('marketBuy','水果和面包',.66,.72,.65,.46),spot('marketAnimals','鸡鸭与宠物',.87,.73,.84,.59),spot('expSeeds','买种子',.41,.80,.39,.60),spot('street','去镇上街道',.72,.87,.74,.83,'street'),spot('exit','回村口',.22,.90,.15,.85,'village')]},
  street:{name:'九十年代街道',subtitle:'县城小街与老店',art:'street',spots:[spot('arcade','游戏厅',.23,.72,.23,.40,'arcade'),spot('bowling','保龄球馆',.78,.73,.78,.41,'bowling'),spot('photoStudio','照相馆',.48,.69,.48,.47,'photoStudio'),spot('bikeRepair','自行车修理摊',.60,.82,.63,.68,'bikeRepair'),spot('townNews','今日街头故事',.41,.85,.42,.66),spot('funstreet','娱乐街',.89,.88,.88,.78,'funstreet'),spot('exit','回村口',.13,.90,.12,.83,'village')]},
  funstreet:{name:'娱乐小街',subtitle:'烤串、玩具与童年',art:'funstreet',spots:[spot('expToys','玩具商店',.22,.73,.20,.42,'toyShop'),spot('expSnacks','烤串小吃摊',.48,.73,.48,.42,'snackShop'),spot('expBrick','旧砖块',.65,.84,.65,.68),spot('grove','去小树林',.89,.86,.88,.79,'grove'),spot('exit','回县城街道',.11,.90,.12,.83,'street')]},
  toyShop:{name:'玩具商店',subtitle:'陀螺、弹珠与小玩具',art:'toy-shop',spots:[spot('expToys','挑选玩具',.64,.77,.64,.44),spot('exit','回娱乐小街',.17,.88,.15,.63,'funstreet')]},
  snackShop:{name:'烤串小吃店',subtitle:'香喷喷的童年小吃',art:'snack-shop',spots:[spot('expSnacks','购买小吃',.64,.76,.64,.46),spot('exit','回娱乐小街',.17,.88,.15,.63,'funstreet')]},
  photoStudio:{name:'老式照相馆',subtitle:'胶卷相机和纪念相片',art:'photo-studio',spots:[spot('photoStudio','拍纪念照',.64,.77,.64,.45),spot('exit','回县城街道',.17,.88,.15,.63,'street')]},
  bikeRepair:{name:'自行车修理店',subtitle:'老自行车与修车工具',art:'bike-repair',spots:[spot('bikeRepair','帮忙修车',.64,.77,.64,.45),spot('exit','回县城街道',.17,.88,.15,.63,'street')]},
  grove:{name:'小树林',subtitle:'昆虫与林间小径',art:'grove',spots:[spot('expBug','观察昆虫',.35,.76,.37,.54),spot('expTwig','捡落地树枝',.63,.83,.64,.64),spot('expPicnic','和伙伴野餐烧烤',.74,.84,.75,.66),spot('field','回田野',.12,.87,.12,.78,'field'),spot('funstreet','去娱乐街',.45,.90,.45,.84,'funstreet')]},
  picnic:{name:'小树林 · 林间空地',subtitle:'与小伙伴分享烧烤',art:'grove',spots:[spot('expPicnic','准备野餐和烧烤',.53,.79,.52,.50),spot('exit','回树林',.11,.90,.13,.82,'grove')]},
  arcade:{name:'游戏厅',subtitle:'投币街机与小伙伴',art:'arcade',spots:[spot('arcadeFight','拳王风格格斗',.22,.77,.22,.43),spot('arcadeIce','冰火小人 · 三关',.50,.77,.50,.44),spot('arcadeBricks','打砖块',.78,.77,.78,.44),spot('exit','回街道',.13,.90,.12,.83,'street')]},
  bowling:{name:'保龄球馆',subtitle:'三轮保龄球挑战',art:'bowling',spots:[spot('bowlingPlay','开始打保龄球',.53,.79,.53,.50),spot('exit','回街道',.15,.90,.14,.83,'street')]},
  home:{name:'厨房',subtitle:'妈妈的灶台',art:'home',spots:[spot('mom','妈妈',.425,.69,.43,.41),spot('expFood','向妈妈拿野餐食材',.34,.83,.33,.64),spot('meal','饭桌',.65,.85,.64,.63),spot('wash','洗碗',.25,.76,.30,.52),spot('vegetables','帮忙择菜',.20,.90,.12,.78),spot('tableware','摆好碗筷',.68,.79,.73,.49),spot('tv','黑白电视',.88,.85,.89,.37),spot('exit','回院子',.13,.84,.12,.47,'courtyard')]},
  living:{name:'堂屋',subtitle:'一家人的记忆',art:'living',spots:[spot('tv','黑白电视',.88,.75,.90,.37),spot('radio','听收音机',.76,.76,.78,.31),spot('photo','翻老相册',.51,.77,.51,.25),spot('tea','倒杯茶',.58,.89,.58,.51),spot('exit','回院子',.15,.82,.13,.48,'courtyard')]},
  bedroom:{name:'卧室',subtitle:'小小的秘密基地',art:'bedroom',spots:[spot('bed','叠被子',.76,.79,.75,.43),spot('sleep','睡觉',.84,.89,.86,.68),spot('study','看连环画',.38,.75,.36,.35),spot('treasure','打开木箱',.61,.82,.61,.52),spot('washface','洗脸',.48,.72,.49,.35),spot('schoolbag','整理书包',.27,.79,.26,.57),spot('exit','回院子',.15,.80,.12,.49,'courtyard')]},
  storage:{name:'储物间',subtitle:'粮食与宝贝',art:'storage',spots:[spot('grain','取玉米粒',.34,.78,.34,.43),spot('broom','拿扫帚',.71,.77,.72,.43),spot('can','拿浇水壶',.63,.83,.61,.55),spot('toy','找旧玩具',.86,.85,.85,.42),spot('expJar','拿观察罐',.47,.83,.45,.63),spot('expMatch','交火柴盒给大人',.79,.85,.79,.64),spot('exit','回院子',.13,.81,.12,.40,'courtyard')]},
  shop:{name:'小卖部',subtitle:'童年百宝箱',art:'shop',spots:[spot('counter','买零食',.64,.72,.67,.37),spot('exit','出门',.205,.72,.135,.44,'village')]},
  field:{name:'村外田野',subtitle:'麦香与蜻蜓',art:'field',spots:[spot('corn','拾玉米粒',.52,.65,.51,.43),spot('scarecrow','看稻草人',.23,.69,.17,.40),spot('dragonfly','观察蜻蜓',.24,.83,.23,.64),spot('expBrick','拾旧砖块',.64,.85,.63,.67),spot('grove','去小树林',.89,.88,.88,.78,'grove'),spot('river','去小河边',.80,.68,.85,.40,'river'),spot('exit','回村口',.40,.87,.36,.78,'village')]},
  river:{name:'小河边',subtitle:'柳荫与流水',art:'river',spots:[spot('fish','观察小鱼',.57,.83,.66,.49),spot('pebbles','捡漂亮石头',.34,.75,.34,.55),spot('skip','打水漂',.70,.90,.77,.73),spot('expBrick','拾旧砖块',.13,.87,.13,.72),spot('exit','回田野',.23,.69,.24,.39,'field')]},
  school:{name:'村小学',subtitle:'书声与铃声',art:'school',spots:[spot('classroom','进教室',.53,.66,.53,.44,'classroom'),spot('artroom','去美术室',.89,.68,.94,.42,'artroom'),spot('playground','去操场',.72,.79,.71,.57,'playground'),spot('schedule','看课表',.30,.68,.30,.42),spot('lesson','午饭与集合',.47,.81,.46,.65),spot('exit','放学回村',.15,.69,.15,.43,'village')]},
  classroom:{name:'教室',subtitle:'老师和同学们',art:'classroom',spots:[spot('lesson','开始上课',.52,.67,.55,.31),spot('schedule','看今天的课表',.47,.81,.47,.55),spot('exit','回校园',.30,.82,.10,.42,'school')]},
  playground:{name:'操场',subtitle:'一起运动',art:'playground',spots:[spot('lesson','大课间／体育课',.54,.71,.54,.44),spot('schedule','看课表',.37,.82,.34,.63),spot('exit','回校园',.18,.86,.18,.46,'school')]},
  artroom:{name:'美术室',subtitle:'画出自己的童年',art:'artroom',spots:[spot('lesson','开始画画',.57,.73,.57,.42),spot('schedule','看课表',.38,.82,.38,.51),spot('exit','回校园',.15,.84,.12,.45,'school')]}
};
const objectSpot=(id,label,icon,x,y,lx,ly,dest)=>({...spot(id,label,x,y,lx,ly,dest),icon});
scenes.bathroom={name:'卧室 · 小浴室',subtitle:'点选浴缸、毛巾、洗脸盆等物品',art:'bathroom',spots:[objectSpot('bathShower','浴缸 · 洗澡','🛁',.82,.78,.83,.41),objectSpot('bathHand','洗脸盆','🚰',.30,.76,.32,.41),objectSpot('bathHair','洗头发','🫧',.43,.80,.43,.54),objectSpot('bathTowel','毛巾','🧺',.55,.83,.42,.24),objectSpot('bathLaundry','水桶 · 洗衣服','🪣',.65,.82,.60,.58),objectSpot('bathMirror','照镜子','🪞',.28,.75,.30,.16),objectSpot('bathBrush','刷牙','🪥',.23,.74,.19,.22),objectSpot('bathSoap','肥皂','🧼',.23,.79,.22,.37),objectSpot('bathUmbrella','拿雨伞','☂',.20,.82,.15,.63),objectSpot('exit','回我的卧室','🚪',.13,.88,.10,.43,'bedroom')]};
scenes.courtyard.spots.push(objectSpot('bathroom','卧室浴室','🛁',.78,.74,.91,.53,'bathroom'));
scenes.bedroom.art='bedroom-bathroom';scenes.bedroom.subtitle='小小的秘密基地 · 带独立浴室';
Object.assign(scenes.bedroom.spots.find(p=>p.id==='treasure'),{x:.84,y:.82,lx:.84,ly:.54});
scenes.bedroom.spots.unshift(objectSpot('bathroom','进入浴室','🚪',.62,.70,.61,.30,'bathroom'));
const goods = [['食盐','🧂',30,'妈妈做饭要用'],['冰袋','🧊',10,'透心凉的夏天'],['酸梅粉','🍋',10,'酸酸甜甜'],['泡泡糖','🍬',10,'吹一个大泡泡'],['无花果丝','🥡',20,'一小袋慢慢吃'],['橘子汽水','🍊',30,'玻璃瓶，咕噜咕噜'],['干脆面','🍜',50,'捏碎了更香'],['糖果','🍭',10,'玻璃罐里挑一颗'],['玻璃弹珠','🔮',10,'亮晶晶的小宝贝'],['鸡毛毽子','🪶',20,'踢一踢，不舍得丢'],...EXTRA_SNACKS];
const memories = [
  ['家门口','砖瓦房和院子，妈妈的声音从屋里传出来。','village'],['老井','一桶井水，带着夏天的清凉。','village'],['小卖部','玻璃罐里的糖和五颜六色的零食。','shop'],['弹珠','蹲在土路上，把玻璃弹珠弹进小坑。','marbles'],['田野','风吹过庄稼，蝉鸣声从远处传来。','field'],['黑白电视','一台小电视，全家人挤在一起看。','tv'],['回家吃饭','再香的零食，也比不上妈妈的一碗饭。','meal'],['小院','鸡鸣、菜园和妈妈晾的衣服。','courtyard'],['卧室','被子和木箱里藏着童年的秘密。','bedroom'],['堂屋','收音机、茶杯、老相册，一家人的记忆。','living'],['储物间','一袋袋玉米和旧玩具。','storage'],['小河','柳树下的流水与小鱼。','river'],['上学','背着书包走过土路，和老师同学一起学习。','school'],['教室','木课桌和绿黑板，老师在讲课。','classroom'],['美术作品','亲手画出童年的小村庄。','artroom'],['操场','大课间和体育课的快乐。','playground'],['菜园','自己种下种子，又收获了新鲜蔬菜。','farm'],['赶集','提着菜篮去集市换来零花钱。','market'],['小伙伴','小猫小狗和鸡鸭陪伴着我。','coop'],['游戏厅','一枚游戏纪念币，和小伙伴玩街机。','arcade'],['保龄球馆','球滚向球瓶，叮叮当当。','bowling'],['童年伙伴','放学后的小伙伴，笑声留在村里。','street'],['九十年代的故事','露天电影、铁环、邮递员和评书。','street'],['娱乐小街','烤串、玩具与童年的街巷。','funstreet'],['树林探险','观察蝴蝶与小昆虫，留下昆虫图鉴。','grove'],['树林野餐','和小伙伴分享一顿美味野餐。','picnic'],['成长中的家','通过努力装点自己的家园。','bedroom']
];
memories.push(['家里的浴室','搪瓷盆、毛巾和暖暖的水，洗完澡干干爽爽。','bathroom'],['雨天的水花','雨点落在土路上，浅浅的水洼溅起水花。','courtyard']);
const dailyTasks = [
  {id:'bathHand',title:'洗手洗脸',place:'bathroom',hint:'去浴室洗洗手和脸。'},
  {id:'grain',title:'取一把玉米粒',place:'storage',hint:'到储物间找粮袋，准备给小鸡喂食。'},
  {id:'feed',title:'给小鸡喂食',place:'courtyard',hint:'把玉米粒撒给院子里的小鸡。'},
  {id:'broom',title:'找到扫帚',place:'storage',hint:'从储物间拿一把扫帚。'},
  {id:'sweep',title:'把院子扫干净',place:'courtyard',hint:'拿扫帚，把土路边的落叶扫走。'},
  {id:'can',title:'找到浇水壶',place:'storage',hint:'在储物间找到浇水工具。'},
  {id:'garden',title:'给菜园浇水',place:'courtyard',hint:'拿着浇水壶，照顾番茄和白菜。'},
  {id:'pick',title:'摘些熟番茄',place:'courtyard',hint:'给家里存一点新鲜蔬菜。'},
  {id:'clothes',title:'收好晾干的衣服',place:'courtyard',hint:'屋檐外的晾衣绳上有干衣服。'},
  {id:'bicycle',title:'擦干净老自行车',place:'courtyard',hint:'把自行车座和车把擦干净。'},
  {id:'bed',title:'整理自己的床铺',place:'bedroom',hint:'拉平床单，把被子叠整齐。'},
  {id:'study',title:'读三页连环画',place:'bedroom',hint:'在小书桌旁读一会儿。'},
  {id:'treasure',title:'翻开童年木箱',place:'bedroom',hint:'看看小时候收藏的小宝贝。'},
  {id:'washface',title:'用搪瓷盆洗脸',place:'bedroom',hint:'擦掉脸上的汗和灰尘。'},
  {id:'schoolbag',title:'整理小书包',place:'bedroom',hint:'把课本和铅笔收进书包。'},
  {id:'wash',title:'帮妈妈洗碗',place:'home',hint:'把搪瓷碗擦洗干净。'},
  {id:'vegetables',title:'帮妈妈择菜',place:'home',hint:'把菜篮子里的蔬菜整理好。'},
  {id:'tableware',title:'摆好饭桌上的碗筷',place:'home',hint:'准备三个碗和筷子。'},
  {id:'tea',title:'给家人倒一杯茶',place:'living',hint:'堂屋有暖水瓶和搪瓷杯。'},
  {id:'radio',title:'听一会儿收音机',place:'living',hint:'转一下收音机的旋钮。'},
  {id:'photo',title:'翻看老相册',place:'living',hint:'看一看从前的照片。'},
  {id:'tv',title:'看看黑白电视',place:'living',hint:'打开老电视，看一会儿动画。'},
  {id:'toy',title:'找到一个旧玩具',place:'storage',hint:'在储物间的木箱里找找。'},
  {id:'corn',title:'拾一些玉米粒',place:'field',hint:'沿着田埂走到庄稼旁。'},
  {id:'scarecrow',title:'看看稻草人',place:'field',hint:'到麦田边观察它的草帽。'},
  {id:'dragonfly',title:'观察三只蜻蜓',place:'field',hint:'不要捉伤它们，安静观察。'},
  {id:'fish',title:'数数河里的小鱼',place:'river',hint:'在岸边观察，不下河。'},
  {id:'pebbles',title:'捡一颗漂亮石头',place:'river',hint:'在岸边的石子堆寻找。'},
  {id:'skip',title:'打三次水漂',place:'river',hint:'站在岸上，用小石子打水漂。'},
  {id:'marbles',title:'玩一局玻璃弹珠',place:'village',hint:'到村口土路上玩三次。'}
];
const initial=()=>({scene:'village',x:.5,y:.83,dir:'down',money:150,time:420,day:1,intro:false,salt:false,water:false,helped:false,dinner:false,items:{'玻璃弹珠':3},memories:[],marbleBest:0,daily:{},totalTasks:0,school:{day:1,attended:false,done:{},scores:{}}});
function normalizeSave(s){const defaults=initial(),obj=v=>v&&typeof v==='object'&&!Array.isArray(v);const n={...defaults,...(obj(s)?s:{})};if(!Object.hasOwn(scenes,n.scene))n.scene=defaults.scene;if(n.scene==='picnic')n.scene='grove';for(const k of ['money','x','y','time','day','totalTasks','marbleBest'])if(!Number.isFinite(n[k]))n[k]=defaults[k];n.day=Math.max(1,Math.min(50000,Math.floor(n.day)));n.time=Math.max(0,Math.min(1439,Math.floor(n.time)));n.x=Math.max(.09,Math.min(.91,n.x));n.y=Math.max(.57,Math.min(.94,n.y));if(!['down','up','left','right'].includes(n.dir))n.dir='down';for(const k of ['daily','items','school','farm','town','expedition','rainLife'])if(!obj(n[k]))n[k]=k==='daily'||k==='items'?{}:undefined;n.memories=Array.isArray(n.memories)?n.memories.filter(v=>typeof v==='string'):[];n.avatar=Wardrobe.normal(n.avatar);return n}
let S=initial();try{const old=JSON.parse(localStorage.getItem(STORE));if(old&&Object.hasOwn(scenes,old.scene)&&Number.isFinite(old.money))S=normalizeSave(old)}catch{}
// The picnic is now an activity in the ordinary grove; older saves still load.
if(S.scene==='picnic')S.scene='grove';
let target=null,arrive=null,routeGoal=null,modalType='',last=performance.now(),animClock=0,clockAcc=0,frame=0,toastTimer=0,marble=null,work=null,tvOn=true,menuOpen=true,crossing=null;
let keys=new Set(),pointerDirs=new Map(),touchDirs=new Map();
let spriteKey='';const preloaded=[];
let stageW=0,stageH=0,viewW=0,viewH=0,camX=0,camY=0,camTargetX=0,camTargetY=0,tapStart=null;
const ART_RATIO=1672/941;
const bound=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
function placeCamera(snap=false,dt=.016){
  if(!stageW||!stageH)return;
  const maxX=Math.max(0,stageW-viewW),maxY=Math.max(0,stageH-viewH),px=S.x*stageW,py=S.y*stageH;
  if(snap){camTargetX=bound(px-viewW*.5,0,maxX);camTargetY=bound(py-viewH*.72,0,maxY);camX=camTargetX;camY=camTargetY;}
  else{
    // A wide dead zone keeps the scene still for small steps. Only pan near an edge.
    const sx=px-camTargetX,sy=py-camTargetY;
    if(sx<viewW*.29)camTargetX=bound(px-viewW*.29,0,maxX);
    else if(sx>viewW*.71)camTargetX=bound(px-viewW*.71,0,maxX);
    if(sy<viewH*.35)camTargetY=bound(py-viewH*.35,0,maxY);
    else if(sy>viewH*.83)camTargetY=bound(py-viewH*.83,0,maxY);
    const k=1-Math.exp(-dt*10);camX+=(camTargetX-camX)*k;camY+=(camTargetY-camY)*k;
    if(Math.abs(camX-camTargetX)<.25)camX=camTargetX;if(Math.abs(camY-camTargetY)<.25)camY=camTargetY;
  }
  $('stage').style.transform=`translate3d(${-camX.toFixed(2)}px,${-camY.toFixed(2)}px,0)`;
}
function fitStage(force=false){const w=$('world').clientWidth,h=$('world').clientHeight;if(!w||!h)return;const snap=force===true||!stageW||Math.abs(w-viewW)>90||Math.abs(h-viewH)>90;if(!snap&&Math.abs(w-viewW)<=1&&Math.abs(h-viewH)<=1)return;const oldW=stageW,oldH=stageH;viewW=w;viewH=h;const scale=Math.max(w/1672,h/941);stageW=1672*scale;stageH=941*scale;$('stage').style.width=stageW+'px';$('stage').style.height=stageH+'px';if(snap)placeCamera(true);else{camX=bound(camX*stageW/oldW,0,Math.max(0,stageW-viewW));camY=bound(camY*stageH/oldH,0,Math.max(0,stageH-viewH));camTargetX=camX;camTargetY=camY;placeCamera(false,0)}}
function save(){try{localStorage.setItem(STORE,JSON.stringify(S))}catch{}}
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2200)}
function fx(n=1){VillageAudio.effect(n)}
function toggleSound(){toast(VillageAudio.toggle()?'背景音乐与环境声音已开启':'声音已关闭')}
function remember(n){if(!S.memories.includes(n)){S.memories.push(n);save();toast('📖 收集到童年记忆：'+n);fx(5)}}
function add(name,n=1){S.items[name]=(S.items[name]||0)+n;save()}
function remove(name,n=1){if(S.items[name]){S.items[name]-=n;if(S.items[name]<=0)delete S.items[name];if(S.farm?.homegrown?.[name])S.farm.homegrown[name]=Math.max(0,S.farm.homegrown[name]-n)}save()}
function has(item){return (S.items[item]||0)>0}
function moneyText(c){return '¥'+(c/100).toFixed(2)}
function timeText(){const h=Math.floor(S.time/60)%24,m=Math.floor(S.time%60);return `${dateLabel()} · ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`}
function resetDaily(){S.daily={};S.school={day:S.day,attended:false,done:{},scores:{}};S.intro=false;S.salt=has('食盐');S.water=has('井水');S.helped=false;S.dinner=false;}
function advance(n=1){S.time+=n;while(S.time>=1440){S.time-=1440;S.day++;resetDaily()}hud()}
function nextMorning(){const old=gradeInfo().name;S.day++;S.time=7*60;resetDaily();S.money+=50;S.scene='bedroom';S.x=.60;S.y=.86;S.dir='down';closeModal();renderScene();save();const now=gradeInfo().name;toast(old!==now?'恭喜你！今天升入'+now+'！':'早上好！新的一天开始了，口袋里多了五角零花钱。')}
function dailyCount(){return dailyTasks.filter(t=>S.daily[t.id]).length}
function complete(id,mins=5){const fresh=!S.daily[id];if(fresh){S.daily[id]=true;if(dailyTasks.some(t=>t.id===id))S.totalTasks++;fx(4)}advance(mins);renderSpotState();return fresh}
function objective(){
  if(routeGoal&&routeGoal!==S.scene)return '正在前往：'+scenes[routeGoal].name;
  const schoolGoal=schoolObjective();if(schoolGoal&&(!farmSellAllowed()||SCHOOL_SCENES.has(S.scene)))return schoolGoal;
  const farmGoal=farmObjective();if(farmGoal)return farmGoal;
  if(schoolGoal&&S.time<900)return schoolGoal;
  if(!S.intro)return S.scene==='home'?'和妈妈说说话，接下今天的事情。':S.scene==='courtyard'?'进厨房，妈妈在里面等你。':'先回家看看，妈妈在等你。';
  if(!S.salt)return '去小卖部给妈妈买一包盐。';if(!S.water)return '顺路去老井打点水。';if(!S.helped)return '带着盐和井水，回家找妈妈。';if(!S.dinner)return '妈妈喊你吃饭啦，去厨房饭桌旁坐下。';
  const own=dailyTasks.find(t=>t.place===S.scene&&!S.daily[t.id]);const next=own||dailyTasks.find(t=>!S.daily[t.id]);return next?`今日待办：${next.title} · ${scenes[next.place].name}`:'今天的事都做完了，可以回卧室睡觉，迎接明天！';
}
function hud(){syncSchoolStage();
  $('clock').textContent='◷ '+timeText();$('money').textContent=moneyText(S.money);$('quest').textContent=objective();$('location').textContent=scenes[S.scene].name+' · '+scenes[S.scene].subtitle;
  $('journal').textContent='📖 '+S.memories.length+'/'+memories.length;$('taskList').textContent='📋 '+dailyCount()+'/'+dailyTasks.length;schoolHUD();farmRender();townHud();expHud();
  const h=S.time/60;let tint='transparent';if(h>=20||h<5)tint='rgba(27,34,66,.43)';else if(h>=18)tint='rgba(120,64,17,.17)';else if(h<7)tint='rgba(111,103,65,.13)';$('world').style.setProperty('--sky-tint',tint);VillageAudio.sync(menuOpen?'menu':S.scene,townSeason(),townWeather(),S.time,rainStrength());save();
}
function clampPoint(x,y){x=Number.isFinite(x)?x:.5;y=Number.isFinite(y)?y:.84;x=Math.max(.09,Math.min(.91,x));let low=.64;
  if(S.scene==='village'){low=.665-.12*Math.max(0,1-Math.abs(x-.47)*5.2);if(x<.25||x>.77)low=.64}
  else if(S.scene==='home')low=.68;else if(S.scene==='field')low=.59;else if(S.scene==='river')low=Math.max(.61,.53+x*.34);else if(S.scene==='courtyard')low=.63;else if(S.scene==='school')low=.62;else if(S.scene==='playground')low=.57;else if(S.scene==='classroom'){low=.66;x=bound(x,.32,.69)}else low=.68;
  return{x,y:Math.max(low,Math.min(.94,y))};
}
function spots(){return scenes[S.scene].spots}
function distance(p){return Math.hypot((p.x-S.x)*1.12,p.y-S.y)}
function near(){return spots().filter(p=>distance(clampPoint(p.x,p.y))<.112).sort((a,b)=>distance(a)-distance(b))[0]}
function renderSpotState(){const n=near();for(const group of [$('hotspots'),$('quickspots')])for(const b of group.children){b.classList.toggle('active',!!n&&b.dataset.spot===n.id);b.classList.toggle('done',!!S.daily[b.dataset.spot]);b.classList.toggle('route',!!routeGoal&&b.dataset.spot===arrive)}}
function renderPlayer(moving=false){
  const p=$('player');p.dataset.dir=S.dir||'down';p.style.left=(S.x*100).toFixed(3)+'%';p.style.top=(S.y*100).toFixed(3)+'%';p.style.height=(22.5+(S.y-.72)*6).toFixed(2)+'%';
  const nframe=moving?Wardrobe.walkFrame(animClock):0;const path=`${S.dir||'down'}-${nframe}`;
  const dressedKey=JSON.stringify(Wardrobe.normal(S.avatar))+'|'+path;if(dressedKey!==spriteKey){spriteKey=dressedKey;Wardrobe.paint($('playerSprite'),S.avatar,S.dir||'down',nframe)}
  $('shadow').style.left=p.style.left;$('shadow').style.top=p.style.top;const n=near();$('interact').classList.toggle('nearby',!!n);if($('nearLabel').textContent!==(n?n.label:'靠近物品'))$('nearLabel').textContent=n?n.label:'靠近物品';renderSpotState();
}
function spotContents(el,p){if(!p.icon){el.textContent=p.label;return}el.classList.add('object-spot');const icon=document.createElement('span');icon.className='object-icon';icon.textContent=p.icon;icon.setAttribute('aria-hidden','true');const name=document.createElement('span');name.className='object-caption';name.textContent=p.label;el.append(icon,name)}
function renderScene(){syncSchoolStage();const sc=scenes[S.scene];const url='assets/'+sc.art+'.webp';if($('scene').getAttribute('src')!==url)$('scene').src=url;$('scene').alt=sc.name+'，'+sc.subtitle;$('scene').classList.remove('scene-fade');void $('scene').offsetWidth;$('scene').classList.add('scene-fade');$('hotspots').replaceChildren();$('quickspots').replaceChildren();for(const p of sc.spots){const b=document.createElement('button');b.className='hotspot';spotContents(b,p);b.dataset.spot=p.id;b.style.left=p.lx*100+'%';b.style.top=p.ly*100+'%';b.setAttribute('aria-label',p.label);b.onclick=e=>{e.stopPropagation();routeGoal=null;cancelSchoolJourney();goSpot(p)};$('hotspots').append(b);const q=document.createElement('button');q.className='quickspot';spotContents(q,p);q.dataset.spot=p.id;q.setAttribute('aria-label','前往'+p.label);q.onclick=()=>{routeGoal=null;cancelSchoolJourney();goSpot(p)};$('quickspots').append(q)}$('quickspots').scrollLeft=0;fitStage(true);renderPlayer();hud();farmRender(true);townRender(true);expRender(true);renderNature();renderRainLife(true);prefetchNearby()}
function showTarget(p){const m=$('tapmark');m.style.left=(p.x*100)+'%';m.style.top=(p.y*100)+'%';m.style.display='block'}function hideTarget(){$('tapmark').style.display='none'}
function goSpot(p){if(modalType||crossing||sleeping||menuOpen)return;clearMovement();if(p.dest)prepareSceneImage(p.dest);target=clampPoint(p.x,p.y);arrive=p.id;showTarget(target);if(distance(target)<.006){const id=arrive;target=null;arrive=null;hideTarget();act(id)}}
function clearMovement(){keys.clear();pointerDirs.clear();touchDirs.clear();resetJoy();for(const b of document.querySelectorAll('[data-dir]'))b.classList.remove('pressed')}
const arrivalPositions={village:[.5,.84],courtyard:[.30,.88],home:[.26,.88],living:[.22,.88],get bedroom(){return crossing?.from==='bathroom'?[.62,.75]:[.25,.88]},bathroom:[.20,.86],storage:[.24,.88],shop:[.30,.85],field:[.40,.88],river:[.28,.82],school:[.34,.83],classroom:[.48,.88],playground:[.25,.86],artroom:[.30,.86],farm:[.35,.87],coop:[.36,.87],market:[.48,.90],street:[.37,.87],arcade:[.48,.89],bowling:[.36,.89],funstreet:[.25,.88],grove:[.27,.87],picnic:[.28,.88]};
function nextHop(from,to){if(from===to)return null;const seen=new Set([from]),queue=[[from,null]];while(queue.length){const [here,first]=queue.shift();for(const p of scenes[here].spots){if(!p.dest||seen.has(p.dest))continue;const entry=first||p;if(p.dest===to)return entry;seen.add(p.dest);queue.push([p.dest,entry])}}return null}
function routeTo(goal){if(!scenes[goal]||crossing)return;if(goal===S.scene){toast('你已经在这里啦');return}routeGoal=goal;const step=nextHop(S.scene,goal);if(step){hud();goSpot(step)}else routeGoal=null;}
function showTravelCurtain(dest){const el=$('travelCurtain'),label=document.createElement('span'),cancel=document.createElement('button');label.textContent='正在前往'+scenes[dest].name+'…';cancel.textContent='取消 · 继续游戏';cancel.type='button';cancel.className='paper-btn travel-cancel';cancel.onclick=()=>recoverTravel('已取消前往，继续游戏。');el.replaceChildren(label,cancel)}
function recoverTravel(message){const c=crossing;if(c)clearTimeout(c.timer);crossing=null;target=null;arrive=null;routeGoal=null;tapStart=null;cancelSchoolJourney();clearMovement();hideTarget();$('app').classList.remove('traveling','traveling-out');$('travelCurtain').replaceChildren();if(c&&c.phase!=='out'&&c.end)Object.assign(S,c.end);try{renderScene();save()}catch(e){console.warn('Scene recovery:',e)}toast(message||'已恢复游戏操作。')}
function walkDirection(dx,dy,old='down'){const ax=Math.abs(dx),ay=Math.abs(dy);if(ax+ay<.00001)return old;if(ax>ay*1.18)return dx>0?'right':'left';if(ay>ax*1.18)return dy>0?'down':'up';return old==='left'||old==='right'?(dx>0?'right':'left'):(dy>0?'down':'up')}
function switchScene(dest,edge=0){if(crossing||!scenes[dest]||dest===S.scene)return;target=null;arrive=null;tapStart=null;hideTarget();clearMovement();crossing={dest,from:S.scene,edge,phase:'out',elapsed:0,started:performance.now(),asset:prepareSceneImage(dest)};$('app').classList.add('traveling','traveling-out');showTravelCurtain(dest);const current=crossing;current.timer=setTimeout(()=>{if(crossing===current)recoverTravel('场景等待过久，已恢复操作。请再点一次。')},8500);renderPlayer(false)}
function advanceCrossing(dt){const c=crossing;if(!c)return;c.elapsed+=dt;if(c.phase==='out'){if(c.elapsed<.19||c.asset.status==='loading')return;if(c.asset.status==='failed'){recoverTravel('场景图片加载失败，请再试一次。');return}S.scene=c.dest;let a=arrivalPositions[c.dest]||[.25,.88];if(c.dest==='village'&&c.from==='shop')a=[.79,.76];if(c.dest==='village'&&c.from==='courtyard')a=[.20,.76];if(c.dest==='funstreet'&&c.from==='toyShop')a=[.24,.76];if(c.dest==='funstreet'&&c.from==='snackShop')a=[.49,.76];if(c.dest==='street'&&c.from==='photoStudio')a=[.48,.75];if(c.dest==='street'&&c.from==='bikeRepair')a=[.60,.82];if(c.edge)a=[c.edge>0?.17:.83,.86];c.end=clampPoint(...a);const spawn=c.edge?clampPoint(c.edge>0?.09:.91,.86):clampPoint(c.end.x,Math.min(.94,c.end.y+.075));if(Math.hypot(c.end.x-spawn.x,c.end.y-spawn.y)<.025)Object.assign(spawn,clampPoint(c.end.x+(c.end.x>.5?-.075:.075),c.end.y));c.begin={...spawn};Object.assign(S,spawn);S.dir=walkDirection(c.end.x-spawn.x,c.end.y-spawn.y,S.dir);animClock=0;c.phase='reveal';c.elapsed=0;const remembered={courtyard:'小院',home:'家门口',living:'堂屋',bedroom:'卧室',storage:'储物间',shop:'小卖部',field:'田野',river:'小河',school:'上学',classroom:'教室',playground:'操场'}[c.dest];if(remembered)remember(remembered);advance(2);const old=$('scene'),prepared=c.asset.image;prepared.id='scene';prepared.className=old.className;prepared.draggable=false;old.replaceWith(prepared);sceneImages.delete(c.asset.url);renderScene();return}
  if(c.phase==='reveal'){if(c.elapsed<.055)return;c.phase='in';c.elapsed=0;$('app').classList.remove('traveling-out');fx(2);return}
  const t=Math.min(1,c.elapsed/.58),e=t*t*(3-2*t);Object.assign(S,clampPoint(c.begin.x+(c.end.x-c.begin.x)*e,c.begin.y+(c.end.y-c.begin.y)*e));animClock+=dt;renderPlayer(t<1);VillageAudio.walking(t<1,S.scene);townTick(dt);placeCamera(false,dt);if(t<1)return;clearTimeout(c.timer);crossing=null;$('travelCurtain').textContent='';$('app').classList.remove('traveling');animClock=0;save();if(routeGoal){if(routeGoal===c.dest){routeGoal=null;hud();toast('到达'+scenes[c.dest].name)}else{const n=nextHop(c.dest,routeGoal);if(n)goSpot(n);else routeGoal=null}}schoolArrive(c.dest)}
function openModal(type,title,html){modalType=type;routeGoal=null;target=null;arrive=null;hideTarget();clearMovement();renderPlayer(false);$('overlay').hidden=false;$('modal').dataset.kind=type;$('modal').innerHTML=`<div class="modal-head"><h2 id="modalTitle">${title}</h2><button class="close" data-act="close" aria-label="关闭">×</button></div>${html}`;$('modal').scrollTop=0}
function closeModal(){modalType='';work=null;marble=null;$('overlay').hidden=true;hud()}
function buttons(...a){return '<div class="row">'+a.map(([id,label,secondary])=>`<button class="paper-btn ${secondary?'secondary':''}" data-act="${id}">${label}</button>`).join('')+'</div>'}
function picture(art,alt='',full=false){return `<img class="scene-card ${full?'full':''}" src="assets/${art}.webp" alt="${alt||art}" draggable="false">`}
const detailIds=new Set(['well','mom','wash','feed','garden','pick','sweep','grain','broom','can','toy','bed','study','treasure','radio','photo','tea','corn','scarecrow','dragonfly','fish','pebbles','skip','clothes','bicycle','washface','schoolbag','vegetables','tableware']);
function detailArt(id,art){return detailIds.has(id)?'closeups/'+id:art}
function dialogue(title,text,actions,art=scenes[S.scene].art){const closeup=title==='妈妈'?'closeups/mom':title.includes('老井')?'closeups/well':title.includes('睡个好觉')?'closeups/bed':art;openModal('dialogue',title,picture(closeup,title)+'<p>'+text+'</p>'+buttons(...actions,...(title==='妈妈'?[['chatMom','和妈妈说说话',true]]:[])))}
function visualWork(id,title,text,stepLabel,art,steps=3,after=null,emoji='✨',doneText='完成啦！'){
  const already=!!S.daily[id];openModal('work',title,`<div class="work-photo" id="workPhoto">${picture(detailArt(id,art),title)}</div><p>${text}</p><div class="work-progress"><span id="workFill"></span></div><div class="work-status" id="workStatus">${already?'今天已经做过了，也可以再做一次。':`准备好了 · 0 / ${steps}`}</div>`+buttons(['step',stepLabel],['close','先出去',true]));
  work={id,count:0,steps,after,emoji,stepLabel,doneText};
}
function workStep(){if(!work||work.count>=work.steps)return;work.count++;const p=document.createElement('span');p.className='action-pop';p.textContent=work.emoji;$('workPhoto').append(p);setTimeout(()=>p.remove(),650);$('workFill').style.width=work.count/work.steps*100+'%';$('workStatus').textContent=`正在做 · ${work.count} / ${work.steps}`;fx(1+work.count);
  if(work.count===work.steps){const current=work;current.after?.();complete(current.id,3+current.steps);$('workStatus').textContent=current.doneText+' ✓';$('workStatus').classList.add('work-done');const b=$('modal').querySelector('[data-act="step"]');b.dataset.act='close';b.textContent='完成，继续走走';toast('完成：'+(dailyTasks.find(t=>t.id===current.id)?.title||(current.id==='well'?'打井水':current.doneText)));}
}
function needTool(item,where,name,art){dialogue(name,`还没有${item}。先去${where}找找，再回来就能做这件事啦。`,[['close','好，去找找']],art)}
function grab(id,item,where,art){visualWork(id,'找到'+item,`这里放着老式${item}，拿起来就可以带去院子使用。`,'拿起来',art,1,()=>{if(!has(item))add(item)},'✓','已经放进小口袋。')}
function act(id){if(modalType||crossing)return;const p=spots().find(s=>s.id===id);if(p?.dest){switchScene(p.dest);return}VillageAudio.action(id);routeGoal=null;advance(1);if(rainPlaceAct(id)||expPlaceAct(id)||townPlaceAct(id))return;
  switch(id){
  case 'farmInfo':openFarm();break;
  case 'animalInfo':openCoop();break;
  case 'marketSell':openMarket('sell');break;
  case 'marketBuy':openMarket('buy');break;
  case 'marketAnimals':openMarket('animals');break;
  case 'schedule':openSchoolTimetable();break;
  case 'lesson':schoolLessonAtScene();break;
  case 'mom': if(!S.intro)dialogue('妈妈',`“回来啦？跑得满头汗，先擦擦脸。妈妈今天做${MEALS[townMeal().ix]}呢！拿这五角钱去小卖部买包盐，再到井边打点水吧。”`,[['accept','好，妈妈！']],'home');
    else if(!S.salt||!S.water)dialogue('妈妈','“别玩得忘了啊，盐和井水都带回来。院子和屋里还有好多事情可以做呢。”',[['close','知道了']],'home');
    else if(!S.helped)dialogue('妈妈','“还把水打回来了！真懂事。洗洗手，饭马上就好。”',[['give','把盐和井水交给妈妈']],'home');
    else if(has('番茄'))dialogue('妈妈','“你把菜园的番茄也摘回来啦？快放在厨房吧。”',[['deliver','把番茄给妈妈'],['close','一会儿再来',true]],'meal');
    else dialogue('妈妈',S.dinner?'“吃饱了就去玩吧，也可以帮忙洗碗、喂鸡和整理自己的房间。”':'“快来坐下，面条盛好了，趁热吃！”',[['close','好！']],'home');break;
  case 'well': if(S.water)dialogue('老井','井水已经打好了。井台有点凉，夏日喝水很舒服。',[['close','继续走走']],'village');else visualWork('well','村里的老井','拉动粗麻绳，木轮咯吱咯吱响，把井水打上来。','摇动井绳','village',3,()=>{S.water=true;add('井水');remember('老井')},'💧','一桶清凉井水打好了！');break;
  case 'counter':openShop();break;
  case 'meal':mealOpen();break;
  case 'wash':visualWork('wash','帮妈妈洗碗','把搪瓷碗冲洗干净，再放回柜子。','洗一个碗','home',3,null,'🫧','三只碗洗得干干净净！');break;
  case 'vegetables':visualWork('vegetables','帮妈妈择菜','把菜篮里的菜叶理干净，摘掉老叶，再放进盆里。','择一把菜','home',3,null,'🥬','菜都收拾好啦！');break;
  case 'tableware':visualWork('tableware','给一家人摆好碗筷','把搪瓷碗和筷子整整齐齐摆在饭桌上。','摆一副碗筷','home',3,null,'🥣','饭桌准备好了。');break;
  case 'tv':openTV();break;
  case 'marbles':startMarbles();break;
  case 'grain':visualWork('grain','储物间的玉米','粮袋里装着干干的玉米粒。取一小把给鸡吃。','装一把玉米粒','storage',2,()=>add('玉米粒',2),'🌽','口袋里装好两把玉米粒。');break;
  case 'broom':grab('broom','扫帚','储物间','storage');break;
  case 'can':grab('can','浇水壶','储物间','storage');break;
  case 'feed':if(!has('玉米粒'))needTool('玉米粒','储物间','喂小鸡','courtyard');else visualWork('feed','给院子里的小鸡喂食','小鸡咕咕地围过来，把玉米粒慢慢撒到食盆里。','撒一小把','courtyard',3,()=>remove('玉米粒'),'🌽','小鸡吃饱啦！');break;
  case 'sweep':if(!has('扫帚'))needTool('扫帚','储物间','扫院子','courtyard');else visualWork('sweep','把院子扫干净','把屋檐下的落叶、土路上的小尘土扫到一起。','扫一下','courtyard',4,null,'🍂','院子干净又整齐。');break;
  case 'garden':if(!has('浇水壶'))needTool('浇水壶','储物间','给菜园浇水','courtyard');else visualWork('garden','给菜园浇水','番茄和白菜晒了一天，给每一块菜地浇上清水。','浇一片菜','courtyard',3,null,'💧','蔬菜喝饱水啦。');break;
  case 'pick':tapCrop(0);break;
  case 'clothes':visualWork('clothes','帮妈妈收衣服','晒了一下午的衣服带着阳光的味道，轻轻取下、折好。','收一件衣服','courtyard',3,null,'👕','叠好三件干衣服。');break;
  case 'bicycle':visualWork('bicycle','擦擦家里的老自行车','用旧布把自行车的车把、座垫和车架擦干净。','擦一下','courtyard',3,null,'✨','自行车干干净净。');break;
  case 'bed':visualWork('bed','整理自己的床铺','把床单拉平、枕头放正、被子叠好。','整理一下','bedroom',3,null,'✓','床铺整整齐齐。');break;
  case 'study':visualWork('study','读连环画','坐在木桌前，翻开一本旧连环画。','翻下一页','bedroom',3,null,'📖','今天读了三页故事。');break;
  case 'treasure':visualWork('treasure','床边的小木箱','木箱里有过去攒下来的小东西和玻璃弹珠。','找一找','bedroom',3,()=>add('玻璃弹珠'),'🔮','找到一颗亮晶晶的玻璃弹珠！');break;
  case 'washface':visualWork('washface','用搪瓷盆洗脸','先把清水倒进盆里，再把脸和手擦干净。','洗一下','bedroom',2,null,'💧','清清爽爽！');break;
  case 'schoolbag':visualWork('schoolbag','整理上学的小书包','把作业本、语文课本和铅笔一样样放进书包。','放好一样','bedroom',3,null,'📚','书包整理好了。');break;
  case 'sleep':dialogue('卧室 · 睡个好觉',`${dateLabel()}，忙了一天的你可以躺进被窝。醒来就是下一天，日常任务和学校课程会重新开放。`,[['sleep','躺下睡觉'],['close','我还想玩',true]],'bedroom');break;
  case 'radio':visualWork('radio','打开收音机','转动旋钮，沙沙的声音中渐渐传来熟悉的广播。','转一格旋钮','living',3,null,'♫','听了一段温暖的老广播。');break;
  case 'photo':visualWork('photo','一家人的老相册','小心翻开旧照片，看看一家人从前的模样。','翻一页相册','living',3,()=>remember('堂屋'),'📷','看完三页老相册。');break;
  case 'tea':visualWork('tea','给家人倒茶','拎起暖水瓶，小心给搪瓷杯倒温水。','倒一点茶','living',2,null,'🍵','茶水倒好啦。');break;
  case 'toy':visualWork('toy','找旧玩具','储物间的木箱里放着好多以前的玩具。','翻一翻','storage',3,()=>add('鸡毛毽子'),'🪶','找到一只漂亮的鸡毛毽子！');break;
  case 'corn':visualWork('corn','田埂上的玉米','沿着田边捡起几颗掉在地上的玉米粒，留给小鸡。','捡一把','field',3,()=>add('玉米粒',2),'🌽','带着玉米粒回家。');break;
  case 'scarecrow':visualWork('scarecrow','田里的稻草人','戴草帽的稻草人正守着麦田。仔细看它的衣服和草帽。','仔细看看','field',2,null,'🌾','记住了麦田里的稻草人。');break;
  case 'dragonfly':visualWork('dragonfly','田野里的蜻蜓','三只红蜻蜓在野花和田埂上飞，安静观察，不打扰它们。','发现一只蜻蜓','field',3,null,'🦋','观察到三只蜻蜓！');break;
  case 'fish':visualWork('fish','小河里的鱼','站在岸边，看清凉的河水里小鱼游来游去。','数一条小鱼','river',3,null,'🐟','数到三条小鱼。');break;
  case 'pebbles':visualWork('pebbles','捡漂亮的小石头','在安全的河岸上找找有光泽的石头。','找一找','river',2,()=>add('小石子',3),'🪨','捡到了三颗小石子！');break;
  case 'skip':if(!has('小石子'))needTool('小石子','河岸边','打水漂','river');else visualWork('skip','在岸边打水漂','从岸上把扁平小石子轻轻抛向水面，看看它跳起几朵水花。','打一次水漂','river',Math.min(3,S.items['小石子']),()=>remove('小石子',Math.min(3,S.items['小石子']||0)),'💦','小石子跳过水面。');break;
  }
}

function openTV(){tvOn=true;openModal('tv','转动黑白电视的旋钮',`<div class="tv-view" id="tvView">${picture('tv','老式黑白电视正在播放熊猫和兔子的动画',true)}</div><p id="tvStatus">电视里正在播放黑白动画片，屏幕上还有一点点雪花。</p>`+buttons(['tvToggle','关闭／打开电视'],['tvDone','看一会儿，继续玩',true]));remember('黑白电视')}
function canBuy(name,price){return S.money>=price&&!(name==='食盐'&&S.salt)&&!(S.intro&&!S.salt&&name!=='食盐'&&S.money-price<30)}
function productImage(i,cls='product-image'){if(i>=10)return mealImg(i-2,cls);return `<img class="${cls}" src="assets/items/item-${i}.webp" alt="${goods[i][0]}" draggable="false">`}
function openShop(){openModal('shop','小卖部 · 王奶奶','<p class="sub">“来啦，想吃点啥？”　余额：<strong>'+moneyText(S.money)+'</strong>'+(S.intro&&!S.salt?' · 留三角钱买盐。':'')+'</p><div class="shop-grid">'+goods.map(([name,ico,price,desc],i)=>`<button class="item" data-buy="${i}" ${!canBuy(name,price)?'disabled':''}>${productImage(i)}<span class="detail"><strong>${name}</strong><small>${desc}</small></span><span class="price">${name==='食盐'&&S.salt?'已买':moneyText(price)}</span></button>`).join('')+'</div>'+buttons(['close','谢谢王奶奶，走啦！',true]));}
function buy(i){const [name,ico,price]=goods[i];if(!canBuy(name,price))return;S.money-=price;add(name);if(name==='食盐')S.salt=true;advance(1);fx(4);openShop();toast('买到了 '+name+' · 花费 '+moneyText(price))}
function bag(){const rows=Object.entries(S.items).filter(([,n])=>n>0);openModal('bag','我的小口袋','<p class="sub">零花钱 '+moneyText(S.money)+' · 日常工具和宝贝都藏在这里。</p><div class="list">'+(rows.length?rows.map(([name,n])=>{const i=goods.findIndex(g=>g[0]===name);const eating=(i>=1&&i<=7)||i>=10||['牛角面包','猕猴桃','苹果','香蕉','烤串','火腿肠'].includes(name);return `<div class="list-line"><span class="bag-label">${i>=0?productImage(i,'bag-image'):EXP_ITEMS.includes(name)?expArt(name,'bag-image'):PRODUCT_NAMES.includes(name)?farmImage(name,'bag-image'):'<span style="font-size:30px">'+({'井水':'🪣','玉米粒':'🌽','扫帚':'🧹','浇水壶':'🪴','番茄':'🍅','小石子':'🪨'}[name]||'🎒')+'</span>'}<span>${name} × ${n}</span></span>${eating?`<button class="paper-btn secondary" data-snack="${name}">尝一口</button>`:'<small>留着</small>'}</div>`}).join(''):'<p>口袋空空的。</p>')+'</div>'+buttons(['close','收好口袋',true]));}
function journal(){openModal('journal','童年记忆册','<p class="sub">已收集 '+S.memories.length+' / '+memories.length+' 段夏日回忆。累计完成 '+S.totalTasks+' 件日常小事。</p><div class="memory-grid">'+memories.map(([name,desc,art])=>`<div class="memory-card ${S.memories.includes(name)?'':'locked'}"><img src="assets/${art}.webp" alt="${name}" draggable="false"><div class="memory-copy"><strong>${S.memories.includes(name)?'✓':'◇'} ${name}</strong>${S.memories.includes(name)?desc:'等待你亲自发现'}</div></div>`).join('')+'</div>'+buttons(['expGrowth','成长日记'],['expSaves','存档管理',true],['close','继续体验',true],['restart','重新开始全部游戏',true]));}
function mapModal(){expMap()}
function taskList(){const main=[['和妈妈说话',S.intro,'home'],['买一包盐',S.salt,'shop'],['打一桶井水',S.water,'village'],['把东西交给妈妈',S.helped,'home'],['一起吃饭',S.dinner,'home']];const row=(title,done,place,hint='')=>`<button class="task-row ${done?'done':''}" data-route="${place}"><span class="task-mark">${done?'✓':'○'}</span><span><strong>${title}</strong>${hint?`<small>${hint}</small>`:''}</span><span class="task-place">${scenes[place].name}</span></button>`;openModal('tasks','今天要做的事情',`<p class="sub">第 ${S.day} 天 · 日常已完成 ${dailyCount()} 件 / ${dailyTasks.length} 件。点任务，可以走到对应地点。</p><div class="task-title">妈妈交代的事</div><div class="task-group">${main.map(([t,d,p])=>row(t,d,p)).join('')}</div>${farmTaskRows()}${townTasks()}${expTaskRows()}<div class="task-title">每天都有的小事情</div><div class="task-group">${dailyTasks.map(t=>row(t.title,S.daily[t.id],t.place,t.hint)).join('')}</div>`+buttons(['close','继续做事',true]));}

// Visual glass-marble game: the moving aim line points toward a real depicted pit.
function startMarbles(){openModal('marble','土路上的玻璃弹珠','<p class="sub">等准星对准土坑，按“弹出弹珠”。看弹珠真的滚过去！三次机会。</p><div class="marble-board" id="marbleBoard"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><line id="aimLine" x1="50" y1="84" x2="50" y2="23.5" stroke="#fff6c2" stroke-width=".48" stroke-dasharray="1.5 2" opacity=".85"/></svg><span class="aim-point" id="aimPoint" style="left:50%;top:23.5%"></span><span class="marble-ball" id="marbleBall" style="left:50%;top:84%"></span></div><div class="marble-score"><span class="marble-result" id="marbleResult">第 1 / 3 次 · 准备好了</span><span class="marble-pips" id="pips"><span></span><span></span><span></span></span></div>'+buttons(['shoot','弹出弹珠'],['close','下次再玩',true]));marble={throws:0,hits:0,active:true,phase:performance.now(),shot:null,result:[]};}
function aimPosition(t=performance.now()){return 17+66*(.5+.5*Math.sin((t-marble.phase)/680))}
function shoot(){if(!marble?.active||marble.shot)return;const x=aimPosition();marble.shot={start:performance.now(),x,hit:Math.abs(x-50)<6.7};$('modal').querySelector('[data-act="shoot"]').disabled=true;fx(1)}
function updateMarble(t){if(!marble||!$('marbleBall'))return;const b=$('marbleBall'),aim=$('aimPoint'),line=$('aimLine');if(marble.shot){const s=marble.shot,e=Math.min(1,(t-s.start)/720),f=1-(1-e)**2;b.style.left=(50+(s.x-50)*f)+'%';b.style.top=(84+(23.5-84)*f)+'%';b.style.width=(5.8-2.1*f)+'%';aim.style.visibility='hidden';line.style.visibility='hidden';if(e>=1){marble.throws++;if(s.hit){marble.hits++;b.style.opacity='.3'}marble.result.push(s.hit);$('pips').children[marble.throws-1].className=s.hit?'hit':'miss';$('marbleResult').textContent=(s.hit?'进洞啦！':'差一点！')+' · '+marble.throws+'/3 次，命中 '+marble.hits;fx(s.hit?5:2);marble.shot=null;const button=$('modal').querySelector('[data-act="shoot"]');if(marble.throws>=3){marble.active=false;S.marbleBest=Math.max(S.marbleBest,marble.hits);remember('弹珠');complete('marbles',5);button.disabled=false;button.textContent='再玩一次';button.dataset.act='replay';if(marble.hits===3)add('玻璃弹珠')}else{marble.waitUntil=t+650;button.disabled=true}}return}
  if(!marble.active)return;if(marble.waitUntil&&t<marble.waitUntil)return;if(marble.waitUntil){marble.waitUntil=null;b.style.left='50%';b.style.top='84%';b.style.width='5.8%';b.style.opacity='1';aim.style.visibility='visible';line.style.visibility='visible';$('modal').querySelector('[data-act="shoot"]').disabled=false}
  const x=aimPosition(t);aim.style.left=x+'%';line.setAttribute('x2',x);}
function finish(){mealEat()}

$('modal').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(rainAction(b)||lifeChatAction(b)||expAction(b)||schoolAction(b)||farmAction(b)||townAction(b))return;if(b.dataset.buy!==undefined){buy(+b.dataset.buy);return}if(b.dataset.route){const p=b.dataset.route;cancelSchoolJourney();closeModal();routeTo(p);return}if(b.dataset.snack){const name=b.dataset.snack;remove(name);advance(2);const i=goods.findIndex(r=>r[0]===name);openModal('snack','尝一口'+name,`<div style="display:grid;place-items:center;min-height:120px">${i>=0?productImage(i):farmImage(name)}<p>酸甜的童年味道，真好吃！</p></div>`+buttons(['bag','收回口袋'],['close','继续走走',true]));fx(3);return}
  switch(b.dataset.act){case 'close':closeModal();break;case 'accept':if(!S.intro){S.intro=true;S.money+=50;hud();toast('妈妈给了你五角钱。')}closeModal();break;case 'give':S.helped=true;remove('食盐');remove('井水');hud();closeModal();toast('妈妈夸你真懂事！');break;case 'deliver':remove('番茄',S.items['番茄']);advance(4);closeModal();toast('妈妈收到小番茄，很开心。');break;case 'eat':finish();break;case 'journal':journal();break;case 'tasks':taskList();break;case 'bag':bag();break;case 'step':workStep();break;case 'shoot':shoot();break;case 'replay':startMarbles();break;case 'tvToggle':tvOn=!tvOn;$('tvView').classList.toggle('tv-off',!tvOn);$('tvStatus').textContent=tvOn?'黑白动画片又亮起来了。':'电视关掉了，屋里安静下来。';fx(2);break;case 'tvDone':complete('tv',7);closeModal();break;case 'sleep':beginSleep();break;case 'restart':dialogue('再梦一回？','重新开始会清空所有日期的零花钱、任务和记忆。',[['reset','重新开始'],['journal','取消',true]],'village');break;case 'reset':S=initial();closeModal();renderScene();toast('又是1995年9月的早晨。');break;}
});

const keymap={w:'up',arrowup:'up',s:'down',arrowdown:'down',a:'left',arrowleft:'left',d:'right',arrowright:'right'};
function cancelTarget(){target=null;arrive=null;routeGoal=null;cancelSchoolJourney();hideTarget()}
window.addEventListener('keydown',e=>{if(menuOpen||sleeping||arcadeActive()||crossing)return;const k=e.key.toLowerCase();if(k==='escape'&&modalType){closeModal();return}if(modalType)return;if(keymap[k]){e.preventDefault();keys.add(keymap[k]);cancelTarget()}else if(k==='e'||k===' '){if(e.repeat)return;e.preventDefault();interact()}else if(k==='m'){mapModal()}else if(k==='b'){bag()}else if(k==='q'){taskList()}});
window.addEventListener('keyup',e=>{const d=keymap[e.key.toLowerCase()];if(d)keys.delete(d)});window.addEventListener('blur',clearMovement);document.addEventListener('visibilitychange',()=>{if(document.hidden)clearMovement()});
function activeDirs(){return new Set([...keys,...pointerDirs.values(),...touchDirs.values()])}
function refreshDpad(){const dirs=activeDirs();for(const b of document.querySelectorAll('[data-dir]'))b.classList.toggle('pressed',dirs.has(b.dataset.dir))}
for(const b of document.querySelectorAll('[data-dir]')){
  const d=b.dataset.dir;
  b.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;e.preventDefault();if(modalType)return;try{b.setPointerCapture(e.pointerId)}catch{}pointerDirs.set(e.pointerId,d);cancelTarget();refreshDpad()});
  const release=e=>{pointerDirs.delete(e.pointerId);refreshDpad()};b.addEventListener('pointerup',release);b.addEventListener('pointercancel',release);b.addEventListener('lostpointercapture',release);
  b.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();if(modalType)return;for(const t of e.changedTouches)touchDirs.set(t.identifier,d);cancelTarget();refreshDpad()},{passive:false});
  b.addEventListener('touchmove',e=>{e.preventDefault();e.stopPropagation()},{passive:false});
  const touchRelease=e=>{e.preventDefault();for(const t of e.changedTouches)touchDirs.delete(t.identifier);refreshDpad()};b.addEventListener('touchend',touchRelease,{passive:false});b.addEventListener('touchcancel',touchRelease,{passive:false});
  b.addEventListener('click',e=>e.preventDefault());
}
for(const evt of ['contextmenu','selectstart','dragstart'])$('app').addEventListener(evt,e=>e.preventDefault());
$('app').addEventListener('gesturestart',e=>e.preventDefault(),{passive:false});
$('world').addEventListener('pointerdown',e=>{if(crossing||sleeping||modalType||e.target.closest('button'))return;e.preventDefault();tapStart={id:e.pointerId,x:e.clientX,y:e.clientY};try{$('world').setPointerCapture(e.pointerId)}catch{}});
$('world').addEventListener('pointercancel',()=>{tapStart=null});
$('world').addEventListener('pointerup',e=>{if(!tapStart||tapStart.id!==e.pointerId)return;const start=tapStart;tapStart=null;if(modalType||Math.hypot(e.clientX-start.x,e.clientY-start.y)>18)return;e.preventDefault();routeGoal=null;cancelSchoolJourney();const r=$('stage').getBoundingClientRect(),x=bound((e.clientX-r.left)/r.width,0,1),y=bound((e.clientY-r.top)/r.height,0,1);const ground=clampPoint(x,y);
  // Tapping a pictured doorway or object above the walkable ground targets that object.
  if(y<ground.y-.025){const ranked=spots().map(p=>({p,d:Math.hypot((p.lx-x)*1.15,p.ly-y)})).sort((a,b)=>a.d-b.d);if(ranked[0]&&ranked[0].d<.16){goSpot(ranked[0].p);return}}
  target=ground;arrive=null;showTarget(ground)
});
function interact(){const n=near();if(n)goSpot(n);else toast('点亮的地点都可以走过去互动。')}
$('interact').onclick=interact;$('bag').onclick=bag;$('journal').onclick=journal;$('sound').onclick=toggleSound;VillageAudio.setup($('sound'));$('map').onclick=mapModal;$('taskList').onclick=taskList;$('questButton').onclick=taskList;
$('schoolSchedule').onclick=openSchoolTimetable;setupJoystick();
const fullscreenButton=$('fullscreen');fullscreenButton.hidden=false;
fullscreenButton.onclick=async()=>{const on=$('app').classList.toggle('immersive');fullscreenButton.textContent=on?'⛶ 退出':'⛶ 全屏';try{if(document.fullscreenElement&&!on)await document.exitFullscreen();else if(on&&document.fullscreenEnabled&&document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen()}catch{}resizePlayArea();toast(on?'游戏已铺满可用屏幕':'已恢复完整界面')};
document.addEventListener('fullscreenchange',()=>{resizePlayArea();if(!document.fullscreenElement){$('app').classList.remove('immersive');fullscreenButton.textContent='⛶ 全屏'}});
window.addEventListener('resize',fitStage);if(window.ResizeObserver)new ResizeObserver(fitStage).observe($('world'));
$('overlay').addEventListener('pointerdown',e=>{if(e.target===$('overlay'))closeModal()});
let lastStepError=0,lastStepTime=0;
function update(t){try{if(t-lastStepTime>=26){lastStepTime=t;gameStep(t)}}catch(e){console.error('Game step recovered:',e);if(t-lastStepError>1500||!lastStepError){lastStepError=t;try{recoverTravel('游戏刚刚恢复了操作，进度已保留。')}catch(err){console.warn(err)}}}finally{requestAnimationFrame(update)}}
function gameStep(t){const dt=Math.min(.10,Math.max(0,(t-last)/1000));last=t;if(menuOpen||sleeping||arcadeActive()){return}rainTick(dt);if(crossing){advanceCrossing(dt);return}clockAcc+=dt;if(clockAcc>=4.5){clockAcc-=4.5;advance(1)}let moving=false;
  if(!modalType){const held=activeDirs();let dx=(held.has('right')?1:0)-(held.has('left')?1:0)+joy.x,dy=(held.has('down')?1:0)-(held.has('up')?1:0)+joy.y;const speed=expState().upgrades.bike&&OUTSIDE.has(S.scene)?.44:.295;
    if(!dx&&!dy&&target){const tx=target.x-S.x,ty=target.y-S.y,dist=Math.hypot(tx,ty*1.35);if(dist<Math.max(.002,speed*dt+.001)){S.dir=walkDirection(tx,ty*1.35,S.dir);S.x=target.x;S.y=target.y;const id=arrive;target=null;arrive=null;hideTarget();if(id)act(id);if(crossing)return}else{dx=tx/dist;dy=ty/dist*1.35}}
    if(dx||dy){const norm=Math.max(1,Math.hypot(dx,dy)),ox=S.x,oy=S.y;Object.assign(S,clampPoint(S.x+dx/norm*speed*dt,S.y+dy/norm*speed*.74*dt));moving=Math.abs(S.x-ox)+Math.abs(S.y-oy)>.00002;if(moving){S.dir=walkDirection(dx,dy,S.dir);animClock+=dt;}}
    if(!moving)animClock=0;VillageAudio.walking(moving,S.scene);renderPlayer(moving);farmTick(dt);townTick(dt);placeCamera(false,dt);if(dx)expEdge(dx);
  }else if(modalType==='marble')updateMarble(t);
  if(++frame%240===0)save();
}
const sceneImages=new Map();
// Broken image requests should never leave a blank map or a locked journey.
document.addEventListener('error',e=>{const im=e.target;if(!(im instanceof HTMLImageElement))return;const src=im.getAttribute('src')||'';if(!src.startsWith('assets/'))return;const url=src.split('?')[0];if(im.dataset.retried!==url){im.dataset.retried=url;im.src=url+'?retry='+Date.now();return}if(im.id==='scene'){im.style.visibility='hidden';if(crossing)recoverTravel('场景图片暂时无法加载，已恢复游戏。');else toast('图片暂时无法加载，可以继续互动或重新进入场景。')}else if(im.id==='playerSprite'&&!url.includes('/sprites/')&&!url.includes('/expedition/')){const a=Wardrobe.normal(S.avatar);im.src=a.gender==='girl'?'assets/expedition/girl-down-0.webp':'assets/sprites/down-0.webp'}else{im.style.visibility='hidden';im.parentElement?.classList.add('image-unavailable');im.parentElement?.setAttribute('title',im.alt||'图片暂时无法加载')}},true);
document.addEventListener('load',e=>{const im=e.target;if(im instanceof HTMLImageElement){im.style.visibility='';im.parentElement?.classList.remove('image-unavailable')}},true);
function prepareSceneImage(dest){const url='assets/'+scenes[dest].art+'.webp';const cached=sceneImages.get(url);if(cached&&cached.status!=='failed')return cached;const image=new Image(),entry={url,image,status:'loading'};sceneImages.set(url,entry);const settle=state=>{if(entry.status==='loading'){entry.status=state;clearTimeout(timeout)}};const timeout=setTimeout(()=>settle('failed'),6500);image.onload=()=>settle(image.naturalWidth?'ready':'failed');image.onerror=()=>settle('failed');image.src=url;return entry}
function prefetchNearby(){const names=scenes[S.scene].spots.filter(p=>p.dest).map(p=>p.dest).slice(0,2);for(const k of names)prepareSceneImage(k);for(const [url,entry] of sceneImages)if(sceneImages.size>5&&entry.status!=='loading'&&!names.some(k=>'assets/'+scenes[k].art+'.webp'===url))sceneImages.delete(url)}
for(const d of ['up','down','left','right'])for(let f=0;f<3;f++){const i=new Image();i.src=`assets/sprites/${d}-${f}.webp`;preloaded.push(i)}
for(const art of ['tv','meal','marbles','bedroom-sleep']){const i=new Image();i.src='assets/'+art+'.webp';preloaded.push(i)}
function measureTopHud(){const el=$('topHUD');if(el)document.documentElement.style.setProperty('--top-hud-height',Math.ceil(el.getBoundingClientRect().height)+'px')}
function resizePlayArea(){const a=$('app');const w=a.clientWidth||innerWidth,h=a.clientHeight||innerHeight;document.documentElement.style.setProperty('--play-w',w+'px');document.documentElement.style.setProperty('--play-h',h+'px');measureTopHud();fitStage()}
let viewportResizeFrame=0;function schedulePlayResize(){cancelAnimationFrame(viewportResizeFrame);viewportResizeFrame=requestAnimationFrame(resizePlayArea)}
window.addEventListener('resize',schedulePlayResize);window.visualViewport?.addEventListener('resize',schedulePlayResize);window.addEventListener('orientationchange',()=>{schedulePlayResize();setTimeout(schedulePlayResize,150);setTimeout(schedulePlayResize,450)});if(window.ResizeObserver)new ResizeObserver(measureTopHud).observe($('topHUD'));$('weatherLabel').onclick=openRainPanel;const rainButton=document.createElement('button');rainButton.id='rainStatus';rainButton.className='tag paper button';rainButton.setAttribute('aria-label','雨伞、湿润度和浴室');rainButton.textContent='☂ 雨具';rainButton.onclick=openRainPanel;$('weatherLabel').after(rainButton);$('growthLabel').onclick=expGrowth;setupArcade();resizePlayArea();
const travelCurtain=document.createElement('div');travelCurtain.id='travelCurtain';travelCurtain.setAttribute('aria-live','polite');$('world').append(travelCurtain);Object.assign(S,clampPoint(S.x,S.y));renderScene();MainMenu.init();requestAnimationFrame(update);
