"""Chromium integration tests. Requires Python Playwright and a local HTTP server.
Run: python tests/browser_test.py [http://127.0.0.1:8000]
Fixtures intentionally position actors directly for isolated mechanic/quest tests;
keyboard, pointer navigation, touch controls and save reload also use real UI input.
"""
from pathlib import Path
import sys
from playwright.sync_api import sync_playwright
base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8000'
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':960})
    errors=[]
    page.on('pageerror',lambda e: errors.append(str(e)))
    page.goto(base+'/UNDERGRID_ADVENTURE.html?test')
    page.get_by_role('button',name='BEGIN EXPEDITION').click()
    page.keyboard.down('d'); page.wait_for_timeout(450); page.keyboard.up('d')
    assert page.evaluate('UG_TEST.selected.x')>340,'Keyboard movement'
    page.keyboard.press('e')
    assert page.evaluate('UG_TEST.state.flags.quest'),'Mara interaction with keyboard'
    page.keyboard.press('Escape')
    page.screenshot(path='/tmp/undergrid-desktop.png')
    results=page.evaluate('''() => {
      const T=UG_TEST, passed=[];
      function ok(b,name){if(!b)throw Error(name);passed.push(name);}
      function reset(){T.start();Math.random=()=>.05;}
      function clear(id){for(const e of Object.values(T.state.world[id].enemies))e.hp=0;}
      function visit(id,obj){if(T.battle)throw Error('Unexpected battle');const o=UG.rooms[id].objects.find(o=>o.id===obj);if(T.state.room!==id)T.travel(id,o.x,o.y);else Object.assign(T.selected,{x:o.x,y:o.y});T.close();T.interact();}
      reset();
      let d=T.fresh();ok(T.validate(d).version===2,'Fresh save schema');
      let bad=T.fresh();bad.party[0].x=Infinity;let rejected=false;try{T.validate(bad)}catch{rejected=true}ok(rejected,'Reject invalid imported coordinates');
      for(const [id,r] of Object.entries(UG.rooms)){
        T.travel(id,100,r.platforms[0].y);T.render();
        for(const o of r.objects){const floor=r.platforms.find(p=>p.y===o.y&&o.x>=p.x&&o.x<=p.x+p.w),anchor=floor&&r.objects.some(q=>q.type==='anchor'&&q.y===floor.y&&q.x>=floor.x&&q.x<=floor.x+floor.w);const barrier=o.type==='machine'&&UG.machines[o.machine]?.kind==='barrier',approach=barrier&&(T.route(T.selected,o.x-50,o.y)||T.route(T.selected,o.x+50,o.y));ok(!!T.route(T.selected,o.x,o.y)||!!approach||anchor,id+' reachable interaction or traversal anchor to '+o.id);}
      }
      reset();T.travel('cable',700,880);T.beginBattle();
      let enemy={...UG.enemyTypes.scav,...UG.rooms.cable.enemies[0],...T.state.world.cable.enemies.c1,enemy:true,maxhp:32};
      const info=T.shotInfo(T.selected,enemy);ok(info.legal&&info.chance>0,'Clear firing lane');
      const high={...T.selected,x:800,y:440},low={...enemy,x:800,y:880};ok(!T.shotInfo(high,low).legal,'Steel blocks cross-floor fire');
      const before=enemy.hp;T.shoot(T.selected,enemy);ok(T.selected.ap===2&&T.selected.mag===7&&T.state.world.cable.enemies.c1.hp<before,'Shooting consumes AP and ammo, damages persistent enemy');
      const hp=T.state.world.cable.enemies.c1.hp;T.selected.ap=0;T.shoot(T.selected,enemy);ok(T.state.world.cable.enemies.c1.hp===hp,'Cannot fire without AP');
      T.selected.ap=3;T.action('reload');ok(T.selected.mag===8&&T.selected.ap===2,'Reload costs one AP');
      T.selected.hp=20;T.action('heal');ok(T.selected.hp===70&&T.selected.ap===1,'Medkit heals and costs one AP');
      T.action('overwatch');ok(T.selected.watch&&T.selected.ap===0,'Overwatch reserves activation');
      let mag=T.selected.mag;T.enemyStep('c1');ok(T.selected.mag===mag-1,'Overwatch reacts to movement');
      T.endTurn();for(let i=0;i<8&&T.battle?.phase==='enemy';i++)T.battleUpdate(2);ok(T.battle?.phase==='player'&&T.battle.round===2,'Enemy round completes and returns control');
      T.state.world.cable.enemies.c1.hp=1;T.state.world.cable.enemies.c2.hp=1;T.state.world.cable.enemies.c3.hp=0;
      T.explode(1100,880,500,45);ok(!T.battle,'Blast victory completes encounter');ok(T.state.xp>8,'Combat awards XP');T.gainXP(10);ok(T.state.level>1,'XP threshold increases level');
      ok(T.state.world.cable.opened.cb&&T.state.world.cable.covers.cbox2===0,'Blast chains barrels and destroys cover');
      let credits=T.state.credits;T.checkBattle();ok(T.state.credits===credits,'Victory cannot award rewards twice');
      ok(T.save(true)&&T.restore().room==='cable','Save round trip');
      reset();T.travel('cable',100,880);T.beginBattle();T.action('map');T.action('retreat');ok(T.state.room==='hearth'&&!T.battle,'Retreat works from atlas modal');
      reset();T.travel('cable',100,880);T.beginBattle();let a=T.selected;
      ok(T.moveTo(a,220,880)&&a.ap===2,'Tactical path charges AP');T.paths.clear();
      ok(!T.moveTo(a,1530,230),'Reject path exceeding AP');
      reset();visit('hearth','mara');T.close();ok(T.state.flags.quest,'Main quest accepted');
      visit('cable','archive-exit');ok(T.state.room==='cable','Archive gate blocks without rig');
      clear('cable');visit('cable','fuse');ok(T.state.items.fuse,'Fuse discovery');
      visit('cable','vera');T.close();ok(T.state.party.length===2,'Vera recruitment');
      visit('hearth','mara');T.close();ok(T.state.flags.power&&T.state.weapons.includes('rifle'),'Fuse turns in for power and carbine');
      clear('sump');visit('sump','rig');visit('sump','orren');T.close();ok(T.state.party.length===3&&T.state.items.rig,'Orren and traversal rig');
      visit('sump','pump');let reward=T.state.credits;visit('sump','pump');ok(T.state.credits===reward,'Pump rewards only once');
      clear('furnace');visit('furnace','heart');visit('furnace','valve');ok(T.state.items.heart&&T.state.flags.steam,'Heart and environmental valve');
      clear('archive');visit('archive','cipher');visit('archive','longrifle');ok(T.state.items.cipher&&T.state.weapons.includes('sniper'),'Archive discoveries');
      visit('hearth','mara');T.close();ok(T.state.flags.signal,'Mara decodes signal');
      visit('furnace','bell');ok(T.state.room==='bell','Engine gate opens with decoded signal');
      clear('bell');visit('bell','engine');ok(T.state.ending,'Narrative chapter completes');T.close();
      T.travel('hearth',160,880);T.selected.hp=1;T.interact();ok(T.selected.hp===T.selected.maxhp,'Rest restores crew');
      T.action('inventory');let ammo=T.state.ammo+T.selected.mag;document.querySelector('[data-equip="rifle"]').click();ok(T.state.ammo+T.selected.mag===ammo,'Equipment swap conserves ammunition');T.close();
      T.save(true);ok(T.restore().ending&&T.restore().party.length===3,'Full chapter save round trip');
      return passed;
    }''')
    page.reload(); page.get_by_role('button',name='CONTINUE',exact=True).click()
    assert page.evaluate('UG_TEST.state.ending'),'UI continues saved expedition'
    assert not errors,errors
    # Real keyboard ladder movement, pointer path encounter, and target firing.
    page.evaluate('UG_TEST.start();Object.assign(UG_TEST.selected,{x:240,y:880})')
    page.keyboard.down('w');page.wait_for_timeout(1600);page.keyboard.up('w')
    assert abs(page.evaluate('UG_TEST.selected.y')-660)<3,'Keyboard ladder reaches balcony'
    page.evaluate('UG_TEST.travel("cable",100,880);Math.random=()=>.05')
    page.wait_for_timeout(600)
    def point(x,y):
        return page.evaluate('''([x,y])=>{let r=document.querySelector('#view').getBoundingClientRect(),a=UG_TEST.worldPoint({clientX:r.left,clientY:r.top}),b=UG_TEST.worldPoint({clientX:r.left+100,clientY:r.top});let s=100/(b.x-a.x);return {x:r.left+(x-a.x)*s,y:r.top+(y-a.y)*s}}''',[x,y])
    dest=point(650,875);page.mouse.click(dest['x'],dest['y'])
    page.wait_for_function('UG_TEST.battle!==null')
    assert page.evaluate('UG_TEST.selected.x')<600,'Click path stops at hostile contact'
    page.wait_for_timeout(700)
    dest=point(920,855);page.mouse.click(dest['x'],dest['y'])
    assert page.evaluate('UG_TEST.state.world.cable.enemies.c1.hp')<32,'Pointer fires at rendered enemy'
    page.screenshot(path='/tmp/undergrid-combat.png')
    page.get_by_role('button',name='END TURN').click()
    page.wait_for_function('UG_TEST.battle.phase==="player"&&UG_TEST.battle.round===2')
    assert not errors,errors
    # Narrow touch viewport: no overflowing panels, controls actually move actor.
    mobile=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
    mp=mobile.new_page();mp.on('pageerror',lambda e:errors.append(str(e)))
    mp.goto(base+'/UNDERGRID_ADVENTURE.html?test');mp.get_by_role('button',name='BEGIN EXPEDITION').tap()
    assert mp.locator('#touch').is_visible()
    box=mp.locator('[data-hold="d"]').bounding_box();x=box['x']+box['width']/2;y=box['y']+box['height']/2
    mp.dispatch_event('[data-hold="d"]','pointerdown',{'pointerId':1})
    mp.wait_for_timeout(300);mp.dispatch_event('[data-hold="d"]','pointerup',{'pointerId':1})
    assert mp.evaluate('UG_TEST.selected.x')>300,'Touch hold movement'
    assert mp.evaluate('document.documentElement.scrollWidth<=innerWidth'),'No horizontal overflow'
    mp.screenshot(path='/tmp/undergrid-mobile.png')
    assert not errors,errors
    print(f'PASS: {len(results)+11} integration checks; {len(errors)} browser errors')
    for name in results:print('  PASS',name)
    browser.close()
