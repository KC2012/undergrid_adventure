"""Milestone A: all 15 weapon paths and 6 armor silhouettes, equipment parity,
preview consistency, identities, animation and one draw per world fighter."""
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':960});errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8000/UNDERGRID_ADVENTURE.html?test')
 page.get_by_role('button',name='BEGIN EXPEDITION').click()
 results=page.evaluate('''()=>{
  const T=UG_TEST,out=[],ok=(v,n)=>{if(!v)throw Error(n);out.push(n)};
  const canvas=document.createElement('canvas');canvas.width=280;canvas.height=180;const g=canvas.getContext('2d');
  function raster(a,opt={}){g.clearRect(0,0,280,180);g.save();g.translate(90,155);g.scale(2.3,2.3);T.drawFighterModel(g,a,{preview:true,time:0,dir:1,...opt});g.restore();return canvas.toDataURL()}
  let a=T.selected;const guns=new Set();for(const id of Object.keys(UG.weapons)){a.weapon=id;ok(T.appearance(a).weapon===id,'authoritative weapon '+id);guns.add(raster(a));}ok(guns.size===15,'15 different rendered weapon silhouettes with identical color/armor');
  a.weapon='rifle';let armor=new Set();for(const id of Object.keys(UG.armors)){a.armorKey=id;ok(T.appearance(a).armor===id,'authoritative armor '+id);armor.add(raster(a));}ok(armor.size===6,'Six different rendered armor silhouettes');
  a.armorKey='leathers';let gear=new Set();for(const id of Object.keys(UG.gear)){a.gear=id;gear.add(raster(a));}ok(gear.size===Object.keys(UG.gear).length,'All field gear changes the visible kit');
  const base={...a,weapon:'rifle',armorKey:'mesh',gear:'none'};ok(raster({...base,id:'vera'})!==raster({...base,id:'orren'}),'Companion identities remain distinct in identical kit');
  for(const [id,c] of Object.entries(UG.companions)){const x={...base,id,weapon:c.weapon};ok(T.appearance(x).weapon===c.weapon,'Own companion equipment '+id);}
  for(const [type,e] of Object.entries(UG.enemyTypes)){const x={...e,type,id:'fixture',enemy:true};ok(T.appearance(x).weapon===e.weapon,'Enemy equipment '+type);}
  a.weapon='rifle';a.mag=6;a.gear='none';a.armorKey='leathers';T.state.weapons=Object.keys(UG.weapons);T.state.armors=Object.keys(UG.armors);T.action('inventory');
  ok(document.querySelectorAll('[data-weapon-art]').length===15,'Every weapon has shared-path inspection art');ok(document.querySelectorAll('[data-armor-art]').length===6,'Every armor has shared-model inspection art');
  document.querySelector('[data-equip="arc"]').click();ok(T.selected.weapon==='arc'&&T.appearance(T.selected).weapon==='arc','Inventory equip updates model immediately');
  document.querySelector('[data-kit="armorKey:carapace"]').click();ok(T.appearance(T.selected).armor==='carapace','Inventory armor updates model immediately');T.close();
  T.travel('cable',700,880);T.beginBattle();let target={...UG.enemyTypes.scav,...UG.rooms.cable.enemies[0],...T.state.world.cable.enemies.c1,enemy:true,maxhp:32};T.shoot(T.selected,target);
  ok(T.animations.get('rook').action==='fire','Firing drives actual fighter animation');T.selected.ap=3;T.action('reload');ok(T.animations.get('rook').action==='reload','Reload drives actual fighter animation');
  T.render();ok([...T.drawCounts.values()].every(n=>n===1),'Each world fighter is rendered once');ok(T.drawCounts.get('rook')===1,'One authoritative protagonist draw');
  const sheet=document.createElement('canvas');sheet.width=1200;sheet.height=600;sheet.id='artAudit';const q=sheet.getContext('2d');q.fillStyle='#0b140d';q.fillRect(0,0,1200,600);let i=0;for(const id of Object.keys(UG.weapons)){let x=(i%5)*240,y=Math.floor(i/5)*190;q.save();q.translate(x+80,y+135);q.scale(1.8,1.8);T.drawFighterModel(q,{...base,id:'rook',weapon:id},{preview:true,time:0});q.restore();q.fillStyle='#ccf58b';q.font='12px monospace';q.fillText(UG.weapons[id].name,x+12,y+168);i++;}document.body.appendChild(sheet);sheet.style='position:fixed;inset:0;z-index:100;width:1200px;height:600px';
  return out;
 }''')
 page.locator('#artAudit').screenshot(path='/tmp/undergrid-equipment-atlas.png')
 page.evaluate('''()=>{const c=document.createElement('canvas');c.width=1200;c.height=320;c.id='armorAudit';const g=c.getContext('2d');g.fillStyle='#0b140d';g.fillRect(0,0,1200,320);Object.keys(UG.armors).forEach((armorKey,i)=>{g.save();g.translate(i*200+65,225);g.scale(3,3);UG_TEST.drawFighterModel(g,{...UG_TEST.selected,id:'rook',weapon:'pistol',armorKey,gear:'none',mod:'none'},{preview:true,time:0});g.restore();g.fillStyle='#ccf58b';g.font='12px monospace';g.fillText(UG.armors[armorKey].name,i*200+8,270)});document.body.appendChild(c);c.style='position:fixed;inset:0;z-index:101;width:1200px;height:320px'}''')
 page.locator('#armorAudit').screenshot(path='/tmp/undergrid-armor-atlas.png')
 assert not errors,errors
 print('PASS:',len(results),'visual checks; 0 page errors')
 for r in results:print(' PASS',r)
 b.close()
