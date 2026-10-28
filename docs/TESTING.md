# Validation / Alpha 5 (build 0.6)

## Executed

Built the standalone HTML using Python 3.12 and syntax-checked all eleven JavaScript source files with Node 24. Nine Chromium / Python Playwright suites passed **732 reported checks** with zero browser page errors. Exact reported totals and output are in [TEST_RESULTS.txt](TEST_RESULTS.txt).

| Suite | Reported checks | Evidence |
| --- | ---: | --- |
| browser_test.py | 293 | Core controls, actual keyboard/pointer/touch, AP/ammo, saves, recruitment, story gates and navigation to interactables across the expanded world |
| expansion_test.py | 135 | Existing contract chains/choices, every door landing, equipment/talents, standing, migration, next-ready crew, enemy support and normal-AP convoy simulation |
| visual_test.py | 63 | Seventeen distinct weapon renders, six armor silhouettes, nine gear states, identities, real equipment buttons, shared previews/animations and one world draw per fighter |
| living_test.py | 76 | Existing machinery, tools, roster, persistent changes, excavator component/phase fixture, actual cutting/lift/grapple inputs, imports and audio controls |
| adventure_loop_test.py | 16 | Fresh first job through actual paths/turns, recruitment, fuse return, earned ability/calibration and save/load |
| adventure_systems_test.py | 60 | Alpha 4 local engagements, six skills, supply/quick-slot rules, four dispatch outcomes/caps, utilities, real input, jump forgiveness and transit/import recovery |
| dispatch_play_test.py | 6 | Normal-AP prepared-crew defense with genuine relay damage, payout, rare gear and saved result |
| greater_test.py | 69 | Alpha 4 migration, new campaign gates/charters/ending, rescue and Redoubt outcomes, boss shields/cooling, all expedition families, variance, extraction/withdrawal/defeat/caps, active-run imports and journal/portrait UI |
| greater_play_test.py | 14 | Complete fresh introductory act, prepared continuation through a public ending, and prepared three-area Mill expedition using normal combat/route/resource actions |

Inspected staged desktop views of Kettle Junction, Counterweight Abyss, Relay Orchard, Receiver, campaign journal, expedition board and ending, plus portrait combat/journal. Corrected the portrait camera so the active fighter stays above the tactical controls near a deep room's bottom. Staged screenshots demonstrate presentation; they are separate from the gameplay completions below.

Confirmed both original uploaded reference games remain byte-identical. The preserved [Alpha 4 release](../releases/UNDERGRID_ADVENTURE_Alpha_4.html) exactly matches the supplied attachment and commit `7817f9c7680ced5a3f8629389f98c4b1b8406bd2`: SHA256 `2eaadd851f6b6a60079717c2fcdf1749b2451595f535e220a11df0eef36075fe`. Alpha 3 remains available too.

## Normal-action gameplay evidence

**Fresh full introduction:** The bot starts a new expedition with the actual starter kit. It talks to Mara, finds the low stash, recruits Vera, recovers the fuse, restores power, earns/crafts equipment, reaches the Sump, recruits Orren, finds the rig, crosses the Furnace, obtains the condenser/cipher and returns to Mara. It then rests, enters the Bell Engine, clears its encounter and uses the listening terminal. It reaches Act II and saves successfully. It never edits crew/enemy HP, resources, XP, inventory or quest flags. All battles use ordinary AP, ammo, reloads, healing, routes and enemy activations. Its run took nine encounters and five hostile rounds. Bot speed is not player playtime.

**Prepared continuation:** A separate fixture starts a level-seven crew with marksman rifles, mesh, grounding gear, supplies and the already-earned Act II prerequisites. From the actual public charter transaction onward, the bot uses normal actions: Dead Rail hatch to Junction, Abyss descent, Cold Foundry couplers/Marshal, governor return, Orchard exchanges, manifest/rescue, Anik's reunion, Heart couplers/Receiver and public conclusion. It does not rewrite health, AP, resources, enemy HP or campaign flags during that route. It completes the continuation in nine hostile rounds. This proves a complete executable route, not organic difficulty for every build. Other ending availability/payouts use controlled fixtures.

**Prepared expedition:** A level-four crew with carbines, mesh and supplies starts the Mill normally. The bot traverses the approach, recovers middle-floor freight, opens the drive, clears the optional reserve through normal encounters, obtains the deep cache and extracts. It banks the real haul/harness and reloads the saved result. It takes three hostile rounds. There are no position/health/AP/resource edits after the starting fixture. Drowned Post and Carriage Zero outcomes have fixture coverage, not equivalent normal-action playthroughs yet.

**Retained simulations:** The fresh-opening test exercises earned calibration/skills independently. Existing prepared convoy and dispatch-defense bots also run ordinary turns, damage, ammunition and movement. The defense test actually damages the relay and wins by clearing its attackers; its repair and full three-round holdout branches are separate fixtures.

