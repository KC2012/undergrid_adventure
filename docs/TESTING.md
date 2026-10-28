# Validation / Alpha 4 (build 0.5)

## Executed

Built the standalone HTML using Python 3.12 and syntax-checked all nine JavaScript source files with Node 24. Seven Chromium / Python Playwright suites passed **526 reported checks** with zero browser page errors. Exact suite totals and output are retained in [TEST_RESULTS.txt](TEST_RESULTS.txt).

| Suite | Evidence |
| --- | --- |
| browser_test.py | Core integration, actual keyboard/pointer/touch input, paths to all interactables, AP/ammunition, recruitment, story gates, save/continue and bounds |
| expansion_test.py | Existing contract chains/choices, gear and talents, supplier standing, migration, crew cycling, enemy support and a full prepared-crew normal-AP convoy simulation |
| visual_test.py | Fifteen distinct weapon renders, six armor silhouettes, all gear variants, identity accents, authoritative equipment mappings, real equip buttons, shared previews, action animation and one world render per fighter |
| living_test.py | Existing machinery, repeated tools, roster, persistent changes, staged boss components/phases, actual cutting/lift/grapple inputs, portrait inventory, corrupt/legacy file chooser imports and audio controls |
| adventure_loop_test.py | Fresh-start opening through ordinary routes, recruitment, AP/hostile turns, fuse return, earned ability/calibration and save/load |
| adventure_systems_test.py | Local groups/reward ownership, jump/route affordances, six abilities and limits, quick swaps, relief, four dispatch objective branches, diminishing rewards, relay failure/repairs, three utilities, transit runtime recovery and real browser controls/import |
| dispatch_play_test.py | A prepared tier-three crew completing the new defense job with normal AP, routes, shots, hostile relay damage, rewards and persistent outcome |

Inspected desktop equipment, combat, portrait controls, the fresh-opening result and dispatch result screenshots. The notification/controls overlap found in portrait combat was corrected; combat hides the notification card and stacks interactive overlays above the tactical bar. These are Chromium desktop and emulated portrait observations, not physical-phone certification.

Confirmed the two uploaded reference games remain byte-identical. The preserved [Alpha 3 release](../releases/UNDERGRID_ADVENTURE_Alpha_3.html) exactly matches the build in commit `504e2438c370bfcc156b872625141a5a9da11809`, SHA256 `4eb967e404ef4e55ae615f9e4167b987eeb0bb47cf65e5a041d08d6a669b42e7`.

## Complete-loop simulations

The fresh-opening test begins a genuinely new expedition. A seeded bot talks to Mara, reaches the new low stash, uses the actual Cableworks hatch, recruits Vera, fights the two local encounters using AP/ammo, reaches the upper fuse, returns via the original route and turns it in. It equips a stronger gun with the real equipment button, learns an earned licence and spends earned credits/salvage on calibration. It never edits health, enemy health, XP, money, inventory or quest flags. It uses engine movement/order APIs and deterministic randomness, not a human or entirely pointer-only playthrough. Its final run took two encounters and two hostile rounds.

The dispatched defense starts from an explicitly prepared level-three crew, with weapons/armor and extra ammunition assigned before entry. During the job, it uses normal route orders, AP, reloads, shots and enemy activations. It never edits positions, AP, resources, health or objective state during the fight. Hostiles damage the relay; the crew clears attackers after one hostile round, satisfying the advertised early-win condition. Actual repair and three-round survival branches are separate fixtures, not proven by that bot. The quoted entry/reward, rare gear unlock, untouched story populations and saved win are checked.

The existing convoy bot also uses normal AP, movement, ammo, healing and hostile turns with a prepared party; it does not rewrite enemy health during the encounter. Together these simulations provide bounded integration evidence, not a representative human completion-time or difficulty measurement.

## Controlled fixtures and practical input

Fixtures deliberately place actors, set resources, simulate previously completed quests or change enemy/component HP to isolate rules. They verify every existing contract condition and route connection, all six active abilities, effect limits, ammo conservation, first-clear unlocks, reward diminishing, no duplicate kill payout, old-save upgrades, protected asset repairs/failure and all four dispatch outcomes. They do not constitute full unassisted clears of all jobs or the campaign.

