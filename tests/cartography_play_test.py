"""Alpha 8 fresh cartography route and prepared difficult expedition through ordinary routes, AP, ammo, combat and turns.
The opening route is fresh; Carriage Zero starts from an explicit prepared crew.
"""
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':960});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8000/UNDERGRID_ADVENTURE.html?test');page.get_by_role('button',name='BEGIN EXPEDITION').click()
 results=page.evaluate('''()=>{
 const T=UG_TEST,out=[],ok=(v,n)=>{if(!v)throw Error(n);out.push(n)};let seed=147,rounds=0,fights=0;Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 function drain(){for(let i=0;i<40&&T.paths.size;i++)T.updatePaths(10)}
 function fight(){fights++;let guard=0,origin=T.state.room;while(T.battle&&guard++<65){if(T.state.room!==origin)throw Error('Defeat in '+origin);
  for(let i=0;i<T.state.party.length&&T.battle;i++){const a=T.state.party[i];if(a.hp<=0)continue;T.selectCrew(i);
   for(let n=0;n<8&&T.battle&&a.ap>0;n++){
    if(a.hp<a.maxhp*.65&&a.skills.includes('patch')&&!a.patchUsed){T.useSkill('patch');continue;}
    if(a.hp<a.maxhp*.45&&T.state.meds){T.action('heal');continue;}
    const w=T.combatWeapon(a);if(!w.melee&&!a.mag&&T.state.ammo){T.action('reload');continue;}
    const foes=T.combatEnemies().filter(e=>!T.shielded(e)),legal=foes.filter(e=>T.shotInfo(a,e).legal).sort((a,b)=>a.hp-b.hp);
    if(legal.length&&a.ap>=w.ap&&(w.melee||a.mag)){T.shoot(a,legal[0]);continue;}
    const target=foes.sort((e,f)=>Math.hypot(e.x-a.x,e.y-a.y)-Math.hypot(f.x-a.x,f.y-a.y))[0];if(!target)break;
    const floor=UG.rooms[T.state.room].platforms.find(p=>Math.abs(p.y-target.y)<10&&target.x>=p.x&&target.x<=p.x+p.w);if(!floor)break;
    const desired=w.range<400?100:300,tx=Math.max(floor.x+15,Math.min(floor.x+floor.w-15,target.x+(a.x<target.x?-desired:desired))),r=T.route(a,tx,floor.y);if(!r)break;
    const next=r.points.find(p=>Math.hypot(p.x-a.x,p.y-a.y)>2);if(!next)break;
    const d=Math.hypot(next.x-a.x,next.y-a.y),budget=T.moveAllowance(a)*a.ap,ratio=Math.min(1,budget/d),x=Math.abs(next.y-a.y)>1?next.x:a.x+(next.x-a.x)*ratio,y=Math.abs(next.y-a.y)>1?next.y:a.y;
    if(!T.moveTo(a,x,y))break;drain();
   }
  }
  if(T.battle){T.endTurn();for(let i=0;i<20&&T.battle?.phase==='enemy';i++)T.battleUpdate(1);rounds++;}
 }
 if(T.state.greater.run?.finished==='defeat')throw Error('Expedition defeat in '+origin);
 if(T.battle)throw Error('Unresolved '+origin+' fight at '+JSON.stringify(T.state.party.map(a=>({id:a.id,x:a.x,y:a.y,ap:a.ap,hp:a.hp})))+' / '+JSON.stringify(T.combatEnemies().map(e=>({id:e.id,x:e.x,y:e.y,hp:e.hp}))));}
 function go(x,y){T.close();T.selectCrew(0);for(let attempts=0;attempts<45;attempts++){
  if(T.battle)fight();T.selectCrew(0);const a=T.selected;if(Math.hypot(a.x-x,a.y-y)<18)return;
  if(!T.moveTo(a,x,y,true))throw Error('No route in '+T.state.room+' to '+x+','+y);
  for(let tick=0;tick<400&&T.paths.has(a.id)&&!T.battle;tick++){T.updatePaths(.1);T.fluidMovement(.1);T.atlasObserve();}
 }throw Error('Route never arrived in '+T.state.room+' at '+x+','+y+' / '+JSON.stringify(T.selected));}
 function use(id){const o=UG.rooms[T.state.room].objects.find(o=>o.id===id);if(!o)throw Error('Missing '+id+' in '+T.state.room);go(o.x,o.y);T.interact();T.close();}
 function kit(){if(T.state.scrap>=14&&!T.state.armors.includes('mesh')){T.action('workbench');document.querySelector('[data-craft="armorKey:mesh"]').click();T.close();}
  for(let i=0;i<T.state.party.length;i++){T.selectCrew(i);const a=T.selected;T.action('inventory');if(T.state.weapons.includes('rifle'))document.querySelector('[data-equip="rifle"]').click();if(T.state.armors.includes('mesh'))document.querySelector('[data-kit="armorKey:mesh"]').click();while(a.points>0&&a.talents.power<4)document.querySelector('[data-talent="power"]').click();T.close();if(a.abilityPoints&&!a.skills.includes('patch')){T.action('skills');document.querySelector('[data-learn="patch"]').click();T.close();}}
  T.selectCrew(0);}
 // Fresh navigation and recruitment, without health, money, XP or world-state edits.
 use('mara');use('starter-stash');const homeCells=T.state.atlas.surveys.hearth.cells.length;use('east');
 ok(T.state.room==='cable'&&T.atlasEdges().some(e=>e.from==='hearth'&&e.to==='cable'),'Actual exploration records the Ward-to-Cableworks connection');
 T.action('map');ok(document.querySelector('[data-atlas-edge="hearth:cable"]'),'The discovered connection is visible in the atlas');T.close();
 use('vera');use('cache-c');use('fuse');T.atlasObserve();use('archive-exit');ok(T.state.room==='cable','The real upper passage remains gated before the rig');
 const archive=T.atlasEdges().find(e=>e.to==='archive');ok(archive&&!archive.open,'Exploring the upper deck records a locked unknown passage');
 ok(T.state.atlas.surveys.cable.cells.length>8,'Actual ladder travel progressively surveys multiple floors');
 T.action('map');document.querySelector('[data-atlas-pin="cable"]').click();document.querySelector('#atlasNote').value='Return to upper archive with rig';document.querySelector('[data-atlas-note="cable"]').click();T.close();
 use('west');use('mara');kit();use('down');use('rig');use('sump-loot');use('orren');kit();ok(T.state.party.length===3,'The fresh route recruits Vera and Orren through their ordinary encounters');
 use('furnace');use('valve');use('furnace-cache');use('heart');use('cable');use('archive-exit');
 ok(T.state.room==='archive','The earned rig opens the previously recorded passage');use('cipher');use('longrifle');use('back');use('west');use('mara');use('cot');
 const plan=T.atlasPlan('archive');ok(plan.path.length&&plan.path.at(-1).to==='archive'&&plan.path.every(e=>T.atlasEdges().some(q=>q.from===e.from&&q.to===e.to&&q.open)),'The atlas plans an open observed route, including discovered powered trams');
 ok(T.save(true)&&T.restore().atlas.notes.cable==='Return to upper archive with rig'&&T.restore().living.markers.cable,'A partial fresh survey, note and pin survive save/load');
 ok(T.state.flags.signal&&T.state.items.rig,'The same route advances main-story prerequisites normally');out.push('Fresh navigation: '+fights+' encounters / '+rounds+' hostile rounds');
 window.ATLAS_PLAY_SAVE=JSON.stringify(T.state);
 // Explicit prepared tier-five crew; no resource/health/AP/world edits after departure.
 T.start();T.enlist('vera');T.enlist('orren');T.gainXP(1365);T.reward({weapon:'railgun',armorKey:'mesh',gear:'shockground',ammo:300,meds:15,scrap:40,credits:100});T.state.flags.railPass=true;
 for(const a of T.state.party){a.weapon='railgun';a.mag=5;a.armorKey='mesh';a.gear='shockground';a.skills=['patch'];}
 const prior=rounds;ok(T.startExpedition('carriage'),'Prepared crew deliberately departs for tier-five Carriage Zero');
 use('exp-cache');use('exp-next');use('exp-primary');use('exp-control');use('exp-next');
 for(const e of UG.rooms[T.state.room].enemies){if(T.state.world[T.state.room].enemies[e.id].hp>0){go(e.x-80,e.y);if(T.battle)fight();}}
 use('exp-vault');ok(T.state.greater.run.vault,'Ordinary routes and AP defeat the guarded deep reserve');use('exp-return');T.finishExpedition();T.close();
 ok(T.state.greater.expeditionWins.carriage===1&&T.state.weapons.includes('arcblade'),'Tier-five extraction banks its real deep-cache weapon');
 ok(T.save(true)&&T.restore().greater.expeditionWins.carriage===1,'The completed difficult expedition and maps persist');out.push('Prepared Carriage Zero: '+(rounds-prior)+' hostile rounds');return out;
 }''')
 page.screenshot(path='/workspace/undergrid-alpha8-evidence/cartography-return.png');page.evaluate("localStorage.setItem('undergrid.hollow-signal.v2',window.ATLAS_PLAY_SAVE);UG_TEST.start(true);UG_TEST.action('map')");page.screenshot(path='/workspace/undergrid-alpha8-evidence/atlas-world-play.png');page.locator('[data-atlas-tab="local"]').click();page.screenshot(path='/workspace/undergrid-alpha8-evidence/atlas-local-play.png');assert not errors,errors
 print('PASS:',len(results)-2,'normal-action navigation/expedition checks; 0 page errors')
 for line in results:print(' PASS',line)
 b.close()
