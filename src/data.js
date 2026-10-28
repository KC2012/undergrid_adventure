'use strict';
// World coordinates are independent of viewport. Platforms are one-way floors;
// ladders form a graph used by squad movement and enemy pathfinding.
const UG = {};
UG.weapons = {
 pistol:{name:'Salvage pistol',range:520,opt:240,damage:16,mag:8,ap:1,acc:82,pen:1,desc:'Mobile sidearm. Cheap shots; dependable up close.'},
 rifle:{name:'Ward carbine',range:850,opt:440,damage:23,mag:6,ap:1,acc:84,pen:3,desc:'General purpose. Effective across shafts and catwalks.'},
 shotgun:{name:'Breach gun',range:300,opt:140,damage:35,mag:3,ap:1,acc:90,pen:0,desc:'Close range. Heavy knockback and suppression.'},
 sniper:{name:'Surveyor long rifle',range:1250,opt:800,damage:42,mag:3,ap:2,acc:93,pen:5,desc:'Two AP. Long range and armor penetration.'}
};
UG.enemyTypes={
 scav:{name:'Ash scavenger',hp:32,weapon:'pistol',armor:0,role:'flanker',xp:16},
 sentry:{name:'Ward deserter',hp:44,weapon:'rifle',armor:2,role:'marksman',xp:24},
 hound:{name:'Wire hound',hp:26,weapon:'pistol',armor:0,role:'rush',xp:18},
 heavy:{name:'Furnace guard',hp:62,weapon:'shotgun',armor:4,role:'flanker',xp:35},
 keeper:{name:'The Bellkeeper',hp:155,weapon:'rifle',armor:5,role:'boss',xp:120}
};
const platform=(id,x,y,w)=>({id,x,y,w});
const ladder=(x,top,bottom)=>({x,top,bottom});
const obj=(id,type,x,y,name,extra={})=>({id,type,x,y,name,...extra});
const enemy=(id,type,x,y)=>({id,type,x,y});
UG.rooms={
 hearth:{name:'Last Light',subtitle:'A settlement built around a borrowed sun.',depth:182,color:'#c9ef91',theme:'settlement',w:1600,h:1000,
 platforms:[platform('floor',0,880,1600),platform('market',170,660,490),platform('roof',910,660,540),platform('watch',580,440,500)],
 ladders:[ladder(240,660,880),ladder(1010,660,880),ladder(610,440,660)],
 objects:[obj('mara','npc',400,880,'Mara / signal keeper'),obj('cot','rest',160,880,'The warm bunk'),obj('shop','shop',440,660,'Ivo / supply exchange'),obj('hearth-note','lore',760,440,'A letter without a sky',{text:'Mara keeps a lamp burning above the bunks. Nobody remembers who started it. Nobody turns it off. The old relay rang last night. Three notes. A human voice between them.'}),obj('east','door',1490,880,'To the Cableworks',{to:'cable',sx:100,sy:880}),obj('down','door',1230,660,'Sump access',{to:'sump',sx:100,sy:880}),obj('tram','tram',970,440,'Dead rail terminal')],enemies:[],covers:[{id:'h1',x:740,y:880,hp:35}],barrels:[]},
 cable:{name:'The Cableworks',subtitle:'Every wire leads somewhere. Some still carry voices.',depth:206,color:'#a7ce86',theme:'works',w:1800,h:1000,
 platforms:[platform('floor',0,880,1800),platform('west',80,660,640),platform('east',940,660,770),platform('upper',520,440,800),platform('crown',1050,230,650)],
 ladders:[ladder(220,660,880),ladder(1090,660,880),ladder(650,440,660),ladder(1180,440,660),ladder(1230,230,440)],
 objects:[obj('west','door',70,880,'Last Light',{to:'hearth',sx:1400,sy:880}),obj('fuse','loot',1530,230,'A live relay fuse',{item:'fuse',text:'Still warm. The stamp reads: DO NOT ANSWER THE THIRD BELL.'}),obj('vera','recruit',520,660,'Vera / pinned courier',{companion:'vera'}),obj('cache-c','loot',300,660,'Courier ammunition',{ammo:24,meds:1}),obj('exit','door',1700,880,'The Furnace Mile',{to:'furnace',sx:100,sy:880}),obj('archive-exit','door',1700,230,'Upper archive hatch',{to:'archive',sx:100,sy:880,gate:'rig'})],
 enemies:[enemy('c1','scav',920,880),enemy('c2','scav',1340,880),enemy('c3','sentry',1450,660)],covers:[{id:'cbox1',x:740,y:880,hp:32},{id:'cbox2',x:1220,y:880,hp:32},{id:'cbox3',x:1320,y:660,hp:35}],barrels:[{id:'cb',x:1170,y:880}]},
 sump:{name:'The Drowned Sump',subtitle:'The water remembers the shape of the city.',depth:264,color:'#8ed5cd',theme:'water',w:1600,h:1000,
 platforms:[platform('floor',0,880,1600),platform('west',100,660,600),platform('east',880,660,620),platform('top',450,440,680)],
 ladders:[ladder(200,660,880),ladder(1030,660,880),ladder(620,440,660),ladder(980,440,660)],
 objects:[obj('home','door',60,880,'Last Light',{to:'hearth',sx:1230,sy:660}),obj('orren','recruit',1330,660,'Orren / stranded engineer',{companion:'orren'}),obj('rig','loot',750,440,'Surveyor climbing rig',{item:'rig',text:'A powered ascender. The sealed archive hatch is within reach now.'}),obj('sump-loot','loot',400,660,'Sealed maintenance chest',{weapon:'shotgun',credits:25}),obj('pump','relay',1410,880,'Drainage pump'),obj('furnace','door',1500,660,'Furnace underpass',{to:'furnace',sx:250,sy:660}),obj('sump-lore','lore',500,440,'Maintenance log 88',{text:'We built the city downward to escape the heat above. Now the heat comes from below. Someone has reversed the pumps.'})],
 enemies:[enemy('s1','hound',650,880),enemy('s2','hound',1100,880),enemy('s3','scav',1220,660)],covers:[{id:'sbox',x:900,y:880,hp:30}],barrels:[{id:'sb',x:960,y:880}]},
 furnace:{name:'The Furnace Mile',subtitle:'A stolen heart, still beating beneath the foundry.',depth:312,color:'#e7af73',theme:'fire',w:1800,h:1000,
 platforms:[platform('floor',0,880,1800),platform('west',120,660,600),platform('east',900,660,750),platform('bridge',430,440,1000)],
 ladders:[ladder(250,660,880),ladder(1060,660,880),ladder(650,440,660),ladder(1310,440,660)],
 objects:[obj('cable','door',60,880,'Cableworks',{to:'cable',sx:1650,sy:880}),obj('sump','door',180,660,'Sump passage',{to:'sump',sx:1400,sy:660}),obj('heart','loot',1550,660,'The condenser heart',{item:'heart',text:'A whole settlement could run on this. Why was it disconnected?'}),obj('furnace-cache','loot',550,440,'Deserter armory',{weapon:'rifle',ammo:30}),obj('bell','door',1710,880,'The Bell Engine',{to:'bell',sx:100,sy:880,gate:'signal'}),obj('steam','hazard',820,880,'Steam rupture'),obj('valve','valve',750,440,'Steam pressure valve')],
 enemies:[enemy('f1','heavy',1020,880),enemy('f2','sentry',1470,660),enemy('f3','scav',1150,440)],covers:[{id:'fbox1',x:650,y:880,hp:38},{id:'fbox2',x:1340,y:660,hp:38}],barrels:[{id:'fb',x:1210,y:880}]},
 archive:{name:'The Silent Archive',subtitle:'The forgotten do not always stay quiet.',depth:146,color:'#b8b0e4',theme:'archive',w:1500,h:1000,
 platforms:[platform('floor',0,880,1500),platform('west',100,660,550),platform('east',850,660,550),platform('top',420,440,700)],
 ladders:[ladder(230,660,880),ladder(1010,660,880),ladder(580,440,660),ladder(960,440,660)],
 objects:[obj('back','door',70,880,'Cableworks',{to:'cable',sx:1600,sy:230}),obj('cipher','loot',1050,440,'Signal cipher',{item:'cipher',text:'Not a distress signal. An invitation. The engine has been calling for its keepers.'}),obj('longrifle','loot',1220,660,'Surveyor case',{weapon:'sniper',ammo:15}),obj('archive-lore','lore',500,660,'The evacuation order',{text:'SURFACE STATUS: UNKNOWN. Evacuation was never completed. The Bell Engine is a transmitter, not a weapon. The wards were built to shelter people until someone answered.'}),obj('shortcut','tram',630,880,'Archive rail terminal')],
 enemies:[enemy('a1','sentry',900,880),enemy('a2','sentry',1200,660)],covers:[{id:'abox',x:720,y:880,hp:36}],barrels:[{id:'ab',x:1030,y:880}]},
 bell:{name:'The Bell Engine',subtitle:'At the edge of silence, a voice.',depth:370,color:'#d4e99f',theme:'engine',w:1700,h:1000,
 platforms:[platform('floor',0,880,1700),platform('west',150,660,500),platform('east',980,660,550),platform('top',490,440,800)],
 ladders:[ladder(260,660,880),ladder(1160,660,880),ladder(590,440,660),ladder(1090,440,660)],
 objects:[obj('back','door',65,880,'Furnace Mile',{to:'furnace',sx:1620,sy:880}),obj('engine','engine',1390,880,'The listening terminal'),obj('bell-loot','loot',700,440,'Keeper emergency supplies',{meds:3,ammo:30,grenades:2}),obj('bell-tram','tram',390,660,'Engine rail terminal')],
 enemies:[enemy('b1','keeper',1300,880),enemy('b2','sentry',1250,660),enemy('b3','hound',1030,880)],covers:[{id:'bbox',x:760,y:880,hp:45},{id:'bbox2',x:1110,y:880,hp:40}],barrels:[{id:'bb',x:1160,y:880}]}
};
UG.companions={vera:{name:'Vera',role:'Courier',weapon:'rifle',hp:66,armor:1,color:'#8ed5cd',desc:'A steady carbine and an eye for high ground. Her courier satchel adds 20 rounds on recruitment.'},orren:{name:'Orren',role:'Engineer',weapon:'shotgun',hp:85,armor:3,color:'#e7af73',desc:'A close-range anchor. Repairs the squad for 8 HP after each encounter.'}};
UG.lore={};
