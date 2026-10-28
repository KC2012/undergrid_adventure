"""Alpha 5 normal-action simulations. Fresh Bell Engine run has no resource,
health, XP, inventory or quest edits. Continuation/expedition scenarios have an
explicit prepared starting fixture, then use normal paths, AP, shots and turns.
They are deterministic bots, not human balance or duration measurements.
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
 // Full fresh introductory act through its actual objects and region transitions.
 use('mara');use('starter-stash');use('east');use('vera');use('cache-c');use('fuse');use('west');use('mara');kit();
 use('down');use('rig');use('sump-loot');use('orren');kit();use('furnace');use('valve');use('furnace-cache');use('heart');use('cable');use('archive-exit');use('cipher');use('longrifle');use('back');use('west');use('mara');use('cot');kit();use('east');use('exit');use('bell');use('bell-loot');use('engine');
 ok(T.state.ending&&T.campaignAct()===2,'A fresh crew completes Bell Engine through normal actions and continues into Act II');ok(T.mainObjective().includes('ACT II'),'The introductory ending points naturally to the wards');ok(T.save(true)&&T.restore().ending,'The completed introduction remains compatible with save/load');out.push('Fresh introductory act: '+fights+' encounters / '+rounds+' hostile rounds');
 // Prepared late-act fixture. From signing onward, no health/AP/resource/flag edits.
 T.start();T.enlist('vera');T.enlist('orren');T.gainXP(1365);T.reward({weapon:'railgun',armorKey:'mesh',gear:'shockground',ammo:450,meds:20,credits:300,scrap:60});
 for(const a of T.state.party){a.weapon='railgun';a.mag=5;a.armorKey='mesh';a.gear='shockground';a.skills=['patch'];}
 T.state.ending=true;Object.assign(T.state.flags,{railPass:true,convoy:true,sluice:true});T.travel('market',1010,880);ok(T.signCharter('commons'),'Prepared continuation signs the public charter through its actual transaction');T.travel('deadrail',1620,240);
 let beforeRounds=rounds;use('outer-line');use('ada');use('abyss');use('cold');use('governor');ok(T.state.items.governor&&!T.battle,'Cold Foundry couplers and Marshal are defeated with normal AP and weapons');use('abyss');use('junction');use('ada');ok(T.campaignAct()===4,'Normal return to Ada opens the Hidden Network');use('orchard');use('relay-a');use('relay-b');use('relay-c');use('unlisted');use('manifest');use('missing-worker');use('orchard');use('junction');use('ada');ok(T.state.items.anikHome,'Normal exploration reunites the missing operator');use('orchard');use('heart');use('heart-supplies');use('common-line');ok(!T.battle&&T.state.world.heart.enemies.receiver.hp===0,'Receiver and both tethers are defeated with ordinary AP and enemy turns');ok(T.finishCampaign('commons')&&T.campaignAct()===6&&T.state.greater.ending==='commons','A complete playable continuation reaches a public ending');T.close();T.action('journal');pageMarker=true;
 out.push('Prepared continuation: '+(rounds-beforeRounds)+' hostile rounds');T.close();
 // Prepared early expedition fixture, then all three authored work areas played.
 T.start();T.enlist('vera');T.enlist('orren');T.gainXP(390);T.reward({weapon:'rifle',armorKey:'mesh',ammo:180,meds:8,scrap:12});for(const a of T.state.party){a.weapon='rifle';a.mag=6;a.armorKey='mesh';a.skills=['patch'];}T.state.flags.power=true;T.travel('market',560,880);beforeRounds=rounds;
 ok(T.startExpedition('mill'),'Prepared early crew deliberately starts a multi-area expedition');use('exp-cache');use('exp-next');use('exp-primary');ok(T.state.greater.run.primary,'Actual routes/combat reach the contracted middle-floor freight');use('exp-control');use('exp-next');use('exp-cache');while(T.combatEnemies().length){const e=T.combatEnemies()[0];go(e.x-80,e.y);if(T.battle)fight();}use('exp-vault');ok(T.state.greater.run.vault,'Actual routes/combat reach and clear the optional deep reserve');use('exp-return');T.finishExpedition();ok(T.state.room==='market'&&T.state.greater.expeditionWins.mill===1&&T.state.gears.includes('surveykit'),'Normal multi-area expedition banks its haul and rare discovery');ok(T.save(true)&&T.restore().greater.expeditionWins.mill===1,'Normal expedition progression survives reload');out.push('Prepared expedition: '+(rounds-beforeRounds)+' hostile rounds');return out;
 }'''.replace('pageMarker=true;',''))
 page.screenshot(path='/tmp/ua5-expedition-return.png');assert not errors,errors
 print('PASS:',len([r for r in results if not r.startswith(('Fresh introductory','Prepared continuation:','Prepared expedition:'))]),'normal-action campaign/expedition checks; 0 page errors')
 for r in results:print(' PASS',r)
 b.close()
