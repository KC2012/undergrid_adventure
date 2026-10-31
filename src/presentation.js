// Weapon line paths adapted from original Undergrid canonicalWeaponPath.
// Reference is retained unchanged. This module has no original skirmish dependencies.
const WEAPON_ART={pistol:'PISTOL',rifle:'CARBINE',shotgun:'SHOTGUN',sniper:'SNIPER',smg:'SMG',handcannon:'HAND_CANNON',needle:'NEEDLE_PISTOL',laser:'LASER_RIFLE',arc:'ARC_GUN',flame:'FLAME_PROJECTOR',launcher:'LAUNCHER',plasma:'PLASMA_GUN',heavy:'HEAVY',chainblade:'CHAINBLADE',railgun:'MARKSMAN_RIFLE',burst:'BURST_RIFLE',arcblade:'ARC_BLADE'};
const animations=new Map();
function animate(a,action,duration=.6){animations.set(a.id,{action,start:clock,till:clock+duration,room:S.room});}
function appearance(a){return {weapon:a.weapon||null,armor:a.enemy?(a.armor>=7?'carapace':a.armor>=4?'plate':a.armor>=2?'mesh':'leathers'):(a.armorKey||'leathers'),gear:a.enemy?(a.type==='chemist'?'respirator':a.type==='medic'?'medrig':a.type==='shocker'?'shockground':'none'):(a.gear||'none'),mod:a.mod||'none',identity:a.id||a.type||'resident',color:a.color||'#e7af73'};}
 function weaponPath(p,k){
  if(UG.relics?.[k]?.kind==='weapon'){const base={funeral:'shotgun',deadair:'sniper',mercy:'arc',disorder:'smg',widow:'handcannon',furnacekey:'flame'}[k];weaponPath(p,base);if(k==='funeral'){p.rect(65,-14,25,25);p.moveTo(90,-14);p.lineTo(104,-20);p.lineTo(104,17);p.lineTo(90,11);}if(k==='deadair'){p.rect(83,-10,30,12);p.rect(22,-25,34,7);}if(k==='mercy'){for(let x=45;x<90;x+=14){p.moveTo(x+8,-4);p.arc(x,-4,8,0,Math.PI*2);}}if(k==='disorder'){p.rect(20,4,35,16);p.moveTo(30,-18);p.lineTo(60,-24);p.lineTo(65,-18);}if(k==='widow'){p.moveTo(57,-4);p.arc(47,-4,10,0,Math.PI*2);p.rect(62,-17,32,5);}if(k==='furnacekey'){p.rect(10,7,21,25);p.rect(65,-19,26,8);}return true;}
  const v=WEAPON_ART[k];if(!v)return false;const L=(p,a,b,c,d)=>{p.moveTo(a,b);p.lineTo(c,d)},R=(p,a,b,c,d)=>p.rect(a,b,c,d),C=(p,x,y,r)=>{p.moveTo(x+r,y);p.arc(x,y,r,0,Math.PI*2)},P=(p,pts,closed=false)=>{p.moveTo(...pts[0]);for(const pt of pts.slice(1))p.lineTo(...pt);if(closed)p.closePath()};
  // SIDEARMS // grip is always near x 20; muzzle points right.
  if(v==='PISTOL'){L(p,6,0,58,0);L(p,15,-7,43,-7);L(p,22,1,17,18);L(p,48,0,55,5)}
  else if(v==='AUTOPISTOL'){L(p,5,0,66,0);R(p,14,-9,39,11);L(p,25,2,20,19);L(p,49,-9,60,-9)}
  else if(v==='HAND_CANNON'){L(p,4,0,82,0);R(p,12,-13,48,15);L(p,26,2,19,20);L(p,61,-6,83,-6)}
  else if(v==='MACHINE_PISTOL'){R(p,8,-12,54,15);L(p,20,3,14,20);L(p,48,3,55,21);L(p,14,-17,59,-17);L(p,62,-4,86,-4)}
  else if(v==='NEEDLE_PISTOL'){R(p,10,-9,34,12);L(p,20,3,15,19);L(p,44,-3,92,-3);P(p,[[78,-7],[94,-3],[78,1]])}
  else if(v==='LASER_PISTOL'){R(p,9,-11,42,13);L(p,21,2,16,19);L(p,51,-4,84,-4);P(p,[[76,-9],[91,-4],[76,1]])}
  // BASIC MELEE // heavy scavenged pipe, wrapped grip, crude welded studs.
  else if(v==='PIPE_CLUB'){
   L(p,12.5,5,40,-35);
   L(p,35,-22.5,40,-17.5);
   L(p,42.5,-30,40,-35);
   L(p,42.5,-30,15,7.5);
   L(p,40,-27.5,47.5,-25);
   L(p,37.5,-25,32.5,-35);
  }
  // RIFLES // common stock, receiver and grip; each subtype has one decisive profile.
  else if(['SMG','CARBINE','BURST_RIFLE','RIFLE','LASER_RIFLE','MARKSMAN_RIFLE','SNIPER'].includes(v)){
   P(p,[[3,0],[15,12],[18,2]]);L(p,14,0,v==='SMG'?69:v==='CARBINE'?82:v==='BURST_RIFLE'?91:97,0);
   R(p,26,-11,v==='SMG'?35:43,13);L(p,44,2,38,19);
   if(v==='SMG'){L(p,49,2,55,21);L(p,24,-16,52,-16)}
   if(v==='CARBINE'){L(p,65,0,77,-8);L(p,70,-8,84,-8)}
   if(v==='BURST_RIFLE'){L(p,67,-7,88,-7);L(p,61,2,68,19);P(p,[[88,0],[97,-7],[97,0]])}
   if(v==='RIFLE'){L(p,64,2,70,15);L(p,77,0,91,-4)}
   if(v==='LASER_RIFLE'){L(p,67,-7,98,-7);C(p,91,-3,4)}
   if(v==='MARKSMAN_RIFLE'){R(p,33,-20,38,6);L(p,72,-17,82,-17);L(p,81,0,98,-5)}
   if(v==='SNIPER'){R(p,30,-21,46,6);L(p,76,-18,89,-18);L(p,82,0,99,-5);L(p,92,0,100,0)}
  }
  else if(v==='SHOTGUN'){P(p,[[3,0],[14,11],[18,1]]);L(p,15,-3,96,-3);L(p,29,5,90,5);L(p,82,-3,99,1)}
  else if(v==='COMBAT_SHOTGUN'){P(p,[[3,0],[14,11],[18,1]]);L(p,15,0,98,0);L(p,24,9,94,9);R(p,31,-13,38,11);L(p,48,1,42,20)}
  // LAUNCHERS // the rocket launcher is one rectangular shoulder tube in every view.
  else if(v==='LAUNCHER'){P(p,[[3,0],[14,11],[18,1]]);L(p,14,0,90,0);L(p,25,-12,89,-12);p.moveTo(90,-12);p.arc(90,-6,9,-Math.PI/2,Math.PI/2);L(p,46,1,40,18)}
  else if(v==='ROCKET_LAUNCHER'){R(p,12,-14,78,28);P(p,[[12,-14],[3,-24],[3,-14]]);P(p,[[12,14],[3,24],[3,14]]);L(p,35,14,28,24);P(p,[[90,-14],[100,0],[90,14]])}
  // SPECIAL / HEAVY FIREARMS.
  else if(['FLAME_PROJECTOR','ARC_GUN','FUSION_GUN','PLASMA_GUN','HEAVY','ROTARY_GUN','HEAVY_LASER','HEAVY_PLASMA'].includes(v)){
   P(p,[[3,0],[14,12],[18,2]]);R(p,13,-15,v==='ROTARY_GUN'?45:58,21);L(p,38,6,31,23);
   if(v==='FLAME_PROJECTOR'){p.moveTo(72,-11);p.arc(72,-3,11,-Math.PI/2,Math.PI/2);P(p,[[77,-13],[91,-21],[86,-9]]);L(p,82,-2,99,-2)}
   else if(v==='ARC_GUN'){P(p,[[66,-13],[74,-22],[82,-12],[90,-21],[98,-10]]);L(p,71,0,99,0)}
   else if(v==='FUSION_GUN'){C(p,80,-4,14);C(p,80,-4,6);L(p,71,-18,87,-25)}
   else if(v==='PLASMA_GUN'){C(p,82,-4,12);C(p,82,-4,5);L(p,55,-16,70,-23);L(p,71,0,99,0)}
   else if(v==='HEAVY'){R(p,22,-22,27,7);L(p,71,0,99,0);L(p,76,-7,99,-7);L(p,62,6,69,23)}
   else if(v==='ROTARY_GUN'){C(p,67,-3,8);for(let y=-10;y<=4;y+=7)L(p,67,y,100,y);L(p,55,6,48,23)}
   else if(v==='HEAVY_LASER'){L(p,70,-11,100,-11);L(p,72,0,100,0);P(p,[[92,-16],[100,-11],[92,-6]])}
   else if(v==='HEAVY_PLASMA'){C(p,82,-4,15);C(p,82,-4,7);C(p,45,-17,6);L(p,69,0,99,0)}
  }
  // MELEE // same silhouette and angle in inventory and hand.
  else if(v==='KNIFE'){P(p,[[5,12],[25,5],[78,-12],[63,3],[25,9]],true);L(p,19,1,30,15)}
  else if(v==='SWORD'){L(p,6,14,24,7);L(p,17,0,31,16);P(p,[[24,7],[84,-15],[98,-24],[90,-9],[27,12]],true)}
  else if(v==='HATCHET'){L(p,13,19,55,-12);P(p,[[47,-19],[79,-18],[91,-5],[61,3],[47,-6]],true)}
  else if(v==='AXE'){L(p,9,21,62,-14);P(p,[[45,-24],[84,-22],[98,-5],[67,5],[45,-5]],true);L(p,70,-18,79,1)}
  else if(v==='SHOCK_BATON'){L(p,9,18,88,-17);C(p,89,-17,7);L(p,18,13,29,22)}
  else if(v==='CHAINBLADE'){P(p,[[5,15],[88,-18],[98,-9],[18,20]],true);for(let x=30;x<88;x+=12)L(p,x,-5,x+5,-15)}
  else if(v==='ARC_BLADE'){L(p,5,16,24,8);R(p,18,2,10,12);P(p,[[26,8],[82,-16],[98,-29],[92,-9],[30,14]],true);P(p,[[48,-2],[58,3],[68,-8],[78,-3]])}
  else if(v==='MAUL'){L(p,50,24,50,-10);R(p,20,-23,24,18);R(p,56,-23,24,18)}
  else if(v==='GREAT_HAMMER'){L(p,50,25,50,-13);R(p,5,-30,36,22);R(p,59,-30,36,22);L(p,41,-13,59,-13)}
  else if(v==='ROCKSAW'){R(p,6,-2,25,15);L(p,31,5,45,-3);C(p,70,-8,19);C(p,70,-8,6);for(let i=0;i<12;i++){let a=i*Math.PI*2/12;L(p,70+Math.cos(a)*19,-8+Math.sin(a)*19,70+Math.cos(a)*25,-8+Math.sin(a)*25)}}
  else if(v==='INDUSTRIAL_CUTTER'){L(p,5,18,43,0);L(p,5,-14,43,0);C(p,43,0,6);p.moveTo(49,-3);p.quadraticCurveTo(72,-30,99,-18);p.quadraticCurveTo(78,-5,51,2);p.moveTo(49,3);p.quadraticCurveTo(73,30,99,18);p.quadraticCurveTo(78,5,51,-2)}
  else return false;
  return true;
 }
