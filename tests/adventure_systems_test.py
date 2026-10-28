"""Controlled Alpha 4 fixtures: abilities, replay objectives/rewards, runtime
recovery, movement affordances and input UI. Opening playthrough is separate."""
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':960});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8000/UNDERGRID_ADVENTURE.html?test');page.get_by_role('button',name='BEGIN EXPEDITION').click()
 results=page.evaluate('''()=>{
 const T=UG_TEST,out=[],ok=(v,n)=>{if(!v)throw Error(n);out.push(n)};
 function reset(){T.start();Math.random=()=>.05}
 function foe(id){return {...UG.enemyTypes[UG.rooms.cable.enemies.find(e=>e.id===id).type],...UG.rooms.cable.enemies.find(e=>e.id===id),...T.state.world.cable.enemies[id],enemy:true,maxhp:UG.enemyTypes[UG.rooms.cable.enemies.find(e=>e.id===id).type].hp}}
 reset();let legacy=T.fresh();delete legacy.adventure;delete legacy.world.trial;for(const a of legacy.party)for(const k of ['skills','abilityPoints','calibrations','quickSlots'])delete a[k];legacy.level=4;legacy.credits=93;legacy.world.cable.enemies.c1.hp=0;const migrated=T.validate(legacy);
 ok(migrated.credits===93&&migrated.party[0].abilityPoints===2,'Alpha 3 progression migrates with earned ability licences');ok(migrated.world.cable.enemies.c1.rewarded&&migrated.world.trial,'Old kills cannot be rewarded again; dispatch state is added');
 T.travel('cable',700,880);T.beginBattle(foe('c1'));ok(T.battle.ids.length===1,'A local patrol starts without distant district enemies');
 let hp=T.state.world.cable.enemies.c1.hp;T.shoot(T.selected,foe('c1'));T.shoot(T.selected,foe('c1'));ok(!T.battle&&T.state.world.cable.enemies.c2.hp>0,'Local victory resumes exploration while distant guards remain');
 let xp=T.state.xp,credits=T.state.credits,kills=T.state.kills;T.checkBattle();T.beginBattle();T.checkBattle();ok(T.state.xp===xp&&T.state.credits===credits&&T.state.kills===kills,'Claimed kills cannot be paid twice');
 // Drop and jump links use real geometry and keep their direction.
 reset();T.travel('cable',650,660);let r=T.route(T.selected,800,880);ok(r&&r.length<600,'Click routes prefer a short safe drop over a long ladder detour');
 T.travel('hearth',800,880);r=T.route(T.selected,805,830);ok(r&&r.points.some(p=>p.kind==='jump'),'Click navigation can hop onto the teaching ledge');
 T.moveTo(T.selected,1300,880,true);ok(T.paths.size>0,'Click route queued');T.fluidMovement(.01);ok(T.save(true)&&T.restore(),'Ordinary queued movement can save with safe footing');
 reset();Object.assign(T.selected,{x:868,y:830,vy:0});T.fluidMovement(.001);T.selected.x=877;T.requestJump();ok(T.selected.vy<0,'A brief step beyond an edge still accepts the jump');
 reset();Object.assign(T.selected,{x:805,y:819,vy:220});T.requestJump();T.fluidMovement(.04);T.fluidMovement(.01);T.fluidMovement(.001);ok(T.selected.vy<0,'A jump pressed just before landing is buffered');
 // Each ability is exercised in isolation with explicit fixture equipment.
 reset();T.travel('cable',700,880);T.beginBattle();T.selected.skills=['deadeye'];let base=T.combatWeapon(T.selected);ok(T.useSkill('deadeye')&&T.selected.ap===2&&T.combatWeapon(T.selected).acc===base.acc+20,'Deadeye trades AP for a stronger next shot');T.shoot(T.selected,foe('c1'));ok(!T.selected.aimed,'Deadeye is consumed by the next shot');
 reset();T.reward({weapon:'heavy'});T.selected.weapon='heavy';T.selected.mag=9;T.travel('cable',700,880);T.beginBattle();T.selected.skills=['brace'];let armor=T.armorSave(T.selected);ok(T.useSkill('brace')&&T.combatWeapon(T.selected).ap===1&&T.armorSave(T.selected)===armor+3,'Brace changes heavy firing cost and defense');T.moveTo(T.selected,800,880);ok(!T.selected.braced,'Movement breaks the heavy stance');
 reset();T.travel('cable',200,880);T.beginBattle();T.selected.skills=['dash'];ok(T.useSkill('dash'),'Dash arms a movement order');ok(T.moveTo(T.selected,650,880)&&T.selected.ap===2,'Dash covers a longer route for one AP');for(let i=0;i<10&&T.paths.size;i++)T.updatePaths(10);ok(!T.useSkill('dash'),'Dash cannot be repeated in the same round');
 reset();T.travel('cable',700,880);T.beginBattle();T.selected.skills=['patch'];T.selected.hp=20;let meds=T.state.meds;ok(T.useSkill('patch')&&T.selected.hp===55&&T.state.meds===meds,'Field patch heals without creating or spending medkits');T.selected.ap=3;ok(!T.useSkill('patch'),'Field patch is limited per encounter');
 reset();T.travel('cable',700,880);T.beginBattle();T.selected.skills=['overload'];ok(T.useSkill('overload')&&T.state.world.cable.enemies.c1.shocked&&T.state.world.cable.enemies.c1.suppressed,'Overload disables selected hostile actions');
 reset();T.travel('cable',700,880);T.beginBattle();T.selected.skills=['breach'];ok(T.useSkill('breach')&&T.battle.shaped,'Breach arms a shaped frag');let grenades=T.state.grenades;T.grenade(1000,880);ok(T.state.grenades===grenades-1&&T.selected.ap===1,'Shaped frag consumes the advertised AP and item');
 // Quick switching retains ammunition and has a tactical cost.
 reset();T.reward({weapon:'rifle'});T.selected.quickSlots=['pistol','rifle'];let total=T.state.ammo+T.selected.mag;T.action('quickweapon');ok(T.selected.weapon==='rifle'&&T.state.ammo+T.selected.mag===total,'Quick swap conserves all ammunition');T.travel('cable',700,880);T.beginBattle();T.action('quickweapon');ok(T.selected.ap===2,'Combat quick swap costs one AP');
 reset();T.state.ammo=0;T.selected.mag=0;T.state.meds=0;T.action('relief');ok(T.state.ammo===24&&T.state.meds===1,'Relief supplies recover from an empty kit');xp=T.state.xp;credits=T.state.credits;T.action('relief');ok(T.state.ammo===24&&T.state.xp===xp&&T.state.credits===credits,'Relief cannot farm XP, credits or excess ammunition');
 // Empty guns use the same barrier geometry as ordinary shots.
 reset();T.travel('pressure',930,1230);Object.assign(T.state.world.pressure.enemies.p1,{x:970,y:1230});T.selected.mag=0;T.beginBattle();let knifeHP=T.state.world.pressure.enemies.p1.hp;T.action('fire');ok(T.selected.ap===3&&T.state.world.pressure.enemies.p1.hp===knifeHP,'Emergency knife cannot strike through a sealed barrier');T.state.flags.vaultWall=true;T.action('fire');ok(T.selected.ap===2&&T.state.world.pressure.enemies.p1.hp<knifeHP,'Opening the barrier permits the advertised one-AP knife strike');
 // Replayable objectives are controlled fixtures; all resource transactions are real.
 reset();T.travel('market',560,880);const story=JSON.stringify(T.state.world.cable);ok(T.startActivity('salvage'),'Deliberately enter a dispatched job');ok(!T.save(true),'Jobs preserve the last safe checkpoint');Object.assign(T.selected,{x:1100,y:440});T.interact();ok(T.state.adventure.run.carrying,'Recover objective can be taken during tactical combat');Object.assign(T.selected,{x:1490,y:880});T.interact();T.adventureTick(0);ok(T.state.room==='market'&&T.state.adventure.activityWins.salvage===1&&T.state.mods.includes('focused'),'Extraction pays and unlocks its first-clear pattern');ok(JSON.stringify(T.state.world.cable)===story,'Optional work never repopulates a cleared story route');
 for(let n=1;n<6;n++){T.startActivity('salvage');Object.assign(T.selected,{x:1100,y:440});T.interact();Object.assign(T.selected,{x:1490,y:880});T.interact();const beforeXP=T.state.xp,beforeCredits=T.state.credits;T.adventureTick(0);if(n===5)ok(T.state.xp===beforeXP&&T.state.credits===beforeCredits,'Practice beyond five paid wins grants no rewards');}
 ok(T.activityRate(0)>T.activityRate(1)&&T.activityRate(1)>T.activityRate(2)&&T.activityRate(5)===0,'Replay rewards deliberately diminish');
 reset();T.travel('market',560,880);T.startActivity('defense');let health=T.state.adventure.run.assetHP;T.enemyStep('r1');ok(T.state.adventure.run.assetHP<health,'Attackers threaten the actual protected relay');T.state.adventure.run.assetHP=60;T.reward({scrap:5});Object.assign(T.selected,{x:600,y:880});let scrap=T.state.scrap;T.interact();ok(T.state.adventure.run.assetHP===95&&T.state.scrap===scrap-3&&T.selected.ap===2,'Defensive repairs cost resources and AP');
 T.state.adventure.run.assetHP=100;for(let i=0;i<3;i++)T.activityRoundEnd();T.adventureTick(0);ok(T.state.adventure.activityWins.defense===1&&T.state.gears.includes('blastliner'),'Holdout objective can win without killing all guards');
 reset();T.travel('market',560,880);T.startActivity('extraction');Object.assign(T.selected,{x:1490,y:880});T.interact();T.adventureTick(0);ok(T.state.adventure.activityWins.extraction===1,'Escape objective completes without compulsory elimination');
 reset();T.travel('market',560,880);T.startActivity('warrant');T.state.world.trial.enemies.r1.hp=0;T.checkBattle();T.adventureTick(0);ok(T.state.adventure.activityWins.warrant===1,'Named bounty ignores surviving escorts');
 reset();T.travel('market',560,880);T.startActivity('defense');T.state.adventure.run.assetHP=0;T.checkBattle();T.adventureTick(0);ok(!T.state.adventure.run&&!T.state.adventure.activityWins.defense&&T.state.room==='market','Failed protection work returns safely without victory rewards');
 // Lasting machinery, free contexts and runtime transit safety.
 reset();T.travel('garden',800,450);T.reward({scrap:3});T.interact();ok(T.state.flags.runoffIsolated,'Runoff control creates a persistent safe route');
 T.travel('furnace',420,880);T.interact();ok(T.state.flags.furnaceBelt===false,'Conveyor drive can be stopped with one contextual action');
 T.travel('docks',1040,440);let cargoHP=Object.values(T.state.world.docks.enemies).reduce((n,e)=>n+e.hp,0);T.interact();ok(T.state.flags.cargoDropped&&Object.values(T.state.world.docks.enemies).reduce((n,e)=>n+e.hp,0)<cargoHP,'Cargo release actually damages the hostile dock floor');let postCargo=JSON.stringify(T.state.world.docks.enemies);T.interact();ok(JSON.stringify(T.state.world.docks.enemies)===postCargo,'Cargo release cannot deal its blast twice');
 T.state.items.grapple=true;T.travel('tenement',1000,440);T.grapple(UG.rooms.tenement.objects.find(o=>o.type==='anchor'));T.enlist('vera');T.selectCrew(1);ok(T.paths.size>0,'Selecting crew cannot cancel a winch into a softlock');T.start();ok(!T.paths.size&&T.selected.id==='rook','Starting a new expedition clears all traversal runtime');
 ok(T.validate(T.restore()).adventure.version===1,'New progression and settings survive validation and reload');return out;
 }''')
 # Real input: forgiving ladder capture, interrupt a path, equipment tabs, quick fire.
 page.evaluate('UG_TEST.travel("hearth",280,880)');page.keyboard.down('w');page.wait_for_timeout(1300);page.keyboard.up('w')
 assert abs(page.evaluate('UG_TEST.selected.y')-660)<3
 page.evaluate('UG_TEST.moveTo(UG_TEST.selected,600,660,true)');page.keyboard.down('a');page.wait_for_timeout(250);page.keyboard.up('a')
 assert page.evaluate('UG_TEST.selected.x')<290
 page.keyboard.press('i');page.locator('[data-loadout-tab="armor"]').click();assert page.locator('[data-loadout-section="armor"]').is_visible();assert not page.locator('[data-loadout-section="weapons"]').is_visible()
 page.screenshot(path='/tmp/ua4-equipment.png');page.keyboard.press('Escape')
 page.evaluate('UG_TEST.travel("cable",700,880);UG_TEST.beginBattle()');page.keyboard.press('q');assert page.locator('#tactical [data-action="fire"]').is_disabled();page.keyboard.press('Space');assert page.evaluate('UG_TEST.selected.ap')==3
 page.keyboard.press('q');page.keyboard.press('q');page.keyboard.press('Space')
 assert page.evaluate('UG_TEST.selected.ap')==2
 page.screenshot(path='/tmp/ua4-combat.png')
 page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(200);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 assert page.locator('#moment').is_hidden()
 assert page.evaluate("""()=>{const bar=document.querySelector('#tactical'),r=bar.getBoundingClientRect();return [...bar.querySelectorAll('button')].every(b=>{const p=b.getBoundingClientRect();return p.left>=0&&p.right<=innerWidth&&p.bottom<=r.bottom+1})}""")
 page.screenshot(path='/tmp/ua4-mobile.png')
 # Actual file chooser import must cancel the old winch runtime as well as data.
 page.evaluate('UG_TEST.start();UG_TEST.state.items.grapple=true;UG_TEST.travel("tenement",1000,440)')
 saved=page.evaluate('JSON.stringify(UG_TEST.state)')
 page.evaluate('UG_TEST.grapple(UG.rooms.tenement.objects.find(o=>o.type==="anchor"))')
 with page.expect_file_chooser() as chooser:page.evaluate('UG_TEST.action("import")')
 chooser.value.set_files({'name':'safe.json','mimeType':'application/json','buffer':saved.encode()})
 page.wait_for_function('document.querySelector("#toast").textContent.includes("Expedition imported")')
 assert page.evaluate('!UG_TEST.paths.size&&UG_TEST.save(true)')
 assert not errors,errors
 print('PASS:',len(results)+11,'Alpha 4 systems/input checks; 0 page errors')
 for r in results:print(' PASS',r)
 b.close()
