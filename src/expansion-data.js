/* Wardbound: authored districts, Undergrid arsenal and survival contracts. */
Object.assign(UG.weapons,{
 smg:{name:'Submachine gun',range:490,opt:250,damage:12,mag:18,ap:1,acc:78,pen:1,burst:2,desc:'Two rounds per burst. Mobile suppression, costly ammunition.'},
 handcannon:{name:'Hand cannon',range:430,opt:180,damage:31,mag:5,ap:1,acc:72,pen:5,knock:24,desc:'Armor punch and knockback. Heavy recoil costs accuracy.'},
 needle:{name:'Needle pistol',range:550,opt:320,damage:13,mag:8,ap:1,acc:89,pen:6,toxin:5,desc:'Deep penetration. Toxin deals 5 damage at the next activation.'},
 laser:{name:'Laser rifle',range:1000,opt:600,damage:24,mag:8,ap:1,acc:93,pen:3,desc:'Long, accurate firing lanes. Low impact; no knockback.'},
 arc:{name:'Arc gun',range:600,opt:350,damage:25,mag:5,ap:1,acc:83,pen:4,shock:true,desc:'Shock removes an extra action point next activation.'},
 flame:{name:'Flame projector',range:320,opt:160,damage:25,mag:6,ap:1,acc:92,pen:1,burn:7,ignoreCover:true,desc:'Ignores low cover and ignites targets. Short range.'},
 launcher:{name:'Grenade launcher',range:700,opt:430,damage:32,mag:3,ap:2,acc:77,pen:2,blast:105,desc:'Two AP. Explosive impact harms anyone nearby, including allies.'},
 plasma:{name:'Plasma gun',range:800,opt:450,damage:44,mag:3,ap:2,acc:82,pen:6,blast:70,desc:'Heavy energy blast. Pierces armor; watch your crew’s spacing.'},
 heavy:{name:'Heavy machine gun',range:950,opt:550,damage:36,mag:9,ap:2,acc:78,pen:4,suppress:true,desc:'Two AP. Every shot suppresses, even a hit.'},
 chainblade:{name:'Chainblade',range:78,opt:60,damage:39,mag:0,ap:1,acc:94,pen:7,melee:true,desc:'No ammunition. Armor-ripping melee; close the distance first.'},
 railgun:{name:'Dead-letter marksman',range:1200,opt:700,damage:34,mag:5,ap:1,acc:90,pen:4,desc:'A courier’s custom marksman rifle. Earned by settling old accounts.'}
});
UG.weapons.shotgun.knock=20;
UG.armors={
 leathers:{name:'Patchwork leathers',save:0,move:35,desc:'Light and forgiving. +35 move units per AP.'},
 mesh:{name:'Ward mesh',save:3,move:0,desc:'+3 armor with no mobility penalty.'},
 plate:{name:'Breach plate',save:7,move:-45,desc:'+7 armor; -45 move units per AP.'},
 ceramic:{name:'Ceramic firecoat',save:4,move:-15,fire:true,desc:'+4 armor; immune to burn. -15 move units.'},
 ghost:{name:'Courier ghostweave',save:2,move:20,evade:10,desc:'+2 armor, +10 evasion, +20 move units.'},
 carapace:{name:'Blacksite carapace',save:9,move:-65,desc:'+9 armor; -65 move units. Rare armored anchor.'}
};
UG.gear={none:{name:'No gear',desc:'Travel light.'},targeter:{name:'Targeter',acc:8,desc:'+8 ranged accuracy.'},respirator:{name:'Respirator',toxin:true,desc:'Blocks toxin and chemical seep exposure.'},climbrig:{name:'Climbing rig',move:50,desc:'+50 units per move AP. Works on every ladder route.'},medrig:{name:'Field medic rig',heal:20,desc:'Medkits restore 20 extra HP.'},shockground:{name:'Grounding braid',shock:true,desc:'Immune to shock AP loss.'},salvager:{name:'Magnetic salvage rig',salvage:3,desc:'+3 salvage per cleared district. Each equipped rig contributes.'}};
UG.mods={none:{name:'Factory parts',desc:'No modification.'},sighted:{name:'Optic rail',acc:7,desc:'+7 accuracy; -2 damage.',damage:-2},hot:{name:'Hot-load breech',damage:6,acc:-7,desc:'+6 damage; -7 accuracy.'},piercer:{name:'Penetrator feed',pen:3,damage:-2,desc:'+3 penetration; -2 damage.'}};
UG.talents={aim:{name:'Steady hands',desc:'+3 ranged accuracy per rank.',max:4},power:{name:'Hard hitter',desc:'+2 weapon damage per rank.',max:4},runner:{name:'Tunnel legs',desc:'+20 move units per AP per rank.',max:4},medic:{name:'Street medicine',desc:'+8 medkit healing per rank.',max:4}};
UG.dyes={'phosphor':'#ccf58b',cyan:'#8ed5cd',amber:'#e7af73',violet:'#b8b0e4',rose:'#efb0ac'};
Object.assign(UG.enemyTypes,{
 smuggler:{name:'Rust Jackal',hp:52,weapon:'smg',armor:2,role:'flanker',xp:32},
 chemist:{name:'Sump needlehand',hp:48,weapon:'needle',armor:1,role:'marksman',xp:36},
 burner:{name:'Ashline torch',hp:64,weapon:'flame',armor:3,role:'flanker',xp:42},
 shocker:{name:'Relay enforcer',hp:66,weapon:'arc',armor:4,role:'marksman',xp:45},
 gunner:{name:'Belt-fed bruiser',hp:88,weapon:'heavy',armor:5,role:'marksman',xp:55},
 medic:{name:'Jackal stitcher',hp:50,weapon:'pistol',armor:2,role:'medic',xp:40},
 bomber:{name:'Demolition runner',hp:40,weapon:'handcannon',armor:0,role:'bomber',xp:35},
 drone:{name:'Survey drone',hp:38,weapon:'laser',armor:3,role:'marksman',xp:35},
 cutter:{name:'Chainblade collector',hp:80,weapon:'chainblade',armor:5,role:'rush',xp:50},
 jackal:{name:'Rusk / the toll collector',hp:165,weapon:'handcannon',armor:7,role:'boss',xp:130},
 warden:{name:'Contractor Nine',hp:210,weapon:'plasma',armor:8,role:'boss',xp:175}
});
UG.gates={power:'Restore Last Light’s power. Bring a live fuse to Mara.',rig:'A powered climbing rig is required. Search the Sump.',signal:'Mara must decode the signal before this bulkhead opens.',railPass:'Repair the freight locomotive. See Switch at Rustmarket.',sluice:'Deliver filter membranes to the clinic, then open the sluice.',liftPower:'Recover a power coupler and repair the counterweight lift.',blackkey:'Settle Vera’s courier ledger at the contract board for an access key.',convoy:'Escort the freight train before entering the outer sidings.'};
// Each layout is authored separately. Geometry arrays are [x,y,width].
function district(id,name,subtitle,depth,color,theme,geometry,ladderData,objects,foes,coverData,barrelData){
 UG.rooms[id]={name,subtitle,depth,color,theme,w:1900,h:1000,platforms:geometry.map((p,i)=>platform(i?'deck'+i:'floor',...p)),ladders:ladderData.map(l=>ladder(...l)),objects,enemies:foes.map(e=>enemy(...e)),covers:coverData.map((p,i)=>({id:id+'-c'+i,x:p[0],y:p[1],hp:45})),barrels:barrelData.map((p,i)=>({id:id+'-b'+i,x:p[0],y:p[1]}))};
}
const door=(id,x,y,name,to,sx=100,sy=880,gate)=>obj(id,'door',x,y,name,{to,sx,sy,gate});
const loot=(id,x,y,name,extra)=>obj(id,'loot',x,y,name,extra);
const lore=(id,x,y,name,text)=>obj(id,'lore',x,y,name,{text});
UG.rooms.hearth.objects.push(door('market-road',190,660,'Rustmarket / freight concourse','market',100,880,'power'),obj('wardboard','contracts',720,880,'Last Light / work board'));
UG.rooms.bell.objects.push(door('dead-rail',1470,660,'The Dead Rail','deadrail',120,880,'signal'));
UG.rooms.archive.objects.find(o=>o.id==='archive-lore').text='A stack of passenger manifests with every destination scratched out. The tickets are still being issued. Someone on the other end keeps collecting the fares.';
UG.rooms.archive.objects.find(o=>o.id==='cipher').text='Freight routing codes hidden inside a maintenance hymn. Vera recognizes the courier stamp. She refuses to say whose it is.';
UG.rooms.sump.objects.find(o=>o.id==='sump-lore').text='PUMP SHIFT 88: Paid two days late. Filter order cancelled. If the water goes black again, tell the office it was black when we got here.';
district('market','Rustmarket','Debts, diesel and second chances. Nothing here is free.',221,'#d3c38b','settlement',
 [[0,880,1900],[80,660,700],[1050,660,750],[450,440,1000]],[[240,660,880],[1230,660,880],[650,440,660],[1180,440,660]],
 [door('home',70,880,'Last Light','hearth',190,660),obj('switch','contracts',560,880,'Switch / freight dispatcher'),obj('bench','workbench',760,660,'Tinker’s bench'),obj('supply','shop',380,660,'Ivo’s wholesale counter'),obj('bunks','rest',220,880,'Crew bunks'),obj('market-tram','tram',1340,880,'Freight concourse'),door('yard',1800,880,'Switchyard Nine','yard'),door('clinic',1720,660,'The Blackwater Gardens','garden'),door('lift',1420,440,'Counterweight station','skyhooks',120,880,'liftPower'),lore('market-note',820,440,'Missing shift','A photograph pinned beneath a debt notice. Orren checks the face and turns the notice around. “Not this time,” he says.')],[],[[950,880]],[]);
