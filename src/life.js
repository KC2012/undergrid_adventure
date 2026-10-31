/* Alpha 7 persistent life, restoration and visit-based world activity.
 * Visits, stock and unique choices are saved; animation and scenery are not. */
function lifeUpgrade(d) {
 if (!d.life) d.life={version:1,prototypes:{},components:{},visits:{},active:{},events:{},rescue:null,rescueSettled:false,deliveries:0,purchases:0,stock:d.ward.projects.freight?.status==='ready'?2:0};
 if(d.life.tracked===undefined)d.life.tracked=null;
 for (const id of Object.keys(UG.restorations)) if (d.weapons.includes(id)) d.life.prototypes[id]='restored';
 if(d.greater.run&&d.greater.run.assignment===undefined){d.greater.run.assignment=(d.greater.run.seed-1)%3;d.greater.run.sideDone=false;}
 if (d.ward.events.signal) d.life.components.mercy=true;
 return d;
}
function validateLife(d) {
 const l=d.life,record=o=>o&&typeof o==='object'&&!Array.isArray(o),count=n=>Number.isInteger(n)&&n>=0&&n<=1000000;
 if (!l||![null,'funeral','mercy'].includes(l.tracked)||l.version!==1||!['prototypes','components','visits','active','events'].every(k=>record(l[k]))||![null,'ward','road'].includes(l.rescue)||typeof l.rescueSettled!=='boolean'||![l.deliveries,l.purchases,l.stock].every(count)||l.stock>2) throw Error('Invalid adventurer life.');
 for (const [id,v] of Object.entries(l.prototypes)) if (!Object.hasOwn(UG.restorations,id)||!['frame','restored'].includes(v)||v==='restored'&&!d.weapons.includes(id)) throw Error('Invalid restored equipment.');
 for (const [id,v] of Object.entries(l.components)) if (!Object.hasOwn(UG.restorations,id)||v!==true) throw Error('Invalid restoration component.');
 for (const [id,v] of Object.entries(l.visits)) if (!UG.rooms[id]||!count(v)) throw Error('Invalid regional visits.');
 for (const [id,v] of Object.entries(l.active)) if (!UG.regionalEvents[v]||UG.regionalEvents[v].room!==id) throw Error('Invalid regional encounter.');
 for (const [id,v] of Object.entries(l.events)) if (!UG.regionalEvents[id]||!UG.regionalEvents[id].choices.some(c=>c[0]===v)) throw Error('Invalid regional outcome.');
 const run=d.greater.run;
 if (run?.assignment!==undefined&&(!Number.isInteger(run.assignment)||run.assignment<0||run.assignment>=UG.lifeOrders.length||typeof run.sideDone!=='boolean')) throw Error('Invalid expedition work order.');
}
function lifeObjects() {
 const r=room();r.objects=r.objects.filter(o=>o.type!=='life'||!o.dynamic);
 if (S.room==='hearth') for (const [id,n] of Object.entries(UG.residents)) {
  if (n.project&&!wardReady(n.project)||n.rescue&&S.life.rescue!=='ward') continue;
  r.objects.push(obj('resident-'+id,'life',n.x,n.y,n.name,{kind:'resident',resident:id,dynamic:true}));
 }
 const id=S.life.active[S.room],e=UG.regionalEvents[id];
 if (e&&!S.life.events[id]) r.objects.push(obj('regional-'+id,'life',e.x,e.y,e.name,{kind:'regional',event:id,dynamic:true}));
}
function lifeEnter(visit=true) {
 if (!S?.life) return;
 if (visit) {
  S.life.visits[S.room]=Math.min(1000000,(S.life.visits[S.room]||0)+1);
  delete S.life.active[S.room];
  // Sparse, authored candidates. Never respawn story enemies or interrupt set pieces.
  const candidate=Object.entries(UG.regionalEvents).find(([id,e])=>e.room===S.room&&!S.life.events[id]&&
   (id==='camp'&&(S.life.prototypes.funeral==='frame'||S.greater.expeditionWins.service)||
    id==='patient'&&wardReady('infirmary')&&!enemies().length||
    id==='freight'&&wardReady('freight')&&!enemies().length||
    id==='survey'&&S.ward.events.lift));
  if (candidate&&(S.life.visits[S.room]%3!==0)) S.life.active[S.room]=candidate[0];
 }
 lifeObjects();
}
function lifePrototype(id) {
 if (!UG.restorations[id]||S.weapons.includes(id)) return false;
 S.life.prototypes[id]='frame';S.life.tracked=id;S.ward.rumors[id]='investigated';
 log('Recovered incomplete '+UG.relics[id].name+'. Edda can assess it at the Ward Workshop.');
 moment('INCOMPLETE / '+UG.relics[id].name,'Frame secured. Build the Workshop, speak to Edda and recover its missing component.','RESTORATION JOURNAL','lifework');
 return true;
}
function lifeRestore(id) {
 const d=UG.restorations[id];
 if (!d||S.life.prototypes[id]!=='frame'||!S.life.components[id]||!wardReady('workshop')||!wardHere('workshop')) return false;
 const cost=Math.max(1,d.cost-(S.life.rescue==='ward'?2:0));
 if (S.scrap<cost) {notify('Restoration needs '+cost+' salvage.');return false;}
 S.scrap-=cost;S.life.prototypes[id]='restored';if(S.life.tracked===id)S.life.tracked=null;wardRecover(id);save(true);hud();return true;
}
function lifeWork() {
 panel('EDDA’S LEDGER / RESTORATION',`<h1>Give it another shift.</h1><p>Recovered frames stay in your shared collection. Components and commissioned facilities persist through saving. Old, already-working equipment stays usable.</p><div class="grid">${Object.entries(UG.restorations).map(([id,d])=>{
  const stage=S.life.prototypes[id],cost=d.cost-(S.life.rescue==='ward'?2:0);
  return `<article class="card"><div class="tag">${stage==='restored'?'RESTORED':stage?'INCOMPLETE FRAME':'UNDISCOVERED'}</div><h3>${UG.relics[id].name}</h3><p>${d.text}</p><p>${stage?'✓':'○'} Recover the frame<br>${S.life.components[id]?'✓':'○'} Recover ${d.component}<br>${wardReady('workshop')?'✓':'○'} Restore the Workshop</p><p>${d.site}. Restoration: ${cost} salvage, at the workshop.</p><button data-life-track="${id}">TRACK THIS RESTORATION</button><button data-life-restore="${id}" ${stage==='frame'&&S.life.components[id]&&wardReady('workshop')&&wardHere('workshop')&&S.scrap>=cost?'':'disabled'}>RESTORE WEAPON</button></article>`;
 }).join('')}</div><h2>The missing test engineer</h2><p>${S.life.rescue?S.life.rescue==='ward'?'Rill has a bunk in the Ward and helps Edda restore equipment.':'Rill travels with the next crew; you received a machinery unit.':'Rill is trapped in the Pump Test Annex beyond the eastern Cableworks hatch. Isolate the floor and clear its watchers. A completed Living Quarters project allows a permanent home.'}</p><button data-action="ward">WARD PROJECTS</button>`);
}
function lifeResident(id) {
 const n=UG.residents[id];
 let extra=id==='edda'?'<button data-action="lifework">ASSESS / RESTORE EQUIPMENT</button><button data-action="workbench">SPECIALIST PATTERNS</button>':
 id==='osa'?`<p>¢${S.credits} · ${S.life.stock}/2 supply parcels in stock. Osa restocks once per successful expedition. Each parcel is 18 ammunition and one medkit for ¢24.</p><button data-life-service="trade" ${S.life.stock&&S.credits>=24?'':'disabled'}>BUY SUPPLY PARCEL</button>`:
 id==='meda'?'<button data-life-service="treatment">CREW TREATMENT / 2 SALVAGE</button>':
 id==='sib'?'<button data-action="rumors">LISTEN TO EQUIPMENT LEADS</button><button data-action="lifework">THE OSSUARY CAPACITOR</button>':
 id==='nellie'?'<button data-action="lifehome">VISIT YOUR BUNK</button><button data-action="lifework">RILL’S LAST SHIFT</button>':'<button data-action="lifework">RESTORATION NOTES</button>';
 if (id==='edda'&&S.life.rescue==='ward'&&!S.life.rescueSettled) extra+='<button data-life-service="reunion">REUNITE THE ENGINEERS</button>';
 panel(n.name.toUpperCase(),`<p>${n.text}</p><div class="row">${extra}</div>`);
}
function lifeService(id) {
 if (battle||paths.has(selected().id)||S.room!=='hearth') return false;
 if (id==='trade') {
  const n=UG.residents.osa;if(!wardReady('freight')||!inInteractionRange(selected(),n)||!S.life.stock||S.credits<24)return false;
  S.credits-=24;S.life.stock--;S.life.purchases++;reward({ammo:18,meds:1});lifeResident('osa');
 } else if (id==='treatment') {
  if(!wardReady('infirmary')||!inInteractionRange(selected(),UG.residents.meda)||S.scrap<2||!allCrew().some(a=>a.hp<a.maxhp))return false;
  S.scrap-=2;for(const a of allCrew())a.hp=Math.min(a.maxhp,a.hp+40);notify('MEDA // Crew recovered up to 40 HP.');
 } else if (id==='reunion') {
  if(!wardHere('workshop')||S.life.rescue!=='ward'||S.life.rescueSettled)return false;
  S.life.rescueSettled=true;reward({credits:25,scrap:6});log('Rill and Edda reunited at the workshop.');notify('TWO ENGINEERS // Restoration costs reduced; ¢25 and six salvage.');
 } else return false;
 save(true);hud();return true;
}
function lifeChoice(id,choice) {
 if (battle||paths.has(selected().id)) {notify('Finish the encounter and let this fighter reach position first.');return false;}
 if(id==='rill'){
  const o=room().objects.find(o=>o.kind==='rescue'&&o.type==='life');
  if(!o||S.life.rescue||!inInteractionRange(selected(),o)||enemies().length||!S.flags.annexSafe||!['ward','road'].includes(choice)||choice==='ward'&&!wardReady('quarters'))return false;
  S.life.rescue=choice;if(choice==='road')S.ward.machinery++;else log('Rill has a bunk in Disintegration Ward. Edda will be waiting.');gainXP(20);
 } else {
  const e=UG.regionalEvents[id];if(!e||S.life.active[S.room]!==id||S.life.events[id]||!inInteractionRange(selected(),e)||!e.choices.some(c=>c[0]===choice))return false;
  if(id==='camp') {if(choice==='share'){if(S.ammo<6)return false;S.ammo-=6;S.reputation++;}S.items.annexClue=true;wardRumor('funeral');}
  if(id==='patient') {if(choice==='evacuate'){if(S.meds<1)return false;S.meds--;reward({credits:20,scrap:3});S.reputation++;}else S.reputation++;}
  if(id==='freight') {if(choice==='medical')reward({meds:2});else reward({scrap:6});}
  S.life.events[id]=choice;log(e.name+' / '+choice+'.');
 }
 close();lifeObjects();save(true);hud();return true;
}
function lifeInteract(o) {
 if(o.type!=='life')return false;
 if(battle){notify('Finish this encounter before talking or handling the test equipment.');return true;}
 if(o.kind==='resident'){lifeResident(o.resident);return true;}
 if(o.kind==='regional'){
  const e=UG.regionalEvents[o.event];panel(e.name,`<p>${e.text}</p>${e.choices.map(([id,label])=>`<button data-life-choice="${o.event}:${id}">${label}</button>`).join(' ')}<p>These choices are local; the Common Line can wait.</p>`);return true;
 }
 if(o.kind==='isolate'){S.flags.annexSafe=true;audioCue('machine');log('Pump Test Annex induction floor isolated.');notify('INDUCTION FLOOR ISOLATED // The test equipment is safe to recover.');save(true);return true;}
 if(o.kind==='component'){
  if(enemies().length||!S.flags.annexSafe){notify('Isolate the induction floor above and clear the test watchers first.');return true;}
  if(!S.life.components.funeral){S.life.components.funeral=true;gainXP(15);log('Recovered the tuned pressure governor. Edda can finish the Funeral Bell.');}
  notify('PRESSURE GOVERNOR // Bring the recovered frame and component to Edda’s workshop.');save(true);return true;
 }
 if(o.kind==='rescue'){
  panel('RILL / AN UNFINISHED SHIFT',`<p>${S.life.rescue?'Rill has already left the Annex.':'“I was testing a regulator. Then the floor started testing me. Edda is going to be impossible about this.”'}</p><p>${!S.flags.annexSafe?'Isolate the induction floor above.':enemies().length?'Clear the watchers before moving the engineer.':'The route is safe.'}</p><button data-life-choice="rill:ward" ${S.life.rescue||!wardReady('quarters')?'disabled':''}>OFFER A WARD BUNK / requires Living Quarters</button><button data-life-choice="rill:road" ${S.life.rescue?'disabled':''}>SEND RILL WITH THE FREIGHT CREW / one machinery</button>`);return true;
 }
 if(o.kind==='workorder'){lifeSideObjective(o);return true;}
 return false;
}
function lifeSideObjective(o) {
 const r=S.greater.run;if(!r||r.assignment===undefined||r.sideDone||!room().objects.includes(o)||!inInteractionRange(selected(),o)||battle||paths.has(selected().id))return false;
 const d=UG.lifeOrders[r.assignment];
 if(d.kind==='survivor'&&enemies().length){notify('Clear this deep floor before escorting its lost worker.');return false;}
 if(d.kind==='gauge'&&!r.control){notify('Open the deep-route drive first; the gauge must be isolated.');return false;}
 r.sideDone=true;r.bag.credits+=d.credits;r.bag.scrap+=d.scrap;log('Optional '+d.name+' completed. Reward travels with the freight.');notify('SIDE WORK SECURED // Extract with primary freight to bank its value.');save(true);hud();return true;
}
function lifeObjectives(r) {return r?.assignment===undefined?'Standard survey.':UG.lifeOrders[r.assignment].text;}
function lifeReport() {
 const r=S.greater.run;if(!r)return expeditionBoard();
 panel('EXPEDITION / RISK & RETURN',`<h1>${UG.expeditions[r.family].name}</h1><p>${greaterObjective()}</p><p>WORK ORDER / ${r.assignment===undefined?'Standard survey':UG.lifeOrders[r.assignment].name} · ${r.sideDone?'COMPLETE':'OPEN'}</p><p>Unbanked haul: ¢${r.bag.credits}, ${r.bag.scrap} salvage. Relic freight: ${S.ward.cargo.map(id=>UG.relics[id].name).join(', ')||'none'}.</p><p>${r.primary?'SUCCESSFUL EXTRACTION: bank primary pay and earned haul; recover relic frames/patterns.':'WITHDRAWAL BEFORE FREIGHT: keep half the scaled materials, lose relics and XP.'} Defeat keeps one quarter of scaled materials and loses relic cargo. Used supplies stay spent. Later returns reduce pay; no repeating XP after the first three trips.</p><button data-action="lifefindexit">WALK TO THIS AREA’S RETURN HATCH</button><button data-action="close">CONTINUE EXPLORING</button>`);
}
function lifeFindExit() {
 const o=room().objects.find(o=>o.type==='expedition'&&o.kind==='extract');if(!o)return false;
 close();if(battle){notify('Return hatch: west service entrance. Use ordinary movement/AP to reach it.');return false;}
 const moved=moveTo(selected(),o.x,o.y,true);if(!moved)notify('Return hatch is at the west service entrance; use its ladders.');return moved;
}
function lifeHome() {
 panel('YOUR BUNK / A LIFE BELOW',`<h1>Things brought home.</h1><p>${S.greater.ending?'A Common Line charter hangs beside the route map.':'A paper route map covers the old maintenance notice.'} ${S.life.rescue==='ward'?'Rill has left a repaired lamp by your locker.':''}</p><div class="grid">${S.ward.recovered.filter(id=>UG.relics[id].kind==='weapon').map(id=>`<article class="card"><h3>${UG.relics[id].name}</h3><canvas data-weapon-art="${id}" width="180" height="75"></canvas></article>`).join('')||'<p>An empty weapon rack waits beside the shared locker.</p>'}</div><p>${allCrew().filter(a=>a.id!=='rook').map(a=>escape(a.name)+': “'+(a.bond>=2?'We earned another place on this wall.':'Keep a bunk for me. I am coming back.')+'”').join('<br>')||'No companion has visited yet. A courier waits in the Cableworks.'}</p><div class="row"><button data-action="inventory">SHARED EQUIPMENT LOCKER</button><button data-action="map">YOUR ROUTE MAP</button><button data-action="roster">VISITING COMPANIONS</button></div>`);renderPreviews();
}
function lifeHUD() {
 const box=$('#lifeStatus');if(!box)return;
 const r=S.greater.run;box.hidden=!r;
 if(r){box.innerHTML=`<button data-action="lifereport">RETURN / ${r.primary?'FREIGHT SECURED':'FREIGHT NOT YET SECURED'} ↗</button>`;}
 if(S.adventure.hints&&!battle&&!S.flags.quest){const hint=$('#lesson');if(r)hint.textContent='Return hatch at the west entrance · complete middle-floor freight to bank relics · RETURN shows risk';else if(S.life.prototypes.funeral==='frame')hint.textContent='Recovered frame: Workshop → Edda → Pump Test Annex in eastern Cableworks';else hint.textContent='E use · F / NEXT cycle nearby objects · Mara: main story · Nell: optional salvage';}
}
function lifeTick(dt) {
 if(S.room==='testannex'&&!S.flags.annexSafe&&!battle){const a=selected();if(a.y>820&&a.x>650&&!kitGear(a).shock)a.hp=Math.max(1,a.hp-dt*3);}
}
function lifeDraw() {
 const col=room().color;
 for(const o of room().objects.filter(o=>o.type==='life')){
  if(o.kind==='resident'||o.kind==='rescue'||o.kind==='regional'){
   if(o.kind==='rescue'&&S.life.rescue)continue;
   figure({id:o.id,x:o.x,y:o.y,weapon:null,armorKey:'leathers',dir:-1},'#8ed5cd');
   if(o.kind==='regional'){for(let i=1;i<3;i++)figure({id:o.id+i,x:o.x-i*32,y:o.y,weapon:null,armorKey:'mesh'},'#688c80');outline(o.x-100,o.y-18,26,18,'#688c80');}
   if(inInteractionRange(selected(),o))text(o.name.split(' / ')[0].toUpperCase(),o.x,o.y-76,'#8ed5cd',10,'center');
  }else{outline(o.x-12,o.y-38,24,38,col);if(inInteractionRange(selected(),o))text(o.name,o.x,o.y-58,col,9,'center');}
 }
 if(S.room==='testannex'){for(let x=680;x<1450;x+=90){line(x,878,x+45,878,S.flags.annexSafe?'#48685c':'#e4b35f',3);if(!S.flags.annexSafe)line(x,870,x+Math.sin(clock*6)*18,856,'#e4b35f');}}
 if(S.room==='hearth'){
  for(const [id,p] of Object.entries(UG.wardProjects)){
   const st=S.ward.projects[id];if(!st)continue;
   const c=st.status==='ready'?'#718e62':'#7e7052';
   // Back walls and roof rails extend the existing station, without changing its routes.
   if(st.status==='ready'){line(p.x-65,p.y-94,p.x+62,p.y-94,c,3);line(p.x-65,p.y-94,p.x-65,p.y,c,2);for(let x=p.x-52;x<p.x+45;x+=32)rect(x,p.y-88,13,4,'#d4e5a4');}
   else{const n=8-st.remaining;text(n<3?'FOUNDATIONS':n<6?'ASSEMBLY':'COMMISSIONING',p.x,p.y-110,c,9,'center');}
  }
  if(wardReady('quarters')){for(const [i,id] of S.ward.recovered.filter(id=>UG.relics[id].kind==='weapon').slice(0,3).entries()){ctx.save();ctx.strokeStyle='#a5bc8c';drawHeld(ctx,id,420+i*38,610,.32);ctx.restore();}}
 }
}
function lifeAction(id) {
 if(id==='lifework'){lifeWork();return true;}if(id==='lifehome'){lifeHome();return true;}
 if(id==='lifereport'){lifeReport();return true;}if(id==='lifefindexit'){lifeFindExit();return true;}return false;
}
document.addEventListener('click',e=>{
 const el=e.target.closest('[data-life-restore],[data-life-service],[data-life-choice],[data-life-track]');if(!el||!S)return;
 if(el.dataset.lifeTrack&&UG.restorations[el.dataset.lifeTrack]){S.life.tracked=el.dataset.lifeTrack;S.tracked=null;save(true);hud();close();}
 if(el.dataset.lifeRestore&&lifeRestore(el.dataset.lifeRestore))lifeWork();
 if(el.dataset.lifeService)lifeService(el.dataset.lifeService);
 if(el.dataset.lifeChoice){const [id,choice]=el.dataset.lifeChoice.split(':');lifeChoice(id,choice);}
});