These are deterministic bots using the same engine order APIs as controls. They are not human playtests or wholly pointer-driven recordings. No gameplay-hours estimate is supported.

## Controlled fixtures and practical input

Fixtures intentionally place actors, assign equipment/resources, mark prerequisites or alter component/enemy HP to isolate mechanics. They cover all twenty formal jobs' data/doors and the existing sixteen job conditions, plus the new rescue settlement, charter branches, Redoubt peace, governor payment and new conclusion transactions. The new amnesty/evidence descriptions and rewards are authored choices; a full human playthrough of every branch has not been done.

Expedition fixtures exercise all three families through primary/deep-cache/extraction transactions. They check that seeds survive validation, layouts vary, story populations stay unchanged, quiet checkpoints/imports work, withdrawals/defeats recover the appropriate crew/state, and later trips cannot pay unlimited currency/ammo. Malformed run imports cannot leave the active game's generated definitions replaced. Boss fixtures test Marshal shield damage, an actual feed-isolation transaction, Receiver's two-tether requirement, real surge damage and coolant suppression when ordinary gunfire has no line of sight.

The legacy excavator fixture checks its shields, both breakers, phase transitions, announced floor attack, coolant, victory and investigation conclusion. Its completion segment resets fixture AP; a normal-AP excavator clear remains unrun.

Actual browser input covers walking/climbing with generous ladder capture, interrupting click routes, pointer shots, Q/Space target changes and no-cost invalid shots, touch movement, equipment tabs, cutting a collision barrier, a full lift ride and pointer-aimed grapple. Real file chooser checks reject corrupt saves, migrate old progress, recover from pre-import winch state and restore an active seeded expedition. Journal pages and portrait bounds are exercised in the new UI suite. Physical-device usability is still untested.

Visual raster checks use the actual shared renderer: all seventeen weapon profiles differ under identical kit/color, all six armor silhouettes differ, and nine gear states including empty have distinct output. New machinery also uses its phase's actual held weapon. Screenshots were visually inspected; distinct pixels alone are not presented as finished art.

## Scope and limits

- Playable compact five-act campaign with three authored conclusions; 29 permanent story districts; twenty formal side quests/contracts; three expedition families across nine separate work rooms; four retained short dispatched jobs.
- Four recruitable companions with three active slots remain. Seventeen weapons, six armors, eight gear patterns plus empty, six mods plus factory parts, four passive talent tracks and six active abilities. Calibration remains per fighter/weapon.
- No human full campaign, organically developed late-game balance run, solo study, measured duration or extended economy session has been completed. The eventual 8–12/15–25-hour targets are not release claims.
- Drowned Post, Carriage Zero, alternative seed cases, every ending branch and the legacy excavator need more normal-action/human clears. Fixture coverage is reported separately from completed normal-action routes.
- Expedition layouts are authored; seeds select patrol/cache/hazard cases. No arbitrary room generation, procedural campaign or endless randomized loot. Withdrawal attempts count toward material caps. First-time patterns remain obtainable after earlier failed trips.
- Bosses have real components/phases/surges; a commander calls one reserve. There is no general reinforcement director, universal environmental AI, fully animated enemy navigation or complete tactical planning simulation.
- Anik's rescue uses an authored safe return passage, not a damageable escort. Ambient residents perform small visual movements, not schedules/economies. Charter trust is a small authored relationship system, not territorial faction warfare.
- Grapples, lifts, diving and barriers retain authored rules. Abyss counterweights are atmospheric moving machinery, not general physics carriers. No mining, freely driven vehicle, procedural destruction or free swimming.
- Quiet expedition checkpoints persist all run progress. Combat and controlled transit cannot save. Short dispatched jobs still preserve pre-entry checkpoints only. No cloud saves or multiplayer.
- Older 0.2–0.5 saves migrate; Alpha 1 does not. New saves must not be opened in older builds. Browser storage is origin-specific; export before moving files/devices.
- Optional synthesized audio controls work; no score, voice acting or formal listening/device-volume test. No physical iOS/Android, Safari, Firefox, gamepad, screen-reader or low-end performance certification. Bindings remain fixed.
- No new external live design research was performed. The supplied code and established design knowledge informed this pass. Previous research/source distinctions remain in DESIGN.md.

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
python tests/greater_test.py
python tests/greater_play_test.py
```

The game has no runtime packages, external assets or services. Development checks require Python Playwright and `/usr/bin/chromium`. Test APIs exist only with `?test`; isolated contexts are necessary because fixtures start new expeditions. Campaign scope and Alpha 6 priorities are in [ALPHA_5.md](ALPHA_5.md).
