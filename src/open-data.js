/* Alpha 9: authored physical refinements, not a second copy of map geometry. */
function hatch(roomId,platformId,x,width=44,flag=null){const p=UG.rooms[roomId].platforms.find(p=>p.id===platformId);if(p)(p.apertures||(p.apertures=[])).push({x,width,flag});}
function breakDeck(roomId,id,left,right){const r=UG.rooms[roomId],p=r.platforms.find(p=>p.id===id),end=p.x+p.w;p.w=left-p.x;r.platforms.push({...p,id:id+'-east',x:right,w:end-right});}
for(const p of UG.rooms.hearth.platforms)if(['step-one','step-two','step-three'].includes(p.id))p.kind='oneway';
UG.rooms.hearth.platforms.push({...platform('ward-step',725,620,110),kind:'oneway'});
hatch('hearth','watch',610,44);
breakDeck('cable','upper',870,970);
hatch('cable','east',1090,46);hatch('cable','crown',1230,44);
UG.rooms.cable.platforms.push({...platform('service-room',750,350,150),kind:'oneway'}, {...platform('service-crossing',800,300,300),kind:'oneway'});
UG.rooms.cable.ladders.push({...ladder(800,350,440),gate:'serviceShortcut'});
UG.rooms.cable.objects.push(obj('service-seam','open',760,440,'Scored maintenance panel',{kind:'discovery',discovery:'workshop'}),obj('service-record','open',820,350,'Folded survey / workshop terminal',{kind:'discovery',discovery:'survey'}),obj('workshop-letter','open',865,350,'A kettle left warm',{kind:'discovery',discovery:'letter'}),obj('gap-winch','anchor',1100,440,'Upper catwalk maintenance winch'));
breakDeck('furnace','bridge',930,1010);
UG.rooms.furnace.platforms.push({...platform('furnace-step',800,610,70),kind:'oneway'});hatch('furnace','east',1060,46);
UG.rooms.abyss.platforms.push({...platform('rigging-rest',740,960,100),kind:'oneway'}, {...platform('rigging-rise',850,880,120),kind:'oneway'});
UG.rooms.abyss.objects.push(obj('rigging-anchor','anchor',780,960,'Rigger’s recovery winch'),obj('ilex-tag','open',815,960,'A salvager’s stamped return seal',{kind:'discovery',discovery:'seal'}));
// Existing winch endpoints get deliberate landing openings; ordinary ladders do not.
for(const r of Object.values(UG.rooms))for(const o of r.objects.filter(o=>o.type==='anchor')){const p=r.platforms.find(p=>Math.abs(p.y-o.y)<2&&o.x>=p.x+20&&o.x<=p.x+p.w-20);if(p&&!(p.apertures||[]).some(h=>Math.abs(h.x-o.x)<24))(p.apertures||(p.apertures=[])).push({x:o.x,width:42,winch:true});}
UG.companions.nim={name:'Nim',role:'Roof scout',weapon:'pistol',hp:78,armor:1,color:'#b4dbb5',desc:'A former roof-runner who maps the places freight notices leave blank. Spots concealed service seams at longer range, jumps a little higher and wants the old survey preserved. Thinks Vera writes maps like delivery deadlines.'};
UG.companions.brass={name:'Brass',role:'Ward mediator',weapon:'handcannon',hp:102,armor:2,color:'#d7b17c',desc:'An ex-toll collector trying to make a promise worth more than a threat. Recognized at the Ashline checkpoint; can negotiate a stand-down using evidence. Distrusts Latch’s old maintenance orders, but respects Orren’s repairs.'};
UG.companions.ilex={name:'Ilex',role:'Industrial salvager',weapon:'shotgun',hp:96,armor:2,color:'#b6acd2',desc:'A retrieval worker who refuses to leave a signed return tag behind. Salvage harness improves encounter haul; handles trapped cargo without spending parts. Trades dry jokes with Sable and owes Orren a safe return.'};
UG.rooms.cable.objects.push(obj('nim-contact','open',790,350,'Nim / roof surveyor',{kind:'recruit',companion:'nim'}));
UG.rooms.slag.objects.push(obj('brass-contact','open',500,470,'Brass / former toll collector',{kind:'recruit',companion:'brass'}),obj('toll-resolution','open',700,880,'Ashline shift checkpoint',{kind:'checkpoint'}));
UG.rooms.furnace.objects.push(obj('ilex-contact','open',460,660,'Ilex / stranded retrieval worker',{kind:'recruit',companion:'ilex'}));
UG.rooms.sump.objects.push(obj('hoist-inquiry','open',540,880,'Hoist freight / broken brake',{kind:'discovery',discovery:'freight'}));
UG.rooms.tenement.objects.push(obj('tenant-evidence','open',650,880,'Tenants’ stamped receipt',{kind:'discovery',discovery:'receipt'}));
Object.assign(UG.contracts,{
 nimTrail:{name:'A map with room for people',from:'Nim / roof survey',companion:'nim',side:true,text:'Investigate the folded survey in the concealed Cableworks workshop. Nim wants the names preserved, not another secret toll route.',needs:['nimTrace'],reward:{credits:45,scrap:6,gear:'climbrig'},result:'Nim marks the workshop as a public service route. Vera adds a delivery time in the margin.'},
 brassWord:{name:'The value of a promise',from:'Brass / Ashline',companion:'brass',side:true,text:'Inspect the Ashline checkpoint after freeing the route by evidence, a negotiated bond or combat. Record who will keep it open.',needs:['brassWitness'],choices:[{id:'public',name:'Publish the shift record',text:'The tenants have names and receipts now. Brass signs below them.',rep:2,bond:1,reward:{scrap:6}},{id:'crew',name:'Keep a crew copy',text:'The crew keeps a safe-passage record. Brass asks you to use it carefully.',rep:0,bond:1,reward:{ammo:24}}],reward:{credits:50},result:'The checkpoint has a promise to answer to.'},
 ilexReturn:{name:'Every name comes home',from:'Ilex / recovery crews',companion:'ilex',side:true,text:'Recover Ilex’s stamped return seal from the optional rigger’s rest in Counterweight Abyss. Jump with climbing equipment or use its recovery winch.',needs:['ilexSeal'],choices:[{id:'community',name:'Register the return with the workers',text:'A missing name is taken off the board. Ilex buys the next kettle.',rep:2,bond:1,reward:{scrap:8}},{id:'field',name:'Rebuild the crew’s field kit',text:'Ilex stamps the repaired kit with every active name.',rep:0,bond:1,reward:{meds:2,ammo:18}}],reward:{credits:60},result:'The salvage crews leave a lamp at the rigger’s rest.'}
});
