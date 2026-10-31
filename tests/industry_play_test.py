"""Prepared midgame crew, then ordinary travel/combat/UI only throughout Alpha 10.
Fixture grants kit/levels and a reached Skyhooks checkpoint; no edits after departure.
"""
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':960});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8000/UNDERGRID_ADVENTURE.html?test');page.get_by_role('button',name='BEGIN EXPEDITION').click()
 results=page.evaluate('''()=>{
 const T=UG_TEST,out=[],ok=(v,n)=>{if(!v)throw Error(n);out.push(n)};let seed=147,fights=0,rounds=0;Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
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


 T.enlist('vera');T.enlist('orren');T.enlist('latch');T.gainXP(390);T.reward({weapon:'rifle',armorKey:'mesh',gear:'shockground',ammo:180,meds:8,scrap:30});T.state.flags.liftPower=true;kit();T.travel('skyhooks',1690,470);
 // From here, all acquisitions and changes use normal gameplay transactions.
 use('vent-road');ok(T.state.room==='vents','Actual Skyhooks door enters the transformed Cathedral');
 use('air-router');document.querySelector('[data-industry-method="crew"]').click();T.close();ok(T.state.flags.ventAir,'Engineering restores the occupied air circuit and its alternate ladder');
 go(1050,1480);go(1100,1200);
 use('choir-record');document.querySelector('[data-industry-method="read"]').click();T.close();ok(T.state.items.choirRoll,'The ninth shift record starts Latch’s connected personal work');
 use('generator');T.close();ok(T.state.flags.ventPower,'Existing generator progression still works in the redesigned space');
 use('baffle-case');document.querySelector('[data-industry-method="recover"]').click();T.close();ok(T.state.gears.includes('baffle'),'Real exploration and combat recover the Cathedral’s rare pressure collar');
 use('walking-road');ok(T.state.room==='walker','The restored generator unlocks the new branch through its actual door');use('walker-supplies');
 use('carrier-dump');document.querySelector('[data-industry-method="dump"]').click();T.close();ok(T.state.industry.taken.dump,'The crew discharges real cargo into the industrial encounter');
 use('stride-drive');document.querySelector('[data-industry-method="crew"]').click();T.close();ok(T.state.flags.walkerDrive,'Restoring the stride drive changes the route and wakes its inspection reserve');
 use('walker-orders');document.querySelector('[data-industry-method="read"]').click();T.close();use('walker-orders');document.querySelector('[data-industry-method="standdown"]').click();T.close();ok(T.state.world.walker.enemies['wk-inspector'].spared&&T.state.world.walker.enemies['wk-reserve'].spared,'Investigation resolves both inspectors without killing them');
 use('home-feed');document.querySelector('[data-industry-method="homes"]').click();T.close();ok(T.state.flags.industrialHomes,'The crew routes its auxiliary supply to occupied Ward rooms');
 go(1250,1320);go(1620,1320);go(1120,1100);go(1450,700);
 use('last-step');document.querySelector('[data-industry-method="recover"]').click();T.close();ok(T.state.gears.includes('walkingRig'),'Real ascent and cleared encounters recover the last-step retrieval rig');
 ok(T.save(true)&&T.restore().industry.feed==='homes'&&T.restore().gears.includes('walkingRig'),'Branch machinery, rare equipment and chosen consequence survive save/load');
 window.INDUSTRY_PLAY_SAVE=JSON.stringify(T.state);out.push('Prepared Alpha 10 route: '+fights+' encounters / '+rounds+' hostile rounds');return out;
 }''')
 page.wait_for_timeout(400);page.screenshot(path='/workspace/undergrid-alpha10-evidence/industry-play.png')
 assert not errors,errors
 print('PASS:',len(results),'normal-action Strange Industry adventure checks; 0 page errors')
 for x in results:print(' PASS',x)
 b.close()
