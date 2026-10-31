/* Alpha 8 cartography is derived from live geometry. Only observations enter saves. */
let atlasTab='world',atlasSelected=null,atlasTimer=0,atlasZoom=1;
const SURVEY_CELL=160;
function atlasUpgrade(d) {
 if(d.atlas)return d;
 d.atlas={version:1,surveys:{},notes:{}};
 // Old saves retain names, pins and real links between districts already visited.
 for(const id of d.visited){const r=UG.rooms[id];if(!r)continue;
  d.atlas.surveys[id]={cells:[],seen:r.objects.filter(o=>o.type==='door'&&d.visited.includes(o.to)).map(o=>o.id)};
 }
 return d;
}
function validateAtlas(d) {
 const a=d.atlas,record=v=>v&&typeof v==='object'&&!Array.isArray(v);
 if(!a||a.version!==1||!record(a.surveys)||!record(a.notes))throw Error('Invalid atlas.');
 for(const [id,s] of Object.entries(a.surveys)){
  const r=UG.rooms[id];if(!r||!s||!Array.isArray(s.cells)||!Array.isArray(s.seen)||s.cells.length>Math.ceil(r.w/SURVEY_CELL)*Math.ceil(r.h/SURVEY_CELL)||new Set(s.cells).size!==s.cells.length||new Set(s.seen).size!==s.seen.length||s.seen.length>300)throw Error('Invalid survey.');
  for(const cell of s.cells){if(typeof cell!=='string'||!/^\d+,\d+$/.test(cell))throw Error('Invalid survey cell.');const [x,y]=cell.split(',').map(Number);if(x>=Math.ceil(r.w/SURVEY_CELL)||y>=Math.ceil(r.h/SURVEY_CELL))throw Error('Survey outside district.');}
  if(s.seen.some(k=>typeof k!=='string'||k.length>80))throw Error('Invalid observed landmark.');
 }
 for(const [id,note] of Object.entries(a.notes))if(!UG.rooms[id]||!d.visited.includes(id)||typeof note!=='string'||note.length>120)throw Error('Invalid map note.');
}
function atlasSurvey(id=S.room) {return S.atlas.surveys[id]||(S.atlas.surveys[id]={cells:[],seen:[]});}
function atlasLandmark(o){return o.type==='industry'&&['air','power','drive','feed','dump'].includes(o.kind)||o.type==='open'&&o.discovery==='workshop'&&S.flags.serviceShortcut||o.type==='expedition'&&['extract','next','control'].includes(o.kind)||o.type==='story'&&['charter','ada','relay','conclusion','epilogue'].includes(o.kind)||o.type==='life'&&o.kind==='isolate'||['door','tram','machine','anchor','rest','contracts','workbench','npc','vehicle','relay','valve','engine'].includes(o.type)||o.type==='ward'&&['project','dispatch','home'].includes(o.kind);}
function atlasObserve() {
 if(!S?.atlas)return;
 const r=room(),s=atlasSurvey(),cells=new Set(s.cells),seen=new Set(s.seen);
 for(const a of alive()){
  for(let y=Math.max(0,Math.floor((a.y-260)/SURVEY_CELL));y<=Math.min(Math.ceil(r.h/SURVEY_CELL)-1,Math.floor((a.y+100)/SURVEY_CELL));y++)
   for(let x=Math.max(0,Math.floor((a.x-260)/SURVEY_CELL));x<=Math.min(Math.ceil(r.w/SURVEY_CELL)-1,Math.floor((a.x+260)/SURVEY_CELL));x++)cells.add(x+','+y);
  for(const o of r.objects)if(atlasLandmark(o)&&Math.abs(o.x-a.x)<=280&&Math.abs(o.y-a.y)<=170)seen.add(o.id);
 }
 s.cells=[...cells];s.seen=[...seen];
}
function atlasTick(dt){atlasTimer-=dt;if(atlasTimer<=0){atlasObserve();atlasTimer=.25;}}
function atlasGate(o){return !o.gate||!!S.items[o.gate]||!!S.flags[o.gate]||companionGate(o);}
function atlasEdges() {
 const ids=storyRoomIds(),out=[];
 for(const from of ids){if(!S.visited.includes(from))continue;const s=S.atlas.surveys[from];
  for(const o of UG.rooms[from].objects)if(o.type==='door'&&ids.includes(o.to)&&s?.seen.includes(o.id))out.push({from,to:o.to,object:o,open:atlasGate(o),frontier:!S.visited.includes(o.to),tram:false});
 }
 // Tram links exist only at discovered terminals, using the game's power/visited rule.
 const terminals=ids.filter(id=>S.visited.includes(id)&&UG.rooms[id].objects.some(o=>o.type==='tram'&&S.atlas.surveys[id]?.seen.includes(o.id)));
 for(const from of terminals)for(const to of terminals)if(from!==to)out.push({from,to,open:!!S.flags.power,frontier:false,tram:true});
 return out;
}
function atlasPlan(to,allowLocked=false) {
 if(!S.visited.includes(to)||!storyRoomIds().includes(to))return {path:[],reason:'Select a discovered district.'};
 const from=S.greater.run?.origin.room||S.room;if(!storyRoomIds().includes(from))return {path:[],reason:'Return from the current dispatch before planning a world route.'};
 const edges=atlasEdges(),queue=[from],prev=new Map([[from,null]]);
 while(queue.length){const id=queue.shift();if(id===to)break;for(const e of edges.filter(e=>e.from===id&&!e.frontier&&(allowLocked||e.open))){if(!prev.has(e.to)){prev.set(e.to,e);queue.push(e.to);}}}
 if(!prev.has(to)){
  if(!allowLocked){const blocked=atlasPlan(to,true);if(blocked.path.length){const e=blocked.path.find(e=>!e.open);return {path:[],reason:'Blocked at '+UG.rooms[e.from].name+': '+(e.tram?'Restore Mara’s relay to power the trams.':UG.gates[e.object.gate]||'Required equipment or quest progress is missing.')};}}
  return {path:[],reason:'No surveyed connection. Explore the passages between these districts; unobserved routes are not assumed.'};
 }
 const path=[];let id=to;while(prev.get(id)){const e=prev.get(id);path.unshift(e);id=e.from;}
 return {path,from,reason:from===to?'You are here.':null};
}
function atlasWorldSVG() {
 const edges=atlasEdges().filter(e=>!e.tram),ids=[...new Set([...S.visited.filter(id=>storyRoomIds().includes(id)),...edges.map(e=>e.to)])];
 const layers=new Map(),pending=[S.visited.includes('hearth')?'hearth':ids[0]];layers.set(pending[0],0);
 while(pending.length){const id=pending.shift();for(const e of edges){const to=e.from===id?e.to:e.to===id?e.from:null;if(to&&!layers.has(to)){layers.set(to,layers.get(id)+1);pending.push(to);}}}
 let detached=Math.max(0,...layers.values())+1;for(const id of ids)if(!layers.has(id))layers.set(id,detached);
 const grouped=new Map();for(const id of ids){const l=layers.get(id);if(!grouped.has(l))grouped.set(l,[]);grouped.get(l).push(id);}
 const positions=new Map();let height=240;
 for(const [l,list] of grouped){list.sort((a,b)=>a.localeCompare(b));height=Math.max(height,list.length*110+50);list.forEach((id,i)=>positions.set(id,{x:120+l*230,y:70+i*110}));}
 const width=Math.max(400,(Math.max(0,...layers.values())+1)*230+40);
 const lines=edges.map(e=>{const a=positions.get(e.from),b=positions.get(e.to),dx=b.x-a.x,dy=b.y-a.y,m=Math.max(Math.abs(dx)/100,Math.abs(dy)/30),sx=a.x+dx/m,sy=a.y+dy/m,ex=b.x-dx/m,ey=b.y-dy/m;return `<path data-atlas-edge="${escape(e.from+':'+e.to)}" class="atlas-edge ${!e.open?'locked':e.frontier?'unknown':'open'}" d="M${sx},${sy} L${ex},${ey}" marker-end="url(#atlasArrow)"/>`;}).join('');
 const railEdges=atlasEdges().filter(e=>e.tram),railHub=railEdges[0]?.from,rails=railEdges.filter(e=>e.from===railHub).map(e=>{const a=positions.get(e.from),b=positions.get(e.to);return `<path class="atlas-rail ${e.open?'':'locked'}" d="M${a.x},${a.y-30} Q${(a.x+b.x)/2},${Math.min(a.y,b.y)-75} ${b.x},${b.y-30}"><title>TRAM / ${e.open?'powered terminals connect directly':'restore relay power'}</title></path>`;}).join('');
 const nodes=ids.map(id=>{const p=positions.get(id),known=S.visited.includes(id),current=id===S.room,tram=known&&UG.rooms[id].objects.some(o=>o.type==='tram'&&S.atlas.surveys[id]?.seen.includes(o.id));return `<g class="atlas-node ${current?'current':''} ${known?'known':'unknown'}" ${known?`data-atlas-node="${id}" tabindex="0" role="button" aria-label="${escape(UG.rooms[id].name)}"`:''} transform="translate(${p.x},${p.y})"><rect x="-100" y="-30" width="200" height="60" rx="3"/><text text-anchor="middle" y="-3">${known?escape(UG.rooms[id].name):'UNEXPLORED PASSAGE'}</text><text text-anchor="middle" y="16" class="atlas-sub">${current?'YOUR CREW · ':''}${known&&S.living.markers[id]?'◆ PIN · ':''}${tram?(S.flags.power?'TRAM':'TRAM / NO POWER'):known?'DISCOVERED DISTRICT':'FOLLOW A KNOWN EXIT'}</text></g>`;}).join('');
 return `<div class="atlas-scroll" aria-label="Connected district map; scroll to explore"><svg class="atlas-network" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Surveyed district connections"><defs><marker id="atlasArrow" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#69866b"/></marker></defs>${lines}${rails}${nodes}</svg></div>`;
}
function atlasLocalSVG(id=S.room) {
 const r=UG.rooms[id],s=S.atlas.surveys[id]||{cells:[],seen:[]},mapWidth=Math.max(250,Math.min(800,innerWidth-110)),labelSize=10*(r.w+80)/mapWidth,iconSize=Math.max(13,labelSize*.65);
 const mask=s.cells.map(c=>{const [x,y]=c.split(',').map(Number);return `<rect x="${x*SURVEY_CELL}" y="${y*SURVEY_CELL}" width="${SURVEY_CELL}" height="${SURVEY_CELL}" fill="white"/>`;}).join('');
 const platforms=r.platforms.flatMap(p=>solidSections(p).map(s=>`<line data-survey-platform="${p.id}" x1="${s.x}" y1="${p.y}" x2="${s.x+s.w}" y2="${p.y}" class="survey-platform"/>`)).join('');
 const ladders=r.ladders.filter(l=>!l.gate||S.flags[l.gate]).map(l=>`<line x1="${l.x}" y1="${l.top}" x2="${l.x}" y2="${l.bottom}" class="survey-ladder"/>`).join('');
 const symbols=r.objects.filter(o=>atlasLandmark(o)&&s.seen.includes(o.id)).map(o=>`<g data-survey-object="${o.id}" transform="translate(${o.x},${o.y})"><title>${escape(o.type==='door'&&!S.visited.includes(o.to)?'Unexplored passage':o.name)}</title><circle cy="${-iconSize*1.3}" r="${iconSize}" class="${o.type==='door'&&!atlasGate(o)?'survey-locked':'survey-object'}"/><text y="${-iconSize*.8}" text-anchor="middle">${o.kind==='extract'?'↩':o.type==='door'||o.kind==='next'?'↔':o.type==='tram'?'T':o.type==='machine'||o.kind==='control'||o.kind==='isolate'?'⚙':o.type==='rest'?'B':'◇'}</text></g>`).join('');
 const crew=id===S.room?alive().map(a=>`<g transform="translate(${a.x},${a.y})"><circle r="${iconSize}" fill="${a.color}"/><text y="${-labelSize*1.8}" text-anchor="middle">${escape(a.name)}</text></g>`).join(''):'';
 return `<div class="atlas-local"><svg style="width:${mapWidth*atlasZoom}px;height:${mapWidth*atlasZoom*(r.h+80)/(r.w+80)}px;--survey-font:${labelSize}px" viewBox="-40 -30 ${r.w+80} ${r.h+80}" role="img" aria-label="Observed platforms, ladders, landmarks and crew"><defs><mask id="surveyMask">${mask}</mask></defs><g mask="url(#surveyMask)">${platforms}${ladders}</g>${symbols}${crew}</svg></div>`;
}
function atlasShow(tab=atlasTab) {
 const oldScroll=$('.atlas-scroll')||$('.atlas-local'),scroll=oldScroll?{x:oldScroll.scrollLeft,y:oldScroll.scrollTop}:null;
 atlasObserve();atlasTab=tab;
 const discovered=S.visited.filter(id=>storyRoomIds().includes(id));
 if(!atlasSelected||!discovered.includes(atlasSelected))atlasSelected=discovered.includes(S.room)?S.room:discovered[0];
 const id=atlasSelected,plan=atlasPlan(id),s=S.atlas.surveys[id];
 panel('EXPLORER’S ATLAS / SURVEY NOTEBOOK',`<nav class="loadout-tabs"><button data-atlas-tab="world" class="${tab==='world'?'primary':''}">WORLD CONNECTIONS</button><button data-atlas-tab="local" class="${tab==='local'?'primary':''}">LOCAL SURVEY</button></nav><p>Solid: open · dashed amber: locked · dotted: unexplored. Arrows are actual passage directions. Tram terminals are marked T; discovered powered terminals connect by rail. Names beyond explored districts stay unknown.</p>${battle?'<p>Survey, pins and notes made during combat are saved when the encounter ends.</p>':''}${tab==='world'?atlasWorldSVG():'<h3>'+escape(room().name)+' / YOUR LOCAL SURVEY</h3><div class="row"><button data-atlas-zoom="out">− ZOOM</button><button data-atlas-zoom="in">+ ZOOM</button></div>'+atlasLocalSVG()}${tab==='local'?'<p>Local survey: platforms ━ · ladders ╎ · exits ↔ / return ↩ · machinery ⚙ · tram T · bunk B. Dark areas are unobserved; secrets and loot are not mapped.</p>':''}<label for="atlasDestination">DISCOVERED DESTINATION</label><select id="atlasDestination">${discovered.map(k=>`<option value="${k}" ${id===k?'selected':''}>${escape(UG.rooms[k].name)}</option>`).join('')}</select><section class="atlas-details"><h3>${escape(UG.rooms[id].name)}</h3><p id="atlasRoute">${plan.reason?escape(plan.reason):[escape(UG.rooms[plan.from].name),...plan.path.map(e=>escape(UG.rooms[e.to].name)+(e.tram?' [tram]':''))].join(' → ')}</p>${S.greater.run?'<p>World routes begin at your departure settlement; extract before following them.</p>':''}<p>Known landmarks: ${(s?.seen||[]).map(k=>UG.rooms[id].objects.find(o=>o.id===k)).filter(o=>o&&o.type!=='door').map(o=>escape(o.name)).join(' · ')||'None recorded yet.'}</p><h4>Recorded passages</h4>${UG.rooms[id].objects.filter(o=>o.type==='door'&&s?.seen.includes(o.id)).map(o=>`<p>→ ${S.visited.includes(o.to)?escape(UG.rooms[o.to].name):'UNEXPLORED PASSAGE'} / ${atlasGate(o)?'OPEN':'LOCKED: '+escape(UG.gates[o.gate]||'equipment or quest requirement')}</p>`).join('')||'<p>No exits recorded here yet.</p>'}<button data-atlas-pin="${id}">${S.living.markers[id]?'REMOVE PIN':'PIN THIS DISTRICT'}</button><label for="atlasNote">YOUR NOTE / 120 CHARACTERS</label><input id="atlasNote" maxlength="120" value="${escape(S.atlas.notes[id]||'')}" placeholder="A route, a promise, a reason to return"><button data-atlas-note="${id}">SAVE NOTE</button><span id="atlasNoteStatus" role="status"></span></section><button data-action="retreat" ${battle?'':'disabled'}>RETREAT TO DISINTEGRATION WARD (near encounter entry)</button>`);
 const nextScroll=$('.atlas-scroll')||$('.atlas-local');if(nextScroll&&scroll){nextScroll.scrollLeft=scroll.x;nextScroll.scrollTop=scroll.y;}
}
document.addEventListener('click',e=>{
 const el=e.target.closest('[data-atlas-tab],[data-atlas-node],[data-atlas-pin],[data-atlas-note],[data-atlas-zoom]');if(!el||!S)return;
 if(el.dataset.atlasZoom){atlasZoom=clamp(atlasZoom+(el.dataset.atlasZoom==='in'?.5:-.5),1,3);atlasShow('local');}
 if(el.dataset.atlasTab)atlasShow(el.dataset.atlasTab);
 if(el.dataset.atlasNode){atlasSelected=el.dataset.atlasNode;atlasShow();}
 if(el.dataset.atlasPin){const id=el.dataset.atlasPin;S.living.markers[id]=!S.living.markers[id];save(true);atlasShow();}
 if(el.dataset.atlasNote){S.atlas.notes[el.dataset.atlasNote]=$('#atlasNote').value.slice(0,120);const persisted=save(true);$('#atlasNoteStatus').textContent=persisted?' Note saved.':' Note recorded; saved when the encounter ends.';}
});
document.addEventListener('change',e=>{if(e.target.id==='atlasDestination'){atlasSelected=e.target.value;atlasShow();}});
document.addEventListener('keydown',e=>{if(e.target.matches('[data-atlas-node]')&&['Enter',' '].includes(e.key)){e.preventDefault();e.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
function atlasMini(mw,mh,mx,my) {
 const r=room(),s=atlasSurvey();ctx.save();ctx.beginPath();
 for(const cell of s.cells){const [x,y]=cell.split(',').map(Number);ctx.rect(mx+x*SURVEY_CELL/r.w*mw,my+y*SURVEY_CELL/r.h*mh,SURVEY_CELL/r.w*mw,SURVEY_CELL/r.h*mh);}
 ctx.clip();for(const p of r.platforms)for(const s of solidSections(p))line(mx+s.x/r.w*mw,my+p.y/r.h*mh,mx+(s.x+s.w)/r.w*mw,my+p.y/r.h*mh,'#71845a');
 for(const l of r.ladders.filter(l=>!l.gate||S.flags[l.gate]))line(mx+l.x/r.w*mw,my+l.top/r.h*mh,mx+l.x/r.w*mw,my+l.bottom/r.h*mh,'#638d87');ctx.restore();
}
