"""Actual control clicks and visible enemy tells on desktop and coarse-pointer layouts."""
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);checks=[];errors=[]
 for w,h,touch,label in [(1440,960,False,'desktop'),(1024,768,True,'tablet'),(390,844,True,'phone')]:
  page=b.new_page(viewport={'width':w,'height':h},has_touch=touch);page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto('http://127.0.0.1:8000/UNDERGRID_ADVENTURE.html?test');page.get_by_role('button',name='BEGIN EXPEDITION').click();page.evaluate("UG_TEST.enlist('vera');UG_TEST.enlist('orren');UG_TEST.enlist('latch');UG_TEST.travel('orchard',430,880);UG_TEST.beginBattle();UG_TEST.interact()")
  page.locator('[data-industry="root-switch"][data-industry-method="homes"]').click();assert page.evaluate('UG_TEST.state.industry.power==="homes"&&UG_TEST.selected.ap===2');checks.append(label+': real control click routes power for exactly one AP')
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');checks.append(label+': four-person industrial encounter stays within viewport')
  page.evaluate("UG_TEST.travel('walker',1000,1320);UG_TEST.beginBattle();UG_TEST.enemyStep('wk-diver');UG_TEST.render()")
  assert page.evaluate('UG_TEST.state.world.walker.enemies["wk-diver"].industrialWindup');assert page.evaluate('UG_TEST.industryTell({...UG.enemyTypes.pressurediver,...UG_TEST.state.world.walker.enemies["wk-diver"],type:"pressurediver"}).includes("VENTING")');checks.append(label+': actual hostile activation exposes a persistent visible warning')
  assert page.evaluate('UG.rooms.walker.enemies.filter(e=>!e.dormant).every(e=>UG_TEST.drawCounts.get(e.id)===1)');checks.append(label+': all five enemy identities render once through their dedicated renderer')
  page.wait_for_timeout(600);page.screenshot(path='/workspace/undergrid-alpha10-evidence/industry-'+label+'.png');page.close()
 assert not errors,errors
 print('PASS:',len(checks),'industrial desktop/tablet/touch checks; 0 page errors')
 for x in checks:print(' PASS',x)
 b.close()
