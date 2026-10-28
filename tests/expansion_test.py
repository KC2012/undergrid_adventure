"""Ward Bound integration: campaign, migration, kit effects and crew input.
Controlled fixtures isolate mechanics and quest conditions. This is not a
substitute for a human balance playthrough of every combat encounter.
"""
import sys
from playwright.sync_api import sync_playwright
base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8000'
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':960});errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(base+'/UNDERGRID_ADVENTURE.html?test')
    page.get_by_role('button',name='BEGIN EXPEDITION').click()
    results=page.evaluate('''() => {
      const T=UG_TEST,out=[];function ok(v,n){if(!v)throw Error(n);out.push(n)}
      function reset(){T.start();Math.random=()=>.05;}
      function clear(id){for(const e of Object.values(T.state.world[id].enemies))e.hp=0;}
      function visit(id,key){if(T.battle)throw Error('Fixture left battle active');const o=UG.rooms[id].objects.find(o=>o.id===key);if(T.state.room!==id)T.travel(id,o.x,o.y);else Object.assign(T.selected,{x:o.x,y:o.y});T.close();T.interact();}
      function board(){T.travel('market',560,880);T.close();}
      function pay(id,choice){board();if(!T.state.contracts[id]){T.settleContract(id);T.close();}T.settleContract(id,choice);T.close();}
      function recruit(){clear('cable');visit('cable','vera');T.close();clear('sump');visit('sump','orren');T.close();}
      reset();ok(Object.keys(UG.rooms).length===16,'Sixteen districts');ok(Object.keys(UG.weapons).length===15,'Fifteen firearm/melee patterns');
      let old=T.fresh();delete old.expansion;for(const k of ['scrap','contracts','reputation','sorties','armors','gears','mods'])delete old[k];
      for(const id of Object.keys(old.world))if(!['hearth','cable','sump','furnace','archive','bell'].includes(id))delete old.world[id];
      for(const a of old.party)for(const k of ['armorKey','gear','mod','talents','points','bond','bondXP','callsign','dye'])delete a[k];
      old.credits=123;old.world.cable.enemies.c1.hp=7;old.flags.power=true;old.ending=true;let migrated=T.validate(old);
      ok(migrated.credits===123&&migrated.world.cable.enemies.c1.hp===7&&migrated.ending,'Old save migration preserves progress');
      ok(migrated.world.convoy&&migrated.party[0].armorKey==='leathers','Old save migration adds new world and equipment');
      let bad=T.fresh();bad.party[0].talents.aim=99;let rejected=false;try{T.validate(bad)}catch{rejected=true}ok(rejected,'Reject out-of-range talents');
      // Every destination lands on a real floor, not just a source hatch.
      for(const [id,r] of Object.entries(UG.rooms))for(const o of r.objects.filter(o=>o.type==='door')){const dest=UG.rooms[o.to];ok(!!dest&&dest.platforms.some(p=>p.y===o.sy&&o.sx>=p.x&&o.sx<=p.x+p.w),id+' landing '+o.id);}
      recruit();T.travel('hearth',720,880);T.beginBattle();
      T.state.party[0].ap=0;T.state.party[1].ap=2;T.state.party[2].ap=3;T.cycleCrew();ok(T.selected.id==='vera','Next-ready skips spent crew');T.cycleCrew();ok(T.selected.id==='orren','Next-ready advances crew');
      T.state.party[0].hp=0;T.selectCrew(0);ok(T.selected.id==='orren','Downed crew cannot become active');
      T.state.party[0].hp=90;T.travel('hearth',720,880);T.close();
      const a=T.selected,base=T.combatWeapon(a);T.reward({armorKey:'plate',gear:'targeter',mod:'hot'});a.armorKey='plate';a.gear='targeter';a.mod='hot';
      ok(T.armorSave(a)===a.armor+7,'Armor protection affects actual armor save');
      ok(T.moveAllowance(a)===195,'Heavy armor movement tradeoff');ok(T.combatWeapon(a).damage===base.damage+6&&T.combatWeapon(a).acc===base.acc+1,'Gear and mod stats combine');
      a.points=1;T.action('inventory');document.querySelector('[data-talent="runner"]').click();ok(a.points===0&&T.moveAllowance(a)===215,'Talent purchase changes movement allowance');T.close();
      T.reward({gear:'respirator'});a.gear='respirator';T.statusHit({},a,UG.weapons.needle);ok(!a.toxin,'Respirator blocks toxin');
      a.gear='none';T.statusHit({},a,UG.weapons.needle);let hp=a.hp;T.activationStatus(a);ok(a.hp===hp-5&&!a.toxin,'Toxin damages once on activation');
      T.reward({armorKey:'ceramic'});a.armorKey='ceramic';T.statusHit({},a,UG.weapons.flame);ok(!a.burn,'Firecoat blocks burn');
      T.reward({gear:'shockground'});a.gear='shockground';T.statusHit({},a,UG.weapons.arc);ok(!a.shocked,'Grounding braid blocks shock');
      T.state.scrap=100;T.action('workbench');document.querySelector('[data-craft="weapon:chainblade"]').click();ok(T.state.weapons.includes('chainblade')&&T.state.scrap===75,'Workbench charges salvage and unlocks pattern');T.close();
      T.action('inventory');document.querySelector('[data-equip="chainblade"]').click();ok(a.mag===0&&a.weapon==='chainblade','Melee equips without producing ammunition');T.close();
      T.travel('cable',900,880);T.beginBattle();let e={...UG.enemyTypes.scav,...UG.rooms.cable.enemies[0],...T.state.world.cable.enemies.c1,enemy:true,maxhp:32};
      const ammo=a.mag;T.shoot(a,e);ok(a.mag===ammo&&T.state.world.cable.enemies.c1.hp===0,'Chainblade works with zero ammunition');
      T.state.world.cable.enemies.c2.hp=0;T.state.world.cable.enemies.c3.hp=0;T.checkBattle();
      ok(a.bondXP>0&&T.state.scrap>75,'Victory grants bond progress and salvage');
      T.travel('hearth',720,880);a.hp=1;a.grudge=null;T.travel('cable',700,880);T.state.world.cable.enemies.c2.hp=32;T.state.world.cable.enemies.c2.x=850;for(const p of T.state.party.slice(1))p.x=100;T.beginBattle();
      T.enemyStep('c2');ok(!!a.grudge&&a.grudge.enemy==='c2','A downing creates a personal blood debt');
      T.state.world.cable.enemies.c2.hp=0;T.checkBattle();T.travel('hearth',720,880);
      // Complete the freight arc through its actual inventory / turn-in checks.
      reset();recruit();T.state.flags.power=true;
      board();T.settleContract('freight');T.close();ok(!T.contractReady(UG.contracts.freight),'Freight blocks without parts');
      clear('yard');visit('yard','axle');clear('slag');visit('slag','diesel');clear('foundry');visit('foundry','drive');
      ok(T.contractReady(UG.contracts.freight),'Freight parts satisfy contract');pay('freight');ok(T.state.flags.railPass&&T.state.weapons.includes('smg'),'Freight charter and SMG reward');
      let money=T.state.credits;pay('freight');ok(T.state.credits===money,'Contract cannot pay twice');
      visit('garden','dock');ok(T.state.room==='garden','Dock sluice initially locked');clear('garden');visit('garden','membrane');pay('water');ok(T.state.flags.sluice,'Clinic filters unlock dock route');
      visit('garden','dock');ok(T.state.room==='docks','Sluice gate opens after filter job');
      visit('foundry','coupler');pay('lift');ok(T.state.flags.liftPower,'Coupler unlocks counterweight lift');visit('market','lift');ok(T.state.room==='skyhooks','New upper district is traversable');
      clear('deadrail');visit('deadrail','ledger');pay('ledger','burn');ok(T.state.flags.blackkey&&T.state.party[1].bond===2&&T.state.reputation>0,'Protecting courier routes strengthens Vera bond and opens Blacksite');
      visit('foundry','blacksite');ok(T.state.room==='blacksite','Ledger key opens Blacksite freight lock');
      clear('foundry');visit('foundry','apprentice');T.close();pay('apprentice','clinic');ok(T.state.party[2].bond===2&&T.state.gears.includes('medrig'),'Apprentice choice strengthens Orren bond');
      clear('docks');visit('docks','cargo');pay('cargo');ok(T.state.contracts.cargo.done,'Clinic cargo contract completes');
      clear('skyhooks');visit('skyhooks','wages');pay('wages');ok(T.state.armors.includes('ghost'),'Wages unlock ghostweave');
      pay('toll');ok(T.state.contracts.toll.done,'Cleared Ashline pays bounty');
      board();T.settleContract('escort');T.close();visit('yard','locomotive');T.action('boardtrain');ok(T.state.room==='convoy','Locomotive boards escort arena');
      clear('convoy');visit('convoy','cab');ok(T.state.room==='yard'&&T.state.items.convoyReceipt,'Finishing vehicle encounter delivers freight receipt');pay('escort');ok(T.state.contracts.escort.done&&T.state.flags.convoy,'Escort pays and opens salvage work');
      clear('blacksite');visit('blacksite','blackcase');pay('cache');ok(T.state.armors.includes('carapace')&&T.state.weapons.includes('plasma'),'Blacksite pays its unregistered cache job');
      ok(Object.values(T.state.contracts).filter(q=>q.done).length===10,'All ten contracts complete');
      board();T.action('contracts');document.querySelector('[data-sortie="yard"]').click();ok(T.state.room==='yard'&&T.state.sorties.yard===1&&T.state.world.yard.enemies.y1.hp>0,'Salvage commission repopulates cleared work site');
      ok(T.state.world.yard.opened.axle,'Repopulation preserves old discoveries');
      clear('yard');T.travel('market',560,880);T.selected.callsign='<Rivet>';T.save(true);const saved=T.restore();ok(saved&&saved.contracts.escort.done&&saved.party[0].callsign==='<Rivet>','Expanded campaign save round trip');
      T.action('inventory');ok(document.querySelector('#panel h1').textContent==='<Rivet>','Custom callsign is rendered safely as text');T.close();
      // Enemy support behavior is exercised separately from quest fixtures.
      reset();T.travel('yard',400,880);T.state.world.yard.enemies.y1.hp=5;T.beginBattle();T.enemyStep('y2');ok(T.state.world.yard.enemies.y1.hp===23,'Enemy medic actually heals a wounded ally');
      T.state.world.yard.enemies.y1.hp=0;T.state.world.yard.enemies.y2.hp=0;T.state.world.yard.enemies.y3.hp=0;T.checkBattle();
      T.travel('slag',1470,880);T.beginBattle();hp=T.selected.hp;T.enemyStep('sl2');ok(T.state.world.slag.enemies.sl2.hp===0&&T.selected.hp<hp,'Demolition runner detonates near crew');
      // Simulated complete new encounter: normal AP, damage, magazines, enemy
      // activations and route motion; no enemy-health edits during this fight.
      reset();recruit();T.gainXP(650);T.reward({armorKey:'mesh',gear:'targeter'});T.state.ammo=120;T.state.meds=8;
      for(const a of T.state.party){a.weapon=a.id==='orren'?'shotgun':'rifle';a.mag=UG.weapons[a.weapon].mag;a.armorKey='mesh';a.gear='targeter';a.hp=a.maxhp;}
      if(!T.state.weapons.includes('rifle'))T.state.weapons.push('rifle');T.travel('convoy',100,880);T.beginBattle();
      let seed=91;Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};let rounds=0;
      function foes(){return UG.rooms.convoy.enemies.map(e=>({...UG.enemyTypes[e.type],...e,...T.state.world.convoy.enemies[e.id],enemy:true,maxhp:UG.enemyTypes[e.type].hp})).filter(e=>e.hp>0)}
      while(T.battle&&T.state.room==='convoy'&&rounds++<30){
        for(let i=0;i<T.state.party.length&&T.battle;i++){
          T.selectCrew(i);const a=T.state.party[i];if(a.hp<=0)continue;
          for(let n=0;n<5&&T.battle&&a.ap>0;n++){
            if(a.hp<a.maxhp*.45&&T.state.meds){T.action('heal');continue;}
            if(a.mag===0&&T.state.ammo){T.action('reload');continue;}
            let target=foes().filter(e=>T.shotInfo(a,e).legal).sort((a,b)=>a.hp-b.hp)[0];
            if(target&&a.ap>=UG.weapons[a.weapon].ap){T.shoot(a,target);continue;}
            target=foes().sort((e,f)=>Math.hypot(e.x-a.x,e.y-a.y)-Math.hypot(f.x-a.x,f.y-a.y))[0];if(!target)break;
            let route=T.route(a,target.x,target.y);if(!route)break;const pt=route.points.find(p=>Math.hypot(p.x-a.x,p.y-a.y)>3);if(!pt)break;
            const distance=Math.hypot(pt.x-a.x,pt.y-a.y),budget=T.moveAllowance(a)*Math.min(a.ap,2),ratio=Math.min(1,budget/distance);
            // Vertical moves require a complete ladder; horizontal legs can stop early.
            const x=Math.abs(pt.y-a.y)>1?pt.x:a.x+(pt.x-a.x)*ratio,y=Math.abs(pt.y-a.y)>1?pt.y:a.y;
            if(!T.moveTo(a,x,y))break;for(let k=0;k<10&&T.paths.size;k++)T.updatePaths(10);
          }
        }
        if(T.battle){T.endTurn();for(let n=0;n<10&&T.battle?.phase==='enemy';n++)T.battleUpdate(2);}
      }
      ok(T.state.room==='convoy'&&!T.battle&&foes().length===0,'Complete convoy combat simulation wins through ordinary actions');
      ok(rounds<30,'Convoy simulation completes without path or turn deadlock');
      // Alternate personal resolution, tracking, return-to-board rule, and prices.
      reset();recruit();T.state.flags.power=true;T.state.items.ledger=true;pay('ledger','sell');
      ok(T.state.reputation===-2&&T.state.contracts.ledger.choice==='sell','Selling routes creates a different persisted outcome');
      T.travel('market',380,660);T.interact();let credits=T.state.credits;document.querySelector('[data-buy="ammo"]').click();ok(credits-T.state.credits===18,'Negative standing increases shop prices');T.close();
      T.state.reputation=3;T.interact();credits=T.state.credits;document.querySelector('[data-buy="ammo"]').click();ok(credits-T.state.credits===12,'Positive standing discounts shop prices');T.close();
      board();T.settleContract('water');T.close();T.action('contracts');document.querySelector('[data-track="water"]').click();ok(T.state.tracked==='water','A job can be pinned to the HUD');T.close();
      T.travel('yard',100,880);ok(!T.settleContract('freight'),'Cannot settle work away from a board');
      T.travel('market',560,880);T.selected.points=0;T.selected.talents.aim=2;T.state.scrap=20;T.action('inventory');document.querySelector('[data-respec="true"]').click();ok(T.selected.points===2&&T.selected.talents.aim===0&&T.state.scrap===12,'Retraining refunds talents for salvage');T.close();
      // Ready a visible three-person party for UI testing and screenshots.
      reset();recruit();T.travel('convoy',620,880);T.state.flags.power=true;T.state.party[0].ap=3;T.state.party[1].ap=2;T.state.party[2].ap=1;
      T.beginBattle();T.state.party[1].ap=2;T.state.party[2].ap=1;T.render();return out;
    }''')
    # Real inputs: select dock card, keyboard cycle, and preserve big AP text.
    page.wait_for_timeout(250)
    assert page.locator('#crewDock .quick-crew').count()==3
    page.locator('#crewDock [data-select="1"]').click()
    assert page.evaluate('UG_TEST.selected.id')=='vera'
    assert page.locator('#crewDock .chosen .ap-readout').inner_text().startswith('2')
    page.keyboard.press('Tab');assert page.evaluate('UG_TEST.selected.id')=='orren'
    page.screenshot(path='/tmp/undergrid-wardbound-desktop.png')
    # Real emulated touch selection without opening the inventory menu.
    snapshot=page.evaluate('JSON.stringify(UG_TEST.state)')
    mobile=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
    mp=mobile.new_page();mp.on('pageerror',lambda e:errors.append(str(e)))
    mp.goto(base+'/UNDERGRID_ADVENTURE.html?test')
    mp.evaluate('(data)=>localStorage.setItem("undergrid.hollow-signal.v2",data)',snapshot)
    mp.evaluate('UG_TEST.start(true);UG_TEST.beginBattle();UG_TEST.state.party[1].ap=2')
    mp.wait_for_timeout(350)
    mp.locator('#crewDock [data-select="1"]').tap()
    assert mp.evaluate('UG_TEST.selected.id')=='vera'
    assert mp.locator('#crewDock').is_visible()
    assert mp.evaluate('document.documentElement.scrollWidth<=innerWidth')
    mp.screenshot(path='/tmp/undergrid-wardbound-mobile.png')
    assert not errors,errors
    print(f'PASS: {len(results)+7} expansion checks; {len(errors)} browser errors')
    for name in results:print('  PASS',name)
    browser.close()