district('yard','Switchyard Nine','A locomotive waits on blocks. The Jackals charge rent for its shadow.',248,'#bdbb85','rail',
 [[0,880,1900],[140,680,530],[850,680,950],[440,470,830],[1180,250,620]],[[280,680,880],[1020,680,880],[580,470,680],[1230,470,680],[1250,250,470]],
 [door('market',70,880,'Rustmarket','market',1740,880),loot('axle',1560,250,'Freight axle assembly',{item:'axle',scrap:5}),obj('locomotive','vehicle',1600,880,'Locomotive 09 / service hatch'),door('slag',1760,680,'Ashline / slag terraces','slag',100,880),door('works',1800,250,'The Rivet Foundry','foundry',100,880),loot('toolbox',450,680,'Track crew tool chest',{gear:'climbrig',scrap:8}),lore('yard-ticket',740,470,'An unpaid fare','A child’s drawing in the locomotive cab: three people and a dog, all wearing respirators. On the back, a destination nobody at the yard admits to knowing.')],
 [['y1','smuggler',1000,880],['y2','medic',1450,880],['y3','sentry',1430,680]],[[710,880],[1280,880],[1250,680]],[[1180,880],[1500,680]]);
district('slag','Ashline Terraces','Orange light. Black snow. A toll at every ladder.',338,'#e9a775','fire',
 [[0,880,1900],[90,690,750],[1090,690,710],[380,470,610],[1120,470,660],[700,250,700]],[[250,690,880],[1250,690,880],[600,470,690],[1260,470,690],[860,250,470],[1200,250,470]],
 [door('yard',65,880,'Switchyard Nine','yard',1770,680),loot('diesel',1540,470,'Sealed diesel canister',{item:'diesel',scrap:5}),loot('torch-case',500,470,'Ashline flame-projector case',{weapon:'flame',armorKey:'ceramic',ammo:24}),obj('rusk-cache','salvage',1610,880,'Rusk’s toll safe'),door('docks',1800,880,'The Cinder Docks','docks',120,880,'sluice'),lore('slag-scar',1000,250,'Twenty-seven names','Someone has scratched twenty-seven names into a pipe. The newest name has been crossed out. There is wet paint on Rusk’s glove.')],
 [['sl1','burner',1100,880],['sl2','bomber',1450,880],['sl3','jackal',1600,690],['sl4','smuggler',1300,470]],[[760,880],[1320,880],[1430,690]],[[1000,880],[1200,880],[1510,690]]);
