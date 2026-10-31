/* Alpha 9 exploration and people. Persist outcomes, never runtime motion. */
let openChatterAt=-30,openHintAt=-30;
const OPEN_ABILITIES={rook:'Keeps the crew together; always travels.',vera:'Courier: quieter movement, a route through the Quiet Archive with her ledger.',orren:'Engineer: repairs machinery and the workshop without spending salvage.',sable:'Medic: stabilizes the injured courier without consuming a medkit.',latch:'Maintenance interface: repairs machinery and reads the workshop terminal.',nim:'Scout: notices concealed seams from farther away; higher jump; +6 pistol accuracy.',brass:'Mediator: receipt-backed checkpoint stand-down; +4 handcannon damage.',ilex:'Salvager: +2 salvage per victory; frees trapped freight without parts; +3 shotgun damage.'};
function openUpgrade(d){if(!d.open)d.open={version:1,discoveries:{},choices:{},chatter:{}};return d;}
function validateOpen(d){const o=d.open,record=v=>v&&typeof v==='object'&&!Array.isArray(v);if(!o||o.version!==1||!record(o.discoveries)||!record(o.choices)||!record(o.chatter))throw Error('Invalid exploration record.');for(const [name,values] of Object.entries(o)){if(name==='version')continue;if(Object.keys(values).length>160)throw Error('Exploration record too large.');for(const [k,v] of Object.entries(values))if(k.length>80||(name==='choices'?(typeof v!=='string'||v.length>80):v!==true))throw Error('Invalid exploration outcome.');}}
function fieldCrew(id){return actors().some(a=>a.id===id&&a.hp>0);}
function openSay(id,speaker,line){if(!fieldCrew(speaker)||S.open.chatter[id]||clock-openChatterAt<16)return false;S.open.chatter[id]=true;openChatterAt=clock;log(UG.companions[speaker].name+': '+line);notify(UG.companions[speaker].name.toUpperCase()+' / “'+line+'”');return true;}
function openFooting(a,index=0){const decks=room().platforms.filter(p=>Math.abs(a.y-p.y)<9);if(!decks.length)return;const p=physicalSupport(a);if(p)return;const lead=physicalSupport(actors()[0]),deck=lead&&Math.abs(lead.y-a.y)<9?lead:decks.sort((p,q)=>Math.abs(p.x+p.w/2-a.x)-Math.abs(q.x+q.w/2-a.x))[0],sections=solidSections(deck);if(!sections.length)return;const desired=lead?actors()[0].x-index*32:a.x,section=sections.sort((p,q)=>Math.abs(p.x+p.w/2-desired)-Math.abs(q.x+q.w/2-desired))[0];a.x=clamp(desired,section.x+Math.min(12,section.w/3),section.x+section.w-Math.min(12,section.w/3));a.y=deck.y;a.vy=0;}
function openEntry(){pathMotion.clear();followWarnings.clear();openHintAt=clock;actors().forEach(openFooting);}

