"""Alpha 7 retained Ward controlled integration fixtures; distinct from fresh normal-action play."""
from playwright.sync_api import sync_playwright
from pathlib import Path
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':960});errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8000/UNDERGRID_ADVENTURE.html?test');page.get_by_role('button',name='BEGIN EXPEDITION').click()
 result=page.evaluate('''()=>{
 const T=UG_TEST,out=[],ok=(v,n)=>{if(!v)throw Error(n);out.push(n)};
 const reset=()=>{T.start();T.close();},clear=()=>{for(const q of Object.values(T.state.world[T.state.room].enemies))q.hp=0;T.checkBattle();};
 T.action('journal');document.querySelector('[data-journal-tab="expeditions"]').click();ok(!!document.querySelector('#panel [data-action="ward"]')&&!!document.querySelector('#panel [data-action="rumors"]'),'Ward and rumor navigation remain available after journal tab changes');T.close();
 ok(UG.rooms.hearth.name==='Disintegration Ward','Settlement uses its permanent name');
 const old=T.fresh();delete old.ward;const d=T.validate(old);ok(d.ward.version===1&&d.room==='hearth','Alpha 5 migration retains stable hearth identity');
 for(const [id,p] of Object.entries(UG.wardProjects))ok(!!T.route(T.selected,p.x,p.y),'Project is physically reachable: '+id);
 ok(!T.wardBuild('workshop'),'Cannot commission a remote project without materials');
 T.reward({credits:1000,scrap:1000});T.state.ward.machinery=2;T.state.flags.power=true;
 for(const [id,p] of Object.entries(UG.wardProjects)){T.travel('hearth',p.x,p.y);T.render();const beforeArt=document.querySelector('#view').toDataURL();ok(T.wardBuild(id),'Commission project: '+id);const before=T.state.scrap;ok(!T.wardBuild(id)&&T.state.scrap===before,'No duplicate project payment: '+id);T.wardTick(4);ok(T.save(true)&&T.restore().ward.projects[id].status==='building','Construction checkpoint persists: '+id);T.wardTick(4);ok(T.state.ward.projects[id].status==='ready','Construction completes: '+id);T.render();ok(document.querySelector('#view').toDataURL()!==beforeArt,'Completed project physically changes the rendered world: '+id);}
 T.travel('hearth',1080,660);const ammo=T.state.ammo,scrap=T.state.scrap;ok(T.wardService('armory')&&T.state.ammo===ammo+24&&T.state.scrap===scrap-4,'Armory service exchanges actual resources');
 T.travel('hearth',1250,880);const meds=T.state.meds;ok(T.wardService('infirmary')&&T.state.meds===meds+2,'Infirmary supplies work');
 T.travel('hearth',920,440);ok(T.wardService('listening')&&Object.keys(T.state.ward.rumors).length===12,'Listening station supplies twelve valid discovery leads');
 for(const [id,r] of Object.entries(UG.relics)){ok(!!UG.rooms[r.room]&&!!UG.rooms[r.room].platforms.find(p=>p.y===r.y&&r.x>=p.x&&r.x<=p.x+p.w),'Relic has a valid world landing: '+id);}
 T.travel('hearth',770,880);ok(T.startExpedition('service'),'Start optional expedition');const sid='exp_service_2';T.travel(sid,1070,420);clear();ok(T.wardClaim('funeral'),'Guarded relic enters freight');ok(!T.state.weapons.includes('funeral')&&T.save(true)&&T.restore().ward.cargo.includes('funeral'),'Relic escrow survives quiet expedition save');T.state.greater.run.finished='withdraw';T.finishExpedition();T.close();ok(!T.state.weapons.includes('funeral')&&!T.state.ward.cargo.length,'Withdrawal loses unbanked relics');
 ok(T.startExpedition('service'),'Relic recovery can be retried');T.travel(sid,1070,420);clear();ok(T.wardClaim('funeral'),'Retry regenerates the unrecovered case');T.state.greater.run.primary=true;T.state.greater.run.finished='success';T.finishExpedition();T.close();ok(!T.state.weapons.includes('funeral')&&T.state.life.prototypes.funeral==='frame','Successful extraction banks the incomplete frame');T.travel('testannex',1270,660);clear();T.state.flags.annexSafe=true;T.lifeInteract(UG.rooms.testannex.objects.find(o=>o.id==='annex-governor'));T.travel('hearth',770,880);ok(T.lifeRestore('funeral')&&T.state.weapons.includes('funeral'),'A component and workshop turn the banked frame into an owned pattern');
 const money=T.state.credits;T.travel('hearth',580,660);ok(T.wardEvent('dispute'),'Housing enables an optional resident settlement');const after=T.state.scrap;ok(!T.wardEvent('dispute')&&T.state.scrap===after,'Local events cannot pay twice');
 T.reward({weapon:'disorder',weaponUnused:null,gear:'forest',armorKey:'celebration'});let a=T.selected;a.weapon='disorder';a.mag=15;const acc=T.combatWeapon(a).acc;a.mag=6;ok(T.combatWeapon(a).acc===acc-18,'Disorder loses accuracy as its magazine empties');
 T.reward({weapon:'mercy'});T.travel('cable',1000,880);a=T.selected;a.weapon='mercy';a.mag=4;T.beginBattle();a.ap=3;
 // Place two actual enemy records in one clear firing lane for an isolated chain fixture.
 const es=UG.rooms.cable.enemies.slice(0,2);for(const [i,e] of es.entries())Object.assign(T.state.world.cable.enemies[e.id],{x:1150+i*100,y:880,hp:UG.enemyTypes[e.type].hp});
 const target={...UG.enemyTypes[es[0].type],...es[0],...T.state.world.cable.enemies[es[0].id],enemy:true};const prior=T.state.world.cable.enemies[es[1].id].hp;const random=Math.random;Math.random=()=>0;T.shoot(a,target);Math.random=random;ok(T.state.world.cable.enemies[es[1].id].hp===prior-12,'Mercy Killing damages a second nearby target through real shooting');
 // Real weapon resolution fixtures verify AP, ammo, opening damage and displacement.
 function shotFixture(id,round=1){reset();T.reward({weapon:id});T.travel('cable',1000,880);const a=T.selected;a.weapon=id;a.mag=UG.weapons[id].mag;T.beginBattle();T.battle.round=round;a.ap=3;const e=UG.rooms.cable.enemies[2],q=T.state.world.cable.enemies[e.id];Object.assign(q,{x:1150,y:880,hp:UG.enemyTypes[e.type].hp});const target={...UG.enemyTypes[e.type],...e,...q,enemy:true};const rand=Math.random;Math.random=()=>0;T.shoot(a,target);Math.random=rand;return {a,q};}
 const first=shotFixture('deadair',1).q.hp,later=shotFixture('deadair',2).q.hp;ok(first<later,'Dead Air opening-round bonus changes actual damage');
 const bell=shotFixture('funeral');ok(bell.q.x>1150||bell.q.hp===0,'Funeral Bell displaces or kills the actual target');ok(bell.a.mag===2,'Funeral Bell consumes one of its three shells');
 const widow=shotFixture('widow');ok(widow.a.ap===1&&widow.a.mag===1,'Widowmaker spends two AP and one of two chambers');
 const torch=shotFixture('furnacekey');ok(torch.q.burn===14,'Furnace Key applies actual burning status');
 reset();T.reward({armorKey:'celebration',gear:'hanging'});let hero=T.selected;const mobility=T.moveAllowance(hero),resistance=T.armorSave(hero);hero.armorKey='celebration';ok(T.moveAllowance(hero)<mobility&&T.armorSave(hero)>resistance,'Black Celebration exchanges mobility for actual protection');hero.armorKey='leathers';hero.gear='hanging';ok(T.moveAllowance(hero)===mobility+35,'Hanging Man changes actual route allowance');
 T.travel('cable',200,880);hero=T.selected;const anchor=UG.rooms.cable.objects.find(o=>o.type==='anchor');hero.x=anchor.x-700;hero.y=anchor.y;ok(T.grapple(anchor),'Hanging Man reaches a real anchor beyond the ordinary 650-unit winch range');
 reset();T.reward({gear:'forest'});T.travel('cable',1000,880);const shooter={...UG.enemyTypes.scav,id:'fixture',x:1200,y:880,enemy:true,weapon:'pistol'},crew=T.selected;const exposed=T.shotInfo(shooter,crew).chance;crew.gear='forest';ok(T.shotInfo(shooter,crew).chance<exposed,'A Forest reduces actual hostile hit chance');
 reset();T.reward({mod:'resonator'});const gun=T.combatWeapon(T.selected);T.selected.mod='resonator';ok(T.combatWeapon(T.selected).pen===gun.pen+4&&T.combatWeapon(T.selected).damage===gun.damage-3,'Ghost Circuit changes real penetration and damage');
 T.reward({mod:'suture'});T.selected.mod='suture';ok(T.combatWeapon(T.selected).acc===gun.acc+8&&T.combatWeapon(T.selected).damage===gun.damage-2,'Suture Feed changes real accuracy and damage');
 reset();T.action('gallery');ok(document.querySelectorAll('[data-gallery]').length===23,'Gallery includes all standard and exceptional weapons');T.close();
 T.close();T.state.greater.expeditionReturns.service=5;const cash=T.state.credits,scrapReturn=T.state.scrap;ok(T.startExpedition('service'),'Renewable route remains accessible after five returns');T.state.greater.run.primary=true;T.state.greater.run.finished='success';T.finishExpedition();T.close();ok(T.state.credits===cash+8&&T.state.scrap===scrapReturn+1,'Late renewable delivery pays only eight credits and one salvage');
 T.state.flags.wardFreight=true;ok(T.startExpedition('signal'),'Restored depot opens the Signal Ossuary');T.travel('exp_signal_1',1100,650);clear();T.reward({scrap:5});ok(T.wardEvent('signal')&&T.state.ward.rumors.forest==='heard','Optional receiver repair leads to the optical relic');T.state.greater.run.finished='withdraw';T.finishExpedition();T.close();
 const bad=T.fresh();bad.ward.cargo=['funeral'];let rejected=false;try{T.validate(bad)}catch{rejected=true}ok(rejected,'Reject relic cargo without an active expedition');
 const before=performance.now();for(let i=0;i<60;i++)T.render();out.push('Render sample: '+((performance.now()-before)/60).toFixed(2)+' ms/frame, headless desktop');return out;
 }''')
 page.set_viewport_size({'width':390,'height':844});page.evaluate("UG_TEST.action('ward')")
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),'Portrait page overflow'
 page.screenshot(path='/workspace/undergrid-alpha7-evidence/alpha7-mobile.png')
 # Managed Chromium blocks file://. Validate standalone content with networking offline
 # after establishing a local origin; direct-file navigation remains unverified here.
 offline=b.new_context();op=offline.new_page();op.goto('http://127.0.0.1:8000/');offline.set_offline(True);op.set_content(Path('UNDERGRID_ADVENTURE.html').read_text());op.get_by_role('button',name='BEGIN EXPEDITION').click();assert op.locator('#location').inner_text()=='Disintegration Ward';assert op.evaluate('typeof UG_TEST')=='undefined';offline.close()
 assert not errors,errors
 print('PASS:',len(result)-1,'controlled Alpha 6 checks; portrait width check; 0 page errors')
 for line in result:print(' PASS',line)
 b.close()
