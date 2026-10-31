/* Alpha 8: shared forecasts, restrained battlefield feedback and bounded decisions. */
const tacticalIntents=new Map();
let tacticalTouchPlan=null;
const INDUSTRIAL_BLAST={radius:145,damage:42};
function shotDamageRaw(a,t,w,rounds,info) {
 const grudge=!a.enemy&&a.grudge?.room===S.room&&a.grudge.enemy===t.id?5:0,opening=!a.enemy&&w.ambush&&battle?.round===1?w.ambush:0;
 return Math.round((w.damage+opening)*(rounds>1?1.65:1))+(!a.enemy?(S.level-1)*2:0)+grudge+(info.high>0?3:0);
}
function shotDamage(a,t,w,rounds,info) {return Math.max(3,shotDamageRaw(a,t,w,rounds,info)-Math.max(0,armorSave(t)-w.pen));}

function attackForecast(a,t) {
 const w=weapon(a),info=shotInfo(a,t),rounds=w.melee?0:Math.min(w.burst||1,a.mag||0),directDamage=info.legal&&!shielded(t)?shotDamage(a,t,w,rounds,info):0,blastDamage=directDamage&&w.blast?Math.round(Math.round(w.damage*.4)*(t.enemy?1:kitGear(t).blastResist?.5:1)):0,damage=directDamage+blastDamage;
 const rangePenalty=Math.max(0,dist(a,t)-w.opt)*.055;
 const effects=[w.knock?'push '+w.knock:'',w.chain?'chain '+w.chain+' / 180 radius':'',w.suppress?'suppresses':'',w.shock?'shock -1 AP':'',w.burn?'burn '+w.burn:'',w.toxin?'toxin '+w.toxin:'',w.blast?'blast included / friendly fire':'',w.ambush&&battle?.round===1?'opening +'+w.ambush:''].filter(Boolean);
 return {...info,damage,directDamage,blastDamage,ap:w.ap,rounds,rangePenalty:Math.round(rangePenalty),penetration:w.pen,armorAbsorbed:Math.min(Math.max(0,armorSave(t)-w.pen),Math.max(0,shotDamageRaw(a,t,w,rounds,info)-3)),effects,
  ready:info.legal&&!shielded(t)&&(w.melee||rounds>0)&&a.hp>0&&battle?.phase==='player'&&a.ap>=w.ap&&!paths.size};
}
function hazardAt(a,p) {
 const hazards=[],gear=a.enemy?{}:kitGear(a);if(S.room==='walker'&&S.flags.walkerDrive&&p.y>1290&&p.x>1000&&p.x<1280&&!gear.windGuard)hazards.push('stride exhaust / 6 per activation');
 if(greaterWarning!==null&&Math.abs(p.y-greaterWarning)<40&&!(S.room==='heart'&&S.flags.heartCoolant))hazards.push('announced floor surge');
 if(bossWarning!==null&&Math.abs(p.y-bossWarning)<40&&!S.flags.bossCoolant)hazards.push('announced excavator surge');
 if(S.room==='furnace'&&!S.flags.steam&&Math.abs(p.y-880)<45&&Math.abs(p.x-820)<80)hazards.push('steam / 8 per activation');
 if(S.room==='garden'&&!S.flags.runoffIsolated&&!gear.toxin&&Math.abs(p.y-880)<55&&Math.abs(p.x-810)<70)hazards.push('chemical seep');
 if(S.room==='testannex'&&!S.flags.annexSafe&&!gear.shock&&p.y>820&&p.x>650)hazards.push('live induction / 4 + shock');
 for(const m of Object.values(UG.machines))if(m.room===S.room&&m.kind==='steam'&&S.flags[m.flag]&&dist(m,p)<125)hazards.push('active steam / 10 per activation');
 if(S.greater.run&&S.greater.run.seed%2===0&&S.room.endsWith('_1')&&!S.greater.run.control&&!gear.toxin&&Math.abs(p.y-room().platforms[0].y)<35)hazards.push('unisolated work-floor contamination');
 return [...new Set(hazards)];
}
function movementForecast(a,x,y,free=!battle) {
 const r=route(a,x,y);if(!r)return {legal:false,reason:'NO SAFE WALK, LADDER, JUMP OR DROP ROUTE',route:null};
 const cost=movementCost(a,r),end=r.points[r.points.length-1]||{x,y};
 const hazards=new Set();let prev=a;
 for(const n of r.points){for(let i=0;i<=4;i++)for(const h of hazardAt(a,{x:prev.x+(n.x-prev.x)*i/4,y:prev.y+(n.y-prev.y)*i/4}))hazards.add(h);prev=n;}
 const cover=covers().some(c=>Math.abs(c.y-end.y)<10&&Math.abs(c.x-end.x)<75);
 const reason=dashMode&&battle&&r.length>moveAllowance(a)*1.8?'DASH RANGE EXCEEDED':!free&&battle?.phase!=='player'?'WAIT FOR YOUR TURN':!free&&cost>a.ap?'INSUFFICIENT AP':!free&&paths.size?'CREW MOVING':a.hp<=0?'FIGHTER DOWN':null;
 return {legal:!reason,reason,route:r,cost:free?0:cost,cover,hazards:[...hazards],elevation:Math.round(a.y-end.y)};
}
function forecastText(a,t) {
 const f=attackForecast(a,t);if(!f.legal)return `${t.name.toUpperCase()}\n${f.reason} / no AP or ammunition spent`;
 return `${t.name.toUpperCase()} · ${t.hp} HP\n${f.chance}% · ${f.damage} damage on hit · ${f.ap} AP · ${f.rounds} rounds\n${f.cover?(weapon(a).ignoreCover?'COVER IGNORED':'COVER -28%'): 'OPEN / FLANKED'} · ${f.high>0?'HIGH +12%':f.high<0?'LOW -8%':'LEVEL'} · range -${f.rangePenalty}%\nPEN ${f.penetration} · armor absorbs ${f.armorAbsorbed}${f.effects.length?'\n'+f.effects.join(' · '):''}${!weapon(a).melee&&!f.rounds?'\nEMPTY MAGAZINE / RELOAD':''}${shielded(t)?'\nSHIELDED / disable machinery first':''}`;
}
function tacticalPreview() {
 const a=selected(),box=$('#targetInfo'),point=hover||tacticalTouchPoint();
 if(!battle||battle.phase!=='player'||modal){box.textContent='';return;}
 if(grenadeMode&&point){const throwY=point.y+15,flight=grenadeTrajectory(a,point.x,throwY),valid=flight.legal&&dist(a,{x:point.x,y:throwY})<=550;ctx.strokeStyle=valid?'#e7af73':'#f28a75';ctx.beginPath();ctx.arc(point.x,throwY,battle.shaped?155:140,0,Math.PI*2);ctx.stroke();for(let i=1;i<flight.points.length;i++)line(flight.points[i-1].x,flight.points[i-1].y,flight.points[i].x,flight.points[i].y,valid?'#e7af73':'#f28a75');box.textContent='FRAG / 2 AP · 1 GRENADE\n'+(!flight.legal?flight.reason:!valid?'OUT OF RANGE':'CLEAR THROW · SOLID STEEL SHIELDS BLAST')+'\n550 RANGE · DAMAGES ALLIES & COVER';return;}
 const barrel=point&&barrels().find(b=>Math.abs(b.x-point.x)<28&&Math.abs(b.y-25-point.y)<35);
 if(barrel){const legal=!weapon(a).melee&&shotInfo(a,barrel).legal;ctx.strokeStyle=legal?'#e7af73':'#e4836c';ctx.beginPath();ctx.arc(barrel.x,barrel.y,INDUSTRIAL_BLAST.radius,0,Math.PI*2);ctx.stroke();box.textContent=`INDUSTRIAL EXPLOSIVE / 1 AP · 1 ROUND\n${legal?'SHOOT TO DETONATE':'NO LEGAL SHOT'} · ${INDUSTRIAL_BLAST.radius} BLAST RADIUS\nUP TO ${INDUSTRIAL_BLAST.damage} DAMAGE · ALLIES & COVER AT RISK`;return;}
 const target=point?enemies().find(e=>enemyHit(e,point)):chosenTarget();
 if(target){const f=attackForecast(a,target);ctx.setLineDash([4,6]);line(a.x,a.y-25,target.x,target.y-25,f.legal?'#bddf86':'#e4836c');ctx.setLineDash([]);box.textContent=forecastText(a,target)+(industryTell(target)?'\n'+industryTell(target):'');return;}
 const p=point&&pointedFloor(point);if(!p){box.textContent='';return;}
 const m=movementForecast(a,point.x,p.y);if(!m.route){box.textContent=m.reason;return;}
 ctx.setLineDash([4,6]);let prev=a;for(const n of m.route.points){const arc=n.kind==='jump'?jumpArc({...a,x:prev.x,y:prev.y},n):null;if(arc){let last=prev;for(let i=1;i<=16;i++){const p=arcPoint(prev,n,i/16,arc.height);line(last.x,last.y-3,p.x,p.y-3,m.legal?'#8ed5cd':'#e4836c',2);last=p;}}else line(prev.x,prev.y-3,n.x,n.y-3,m.legal?'#8ed5cd':'#e4836c',2);prev=n;}ctx.setLineDash([]);
 ctx.strokeStyle=m.legal?'#8ed5cd':'#e4836c';ctx.beginPath();ctx.arc(prev.x,prev.y-5,13,0,Math.PI*2);ctx.stroke();
 box.textContent=`MOVE / ${m.cost} AP${m.route.points.some(p=>p.kind==='jump')?' · JUMP':''}${m.route.points.some(p=>p.kind==='drop')?' · DROP':''}${m.reason?' / '+m.reason:''}\n${m.cover?'COVER NEARBY / directional':'OPEN DESTINATION'} · ${m.elevation?'ELEVATION '+(m.elevation>0?'+':'')+m.elevation:'SAME LEVEL'}${m.hazards.length?'\nWARNING: '+m.hazards.join(' · '):''}`;
}
function tacticalSuppress() {
 const a=selected(),t=chosenTarget(),w=weapon(a);
 if(!t||!['smg','heavy','burst','disorder'].includes(a.weapon)||w.melee||a.mag<2||!shotInfo(a,t).legal||shielded(t)||!canAct(a,2)){notify('SUPPRESS / 2 AP, two rounds and a visible unshielded target. SMG, heavy or burst weapons only.');return false;}
 a.ap-=2;a.mag-=2;a.watch=false;a.dir=t.x>=a.x?1:-1;t.suppressed=true;world().enemies[t.id].suppressed=true;animate(a,'fire',.4);tracer(a,t,a.color);audioCue('fire',a.weapon);float(t,'SUPPRESSED / -1 AP','#8ed5cd');hud();afterOrder();return true;
}
function tacticalShootBarrel(a,b,reaction=false) {
 if(!b||!barrels().some(q=>q.id===b.id)||weapon(a).melee||!a.mag||!shotInfo(a,b).legal)return false;
 if(!reaction&&!canAct(a,1))return false;
 if(!reaction)a.ap--;a.mag--;animate(a,'fire',.4);audioCue('fire',a.weapon);tracer(a,b,a.color||'#e7af73');world().opened[b.id]=true;explode(b.x,b.y,INDUSTRIAL_BLAST.radius,INDUSTRIAL_BLAST.damage);hud();return true;
}
function tacticalEnemyDecision(e) {
 const w=weapon(e),targets=alive().map(a=>({a,info:shotInfo(e,a)}));
 if(!targets.length)return null;
 targets.sort((a,b)=>(b.info.legal?b.info.chance:0)+(1-b.a.hp/b.a.maxhp)*6-((a.info.legal?a.info.chance:0)+(1-a.a.hp/a.a.maxhp)*6));
 const target=targets[0].a,info=targets[0].info;
 // Heavy weapons hold a valid lane; moving would spend their firing AP.
 if(w.ap>=2&&e.ap>=w.ap&&info.legal)return {kind:'hold',target};
 const currentCover=shotInfo(target,e).cover;
 if(info.legal&&currentCover)return {kind:'hold',target};
 const candidates=[];const floor=floorAt(e);
 for(const c of covers().slice(0,6)){const x=c.x+(c.x>=target.x?28:-28);if(room().platforms.some(p=>Math.abs(p.y-c.y)<10&&x>=p.x+12&&x<=p.x+p.w-12))candidates.push({x,y:c.y});}
 if(floor&&e.role==='flanker'){
  candidates.push({x:clamp(target.x+(target.x>=e.x?80:-80),floor.x+12,floor.x+floor.w-12),y:floor.y});
 }
 let best=null;const baseline=(info.legal?info.chance:0)+(currentCover?22:0);
 for(const p of candidates.slice(0,7)){
  if(dist(e,p)<15||hazardAt(e,p).length)continue;
  const r=route(e,p.x,p.y);if(!r||r.length>200)continue;
  const shot=shotInfo({...e,...p},target),protectedSide=shotInfo(target,{...e,...p}).cover;
  const score=(shot.legal?shot.chance:0)+(protectedSide?22:0)+(e.hp<e.maxhp*.5&&protectedSide?12:0)-r.length*.025;
  if(score>baseline+8&&(!best||score>best.score))best={kind:protectedSide?'cover':'flank',target,position:p,route:r,score};
 }
 return best||{kind:info.legal?'hold':'advance',target};
}
function tacticalEnemy(e) {
 if(!['marksman','flanker','medic'].includes(e.role))return false;
 const decision=tacticalEnemyDecision(e);if(!decision)return false;
 const w=weapon(e);
 // Safe, infrequent industrial opportunities: at least two crew, no allied splash.
 if(!w.melee&&e.ap>=1){const b=barrels().find(b=>dist(e,b)>175&&alive().filter(a=>dist(a,b)<140).length>=2&&!enemies().some(a=>a.id!==e.id&&dist(a,b)<155)&&shotInfo(e,b).legal);if(b){tacticalIntents.set(e.id,'industrial shot');tacticalShootBarrel(e,b,true);return true;}}
 if(decision.kind==='advance')return false; // Retain the established ladder/pursuit fallback.
 if(decision.position&&e.ap>1&&w.ap===1){const origin={x:e.x,y:e.y};e.x=decision.position.x;e.y=decision.position.y;e.ap--;Object.assign(world().enemies[e.id],{x:e.x,y:e.y});fx.push({type:'move',...origin,tx:e.x,ty:e.y,color:'#e7af73',life:.65,max:.65});tacticalIntents.set(e.id,decision.kind);
  for(const a of alive())if(a.watch&&(a.mag||weapon(a).melee)&&shotInfo(a,e).legal){shoot(a,e,true);if(!battle||e.hp<=0)return true;}
 }else tacticalIntents.set(e.id,'hold firing lane');
 const target=alive().filter(t=>shotInfo(e,t).legal).sort((a,b)=>(shotInfo(e,b).chance+(1-b.hp/b.maxhp)*6)-(shotInfo(e,a).chance+(1-a.hp/a.maxhp)*6))[0];
 if(target&&e.ap>=w.ap)shoot(e,target,true);else float(e,'HOLD','#849582');return true;
}
function tacticalInteract(o) {
 if(o.type==='life'&&o.kind==='isolate'&&battle){if(!canAct(selected(),1))return true;selected().ap--;S.flags.annexSafe=true;audioCue('machine');notify('INDUCTION ISOLATED / 1 AP · live floor safe');hud();return true;}return false;
}
function tacticalDraw() {
 if(!battle)return;
 for(const c of covers()){outline(c.x-26,c.y-47,52,40,'#839d72');if(hover&&Math.abs(hover.x-c.x)<80)text('COVER '+(world().covers[c.id]??c.hp),c.x,c.y-65,'#a8c48c',10,'center');}
 for(const a of [...actors(),...combatEnemies()]){
  const labels=[a.watch?'WATCH':'',a.suppressed?'SUPPRESSED':'',a.shocked?'SHOCK':''].filter(Boolean);
  if(labels.length)text(labels.join(' / '),a.x,a.y-83,a.enemy?'#e7af73':'#8ed5cd',9,'center');
 }
}
function tacticalAction(id){if(id==='suppress'){tacticalSuppress();return true;}return false;}

function tacticalHitFeedback(a,t,w,rounds,info) {
 const absorbed=Math.min(Math.max(0,armorSave(t)-w.pen),Math.max(0,shotDamageRaw(a,t,w,rounds,info)-3));
 if(absorbed>0&&!shielded(t)){fx.push({type:'armor',x:t.x,y:t.y-30,life:.35,max:.35,color:'#b0bccc'});float({...t,y:t.y-22},'ARMOR −'+absorbed,'#9aaab8');}
 if(w.suppress&&!shielded(t))float({...t,y:t.y-20},'SUPPRESSED','#8ed5cd');
}

function tacticalTouchPoint() {
 const p=tacticalTouchPlan;if(!p||!battle||p.room!==S.room||p.actor!==selected().id||p.round!==battle.round)return null;
 return {x:p.x,y:p.y-4};
}
function tacticalTouchMove(a,x,y) {
 const old=tacticalTouchPlan;
 if(!old||!tacticalTouchPoint()||Math.hypot(old.x-x,old.y-y)>36){tacticalTouchPlan={x,y,room:S.room,actor:a.id,round:battle.round};hover={x,y:y-4};hud();return false;}
 tacticalTouchPlan=null;return moveTo(a,old.x,old.y,false);
}