function openTick(){if(battle||modal||paths.size||clock-openHintAt<9)return;openHintAt=clock;
 if(S.room==='cable'){
  if(S.flags.serviceShortcut)openSay('workshop-vera','vera','Someone mapped every door here. Not one delivery time. I can fix that.');
  else if(selected().y<500)openSay('cable-nim','nim','Fresh scratches under old paint. That panel has been opened lately.');
  if(S.items.nimTrace)openSay('nim-survey','nim','Keep the names on that survey. The shortcuts belong to people, too.');
 }else if(S.room==='slag')openSay('brass-home','brass','I used to write those toll notices. Let me help take them down.');
 else if(S.room==='furnace')openSay('ilex-steam','ilex','A closed valve is cheaper than a new pair of lungs. Orren taught me that.');
 else if(S.room==='abyss')openSay('ilex-abyss','ilex','My return seal is on the old rigging rest. Nobody goes missing on paper today.');
 else if(S.room==='hearth'&&S.contracts.nimTrail?.done)openSay('nim-home','nim','Vera added delivery times to my map. It is better now.');
 else if(S.room==='hearth'&&fieldCrew('brass')&&fieldCrew('latch'))openSay('brass-latch','brass','I still read your maintenance orders, Latch. This time we both get to say no.');
 else if(S.room==='tenement'&&fieldCrew('sable'))openSay('sable-homes','sable','A clean tap does more good than a whole box of bandages.');
}
function openObject(id){return room().objects.find(o=>o.id===id||o.discovery===id||o.companion===id&&o.type==='open');}
function openReady(o,allowBattle=false){return o&&inInteractionRange(selected(),o)&&selected().hp>0&&!paths.has(selected().id)&&(!battle||allowBattle&&battle.phase==='player');}
function openChoice(id,value){S.open.choices[id]=value;close();hud();save(true);}
function openDiscover(id,method='inspect'){
 const o=openObject(id);if(!openReady(o)||o.kind!=='discovery')return false;if(S.open.discoveries[id])return false;
 if(id==='workshop'){
  if(method==='crew'&&!fieldCrew('orren')&&!fieldCrew('latch'))return false;
  if(method==='parts'){if(S.scrap<3)return false;S.scrap-=3;}else if(method!=='crew')return false;
  S.flags.serviceShortcut=true;log('A scored panel opens into the Cableworks service workshop. The ladder is now on the local survey.');
 }else if(id==='survey'){
  if(method==='crew'&&!fieldCrew('orren')&&!fieldCrew('latch'))return false;
  if(method==='parts'){if(S.scrap<3)return false;S.scrap-=3;}else if(!['crew','paper'].includes(method))return false;
  S.items.nimTrace=true;log(method==='paper'?'The faded paper survey preserves the names; the dead terminal remains as it was.':'The restored terminal prints the old shift names and service routes.');
  if(method!=='paper'){S.flags.surveyTerminal=true;if(!S.atlas.notes.cable)S.atlas.notes.cable='Restored workshop terminal; service ladder at the scored upper-deck panel.';}
 }else if(id==='seal'){S.items.ilexSeal=true;log('The return seal reads: ILEX / TWO OUT, TWO HOME. A note under it says, “Leave the kettle warm.”');}
 else if(id==='letter'){log('A kettle left warm: “No freight tonight. Sit down anyway. There is enough for whoever finds the room.”');}
 else if(id==='receipt'){S.items.tenantReceipt=true;log('An Ashline receipt: the shift toll was already paid. Brass or a trusted local crew could make the checkpoint honor it.');}
 else if(id==='freight'){close();return openResolve('lift','crew');}
 else return false;
 S.open.discoveries[id]=true;S.open.choices[id]=method;world().opened[o.id]=true;atlasObserve();close();hud();save(true);if(id==='letter')return true;notify(id==='workshop'?'SERVICE WORKSHOP OPEN / a permanent ladder and survey route':id==='survey'?'SURVEY READ / Nim’s personal work is ready at a work board':id==='receipt'?'EVIDENCE / a stamped receipt for the Ashline checkpoint':'A return seal, and a name to bring home.');return true;
}
function openResolve(id,method){
 if(['nim','brass','ilex'].includes(id)){
  const o=openObject(id);if(!openReady(o)||allCrew().some(a=>a.id===id))return false;
  if(enemies().some(e=>dist(e,o)<260)){notify('Clear the immediate work site before bringing someone out.');return false;}
  if(id==='nim'&&!S.flags.serviceShortcut)return false;
  if(id==='brass'&&S.reputation<1&&!S.world.slag.cleared){if(S.credits<30)return false;S.credits-=30;}
  if(id==='ilex'&&!S.flags.steam&&!fieldCrew('sable')){if(method==='medkit'&&S.meds){S.meds--;}else if(method==='parts'&&S.scrap>=4){S.scrap-=4;}else return false;}
  world().opened[o.id]=true;enlist(id);S.open.choices['recruit-'+id]=method;close();save(true);return true;
 }
 if(id==='checkpoint'){
  const o=openObject('toll-resolution');if(!openReady(o,true)||S.open.choices.checkpoint)return false;
  const hostiles=enemies();if(hostiles.length){if(battle&&selected().ap<2){notify('Negotiating requires 2 AP.');return false;}
   if(method==='evidence'){if(!S.items.tenantReceipt||!fieldCrew('brass')&&S.reputation<2)return false;}
   else if(method==='bond'){if(S.credits<45)return false;S.credits-=45;}else return false;
   if(battle)selected().ap-=2;for(const e of hostiles){Object.assign(world().enemies[e.id],{hp:0,spared:true,rewarded:true});}world().cleared=true;S.reputation+=method==='evidence'?2:1;
   // A stand-down pays no kill XP, bounty or victory salvage.
   battle=null;grenadeMode=false;paths.clear();pathMotion.clear();log(method==='evidence'?'The tenants’ receipt ends the double toll. The shift guards stand down.':'A 45-credit public bond pays for an open checkpoint. The guards leave the ladders.');
  }else method='cleared';
  S.items.brassWitness=true;openChoice(id,method);notify('ASHLINE OPEN / workers have returned; checkpoint record secured.');return true;
 }
 if(['courier','lift','dispute'].includes(id)){
  const e=UG.wardEvents[id];if(!e||S.room!==e.room||!openReady(e)||S.ward.events[id]||e.project&&!wardReady(e.project)||e.clear&&enemies().length)return false;
  if(method==='crew'){
   if(id==='courier'&&!fieldCrew('sable')||id==='lift'&&!fieldCrew('ilex')&&!fieldCrew('orren')||id==='dispute')return false;
   reward(e.reward);S.ward.machinery+=e.material||0;S.ward.events[id]=true;wardRumor(e.lead);gainXP(15);
  }else if(id==='dispute'&&method==='supply'){if(S.meds<2)return false;S.meds-=2;S.reputation+=2;S.ward.events[id]=true;wardRumor(e.lead);gainXP(15);}
  else if(method==='standard'){if(!wardEvent(id))return false;}else return false;
  log(e.name+' / '+(method==='crew'?'the crew’s field skills saved the supplies.':method==='supply'?'the shelter receives medicine; the scavengers keep their salvage.':'settled using shared supplies.'));openChoice(id,method);notify('LOCAL WORK RESOLVED / '+(method==='supply'?'medicine delivered · +2 standing':'workers can return safely'));return true;
 }return false;
}
function openButton(id,method,label,disabled=false){return `<button data-open-id="${id}" data-open-method="${method}" ${disabled?'disabled':''}>${label}</button>`;}
function openInteract(o){
 if(o.type==='ward'&&o.kind==='event'&&['courier','lift','dispute'].includes(o.event)){
  const id=o.event,e=UG.wardEvents[id],done=S.ward.events[id],crew=id==='courier'?fieldCrew('sable'):id==='lift'?fieldCrew('ilex')||fieldCrew('orren'):false;
  panel(e.name,`<p>${e.text}</p><p>${done?'Resolved / '+(S.open.choices[id]||'shared supplies'):id==='courier'?'Sable can stabilize the courier with her field rig, conserving a medkit.':id==='lift'?'Ilex or Orren can release the brake without sacrificing parts.':'Divide the salvage, or donate medicine and let the scavengers keep their stock.'}</p><div class="row">${openButton(id,'standard',id==='dispute'?'DIVIDE THE SALVAGE':id==='courier'?'USE 1 MEDKIT':'REPAIR / 3 SALVAGE',!!done||!!battle)}${id==='dispute'?openButton(id,'supply','DONATE 2 MEDKITS / +2 STANDING',!!done||!!battle):openButton(id,'crew','USE CREW FIELD SKILL',!!done||!crew||!!battle)}</div>`);return true;
 }
 if(o.type!=='open')return false;
 if(o.kind==='recruit'){
  const id=o.companion,c=UG.companions[id];if(allCrew().some(a=>a.id===id)){notify(c.name+' is already in the crew. Swap companions at a shelter.');return true;}
  panel(c.name.toUpperCase()+' / '+c.role.toUpperCase(),`<h1>${id==='nim'?'There are people between the lines.':id==='brass'?'A promise has to cost something.':'Every name comes home.'}</h1><p>${c.desc}</p><p>${OPEN_ABILITIES[id]}</p><p>${id==='nim'?'“You opened that panel. Help me keep these routes public, and I’ll walk with you.”':id==='brass'?'“I need a crew the wards can trust. One point of local standing, a cleared Ashline, or ¢30 for the tenants I still owe.”':'A bruised worker sits beside a damaged harness. Close the steam valve, bring Sable, spend one medkit, or fit four salvage to the harness.'}</p>${openButton(id,id==='ilex'?'medkit':'join',id==='ilex'?'HELP / MEDIC, CLOSED VALVE OR 1 MEDKIT':'INVITE TO THE CREW',!!battle)}${id==='ilex'?openButton(id,'parts','FIT HARNESS / 4 SALVAGE',!!battle):''}<p>Four travel together; additional recruits wait at the shelter with their equipment.</p>`);return true;
 }
 if(o.kind==='checkpoint'){
  panel('ASHLINE / WHO PAID TWICE?',`<p>${S.open.choices.checkpoint?'The shift record is signed. Workers move freely now.':'The tenants say these ladders were already paid for. Fight through as before, present a stamped receipt with Brass or +2 standing, or post a public bond.'}</p><p>Negotiating during combat takes 2 AP. A stand-down grants no kill rewards. Either resolution completes the existing “No more tolls” clearance.</p>${openButton('checkpoint','evidence','PRESENT RECEIPT / BRASS OR +2 STANDING',!!S.open.choices.checkpoint)}${openButton('checkpoint','bond',enemies().length?'POST ¢45 BOND':'RECORD CLEARED PASSAGE',!!S.open.choices.checkpoint)}`);return true;
 }
 if(o.kind==='discovery'){
  const id=o.discovery;if(id==='freight'){const e=UG.wardEvents.lift;return openInteract({...o,type:'ward',kind:'event',event:'lift'});}
  const done=S.open.discoveries[id];let body='';
  if(id==='workshop')body=`<p>Scoring under the paint, a narrow gap, and a ladder folded behind the panel. The latch needs a repair, not a key.</p>${openButton(id,'crew','ORREN / LATCH: REPAIR LATCH',done||!fieldCrew('orren')&&!fieldCrew('latch')||!!battle)}${openButton(id,'parts','FIT LATCH / 3 SALVAGE',done||!!battle)}`;
  if(id==='survey')body=`<p>Names have been pencilled on the paper copy. The terminal contains the same survey and can annotate the map if restored. Nim wants these people remembered.</p>${openButton(id,'paper','READ THE PAPER SURVEY',done||!!battle)}${openButton(id,'crew','ORREN / LATCH: RESTORE TERMINAL',done||!fieldCrew('orren')&&!fieldCrew('latch')||!!battle)}${openButton(id,'parts','RESTORE TERMINAL / 3 SALVAGE',done||!!battle)}`;
  if(id==='letter')body=`<p>“No freight tonight. Sit down anyway. There is enough for whoever finds the room.” A cup has left a clean circle in the dust.</p>${openButton(id,'inspect','REMEMBER THE NOTE',done||!!battle)}`;
  if(id==='receipt')body=`<p>PAID IN FULL / ASHLINE SHIFT LADDERS. The tenants kept a stamped duplicate under the kettle.</p>${openButton(id,'inspect','KEEP THE EVIDENCE',done||!!battle)}`;
  if(id==='seal')body=`<p>A note under the seal: “Two out, two home. Leave the kettle warm.” No weapon locker; just a name to bring back.</p>${openButton(id,'inspect','TAKE THE RETURN SEAL',done||!!battle)}`;
  panel(o.name.toUpperCase(),`${done?'<p>This place is recorded in the crew’s journal.</p>':''}${body}`);return true;
 }return true;
}
function openAction(id){if(id==='drop'){controlledDrop();return true;}if(id==='jump'){freeJump();return true;}return false;}
function openDraw(){
 for(const o of room().objects.filter(o=>o.type==='open')){
  if(o.kind==='recruit'){if(allCrew().some(a=>a.id===o.companion))continue;figure({id:o.companion,x:o.x,y:o.y,weapon:null,armorKey:'leathers',dir:-1},UG.companions[o.companion].color);if(inInteractionRange(selected(),o))text(UG.companions[o.companion].name.toUpperCase(),o.x,o.y-75,'#a3b38e',10,'center');}
  else if(o.discovery==='workshop'){line(o.x-15,o.y-48,o.x+14,o.y-48,'#66705a');line(o.x+14,o.y-48,o.x+14,o.y-9,'#66705a');for(let i=0;i<3;i++)line(o.x-10+i*5,o.y-22,o.x-5+i*5,o.y-28,'#8d987b');}
  else if(o.discovery==='survey'){outline(o.x-18,o.y-34,36,24,S.flags.surveyTerminal?'#91b788':'#586b57');line(o.x-13,o.y-22,o.x+7,o.y-22,'#aab397');}
  else if(['seal','receipt','letter'].includes(o.discovery)){if(!S.open.discoveries[o.discovery]){rect(o.x-6,o.y-10,12,7,'#92947d');line(o.x-3,o.y-8,o.x+3,o.y-8,'#394731');}}
 }
 if(S.room==='cable'&&!S.flags.serviceShortcut&&fieldCrew('nim')&&Math.abs(selected().y-440)<100&&Math.abs(selected().x-760)<240)text('NIM / scratch marks under that panel',760,377,'#98ad85',10,'center');
 if(S.room==='slag'&&(S.world.slag.cleared||!enemies().length)){for(let i=0;i<2;i++)figure({id:'ashline-worker-'+i,x:660+i*95,y:880,weapon:null,armorKey:'leathers'},'#80947a');text('SHIFT LADDERS / OPEN',700,792,'#8eac7c',10,'center');}
 if(S.room==='sump'&&S.ward.events.lift){outline(500,846,35,30,'#91b788');figure({id:'hoist-worker',x:560,y:880,weapon:null,armorKey:'leathers'},'#91b788');}
 if(S.room==='cable'&&S.ward.events.courier)text('COURIER RETURN / SAFE',420,813,'#8eac7c',9,'center');
}
document.addEventListener('click',e=>{const el=e.target.closest('[data-open-id]');if(!el||!S)return;const id=el.dataset.openId,method=el.dataset.openMethod;if(['workshop','survey','seal','receipt','letter'].includes(id))openDiscover(id,method);else openResolve(id,method);});
