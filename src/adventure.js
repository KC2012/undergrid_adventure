/* Alpha 4: comfortable input, contextual actions and a rewarding adventure loop. */
let interactionFocus=null,loadoutTab='weapons',dashMode=false,viewOffset={x:0,y:0};
const motionMemory=new Map();
function adventureUpgrade(d){if(!d||!d.world||!Array.isArray(d.party))return d;
 if(!d.adventure){if(!d.world.trial)d.world.trial={enemies:{},opened:{},covers:{},machines:{}};d.adventure={version:1,autoNext:false,fastTurns:true,hints:true,activityWins:{},moments:[],lesson:{},aidVisits:0};for(const w of Object.values(d.world))for(const e of Object.values(w.enemies))if(e.hp<=0)e.rewarded=true;}
 for(const a of [...d.party,...d.reserve])if(!a.skills){a.skills=[];a.abilityPoints=Math.min(3,Math.floor(d.level/2));a.calibrations={};a.quickSlots=[a.weapon];}
 return d;
}
function inInteractionRange(a,o){return Math.abs(o.x-a.x)<115&&Math.abs(o.y-a.y)<72;}
function candidates(){const a=selected();return room().objects.filter(o=>{
 if(world().opened[o.id]&&['loot','recruit','patient'].includes(o.type))return false;if(S.adventure.run&&o.type==='activity'){const kind=UG.activities[S.adventure.run.id].objective;if(o.id==='job-case'&&(kind!=='recover'||S.adventure.run.carrying))return false;if(o.id==='job-relay'&&kind!=='defend')return false;}
 return inInteractionRange(a,o);
 }).sort((a,b)=>interactionScore(a)-interactionScore(b));}
