/* Alpha 9 shared deck sections/apertures and deterministic traversal primitives. */
const JUMP_GRAVITY=1100,TRAVEL_SPEED=240;
const pathMotion=new Map(),followWarnings=new Set();
function platformHoles(p){return (p.apertures||[]).filter(h=>!h.flag||S?.flags[h.flag]);}
function solidSections(p){let sections=[{x:p.x,w:p.w}];for(const h of platformHoles(p)){const left=h.x-h.width/2,right=h.x+h.width/2;sections=sections.flatMap(s=>{const end=s.x+s.w;if(right<=s.x||left>=end)return [s];return [...(left>s.x?[{x:s.x,w:left-s.x}]:[]),...(right<end?[{x:right,w:end-right}]:[])];});}return sections;}
function deckSolidAt(p,x,margin=0){return solidSections(p).some(s=>x>=s.x+margin&&x<=s.x+s.w-margin);}
function activeLadders(){return room().ladders.filter(l=>!l.gate||S.flags[l.gate]);}
function physicalSupport(a){return room().platforms.find(p=>Math.abs(p.y-a.y)<9&&deckSolidAt(p,a.x));}
function routeFooting(a){return physicalSupport(a)||room().platforms.find(p=>Math.abs(p.y-a.y)<9&&a.x>=p.x&&a.x<=p.x+p.w&&activeLadders().some(l=>Math.abs(l.x-a.x)<8&&(l.top===p.y||l.bottom===p.y)));}
function solidRayBlocked(a,b){
 if(physicalWallBlocked(a,b))return true;
 if(Math.abs(a.y-b.y)<.001)return false;
 for(const p of room().platforms){const t=(p.y-a.y)/(b.y-a.y);if(t<=.015||t>=.985)continue;const x=a.x+(b.x-a.x)*t;if(deckSolidAt(p,x,3))return true;}return false;
}
function physicalWallBlocked(a,b){for(const m of Object.values(UG.machines)){if(m.room!==S.room||m.kind!=='barrier'||S.flags[m.flag])continue;const left=m.x-12,right=m.x+12,top=m.y-100,bottom=m.y+5;if(a.x>=left&&a.x<=right&&a.y>=top&&a.y<=bottom&&Math.abs(b.x-m.x)>Math.abs(a.x-m.x))continue;let enter=0,leave=1,hit=true;for(const [v,d,lo,hi] of [[a.x,b.x-a.x,left,right],[a.y,b.y-a.y,top,bottom]]){if(Math.abs(d)<.00001){if(v<lo||v>hi){hit=false;break;}}else{const t1=(lo-v)/d,t2=(hi-v)/d;enter=Math.max(enter,Math.min(t1,t2));leave=Math.min(leave,Math.max(t1,t2));if(enter>leave){hit=false;break;}}}if(hit&&enter<=1&&leave>=0)return true;}return false;}

function jumpSpec(a){const kit=a.enemy?{}:kitGear(a),boost=['climbrig','hanging'].includes(a.gear)?40:0;return {velocity:420+boost+(a.id==='nim'?20:0),speed:TRAVEL_SPEED,gravity:JUMP_GRAVITY};}
function jumpArc(a,b){const s=jumpSpec(a),dy=b.y-a.y,disc=s.velocity*s.velocity+2*s.gravity*dy;if(disc<0)return null;const duration=(s.velocity+Math.sqrt(disc))/s.gravity;if(duration<=0||Math.abs(b.x-a.x)>s.speed*duration-6||Math.abs(b.x-a.x)>220)return null;return {duration,height:(s.velocity*duration+dy)/4};}
function arcPoint(a,b,t,height){return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t-4*height*t*(1-t)};}
function traversalArcClear(a,b,arc){let prev={x:a.x,y:a.y-3};for(let i=1;i<=24;i++){const p=arcPoint(a,b,i/24,arc.height),body={x:p.x,y:p.y-3};if(physicalWallBlocked(prev,body))return false;const head={x:p.x,y:p.y-48},prevHead={x:prev.x,y:prev.y-45};if(head.y<prevHead.y)for(const deck of room().platforms){if(deck.kind==='oneway')continue;if(prevHead.y>=deck.y&&head.y<=deck.y){const u=(deck.y-prevHead.y)/(head.y-prevHead.y),x=prevHead.x+(head.x-prevHead.x)*u;if(deckSolidAt(deck,x,2))return false;}}
 for(const deck of room().platforms){const upward=body.y<prev.y;if(upward&&deck.kind==='oneway')continue;if((prev.y-deck.y)*(body.y-deck.y)<=0&&Math.abs(prev.y-body.y)>.01){const u=(deck.y-prev.y)/(body.y-prev.y),x=prev.x+(body.x-prev.x)*u;if(i<24&&u>.01&&deckSolidAt(deck,x,4))return false;}}
 prev=body;}return true;}
