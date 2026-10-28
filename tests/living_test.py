"""Alpha 3 integrated machinery/traversal, migration, roster and staged boss.
Quest fixtures position actors; actual pointer grappling, timed lift movement,
mobile previews and audio controls are separately exercised through the UI."""
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':960});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8000/UNDERGRID_ADVENTURE.html?test');page.get_by_role('button',name='BEGIN EXPEDITION').click()
 results=page.evaluate('''()=>{
  const T=UG_TEST,out=[];function ok(v,n){if(!v)throw Error(n);out.push(n)}
  function go(id,x,y){T.travel(id,x,y);T.close()}
  function visit(id,key){const o=UG.rooms[id].objects.find(o=>o.id===key);go(id,o.x,o.y);T.interact()}
  function finishPaths(){for(let n=0;n<10&&T.paths.size;n++)T.updatePaths(10)}
  function settle(id){go('market',560,880);if(!T.state.contracts[id]){T.settleContract(id);T.close()}T.settleContract(id);T.close()}
  T.start();Math.random=()=>.05;
  const legacy=T.fresh();delete legacy.living;delete legacy.reserve;for(const id of ['tenement','vents','pressure','excavator','quiet'])delete legacy.world[id];for(const w of Object.values(legacy.world))delete w.machines;legacy.credits=91;
  const restored=T.validate(legacy);ok(restored.world.vents.machines&&restored.credits===91,'0.3 migration preserves resources and initializes machinery');
  let invalid=T.fresh(),root=invalid.party[0];invalid.party=[{...root,id:'vera',name:'Vera',callsign:'Vera'}];invalid.reserve=[root];let rejected=false;try{T.validate(invalid)}catch{rejected=true}ok(rejected,'Imports cannot bench the required protagonist');
  ok(Object.keys(restored.world).length===21,'Migration retains original districts and adds five new spaces');
  T.state.flags.power=true;T.state.flags.sluice=true;T.state.flags.liftPower=true;
  go('tenement',400,880);const credits=T.state.credits;
  ok(T.operateMachine('tenement-lights','scrap'),'Solo salvage repair is a valid solution');
  ok(T.state.flags.residentsPower&&T.state.scrap===8,'Repair consumes the actual parts');
  ok(Object.values(T.state.world.tenement.enemies).every(e=>e.hp===0&&e.spared),'Restoring homes resolves guards nonviolently');ok(T.state.kills===0,'Peaceful resolution does not add kills');
  visit('tenement','evidence');T.close();ok(T.state.items.meterReadings,'Investigation records evidence');settle('homes');ok(T.state.items.grapple,'Residents reward a reusable traversal tool');
  for(const [id,x,y,anchor] of [['cable',540,440,'courier-hook'],['tenement',1030,440,'roof-hook'],['vents',1150,590,'vent-hook']]){
   go(id,x,y);const hook=UG.rooms[id].objects.find(o=>o.id===anchor);ok(T.grapple(hook),'Grapple works at '+id);ok(!T.save(true),'Saving defers during active traversal');finishPaths();ok(Math.abs(T.selected.y-hook.y)<1&&Math.abs(T.selected.x-hook.x)<1,'Grapple lands on intended platform '+id);
  }
  go('vents',1330,1480);ok(!T.operateMachine('vent-lift','ride'),'Unpowered lift cannot be ridden');
  visit('tenement','clinic');document.querySelector('[data-living="stabilize"]').click();T.close();ok(T.state.items.courierStable&&T.state.meds===3,'Solo medkit stabilizes the courier');settle('clinic');ok(T.state.items.diving,'Clinic opens reusable flooded traversal');
  visit('tenement','clinic');document.querySelector('[data-living="recruit-sable"]').click();T.close();ok(T.state.party.some(a=>a.id==='sable')&&T.state.gears.includes('medrig'),'Sable joins with an owned, functional medical kit');
  let kits=T.state.meds;visit('pressure','attendant');T.close();ok(T.state.flags.pumpGuide&&T.state.meds===kits,'Sable stabilizes a second survivor for free and unlocks a solo pump procedure');
  visit('sump','pressure-lock');ok(T.state.room==='pressure','Diving suit opens Sump route');visit('docks','pressure-dock');ok(T.state.room==='pressure','Diving suit opens a second route from Docks');
  T.selected.hp=10;T.action('heal');ok(T.selected.hp===68,'Active Sable improves another fighter’s medkit healing');
  T.enlist('orren');go('vents',480,280);ok(T.operateMachine('vent-generator','engineer'),'Orren restores generator without parts');ok(T.state.items.ventRecord&&T.state.flags.ventPower,'Generator returns power and a work record');settle('lung');ok(T.state.items.cutter,'Vent work yields reusable cutting tool');
  visit('vents','latch');document.querySelector('[data-living="recruit-latch"]').click();T.close();ok(T.state.reserve.some(a=>a.id==='latch')&&T.state.party.length===3,'New companion enters reserve when active crew is full');
  go('hearth',160,880);T.action('roster');document.querySelector('[data-bench="orren"]').click();document.querySelector('[data-enlist="latch"]').click();T.close();ok(T.state.party.some(a=>a.id==='latch')&&T.state.reserve.some(a=>a.id==='orren'),'Safe shelter swaps preserve a three-person active crew');
  const latch=T.state.party.find(a=>a.id==='latch');T.statusHit({},latch,UG.weapons.arc);ok(!latch.shocked,'Latch’s intrinsic coil resists shock without grounding gear');
  go('quiet',300,880);ok(T.validate(JSON.parse(JSON.stringify(T.state))).reserve.length===1,'Benched actor coordinates remain valid in a smaller room');
  go('vents',1330,1480);ok(T.operateMachine('vent-lift','ride'),'Powered lift starts actual carrier movement');T.updatePaths(.5);ok(T.selected.y<1480&&T.selected.y>590,'Lift passes through intermediate world coordinates');finishPaths();ok(T.selected.y===590,'Lift reaches its upper floor');
  go('vents',1330,590);T.beginBattle();let ap=T.selected.ap;ok(T.operateMachine('vent-lift','ride')&&T.selected.ap===ap-2,'Lift operates during tactical combat for two AP');finishPaths();
  // Leave the controlled encounter through travel, retaining all machinery state.
  go('vents',950,1200);ok(T.operateMachine('vent-steam','toggle'),'Steam valve opens');Object.assign(T.selected,{x:1100,y:1200});let hp=T.selected.hp;T.hazardTick(T.selected);ok(T.selected.hp===hp-10,'Steam damages an actor at activation');
  ok(T.routeHazardPenalty({x:950,y:1200},{x:1200,y:1200})>0,'Enemy route planning recognizes active steam');
  Object.assign(T.selected,{x:950,y:1200});T.operateMachine('vent-steam','toggle');Object.assign(T.selected,{x:1100,y:1200});hp=T.selected.hp;T.hazardTick(T.selected);ok(T.selected.hp===hp,'Closing the same valve removes the hazard');
  go('pressure',900,1230);ok(T.segmentBlocked({x:900,y:1230},{x:1100,y:1230}),'Sealed barrier blocks physical route segments');ok(T.operateMachine('vault-barrier','cut'),'Earned cutter opens welded barrier');ok(!T.segmentBlocked({x:900,y:1230},{x:1100,y:1230}),'Opened barrier changes route geometry');
  go('foundry',700,880);ok(T.operateMachine('foundry-locker','cut')&&T.state.flags.foundryLocker,'Cutter has a second use in an established district');
  T.reward({weapon:'arc'});T.selected.weapon='arc';T.selected.mag=5;go('pressure',1500,1230);ok(T.operateMachine('vault-pump','arc')&&T.selected.mag===4,'Arc gun powers machinery with actual ammunition');
  ok(T.state.flags.pumps,'Flood-control restoration opens excavation access');visit('pressure','vault-ledger');T.close();settle('pressure');ok(T.state.contracts.pressure.done,'Flood investigation completes');
  // Explicitly verify the actual staged boss, including a telegraphed floor attack.
  go('excavator',900,1280);T.beginBattle();let q=T.state.world.excavator.enemies;const core=()=>({...UG.enemyTypes.excavator,...UG.rooms.excavator.enemies[0],...q.core,enemy:true,maxhp:210});
  let before=q.core.hp;T.hurt(core(),30,T.selected);ok(q.core.hp===before&&T.bossPhase()===1,'Two stabilizers shield the core');
  Object.assign(T.selected,{x:600,y:1040,ap:3});ok(T.operateMachine('boss-port','toggle'),'Port breaker disables a component in combat');ok(T.bossPhase()===2&&!T.shielded(core()),'Losing one component exposes phase two');
  before=q.core.hp;T.hurt(core(),10,T.selected);ok(q.core.hp===before-10,'Exposed core takes damage');
  Object.assign(T.selected,{x:1450,y:550,ap:3});T.operateMachine('boss-starboard','toggle');ok(T.bossPhase()===3,'Second component changes the boss to final phase');
  Object.assign(T.selected,{x:900,y:1280});T.bossStep(core());hp=T.selected.hp;T.bossStep(core());ok(T.selected.hp===hp-16,'Telegraphed surge resolves on the announced floor');
  Object.assign(T.selected,{x:760,y:800,ap:3});T.operateMachine('boss-coolant','toggle');Object.assign(T.selected,{x:900,y:1280});hp=T.selected.hp;T.bossStep(core());ok(T.selected.hp===hp,'Coolant is a working environmental counter to boss surge');
  // Finish using ordinary ranged attacks, AP resets and magazines; components
  // were disabled by their real control actions above, not health edits.
  T.reward({weapon:'sniper'});for(const a of T.state.party){a.weapon='sniper';a.mag=3;a.x=900;a.y=1280;}T.state.ammo=60;
  for(let n=0;n<8&&T.battle;n++){for(let i=0;i<T.state.party.length&&T.battle;i++){T.selectCrew(i);if(T.selected.hp<=0)continue;T.selected.ap=3;if(!T.selected.mag)T.action('reload');if(T.selected.ap>=2)T.shoot(T.selected,core());}}
  ok(q.core.hp===0&&!T.battle&&T.state.flags.excavated,'Mechanical encounter can conclude in victory and open its return tunnel');
  visit('excavator','excavation-log');T.close();settle('machine');ok(T.state.contracts.machine.done,'Major encounter produces an investigable quest conclusion');
  visit('quiet','radio');T.close();visit('quiet','old-case');settle('radio');ok(T.state.contracts.radio.done,'Optional environmental mystery resolves without combat');
  go('hearth',160,880);T.action('map');document.querySelector('[data-marker]').click();T.close();ok(T.state.living.markers.hearth,'Map pin is persistent state');
  ok(T.save(true),'Stable state saves');const saved=T.restore();ok(saved.flags.ventPower&&saved.flags.vaultWall&&saved.flags.pumps&&saved.flags.excavated,'Machinery and boss consequences survive save/load');ok(saved.reserve.some(a=>a.id==='orren'),'Reserve equipment and identities survive save/load');
  // Consequences and contextual companion utility in the established world.
  go('hearth',160,880);T.state.contracts.apprentice={accepted:true,done:true,choice:'crew',outcome:'Nix has a workshop'};T.state.scrap=50;T.action('workbench');document.querySelector('[data-craft="weapon:chainblade"]').click();T.close();ok(T.state.scrap===30,'Nix workshop permanently discounts pattern fabrication');
  T.action('roster');document.querySelector('[data-bench="latch"]').click();T.close();T.enlist('vera');T.state.contracts.ledger={accepted:true,done:true,choice:'burn',outcome:'Courier routes protected'};T.state.items.cutter=false;
  visit('deadrail','quiet-door');ok(T.state.room==='quiet','Vera’s settled courier knowledge offers an alternate apartment entrance');T.state.items.cutter=true;
  T.action('roster');document.querySelector('[data-bench="vera"]').click();document.querySelector('[data-enlist="latch"]').click();T.close();
  // Prepare a pointer traversal and inspection test in a safe, changed district.
  go('tenement',1000,440);return out;
 }''')
 # Actual walking collision and release by the same machinery control.
 page.evaluate('''()=>{UG_TEST.travel('pressure',900,1230);UG_TEST.state.flags.vaultWall=false;for(const q of Object.values(UG_TEST.state.world.pressure.enemies))q.hp=0}''')
 page.keyboard.down('d');page.wait_for_timeout(450);page.keyboard.up('d')
 assert page.evaluate('UG_TEST.selected.x')<940
 page.keyboard.press('e');page.get_by_role('button',name='CUTTER OR CHAINBLADE').click()
 page.keyboard.down('d');page.wait_for_timeout(450);page.keyboard.up('d')
 assert page.evaluate('UG_TEST.selected.x')>970
 page.evaluate('UG_TEST.travel("vents",1330,1480);UG_TEST.state.flags.ventPower=true')
 page.keyboard.press('e');page.get_by_role('button',name='RIDE LIFT').click();page.wait_for_timeout(500)
 assert 590<page.evaluate('UG_TEST.selected.y')<1480
 page.wait_for_function('UG_TEST.paths.size===0')
 assert page.evaluate('UG_TEST.selected.y')==590
 page.evaluate('UG_TEST.travel("tenement",1000,440)')
 # Actual tool UI and pointer anchor selection, without direct grapple calls.
 page.keyboard.press('t');page.get_by_role('button',name='AIM GRAPPLE').click();page.wait_for_timeout(400)
 pt=page.evaluate('''()=>{const r=document.querySelector('#view').getBoundingClientRect(),T=UG_TEST,a=T.worldPoint({clientX:r.left,clientY:r.top}),b=T.worldPoint({clientX:r.left+100,clientY:r.top}),s=100/(b.x-a.x);return {x:r.left+(1470-a.x)*s,y:r.top+(315-a.y)*s}}''')
 page.mouse.click(pt['x'],pt['y']);page.wait_for_function('UG_TEST.paths.size===0')
 assert abs(page.evaluate('UG_TEST.selected.y')-350)<1
 page.keyboard.press('i');page.wait_for_timeout(300);assert page.locator('#loadoutPreview').is_visible()
 page.screenshot(path='/tmp/ua3-inventory.png')
 page.keyboard.press('Escape');page.evaluate('UG_TEST.action("audio")')
 page.get_by_role('button',name='ENABLE SOUND').click();assert page.evaluate('UG_TEST.audioPrefs.enabled')
 page.get_by_role('button',name='MUTE SOUND').click();assert not page.evaluate('UG_TEST.audioPrefs.enabled')
 page.keyboard.press('Escape')
 page.set_viewport_size({'width':390,'height':844});page.keyboard.press('i');page.wait_for_timeout(300)
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.screenshot(path='/tmp/ua3-mobile-inventory.png')
 # Bad imports cannot replace a valid expedition; legacy files migrate via UI.
 page.keyboard.press('Escape');before=page.evaluate('JSON.stringify(UG_TEST.state)')
 with page.expect_file_chooser() as chooser:page.evaluate('UG_TEST.action("import")')
 chooser.value.set_files({'name':'broken.json','mimeType':'application/json','buffer':b'{"version":2,"party":[]}'})
 page.wait_for_function('document.querySelector("#toast").textContent.includes("Import rejected")')
 assert page.evaluate('JSON.stringify(UG_TEST.state)')==before
 legacy=page.evaluate('''()=>{let d=UG_TEST.fresh();delete d.living;delete d.reserve;for(const id of ['tenement','vents','pressure','excavator','quiet'])delete d.world[id];for(const w of Object.values(d.world))delete w.machines;d.credits=87;d.world.cable.enemies.c1.hp=9;return JSON.stringify(d)}''')
 with page.expect_file_chooser() as chooser:page.evaluate('UG_TEST.action("import")')
 chooser.value.set_files({'name':'legacy.json','mimeType':'application/json','buffer':legacy.encode()})
 page.wait_for_function('UG_TEST.state.credits===87')
 assert page.evaluate('UG_TEST.state.world.cable.enemies.c1.hp===9&&UG_TEST.state.living.version===1')
 assert not errors,errors
 print('PASS:',len(results)+12,'living-world checks; 0 page errors')
 for r in results:print(' PASS',r)
 b.close()
