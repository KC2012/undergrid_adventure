"""Alpha 8 geometry-derived maps, discovery, notes and directed route planning."""
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);page=b.new_page(viewport={'width':1440,'height':960});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8000/UNDERGRID_ADVENTURE.html?test');page.get_by_role('button',name='BEGIN EXPEDITION').click()
 results=page.evaluate('''()=>{
 const T=UG_TEST,out=[],ok=(v,n)=>{if(!v)throw Error(n);out.push(n)};
 T.atlasObserve();const first=T.state.atlas.surveys.hearth.cells.length;ok(first>0,'New play records an initial partial local survey');
 T.action('map');ok(!document.querySelector('#panel').textContent.includes('The Cold Foundry'),'A fresh atlas does not reveal distant district names');ok(document.querySelectorAll('[data-atlas-node]').length===1,'Only the starting district is named on the fresh connected map');T.close();
 T.moveTo(T.selected,1490,880,true);for(let i=0;i<30&&T.paths.size;i++){T.updatePaths(1);T.atlasObserve();}ok(T.state.atlas.surveys.hearth.cells.length>first,'Walking progressively reveals geometry');
 ok(T.state.atlas.surveys.hearth.seen.includes('east'),'Approaching the actual east door discovers a passage');ok(T.atlasEdges().some(e=>e.from==='hearth'&&e.to==='cable'&&e.frontier),'The real unvisited neighbor appears as an unnamed frontier');
 T.interact();T.close();ok(T.state.room==='cable'&&T.state.visited.includes('cable'),'An actual door enters a connected district');
 let plan=T.atlasPlan('hearth');ok(plan.path.length===1&&plan.path[0].from==='cable'&&plan.path[0].to==='hearth','Observed return passage plans the real directed route');
 T.action('map');ok(document.querySelectorAll('[data-atlas-edge]').length>=1,'Discovered districts render connected route edges');T.close();
 const base=T.state.atlas.surveys.cable.cells.length;T.travel('cable',650,440);T.atlasObserve();ok(T.state.atlas.surveys.cable.cells.length>base,'A higher deck reveals another part of a multilevel survey');
 const svg=T.atlasLocalSVG();ok(svg.includes('survey-ladder')&&svg.includes('surveyMask'),'Local platforms and ladders use a progressive observation mask');ok(!svg.includes('A live relay fuse'),'The local survey does not expose loot secrets');
 T.travel('cable',1700,230);T.atlasObserve();const locked=T.atlasEdges().find(e=>e.to==='archive');ok(locked&&!locked.open,'An observed rig-gated passage is recorded as locked');
 // A previously visited destination remains named but planning must explain its live gate.
 T.state.visited.push('archive');plan=T.atlasPlan('archive');ok(!plan.path.length&&plan.reason.includes('rig'),'Route planning explains a known locked destination');T.state.items.rig=true;plan=T.atlasPlan('archive');ok(plan.path.length===1&&plan.path[0].to==='archive','Acquiring the required tool opens the same recorded route');
 T.action('map');document.querySelector('[data-atlas-pin="cable"]').click();ok(T.state.living.markers.cable,'The selected district can be pinned');document.querySelector('#atlasNote').value='Upper hatch needs the rig <safe>';document.querySelector('[data-atlas-note="cable"]').click();ok(T.state.atlas.notes.cable.includes('<safe>'),'Personal notes store text, not markup');
 document.querySelector('[data-atlas-pin="cable"]').click();ok(!T.state.living.markers.cable,'A personal pin can be removed');T.close();ok(T.save(true)&&T.restore().atlas.notes.cable.includes('<safe>')&&T.restore().atlas.surveys.cable.cells.length===T.state.atlas.surveys.cable.cells.length,'Partial observations and notes survive validated save/load');
 const old=JSON.parse(JSON.stringify(T.state));delete old.atlas;old.living.markers.hearth=true;const migrated=T.validate(old);ok(migrated.atlas.version===1&&migrated.living.markers.hearth&&migrated.visited.includes('cable'),'An Alpha 7 save migrates its names and pins without resetting progress');
 const invalid=JSON.parse(JSON.stringify(T.state));invalid.atlas.surveys.cable.cells=['999,999'];let rejected=false;try{T.validate(invalid)}catch{rejected=true}ok(rejected,'Reject out-of-bounds survey data');
 T.travel('hearth',970,440);T.atlasObserve();T.travel('market',1340,880);T.atlasObserve();T.state.flags.power=true;ok(T.atlasEdges().some(e=>e.from==='hearth'&&e.to==='market'&&e.tram&&e.open),'Discovered powered terminals add real tram links');
 for(const e of T.atlasEdges().filter(e=>!e.tram))ok(UG.rooms[e.from].objects.some(o=>o.type==='door'&&o.to===e.to),'Every mapped district edge exists in the actual door graph');return out;
 }''')
 page.set_viewport_size({'width':390,'height':844});page.evaluate("UG_TEST.action('map')");assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.locator('[data-atlas-tab="local"]').click();old_width=page.locator('.atlas-local svg').bounding_box()['width'];page.locator('[data-atlas-zoom="in"]').click();assert page.locator('.atlas-local svg').bounding_box()['width']>old_width;page.locator('[data-atlas-zoom="out"]').click();page.screenshot(path='/workspace/undergrid-alpha8-evidence/atlas-mobile.png')
 assert not errors,errors
 print('PASS:',len(results),'atlas checks; portrait bounds; 0 page errors')
 for line in results:print(' PASS',line)
 b.close()