function belowLanding(x,y,maxDrop=520){return room().platforms.filter(p=>p.y>y+25&&p.y-y<=maxDrop&&deckSolidAt(p,x,3)).sort((a,b)=>a.y-b.y)[0];}
function controlledDrop(){const a=selected(),p=physicalSupport(a)||routeFooting(a);if(!p){notify('Stand on a drop-through deck or a marked hatch.');return false;}
 const hole=platformHoles(p).find(h=>Math.abs(a.x-h.x)<h.width/2+38),allowed=p.kind==='oneway'||hole;
 if(!allowed){notify('Solid steel. Use a deck edge or a real hatch.');return false;}
 const x=hole?hole.x:a.x,below=belowLanding(x,p.y);if(!below){notify('No safe observed landing below this opening.');return false;}
 if(battle)return moveTo(a,x,below.y,false);
 const m=motionMemory.get(a.id)||{};m.dropDeck=p.id;m.dropUntil=clock+1.2;m.fallStart=a.y;m.vx=0;motionMemory.set(a.id,m);a.x=x;a.y=p.y+10;a.vy=45;paths.delete(a.id);return true;
}
function freeJump(){if(!S||modal)return false;if(battle){notify('Tactical jump: select a reachable floor; its route preview includes the leap.');return false;}
 const a=selected(),m=motionMemory.get(a.id)||{};m.jumpUntil=clock+.14;motionMemory.set(a.id,m);if(physicalSupport(a)||clock-(m.groundedAt??-10)<.12){a.vy=-jumpSpec(a).velocity;m.jumpUntil=0;m.fallStart=a.y;}if(!transitActors.has(a.id))paths.delete(a.id);return true;}