function lifeProjectReady(id) {
 if(id==='freight')S.life.stock=2;
 lifeObjects();
}
// Electrical propagation has its own short conductive ray, independent of the victim's gun.
function lifeConductiveRay(a,b){return !solidRayBlocked({x:a.x,y:a.y-25},{x:b.x,y:b.y-25});}

function lifeWeaponNote(a,w) {
 if(a.weapon==='deadair')return battle?.round===1?' / OPENING ROUND +18':' / OPENING BONUS SPENT';
 if(a.weapon==='disorder')return ' / 3-ROUND BURST · '+Math.round(weapon(a).acc)+'% weapon accuracy';
 if(w.chain)return ' / CONDUCTIVE CHAIN 180';
 if(a.weapon==='funeral')return ' / HEAVY KNOCKBACK';
 if(a.weapon==='widow')return ' / TWO CHAMBERS · 2 AP';
 if(a.weapon==='furnacekey')return ' / BURN 14';
 return '';
}

function lifeObjective() {
 const id=S.life?.tracked;if(!id||S.life.prototypes[id]==='restored')return null;
 return UG.relics[id].name+' / '+(!S.life.prototypes[id]?'Follow its equipment rumor.':!wardReady('workshop')?'Build the Ward Workshop; Edda can assess the recovered frame.':!S.life.components[id]?'Recover '+UG.restorations[id].component+' at '+UG.restorations[id].site+'.':'Return the frame and component to Edda’s Ward Workshop.');
}