district('foundry','The Rivet Foundry','The machines stopped. The payroll kept going.',290,'#cca98b','works',
 [[0,880,1900],[80,650,590],[820,650,1000],[420,420,650],[1170,420,650],[850,210,620]],[[260,650,880],[1020,650,880],[560,420,650],[1310,420,650],[980,210,420],[1250,210,420]],
 [door('yard',70,880,'Switchyard Nine','yard',1740,250),loot('drive',1500,650,'Locomotive drive regulator',{item:'drive',scrap:6}),loot('coupler',1280,210,'Counterweight power coupler',{item:'coupler'}),loot('foundry-armor',600,420,'Breach-worker locker',{armorKey:'plate',weapon:'heavy',ammo:27}),obj('apprentice','rescue',1620,420,'Nix / Orren’s former apprentice'),door('blacksite',1830,880,'Blacksite Delta freight lock','blacksite',100,880,'blackkey')],
 [['fo1','gunner',1000,880],['fo2','shocker',1450,650],['fo3','cutter',1600,880]],[[720,880],[1260,650],[1410,880]],[[1230,880],[1430,650]]);
district('garden','Blackwater Gardens','Mushrooms for supper. Chemicals for breakfast.',312,'#88c9a1','water',
 [[0,880,1900],[120,670,650],[970,670,830],[460,450,1000],[100,240,610]],[[250,670,880],[1100,670,880],[620,450,670],[1220,450,670],[580,240,450]],
 [door('market',65,880,'Rustmarket','market',1680,660),loot('membrane',540,240,'Unopened filter membranes',{item:'membrane',gear:'respirator'}),loot('needle-case',1360,450,'Chemical survey kit',{weapon:'needle',scrap:6}),obj('chemical-seep','chemical',810,880,'Chemical seep / respirator advised'),door('dock',1760,670,'Drainage sluice / Cinder Docks','docks',100,880,'sluice'),lore('garden-book',500,670,'A cook’s ledger','One column for mouths fed. One for debts. For the last three weeks, someone has been paying the difference with stolen ammunition.')],
 [['g1','chemist',1080,880],['g2','hound',1390,880],['g3','chemist',1430,670]],[[700,880],[1250,880],[1330,670]],[[1160,880]]);
