"""Alpha 4: complete fresh opening through normal paths, AP, turns and rewards.
The opening scenario never edits HP, inventories, currencies, quest flags or XP.
A seeded bot issues the same orders available to the player, not combat shortcuts.
Separate controlled fixtures exercise abilities, dispatch objectives and migration.
"""
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':960});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8000/UNDERGRID_ADVENTURE.html?test');page.get_by_role('button',name='BEGIN EXPEDITION').click()
 results=page.evaluate('''()=>{
 const T=UG_TEST,out=[],ok=(v,n)=>{if(!v)throw Error(n);out.push(n)};let seed=147;Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};let rounds=0,engagements=0;
 function drain(){for(let i=0;i<30&&T.paths.size;i++)T.updatePaths(10)}
 function fight(){engagements++;let guard=0;while(T.battle&&guard++<35){if(T.state.room!=='cable')throw Error('Opening fight caused a defeat');
  for(let i=0;i<T.state.party.length&&T.battle;i++){const a=T.state.party[i];if(a.hp<=0)continue;T.selectCrew(i);if(engagements===1&&rounds===0&&i===1){T.action('overwatch');continue;}
   for(let n=0;n<6&&T.battle&&a.ap>0;n++){
    if(a.hp<a.maxhp*.45&&T.state.meds){T.action('heal');continue;}
    const w=T.combatWeapon(a);if(!w.melee&&!a.mag&&T.state.ammo){T.action('reload');continue;}
    const foes=T.combatEnemies(),legal=foes.filter(e=>T.shotInfo(a,e).legal).sort((a,b)=>a.hp-b.hp);
    if(legal.length&&a.ap>=w.ap&&a.mag){T.shoot(a,legal[0]);if(engagements===1&&rounds===0)break;continue;}
    const target=foes.sort((e,f)=>Math.hypot(e.x-a.x,e.y-a.y)-Math.hypot(f.x-a.x,f.y-a.y))[0];if(!target)break;
    const floor=UG.rooms.cable.platforms.find(p=>Math.abs(p.y-target.y)<10&&target.x>=p.x&&target.x<=p.x+p.w);if(!floor)break;
    const desired=w.range<400?140:Math.min(350,w.opt),tx=Math.max(floor.x+15,Math.min(floor.x+floor.w-15,target.x+(a.x<target.x?-desired:desired))),route=T.route(a,tx,floor.y);if(!route)break;
    const next=route.points.find(p=>Math.hypot(p.x-a.x,p.y-a.y)>2);if(!next)break;
    const d=Math.hypot(next.x-a.x,next.y-a.y),budget=T.moveAllowance(a)*a.ap,ratio=Math.min(1,budget/d),x=Math.abs(next.y-a.y)>1?next.x:a.x+(next.x-a.x)*ratio,y=Math.abs(next.y-a.y)>1?next.y:a.y;
    if(!T.moveTo(a,x,y))break;drain();
   }
  }
  if(T.battle){T.endTurn();for(let i=0;i<12&&T.battle?.phase==='enemy';i++)T.battleUpdate(1);rounds++;}
 }
 if(T.battle)throw Error('Opening combat did not resolve');}
 function go(x,y){T.selectCrew(0);for(let attempts=0;attempts<30;attempts++){
  if(T.battle)fight();T.selectCrew(0);const a=T.selected;if(Math.hypot(a.x-x,a.y-y)<5)return;
  if(!T.moveTo(a,x,y,true))throw Error('No route to opening objective '+x+','+y);
  for(let tick=0;tick<250&&T.paths.has(a.id)&&!T.battle;tick++){T.updatePaths(.1);T.fluidMovement(.1);}
 }throw Error('Opening route never arrived');}
 function use(id){const o=UG.rooms[T.state.room].objects.find(o=>o.id===id);go(o.x,o.y);T.interact();if(!document.querySelector('#shade').hidden)T.close();}
 use('mara');ok(T.state.flags.quest,'Opening conversation starts a clear objective');
 use('starter-stash');ok(T.state.ammo===76&&T.state.scrap>=15,'A reachable early reward teaches vertical exploration');
 use('east');ok(T.state.room==='cable','Walk to a real hatch and enter Cableworks');
 use('vera');ok(T.state.party.some(a=>a.id==='vera'),'Recruit courier without requiring a district-wide battle');
 go(720,880);if(T.battle)fight();ok(T.state.world.cable.enemies.c1.hp===0,'Opening scavenger defeated through ordinary actions');
 ok(T.state.world.cable.enemies.c2.hp>0,'First encounter does not force distant hostiles into combat');
 T.action('inventory');document.querySelector('[data-equip="rifle"]').click();T.close();ok(T.selected.weapon==='rifle'&&T.appearance(T.selected).weapon==='rifle','Equip a stronger firearm with an immediate matching visual');
 use('fuse');ok(T.state.items.fuse,'Reach the upper fuse using actual routes and encounters');
 use('west');ok(T.state.room==='hearth','Return through the original district connection');use('mara');ok(T.state.flags.power&&T.state.credits>=35,'Quest reward restores transit and funds a useful upgrade');
 ok(T.state.level>=2&&T.selected.abilityPoints>0,'The opening loop grants a meaningful ability choice');
 T.action('skills');document.querySelector('[data-learn="deadeye"]').click();T.close();ok(T.selected.skills.includes('deadeye'),'Spend the earned licence on a precision option');
 const damage=T.combatWeapon(T.selected).damage,credits=T.state.credits,scrap=T.state.scrap;T.action('calibrate');document.querySelector('[data-calibrate]').click();T.close();ok(T.state.credits===credits-35&&T.state.scrap===scrap-4&&T.combatWeapon(T.selected).damage===damage+2,'Earned resources buy a lasting fighter upgrade');
 ok(T.save(true),'Save completed opening loop');const loaded=T.restore();ok(loaded.flags.power&&loaded.party[0].skills.includes('deadeye')&&loaded.party[0].calibrations.rifle===1,'Loop progression survives save/load');
 ok(engagements>=2&&rounds>0&&rounds<25,'Opening completes in local, bounded encounters ('+engagements+' encounters / '+rounds+' hostile rounds)');
 return out;
 }''')
 page.screenshot(path='/tmp/ua4-loop-complete.png')
 assert not errors,errors
 print('PASS:',len(results),'complete-opening checks; 0 page errors')
 for r in results:print(' PASS',r)
 b.close()
