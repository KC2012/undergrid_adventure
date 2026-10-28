# Validation / Ward Bound 0.3

## Executed in this environment

- Built the dependency-free HTML release from the source files with Python 3.12.
- Syntax checked all four JavaScript source files with Node 24.
- Original integration suite, expanded automatically to cover the new room graph: **143 reported checks passed, zero browser page errors**.
- Ward Bound suite: **95 reported checks passed, zero browser page errors**.
- Inspected desktop and narrow-screen screenshots of the persistent crew dock and AP indicators.
- Confirmed both reference HTML files remain byte-identical to the supplied originals.

The original suite covers actual keyboard movement and interaction, keyboard ladder ascent, pointer-route encounter detection, pointer shooting and round completion, browser continue/save, touch hold movement, narrow-screen overflow, and rendering/path routes to every interactable. Its controlled fixtures also cover AP, ammo, healing, steel LOS, cover/barrels, XP, victory rewards, retreat, recruitment, opening quest gates and completion, and ammo-conserving equipment swaps.

The expansion suite covers all hatch destination landings, migrating a 0.2 save without losing progress, invalid talent rejection, next-ready selection, preventing selection of downed crew, armor/movement tradeoffs, combined gear/mod stats, talent purchase and retraining, toxin/burn/shock protections, crafting, zero-ammo melee, victory salvage and bond progress, personal grudges, all ten contract chains, gated new routes, alternate courier outcomes, reputation pricing, tracked jobs, requiring a work board for settlement, salvage repopulation, safe callsign rendering, and expanded save round trips. Enemy medic healing and demolition-runner detonation are exercised directly.

A complete **simulated convoy combat** also runs using ordinary shooting, AP, reloading, healing, graph movement, magazines, damage and enemy activations. It uses a prepared level-five three-person crew with mesh/targeters and a deterministic random seed; it does not edit enemy HP during that fight. It verifies the encounter can end in victory without a path or turn deadlock under those conditions. This is not a novice solo balance assessment.

The narrative walkthrough fixtures position actors and clear enemies directly to isolate quest integration. Real pointer/keyboard inputs test selected transitions and actions. These results are not presented as an unassisted human playthrough of every district.

## Implemented content

- 16 districts and 44 initial hostile placements, with authored vertical routes.
- 16 enemy archetypes, including collectors, medics, bombers, drones and specialized weapons.
- Original Last Light/freight opening plus ten contracts and up to nine paid salvage replays across three work sites.
- Three-person crew; 15 weapon patterns including one melee pattern.
- Six armor patterns, six equipable gear types plus an empty slot, three modifications plus factory parts, and four talent tracks.
- Personal callsigns/colors, per-fighter builds, bonds, grudges, standing-based prices, a train boarding/escort/delivery loop, and route/rail unlocks.

## Known limits and unrun checks

- This is an expanded authored campaign foundation, not a finished massive full-length RPG. Additional chapters and long-term human balance work remain.
- Vehicles are freight boarding/transit and an ambush battlefield. There is no freely driven vehicle, fuel simulation or moving collision chassis.
- Deeper world lore is deliberately implied in background objects and concise exchanges. There is no elaborate faction simulation or conversation-tree engine.
- Equipment is a permanent collection of patterns, individually equipped by fighters. No random item affixes, individual gear durability, storage-weight or loot-instance economy is implemented.
- The original climbing-rig key unlocks a hatch; the new equipable rig improves route movement allowance. There is no aimed grapple. The counterweight lift unlocks a district entrance rather than simulating a rideable moving platform.
- Combat includes all living enemies in a district. Large multi-floor encounters can take several repositioning rounds. Enemy movement uses discrete steps and traces; companions follow animated ladder routes.
- Steel blocks shots, and crates/barrels are destructible. Railing art, buildings and floors do not form a mining/destruction simulation.
- Shared abstract ammunition, no sound/music, multiplayer, cloud saves, gamepad support or Alpha 1 save migration. 0.2 saves are migrated; newer saves are not backward compatible.
- Standing affects supplier prices; it does not yet drive territorial control. Bonds improve accuracy; personal choices affect bonds, payments and standing. No relationship cutscene system is claimed.
- Chromium desktop and emulated narrow touch controls were tested. Firefox, Safari, physical mobile devices, extended soak tests and complete human campaign playthroughs remain unrun.
- Live external design research was blocked by network policy during the first build; see DESIGN.md for source inspection versus prior design knowledge.

## Reproduce

```sh
python tools/build.py
node --check src/data.js
node --check src/expansion-data.js
node --check src/game.js
node --check src/campaign.js
python -m http.server 8000 --bind 127.0.0.1
# Separate terminal:
python tests/browser_test.py
python tests/expansion_test.py
```

Application dependencies: none. Browser tests use the environment's Python Playwright and `/usr/bin/chromium`. Test APIs are exposed only when the URL explicitly includes `?test`. Use a separate browser context for tests; the harness starts new expeditions in its own local storage.
