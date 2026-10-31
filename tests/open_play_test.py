"""Fresh Alpha 9 workshop/recruitment adventure with normal movement and combat.
No resources, health, quest progress, AP or equipment are injected.
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

 use('starter-stash');use('east');use('vera');use('cache-c');
 use('service-seam');const parts=T.state.scrap;document.querySelector('[data-open-id="workshop"][data-open-method="parts"]').click();T.close();
 ok(T.state.flags.serviceShortcut&&T.state.scrap===parts-3,'A fresh crew repairs the concealed service panel using earned salvage');
 go(800,350);use('nim-contact');document.querySelector('[data-open-id="nim"]').click();T.close();ok(T.state.party.some(a=>a.id==='nim'),'Nim joins through the actual workshop recruitment encounter');
 use('service-record');document.querySelector('[data-open-id="survey"][data-open-method="paper"]').click();T.close();ok(T.state.items.nimTrace&&!T.state.flags.surveyTerminal,'The paper copy supplies a non-engineer investigation approach');
 ok(T.atlasLocalSVG().includes('service-seam'),'The discovered workshop is recorded as a local landmark');
 use('west');use('down');use('orren');use('sump-loot');kit();ok(T.state.party.length===4,'Earned recruitment builds Rook plus three active companions');
 use('home');use('east');go(840,440);let r=T.route(T.selected,1040,440);ok(r.points.some(p=>p.kind==='jump'),'The four-person crew chooses the broken catwalk crossing');go(1040,440);
 for(let i=0;i<400;i++){T.fluidMovement(.016);T.updatePaths(.016);}ok(T.state.party.every(a=>a.y===440&&a.x>970),'Three companions follow the actual gap crossing');
 use('west');go(720,880);T.action('contracts');document.querySelector('[data-contract="nimTrail"]').click();T.close();T.action('contracts');document.querySelector('[data-contract="nimTrail"]').click();T.close();
 ok(T.state.contracts.nimTrail.done&&T.state.gears.includes('climbrig'),'Nim’s personal quest settles through the normal work board and unlocks climbing equipment');
 go(160,880);T.action('roster');document.querySelector('[data-bench="vera"]').click();T.close();ok(T.state.reserve.some(a=>a.id==='vera')&&T.state.party.length===3,'Returning to the Ward permits an actual shelter roster change');
 T.action('roster');document.querySelector('[data-enlist="vera"]').click();T.close();ok(T.state.party.length===4,'The benched courier returns with her equipment and progression');
 ok(T.save(true)&&T.restore().open.discoveries.workshop&&T.restore().contracts.nimTrail.done,'The new discovery, shortcut, four-person roster and personal quest survive validated save/load');
 ok(!T.state.flags.quest&&!T.state.flags.power,'The complete optional adventure leaves the opening story unaccepted');
 window.OPEN_PLAY_SAVE=JSON.stringify(T.state);out.push('Fresh Open Undergrid loop: '+fights+' encounters / '+rounds+' hostile rounds');return out;
 }''')
 page.evaluate("UG_TEST.travel('cable',840,440)");page.wait_for_timeout(350);page.screenshot(path='/workspace/undergrid-alpha9-evidence/open-crew.png')
 assert not errors,errors
 print('PASS:',len(results),'fresh Alpha 9 adventure checks; 0 page errors')
 for x in results:print(' PASS',x)
 b.close()
