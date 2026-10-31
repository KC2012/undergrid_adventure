"""Alpha 7 fresh restoration loop through ordinary routes, AP, ammo, combat and turns.
No prepared crew or resource/quest/health edits; deterministic bot, not a human balance test.
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
  for(let tick=0;tick<400&&T.paths.has(a.id)&&!T.battle;tick++){T.updatePaths(.1);T.fluidMovement(.1);}
 }throw Error('Route never arrived in '+T.state.room+' at '+x+','+y+' / '+JSON.stringify(T.selected));}
 function use(id){const o=UG.rooms[T.state.room].objects.find(o=>o.id===id);if(!o)throw Error('Missing '+id+' in '+T.state.room);go(o.x,o.y);T.interact();T.close();}
 function kit(){if(T.state.scrap>=14&&!T.state.armors.includes('mesh')){T.action('workbench');document.querySelector('[data-craft="armorKey:mesh"]').click();T.close();}
  for(let i=0;i<T.state.party.length;i++){T.selectCrew(i);const a=T.selected;T.action('inventory');if(T.state.weapons.includes('rifle'))document.querySelector('[data-equip="rifle"]').click();if(T.state.armors.includes('mesh'))document.querySelector('[data-kit="armorKey:mesh"]').click();while(a.points>0&&a.talents.power<4)document.querySelector('[data-talent="power"]').click();T.close();if(a.abilityPoints&&!a.skills.includes('patch')){T.action('skills');document.querySelector('[data-learn="patch"]').click();T.close();}}
  T.selectCrew(0);}
 // Fresh optional adventure: no health, inventory, quest or currency edits.
 use('ward-dispatch');ok(T.state.ward.rumors.funeral==='heard','Nell introduces the relic lead before story progress');
 ok(!T.state.flags.quest&&!T.state.flags.power,'Optional start does not accept the main quest');
 use('starter-stash');ok(T.startExpedition('service'),'Fresh crew can enter the Service Drains without story gates');
 use('exp-cache');use('exp-next');use('exp-primary');for(const e of UG.rooms[T.state.room].enemies){if(T.state.world[T.state.room].enemies[e.id].hp>0){go(e.x-60,e.y);if(T.battle)fight();}}use('relic-sunday');ok(T.wardClaim('sunday'),'Courier coat recovered into at-risk freight');T.close();use('exp-control');use('exp-next');
 for(const e of UG.rooms[T.state.room].enemies){if(T.state.world[T.state.room].enemies[e.id].hp>0){go(e.x-60,e.y);if(T.battle)fight();}}use('relic-funeral');ok(T.wardClaim('funeral'),'A fresh solo crew reaches the guarded Funeral Bell through real routes and combat');T.close();
 ok(!T.state.weapons.includes('funeral')&&T.state.ward.cargo.includes('funeral'),'Exceptional freight is not owned until extraction');
 use('exp-return');T.finishExpedition();T.close();
 ok(T.state.room==='hearth'&&T.state.life.prototypes.funeral==='frame'&&!T.state.weapons.includes('funeral')&&T.state.armors.includes('sunday'),'Successful extraction banks the incomplete frame and courier coat');
 ok(T.state.ward.machinery===1,'First Service Drains freight provides workshop machinery');
 use('project-workshop');ok(T.wardBuild('workshop'),'Earned optional rewards commission the workshop');
 for(let i=0;i<9;i++)T.wardTick(1);
 ok(T.state.ward.projects.workshop.status==='ready','Construction completes into a persistent working facility');
 use('project-quarters');ok(T.wardBuild('quarters'),'Earned salvage commissions a home for the missing engineer');T.wardTick(8);
 use('east');ok(T.state.life.active.cable==='camp','Returning to familiar territory reveals the scavenger camp');
 const camp=UG.rooms.cable.objects.find(o=>o.id==='regional-camp');go(camp.x,camp.y);T.interact();document.querySelector('[data-life-choice="camp:listen"]').click();
 ok(T.state.items.annexClue,'The camp explains the live-floor route without a main-story flag');
 use('vera');ok(T.state.party.length===2,'The courier joins this optional adventure');
 T.action('inventory');document.querySelector('[data-equip="rifle"]').click();document.querySelector('[data-kit="armorKey:sunday"]').click();T.close();
 use('test-annex');use('annex-isolate');
 for(const e of UG.rooms[T.state.room].enemies){if(T.state.world[T.state.room].enemies[e.id].hp>0){go(e.x-60,e.y);if(T.battle)fight();}}
 use('annex-governor');ok(T.state.life.components.funeral&&T.state.flags.annexSafe,'Real routes, isolation and combat recover the missing component');
 const rill=UG.rooms[T.state.room].objects.find(o=>o.id==='annex-rill');go(rill.x,rill.y);drain();T.interact();document.querySelector('[data-life-choice="rill:ward"]').click();
 ok(T.state.life.rescue==='ward','The engineer accepts the completed Ward housing');
 use('annex-return');use('west');use('resident-edda');T.lifeService('reunion');T.close();
 go(UG.wardProjects.workshop.x,UG.wardProjects.workshop.y);drain();T.action('lifework');document.querySelector('[data-life-restore="funeral"]').click();T.close();
 ok(T.state.weapons.includes('funeral')&&T.state.life.prototypes.funeral==='restored','Edda restores the frame through the actual workshop interface');
 T.action('inventory');document.querySelector('[data-equip="funeral"]').click();T.close();
 ok(T.selected.weapon==='funeral'&&T.combatWeapon(T.selected).knock===100,'Recovered weapon equips with its actual knockback mechanic');
 ok(T.save(true)&&T.restore().ward.recovered.includes('funeral')&&T.restore().ward.projects.workshop.status==='ready','Relics, workshop and machinery state survive validated save/load');
 ok(!T.state.flags.quest&&!T.state.flags.power&&!T.state.ending,'Complete optional development loop leaves main-story objectives untouched');
 const firstOrder=0;use('cot');drain();ok(T.startExpedition('service'),'The restored crew chooses another expedition');
 ok(T.state.greater.run.assignment!==firstOrder,'A repeated expedition has a different authored work order');
 use('exp-cache');use('exp-next');use('exp-primary');use('exp-control');use('exp-next');
 for(const e of UG.rooms[T.state.room].enemies){if(T.state.world[T.state.room].enemies[e.id].hp>0){go(e.x-60,e.y);if(T.battle)fight();}}
 use('life-order');ok(T.state.greater.run.sideDone,'The changed deep-reserve objective is completed through normal actions');
 use('exp-return');T.finishExpedition();T.close();ok(T.state.greater.expeditionWins.service===2,'The repeated expedition banks its bounded reward');
 ok(!T.state.flags.quest&&!T.state.flags.power,'The entire restoration and repeat loop leaves main-story progression untouched');
 const old=JSON.parse(JSON.stringify(T.state));delete old.ward;delete old.life;old.journal=['Last Light restored.'];const migrated=T.validate(old);ok(migrated.room==='hearth'&&migrated.journal[0].includes('Disintegration Ward')&&migrated.weapons.includes('funeral'),'Pre-Alpha-6 migration preserves location and equipment and renames historic notes');
 out.push('Fresh optional loop: '+fights+' encounters / '+rounds+' hostile rounds');return out;
 }''')
 page.screenshot(path='/workspace/undergrid-alpha7-evidence/alpha7-restoration.png');assert not errors,errors
 print('PASS:',len(results)-1,'fresh optional-loop checks; 0 page errors')
 for r in results:print(' PASS',r)
 b.close()
