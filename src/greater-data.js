/* Alpha 5 — the Common Line campaign and authored expedition sites. */
Object.assign(UG.weapons,{
 burst:{name:'Union three-stamp rifle',range:800,opt:430,damage:22,mag:12,ap:1,acc:80,pen:2,burst:2,suppress:true,desc:'Two-round burst, always suppresses. More ammunition; less armor punch than a carbine.'},
 arcblade:{name:'Switchman’s arc blade',range:82,opt:60,damage:36,mag:0,ap:1,acc:92,pen:5,melee:true,shock:true,desc:'Ammo-free close combat. Shocks machinery and guards; less raw penetration than a chainblade.'}
});
UG.weaponSources.burst='Restore the Cold Foundry governor, then report to Ada';
UG.weaponSources.arcblade='Cold-carriage expedition deep cache, or complete the Common Line';
UG.mods.damped={name:'Balanced recoil cradle',acc:4,pen:2,desc:'+4 accuracy and +2 penetration. A Cold Foundry service pattern.'};
UG.mods.deepfeed={name:'Redoubt breach feed',damage:3,pen:2,desc:'+3 damage and +2 penetration. Military salvage; clear Redoubt Six.'};
UG.gear.surveykit={name:'Deep survey harness',move:25,toxin:true,desc:'+25 movement per AP and immunity to chemical exposure. A deep expedition discovery.'};
Object.assign(UG.enemyTypes,{
 watch:{name:'Indenture rifleman',hp:62,weapon:'burst',armor:4,role:'marksman',xp:40},
 marshal:{name:'The Shift Marshal',hp:180,weapon:'heavy',armor:7,role:'boss',xp:150},
 tether:{name:'Load-bearing coupler',hp:44,weapon:'laser',armor:3,role:'fixed',xp:25},
 captain:{name:'Captain Vey / six unpaid tours',hp:145,weapon:'burst',armor:6,role:'commander',xp:125},
 receiver:{name:'The Receiver / requisition engine',hp:230,weapon:'plasma',armor:8,role:'boss',xp:220}
});
Object.assign(UG.gates,{commonPass:'Restore Bell Engine, the freight locomotive, its first delivery and clean water; ratify a charter at Rustmarket’s Common Line desk.',networkPass:'Bring the Cold Foundry governor back to Ada at Kettle Junction.',heartPass:'Reconnect all three Relay Orchard exchanges and find the Unlisted Station manifest.',lineComplete:'Complete the Common Line at the requisition engine.'});
function greaterRoom(id,name,subtitle,depth,color,theme,w,h,geometry,ladderData,objects,foes,coverData=[],barrelData=[]){
 UG.rooms[id]={name,subtitle,depth,color,theme,w,h,platforms:geometry.map((p,i)=>platform(i?'gdeck'+i:'floor',...p)),ladders:ladderData.map(l=>ladder(...l)),objects,enemies:foes.map(e=>enemy(...e)),covers:coverData.map((p,i)=>({id:id+'-cover'+i,x:p[0],y:p[1],hp:45})),barrels:barrelData.map((p,i)=>({id:id+'-barrel'+i,x:p[0],y:p[1]}))};
}
const storyObject=(id,x,y,name,kind,extra={})=>obj(id,'story',x,y,name,{kind,...extra});
UG.rooms.market.objects.push(storyObject('common-desk',1010,880,'Ada’s notice / the Common Line','charter'));
UG.rooms.hearth.objects.push(storyObject('future-work',1180,880,'A new freight notice','notice'));
UG.rooms.deadrail.objects.push(door('outer-line',1620,240,'The outer freight / Kettle Junction','junction',100,880,'commonPass'));
greaterRoom('junction','Kettle Junction','A station built around a kettle that never cools.',518,'#d7b17c','settlement',1800,1000,
 [[0,880,1800],[80,650,610],[900,650,800],[410,420,950]],[[230,650,880],[1100,650,880],[570,420,650],[1230,420,650]],
 [door('back',65,880,'Dead Rail freight return','deadrail',1600,240),storyObject('ada',500,880,'Ada / retired dispatcher','ada'),obj('kettle-bunks','rest',280,880,'Platform bunks'),obj('kettle-shop','shop',380,650,'Quartermaster Rell'),obj('kettle-board','contracts',680,880,'Outer wards / work board'),obj('kettle-tram','tram',800,880,'Common Line platform'),door('abyss',1700,880,'Counterweight Abyss','abyss',110,380),door('orchard',1550,650,'Relay Orchard service duct','orchard',120,880,'networkPass'),door('commons',1250,420,'Cable Commons','commons',120,880,'lineComplete'),lore('kettle-note',630,420,'A cup for every shift','Seven cups. Six names. Ada washes the seventh every morning.')],[]);