function physicalMovement(dt){
 if(transitActors.size)return;const a=selected(),m=motionMemory.get(a.id)||{};motionMemory.set(a.id,m);if(!a.hp){cycleCrew();return;}
 const dx=(keys.d||keys.ArrowRight?1:0)-(keys.a||keys.ArrowLeft?1:0),dy=(keys.s||keys.ArrowDown?1:0)-(keys.w||keys.ArrowUp?1:0);
 if((dx||dy)&&paths.has(a.id)){paths.delete(a.id);pathMotion.delete(a.id);}if(paths.has(a.id)){followCrew();detectContact();return;}
 let grounded=physicalSupport(a);if(grounded)m.groundedAt=clock;
 if(m.jumpUntil>clock&&(grounded||clock-(m.groundedAt??-10)<.12)){a.vy=-jumpSpec(a).velocity;m.jumpUntil=0;m.fallStart=a.y;grounded=null;}
 const ladder=clock<(m.detachUntil||0)?null:activeLadders().filter(l=>l.type!=='lift'&&Math.abs(a.x-l.x)<46&&a.y>=l.top-10&&a.y<=l.bottom+10).sort((l,r)=>Math.abs(a.x-l.x)-Math.abs(a.x-r.x))[0];
 if(ladder&&dy){a.x=ladder.x;a.y=clamp(a.y+dy*210*dt,ladder.top,ladder.bottom);a.vy=0;m.vx=0;
  if(a.y===ladder.top&&dy<0){const p=room().platforms.find(p=>p.y===ladder.top&&a.x>=p.x&&a.x<=p.x+p.w),h=p&&platformHoles(p).find(h=>Math.abs(h.x-a.x)<h.width/2);if(h)a.x=clamp(h.x+h.width/2+12,p.x+8,p.x+p.w-8);m.detachUntil=clock+.3;}
  if(a.y===ladder.bottom&&dy>0)m.detachUntil=clock+.2;
 }else{
  const target=dx*TRAVEL_SPEED;m.vx=(m.vx||0)+clamp(target-(m.vx||0),-1800*dt,1800*dt);if(!dx)m.vx*=Math.exp(-(grounded?12:3)*dt);
  let nextX=clamp(a.x+m.vx*dt,18,room().w-18);
  if(grounded&&Math.abs(m.vx)>80&&a.vy>=0){const hole=platformHoles(grounded).find(h=>Math.abs(nextX-h.x)<h.width/2+6);const cover=covers().find(c=>Math.abs(c.y-a.y)<8&&Math.abs(nextX-c.x)<35);if(hole||cover){a.vy=-(cover?300:210);m.fallStart=a.y;}}
  if(!physicalWallBlocked({x:a.x,y:a.y-25},{x:nextX,y:a.y-25}))a.x=nextX;if(dx){a.dir=dx;walking+=dt;}
  const oldY=a.y,oldHead=oldY-48;a.vy=(a.vy||0)+JUMP_GRAVITY*dt;let nextY=a.y+a.vy*dt;
  if(a.vy<0)for(const p of room().platforms)if(p.kind!=='oneway'&&oldHead>=p.y&&nextY-48<=p.y&&deckSolidAt(p,a.x,2)){nextY=p.y+48;a.vy=0;break;}
  a.y=nextY;
  if(a.vy>=0){const landing=room().platforms.filter(p=>oldY<=p.y+4&&a.y>=p.y&&deckSolidAt(p,a.x)&&!(m.dropDeck===p.id&&clock<(m.dropUntil||0))).sort((p,q)=>p.y-q.y)[0];if(landing){a.y=landing.y;a.vy=0;m.groundedAt=clock;if(m.fallStart&&a.y-m.fallStart>540){a.hp=Math.max(1,a.hp-8);float(a,'HARD LANDING / -8');}m.fallStart=a.y;m.dropDeck=null;}}
  if(a.y>room().h-10){const safe=room().platforms.filter(p=>deckSolidAt(p,a.x)).sort((p,q)=>q.y-p.y)[0]||room().platforms[0];a.y=safe.y;a.x=clamp(a.x,safe.x+12,safe.x+safe.w-12);a.vy=0;m.vx=0;notify('Recovered footing on the lower maintenance deck.');}
 }
 conveyor(a,55*dt);surviveTick(dt);if(S.room==='furnace'&&!S.flags.steam&&dist(a,{x:820,y:880})<65)a.hp=Math.max(1,a.hp-9*dt);followCrew();detectContact();
}
function physicalTraversalEdges(nodes,edges,ps,actor){
 // Supported drops: edges of decks, real hatches, and one-way maintenance shelves.
 for(const p of ps){const starts=[...(p.x>24?[[p.x+12,p.x-18]]:[]),...(p.x+p.w<room().w-24?[[p.x+p.w-12,p.x+p.w+18]]:[]),...platformHoles(p).map(h=>[h.x-h.width/2-12,h.x]),...(p.kind==='oneway'?[[p.x+p.w/2,p.x+p.w/2]]:[])];for(const [fromX,x] of starts){const q=belowLanding(x,p.y);if(!q)continue;const i=nodes.length;nodes.push({x:fromX,y:p.y,p:p.id},{x,y:q.y,p:q.id,kind:'drop'});edges.push([i,i+1,'oneway']);}}
 for(const p of ps)for(const q of ps){if(p===q||Math.abs(p.y-q.y)>100)continue;
  let ax,bx;if(p.x+p.w<=q.x){ax=p.x+p.w-12;bx=q.x+12;}else if(q.x+q.w<=p.x){ax=p.x+12;bx=q.x+q.w-12;}else if(q.y<p.y){ax=bx=(Math.max(p.x,q.x)+Math.min(p.x+p.w,q.x+q.w))/2;}else continue;
  const a={...actor,x:ax,y:p.y},b={x:bx,y:q.y},arc=jumpArc(a,b);if(!arc||!traversalArcClear(a,b,arc))continue;const i=nodes.length;nodes.push({x:ax,y:p.y,p:p.id},{x:bx,y:q.y,p:q.id,kind:'jump'});edges.push([i,i+1,'oneway']);
 }
}
function physicalUpdatePaths(dt){for(const a of actors()){
 let vault=pathMotion.get(a.id);if(vault?.vault){vault.t=Math.min(1,vault.t+dt/vault.duration);Object.assign(a,arcPoint(vault.from,vault.to,vault.t,vault.height));a.vy=vault.t<.5?-90:90;if(vault.t>=1){a.vy=0;pathMotion.delete(a.id);}continue;}
 const path=paths.get(a.id);if(!path?.length){paths.delete(a.id);pathMotion.delete(a.id);transitActors.delete(a.id);continue;}const p=path[0];
 if(!transitActors.has(a.id)&&['jump','drop'].includes(p.kind)){
  let m=pathMotion.get(a.id);if(!m){const from={x:a.x,y:a.y},to={x:p.x,y:p.y},arc=p.kind==='jump'?jumpArc(a,to):{duration:Math.max(.25,Math.sqrt(Math.abs(to.y-from.y)*2/JUMP_GRAVITY)),height:0};if(!arc){paths.delete(a.id);notify(a.name+' cannot make that leap with the current kit.');continue;}m={from,to,...arc,t:0};pathMotion.set(a.id,m);}
  m.t=Math.min(1,m.t+dt/m.duration);const pos=arcPoint(m.from,m.to,m.t,m.height);if(p.kind==='drop')pos.y=m.from.y+(m.to.y-m.from.y)*Math.pow(Math.max(0,(m.t-(m.from.x===m.to.x?0:.4)))/(m.from.x===m.to.x?1:.6),2);a.x=pos.x;a.y=pos.y;a.vy=m.t<.5?-100:100;if(m.t>=1){a.x=p.x;a.y=p.y;a.vy=0;path.shift();pathMotion.delete(a.id);}continue;
 }
 if(!transitActors.has(a.id)&&Math.abs(p.y-a.y)<2){const deck=physicalSupport(a),dir=Math.sign(p.x-a.x);if(deck&&dir){const obstacle=platformHoles(deck).map(h=>({x:h.x,half:h.width/2})).concat(covers().filter(c=>Math.abs(c.y-a.y)<8).map(c=>({x:c.x,half:30}))).find(h=>(h.x-a.x)*dir>h.half&&(h.x-a.x)*dir<h.half+22&&(p.x-h.x)*dir>h.half+12);if(obstacle){const from={x:a.x,y:a.y},to={x:obstacle.x+dir*(obstacle.half+14),y:a.y},height=30;if(traversalArcClear(a,to,{height})){pathMotion.set(a.id,{vault:true,from,to,height,duration:Math.abs(to.x-from.x)/TRAVEL_SPEED,t:0});continue;}}}}
 const d=dist(a,p),step=TRAVEL_SPEED*dt;if(d<=step){a.x=p.x;a.y=p.y;path.shift();}else{a.dir=p.x>=a.x?1:-1;a.x+=(p.x-a.x)/d*step;a.y+=(p.y-a.y)/d*step;}a.vy=0;
 }}