function drawHeld(g,id,x,y,scale=.46){if(!id)return;g.save();g.translate(x,y);g.scale(scale,scale);g.beginPath();weaponPath(g,id);g.lineWidth=1.55/scale;g.stroke();g.restore();}
function bodyArmor(g,id){
 if(id==='celebration'){bodyArmor(g,'carapace');g.strokeRect(-20,-43,40,9);g.strokeRect(-9,-13,18,10);return;}
 if(id==='sunday'){bodyArmor(g,'ghost');g.beginPath();g.moveTo(-10,-35);g.lineTo(0,-20);g.lineTo(8,-35);g.moveTo(-13,-8);g.lineTo(-16,0);g.lineTo(10,-2);g.stroke();return;}
 const line=(a,b,c,d)=>{g.beginPath();g.moveTo(a,b);g.lineTo(c,d);g.stroke()},box=(x,y,w,h)=>{g.fillRect(x,y,w,h);g.strokeRect(x,y,w,h)};
 if(id==='leathers'){box(-5,-35,10,21);line(-5,-32,5,-20);line(-5,-26,5,-26);}
 if(id==='mesh'){box(-7,-36,14,23);for(let y=-33;y<-15;y+=5)line(-5,y,5,y+3);box(-10,-35,5,7);}
 if(id==='plate'){box(-9,-37,18,25);box(-15,-39,8,10);box(7,-39,8,10);box(-7,-24,14,5);}
 if(id==='ceramic'){g.beginPath();g.moveTo(-8,-37);g.lineTo(8,-37);g.lineTo(11,-5);g.lineTo(-11,-5);g.closePath();g.fill();g.stroke();line(-7,-30,7,-30);line(-8,-20,8,-20);box(-12,-35,5,12);}
 if(id==='ghost'){g.beginPath();g.moveTo(-6,-38);g.lineTo(4,-38);g.lineTo(10,-8);g.lineTo(-15,-3);g.lineTo(-10,-25);g.closePath();g.fill();g.stroke();line(-8,-34,-3,-10);}
 if(id==='carapace'){box(-11,-39,22,27);box(-17,-41,9,13);box(8,-41,9,13);box(-5,-35,10,10);line(-13,-20,-16,-5);line(13,-20,16,-5);box(-13,-9,9,8);box(5,-9,9,8);}
}
function headAndIdentity(g,a,model){
 g.beginPath();g.arc(0,-45,6,0,Math.PI*2);g.fill();g.stroke();
 if(['plate','carapace','ceramic'].includes(model.armor)){g.strokeRect(-7,-52,14,8);g.beginPath();g.moveTo(-7,-48);g.lineTo(7,-48);g.stroke();}
 else {g.beginPath();g.moveTo(-6,-49);g.lineTo(-2,-53);g.lineTo(6,-51);g.stroke();}
 // Identity accents survive armor/weapon changes: courier scarf, engineer lenses.
 if(a.id==='vera'){g.beginPath();g.moveTo(-5,-38);g.lineTo(-19,-32);g.lineTo(-11,-40);g.stroke();}
 if(a.id==='orren'){g.strokeRect(-5,-48,4,3);g.strokeRect(1,-48,4,3);g.strokeRect(-19,-30,6,18);}
 if(a.id==='rook'){g.beginPath();g.moveTo(-5,-51);g.lineTo(1,-55);g.lineTo(5,-51);g.stroke();}
 if(a.id==='sable'){g.strokeRect(-7,-52,14,4);g.beginPath();g.moveTo(-1,-52);g.lineTo(-1,-47);g.moveTo(-4,-50);g.lineTo(2,-50);g.stroke();}
 if(a.id==='nim'){g.beginPath();g.moveTo(-9,-48);g.lineTo(-5,-57);g.lineTo(7,-55);g.lineTo(10,-47);g.stroke();g.strokeRect(-18,-32,5,14);}
 if(a.id==='brass'){g.strokeRect(-8,-52,21,4);g.strokeRect(5,-34,6,7);}
 if(a.id==='ilex'){g.strokeRect(-9,-54,18,8);g.strokeRect(-22,-36,8,24);g.beginPath();g.moveTo(-4,-22);g.lineTo(9,-36);g.stroke();}
 if(a.id==='latch'){g.strokeRect(-7,-52,14,13);g.strokeRect(2,-49,6,4);}
}
function drawGear(g,id){
 if(id==='baffle'){g.strokeRect(-16,-40,32,7);g.beginPath();g.arc(0,-43,16,0,Math.PI);g.stroke();return;}
 if(id==='relaySpool'){for(let i=0;i<4;i++)g.strokeRect(-24,-42+i*6,13,3);g.beginPath();g.moveTo(-17,-18);g.lineTo(7,-30);g.stroke();return;}
 if(id==='walkingRig'){drawGear(g,'climbrig');g.strokeRect(-27,-39,9,26);g.beginPath();g.moveTo(-22,-13);g.lineTo(-27,0);g.lineTo(-19,-3);g.stroke();return;}
 if(id==='none')return;
 if(id==='hanging'){drawGear(g,'climbrig');g.strokeRect(-27,-40,7,28);g.beginPath();g.arc(-24,-25,7,0,Math.PI*2);g.stroke();return;}
 if(id==='forest'){g.setLineDash([2,3]);g.strokeRect(-18,-55,36,53);g.setLineDash([]);return;}
 const line=(a,b,c,d)=>{g.beginPath();g.moveTo(a,b);g.lineTo(c,d);g.stroke()};
 if(id==='respirator'){g.strokeRect(1,-45,10,8);g.strokeRect(9,-43,5,4);g.beginPath();g.moveTo(3,-37);g.quadraticCurveTo(-9,-25,-13,-34);g.stroke();g.strokeRect(-17,-36,7,18);}
 if(id==='climbrig'){g.strokeRect(-19,-39,9,23);g.beginPath();g.arc(-15,-28,3,0,Math.PI*2);g.stroke();line(-9,-34,7,-16);line(7,-34,-7,-16);line(-16,-40,-19,-49);}
 if(id==='targeter'){line(4,-48,12,-48);g.strokeRect(10,-51,6,5);line(-3,-38,5,-31);}
 if(id==='surveykit'){g.strokeRect(-22,-34,12,25);g.strokeRect(9,-49,12,6);g.beginPath();g.moveTo(10,-43);g.lineTo(-12,-28);g.stroke();}if(id==='blastliner'){g.strokeRect(-13,-34,26,15);line(-13,-20,13,-20);line(-9,-33,-9,-22);line(9,-33,9,-22);}
 if(id==='medrig'){g.strokeRect(-19,-32,10,17);line(-14,-29,-14,-20);line(-18,-25,-10,-25);}
 if(id==='shockground'){for(let y=-35;y<-17;y+=5){line(-16,y,-9,y+3);}line(-12,-20,-14,0);line(-18,0,-10,0);}
 if(id==='salvager'){g.strokeRect(-20,-36,9,24);line(-22,-32,-25,-23);line(-25,-23,-21,-17);line(-11,-35,-8,-44);}
}
function drawFighterModel(g,a,options={}){
 const model=appearance(a),t=options.time??clock,pose=options.pose||{},dir=options.dir??a.dir??1;
 const state=options.preview?null:animations.get(a.id),event=state&&state.room===S?.room&&state.till>t?state:null;
 const moving=pose.walk??(!options.preview&&!transitActors.has(a.id)&&(paths.has(a.id)||a===selected()&&(keys.a||keys.d||keys.ArrowLeft||keys.ArrowRight)));
 const climbing=pose.climb??(!options.preview&&!transitActors.has(a.id)&&((paths.get(a.id)?.[0]&&!['drop','jump'].includes(paths.get(a.id)[0].kind)&&Math.abs(paths.get(a.id)[0].y-a.y)>2)||(a===selected()&&(keys.w||keys.s)&&room().ladders.some(l=>Math.abs(l.x-a.x)<25&&a.y>=l.top&&a.y<=l.bottom))));
 const phase=Math.sin(t*12),walk=moving?phase*5:0,recoil=event?.action==='fire'?(1-(t-event.start)/.4)*({funeral:6,deadair:2,mercy:4,disorder:5,widow:8,furnacekey:1}[model.weapon]||3):0;
 g.save();g.scale(dir,1);g.lineWidth=1.5;g.strokeStyle=options.color||a.color||'#e7af73';g.fillStyle='#112019';g.lineJoin='miter';g.lineCap='square';
 if(a.hp===0&&!options.preview){g.translate(-10,-4);g.rotate(-Math.PI/2);}
 if(!options.preview&&Math.abs(a.vy||0)>30)g.rotate(a.vy<0?-.07:.05);
 if(event?.action==='hurt'){g.strokeStyle='#f4dfbd';}if(event?.action==='hurt')g.translate(Math.sin((t-event.start)*45)*2,0);
 g.translate(0,options.preview?0:Math.sin(t*2+(a.id?.length||0))*.5);
 if(climbing){g.beginPath();g.moveTo(-3,-15);g.lineTo(-9,-3+phase*4);g.moveTo(3,-15);g.lineTo(9,-3-phase*4);g.stroke();}
 else {g.beginPath();g.moveTo(-3,-14);g.lineTo(-6+walk,-7);g.lineTo(-9+walk,0);g.moveTo(3,-14);g.lineTo(6-walk,-7);g.lineTo(10-walk,0);g.stroke();}
 g.strokeRect(-11+walk,-2,6,3);g.strokeRect(5-walk,-2,7,3);bodyArmor(g,model.armor);headAndIdentity(g,a,model);drawGear(g,model.gear);
 if(model.weapon){g.save();g.translate(-Math.max(0,recoil),0);if(climbing){g.translate(-12,-12);g.rotate(-1.15);}else if(event?.action==='reload'){g.translate(4,-15);g.rotate(-.45);}
 const sidearm=['pistol','handcannon','needle','widow'].includes(model.weapon),heavy=UG.weapons[model.weapon].ap===2;g.beginPath();g.moveTo(1,-31);g.lineTo(sidearm?10:heavy?6:12,sidearm?-29:heavy?-18:-26);g.lineTo(20,-28);if(!sidearm){g.moveTo(-4,-31);g.lineTo(heavy?16:22,-20);g.lineTo(heavy?36:30,-28);}g.stroke();drawHeld(g,model.weapon,9,-27,UG.weapons[model.weapon].ap===2?.52:.46);
 if(model.mod==='resonator'){for(let x=22;x<42;x+=5)g.strokeRect(x,-35,2,12);}if(model.mod==='suture'){g.strokeRect(18,-22,24,4);g.strokeRect(22,-18,5,8);}
 if(model.mod==='damped'){g.strokeRect(25,-23,18,5);}if(model.mod==='deepfeed'){g.strokeRect(18,-20,7,12);g.strokeRect(23,-43,10,3);}if(model.mod==='focused'){g.strokeRect(20,-43,20,4);g.strokeRect(38,-45,4,8);}
 if(model.mod==='sighted')g.strokeRect(24,-41,13,4);if(model.mod==='hot'){for(let x=26;x<38;x+=4){g.beginPath();g.moveTo(x,-33);g.lineTo(x+2,-28);g.stroke();}}if(model.mod==='piercer')g.strokeRect(22,-18,4,12);
 if(event?.action==='reload'){g.strokeRect(19,-12,4,8);g.beginPath();g.moveTo(3,-28);g.lineTo(19,-8);g.stroke();}g.restore();
 }else{g.beginPath();g.moveTo(-7,-31);g.lineTo(-11,-16);g.moveTo(7,-31);g.lineTo(11,-17);g.stroke();}
 if(event?.action==='fire'&&!UG.weapons[model.weapon]?.melee){const energy=['laser','plasma','arc','mercy'].includes(model.weapon),muzzle=9-Math.max(0,recoil)+(UG.weapons[model.weapon].ap===2?.52:.46)*({pistol:58,handcannon:83,needle:94,funeral:104,deadair:113,widow:94}[model.weapon]||100);g.strokeStyle=energy?'#8ed5cd':'#ffe0a0';
 if(model.weapon==='funeral'){g.beginPath();g.arc(muzzle,-27,12,-1.1,1.1);g.stroke();}
 if(model.weapon==='deadair'){g.strokeRect(muzzle,-29,5,4);}
 if(model.weapon==='mercy'){g.beginPath();g.arc(muzzle,-27,8,0,Math.PI*2);g.stroke();}
 if(model.weapon==='disorder'){for(let i=0;i<3;i++)g.strokeRect(muzzle+i*4,-32+i*4,7,3);}
 if(model.weapon==='widow'){g.beginPath();g.arc(muzzle,-27,15,-.9,.9);g.stroke();}
 if(model.weapon==='furnacekey'){g.beginPath();g.moveTo(muzzle,-27);g.lineTo(muzzle+24,-38);g.lineTo(muzzle+18,-27);g.lineTo(muzzle+24,-16);g.stroke();}
 g.beginPath();g.moveTo(muzzle,-27);g.lineTo(muzzle+8,-32);g.lineTo(muzzle+5,-27);g.lineTo(muzzle+9,-22);g.stroke();}
 g.restore();return model;
}
function renderPreviews(){
 const hero=$('#loadoutPreview');if(hero&&S){const g=hero.getContext('2d');g.clearRect(0,0,hero.width,hero.height);g.save();g.translate(95,150);g.scale(2.1,2.1);drawFighterModel(g,selected(),{preview:true,time:0,dir:1});g.restore();}
 for(const c of document.querySelectorAll('canvas[data-weapon-art]')){const g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);g.strokeStyle='#ccf58b';drawHeld(g,c.dataset.weaponArt,10,45,1.5);}
 for(const c of document.querySelectorAll('canvas[data-armor-art]')){const g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);g.save();g.translate(60,105);g.scale(1.7,1.7);drawFighterModel(g,{...selected(),armorKey:c.dataset.armorArt},{preview:true,time:0,dir:1});g.restore();}
}