district('docks','Cinder Docks','A market on chains above an ocean nobody has measured.',392,'#8ecbd0','water',
 [[0,880,1900],[80,660,550],[790,660,1040],[420,440,690],[1300,440,510],[900,230,640]],[[250,660,880],[1000,660,880],[570,440,660],[1430,440,660],[1000,230,440],[1420,230,440]],
 [door('garden',60,880,'Blackwater Gardens','garden',1750,670),door('slag',170,660,'Ashline pipe road','slag',1760,880),loot('cargo',1510,230,'Stolen clinic shipment',{item:'clinicCargo',meds:2}),loot('dock-armory',1550,440,'Smuggler weapons crate',{weapon:'launcher',gear:'salvager',scrap:8}),obj('dock-tram','tram',450,880,'Dock cargo rail'),lore('dock-rope',1020,440,'The empty cradle','A cable cradle descends into black water. Every morning it returns with fresh bootprints. Tonight there are two sets.')],
 [['d1','smuggler',950,880],['d2','medic',1350,880],['d3','bomber',1500,660],['d4','sentry',1470,440]],[[720,880],[1190,880],[1340,660]],[[1080,880],[1300,880],[1400,660]]);
district('deadrail','The Dead Rail','Old fares. Older grudges. Vera knows the way.',365,'#b7b0da','rail',
 [[0,880,1900],[160,680,680],[1050,680,740],[470,450,870],[980,240,730]],[[300,680,880],[1190,680,880],[650,450,680],[1210,450,680],[1180,240,450]],
 [door('bell',65,880,'Bell Engine service road','bell',1480,660),loot('ledger',1500,240,'Vera’s courier ledger',{item:'ledger'}),loot('courier-kit',650,450,'A courier’s spare skin',{armorKey:'ghost',gear:'targeter',scrap:6}),door('yard',1790,880,'Freight cut / Switchyard Nine','yard',1650,880,'railPass'),lore('dead-ticket',500,680,'An unsent apology','“Vera: I didn’t sell you out. I sold the route. I thought you’d already left.” The envelope contains enough credits for one ticket. No name.')],
 [['dr1','smuggler',950,880],['dr2','sentry',1300,680],['dr3','drone',1460,450]],[[700,880],[1150,680]],[[1120,880],[1260,680]]);
