/* Living Undergrid: persistent machinery, traversal, roster, boss and audio. */
let toolMode=false,bossWarning=null;
const liftMotion=new Map(),transitActors=new Set();
// Additive migration and saved machinery state.
function livingUpgrade(d){if(!d||!d.world||!Array.isArray(d.party))return d;
 const old=!d.living;
 if(old){d.living={version:1,markers:{},reactions:{}};d.reserve=[];for(const id of ['tenement','vents','pressure','excavator','quiet'])if(!d.world[id]){const r=UG.rooms[id];d.world[id]={enemies:Object.fromEntries(r.enemies.map(e=>[e.id,{hp:UG.enemyTypes[e.type].hp,x:e.x,y:e.y}])),opened:{},covers:{}};}}
 for(const w of Object.values(d.world))if(old&&!w.machines)w.machines={};
 return d;
}
function machineState(id){return world().machines[id]||{};}
function changedMachine(id,data){world().machines[id]={...machineState(id),...data};}
function segmentBlocked(a,b){for(const [id,m] of Object.entries(UG.machines)){if(m.room!==S.room||m.kind!=='barrier'||S.flags[m.flag])continue;if((a.y<m.y-100||a.y>m.y+5)&&(b.y<m.y-100||b.y>m.y+5))continue;if(Math.min(a.x,b.x)<m.x+12&&Math.max(a.x,b.x)>m.x-12&&a.x!==b.x&&Math.abs(a.y-b.y)<80){if(Math.abs(a.x-m.x)<12&&Math.abs(b.x-m.x)>Math.abs(a.x-m.x))continue;return true;}}return false;}
// Shared exploration / tactical operation transactions.
function machineMenu(id){const m=UG.machines[id];if(!m)return;panel('MACHINE / '+id.toUpperCase(),`<h1>${m.kind==='lift'?'Mind the gap.':'Steel remembers.'}</h1><p>${m.text}</p><p class="amber">${S.flags[m.flag]?'STATE: ACTIVE / OPEN':'STATE: INACTIVE / SEALED'}${m.hp?' · '+(machineState(id).hp??m.hp)+' INTEGRITY':''}</p><div class="row">${m.methods.map(method=>`<button data-machine="${id}:${method}">${{engineer:'CREW REPAIR / ORREN OR LATCH',arc:'ARC CHARGE / 1 ROUND',scrap:'FIT PARTS / '+(m.cost||4)+' SALVAGE',ride:'RIDE LIFT / 2 AP IN COMBAT',toggle:'OPERATE / 1 AP IN COMBAT',cut:'CUTTER OR CHAINBLADE',shoot:'FIRE HEAVY WEAPON',frag:'FRAG / 2 AP / BLAST HURTS CREW'}[method]}</button>`).join('')}${id==='tenement-lights'?'<button data-machine="tenement-lights:pay">SETTLE ARREARS / ¢30</button>':''}</div><p>All crew share traversal tools. Combat operations consume AP; exploration uses the same persistent machinery state.</p>`);}
function operateMachine(id,method){const m=UG.machines[id],a=selected();if(!m||m.room!==S.room||!room().objects.some(o=>o.machine===id&&dist(a,o)<100))return false;
 if(!m.methods.includes(method)&&!(id==='tenement-lights'&&method==='pay'))return false;
 if(S.flags[m.flag]&&!['steam','coolant','lift'].includes(m.kind)){notify('Already restored / opened.');return false;}
 if(m.kind==='lift'&&!S.flags.ventPower){notify('The cathedral generator must be restored first.');return false;}let cost=m.kind==='lift'||method==='frag'?2:method==='shoot'?weapon(a).ap:1;if(battle&&(battle.phase!=='player'||a.hp<=0||a.ap<cost||paths.size)){notify('Not enough AP, or crew are still moving.');return false;}
 const w=weapon(a),engineer=actors().some(c=>c.hp>0&&['orren','latch'].includes(c.id))||(id==='vault-pump'&&S.flags.pumpGuide);
 if(method==='engineer'&&!engineer){notify('Orren or Latch can do this. Other repair methods work solo.');return false;}
 if(method==='arc'&&(a.weapon!=='arc'||a.mag<1)){notify('Select a fighter carrying a loaded arc gun.');return false;}
 if(method==='scrap'&&S.scrap<(m.cost||4)){notify('Not enough salvage parts.');return false;}
 if(method==='pay'&&S.credits<30){notify('You need 30 credits to cover their unpaid shift.');return false;}
 if(method==='cut'&&!S.items.cutter&&a.weapon!=='chainblade'){notify('Use a powered cutter or equip a chainblade.');return false;}
 if(method==='shoot'&&(!['heavy','plasma','launcher','handcannon'].includes(a.weapon)||a.mag<1)){notify('Heavy fire requires a loaded HMG, plasma gun, launcher or hand cannon.');return false;}
 if(method==='frag'&&!S.grenades){notify('No frag grenades.');return false;}
 close();if(battle)a.ap-=cost;if(method==='scrap')S.scrap-=m.cost||4;if(method==='arc'||method==='shoot'){a.mag--;animate(a,'fire',.4);tracer(a,m,a.color);audioCue('fire',a.weapon);}if(method==='frag'){S.grenades--;audioCue('blast');}
 if(method==='pay')S.credits-=30;
 if(m.kind==='lift'){const to=a.y>m.top+100?m.top:m.y;const riders=alive().filter(p=>Math.abs(p.x-m.x)<90&&Math.abs(p.y-a.y)<30);for(const p of riders){p.x=m.x+(actors().indexOf(p)-1)*18;transitActors.add(p.id);paths.set(p.id,[{x:p.x,y:to}]);}liftMotion.set(id,{rider:a.id,to});changedMachine(id,{position:to});S.flags[m.flag]=true;}
 else if(['barrier','cache'].includes(m.kind)){
 let hp=machineState(id).hp??m.hp;hp-=method==='cut'?hp:method==='frag'?60:weapon(a).damage;changedMachine(id,{hp:Math.max(0,hp)});if(hp<=0){S.flags[m.flag]=true;reward(m.reward);notify('STEEL OPENED // A new way through.');}else notify('STRUCTURE HIT // '+hp+' integrity remains.');
 }else if(m.kind==='component'){world().enemies[m.target].hp=0;S.flags[m.flag]=true;notify('STABILIZER DISABLED // Excavator phase changed.');checkBattle();}
 else{S.flags[m.flag]=['steam','coolant'].includes(m.kind)?!S.flags[m.flag]:true;
 if(id==='tenement-lights'){for(const e of Object.values(world().enemies)){e.hp=0;e.spared=true;}if(battle)checkBattle();log('Tenement Nine has power. Its unpaid guards stand down.');}
 if(id==='vent-generator'){S.items.ventRecord=true;log('The fans restart. A maintenance unit answers the old call sign.');}
 notify(m.kind==='steam'?(S.flags[m.flag]?'STEAM BYPASS OPEN / hazardous deck':'STEAM BYPASS CLOSED'):'MACHINE RESTORED // '+m.text.split('.')[0]);}
 if(method==='frag'){explode(m.x,m.y,140,38);if(S.room!==m.room)return true;}audioCue('machine');hud();save(true);return true;
}
// Authored traversal: a physical carrier path, with safe save deferral.
function grapple(o){const a=selected();if(!S.items.grapple){notify('Help Tenement Nine to earn a magnetic grapple.');return false;}if(!o||o.type!=='anchor'||dist(a,o)>650){notify('Grapple anchors must be within 650 units.');return false;}if(battle&&!canAct(a,2))return false;if(battle)a.ap-=2;
 for(const p of alive()){transitActors.add(p.id);paths.set(p.id,[{x:o.x+actors().indexOf(p)*22,y:o.y}]);animate(p,'grapple',1.6);}fx.push({type:'shot',x:a.x,y:a.y-30,tx:o.x,ty:o.y-25,color:'#8ed5cd',life:1.5,max:1.5,style:'grapple'});S.living.reactions[S.room+':grapple']=true;toolMode=false;notify('GRAPPLE // Crew winch engaged.');hud();return true;}