greaterRoom('abyss','Counterweight Abyss','The counterweights are buildings. Something below is still pulling.',650,'#9db9c8','lift',1800,1600,
 [[0,1480,1800],[30,1280,620],[940,1280,820],[380,1050,700],[1150,1050,610],[90,820,600],[850,820,820],[360,600,760],[40,380,610],[1010,380,720],[630,180,650]],
 [[220,1280,1480],[1110,1280,1480],[520,1050,1280],[1290,1050,1280],[500,820,1050],[1300,820,1050],[530,600,820],[1000,600,820],[470,380,600],[1080,380,600],[1100,180,380]],
 [door('junction',100,380,'Kettle Junction','junction',1630,880),door('cold',1670,1480,'Cold Foundry intake','cold',100,880),door('redoubt',1600,380,'Redoubt Six','redoubt',100,880),obj('abyss-anchor','anchor',1200,180,'Counterweight crown / winch anchor'),loot('abyss-cache',1110,180,'A rigger’s last provisions',{ammo:36,grenades:2,scrap:10}),door('wet-cut',1700,1280,'Submerged service cut','pressure',1650,1230,'diving'),lore('abyss-note',500,600,'The painted depth marks','Every hundred metres, someone painted a door and a flower. The last mark has a real door handle.')],
 [['ab1','drone',1020,820],['ab2','watch',1260,1280],['ab3','shocker',1430,1480]],[[1180,1280],[1230,1480]],[[1450,1280]]);
greaterRoom('cold','The Cold Foundry','Molten orders. Cold furnaces. No one authorized a shutdown.',730,'#a5c8bd','works',1900,1200,
 [[0,1080,1900],[0,880,720],[920,880,900],[340,650,700],[1190,650,650],[740,420,820]],[[240,880,1080],[1100,880,1080],[500,650,880],[1390,650,880],[900,420,650],[1350,420,650]],
 [door('abyss',90,880,'Abyss intake','abyss',1570,1480),obj('cold-left','machine',550,650,'Magnetic feed A / isolate',{machine:'cold-a'}),obj('cold-right','machine',1430,650,'Magnetic feed B / isolate',{machine:'cold-b'}),storyObject('governor',1500,420,'The freight governor','governor'),lore('cold-order',950,880,'An order without a customer','DELIVER ALL CAPACITY. DESTINATION: RESERVED. The signature field is a thumbprint worn clean.')],
 [['marshal','marshal',1440,1080],['coil-a','tether',570,650],['coil-b','tether',1470,650],['cold-watch','watch',1190,1080]],[[760,1080],[1210,1080],[1360,880]],[[1140,1080]]);
greaterRoom('redoubt','Redoubt Six','The last order was to hold. Nobody came back to change it.',590,'#c9a4a4','archive',1800,1100,
 [[0,980,1800],[0,880,540],[720,740,990],[190,530,850],[1120,530,650],[640,300,800]],[[300,880,980],[880,740,980],[840,530,740],[1290,530,740],[800,300,530],[1320,300,530],[350,530,880]],
 [door('abyss',100,880,'Abyss crown road','abyss',1500,380),storyObject('redoubt-witness',1350,300,'The armistice locker','armistice'),storyObject('redoubt-case',1590,530,'Breach-feed service case','redoubtReward'),loot('redoubt-meds',400,530,'Field surgical supplies',{meds:3,ammo:32}),lore('redoubt-note',900,300,'A list of home addresses','Every address is crossed out except one. The last says: wherever the kettle is.')],
 [['captain','captain',1390,980],['rd1','watch',1000,740],['rd2','medic',1510,980],['reinforcement','shocker',1650,980]],[[690,980],[1210,980],[1400,740]],[[1070,980]]);