district('skyhooks','The Skyhook Stack','A city suspended on counterweights and bad promises.',125,'#d0d3a2','lift',
 [[0,880,1900],[90,680,470],[780,680,1030],[350,470,650],[1160,470,640],[660,250,850]],[[230,680,880],[980,680,880],[480,470,680],[1320,470,680],[830,250,470],[1360,250,470]],
 [door('market',65,880,'Rustmarket counterweight lift','market',1370,440),loot('wages',1400,250,'Missing lift-workers’ wages',{item:'wages',credits:30}),loot('sky-armory',1460,470,'Union watch locker',{weapon:'laser',gear:'shockground',armorKey:'mesh'}),obj('sky-tram','tram',400,880,'Upper freight rail'),lore('sky-note',500,470,'A little garden','A tomato plant growing from a helmet. Someone has rigged a rifle targeter to turn its light toward the leaves. In a place like this, that is a serious commitment.')],
 [['sk1','drone',980,880],['sk2','shocker',1400,680],['sk3','gunner',1310,470]],[[720,880],[1230,680],[1260,470]],[[1120,880],[1400,680]]);
district('blacksite','Blacksite Delta','No insignia. No receipts. The armory is still warm.',440,'#92bfcd','archive',
 [[0,880,1900],[100,650,620],[940,650,850],[420,430,740],[1230,430,570],[900,220,700]],[[270,650,880],[1110,650,880],[590,430,650],[1370,430,650],[1020,220,430],[1380,220,430]],
 [door('foundry',65,880,'Foundry freight lock','foundry',1760,880),loot('blackcase',1490,220,'Unregistered weapons cache',{weapon:'plasma',armorKey:'carapace',item:'blackcase',scrap:10}),loot('delta-gear',1500,430,'Contingency locker',{weapon:'arc',gear:'medrig',meds:3}),lore('delta-note',550,430,'Transfer order','Three signatures. All the same handwriting. Orren folds the paper, puts it back, and tells you there are better things to steal.')],
 [['bs1','warden',1380,880],['bs2','drone',1510,650],['bs3','shocker',1180,430],['bs4','medic',1030,880]],[[760,880],[1200,880],[1380,650]],[[1050,880],[1250,880],[1400,650]]);
district('convoy','The Rolling Mile','One train. One payroll. Everybody wants a piece.',273,'#d4bc8e','convoy',
 [[0,880,1900],[80,680,600],[900,680,920],[450,460,850]],[[250,680,880],[1080,680,880],[610,460,680],[1220,460,680]],
 [obj('cab','vehicle',1700,880,'Locomotive cab / finish the run'),loot('convoy-kit',560,460,'Escort emergency locker',{meds:3,ammo:36,grenades:2}),obj('convoy-exit','convoyExit',100,880,'Brake van / abandon run')],
 [['cv1','bomber',980,880],['cv2','smuggler',1290,880],['cv3','gunner',1530,680]],[[730,880],[1170,880],[1350,680]],[[1090,880],[1310,880],[1440,680]]);