function toolsPanel(){panel('FIELD TOOLS',`<p>Grapple anchors glow cyan. Press T, then tap/click an anchor to winch the active crew across gaps. Range 650; 2 AP in combat. Diving gear opens submerged routes. The cutter opens welded barriers from their control panel.</p><div class="grid"><article class="card"><h3>Magnetic grapple / ${S.items.grapple?'READY':'LOCKED'}</h3><p>Help Tenement Nine’s residents. Reusable at the Cableworks roof, Tenement roof and Vent Cathedral fan housing.</p><button data-action="grapplemode" ${S.items.grapple?'':'disabled'}>AIM GRAPPLE →</button></article><article class="card"><h3>Diving apparatus / ${S.items.diving?'READY':'LOCKED'}</h3><p>Restore the Tenement clinic after opening the clean-water sluice. Unlocks routes from the Sump and Cinder Docks.</p></article><article class="card"><h3>Powered cutter / ${S.items.cutter?'READY':'LOCKED'}</h3><p>Restart the cathedral and settle its work order. Cuts barriers in the Pressure Vault and Foundry; opens apartment shortcuts.</p></article></div>`);}
function livingReward(id){if(id==='homes'){S.items.grapple=true;log('The tenants give the crew a magnetic grappling winch.');}if(id==='clinic'){S.items.diving=true;log('The clinic lends the crew a diving apparatus.');}if(id==='lung'){S.items.cutter=true;log('Vent workers sign out a powered cutter.');}audioCue('quest');}
// Companion roster and persistent field utility.
function allCrew(){return [...actors(),...S.reserve];}
function enlist(id){if(allCrew().some(a=>a.id===id)){notify('Already in your crew. Use the roster at a shelter.');return;}const c=UG.companions[id],a={id,name:c.name,role:c.role,x:selected().x+25,y:selected().y,hp:c.hp+10*(S.level-1),maxhp:c.hp+10*(S.level-1),weapon:c.weapon,mag:UG.weapons[c.weapon].mag,armor:c.armor,color:c.color,dir:1,vy:0};unlock('weapon',c.weapon);if(id==='sable')unlock('gear','medrig');(actors().length<3?actors():S.reserve).push(a);upgrade(S);livingUpgrade(S);if(S.reserve.includes(a)){a.x=0;a.y=0;}if(id==='sable'){a.gear='medrig';a.dye='rose';}if(id==='latch')a.dye='violet';a.color=UG.dyes[a.dye];log(c.name+' joined the crew.');notify(c.name.toUpperCase()+' recruited / '+(S.reserve.includes(a)?'waiting at the shelter.':'active crew.'));save(true);hud();}
function roster(){panel('SHELTER / CREW ROSTER',`<h1>Room for your people.</h1><p>Three fighters travel at once. Rook stays with the active crew. Swap companions at a safe bunk; benched members keep all equipment, bonds and talents.</p><h2>Travelling</h2><div class="row">${actors().map(a=>`<button data-bench="${a.id}" ${a.id==='rook'||battle||!room().objects.some(o=>o.type==='rest')?'disabled':''}>${escape(a.callsign||a.name)} / BENCH</button>`).join('')}</div><h2>At the shelter</h2><div class="grid">${S.reserve.map(a=>`<article class="card"><h3>${escape(a.callsign||a.name)} / ${a.role}</h3><p>${UG.companions[a.id].desc}</p><button data-enlist="${a.id}" ${battle||actors().length>=3||!room().objects.some(o=>o.type==='rest')?'disabled':''}>JOIN ACTIVE CREW</button></article>`).join('')||'<p>No reserve crew yet.</p>'}</div>`);}
function companionGate(o){return o.gate==='cutter'&&o.to==='quiet'&&!!S.contracts.ledger?.done&&actors().some(a=>a.id==='vera'&&a.hp>0);}
function livingInteract(o){
 if(o.type==='patient'){if(world().opened[o.id]){notify('The attendant is stable. You have the pump procedure.');return true;}const medic=actors().some(a=>a.id==='sable'&&a.hp>0);if(!medic&&!S.meds){notify('A medkit or Sable can stabilize the attendant.');return true;}if(!medic)S.meds--;world().opened[o.id]=true;S.flags.pumpGuide=true;gainXP(20);log('The flood attendant teaches the crew a pump bypass. No engineer required at the vault.');panel('THE ATTENDANT / ONE MORE SHIFT',`<p>${medic?'Sable kneels beside the worker. “Breathe first. Talk later.”':'You bind the worker’s wound with a field dressing.'}</p><p>They give you a maintenance sequence. The vault pump’s CREW REPAIR control now works even when travelling solo.</p>`);save(true);return true;}
 if(o.type==='valve'){if(battle&&!canAct(selected(),1))return true;if(battle)selected().ap--;S.flags.steam=true;notify('STEAM VENT CLOSED // Lower route safe.');audioCue('machine');hud();save(true);return true;}
 if(o.type==='machine'){machineMenu(o.machine);return true;}
 if(o.type==='anchor'){grapple(o);return true;}
 if(o.type==='clinic'){panel('SABLE / THERE ARE STILL PEOPLE HERE',`<p>“Treat the wound. Ask about the bullet later.” A courier is bleeding beside the pump. Clean water and a stable patient would let Sable leave the clinic for a while.</p><div class="row"><button data-living="stabilize">STABILIZE COURIER / MEDKIT OR CREW MEDIC</button><button data-living="recruit-sable" ${S.flags.clinicReady?'':'disabled'}>ASK SABLE TO JOIN</button></div>`);return true;}
 if(o.type==='automaton'){panel('LATCH / MAINTENANCE NEVER ENDS',`<p>“SHIFT EXTENDED. AGAIN.” The unit taps its timecard against the dead reader.</p><button data-living="recruit-latch" ${S.flags.lungReady?'':'disabled'}>OFFER A DIFFERENT SHIFT</button>`);return true;}
 if(o.type==='investigate'){
 const field={evidence:'meterReadings',radio:'radioMessage','excavation-log':'foremanLog'}[o.id];
 if(o.id==='excavation-log'&&!S.flags.excavated){notify('The excavation machine still owns this shift.');return true;}
 if(!S.items[field]){S.items[field]=true;gainXP(20);log('Investigated: '+o.name);audioCue('discover');}
 const text=o.id==='evidence'?'The tenants paid. Their wages never reached the guards. You can settle the arrears at the power breaker, or repair the circuit and put the dispute out of business.':o.id==='radio'?'“If you are still on shift, leave the kettle where it is.” The voice gives no name. Vera turns the volume down, very carefully.':'The machine has been digging the same delivery channel for years. The last work order is stamped TOMORROW. You pocket the foreman’s log and leave the rest alone.';
 panel(o.name.toUpperCase(),`<p>${text}</p>`);save(true);return true;
 }
 return false;
}
function livingAction(id){if(id==='tools'){toolsPanel();return true;}if(id==='grapplemode'){close();toolMode=true;notify('GRAPPLE // Click a cyan anchor, up to 650 units away.');return true;}if(id==='roster'){roster();return true;}if(id==='audio'){audioPanel();return true;}return false;}
function livingEntry(){bossWarning=null;toolMode=false;liftMotion.clear();const lines={vera:{deadrail:'Vera: “That door used to be a courier drop. Nobody sealed it from our side.”',tenement:'Vera: “The roofline is safer than the rent collectors.”'},orren:{vents:'Orren: “Hear that bearing? We can fix that before it takes the wall with it.”',pressure:'Orren: “Pressure doors hold back more than water. Check the gauge.”'},sable:{tenement:'Sable: “Half this block owes me a bandage. The other half owes me two.”'},latch:{excavator:'Latch: “UNFINISHED SHIFT DETECTED. REQUESTING PERMISSION TO CLOCK OUT.”'}};
 for(const a of actors()){const text=lines[a.id]?.[S.room],key=a.id+':'+S.room;if(text&&!S.living.reactions[key]){S.living.reactions[key]=true;log(text);notify(text);break;}}
}
// Mechanical encounter phases and telegraphed attacks.
function bossPhase(){if(S.room!=='excavator')return 0;const w=world().enemies;return 3-['port','starboard'].filter(id=>w[id].hp>0).length;}
function livingEnemy(e){if(e.type==='excavator'){const phase=bossPhase();return {...e,weapon:phase===1?'heavy':phase===2?'arc':'plasma',armor:phase===1?9:phase===2?5:2};}return e;}
function bossStep(e){if(e.type!=='excavator')return false;const phase=bossPhase();if(bossWarning!==null&&!S.flags.bossCoolant){for(const a of alive())if(Math.abs(a.y-bossWarning)<40&&a.gear!=='shockground'&&a.id!=='latch')hurt(a,16,e);audioCue('blast');checkBattle();if(!battle)return true;}
 bossWarning=phase>1?selected().y:null;if(bossWarning!==null)notify('EXCAVATOR SURGE // Floor '+Math.round(bossWarning)+' flashes next hostile activation. Change floors, ground your gear, or open coolant.');return false;
}
function shielded(t){return t.type==='excavator'&&bossPhase()===1;}
function hazardTick(a){if(S.room==='furnace'&&!S.flags.steam&&dist(a,{x:820,y:880})<80)hurt(a,8);for(const [id,m] of Object.entries(UG.machines)){if(m.room!==S.room||m.kind!=='steam'||!S.flags[m.flag])continue;if(dist(a,m)<125){hurt(a,10);a.suppressed=true;}}}
function livingTick(dt){for(const [id,m] of Object.entries(UG.machines)){if(m.room===S.room&&m.kind==='steam'&&S.flags[m.flag]&&!battle&&dist(selected(),m)<100)selected().hp=Math.max(1,selected().hp-dt*8);}
 const box=$('#bossReadout');if(box){box.hidden=S.room!=='excavator'||!enemies().some(e=>e.id==='core');if(!box.hidden)box.textContent=`EXCAVATOR ZERO / ${world().enemies.core.hp} HP / PHASE ${bossPhase()} / ${shielded({type:'excavator'})?'SHIELDED: DISABLE A STABILIZER':'CORE EXPOSED'}${bossWarning!==null?' / SURGE ON FLOOR '+Math.round(bossWarning):''}`;}
}
// Restrained scene motion and visible consequences.
function livingDraw(){
 for(const [id,m] of Object.entries(UG.machines)){if(m.room!==S.room)continue;const on=!!S.flags[m.flag],col=on?'#8ed5cd':'#e7af73';
 if(m.kind==='barrier'&&!on){rect(m.x-12,m.y-100,24,100,'#39432c');outline(m.x-12,m.y-100,24,100,col);for(let y=m.y-90;y<m.y;y+=18)line(m.x-12,y,m.x+12,y+15,col);}
 if(m.kind==='lift'){const rider=actors().find(a=>a.id===liftMotion.get(id)?.rider),moving=rider&&paths.has(rider.id),y=moving?rider.y:(machineState(id).position??m.y);line(m.x-35,m.top-60,m.x-35,m.y,'#7e936a');line(m.x+35,m.top-60,m.x+35,m.y,'#7e936a');rect(m.x-40,y,80,8,'#72945e');outline(m.x-40,y-65,80,65,'#8ed5cd');}
 if(m.kind==='steam'&&on){for(let k=0;k<8;k++){ctx.globalAlpha=.22;rect(m.x-40+Math.sin(clock+k)*12,m.y-30-(clock*80+k*15)%95,70,18,'#d0dfc5');}ctx.globalAlpha=1;}
 }
 for(const o of room().objects.filter(o=>o.type==='anchor')){ctx.strokeStyle='#8ed5cd';ctx.beginPath();ctx.arc(o.x,o.y-35,12,0,Math.PI*2);ctx.stroke();line(o.x-18,o.y-35,o.x+18,o.y-35,'#8ed5cd',2);text('T / GRAPPLE',o.x,o.y-62,'#8ed5cd',9,'center');}
 if(room().theme==='vent'){for(const [x,y] of [[350,1050],[1150,750],[450,450]]){ctx.save();ctx.translate(x,y);ctx.strokeStyle='#425b40';ctx.beginPath();ctx.arc(0,0,95,0,Math.PI*2);ctx.stroke();ctx.rotate(clock*(S.flags.ventPower?.8:.08));for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);ctx.strokeRect(10,-20,70,40);}ctx.restore();}}
 if(S.room==='pressure'){const level=S.flags.pumps?1300:1150;rect(0,level,room().w,room().h-level,'#17434b66');line(0,level,room().w,level,'#73aab6');}
 if(S.room==='excavator'){ctx.save();ctx.translate(1550,1130);const p=bossPhase();outline(-110,-130,220,150,'#a1885c');for(let i=0;i<6;i++){const angle=clock*(S.flags.excavated?0:1)+i*Math.PI/3;line(0,0,Math.cos(angle)*100,Math.sin(angle)*100,'#a1885c',4);}if(p===1){ctx.strokeStyle='#8ed5cd';ctx.beginPath();ctx.arc(0,20,145,0,Math.PI*2);ctx.stroke();}ctx.restore();if(bossWarning!==null&&!S.flags.bossCoolant){for(let x=0;x<room().w;x+=90)rect(x,bossWarning-4,40,4,Math.sin(clock*8)>0?'#eea17b':'#795033');}}
 if(S.flags.residentsPower&&S.room==='tenement'){for(const e of room().enemies)figure({x:e.x,y:e.y,id:'resident-'+e.id,weapon:null,armorKey:'leathers',dir:1},'#8ed5cd');}
 if(S.flags.residentsPower&&['tenement','hearth'].includes(S.room)){for(let x=200;x<room().w;x+=240){rect(x,750,14,24,'#b1ce7d');rect(x+40,750,14,24,'#b1ce7d');}}
 if(S.flags.clinicReady&&S.room==='tenement'){text('CLINIC OPEN / CLEAN WATER',1170,600,'#8ed5cd',12,'center');}
 if(S.contracts.apprentice?.choice==='crew'&&S.room==='market'){figure({id:'nix',x:760,y:660,weapon:null,armorKey:'mesh',gear:'climbrig',dir:1},'#8ed5cd');text('NIX / PATTERNS -20%',760,590,'#8ed5cd',10,'center');}
 if(S.room==='quiet'){rect(420,800,180,10,'#45573b');outline(470,765,45,30,'#aec389');line(480,765,500,735,'#aec389');}
}
// Optional gesture-gated, locally synthesized audio.
let audioContext=null,audioPrefs={enabled:false,volume:.25},ambient=null;
try{const v=JSON.parse(localStorage.getItem(KEY+'.audio'));if(v&&typeof v.enabled==='boolean'&&Number.isFinite(v.volume))audioPrefs={enabled:v.enabled,volume:clamp(v.volume,0,1)};}catch{}
function ensureAudio(){try{if(!audioContext)audioContext=new (window.AudioContext||window.webkitAudioContext)();if(audioContext.state==='suspended')audioContext.resume();return audioContext;}catch{return null;}}
function livingAudio(kind,id){if(!audioPrefs.enabled||audioPrefs.volume===0)return;const c=ensureAudio();if(!c)return;const master=c.createGain();master.gain.value=audioPrefs.volume*.13;master.connect(c.destination);const now=c.currentTime,o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(master);const frequencies={pistol:150,rifle:105,shotgun:65,sniper:85,smg:190,handcannon:55,needle:760,laser:1200,arc:350,flame:75,launcher:45,plasma:240,heavy:50,chainblade:95,railgun:600};o.type=kind==='fire'&&['laser','needle','plasma'].includes(id)?'sine':kind==='fire'?'sawtooth':'triangle';const freq=kind==='fire'?frequencies[id]||140:kind==='reload'?320:kind==='blast'?45:kind==='quest'?640:kind==='discover'?820:180;o.frequency.setValueAtTime(freq,now);o.frequency.exponentialRampToValueAtTime(Math.max(20,freq*.3),now+.18);g.gain.setValueAtTime(.8,now);g.gain.exponentialRampToValueAtTime(.001,now+.24);o.start(now);o.stop(now+.25);
 if(kind==='fire'&&['shotgun','heavy','flame','launcher'].includes(id)||kind==='blast'){const buffer=c.createBuffer(1,c.sampleRate*.2,c.sampleRate),samples=buffer.getChannelData(0);for(let i=0;i<samples.length;i++)samples[i]=(Math.random()*2-1)*(1-i/samples.length);const noise=c.createBufferSource();noise.buffer=buffer;noise.connect(master);noise.start();}o.onended=()=>master.disconnect();}
