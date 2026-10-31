"""Alpha 9 declared geometry fixtures plus real keyboard/touch traversal.
Real campaign acquisition is covered by greater_play and open_play tests.
"""
from playwright.sync_api import sync_playwright
from pathlib import Path
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':960});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8000/UNDERGRID_ADVENTURE.html?test');page.get_by_role('button',name='BEGIN EXPEDITION').click()
 checks=page.evaluate('''()=>{const T=UG_TEST,out=[],ok=(v,n)=>{if(!v)throw Error(n);out.push(n)},drain=()=>{for(let i=0;i<200&&T.paths.size;i++)T.updatePaths(.1)};
 T.travel('cable',1090,880);let a=T.selected,t={...UG.enemyTypes.sentry,id:'c3',enemy:true,type:'sentry',x:1090,y:660,hp:68};
 ok(T.shotInfo(a,t).legal,'Vertical fire passes through the authored ladder hatch');
 a.x=1030;t.x=1115;ok(T.shotInfo(a,t).legal,'Diagonal fire uses the actual opening intersection');
 a.x=1200;t.x=1200;ok(!T.shotInfo(a,t).legal,'Solid steel blocks vertical fire beside that hatch');
 ok(T.solidSections(UG.rooms.cable.platforms.find(p=>p.id==='east')).length===2,'Deck rendering and collision share the same two solid sections');
 a.x=1090;ok(T.grenadeTrajectory(a,1090,660).legal,'Grenade lob fits through the real hatch');
 ok(T.shotInfo({...t,x:1090},a).legal,'Hostile targeting uses the same clear hatch ray');a.x=1200;ok(!T.grenadeTrajectory(a,1200,660).legal,'Grenade trajectory is blocked by solid deck');
 a.x=1090;Object.assign(T.state.world.cable.enemies.c3,{x:1090,y:660});T.beginBattle();a.ap=3;let ammo=a.mag;T.shoot(a,{...t,x:1090,hp:68});ok(a.ap===2&&a.mag===ammo-1,'Actual vertical shot spends the forecast AP and ammunition');
 T.travel('cable',1090,880);Object.assign(T.state.world.cable.enemies.c3,{hp:64,x:1090,y:660});T.beginBattle();let count=T.state.grenades;T.grenade(1090,660);ok(T.state.grenades===count-1&&T.selected.ap===1&&T.state.world.cable.enemies.c3.hp<64,'Actual grenade passes the hatch, spends 2 AP and damages the upper hostile');T.travel('cable',1200,880);T.beginBattle();a=T.selected;const frags=T.state.grenades,ap=a.ap;T.grenade(1200,660);ok(T.state.grenades===frags&&a.ap===ap,'Blocked grenade spends no AP or supplies');
 T.travel('cable',840,440);a=T.selected;let r=T.route(a,1000,440);ok(r.points.some(p=>p.kind==='jump'),'Broken catwalk route includes an explicit jump');
 T.beginBattle();const f=T.movementForecast(a,1000,440);ok(f.legal&&f.cost===Math.max(1,Math.ceil(f.route.length/T.moveAllowance(a))),'Tactical leap cost matches its route preview');const before=a.ap;ok(T.moveTo(a,1000,440),'Tactical leap accepts the preview');T.updatePaths(.15);T.updatePaths(.15);ok(a.y<440,'Tactical jump follows an airborne arc');drain();ok(a.y===440&&a.x===1000&&a.ap===before-f.cost,'Tactical jump lands at the preview endpoint for the preview AP');
 T.travel('cable',1055,660);a=T.selected;T.beginBattle();const drop=T.movementForecast(a,1090,880);ok(drop.route.points.some(p=>p.kind==='drop'),'Hatch provides a tactical drop route');const cost=drop.cost;ok(T.controlledDrop(),'DROP uses the real opening in combat');drain();ok(a.y===880&&a.ap===3-cost,'Controlled tactical drop lands and charges its route cost');
 T.travel('hearth',500,660);ok(!T.controlledDrop(),'Solid settlement steel cannot be dropped through');
 T.travel('hearth',780,620);ok(T.controlledDrop(),'Maintenance shelf supports a deliberate drop');for(let i=0;i<100;i++)T.fluidMovement(.016);ok(T.selected.y===830,'Exploration drop reaches the safe deck below');
 T.travel('hearth',620,660);r=T.route(T.selected,950,660);ok(r.points.filter(p=>p.kind==='jump').length>=2,'Safe Ward shelves connect the separated residential decks');
 T.travel('cable',840,440);T.enlist('vera');T.enlist('orren');T.enlist('sable');T.close();T.selectCrew(0);ok(T.state.party.length===4,'Four active fighters fit the crew');
 T.moveTo(T.selected,1040,440,true);drain();for(let i=0;i<300;i++){T.fluidMovement(.016);T.updatePaths(.016);}ok(T.state.party.every(a=>a.y===440&&a.x>=970),'All three followers cross the broken catwalk without teleporting');
 T.travel('cable',840,440);T.state.party[1].x=100;T.state.party[1].y=880;for(let i=0;i<1600;i++){T.fluidMovement(.016);T.updatePaths(.016);}ok(T.state.party[1].y===440,'Separated follower recovers using a multilevel ladder route');
 T.travel('cable',840,440);for(const e of Object.values(T.state.world.cable.enemies))e.hp=0;T.state.party[1].x=900;T.state.party[1].y=440;T.fluidMovement(.016);T.updatePaths(.1);ok(T.state.party[1].y>440&&T.state.party[1].y<880,'A follower without footing recovers by falling, without teleporting');for(let i=0;i<1600;i++){T.fluidMovement(.016);T.updatePaths(.016);}ok(T.state.party[1].y===440,'Recovered follower finds a ladder route back to the crew');T.travel('cable',840,440);Object.assign(T.state.world.cable.enemies.c3,{hp:64,x:1450,y:660});T.state.items.grapple=true;T.beginBattle();const old=T.state.party.slice(1).map(a=>[a.x,a.y]);ok(T.grapple(UG.rooms.cable.objects.find(o=>o.id==='gap-winch')),'A clear maintenance winch can be used in combat');drain();ok(T.selected.ap===1&&T.state.party.slice(1).every((a,i)=>a.x===old[i][0]&&a.y===old[i][1]),'Combat grapple charges 2 AP and moves only its selected fighter');
 T.travel('cable',1200,880);T.state.items.grapple=true;ok(!T.grapple(UG.rooms.cable.objects.find(o=>o.id==='gap-winch')),'Winch cannot bypass intervening solid floors');
 T.travel('cable',1250,660);Object.assign(T.state.world.cable.enemies.c3,{hp:64,x:1450,y:660});T.beginBattle();ok(T.state.party.every(a=>a.ap===3),'Four active fighters receive independent AP');T.selectCrew(3);ok(T.selected.id==='sable','Fourth fighter is selectable');T.endTurn();for(let i=0;i<20&&T.battle?.phase==='enemy';i++)T.battleUpdate(1);ok(T.battle?.phase==='player'&&T.battle.round===2&&T.state.party.every(a=>a.hp>0&&a.ap>=2&&a.ap<=3),'Four-character turn refreshes all survivors, including a possible suppression penalty');
 return out;}''')
 # An actual running jump, no path API. The fixture starts at the gap approach.
 page.evaluate("UG_TEST.travel('cable',840,440);for(const e of Object.values(UG_TEST.state.world.cable.enemies))e.hp=0;UG_TEST.close()")
 page.keyboard.down('d');page.wait_for_timeout(100);page.keyboard.press('Space');page.wait_for_timeout(650);page.keyboard.up('d');page.wait_for_timeout(700)
 assert page.evaluate('UG_TEST.selected.x>970&&UG_TEST.selected.y===440'),page.evaluate('({x:UG_TEST.selected.x,y:UG_TEST.selected.y})')
 checks.append('Real keyboard momentum carries a running jump across the Cableworks gap')
 page.evaluate("UG_TEST.travel('hearth',610,600)");page.keyboard.down('w');page.wait_for_timeout(950);page.keyboard.up('w');page.wait_for_timeout(80)
 assert page.evaluate('UG_TEST.selected.y===440&&UG_TEST.selected.x>632')
 checks.append('Real ladder input climbs through an aperture and dismounts onto its rim')
 page.keyboard.press('4');assert page.evaluate('UG_TEST.selected.id==="sable"');checks.append('Keyboard 4 selects the fourth fighter')
 page.evaluate("UG_TEST.travel('cable',1055,660);for(const e of Object.values(UG_TEST.state.world.cable.enemies))e.hp=0;Object.assign(UG_TEST.state.world.cable.enemies.c1,{hp:64,x:1400,y:880});UG_TEST.beginBattle();window.DROP_EXPECTED=UG_TEST.selected.ap-UG_TEST.movementForecast(UG_TEST.selected,1090,880).cost")
 page.keyboard.down('s');page.keyboard.press('Space');page.keyboard.up('s');page.wait_for_function('!UG_TEST.paths.size')
 assert page.evaluate('UG_TEST.selected.y===880&&UG_TEST.selected.ap===window.DROP_EXPECTED');checks.append('Actual S+Space in combat drops through the hatch for the preview AP')
 touch=b.new_page(viewport={'width':1024,'height':768},has_touch=True)
 touch.on('pageerror',lambda e:errors.append(str(e)));touch.goto('http://127.0.0.1:8000/UNDERGRID_ADVENTURE.html?test');touch.get_by_role('button',name='BEGIN EXPEDITION').click();touch.evaluate("UG_TEST.enlist('vera');UG_TEST.enlist('orren');UG_TEST.enlist('sable');UG_TEST.close()")
 for width,height,label in [(1024,768,'tablet'),(390,844,'phone')]:
  touch.set_viewport_size({'width':width,'height':height});touch.evaluate("UG_TEST.travel('hearth',780,620);UG_TEST.close()")
  touch.locator('#touch [data-action="drop"]').click(force=True);touch.wait_for_timeout(950);assert touch.evaluate('UG_TEST.selected.y===830')
  assert touch.evaluate('document.documentElement.scrollWidth<=innerWidth')
  assert touch.evaluate('(()=>{let r=document.querySelector("#crewDock").getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.height<100})()')
  touch.screenshot(path=f'/workspace/undergrid-alpha9-evidence/geometry-{label}.png');checks.append(f'{label}: touch DROP and four-person HUD stay usable within viewport')
 assert not errors,errors
 print('PASS:',len(checks),'Alpha 9 geometry/input checks; 0 page errors')
 for x in checks:print(' PASS',x)
 b.close()