function physicalFollow(){const a=selected(),p=physicalSupport(a);if(!p)return;
 for(const b of alive()){if(b===a||b.watch||paths.has(b.id))continue;if(!routeFooting(b)){const landing=belowLanding(b.x,b.y,600);if(landing){paths.set(b.id,[{x:b.x,y:landing.y,kind:'drop'}]);continue;}}if(dist(a,b)<80)continue;const tx=clamp(a.x-(actors().indexOf(b)+1)*32*(a.dir||1),p.x+12,p.x+p.w-12),r=route(b,tx,a.y);
  if(r){paths.set(b.id,r.points);followWarnings.delete(b.id);}else if(!followWarnings.has(b.id)){notify(b.name+' cannot follow this crossing yet. Use a ladder, winch, or regroup at a shelter.');followWarnings.add(b.id);}
 }
}
function grenadeTrajectory(a,x,y){const start={x:a.x,y:a.y-28},end={x,y:y-20},height=Math.min(140,55+Math.abs(x-a.x)*.12);let prev=start;const points=[start];for(let i=1;i<=24;i++){const p=arcPoint(start,end,i/24,height);if(solidRayBlocked(prev,p))return {legal:false,points:[...points,p],reason:'THROW BLOCKED BY SOLID GEOMETRY'};points.push(p);prev=p;}return {legal:true,points};}