function audioPanel(){panel('AUDIO / LOCAL SYNTHESIS',`<p>Optional synthesized weapons, machines, discoveries and low mechanical ambience. No audio files or network services. Sound starts only after your gesture.</p><button data-audio="toggle">${audioPrefs.enabled?'MUTE SOUND':'ENABLE SOUND'}</button><label>MASTER VOLUME <input data-volume type="range" min="0" max="100" value="${Math.round(audioPrefs.volume*100)}"></label><p>All objectives, warnings and feedback also appear visually.</p>`);}
function updateAmbience(){if(ambient){ambient.gain.gain.value=audioPrefs.enabled?audioPrefs.volume*.007:0;return;}if(!audioPrefs.enabled)return;const c=ensureAudio();if(!c)return;const o=c.createOscillator(),gain=c.createGain();o.type='sine';o.frequency.value=47;gain.gain.value=audioPrefs.volume*.007;o.connect(gain);gain.connect(c.destination);o.start();ambient={osc:o,gain};}
document.addEventListener('pointerdown',()=>{if(audioPrefs.enabled)updateAmbience();},{passive:true});
document.addEventListener('input',e=>{if(!e.target.matches('[data-volume]'))return;audioPrefs.volume=clamp(+e.target.value/100,0,1);try{localStorage.setItem(KEY+'.audio',JSON.stringify(audioPrefs));}catch{}updateAmbience();});
document.addEventListener('click',e=>{const el=e.target.closest('[data-machine],[data-living],[data-bench],[data-enlist],[data-audio],[data-marker]');if(!el||!S)return;
 if(el.dataset.machine){const [id,method]=el.dataset.machine.split(':');operateMachine(id,method);}
 if(el.dataset.living){const id=el.dataset.living;if(id==='stabilize'){if(S.items.courierStable){notify('The courier is stable.');return;}if(!actors().some(a=>a.id==='sable')&&!S.meds){notify('A medkit or a crew medic is needed.');return;}if(!actors().some(a=>a.id==='sable'))S.meds--;S.items.courierStable=true;notify('COURIER STABILIZED // Settle the clinic work order once the water is clean.');save(true);}if(id==='recruit-sable'&&S.flags.clinicReady)enlist('sable');if(id==='recruit-latch'&&S.flags.lungReady)enlist('latch');}
 const safe=!battle&&room().objects.some(o=>o.type==='rest');if(el.dataset.bench&&safe&&el.dataset.bench!=='rook'){const i=actors().findIndex(a=>a.id===el.dataset.bench);if(i>0){let benched=actors().splice(i,1)[0];benched.x=0;benched.y=0;S.reserve.push(benched);active=0;paths.clear();roster();hud();save(true);}}
 if(el.dataset.enlist&&safe&&actors().length<3){const i=S.reserve.findIndex(a=>a.id===el.dataset.enlist);if(i>=0){let a=S.reserve.splice(i,1)[0];a.x=clamp(selected().x+30,18,room().w-18);a.y=selected().y;a.vy=0;actors().push(a);roster();hud();save(true);}}
 if(el.dataset.audio){audioPrefs.enabled=!audioPrefs.enabled;try{localStorage.setItem(KEY+'.audio',JSON.stringify(audioPrefs));}catch{}updateAmbience();livingAudio('machine');audioPanel();}
 if(el.dataset.marker){S.living.markers[S.room]=!S.living.markers[S.room];save(true);map();}
});
// Reject malformed imported machine/roster data before replacing S.
function validateLiving(d){if(!d.living||d.living.version!==1||!d.living.markers||!d.living.reactions||!Array.isArray(d.reserve)||d.reserve.length>4)throw Error('Invalid living world.');for(const [id,w] of Object.entries(d.world)){if(!w.machines||typeof w.machines!=='object')throw Error('Invalid machinery state.');for(const [key,m] of Object.entries(w.machines)){if(!UG.machines[key]||UG.machines[key].room!==id||!m||m.hp!==undefined&&(!Number.isFinite(m.hp)||m.hp<0||m.hp>1000)||m.position!==undefined&&(!Number.isFinite(m.position)||m.position<0||m.position>UG.rooms[id].h))throw Error('Invalid mechanism.');}}for(const id of Object.keys(d.living.markers))if(!Object.hasOwn(UG.rooms,id))throw Error('Invalid map marker.');}

function routeHazardPenalty(a,b){for(const m of Object.values(UG.machines))if(m.room===S.room&&m.kind==='steam'&&S.flags[m.flag]&&Math.abs(a.y-m.y)<40&&Math.abs(b.y-m.y)<40&&Math.min(a.x,b.x)<m.x+110&&Math.max(a.x,b.x)>m.x-110)return 900;return 0;}

function drawMachineControl(o){const m=UG.machines[o.machine],on=!!S.flags[m.flag],c=on?'#8ed5cd':'#e7af73',x=o.x,y=o.y;
 if(['steam','coolant'].includes(m.kind)){line(x,y,x,y-32,c,3);ctx.strokeStyle=c;ctx.beginPath();ctx.arc(x,y-43,14,0,Math.PI*2);ctx.stroke();line(x-14,y-43,x+14,y-43,c,2);line(x,y-57,x,y-29,c,2);}
 else {rect(x-16,y-52,32,52,'#17261a');outline(x-16,y-52,32,52,c);rect(x-10,y-43,20,12,c);line(x-9,y-18,x+8,y-24,c,2);if(m.kind==='lift'){text('↑↓',x,y-69,c,14,'center');}}
 text(m.kind.toUpperCase(),x,y-80,c,9,'center');
}
