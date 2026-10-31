# Explorer’s Atlas / Alpha 8

Press **M**, tap the footer map control, or open the route map at your bunk. The atlas has **WORLD CONNECTIONS** and **LOCAL SURVEY** pages. It records what the crew has observed; it does not move them.

## World connections

Named boxes are discovered permanent districts. The highlighted box is your current district; an expedition's world route begins at its departure settlement. Unvisited neighbors of observed exits appear as anonymous passage boxes. More distant districts remain absent.

Solid green links are open passages, amber dashed links are locked, and dotted links lead into unexplored territory. Arrows preserve the real door direction, including one-way passages. The drawing is a topological schematic, not physical distance, depth or a second authored world layout. Every passage comes from an actual `door` object. Districts visited in an old save retain their names and actual direct connections to other already-visited districts.

Recorded passages list their live requirements. The planner checks the same item, quest and companion-gate rules as ordinary travel. Locked unknown exits stay unnamed, while their known requirement can still be read. Discovered tram terminals are marked T. Powered observed terminals connect directly using the game's existing rail rule; cyan curves show rail access through one surveyed terminal to avoid an unreadable complete mesh.

## Local survey

Local platforms and ladders come directly from the current district's geometry. Platforms are solid lines, ladders dashed cyan lines, exits ↔, expedition returns ↩, machinery ⚙, trams T, bunks B and other landmarks ◇. The crew's position remains visible.

The survey records nearby 160-unit cells as living crew explore, approximately 260 units to either side and above. This is a coarse proximity survey, not a line-of-sight simulation. Newly reached floors reveal progressively. Observed major doors, machinery, services, story controls and expedition return/deep-route controls are recorded. Loot, relic cases, caches and the whole undiscovered world are not exposed.

Use **+ ZOOM / − ZOOM** and scroll or drag the local map on touch screens. Zoom is an inspection preference, not a navigation command. Icons/text remain readable at the base size. Local geography always belongs to the current district; the destination selector below it is for world planning and notes.

## Planning and your notebook

Select a previously discovered district using its box or **DISCOVERED DESTINATION**. The atlas finds a shortest sequence of known district connections, optionally using powered discovered tram terminals. It does not calculate the shortest walking distance inside each district. No movement order, fast travel or glowing objective trail is created.

If a surveyed route is blocked, the atlas explains the first unmet requirement on a possible connection. If the necessary passage has never been surveyed, it says to explore the missing connection rather than inventing one. An open alternative is preferred over a locked path.

You can toggle one pin per discovered permanent district and save a personal note of up to 120 characters. Pins retain the existing save field; notes and observations have a new validated atlas record. Text is escaped when displayed. During an encounter, edits remain in the live game and are saved when the encounter ends, following the existing no-mid-combat-save rule. Quiet saves/exports preserve partial surveys, notes and pins.

Alpha 7 saves migrate automatically. Their names, pins, equipment, quests, settlement work and expedition progress remain. Previously unrecorded local geography is surveyed through normal exploration. Expedition layouts keep their existing authored geometry; the local survey works there too, but their temporary work rooms are not presented as permanent world districts.
