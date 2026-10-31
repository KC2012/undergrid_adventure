/* Alpha 7 builds connections between existing systems rather than a new campaign. */
UG.restorations = {
 funeral: {component:'a tuned pressure governor', site:'Pump Test Annex / eastern Cableworks service hatch', cost:6,
  text:'The bell-mouth frame is sound; its pressure governor is missing. Edda recognizes a test rig in the Cableworks. Isolate the live floor before lifting its regulator.'},
 mercy: {component:'a matched induction capacitor', site:'Signal Ossuary / middle-floor receiver', cost:8,
  text:'The transformer survives, but its capacitor leaks current. Repair the Ossuary receiver to recover a matched cell; Edda can make it safe to carry.'}
};
UG.residents = {
 edda:{name:'Edda / workshop mechanic', project:'workshop', x:845,y:880,
  text:'“Mara keeps the lamps alive. I keep the things people carry under them alive. Bring me a frame with a history; we will give it a future.”'},
 osa:{name:'Osa / freight merchant', project:'freight', x:310,y:660,
  text:'“I price bullets by what it costs to bring them home. Rill used to argue about that. I hope they still do.”'},
 meda:{name:'Meda / ward nurse',project:'infirmary',x:1320,y:880,
  text:'“Someone in the Gardens has missed two shifts. Clear the chemical patrols, then look by the low water gauge. A clean bed changes what we can promise.”'},
 sib:{name:'Sib / signal operator',project:'listening',x:1000,y:440,
  text:'“The Ossuary keeps answering an order no one sent. Take its receiver off repeat. If it speaks again, listen before you shoot.”'},
 nellie:{name:'Tern / quarter steward',project:'quarters',x:590,y:660,
  text:'“A home is a place where somebody notices an empty bunk. Edda is saving one for Rill. You will find their last shift in the Pump Test Annex.”'},
 rill:{name:'Rill / recovered test engineer',rescue:true,x:700,y:880,
  text:'“My sister Edda says never touch a machine that is still asking questions. I touched it twice. Your restoration work costs two less salvage now.”'}
};
UG.regionalEvents = {
 camp:{room:'cable',x:330,y:880,name:'Scavengers at the warm-pipe camp',
  text:'Two returning scavengers have marked a maintenance hatch. “A test engineer went east. The floor is live; the switch is above the intake.”',
  choices:[['share','Share six spare rounds / goodwill'],['listen','Listen and leave supplies alone']]},
 patient:{room:'garden',x:360,y:880,name:'An injured filter worker',
  text:'The new Ward infirmary has room. A worker needs a medkit before the freight crew can move them.',
  choices:[['evacuate','Use one medkit / send them to Meda'],['directions','Give directions / leave supplies']]},
 freight:{room:'yard',x:330,y:880,name:'The last freight of the shift',
  text:'A damaged wagon carries an unopened relief crate. Osa asks which part of the Ward needs it most.',
  choices:[['medical','Send it to the infirmary / medical supplies'],['tools','Send it to the workshop / salvage']]},
 survey:{room:'sump',x:330,y:880,name:'A maintenance shift returns',
  text:'The hoist is running again. A crew chalks a safe route above the tide. No request, no debt. Just another shift going home.',
  choices:[['greet','Exchange news / no payment']]}
};
UG.lifeOrders = [
 {name:'Routine recovery',text:'Recover the primary freight. Optional: inspect the upper survey plate.',kind:'survey',credits:12,scrap:2},
 {name:'Lost shift',text:'A stranded worker waits in the deep reserve. Clear that floor and guide them to extraction.',kind:'survivor',credits:22,scrap:4},
 {name:'Pressure inspection',text:'Read the isolated drive gauge on the work floor after opening its deep-route control.',kind:'gauge',credits:16,scrap:3}
];
// A compact optional site, reached without accepting any main-story objective.
UG.rooms.cable.objects.push(door('test-annex',1640,660,'Pump Test Annex / service hatch','testannex',90,880));
greaterRoom('testannex','Pump Test Annex','A live induction floor. An unfinished promise.',245,'#89c5ba','works',1500,1000,
 [[0,880,1500],[80,660,650],[900,660,500],[380,440,760]],
 [[240,660,880],[1080,660,880],[600,440,660],[1040,440,660]],
 [door('annex-return',70,880,'Cableworks service return','cable',1590,660),
  obj('annex-isolate','life',520,440,'Induction isolator / stop the live floor',{kind:'isolate'}),
  obj('annex-governor','life',1270,660,'Test governor / missing pressure component',{kind:'component'}),
  obj('annex-rill','life',1110,880,'Rill / trapped test engineer',{kind:'rescue'})],
 [['test-watch','sentry',1030,880],['test-scav','scav',1220,660]],[[850,880],[1140,660]],[]);
UG.greaterStoryRooms.push('testannex');UG.roomTiers.testannex=2;
