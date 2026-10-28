/* Alpha 4: existing-world improvements and deliberately entered challenges. */
UG.roomTiers={hearth:0,cable:1,sump:1,furnace:2,archive:2,bell:3,market:0,yard:2,slag:3,foundry:3,garden:2,docks:3,deadrail:3,skyhooks:4,blacksite:5,convoy:3,tenement:1,vents:4,pressure:4,excavator:6,quiet:0,trial:0};
UG.skills={
 deadeye:{name:'Deadeye',role:'PRECISION',cost:1,desc:'1 AP: +20 accuracy and +2 penetration for your next shot this round.'},
 brace:{name:'Brace',role:'HEAVY / SURVIVAL',cost:1,desc:'1 AP: two-AP guns cost one AP and gain +3 armor until next round. Moving breaks the stance.'},
 dash:{name:'Combat dash',role:'MOBILITY',cost:1,desc:'1 AP: your next movement can cover 1.8× normal route distance. Once per round.'},
 patch:{name:'Field patch',role:'MEDICAL',cost:1,desc:'1 AP: heal the most injured nearby crew member for 35 and clear burn/toxin. No kit; once per encounter.'},
 overload:{name:'Overload',role:'TECHNICAL',cost:1,desc:'1 AP: shock and suppress the selected hostile within 600 units and clear line of sight. Once per encounter; machinery takes 12 damage.'},
 breach:{name:'Shaped frag',role:'EXPLOSIVES',cost:2,desc:'2 AP + one frag: aim a stronger 53-damage blast. Allies still take damage.'}
};
UG.weaponSources={pistol:'Starter equipment',rifle:'Restore Last Light for Mara',shotgun:'Sump maintenance chest',sniper:'Archive surveyor case',smg:'Repair the freight locomotive',handcannon:'Ashline bounty or workbench',needle:'Blackwater survey cache',laser:'Skyhook watch locker',arc:'Blacksite locker or workbench',flame:'Ashline weapons case',launcher:'Dock armory or freight escort',plasma:'Blacksite unregistered cache',heavy:'Rivet Foundry locker',chainblade:'Workbench pattern',railgun:'Settle Vera’s courier ledger'};
// Small physical steps teach jumping without disrupting the original ladder paths.
UG.rooms.hearth.platforms.push(platform('step-one',780,830,90),platform('step-two',920,775,90),platform('step-three',1050,720,90));
UG.rooms.hearth.objects.push(loot('starter-stash',805,830,'A drifter’s spare magazine',{ammo:12,scrap:3}));
// A restrained set of authored encounter groups, rather than every floor at once.
const squads={cable:{c1:'gate',c2:'gantry',c3:'gantry'},sump:{s1:'pumps',s2:'pumps',s3:'walkway'},furnace:{f1:'floor',f2:'upper',f3:'upper'},archive:{a1:'stacks',a2:'balcony'},yard:{y1:'freight',y2:'freight',y3:'roof'},garden:{g1:'waterline',g2:'waterline',g3:'balcony'}};
for(const [id,groups] of Object.entries(squads))for(const e of UG.rooms[id].enemies)e.squad=groups[e.id];
UG.mods.focused={name:'Union focus rail',acc:11,damage:0,desc:'+11 accuracy. An awarded precision pattern; no damage tradeoff.'};
UG.gear.blastliner={name:'Blast liner',blastResist:true,desc:'Halves incoming explosion damage. Awarded by freight defense work.'};
UG.activities={
 salvage:{name:'The lost consignment',tier:2,objective:'recover',fee:0,xp:65,credits:45,scrap:7,reward:{mod:'focused'},desc:'Recover a freight case and carry it to the exit. You can fight, bypass or suppress its guards.',foes:[['r1','scav',750,880],['r2','sentry',1230,660],['r3','hound',1100,880]]},
 defense:{name:'Three minutes of light',tier:3,objective:'defend',rounds:3,fee:10,xp:95,credits:70,scrap:10,reward:{gear:'blastliner'},desc:'Keep the relay intact through three hostile rounds, or repel all attackers sooner. Its health is separate from your crew.',foes:[['r1','smuggler',1050,880],['r2','sentry',1250,660],['r3','heavy',1390,880]]},
 extraction:{name:'Wrong side of the cordon',tier:5,objective:'escape',fee:10,xp:110,credits:85,scrap:12,reward:{weapon:'laser'},desc:'Reach the extraction hatch. An elite cordon is guarding the direct road. Killing everyone is optional.',foes:[['r1','gunner',1100,880],['r2','shocker',1300,660],['r3','cutter',1390,880]]},
 warrant:{name:'Collector’s last notice',tier:5,objective:'leader',fee:15,xp:130,credits:100,scrap:14,reward:{weapon:'handcannon'},desc:'Defeat the named collector. Its escort is not the objective. Watch the elevated firing lane.',foes:[['r1','jackal',1230,880],['r2','sentry',1350,660],['r3','hound',1050,880]]}
};
UG.rooms.trial={name:'Freight work site',subtitle:'Paid work. Real ammunition. Your choice to take it.',depth:280,color:'#c9c091',theme:'rail',w:1600,h:1000,platforms:[platform('floor',0,880,1600),platform('west',80,660,550),platform('east',880,660,640),platform('bridge',380,440,850)],ladders:[ladder(220,660,880),ladder(1080,660,880),ladder(540,440,660),ladder(1110,440,660)],objects:[obj('job-case','activity',1100,440,'Freight consignment'),obj('job-exit','activity',1490,880,'Extraction hatch'),obj('job-abort','activity',90,880,'Return to dispatcher')],enemies:[],covers:[{id:'trial-c1',x:610,y:880,hp:40},{id:'trial-c2',x:1000,y:880,hp:45},{id:'trial-c3',x:1170,y:660,hp:40}],barrels:[{id:'trial-b1',x:930,y:880}]};

UG.rooms.trial.objects.push(obj('job-relay','activity',600,880,'Relay / repair +35 HP'));
// Three existing sites get tangible, persistent work-floor interactions.
UG.utilities={belt:{room:'furnace',kind:'belt',x:420,y:880,name:'Foundry conveyor drive'},crane:{room:'docks',kind:'cargo',x:1040,y:440,name:'Hanging cargo release'},runoff:{room:'garden',kind:'drain',x:800,y:450,name:'Runoff isolation valve'}};
for(const [id,u] of Object.entries(UG.utilities))UG.rooms[u.room].objects.push(obj('utility-'+id,'utility',u.x,u.y,u.name,{utility:id}));