UG.rooms.redoubt.enemies.find(e=>e.id==='reinforcement').dormant=true;
greaterRoom('orchard','The Relay Orchard','Cable trees. Ceramic fruit. A route that should not exist.',840,'#b7cda0','archive',2000,1300,
 [[0,1180,2000],[0,880,550],[710,880,1190],[180,650,710],[1120,650,740],[600,420,880],[100,190,670]],[[300,880,1180],[950,880,1180],[350,650,880],[1330,650,880],[700,420,650],[1260,420,650],[690,190,420]],
 [door('junction',100,880,'Kettle service duct','junction',1490,650),storyObject('relay-a',450,650,'Exchange A / homes','relay',{relay:'a'}),storyObject('relay-b',1380,650,'Exchange B / freight','relay',{relay:'b'}),storyObject('relay-c',1050,420,'Exchange C / reserve','relay',{relay:'c'}),door('unlisted',600,190,'The Unlisted Station','unlisted',100,880),door('heart',1900,1180,'Load-Bearing Heart','heart',100,1080,'heartPass'),lore('orchard-note',1600,880,'The fruit tags','Every insulator carries a destination. Half are places Ada has never heard of. One is written in Rook’s handwriting. Rook has never been here.')],
 [['or1','watch',1150,1180],['or2','drone',1480,880],['or3','shocker',1250,650]],[[1000,1180],[1390,880]],[[1370,1180]]);
greaterRoom('unlisted','The Unlisted Station','A timetable of departures. No arrivals column.',910,'#b6acd2','settlement',1600,1000,
 [[0,880,1600],[120,650,500],[850,650,660],[380,420,830]],[[290,650,880],[1040,650,880],[510,420,650],[1030,420,650]],
 [door('orchard',90,880,'Relay Orchard roofline','orchard',570,190),storyObject('manifest',1060,420,'The unlisted manifest','manifest'),storyObject('missing-worker',1330,650,'Anik / missing brake operator','rescue'),obj('unlisted-bunk','rest',330,880,'Vacant night-shift bunk'),lore('unlisted-note',550,650,'A perfectly ordinary room','A kettle, a bed, a coat. The coat is warm. The calendar has tomorrow crossed out.')],[]);
greaterRoom('heart','Load-Bearing Heart','A requisition engine is taking the wards apart to complete an order.',1040,'#e2b783','engine',2000,1400,
 [[0,1280,2000],[0,1080,650],[860,1080,1050],[300,850,730],[1180,850,700],[650,620,930],[220,390,650]],[[360,1080,1280],[1040,1080,1280],[480,850,1080],[1410,850,1080],[800,620,850],[1350,620,850],[730,390,620]],
 [door('orchard',100,1080,'Orchard return conduit','orchard',1800,1180),obj('heart-left','machine',700,620,'Requisition tether A / release',{machine:'heart-a'}),obj('heart-right','machine',1470,850,'Requisition tether B / release',{machine:'heart-b'}),obj('heart-coolant','machine',510,390,'Emergency flood coolant',{machine:'heart-coolant'}),storyObject('common-line',1750,1280,'The Common Line / take the switch','conclusion'),loot('heart-supplies',500,850,'An interrupted maintenance shift',{ammo:40,meds:3,grenades:2})],
 [['receiver','receiver',1500,1280],['load-a','tether',720,620],['load-b','tether',1510,850],['heart-drone','drone',1280,1080]],[[780,1280],[1240,1280],[1330,1080]],[[1120,1280]]);
greaterRoom('commons','Cable Commons','Your names on a platform. A place in the grid.',520,'#cfe5a7','settlement',1500,1000,
 [[0,880,1500],[100,650,580],[810,650,580],[440,420,700]],[[280,650,880],[980,650,880],[560,420,650],[1000,420,650]],
 [door('junction',100,880,'Kettle Junction','junction',1200,420),storyObject('epilogue',650,880,'The crew’s platform ledger','epilogue'),obj('commons-bunk','rest',350,880,'Your own bunks'),obj('commons-tram','tram',1050,880,'The Common Line'),lore('commons-window',980,420,'A window painted on steel','No sky. Still a horizon. Someone has put a tomato plant below the painted sill.')],[]);