function interactionScore(o){return dist(selected(),o)+(world().opened[o.id]?60:0)+(o.type==='rest'?20:0)+(o.machine&&S.flags[UG.machines[o.machine].flag]&&!['lift','steam','coolant'].includes(UG.machines[o.machine].kind)?100:0);}
function nearestInteraction(){const list=candidates();return list.find(o=>o.id===interactionFocus)||list[0]||null;}
function cycleInteraction(){const list=candidates();if(!list.length){notify('No nearby interaction.');return;}let i=list.findIndex(o=>o.id===(interactionFocus||list[0].id));interactionFocus=list[(i+1)%list.length].id;hud();}
function jumpRequest(){if(!S||battle||modal)return;const a=selected(),m=motionMemory.get(a.id)||{};m.jumpUntil=clock+.13;motionMemory.set(a.id,m);if(floorAt(a)||clock-(m.groundedAt??-10)<.1){a.vy=-390;m.jumpUntil=0;}if(!transitActors.has(a.id))paths.delete(a.id);}
function fluidMovement(dt){if(transitActors.size)return;const a=selected(),m=motionMemory.get(a.id)||{};motionMemory.set(a.id,m);
 if(!a.hp){cycleCrew();return;}
 const dx=(keys.d||keys.ArrowRight?1:0)-(keys.a||keys.ArrowLeft?1:0),dy=(keys.s||keys.ArrowDown?1:0)-(keys.w||keys.ArrowUp?1:0);
 if((dx||dy)&&paths.has(a.id))paths.delete(a.id);
 if(paths.has(a.id)){conveyor(a,55*dt);followCrew();detectContact();return;}
 const grounded=floorAt(a);if(grounded)m.groundedAt=clock;
 if(m.jumpUntil>clock&&(grounded||clock-(m.groundedAt??-10)<.1)){a.vy=-390;m.jumpUntil=0;}
 const ladder=room().ladders.filter(l=>l.type!=='lift'&&Math.abs(a.x-l.x)<49&&a.y>=l.top-12&&a.y<=l.bottom+12).sort((l,r)=>Math.abs(a.x-l.x)-Math.abs(a.x-r.x))[0];
 if(ladder&&dy){a.x=ladder.x;a.y=clamp(a.y+dy*210*dt,ladder.top,ladder.bottom);a.vy=0;m.groundedAt=clock;}
 else{
  const oldY=a.y,nextX=clamp(a.x+dx*225*dt,18,room().w-18);if(!segmentBlocked(a,{x:nextX,y:a.y}))a.x=nextX;if(dx){a.dir=dx;walking+=dt;}
  a.vy=(a.vy||0)+1100*dt;a.y+=a.vy*dt;
  for(const p of room().platforms)if(a.vy>=0&&oldY<=p.y+4&&a.y>=p.y&&a.x>=p.x-5&&a.x<=p.x+p.w+5){a.y=p.y;a.vy=0;m.groundedAt=clock;break;}
  if(a.y>room().h-20){a.y=room().platforms[0].y;a.vy=0;}
 }
 conveyor(a,55*dt);surviveTick(dt);if(S.room==='furnace'&&!S.flags.steam&&dist(a,{x:820,y:880})<65)a.hp=Math.max(1,a.hp-dt*9);
 followCrew();detectContact();
}
function followCrew(){const a=selected(),p=floorAt(a);if(!p)return;for(const b of alive()){if(b===a||paths.has(b.id)||dist(a,b)<85)continue;const offset=(actors().indexOf(b)+1)*42,tx=clamp(a.x-offset*(a.dir||1),p.x+14,p.x+p.w-14),r=route(b,tx,a.y);if(r)paths.set(b.id,r.points);}}
function addTraversalEdges(nodes,edges,ps){
 for(const p of ps){for(const x of [p.x+14,p.x+p.w-14]){const below=ps.filter(q=>q!==p&&q.y>p.y+30&&x>=q.x+5&&x<=q.x+q.w-5).sort((a,b)=>a.y-b.y)[0];if(!below)continue;const i=nodes.length;nodes.push({x,y:p.y,p:p.id},{x,y:below.y,p:below.id,kind:'drop'});edges.push([i,i+1,'oneway']);}}
 for(const p of ps)for(const q of ps){if(q.y<p.y&&p.y-q.y<=65&&Math.max(p.x,q.x)+18<Math.min(p.x+p.w,q.x+q.w)-18){const x=(Math.max(p.x,q.x)+Math.min(p.x+p.w,q.x+q.w))/2,i=nodes.length;nodes.push({x,y:p.y,p:p.id},{x,y:q.y,p:q.id,kind:'jump'});edges.push([i,i+1,'oneway']);}}
 for(const p of ps)for(const q of ps){if(p===q||Math.abs(p.y-q.y)>65)continue;let ax,bx;if(p.x+p.w<=q.x){ax=p.x+p.w-10;bx=q.x+10;}else if(q.x+q.w<=p.x){ax=p.x+10;bx=q.x+q.w-10;}else continue;
 const disc=390*390+2200*(q.y-p.y);if(disc<0||Math.abs(ax-bx)>Math.min(145,225*(390+Math.sqrt(disc))/1100-8))continue;const i=nodes.length;nodes.push({x:ax,y:p.y,p:p.id},{x:bx,y:q.y,p:q.id,kind:'jump'});edges.push([i,i+1,'oneway']);}
}
function interactionLabel(o){if(o.type==='machine'){const method=preferredMachine(o.machine);if(method)return `${o.name} / ${machineMethodLabel(o.machine,method)} · Shift+E options`;}return o.name;}
function preferredMachine(id){const m=UG.machines[id],a=selected();if(S.flags[m.flag]&&!['steam','coolant','lift'].includes(m.kind))return null;
 const capable=actors().some(a=>a.hp>0&&['orren','latch'].includes(a.id))||id==='vault-pump'&&S.flags.pumpGuide;
 if(m.methods.includes('toggle'))return 'toggle';if(m.methods.includes('ride'))return 'ride';
 if(m.methods.includes('cut')&&(S.items.cutter||a.weapon==='chainblade'))return 'cut';
 if(m.methods.includes('engineer')&&capable)return 'engineer';
 if(m.methods.includes('scrap')&&S.scrap>=(m.cost||4))return 'scrap';
 if(m.methods.includes('arc')&&a.weapon==='arc'&&a.mag)return 'arc';
 return null;
}
function machineMethodLabel(id,method){return ({toggle:'operate',ride:'ride lift',cut:'cut open',engineer:'crew repair / free parts',scrap:'repair / '+(UG.machines[id].cost||4)+' salvage',arc:'energize / 1 round'})[method]||method;}
function quickMachine(o){const method=preferredMachine(o.machine);if(!method||keys.Shift||keys.shift){machineMenu(o.machine);return;}operateMachine(o.machine,method);}
function moment(title,body,button,act){if(!S)return;S.adventure.moments.unshift({title,body});S.adventure.moments=S.adventure.moments.slice(0,12);const box=$('#moment');box.innerHTML=`<small>EXPEDITION UPDATE</small><b>${escape(title)}</b><span>${escape(body)}</span>${button?`<button data-action="${act}">${button}</button>`:''}<button data-action="dismissmoment" class="moment-close" aria-label="Dismiss update">×</button>`;box.hidden=!!battle;box.dataset.until=String(clock+8);}
function adventureHUD(){if(!S)return;const a=selected(),w=weapon(a);const hint=$('#lesson');if(hint){hint.hidden=!S.adventure.hints;hint.textContent=battle?'Q target · SPACE fire · click floor to move · TAB next fighter':!S.flags.quest?'A/D walk · W/S climb · SPACE jump · E speak to Mara':!S.party.some(a=>a.id==='vera')&&!S.world.cable.opened.vera?'A courier waits above the Cableworks entrance. Recruit before the deeper fights.':S.level>=2&&a.abilityPoints?'K / choose an active ability for this fighter':'E use highlighted object · F cycle overlaps · V quick weapon · Shift+E machine options';}
 if(battle||$('#moment').dataset.until&&clock>+$('#moment').dataset.until)$('#moment').hidden=true;
 const target=chosenTarget();const bar=$('#tactical');bar.hidden=!battle;if(battle){const disabled=battle.phase!=='player'||paths.size||a.hp<=0,knife=!!(target&&!w.melee&&!a.mag&&dist(a,target)<70),info=target?shotInfo(knife?{...a,weapon:'chainblade'}:a,target):null,cost=knife?1:w.ap;const barHTML=`<button data-action="target">Q / TARGET</button><button data-action="fire" ${disabled||!target||!info?.legal||a.ap<cost||!w.melee&&!a.mag&&!knife?'disabled':''}>SPACE / ${knife?'KNIFE':'FIRE'} ${cost} AP ${info?.legal?(knife?'':info.chance+'%'):info?.reason||''}</button><button data-action="skills">K / ABILITIES</button><button data-action="coverall" ${disabled?'disabled':''}>CREW WATCH →</button><button data-action="autonext">AUTO NEXT ${S.adventure.autoNext?'ON':'OFF'}</button>${a.skills.map(id=>`<button data-skill="${id}" ${disabled||a.ap<UG.skills[id].cost?'disabled':''}>${UG.skills[id].name.toUpperCase()} / ${UG.skills[id].cost}</button>`).join('')}<span>${target?escape(target.name)+' · '+target.hp+' HP':'Choose a hostile'} / ${combatEnemies().length} engaged</span>`;if(bar.innerHTML!==barHTML)bar.innerHTML=barHTML;}
 const reloadButton=$('[data-action="reload"]'),healButton=$('[data-action="heal"]');reloadButton.disabled=w.melee||a.mag>=w.mag||!S.ammo||!!(battle&&(battle.phase!=='player'||a.ap<1));healButton.disabled=!S.meds||a.hp>=a.maxhp||!!(battle&&(battle.phase!=='player'||a.ap<1));
}
function configureInventory(){const panel=$('#panel');if(!panel.querySelector('#loadoutPreview'))return;
 const headers=[...panel.querySelectorAll('h2')],names={'Weapon':'weapons','Armor':'armor','Field gear':'gear','Weapon modification':'mods','Talents':'growth','Kit in action':'growth','Key salvage':'gear'};
 const nav=document.createElement('nav');nav.className='loadout-tabs';nav.innerHTML=[['weapons','WEAPON'],['armor','ARMOR'],['gear','GEAR'],['mods','MOD'],['growth','GROWTH']].map(([id,label])=>`<button data-loadout-tab="${id}" class="${loadoutTab===id?'primary':''}">${label}</button>`).join('');const first=headers[0];first.before(nav);
 for(const h of headers){const match=Object.keys(names).sort((a,b)=>b.length-a.length).find(k=>h.textContent.startsWith(k));if(!match)continue;const section=document.createElement('section');section.dataset.loadoutSection=names[match];h.before(section);section.appendChild(h);while(section.nextSibling&&!['H2'].includes(section.nextSibling.nodeName)){const n=section.nextSibling;if(n.nodeType===1&&n.matches('.row')&&n.querySelector('[data-action="workbench"]'))break;section.appendChild(n);}section.hidden=section.dataset.loadoutSection!==loadoutTab;}
 const growth=panel.querySelector('[data-loadout-section="growth"]');if(growth){const button=document.createElement('button');button.dataset.action='skills';button.textContent='ACTIVE ABILITIES →';growth.prepend(button);}
 const quick=document.createElement('div');quick.className='row';quick.innerHTML='<button data-action="quickweapon">V / NEXT WEAPON</button><button data-action="calibrate">CALIBRATE EQUIPPED GUN</button><button data-action="catalog">ARSENAL / SOURCES</button>';quick.hidden=loadoutTab!=='weapons';nav.after(quick);const nameInput=panel.querySelector('#callsign');if(nameInput){const row=nameInput.closest('.row'),details=document.createElement('details');details.className='appearance-settings';details.innerHTML='<summary>CALLSIGN & COLORS</summary>';row.before(details);details.appendChild(row);}for(const p of panel.querySelectorAll('p'))if(p.textContent.startsWith('Equipment is a collection'))p.textContent='Patterns are shared. Magazines and calibrations belong to each fighter.';
}
function quickWeapon(){const a=selected();if(a.quickSlots.length<2&&S.weapons.length>=2)a.quickSlots=[a.weapon,S.weapons.find(id=>id!==a.weapon)];const ids=a.quickSlots.length>=2?a.quickSlots:S.weapons;if(ids.length<2){notify('Find or buy another weapon first.');return;}if(battle&&modal)close();if(battle&&!canAct(a,1))return;const id=ids[(ids.indexOf(a.weapon)+1)%ids.length];if(battle)a.ap--;S.ammo+=a.mag;a.weapon=id;a.mag=Math.min(S.ammo,UG.weapons[id].mag);S.ammo-=a.mag;a.braced=false;a.aimed=false;dashMode=grenadeMode=toolMode=false;notify((a.callsign||a.name)+' / '+UG.weapons[id].name);hud();if(modal)inventory();if(!battle)save(true);}
function fieldScenery(){
 const id=S.room,seed=Object.keys(UG.rooms).indexOf(id),color=room().color;
 for(let k=0;k<8;k++){const x=90+((seed*71+k*197)%Math.max(500,room().w-180)),y=room().platforms[0].y;
 if(room().theme==='settlement'){line(x,y-90,x+80,y-90,'#496044');for(let j=0;j<4;j++)rect(x+j*19,y-87,12,20,j%2?'#4e6242':'#66734a');}
 else if(['rail','convoy'].includes(room().theme)){outline(x,y-90,75,75,'#344b37');line(x,y-90,x+75,y-15,'#344b37');}
 else{outline(x,y-45,40+k%3*12,45,'#344735');for(let z=0;z<3;z++)line(x+4,y-37+z*11,x+30,y-37+z*11,'#3f5340');}}
 const labels={cable:'WARD CABLE AUTHORITY / LIVE LINES',sump:'FILTER CHANGE OVERDUE',furnace:'RIVET UNION / MIND THE HEAT',yard:'NINE TRACKS / NO FREE RIDES',archive:'PASSENGER MANIFESTS / UNCLAIMED',garden:'DO NOT DRINK THE RUNOFF',skyhooks:'COUNTERWEIGHT UNION',blacksite:'DELIVERY WITHOUT RECEIPT',deadrail:'LAST TRAIN / NO ANNOUNCEMENT',tenement:'RENT PAID / WAGES MISSING',pressure:'FLOOD CONTROL / SHIFT 88'};
 if(labels[id])text(labels[id],room().w*.48,room().platforms[0].y-120,'#59704d',14,'center');
 const o=nearestInteraction();if(o&&!modal){ctx.setLineDash([3,5]);outline(o.x-29,o.y-65,58,67,'#9fca7e');ctx.setLineDash([]);}
 if(battle){const t=chosenTarget();if(t){ctx.strokeStyle='#e8bd84';ctx.beginPath();ctx.ellipse(t.x,t.y+3,23,6,0,0,Math.PI*2);ctx.stroke();}}
}
function adventureAction(id){if(id==='equipfound'){equipFound();return true;}if(id==='pace'){S.adventure.fastTurns=!S.adventure.fastTurns;system();if(!battle)save(true);return true;}if(id==='hints'){S.adventure.hints=!S.adventure.hints;system();if(!battle)save(true);return true;}if(id==='cycleinteract'){cycleInteraction();return true;}if(id==='quickweapon'){quickWeapon();return true;}if(id==='dismissmoment'){$('#moment').hidden=true;return true;}if(id==='target'){cycleTarget();return true;}if(id==='fire'){const t=chosenTarget(),a=selected();if(t){if(!weapon(a).melee&&!a.mag&&dist(a,t)<70)backupStrike(a,t);else shoot(a,t);}return true;}if(id==='autonext'){S.adventure.autoNext=!S.adventure.autoNext;hud();return true;}if(id==='coverall'){coverAll();return true;}if(id==='skills'){skillsPanel();return true;}if(id==='calibrate'){calibrationPanel();return true;}if(id==='catalog'){catalogPanel();return true;}if(id==='activities'){activityBoard();return true;}if(id==='relief'){reliefSupplies();return true;}return false;}
document.addEventListener('click',e=>{const tab=e.target.closest('[data-loadout-tab]');if(tab){loadoutTab=tab.dataset.loadoutTab;inventory();}});
// Local engagements keep ordinary exploration brisk. Major set pieces stay whole.
function combatEnemies(){return battle?.ids?enemies().filter(e=>battle.ids.includes(e.id)):enemies();}
function detectContact(){if(battle||modal||transitActors.size)return;const near=enemies().find(e=>alive().some(a=>dist(a,e)<380));if(near)beginBattle(near);}
function encounterIds(seed){if(!seed||['bell','blacksite','excavator','convoy','trial'].includes(S.room))return enemies().map(e=>e.id);return enemies().filter(e=>e.id===seed.id||(seed.squad?e.squad===seed.squad:Math.abs(e.y-seed.y)<85&&dist(e,seed)<480)).map(e=>e.id);}
function joinEncounter(t){if(!battle||battle.ids.includes(t.id))return;battle.ids.push(t.id);notify(t.name+' joins the fight.');}
function chosenTarget(){if(!battle)return null;const all=combatEnemies();return all.find(e=>e.id===battle.target)||all.find(e=>shotInfo(selected(),e).legal)||all[0]||null;}
function cycleTarget(){if(!battle||battle.phase!=='player')return;const list=combatEnemies(),current=chosenTarget(),i=list.findIndex(e=>e.id===current?.id);battle.target=list[(i+1)%Math.max(1,list.length)]?.id;hud();}
function afterOrder(){if(S.adventure.autoNext&&battle?.phase==='player'&&selected().ap<=0&&!paths.size)cycleCrew();}
function coverAll(){if(!battle||battle.phase!=='player'||paths.size)return;for(const a of alive()){if(a.ap>0&&(a.mag||weapon(a).melee)){a.watch=true;a.ap=0;float(a,'WATCH');}}endTurn();hud();}
function claimEnemy(e){const q=world().enemies[e.id];if(!q||q.hp>0||q.rewarded||S.adventure.run)return null;q.rewarded=true;const base=UG.enemyTypes[e.type],xp=q.spared?Math.round(base.xp*.65):base.xp,credits=q.spared?0:Math.round(base.xp*.55);S.credits+=credits;if(!q.spared)S.kills++;gainXP(xp);if(battle)battle.earned.push({xp,credits,id:e.id});return {xp,credits};}
function resolveEngagement(){if(!battle)return;if(!alive().length){defeat();return;}
 if(S.adventure.run){activityProgress();return;}
 for(const e of room().enemies)claimEnemy(e);
 if(combatEnemies().length)return;
 const b=battle,paid=b.earned.length>0,ammo=paid?4+b.ids.length*4:0;S.ammo+=ammo;
 for(const a of actors()){a.ap=0;a.watch=false;a.suppressed=false;a.braced=false;a.aimed=false;if(!a.hp)a.hp=Math.round(a.maxhp*.3);}
 if(actors().some(a=>a.id==='orren'))for(const a of alive())a.hp=Math.min(a.maxhp,a.hp+8);
 const salvage=paid?afterVictory():0;world().cleared=!enemies().length;battle=null;paths.clear();dashMode=false;grenadeMode=false;
 const xp=b.earned.reduce((n,e)=>n+e.xp,0),credits=b.earned.reduce((n,e)=>n+e.credits,0);notify(`${world().cleared?'DISTRICT SECURED':'ENCOUNTER CLEARED'} // +${xp} XP · ¢${credits} · +${ammo} rounds · +${salvage} salvage`);log('Encounter cleared in '+room().name+'.');S.adventure.lesson.combat=true;save(true);hud();
}
function startEncounter(seed){if(battle)return;paths.clear();dashMode=false;for(const a of actors()){if(a.hp>0&&!floorAt(a)){const p=room().platforms.filter(p=>p.y>=a.y&&a.x>=p.x&&a.x<=p.x+p.w).sort((a,b)=>a.y-b.y)[0];if(p)a.y=p.y;}a.vy=0;a.ap=a.hp>0?3:0;a.watch=false;a.suppressed=false;a.braced=false;a.aimed=false;a.usedSkills={};a.patchUsed=false;a.overloadUsed=false;}
 battle={phase:'player',round:1,enemyDelay:0,queue:[],ids:encounterIds(seed),target:null,earned:[],entry:{x:selected().x,y:selected().y}};notify('CONTACT // '+battle.ids.length+' hostiles. Q target · SPACE fire · TAB crew.');hud();}
