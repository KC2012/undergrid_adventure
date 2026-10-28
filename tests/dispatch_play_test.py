"""Prepared tier-three crew, then a full defense job with normal AP and turns.
Equipment/level are a fixture before dispatch. No HP, position, AP, resource or
objective edits occur during the job; movement uses normal routes and orders.
"""
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':960});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8000/UNDERGRID_ADVENTURE.html?test');page.get_by_role('button',name='BEGIN EXPEDITION').click()
 results=page.evaluate('''()=>{
 const T=UG_TEST,out=[],ok=(v,n)=>{if(!v)throw Error(n);out.push(n)};let seed=84;Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 T.enlist('vera');T.enlist('orren');T.gainXP(195);T.reward({weapon:'sniper',armorKey:'mesh',ammo:80,meds:2});
 for(let i=0;i<T.state.party.length;i++){T.selectCrew(i);T.action('inventory');document.querySelector('[data-equip="'+(i===1?'sniper':'rifle')+'"]').click();document.querySelector('[data-kit="armorKey:mesh"]').click();T.close();}
 T.travel('market',560,880);const credits=T.state.credits,story=JSON.stringify(T.state.world);ok(T.startActivity('defense'),'Prepared crew accepts the defense contract');let turns=0,damage=0,shots=0;
 function drain(){for(let i=0;i<30&&T.paths.size;i++)T.updatePaths(10)}
 while(T.state.adventure.run&&!T.state.adventure.run.finished&&turns<8){
  for(let i=0;i<T.state.party.length&&T.battle;i++){T.selectCrew(i);const a=T.selected;if(a.hp<=0)continue;
   for(let n=0;n<6&&T.battle&&a.ap>0&&!T.state.adventure.run.finished;n++){
    if(T.state.adventure.run.assetHP<70&&Math.abs(a.x-600)<110&&a.y===880){T.interact();if(T.state.adventure.run.repairRound===T.battle.round)break;}
    if(!a.mag&&T.state.ammo){T.action('reload');continue;}
    const w=T.combatWeapon(a),legal=T.combatEnemies().filter(e=>T.shotInfo(a,e).legal).sort((a,b)=>a.hp-b.hp);
    if(legal.length&&a.ap>=w.ap&&a.mag){T.shoot(a,legal[0]);shots++;continue;}
    const target=T.combatEnemies().sort((a,b)=>Math.hypot(a.x-T.selected.x,a.y-T.selected.y)-Math.hypot(b.x-T.selected.x,b.y-T.selected.y))[0];if(!target)break;
    const r=T.route(a,target.x,target.y);if(!r)break;const next=r.points.find(p=>Math.hypot(p.x-a.x,p.y-a.y)>3);if(!next)break;
    const d=Math.hypot(next.x-a.x,next.y-a.y),ratio=Math.min(1,T.moveAllowance(a)/d),x=Math.abs(next.y-a.y)>1?next.x:a.x+(next.x-a.x)*ratio,y=Math.abs(next.y-a.y)>1?next.y:a.y;
    if(!T.moveTo(a,x,y))break;drain();
   }
  }
  if(T.battle&&!T.state.adventure.run.finished){T.endTurn();const hp=T.state.adventure.run.assetHP;for(let i=0;i<12&&T.battle?.phase==='enemy'&&!T.state.adventure.run.finished;i++)T.battleUpdate(1);damage+=Math.max(0,hp-T.state.adventure.run.assetHP);turns++;}
 }
 ok(T.state.adventure.run?.finished==='win','Defense wins through real combat and objective turns ('+turns+' hostile rounds)');
 ok(shots>0&&damage>0,'Gunfire and genuine hostile relay damage occur');T.adventureTick(0);
 ok(T.state.room==='market'&&T.state.credits===credits-10+70&&T.state.gears.includes('blastliner'),'Successful work pays the quoted fee/reward and rare gear');
 const after=JSON.parse(JSON.stringify(T.state.world));delete after.trial;const before=JSON.parse(story);delete before.trial;ok(JSON.stringify(after)===JSON.stringify(before),'A complete dispatched battle leaves story populations untouched');
 ok(T.restore().adventure.activityWins.defense===1,'Successful dispatched objective is saved');return out;
 }''')
 page.screenshot(path='/tmp/ua4-dispatch-complete.png');assert not errors,errors
 print('PASS:',len(results),'normal-AP dispatched defense checks; 0 page errors')
 for r in results:print(' PASS',r)
 b.close()