The excavator fixture checks shields, both breakers, phase transitions, exposed damage, announced floor danger, coolant counterplay, victory and the investigation conclusion. Its completion segment resets fixture AP; a full normal-AP excavator clear remains unrun.

Actual browser inputs separately cover keyboard walking/climbing with a 40-unit ladder offset, interrupting a click route, pointer shooting, Q/Space targeting with no-cost invalid shots, touch movement, equipment tabs, collision before/after cutting, a complete lift ride and a pointer-aimed winch. Actual file chooser imports reject malformed data without replacing the active expedition, migrate legacy progression and cancel a pre-import winch so its runtime cannot leave the imported crew stuck. Selecting a different crew member during controlled transit is checked to preserve the ride. Isolated movement fixtures verify jump grace, buffering and directed drop/hop routes.

Visual checks rasterize the actual shared fighter model. Distinct pixels are one acceptance check, not a claim of finished art. All fifteen original Undergrid-inspired weapons, six armor types and eight gear states (including empty) are checked. Mods add physical details; the new focus rail and blast liner have renderer support.

## Implemented scope and remaining limits

- Retained 21 story districts, sixteen formal contracts, four recruitable companions with three active slots, fifteen weapon patterns, six armor patterns, seven actual gear types plus the empty slot, four modifications plus factory parts and four passive talent tracks. Alpha 4 adds six learned active abilities and four optional job configurations in one separate work site.
- Regional enemy tiers are fixed. Local ordinary patrol groups replace district-wide fights; major set pieces remain full-site. Exactly-once kill payouts and migration markers protect progression. New dispatch payouts are bounded; legacy explicitly commissioned salvage runs remain capped at three per site.
- Each district gains contextual props, but this is not a complete individually authored visual redesign. Three new mechanisms extend existing machinery. There is no second large story chapter, randomized reward system or full endgame economy study.
- No human full-campaign session, solo difficulty study, normal-AP excavator clear or extended economy test has been completed. Normal-action bot results and controlled fixtures are reported separately above.
- Navigation uses authored graphs and scripted transit. Grapples target authored anchors; lifts carry nearby crew through coordinates rather than acting as general physics platforms. Diving grants route access rather than free swimming. Enemy route motion is discrete.
- A protected relay is a real distinct target. There is no generic protect-any-NPC framework, tactical vehicle driving, destructible terrain simulation or procedural mining. Crew Watch/Auto Next are convenience orders, not autonomous companion combat AI.
- Equipment uses shared permanent patterns; calibration is per fighter/weapon. No durability or individually rolled loot. Learned abilities cannot yet be retrained; passive talents can.
- Normal exploration saves put moving actors on safe footing. Controlled winch/lift rides defer saving. Dispatched jobs preserve the pre-entry checkpoint and cannot save/export/import mid-run. Quitting restores that checkpoint.
- 0.2/0.3/0.4 saves migrate; Alpha 1 saves do not. Newer saves must not be opened in older builds. Browser storage is origin-specific; export backups when moving builds/devices.
- Optional synthesized audio controls were exercised, but no formal listening/device-volume test was performed. No score or voice acting.
- Physical iOS/Android, Safari, Firefox, gamepads, screen readers and low-end performance profiling remain unrun. Keyboard bindings are fixed; menus are not a completed accessibility pass.
- No new live external research was performed. The supplied source and established design knowledge informed the work; DESIGN.md distinguishes prior research attempts from actual sources read.

## Reproduce

```sh
python tools/build.py
for source in src/*.js; do node --check "$source"; done
python -m http.server 8000 --bind 127.0.0.1
# In another terminal, from the repository root:
python tests/browser_test.py
python tests/expansion_test.py
python tests/visual_test.py
python tests/living_test.py
python tests/adventure_loop_test.py
python tests/adventure_systems_test.py
python tests/dispatch_play_test.py
```

No game runtime packages or external assets are needed. Development tests require Python Playwright and `/usr/bin/chromium`. Test APIs exist only with `?test`; use isolated browser contexts because fixtures start new expeditions. Next priorities are recorded in [ALPHA_4.md](ALPHA_4.md).