function skillsPanel(){const a=selected();panel('FIGHTER / ACTIVE ABILITIES',`<h1>${escape(a.callsign||a.name)}</h1><p>Licences at levels 2, 4 and 6: learn up to three abilities per fighter. Passive talents remain separate. ${a.abilityPoints} licence(s) available.</p><div class="grid">${Object.entries(UG.skills).map(([id,s])=>`<article class="card"><div class="tag">${s.role}</div><h3>${s.name}</h3><p>${s.desc}</p>${a.skills.includes(id)?`<button data-skill="${id}" ${battle?.phase==='player'?'':'disabled'}>USE / ${s.cost} AP</button>`:`<button data-learn="${id}" ${battle||!a.abilityPoints||a.skills.length>=3?'disabled':''}>LEARN</button>`}</article>`).join('')}</div>`);}
function useSkill(id){const a=selected(),s=UG.skills[id];if(!s||!a.skills.includes(id)||!battle||battle.phase!=='player')return false;const target=chosenTarget();close();
 if(id==='dash'){grenadeMode=toolMode=false;if(a.usedSkills.dash){notify('Dash already used this round.');return false;}if(!canAct(a,1))return false;dashMode=true;notify('DASH // Click a route within '+Math.round(moveAllowance(a)*1.8)+' units. 1 AP.');return true;}
 if(id==='breach'){dashMode=toolMode=false;if(!canAct(a,2)||!S.grenades){notify('Requires 2 AP and a frag.');return false;}battle.shaped=true;grenadeMode=true;notify('SHAPED FRAG // Click a location. Allies can be hit.');return true;}
 if(!canAct(a,s.cost))return false;if(id==='patch'&&!alive().some(b=>dist(a,b)<180&&(b.hp<b.maxhp||b.burn||b.toxin))){notify('Nearby crew are healthy.');return false;}
 if(a.usedSkills[id]||id==='patch'&&a.patchUsed||id==='overload'&&a.overloadUsed){notify('That ability has already been used.');return false;}
 if(id==='brace'&&UG.weapons[a.weapon].ap!==2){notify('Brace needs a two-AP weapon.');return false;}
 if(id==='overload'&&(!target||dist(a,target)>600||!shotInfo({...a,weapon:'arc'},target).legal)){notify('Choose a visible target within 600 units.');return false;}
 a.ap-=s.cost;a.usedSkills[id]=true;
 if(id==='deadeye'){a.aimed=true;float(a,'DEADEYE');}
 if(id==='brace'){a.braced=true;float(a,'BRACED');}
 if(id==='patch'){a.patchUsed=true;const friend=alive().filter(b=>dist(a,b)<180&&(b.hp<b.maxhp||b.burn||b.toxin)).sort((a,b)=>a.hp/a.maxhp-b.hp/b.maxhp)[0]||a;friend.hp=Math.min(friend.maxhp,friend.hp+35);friend.burn=friend.toxin=0;float(friend,'PATCH +35');}
 if(id==='overload'){a.overloadUsed=true;world().enemies[target.id].shocked=true;world().enemies[target.id].suppressed=true;if(['drone','stabilizer','excavator'].includes(target.type))hurt(target,12,a);float(target,'OVERLOAD','#8ed5cd');}
 checkBattle();hud();afterOrder();return true;
}
function abilityLevel(){for(const a of allCrew()){const expected=Math.min(3,Math.floor(S.level/2));a.abilityPoints=Math.max(0,expected-a.skills.length);}}
function calibrationPanel(){const a=selected(),rank=a.calibrations[a.weapon]||0,cost=35+rank*40,scrap=4+rank*3;panel('WORKSHOP / CALIBRATION',`<h1>${UG.weapons[a.weapon].name}</h1><p>Calibration ${rank}/3. Each rank adds +2 damage and +2 accuracy to this fighter’s copy of the pattern. Other fighters keep their own calibrations. Even a starter pistol can become a trusted sidearm.</p><p>Next service: ¢${cost} + ${scrap} salvage.</p><button data-calibrate ${battle||rank>=3||S.credits<cost||S.scrap<scrap?'disabled':''}>CALIBRATE →</button><button data-action="inventory">BACK TO KIT</button>`);}
function catalogPanel(){panel('ARSENAL / FIND YOUR NEXT TOOL',`<p>Danger tiers are fixed by region. They never scale to your level. Look for a useful role, not just a bigger damage number.</p><div class="grid">${Object.entries(UG.weapons).map(([id,w])=>`<article class="card"><div class="tag">${S.weapons.includes(id)?'OWNED':'UNDISCOVERED PATTERN'}</div><h3>${w.name}</h3><p>${w.desc}<br>${UG.weaponSources[id]}</p></article>`).join('')}</div>`);}
function reliefSupplies(){if(battle||!['hearth','market'].includes(S.room)){notify('Ward relief is available in Last Light or Rustmarket.');return;}const total=S.ammo+actors().reduce((n,a)=>n+a.mag,0),ammo=Math.max(0,24-total),med=S.meds<1?1:0;if(!ammo&&!med){notify('You have enough to get moving. Relief is for a shortfall.');return;}S.ammo+=ammo;S.meds+=med;S.adventure.aidVisits++;notify(`WARD RELIEF // +${ammo} rounds · +${med} medkit. No XP or currency.`);save(true);}
function validateAdventure(d){const a=d.adventure;if(a?.run)throw Error('Active jobs cannot be imported.');if(!a||a.version!==1||typeof a.autoNext!=='boolean'||typeof a.fastTurns!=='boolean'||typeof a.hints!=='boolean'||!a.activityWins||!Array.isArray(a.moments)||a.moments.some(m=>typeof m.title!=='string'||typeof m.body!=='string'))throw Error('Invalid adventure state.');for(const [id,n] of Object.entries(a.activityWins))if(!Object.hasOwn(UG.activities,id)||!Number.isInteger(n)||n<0||n>100000)throw Error('Invalid work record.');for(const p of [...d.party,...d.reserve]){if(!Array.isArray(p.skills)||p.skills.length>3||new Set(p.skills).size!==p.skills.length||p.skills.some(id=>!Object.hasOwn(UG.skills,id))||!Number.isInteger(p.abilityPoints)||p.abilityPoints<0||p.abilityPoints>3||!p.calibrations||!Array.isArray(p.quickSlots)||p.quickSlots.length>2||p.quickSlots.some(id=>!d.weapons.includes(id)))throw Error('Invalid ability loadout.');for(const [id,n] of Object.entries(p.calibrations))if(!Object.hasOwn(UG.weapons,id)||!Number.isInteger(n)||n<0||n>3)throw Error('Invalid calibration.');}}
document.addEventListener('click',e=>{const el=e.target.closest('[data-skill],[data-learn],[data-calibrate]');if(!el||!S)return;const a=selected();if(el.dataset.skill)useSkill(el.dataset.skill);if(el.dataset.learn&&!battle){const id=el.dataset.learn;if(UG.skills[id]&&a.abilityPoints>0&&!a.skills.includes(id)&&a.skills.length<3){a.skills.push(id);a.abilityPoints--;skillsPanel();save(true);}}if(el.hasAttribute('data-calibrate')&&!battle){const rank=a.calibrations[a.weapon]||0,cost=35+rank*40,scrap=4+rank*3;if(rank<3&&S.credits>=cost&&S.scrap>=scrap){S.credits-=cost;S.scrap-=scrap;a.calibrations[a.weapon]=rank+1;calibrationPanel();save(true);}}});
// Voluntary jobs have their own work site; cleared exploration routes stay clear.
function activityRate(wins){return [1,.6,.3,.15,.1][wins]||0;}
function activityBoard(){panel('DISPATCH / OPTIONAL CHALLENGES',`<h1>Choose your risk.</h1><p class="amber">YOUR CREW / LV ${S.level} · ${S.ammo} spare rounds · ${S.meds} medkits · ¢${S.credits}</p><p>Fixed enemy tiers. No scaling to your level. Paid rewards diminish over five successful runs, then become practice only. Each site is separate from the story districts.</p><div class="grid">${Object.entries(UG.activities).map(([id,j])=>{const wins=S.adventure.activityWins[id]||0,rate=activityRate(wins);return `<article class="card"><div class="tag">TIER ${j.tier} / ${j.objective.toUpperCase()} / ${wins} WINS</div><h3>${j.name}</h3><p>${j.desc}</p><p>Entry ¢${j.fee} · next clear ¢${Math.round(j.credits*rate)}, ${Math.round(j.scrap*rate)} salvage, ${wins<3?Math.round(j.xp*rate):0} XP.<br>${wins?'First-clear pattern already claimed.':rewardText(j.reward)}</p><button data-job="${id}" ${battle||!['hearth','market'].includes(S.room)||S.credits<j.fee?'disabled':''}>TAKE THE JOB →</button></article>`;}).join('')}</div><div class="row"><button data-action="relief">WARD RELIEF / LOW SUPPLIES</button><button data-action="contracts">STORY WORK BOARD</button></div>`);}
function startActivity(id){const job=UG.activities[id];if(!job||battle||paths.size||!['hearth','market'].includes(S.room)||S.credits<job.fee)return false;save(true);
 const origin={room:S.room,x:selected().x,y:selected().y};S.credits-=job.fee;S.adventure.run={id,origin,carrying:false,rounds:0,assetHP:100,repairRound:0,finished:null};
 UG.rooms.trial.enemies=job.foes.map(e=>enemy(...e));UG.rooms.trial.name=job.name;UG.rooms.trial.subtitle=job.desc;UG.roomTiers.trial=job.tier;
 S.world.trial={enemies:Object.fromEntries(UG.rooms.trial.enemies.map(e=>[e.id,{hp:UG.enemyTypes[e.type].hp,x:e.x,y:e.y}])),opened:{},covers:{},machines:{}};
 travel('trial',100,880);beginBattle();moment(job.name,job.desc,null,null);return true;
}
function activityObjective(){const r=S.adventure.run;if(!r)return null;const j=UG.activities[r.id];return `${j.name} / ${j.objective==='defend'?'relay '+r.assetHP+' HP · '+r.rounds+'/'+j.rounds+' rounds':j.objective==='recover'?(r.carrying?'Carry the freight to the eastern exit.':'Reach the upper consignment and collect it.'):j.objective==='escape'?'Reach the eastern extraction hatch.':'Defeat the collector (r1); escorts are optional.'}`;}
function activityBlast(x,y,radius,damage){const r=S.adventure.run;if(r&&UG.activities[r.id].objective==='defend'&&dist({x,y},{x:600,y:880})<radius){r.assetHP=Math.max(0,r.assetHP-Math.round(damage*.7));activityProgress();}}
function activityProgress(){const r=S.adventure.run;if(!r||r.finished)return;const j=UG.activities[r.id];if(r.assetHP<=0){r.finished='fail';battle=null;paths.clear();return;}if(j.objective==='leader'&&world().enemies.r1?.hp<=0){r.finished='win';return;}if(j.objective==='defend'&&(r.rounds>=j.rounds||!enemies().length)){r.finished='win';return;}if(!enemies().length&&battle){battle=null;paths.clear();for(const a of actors()){a.ap=0;a.watch=false;}notify('HOSTILES CLEARED // Complete the marked job objective.');hud();}}
function activityRoundEnd(){const r=S.adventure.run;if(!r)return;r.rounds++;activityProgress();}
function activityEnemy(e){const r=S.adventure.run;if(!r||UG.activities[r.id].objective!=='defend')return false;
 const relay={id:'relay',x:600,y:880,hp:r.assetHP,maxhp:100,armor:3};let info=shotInfo(e,relay);if(!info.legal){const path=route(e,relay.x,relay.y);if(path){let budget=260;for(const p of path.points){const d=dist(e,p);if(d<=budget){e.x=p.x;e.y=p.y;budget-=d;}else{if(Math.abs(p.y-e.y)>1){e.x=p.x;e.y=p.y;}else e.x+=(p.x-e.x)/d*budget;break;}}Object.assign(world().enemies[e.id],{x:e.x,y:e.y});info=shotInfo(e,relay);e.ap--;}}
 if(info.legal&&e.ap>=weapon(e).ap){const w=weapon(e),dmg=Math.max(5,Math.round(w.damage*(w.burst?1.5:1))-3);r.assetHP=Math.max(0,r.assetHP-dmg);tracer(e,relay,'#e7af73');float(relay,'RELAY −'+dmg,'#e7af73');activityProgress();}return true;
}
function activityInteract(o){const r=S.adventure.run;if(!r||o.type!=='activity')return false;const j=UG.activities[r.id];
 if(o.id==='job-abort'){if(battle?.phase==='enemy'||paths.size)return true;r.finished='abort';battle=null;return true;}
 if(o.id==='job-case'&&j.objective==='recover'){if(r.carrying){notify('You have the consignment. Reach the exit.');return true;}if(battle&&!canAct(selected(),1))return true;if(battle)selected().ap--;r.carrying=true;notify('FREIGHT RECOVERED // Reach the eastern hatch.');hud();return true;}
 if(o.id==='job-exit'&&['recover','escape'].includes(j.objective)){if(j.objective==='recover'&&!r.carrying){notify('Collect the upper freight case first.');return true;}if(battle&&!canAct(selected(),1))return true;if(battle)selected().ap--;r.finished='win';return true;}
 if(o.id==='job-relay'&&j.objective==='defend'){if(r.assetHP>=100){notify('Relay already intact.');return true;}if(battle&&!canAct(selected(),1))return true;if(r.repairRound===(battle?.round||-1)){notify('Relay already patched this round.');return true;}const engineer=actors().some(a=>['orren','latch'].includes(a.id)&&a.hp>0);if(!engineer&&S.scrap<3){notify('Repair needs 3 salvage, or an active engineer.');return true;}if(!engineer)S.scrap-=3;if(battle)selected().ap--;r.assetHP=Math.min(100,r.assetHP+35);r.repairRound=battle?.round||-1;notify('RELAY PATCHED +35');hud();return true;}
 notify(activityObjective());return true;
}
function finishActivity(){const r=S.adventure.run;if(!r?.finished)return;const j=UG.activities[r.id],wins=S.adventure.activityWins[r.id]||0,rate=activityRate(wins),success=r.finished==='win';
 let payout={credits:0,scrap:0,xp:0};if(success){payout={credits:Math.round(j.credits*rate),scrap:Math.round(j.scrap*rate),xp:wins<3?Math.round(j.xp*rate):0};S.credits+=payout.credits;S.scrap+=payout.scrap;gainXP(payout.xp);if(wins===0)reward(j.reward);S.adventure.activityWins[r.id]=wins+1;S.kills+=Object.values(world().enemies).filter(e=>e.hp<=0&&!e.spared).length;}
 for(const a of actors()){a.ap=0;a.watch=a.braced=a.aimed=false;if(a.hp<=0)a.hp=Math.round(a.maxhp*.3);}if(!alive().length)actors()[0].hp=Math.round(actors()[0].maxhp*.5);
 const origin=r.origin;S.adventure.run=null;battle=null;paths.clear();UG.rooms.trial.enemies=[];S.world.trial={enemies:{},opened:{},covers:{},machines:{}};travel(origin.room,origin.x,origin.y);
 const text=success?`+${payout.xp} XP · ¢${payout.credits} · +${payout.scrap} salvage${wins===0?' · '+rewardText(j.reward):''}`:r.finished==='abort'?'Withdrew. Entry and spent supplies are not refunded.':(r.assetHP<=0?'The relay was destroyed.':'The crew was overwhelmed.')+' Entry and spent supplies are lost; crew recovered.';log(j.name+': '+text);moment(success?'JOB COMPLETE / '+j.name:'JOB ENDED / '+j.name,text,'DISPATCH','activities');save(true);
}
function adventureTick(dt){if(!S)return;if(S.adventure.run?.finished){finishActivity();return;}
 if(battle&&battle.phase==='player'&&!S.adventure.run){for(const e of enemies())if(!battle.ids.includes(e.id)&&alive().some(a=>dist(a,e)<230))joinEncounter(e);}
 if($('#moment').dataset.until&&clock>+$('#moment').dataset.until)$('#moment').hidden=true;
}
function adventureDraw(){fieldScenery();utilityDraw();const r=S.adventure.run;if(r&&UG.activities[r.id].objective==='defend'){rect(580,830,40,50,'#1b2c20');outline(580,830,40,50,'#8ed5cd');text('RELAY '+r.assetHP+' HP',600,810,'#8ed5cd',13,'center');}
 if(r){for(const o of room().objects){if(o.id==='job-case'&&UG.activities[r.id].objective==='recover'&&!r.carrying){rect(o.x-22,o.y-32,44,32,'#31412b');outline(o.x-22,o.y-32,44,32,'#ccf58b');text('RECOVER',o.x,o.y-55,'#ccf58b',10,'center');}if(o.id==='job-exit'&&['recover','escape'].includes(UG.activities[r.id].objective)){outline(o.x-25,o.y-75,50,75,'#8ed5cd');text('EXTRACT',o.x,o.y-90,'#8ed5cd',10,'center');}if(o.id==='job-abort'){outline(o.x-20,o.y-65,40,65,'#b4bb85');text('DISPATCH',o.x,o.y-78,'#b4bb85',9,'center');}}text(activityObjective(),100,350,'#d8d8a0',12);}
}
document.addEventListener('click',e=>{const job=e.target.closest('[data-job]');if(job&&S)startActivity(job.dataset.job);});

