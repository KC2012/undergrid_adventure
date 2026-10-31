"""Real mouse/keyboard/touch previews, map controls and a real Alpha 7 save import."""
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':960});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8000/UNDERGRID_ADVENTURE.html?test');page.get_by_role('button',name='BEGIN EXPEDITION').click()
 page.evaluate('''()=>{const T=UG_TEST;T.enlist('vera');T.enlist('orren');T.travel('cable',700,880);T.beginBattle();}''');page.wait_for_timeout(900)
 def point(pg,x,y):
  return pg.evaluate('''([x,y])=>{const T=UG_TEST,r=document.querySelector('#view').getBoundingClientRect(),a=T.worldPoint({clientX:r.left,clientY:r.top}),bb=T.worldPoint({clientX:r.left+100,clientY:r.top}),s=100/(bb.x-a.x);return {x:r.left+(x-a.x)*s,y:r.top+(y-a.y)*s};}''',[x,y])
 dest=point(page,810,877);page.mouse.move(dest['x'],dest['y']);page.wait_for_timeout(150)
 assert 'MOVE / 1 AP' in page.locator('#targetInfo').inner_text()
 before=page.evaluate('UG_TEST.selected.ap');page.mouse.click(dest['x'],dest['y']);page.wait_for_function('UG_TEST.paths.size===0')
 assert page.evaluate('UG_TEST.selected.ap')==before-1
 assert abs(page.evaluate('UG_TEST.selected.x')-810)<2
 enemy=point(page,920,850);page.mouse.move(enemy['x'],enemy['y']);page.wait_for_timeout(150)
 info=page.locator('#targetInfo').inner_text();assert '%' in info and 'damage on hit' in info and 'PEN' in info and 'rounds' in info
 before=page.evaluate('[UG_TEST.selected.ap,UG_TEST.selected.mag]');page.mouse.click(enemy['x'],enemy['y'])
 assert page.evaluate('[UG_TEST.selected.ap,UG_TEST.selected.mag]')==[before[0]-1,before[1]-1]
 page.keyboard.press('2');assert page.evaluate('UG_TEST.selected.id')=='vera'
 page.keyboard.press('q');assert page.evaluate('!!UG_TEST.battle.target')
 page.screenshot(path='/workspace/undergrid-alpha8-evidence/aim-desktop.png')
 # A real old-version save is produced by the preserved build and imported through the chooser.
 old=b.new_page();old.goto('http://127.0.0.1:8000/releases/UNDERGRID_ADVENTURE_Alpha_7.html?test');old.get_by_role('button',name='BEGIN EXPEDITION').click()
 old.evaluate("UG_TEST.state.living.markers.hearth=true;UG_TEST.save(true)")
 saved=old.evaluate('JSON.stringify(UG_TEST.state)');assert '"atlas"' not in saved;old.close()
 page.evaluate('UG_TEST.start()')
 with page.expect_file_chooser() as chooser:page.evaluate("UG_TEST.action('import')")
 chooser.value.set_files({'name':'real-alpha7.json','mimeType':'application/json','buffer':saved.encode()})
 page.wait_for_function('document.querySelector("#toast").textContent.includes("Expedition imported")')
 assert page.evaluate('UG_TEST.state.atlas.version===1&&UG_TEST.state.living.markers.hearth')
 page.keyboard.press('m');page.locator('[data-atlas-tab="local"]').click();assert page.locator('.atlas-local svg').is_visible();page.keyboard.press('Escape');assert page.locator('#shade').is_hidden()
 # Coarse-pointer tablet: inspect first, fire on the second deliberate tap.
 tablet=b.new_context(viewport={'width':768,'height':1024},has_touch=True)
 tp=tablet.new_page();tp.on('pageerror',lambda e:errors.append(str(e)));tp.goto('http://127.0.0.1:8000/UNDERGRID_ADVENTURE.html?test');tp.get_by_role('button',name='BEGIN EXPEDITION').tap()
 tp.evaluate("UG_TEST.travel('cable',700,880);UG_TEST.beginBattle()");tp.wait_for_timeout(900)
 target=point(tp,920,850);before=tp.evaluate('[UG_TEST.selected.ap,UG_TEST.selected.mag]');tp.touchscreen.tap(target['x'],target['y'])
 assert tp.evaluate('UG_TEST.battle.target')=='c1'
 assert tp.evaluate('[UG_TEST.selected.ap,UG_TEST.selected.mag]')==before
 assert 'damage on hit' in tp.locator('#targetInfo').inner_text()
 tp.touchscreen.tap(target['x'],target['y']);assert tp.evaluate('[UG_TEST.selected.ap,UG_TEST.selected.mag]')==[before[0]-1,before[1]-1]
 move=point(tp,810,877);remaining=tp.evaluate('UG_TEST.selected.ap');tp.touchscreen.tap(move['x'],move['y']);assert tp.evaluate('UG_TEST.selected.ap')==remaining;tp.wait_for_function("document.querySelector('#targetInfo').textContent.includes('MOVE / 1 AP')");assert 'MOVE / 1 AP' in tp.locator('#targetInfo').inner_text();tp.touchscreen.tap(move['x'],move['y']);tp.wait_for_function('UG_TEST.paths.size===0');assert tp.evaluate('UG_TEST.selected.ap')==remaining-1;assert abs(tp.evaluate('UG_TEST.selected.x')-810)<2
 tp.screenshot(path='/workspace/undergrid-alpha8-evidence/aim-tablet.png')
 tp.set_viewport_size({'width':390,'height':844});tp.wait_for_timeout(150);assert tp.evaluate('document.documentElement.scrollWidth<=innerWidth')
 tp.screenshot(path='/workspace/undergrid-alpha8-evidence/aim-mobile.png')
 assert not errors,errors
 print('PASS: 20 mouse/keyboard/touch and Alpha 7 import assertions; 0 page errors')
 tablet.close();b.close()
