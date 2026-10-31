"""Alpha 7 controlled integration, presentation and persistence fixtures.
The fresh no-resource-edit playthrough is tests/ward_play_test.py.
"""
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':960});errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8000/UNDERGRID_ADVENTURE.html?test');page.get_by_role('button',name='BEGIN EXPEDITION').click()
 results=page.evaluate('''()=>{
 const T=UG_TEST,out=[],ok=(v,n)=>{if(!v)throw Error(n);out.push(n)};
 const reset=()=>{T.start();T.close();};
 const clear=()=>{for(const q of Object.values(T.state.world[T.state.room].enemies))q.hp=0;T.checkBattle();};
 const old=T.fresh();delete old.life;old.weapons.push('funeral');old.ward.recovered.push('funeral');const migrated=T.validate(old);
 ok(migrated.life.prototypes.funeral==='restored'&&migrated.weapons.includes('funeral'),'Alpha 6 owned exceptional weapons remain working after migration');
 ok(!!migrated.world.testannex&&!migrated.flags.quest,'Migration adds the optional site without advancing the main story');
 let bad=T.fresh();bad.life.active.cable='patient';let rejected=false;try{T.validate(bad)}catch{rejected=true}ok(rejected,'Reject a regional event in the wrong region');
 bad=T.fresh();bad.life.prototypes.funeral='restored';rejected=false;try{T.validate(bad)}catch{rejected=true}ok(rejected,'Reject restored state without an owned weapon');
 ok(document.querySelector('#lesson').textContent.includes('Nell'),'Opening hints explain both story and optional work');
 T.state.life.prototypes.funeral='frame';T.state.life.tracked='funeral';T.action('lifework');document.querySelector('[data-life-track="funeral"]').click();ok(document.querySelector('#objective').textContent.includes('Workshop'),'An incomplete frame can be tracked as the active optional objective');T.action('trackmain');T.close();ok(T.state.life.tracked===null,'Tracking the main story explicitly clears optional restoration tracking');T.travel('cable',330,880);ok(T.state.life.active.cable==='camp','A banked frame creates a regional scavenger opportunity');
 const state=T.save(true)&&T.restore();ok(state.life.active.cable==='camp','Active regional encounter survives validated save/load');
 const cash=T.state.credits,ammo=T.state.ammo;ok(T.lifeChoice('camp','share')&&T.state.ammo===ammo-6&&T.state.items.annexClue,'Sharing supplies obtains a clue and changes actual resources');
 ok(!T.lifeChoice('camp','share')&&T.state.ammo===ammo-6,'Unique regional outcomes cannot pay or charge twice');
 T.travel('hearth',290,880);T.travel('cable',330,880);ok(!UG.rooms.cable.objects.some(o=>o.id==='regional-camp'),'Completed unique camps do not respawn');
 T.reward({credits:1000,scrap:1000});T.state.ward.machinery=2;T.state.flags.power=true;
 for(const [id,q] of Object.entries(UG.wardProjects)){T.travel('hearth',q.x,q.y);ok(T.wardBuild(id),'Commission existing project '+id);T.wardTick(8);}
 ok(Object.keys(UG.residents).filter(id=>id!=='rill').every(id=>UG.rooms.hearth.objects.some(o=>o.resident===id)),'Five named residents arrive with their facilities');
 T.travel('hearth',310,660);const credits=T.state.credits;ok(T.lifeService('trade')&&T.state.credits===credits-24&&T.state.life.stock===1,'Freight merchant sells actual limited supply parcels');
 ok(T.lifeService('trade')&&!T.lifeService('trade')&&T.state.life.stock===0,'Merchant stock is limited until another successful delivery');
 T.travel('hearth',1320,880);T.selected.hp=20;const scrap=T.state.scrap;ok(T.lifeService('treatment')&&T.selected.hp===60&&T.state.scrap===scrap-2,'Infirmary treats real wounds for salvage');
 T.travel('yard',330,880);clear();T.lifeEntry();ok(T.state.life.active.yard==='freight','Freight development and a cleared region create the damaged-wagon encounter');
 ok(T.lifeChoice('freight','tools'),'A damaged freight event has a workshop outcome');
 T.travel('garden',360,880);clear();T.lifeEntry();const med=T.state.meds;ok(T.lifeChoice('patient','evacuate')&&T.state.meds===med-1,'An infirmary unlocks regional patient evacuation');
 T.travel('testannex',1270,660);clear();const regulator=UG.rooms.testannex.objects.find(o=>o.kind==='component');T.lifeInteract(regulator);ok(!T.state.life.components.funeral,'A live test floor blocks component recovery even after combat');
 T.travel('testannex',520,440);T.lifeInteract(UG.rooms.testannex.objects.find(o=>o.kind==='isolate'));T.travel('testannex',1270,660);T.lifeInteract(regulator);ok(T.state.life.components.funeral,'The actual isolator unlocks the governor component');
 T.travel('testannex',1110,880);ok(T.lifeChoice('rill','ward')&&T.state.life.rescue==='ward','A safe site and completed quarters allow the engineer to settle');
 T.travel('hearth',770,880);ok(T.lifeService('reunion')&&!T.lifeService('reunion'),'The sibling reunion rewards only once');
 const before=T.state.scrap;ok(T.lifeRestore('funeral')&&T.state.scrap===before-4&&T.state.weapons.includes('funeral'),'Engineer-supported restoration consumes its reduced cost and grants a real weapon');
 ok(!T.lifeRestore('funeral'),'Restoration cannot be repeated');
 T.state.life.prototypes.mercy='frame';
 T.travel('hearth',770,880);ok(T.startExpedition('signal'),'Existing depot requirement still opens Signal Ossuary');T.travel('exp_signal_1',1100,650);clear();ok(T.wardEvent('signal')&&T.state.life.components.mercy,'Repairing the Ossuary receiver recovers Mercy Killing’s matched capacitor');
 T.state.greater.run.finished='withdraw';T.finishExpedition();T.close();T.travel('hearth',770,880);ok(T.lifeRestore('mercy')&&T.state.weapons.includes('mercy'),'The second restoration chain produces the electrical weapon');
 ok(T.save(true)&&T.restore().life.rescue==='ward'&&T.restore().weapons.includes('mercy'),'Restorations, residents and regional outcomes persist together');
 for(const family of Object.keys(UG.expeditions)){
  T.travel('hearth',610,880);Object.assign(T.state.flags,{power:true,railPass:true});T.state.items.diving=true;
  for(let i=0;i<3;i++){
   ok(T.startExpedition(family),'Start '+family+' survey '+i);const run=T.state.greater.run,assignment=run.assignment,definition=JSON.stringify(UG.rooms[T.state.room]);
   ok(T.save(true)&&T.restore().greater.run.assignment===assignment&&JSON.stringify(UG.rooms[T.state.room])===definition,'Work order and layout persist: '+family+'/'+i);
   const kind=UG.lifeOrders[assignment].kind,index=kind==='survey'?0:kind==='gauge'?1:2;const id='exp_'+family+'_'+index;T.travel(id,100,UG.rooms[id].platforms[0].y);clear();const o=UG.rooms[id].objects.find(o=>o.id==='life-order');ok(!!o,'Each order has an authored reachable object');
   T.travel(id,o.x,o.y);if(kind==='gauge')T.state.greater.run.control=true;
   const bag=T.state.greater.run.bag.credits;T.lifeInteract(o);ok(T.state.greater.run.sideDone&&T.state.greater.run.bag.credits>bag,'Optional work pays into at-risk freight: '+family+'/'+kind);
   const once=T.state.greater.run.bag.credits;T.lifeInteract(o);ok(T.state.greater.run.bag.credits===once,'No duplicate optional work reward');
   T.state.greater.run.finished='withdraw';T.finishExpedition();T.close();
  }
 }
 // All later payouts stay modest; neither XP nor stock can be duplicated by reload.
 T.state.greater.expeditionReturns.mill=5;T.travel('hearth',610,880);const credit=T.state.credits;ok(T.startExpedition('mill'),'Old expedition remains useful after the early pay cap');T.state.greater.run.primary=true;T.state.greater.run.finished='success';T.finishExpedition();T.close();ok(T.state.credits===credit+8&&T.state.life.stock===2,'Late successful freight pays only eight credits and restocks two merchant parcels');
 T.state.greater.expeditionReturns.carriage=5;T.travel('hearth',610,880);const paid=T.state.credits,oldXP=T.state.xp;ok(T.startExpedition('carriage'),'A fee-bearing late route can still depart');T.state.greater.run.primary=true;T.state.greater.run.finished='success';T.finishExpedition();T.close();ok(T.state.credits===paid+8&&T.state.xp===oldXP,'Late fee-bearing routes reimburse fare but still grant only eight net credits and no XP');
 ok(T.startExpedition('service'),'Start a trip to inspect the return route');T.travel('exp_service_1',1100,650);clear();T.action('lifereport');document.querySelector('[data-action="lifefindexit"]').click();ok(!!T.state.greater.run&&T.state.room==='exp_service_1'&&T.paths.size>0,'Return guidance starts an ordinary route without teleporting or extracting');for(let i=0;i<50&&T.paths.size;i++)T.updatePaths(10);T.state.greater.run.finished='withdraw';T.finishExpedition();T.close();
 T.travel('hearth',450,660);T.action('lifehome');ok(document.querySelectorAll('[data-weapon-art]').length>=2,'Home displays actual restored weapons');T.close();
 reset();T.travel('testannex',1110,880);clear();T.state.flags.annexSafe=true;const machinery=T.state.ward.machinery;ok(T.lifeChoice('rill','road')&&T.state.ward.machinery===machinery+1,'The alternative rescue outcome grants one machinery unit');ok(!T.lifeChoice('rill','road')&&T.state.ward.machinery===machinery+1,'The alternative rescue cannot be settled twice');
 reset();T.reward({weapon:'mercy'});T.travel('cable',1000,880);T.selected.weapon='mercy';T.selected.mag=4;T.beginBattle();T.selected.ap=3;const es=UG.rooms.cable.enemies.slice(0,2);for(const [i,e] of es.entries())Object.assign(T.state.world.cable.enemies[e.id],{x:1150+i*140,y:880,hp:UG.enemyTypes[e.type].hp});const target={...UG.enemyTypes[es[0].type],...es[0],...T.state.world.cable.enemies[es[0].id],enemy:true,weapon:'arcblade'},prior=T.state.world.cable.enemies[es[1].id].hp;const rand=Math.random;Math.random=()=>0;T.shoot(T.selected,target);Math.random=rand;ok(T.state.world.cable.enemies[es[1].id].hp===prior-12,'Conductive chaining is independent of a melee victim’s own weapon range');
 T.travel('excavator',100,880);T.beginBattle();T.close();window.dispatchEvent(new Event('blur'));ok(document.querySelector('#shade').hidden,'Focus loss does not open a menu');
 T.action('system');ok(!document.querySelector('#shade').hidden,'SYSTEM still opens when explicitly requested');T.close();
 return out;
 }''')
 for width,height in [(1440,960),(768,1024),(390,844)]:
  page.set_viewport_size({'width':width,'height':height});page.wait_for_timeout(100)
  box=page.locator('#bossReadout').bounding_box();assert box and box['width']<=260 and box['height']<80
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.screenshot(path='/workspace/undergrid-alpha7-evidence/alpha7-boss-mobile.png')
 # Coarse-pointer iPad access to explicit overlap cycling.
 touch=b.new_context(viewport={'width':768,'height':1024},has_touch=True);tp=touch.new_page();tp.goto('http://127.0.0.1:8000/UNDERGRID_ADVENTURE.html?test');tp.get_by_role('button',name='BEGIN EXPEDITION').tap();assert tp.get_by_role('button',name='Cycle nearby interactions').is_visible();touch.close()
 assert not errors,errors
 print('PASS:',len(results),'Alpha 7 controlled checks; desktop/iPad/portrait bounds and touch NEXT; 0 page errors')
 for line in results:print(' PASS',line)
 b.close()