document.addEventListener('click',e=>{const q=e.target.closest('[data-quick]');if(!q||!S||battle)return;const a=selected(),id=q.dataset.quick;if(!S.weapons.includes(id))return;if(a.quickSlots.includes(id))a.quickSlots=a.quickSlots.filter(x=>x!==id);else{a.quickSlots=[...a.quickSlots,id].slice(-2);}inventory();save(true);});

function movementCost(a,r){return dashMode&&battle?1:Math.max(1,Math.ceil(r.length/moveAllowance(a)));}

function saveSnapshot(){const data=JSON.parse(JSON.stringify(S));for(const a of data.party){if(!floorAt(a)){const below=room().platforms.filter(p=>p.y>=a.y&&a.x>=p.x&&a.x<=p.x+p.w).sort((a,b)=>a.y-b.y)[0];if(below){a.y=below.y;a.vy=0;}}}return data;}
function resetRuntimeMotion(){paths.clear();transitActors.clear();liftMotion.clear();motionMemory.clear();animations.clear();dashMode=toolMode=grenadeMode=false;interactionFocus=null;latestFound=null;$('#moment').hidden=true;fx=[];}
let latestFound=null;
function foundItem(o){if(!o.weapon&&!o.armorKey&&!o.gear)return;const name=o.weapon?UG.weapons[o.weapon].name:o.armorKey?UG.armors[o.armorKey].name:UG.gear[o.gear].name;latestFound=o.weapon||null;moment('DISCOVERED / '+name,o.weapon?UG.weapons[o.weapon].desc:o.armorKey?UG.armors[o.armorKey].desc:UG.gear[o.gear].desc,o.weapon?'EQUIP NOW':'INSPECT',o.weapon?'equipfound':'inventory');}
function equipFound(){if(!latestFound||!S.weapons.includes(latestFound)||battle)return;const a=selected();S.ammo+=a.mag;a.weapon=latestFound;a.mag=Math.min(S.ammo,UG.weapons[a.weapon].mag);S.ammo-=a.mag;a.quickSlots=[...new Set([a.quickSlots[0]||'pistol',latestFound])].slice(-2);$('#moment').hidden=true;hud();save(true);}
function utilityAction(o){const id=o.utility,u=UG.utilities[id];if(!u)return false;if(id==='crane'&&S.flags.cargoDropped||id==='runoff'&&S.flags.runoffIsolated){notify('Already completed.');return true;}if(battle&&!canAct(selected(),1))return true;
 if(id==='runoff'&&S.scrap<3&&!actors().some(a=>['orren','latch'].includes(a.id))){notify('Needs 3 salvage or a crew engineer.');return true;}
 if(battle)selected().ap--;
 if(id==='belt'){S.flags.furnaceBelt=S.flags.furnaceBelt===false;notify(S.flags.furnaceBelt?'CONVEYOR RUNNING / pushes east':'CONVEYOR STOPPED');}
 if(id==='runoff'){if(!actors().some(a=>['orren','latch'].includes(a.id)))S.scrap-=3;S.flags.runoffIsolated=true;gainXP(15);notify('RUNOFF ISOLATED // The lower Gardens route is safe.');}
 if(id==='crane'){S.flags.cargoDropped=true;explode(1150,880,135,42);if(!battle){for(const e of room().enemies)claimEnemy(e);if(!enemies().length&&!world().cleared)afterVictory();}notify('CARGO RELEASED // Impact and blast below.');}
 audioCue('machine');hud();save(true);return true;
}
function conveyor(a,step){if(S.room!=='furnace'||S.flags.furnaceBelt===false||a.y!==880||a.x<450||a.x>730)return;a.x=clamp(a.x+step,450,770);if(a.enemy)world().enemies[a.id].x=a.x;}
function utilityDraw(){if(S.room==='furnace'){rect(450,880,280,7,'#567047');for(let x=450;x<730;x+=35){const off=S.flags.furnaceBelt===false?0:(clock*40)%35;text('›',x+off,875,'#9fbb77',16);}}
 for(const o of room().objects.filter(o=>o.type==='utility')){const active=o.utility==='belt'?S.flags.furnaceBelt!==false:o.utility==='crane'?S.flags.cargoDropped:S.flags.runoffIsolated;ctx.strokeStyle=active?'#8ed5cd':'#e7af73';ctx.beginPath();ctx.arc(o.x,o.y-40,13,0,Math.PI*2);ctx.stroke();line(o.x-13,o.y-40,o.x+13,o.y-40,ctx.strokeStyle,2);text(o.utility.toUpperCase(),o.x,o.y-67,ctx.strokeStyle,9,'center');}
 if(S.room==='docks'&&S.flags.cargoDropped){rect(1120,840,60,40,'#304333');outline(1120,840,60,40,'#84a276');}if(S.room==='garden'&&S.flags.runoffIsolated)text('RUNOFF ISOLATED / CLEAN WALKWAY',810,835,'#8ed5cd',11,'center');}
function floorLabel(y){const ys=[...new Set(room().platforms.map(p=>p.y))].sort((a,b)=>b-a),i=ys.findIndex(v=>Math.abs(v-y)<20);return i===0?'ground deck':i>0?'deck '+i:'a marked deck';}

function backupStrike(a,t){const info=shotInfo({...a,weapon:'chainblade'},t);if(dist(a,t)>=70||!info.legal){notify(info.reason||'Move within knife range.');return false;}if(!canAct(a,1))return false;a.ap--;hurt(t,Math.max(3,15+S.level*2-Math.max(0,armorSave(t)-1)),a);animate(a,'fire',.3);checkBattle();hud();afterOrder();return true;}

// Keep actionable overlays above, rather than on top of, the tactical controls.
function layoutCombatOverlays(o){const bar=$('#tactical'),base=battle?parseFloat(getComputedStyle(bar).bottom)+bar.offsetHeight+12:null;
 for(const id of ['interact','targetInfo','bossReadout']){const el=$('#'+id);el.style.bottom=base===null?'':(base+(id==='interact'?0:o?$('#interact').offsetHeight+10:0)+(id==='bossReadout'&&$('#targetInfo').textContent?$('#targetInfo').offsetHeight+10:0))+'px';}
}