for(const [id,m] of Object.entries({
 'cold-a':{room:'cold',x:550,y:650,target:'coil-a',flag:'coldA'},'cold-b':{room:'cold',x:1430,y:650,target:'coil-b',flag:'coldB'},
 'heart-a':{room:'heart',x:700,y:620,target:'load-a',flag:'heartA'},'heart-b':{room:'heart',x:1470,y:850,target:'load-b',flag:'heartB'}
}))UG.machines[id]={...m,kind:'component',cost:4,methods:['engineer','scrap','arc'],text:'Isolate the feed. An engineer, four salvage or one loaded arc charge works. Shooting the coupler also works.'};
UG.machines['heart-coolant']={room:'heart',kind:'coolant',x:510,y:390,flag:'heartCoolant',text:'Flood the induction floor. Stops announced floor surges, not ordinary gunfire.',methods:['toggle']};
Object.assign(UG.roomTiers,{junction:0,abyss:4,cold:5,redoubt:5,orchard:5,unlisted:0,heart:6,commons:0});
UG.greaterStoryRooms=['junction','abyss','cold','redoubt','orchard','unlisted','heart','commons'];
UG.mainActs=[['Last Light','Restore the Bell Engine freight channel.'],['The Wards','Restore freight and clean water; choose the line’s charter.'],['The Deep Works','Recover the governor from the Cold Foundry; report to Ada.'],['The Hidden Network','Connect the Relay Orchard and recover the Unlisted manifest.'],['A Place in the Grid','Stop the requisition engine and decide who owns the line.']];
UG.expeditions={
 mill:{name:'Brasslung Mill',tier:2,fee:0,requires:'power',xp:90,credits:65,scrap:12,reward:{mod:'focused'},text:'A mothballed press complex. Recover a governor stamp; push into the exhaust crown for a rare service harness.',themes:['works','fire','lift'],foes:[['scav','heavy'],['sentry','burner'],['heavy','cutter']]},
 drowned:{name:'Drowned Post',tier:4,fee:15,requires:'diving',xp:140,credits:100,scrap:18,reward:{gear:'surveykit'},text:'A flooded maintenance annex. Recover a dispatch spool, drain the lower chamber and search the drowned archive.',themes:['water','water','archive'],foes:[['chemist','shocker'],['drone','watch'],['shocker','gunner']]},
 carriage:{name:'Carriage Zero',tier:5,fee:20,requires:'railPass',xp:180,credits:135,scrap:22,reward:{mod:'deepfeed'},text:'A derelict military consist. Recover its manifest, cut through the armory and confront the paymaster.',themes:['rail','archive','convoy'],foes:[['watch','smuggler'],['medic','gunner'],['captain','cutter']]}
};
UG.expeditionIds=[];
// Family-specific geometry is authored; seed variation changes hazards, patrols and cache decks.
const expeditionGeometry={
 mill:[[[0,880,1700],[80,650,580],[850,650,760],[410,420,800]],[[0,1080,1700],[0,880,610],[760,880,850],[300,650,720],[1050,650,580],[650,420,800]],[[0,1380,1700],[30,1120,650],[830,1120,800],[350,860,900],[40,600,600],[920,600,710],[420,340,800]]],
 drowned:[[[0,880,1700],[70,660,650],[900,660,700],[440,440,800]],[[0,1280,1700],[0,880,550],[790,880,820],[250,1080,700],[1110,1080,520],[340,650,900]],[[0,1180,1700],[0,880,560],[820,880,800],[300,650,680],[1110,650,540],[580,420,760]]],
 carriage:[[[0,880,1900],[80,670,570],[840,670,940],[440,450,860]],[[0,880,1800],[90,650,710],[1010,650,700],[350,420,900]],[[0,1080,1900],[0,880,620],[850,880,950],[350,650,700],[1180,650,630],[750,420,820]]]
};
function expeditionDefinition(family,index,seed=0){const job=UG.expeditions[family],id='exp_'+family+'_'+index,g=expeditionGeometry[family][index],base=g[0][1],entry=index===0?base:880,w=family==='carriage'?index===1?1800:1900:1700;
 const ladders=[];for(let n=1;n<g.length;n++){const p=g[n],below=g.filter(q=>q!==p&&q[1]>p[1]&&Math.max(p[0],q[0])+35<Math.min(p[0]+p[2],q[0]+q[2])-35).sort((a,b)=>a[1]-b[1])[0];if(below){const l=Math.max(p[0],below[0])+70,r=Math.min(p[0]+p[2],below[0]+below[2])-70;ladders.push([l,p[1],below[1]]);if(r-l>280)ladders.push([r,p[1],below[1]]);}}
 const first=g.find(p=>p[1]===entry&&p[0]<=100)||g[0],inY=first[1],top=[...g].sort((a,b)=>a[1]-b[1])[0],upper=g[1],cacheDeck=seed%2?top:upper,objects=[obj('exp-return','expedition',90,inY,'Extraction / bank recovered haul',{kind:'extract'})];
 if(index>0)objects.push(door('exp-back',180,inY,'Previous work area','exp_'+family+'_'+(index-1),100,expeditionDefinitionEntry(family,index-1)));
 if(index<2)objects.push(obj('exp-next','expedition',w-150,base,'Continue deeper',{kind:'next'}));
 objects.push(obj('exp-cache','expedition',cacheDeck[0]+cacheDeck[2]*.65,cacheDeck[1],'Unclaimed service cache',{kind:'cache'}));
 if(index===1)objects.push(obj('exp-primary','expedition',top[0]+top[2]*.6,top[1],'Recover the contracted freight',{kind:'primary'}),obj('exp-control','expedition',470,inY,'Pressure drive / open the deep route',{kind:'control'}));
 if(index===2)objects.push(obj('exp-vault','expedition',top[0]+top[2]*.7,top[1],'Deep cache / optional elite reward',{kind:'vault'}));
 if(family==='carriage'&&index===2)objects.push(obj('exp-armistice','expedition',300,880,'Defaced military order / stand down',{kind:'armistice'}));
 const foes=seed?[[id+'-1',job.foes[index][seed%2],w*.6,base],[id+'-2',job.foes[index][(seed+1)%2],Math.min(w-220,upper[0]+upper[2]*.65),upper[1]]]:[];
 if(index===2&&seed)foes.push([id+'-elite',family==='mill'?'gunner':family==='drowned'?'shocker':'captain',w-250,base]);
 return {name:job.name+' / '+['Approach','Work floor','Deep reserve'][index],subtitle:job.text,depth:400+index*120,color:family==='drowned'?'#8ecbd0':family==='mill'?'#d2b27c':'#b9b0d0',theme:job.themes[index],w,h:base+120,platforms:g.map((p,i)=>platform(i?'expdeck'+i:'floor',...p)),ladders:ladders.map(l=>ladder(...l)),objects,enemies:foes.map(e=>enemy(...e)),covers:[{id:'exp-cover',x:w*.48,y:base,hp:40}],barrels:[{id:'exp-barrel',x:w*.7,y:base}]};
}
function expeditionDefinitionEntry(family,index){const g=expeditionGeometry[family][index];return (g.find(p=>p[1]===880&&p[0]<=100&&p[0]+p[2]>=100)||g[0])[1];}
for(const f of Object.keys(UG.expeditions))for(let i=0;i<3;i++){const id='exp_'+f+'_'+i;UG.expeditionIds.push(id);UG.rooms[id]=expeditionDefinition(f,i);UG.roomTiers[id]=UG.expeditions[f].tier;}

