/* Strange Industry: preserve room/enemy identities for old saves. */
Object.assign(UG.enemyTypes,{
 pressurediver:{name:'Pressure diver / ninth shift',hp:88,weapon:'shotgun',armor:4,role:'flanker',xp:45},
 shepherd:{name:'Cable shepherd',hp:90,weapon:'rifle',armor:2,role:'fixed',xp:48},
 rivet:{name:'Rivet penitent',hp:94,weapon:'handcannon',armor:4,role:'flanker',xp:48},
 kiln:{name:'Kiln carrier',hp:100,weapon:'flame',armor:3,role:'flanker',xp:52},
 inspector:{name:'Unfinished inspector',hp:88,weapon:'laser',armor:2,role:'fixed',xp:48}
});
Object.assign(UG.gear,{
 baffle:{name:'Choirmaster’s baffle',move:15,windGuard:true,desc:'A salvaged acoustic pressure collar. Halves industrial telegraph blast damage, protects from stride exhaust; +15 movement per AP.'},
 relaySpool:{name:'Widow’s relay spool',acc:5,shock:true,fieldInterface:true,desc:'A ceramic contact reel: +5 accuracy, shock insulation, and an engineering interface for Strange Industry controls without a specialist.'},
 walkingRig:{name:'Last-step retrieval rig',move:30,salvage:2,grapple:750,desc:'A foundry recovery harness: +30 movement per AP, +2 victory salvage, and a 750-range winch without the tenants’ tool.'}
});
UG.rooms.vents.color='#e4b075';UG.rooms.vents.subtitle='Leather lungs, iron ribs. The workers sleep between breaths.';
UG.rooms.orchard.color='#b6a2da';UG.rooms.orchard.subtitle='Porcelain fruit. Copper roots. Every branch carries a different voltage.';
for(const [id,type] of [['v1','pressurediver'],['v2','rivet'],['v3','shepherd']])UG.rooms.vents.enemies.find(e=>e.id===id).type=type;
for(const [id,type] of [['or1','kiln'],['or2','inspector'],['or3','shepherd']])UG.rooms.orchard.enemies.find(e=>e.id===id).type=type;
const industrial=(id,x,y,name,kind,extra={})=>obj(id,'industry',x,y,name,{kind,...extra});
UG.rooms.vents.platforms.push({...platform('bellows-crossing',580,1160,190),kind:'oneway'});
UG.rooms.vents.ladders.push({...ladder(710,900,1160),gate:'ventAir'});
UG.rooms.vents.objects.push(
 industrial('air-router',390,1200,'Choir manifold / route air','air'),
 industrial('choir-record',390,900,'The ninth shift / punched roll','record',{record:'choir'}),
 industrial('baffle-case',1260,590,'Choirmaster’s locker','cache',{cache:'baffle'}),
 industrial('vent-worker',290,1480,'Moth / bellows stitcher','worker'),
 door('walking-road',370,1480,'Walking Foundry / intake cradle','walker',110,1320,'ventPower')
);
UG.rooms.orchard.platforms.push({...platform('orchard-bough',960,830,100),kind:'oneway'});
UG.rooms.orchard.ladders.push({...ladder(1040,420,880),gate:'orchardWork'});
UG.rooms.orchard.objects.push(
 industrial('root-switch',430,880,'Root exchange / allocate current','power'),
 industrial('inspector-roll',320,650,'Inspection spool / conflicting orders','record',{record:'orders'}),
 industrial('spool-case',1390,420,'Ceramic root locker','cache',{cache:'relaySpool'})
);
UG.gates.ventPower='Restore the Vent Cathedral generator to release the Walking Foundry intake cradle.';
greaterRoom('walker','The Walking Foundry','A city-sized machine, caught halfway through its next step.',702,'#d39988','walking',2100,1450,
 [[0,1320,2100],[70,1100,570],[800,1100,1190],[330,920,620],[1140,920,750],[660,700,920],[120,480,590],[1060,480,820]],
 [[240,1100,1320],[970,1100,1320],[480,920,1100],[1400,920,1100],[760,700,920],[1330,700,920],[680,480,700],[1220,480,700]],
 [door('vents',80,1320,'Vent Cathedral / return cradle','vents',420,1480),industrial('stride-drive',540,1100,'Stride governor / wake the machine','drive'),industrial('carrier-dump',780,1320,'Cargo cradle / emergency discharge','dump'),industrial('walker-orders',430,920,'Inspector’s replacement orders','record',{record:'orders'}),industrial('walker-worker',250,1100,'Hess / last retrieval shift','worker'),industrial('last-step',1590,480,'Last-step retrieval locker','cache',{cache:'walkingRig'}),industrial('home-feed',1020,700,'Auxiliary feed / choose destination','feed'),industrial('walker-letter',500,480,'A boot bolted to the floor','record',{record:'boot'}),loot('walker-supplies',420,1320,'Intake service kit',{ammo:32,meds:2,grenades:1})],
 [['wk-diver','pressurediver',1240,1320],['wk-kiln','kiln',1600,1320],['wk-rivet','rivet',1120,1100],['wk-inspector','inspector',1530,700],['wk-shepherd','shepherd',1450,700],['wk-reserve','inspector',1740,1100]],
 [[720,1320],[1350,1100],[1290,920]],[[1450,1320]]);
UG.rooms.walker.enemies.find(e=>e.id==='wk-reserve').dormant=true;
UG.rooms.walker.platforms.push({...platform('stride-step',670,1040,100),kind:'oneway'});
UG.rooms.walker.ladders.push({...ladder(1010,700,1100),gate:'walkerDrive'});
UG.roomTiers.walker=4;
UG.contracts.lastBreath={name:'A breath worth keeping',from:'Moth / Vent workers',side:true,companion:'latch',text:'Read the Cathedral’s ninth-shift roll, restart the Walking Foundry stride drive and send its auxiliary supply to occupied homes or the retrieval crew. Return to a work board with Latch.',needs:['choirRoll','foundryFeed'],reward:{credits:85,scrap:10},result:'Latch replaces an obsolete evacuation order with a maintenance promise. Moth hangs the signed roll beside the Ward’s new air intake.'};

UG.rooms.vents.objects.push(industrial('rivet-roll',470,1200,'Fasteners / disciplinary docket','record',{record:'discipline'}));
UG.rooms.orchard.objects.push(industrial('tether-roll',650,420,'Cable shepherd / service wages','record',{record:'tether'}));
UG.rooms.walker.objects.push(industrial('cargo-roll',1810,1100,'Kiln carrier / undelivered load','record',{record:'cargo'}));
