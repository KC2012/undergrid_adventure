/* Alpha 6: authored discoveries, settlement projects and non-story work. */
UG.wardProjects={
 power:{name:'Power infrastructure',credits:35,scrap:6,requires:null,story:'power',x:400,y:880,benefit:'Powered signs and workshop circuits. Requires Mara’s relay repair.'},
 workshop:{name:'Workshop',credits:55,scrap:10,requires:null,material:1,x:770,y:880,benefit:'Restore recovered technology. Fit mods here; restore a crew magazine for six salvage.'},
 armory:{name:'Armory',credits:60,scrap:10,requires:'workshop',x:1080,y:660,benefit:'Exchange four salvage for 24 ammunition. Weapon racks and training lane.'},
 infirmary:{name:'Infirmary',credits:45,scrap:8,requires:null,x:1250,y:880,benefit:'Exchange three salvage for two medkits. Beds, lamps and a medic.'},
 freight:{name:'Freight depot',credits:65,scrap:12,requires:'power',x:200,y:660,benefit:'Open Signal Ossuary expeditions; five-credit entry discount. Moving freight.'},
 listening:{name:'Listening station',credits:45,scrap:8,requires:'power',x:920,y:440,benefit:'Hear all outstanding relic leads. Powered receiver and operator.'},
 quarters:{name:'Living quarters',credits:30,scrap:6,requires:null,x:520,y:660,benefit:'A personal bunk, trophy rack and resident salvage dispute.'}
};
Object.assign(UG.weapons,{
 funeral:{...UG.weapons.shotgun,name:'The Funeral Bell',damage:34,range:340,opt:140,mag:3,knock:100,desc:'Three-shell bell-mouth shotgun. Pushes surviving targets 100 units along their platform; short reach.'},
 deadair:{...UG.weapons.sniper,name:'Dead Air',damage:32,mag:3,ambush:18,desc:'Suppressed survey rifle: +18 damage in the opening round; weaker sustained fire.'},
 mercy:{...UG.weapons.arc,name:'Mercy Killing',damage:21,mag:4,chain:12,desc:'Chains 12 electrical damage to one other visible hostile within 180 units. Four-cell magazine.'},
 disorder:{...UG.weapons.smg,name:'Disorder',damage:17,burst:3,mag:15,unstable:true,desc:'Three-round bursts. Accuracy falls two points for each round missing from its magazine.'},
 widow:{...UG.weapons.handcannon,name:'The Widowmaker',damage:49,mag:2,ap:2,desc:'Two-chamber siege revolver. High penetration, two AP per shot and frequent reloads.'},
 furnacekey:{...UG.weapons.flame,name:'The Furnace Key',damage:17,burn:14,mag:4,range:240,desc:'Four-charge industrial torch. Inflicts 14 burning damage at activation; short reach.'}
});
UG.armors.celebration={name:'Black Celebration',save:12,move:-65,evade:-5,desc:'Twelve damage resistance; -65 movement per AP and five easier to hit.'};
UG.armors.sunday={name:'Sunday Best',save:3,move:25,evade:8,desc:'Courier-weave armor: +25 movement, +8 evasion; light protection.'};
UG.gear.hanging={name:'The Hanging Man',move:35,grapple:900,desc:'Reusable 900-unit grapple at existing anchors, including before the ordinary winch unlock. +35 movement.'};
UG.gear.forest={name:'A Forest',evade:12,desc:'Optical interference: incoming ranged accuracy reduced by 12. No invisibility against machinery.'};
UG.mods.resonator={name:'Ghost Circuit',damage:-3,pen:4,desc:'+4 penetration at the expense of three damage. Recovered resonant induction teeth.'};
UG.mods.suture={name:'Suture Feed',acc:8,damage:-2,desc:'+8 accuracy, -2 damage. A patient machine’s hand-machined feed guide.'};
UG.relics={
 funeral:{kind:'weapon',item:'funeral',room:'exp_service_2',name:'The Funeral Bell',hint:'A courier heard a shotgun toll beneath the old service stairs. Ask at the Ward dispatch hatch.',flavor:'A funeral bell cast into a breaching muzzle. Each chamber is engraved with an unpaid shift.',x:1070,y:420},
 deadair:{kind:'weapon',item:'deadair',room:'archive',name:'Dead Air',hint:'The upper archive kept a rifle for silencing bad news. A courier’s cipher opens its case.',gate:'cipher',flavor:'The suppressor wears a dispatch office seal.',x:1200,y:440},
 mercy:{kind:'weapon',item:'mercy',room:'pressure',name:'Mercy Killing',hint:'A conductive test cage hums beneath the pressure vault. Its guards still keep the current on.',flavor:'A hospital transformer pressed into harsher service.',x:1050,y:880},
 disorder:{kind:'weapon',item:'disorder',room:'slag',name:'Disorder',hint:'A gang in the Ashline stores a temperamental automatic in its service locker.',flavor:'Three serial numbers; none match the receiver.',x:1200,y:880},
 widow:{kind:'weapon',item:'widow',room:'redoubt',name:'The Widowmaker',hint:'Captain Vey keeps a two-chamber revolver beside the old armory.',flavor:'Two shots. Six farewell letters.',x:1550,y:530},
 furnacekey:{kind:'weapon',item:'furnacekey',room:'excavator',name:'The Furnace Key',hint:'The excavator maintenance crew lost a red-hot key to the foreman’s machine.',flavor:'Not every locked door was meant to survive.',x:1100,y:880},
 celebration:{kind:'armorKey',item:'celebration',room:'cold',name:'Black Celebration',hint:'The Cold Foundry’s last safety inspector wore armor rated for a falling lift.',flavor:'A celebration of surviving another shift.',x:1500,y:420},
 sunday:{kind:'armorKey',item:'sunday',room:'exp_service_1',name:'Sunday Best',hint:'An injured courier left a formal delivery coat in the service drains.',flavor:'The lining is stitched with routes home.',x:1100,y:650},
 hanging:{kind:'gear',item:'hanging',room:'abyss',name:'The Hanging Man',hint:'The Abyss crown still holds a rigger’s long-range winch.',flavor:'Someone scratched FALL UP into its reel.',x:1100,y:180},
 forest:{kind:'gear',item:'forest',room:'exp_signal_2',name:'A Forest',hint:'An abandoned signal garden bends light around its last operator.',flavor:'A moving thicket of stolen reflections.',x:1100,y:420},
 resonator:{kind:'mod',item:'resonator',room:'orchard',name:'Ghost Circuit',hint:'The Relay Orchard records a carrier wave no human voice can produce.',flavor:'The teeth hum even with the power off.',x:1200,y:880},
 suture:{kind:'mod',item:'suture',room:'garden',name:'Suture Feed',hint:'A machine in the Blackwater Gardens still manufactures surgical guides.',flavor:'One perfect stitch, repeated for a century.',x:1200,y:880}
};
for(const [id,d] of Object.entries(UG.relics)){
 if(d.kind==='weapon')UG.weaponSources[d.item]=d.hint;
 const r=UG.rooms[d.room];const floor=r.platforms.filter(p=>p.y===d.y&&d.x>=p.x&&d.x<=p.x+p.w)[0]||r.platforms[0];d.y=floor.y;d.x=Math.max(floor.x+35,Math.min(d.x,floor.x+floor.w-35));
 // Expedition rooms are reconstructed per seed; expeditionDefinition adds these cases.
 if(!d.room.startsWith('exp_'))r.objects.push(obj('relic-'+id,'ward',d.x,d.y,d.name+' / sealed relic case',{kind:'relic',relic:id}));
}
UG.wardEvents={
 courier:{room:'cable',x:420,y:880,name:'An injured courier',text:'A courier has crawled behind a warm pipe. A medkit will get them home.',cost:'meds',amount:1,reward:{credits:35,scrap:5},lead:'funeral'},
 freight:{room:'yard',x:800,y:880,name:'Missing freight',text:'A maintenance crate is pinned beneath the signal. Clear the yard patrol to release it.',clear:true,reward:{credits:45,scrap:8},material:1,lead:'disorder'},
 lift:{room:'sump',x:500,y:880,name:'A broken service hoist',text:'Three salvage will replace its broken brake. The workers can recover their tool chest.',cost:'scrap',amount:3,reward:{credits:25,scrap:7},material:1,lead:'hanging'},
 dispute:{room:'hearth',x:580,y:660,name:'Two scavengers, one kettle',text:'House the returning scavengers, then divide their salvage fairly. Nobody has to draw a gun.',project:'quarters',reward:{scrap:8,meds:1},lead:'sunday'},
 mystery:{room:'garden',x:1050,y:880,name:'A machine without a patient',text:'Clear the chemical workers, then inspect the surgical feed still turning after a hundred years.',clear:true,reward:{credits:40,scrap:6},lead:'suture'},
 signal:{room:'exp_signal_1',x:1100,y:650,name:'The voice between shifts',text:'A receiver asks for one final repair. Five salvage restores its distant carrier.',cost:'scrap',amount:5,reward:{credits:60,scrap:10},lead:'forest'}
};
for(const [id,e] of Object.entries(UG.wardEvents))if(!e.room.startsWith('exp_')){
 const r=UG.rooms[e.room],p=r.platforms.find(p=>p.y===e.y&&e.x>=p.x&&e.x<=p.x+p.w)||r.platforms[0];e.y=p.y;
 r.objects.push(obj('event-'+id,'ward',e.x,e.y,e.name,{kind:'event',event:id}));
}
for(const [id,p] of Object.entries(UG.wardProjects))UG.rooms.hearth.objects.push(obj('project-'+id,'ward',p.x,p.y,p.name+' / ward project',{kind:'project',project:id}));
UG.rooms.hearth.objects.push(obj('ward-dispatch','ward',610,880,'Nell / optional expedition dispatch',{kind:'dispatch'}),obj('ward-home','ward',450,660,'Your bunk / recovered trophies',{kind:'home'}));