Object.assign(UG.contracts,{
 nightshift:{name:'Seven cups, six names',from:'Ada / Kettle Junction',requires:'commonPass',text:'Find missing brake operator Anik in the Unlisted Station. Help them return to Ada. No bounty on this one.',needs:['anikHome'],reward:{credits:100,meds:3,flag:'rescueWorkshop'},result:'The seventh cup is used. Anik opens a survey bench; expedition entries cost five fewer credits.'},
 armistice:{name:'Orders that outlived their officers',from:'Redoubt Six / surviving soldiers',requires:'commonPass',text:'Find the Redoubt armistice order or defeat Captain Vey, then recover the service record.',needs:['redoubtRecord'],choices:[{id:'amnesty',name:'Offer passage / let the veterans leave',text:'The rifles go into a crate. The veterans ask for jobs, not forgiveness.',rep:2,reward:{scrap:12}},{id:'evidence',name:'Publish the unpaid-service record',text:'The wards learn who kept signing the orders. The factors pay to keep the line open.',rep:0,reward:{credits:110}}],reward:{mod:'deepfeed',credits:65},result:'A checkpoint becomes an empty guardhouse. Someone paints an arrow toward the kettle.'},
 coldwages:{name:'Paid in heat',from:'Cold Foundry crews',requires:'commonPass',text:'Recover the freight governor and stop the Shift Marshal. A cold floor can become a workshop again.',needs:['governor'],clear:'cold',reward:{credits:100,scrap:12,armorKey:'ceramic'},result:'A shift bell rings once, then stops. New lamps come on above the worker stairs.'},
 riggers:{name:'Flowers at every hundred',from:'Abyss riggers',requires:'commonPass',text:'Recover the rigger’s counterweight tag from the Abyss crown. The winch reaches it; ladders also work.',needs:['counterweightTag'],reward:{credits:75,gear:'surveykit'},result:'The riggers put a flower beside the last depth mark. The painted door keeps its handle.'}
});
UG.rooms.abyss.objects.find(o=>o.id==='abyss-cache').item='counterweightTag';

for(const id of ['nightshift','armistice','riggers','ledger','apprentice','homes','clinic','lung'])UG.contracts[id].side=true;