UG.contracts={
 freight:{name:'A living on the rails',from:'Switch / Freight Union',text:'The locomotive needs an axle, diesel and a drive regulator. Salvage the yard, Ashline and Rivet Foundry. A working train means paid work for all of us.',needs:['axle','diesel','drive'],reward:{credits:110,scrap:12,flag:'railPass',weapon:'smg'},result:'Locomotive 09 runs again. You have a freight charter. The escort contract is now available.'},
 water:{name:'What we drink',from:'Clinic / Last Light',text:'Recover unopened filter membranes above the Blackwater Gardens. The clinic will open the dock sluice in exchange.',needs:['membrane'],reward:{credits:65,scrap:6,flag:'sluice',gear:'respirator'},result:'The taps run clear. The clinic gives you the Cinder Docks sluice code.'},
 lift:{name:'The weight of wages',from:'Lift-workers’ union',text:'A power coupler from the Foundry will restart the counterweight lift. The Skyhook Stack has been cut off for weeks.',needs:['coupler'],reward:{credits:70,scrap:8,flag:'liftPower',gear:'climbrig'},result:'The counterweights move. A new district hangs above Rustmarket.'},
 ledger:{companion:'vera',name:'Old routes, old wounds',from:'Vera / courier debt',text:'Someone at the Dead Rail kept a ledger of sold routes. Find it. Bring Vera if you want to hear her side.',needs:['ledger'],choices:[{id:'burn',name:'Burn the ledger / protect the couriers',text:'Vera holds the flame without shaking. “Now we owe them nothing.”',bond:2,rep:2,reward:{credits:35,weapon:'railgun',flag:'blackkey'}},{id:'sell',name:'Sell it to the broker / take the money',text:'The broker counts the money twice. Vera says nothing for the rest of the trip.',bond:-1,rep:-2,reward:{credits:160,weapon:'railgun',flag:'blackkey'}}],reward:{scrap:8},result:'An old freight access key falls out of the binding. Blacksite Delta is reachable through the Foundry.'},
 apprentice:{companion:'orren',name:'The kid who stayed',from:'Orren / Rivet Foundry',text:'Nix stayed behind to keep the foundry pumps alive. Get them out. Orren swears he does not care. He checks every doorway.',needs:['nix'],choices:[{id:'clinic',name:'Send Nix to the clinic / bring the medicine',text:'Nix gets a clean bunk. Orren sits beside it until morning.',bond:2,rep:2,reward:{meds:4,gear:'medrig'}},{id:'crew',name:'Give Nix a workshop / take the tools',text:'Nix opens a bench at Rustmarket. Orren leaves his old wrench on it.',bond:1,rep:1,reward:{scrap:22,weapon:'handcannon'}}],reward:{credits:55},result:'Nix made it back. For once, a debt is paid in something other than blood.'},
 cargo:{name:'Medicine before bullets',from:'Clinic / Cinder Docks',text:'The Jackals lifted a clinic shipment. Retrieve it from the crane deck above Cinder Docks.',needs:['clinicCargo'],reward:{credits:85,meds:3,gear:'medrig'},result:'The clinic puts your crew’s name on the wall. Not as patients, this time.'},
 wages:{name:'Payday at gunpoint',from:'Skyhook lift-workers',text:'The missing wages are in an enforcer’s lockbox at the top of the Stack. Return them before the workers start taking the lift apart.',needs:['wages'],reward:{credits:110,scrap:10,armorKey:'ghost'},result:'Someone buys a round. Someone starts singing. For an evening, the Stack feels like a home.'},
 toll:{name:'No more tolls',from:'Ashline tenants',text:'Rusk has been taxing the ladders. Clear the Ashline Terraces and let the shift workers move freely.',clear:'slag',reward:{credits:100,scrap:12,weapon:'handcannon'},result:'The toll notices come down. Rusk’s old safe is yours to crack.'},
 escort:{name:'The Rolling Mile',from:'Switch / Freight Union',text:'Repair the locomotive, board at Switchyard Nine, and bring the freight through an ambush. The first job is never the easy one.',needs:['convoyReceipt'],requires:'railPass',reward:{credits:150,scrap:15,flag:'convoy',weapon:'launcher'},result:'The train arrives with its cargo intact. Switch calls you reliable. In the wards, that is almost a title.'},
 cache:{name:'No receipts',from:'Anonymous / Blacksite Delta',text:'A caller wants the serial plates from an unregistered weapons cache. You keep the weapons. Do not ask who signed the order.',needs:['blackcase'],requires:'blackkey',reward:{credits:180,scrap:18,armorKey:'carapace'},result:'The caller pays without speaking. Later, your contract record is missing. The credits are real.'}
};
UG.roomConnections=()=>Object.entries(UG.rooms).flatMap(([id,r])=>r.objects.filter(o=>o.type==='door').map(o=>({from:id,to:o.to,gate:o.gate})));
