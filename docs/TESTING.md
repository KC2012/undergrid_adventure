# Alpha 10 validation

**22 suites pass, with 1,404 reported checks and no page errors.** [Raw results](TEST_RESULTS.txt). [Historical Alpha 9 testing](ALPHA_9_TESTING.md) and [output](ALPHA_9_TEST_RESULTS.txt) remain separate.

| Suite | Reported checks |
| --- | ---: |
| `browser_test.py` | 383 |
| `expansion_test.py` | 143 |
| `visual_test.py` | 79 |
| `living_test.py` | 77 |
| `adventure_loop_test.py` | 16 |
| `adventure_systems_test.py` | 60 |
| `dispatch_play_test.py` | 6 |
| `greater_test.py` | 85 |
| `greater_play_test.py` | 14 |
| `ward_test.py` | 90 |
| `ward_play_test.py` | 26 |
| `life_test.py` | 123 |
| `atlas_test.py` | 25 |
| `tactics_test.py` | 80 |
| `cartography_play_test.py` | 14 |
| `cartography_ui_test.py` | 20 |
| `geometry_test.py` | 39 |
| `open_test.py` | 40 |
| `open_play_test.py` | 13 |
| `industry_test.py` | 46 |
| `industry_play_test.py` | 13 |
| `industry_ui_test.py` | 12 |

## New mechanics and compatibility

`industry_test.py` uses declared positions/resources to isolate home-air repair and its alternate cost, bounded claims, pressure windups and zero-damage tells, real armor exposure, moving out of a marked blast, actual burst damage, rare baffle protection, suppression interruption, a slam destroying real cover, kiln telegraphing and a working clear-line machine recharge. It exercises an actual power-control UI transaction for one AP, home-current inspector behavior, reallocation and shepherd isolation, drive repair/reserve activation, real exhaust damage/protection and movement warnings, replacement-order stand-down/no-kill accounting, both auxiliary feed outcomes, a real bounded follow-up delivery, guarded rare-pattern claims and save validation.

The same suite settles Latch’s connected personal work, uses the recovered interface without a specialist and recovers the Orchard field pattern. It rejects malformed outcomes and attack coordinates. A genuine save created in the preserved **Alpha 9 HTML** imports through the file chooser with its saved enemy wound and personal atlas note intact and a newly initialized Walking Foundry. Existing older migration tests still pass.

## Actual new-region play

`industry_play_test.py` declares a prepared midgame starting crew: Rook, Vera, Orren and Latch, earned-level equivalent XP, rifles/mesh, supplies and a reached Skyhooks checkpoint. No health, AP, world, resource or equipment grants occur after departure. The bot then uses actual doors, route orders, combat, supplies, control clicks, investigation and cache transactions.

It enters the Cathedral, repairs home ventilation, clears patrols, reads the ninth-shift roll, restores the existing generator and recovers the baffle. It enters the Walking Foundry, discharges cargo, repairs the stride governor, reads/transmits replacement orders, sends auxiliary supply to homes, clears remaining patrols, ascends to the retrieval rig and saves/restores the result. Recorded route: **eight encounters / four hostile rounds**. It is functional route/acquisition evidence, not a fresh-start midgame balance or playtime measurement.

## Actual input and visual checks

`industry_ui_test.py` clicks the root exchange control in a tactical encounter at 1440×960 desktop, 1024×768 coarse-pointer tablet and 390×844 coarse-pointer phone sizes. It verifies one AP, the actual allocation, four-person viewport bounds, a real hostile activation creating a persistent pressure tell and all five industrial enemy identities rendering exactly once. Representative screenshots were visually inspected. Prior keyboard, mouse, real-file import, touch confirmation, jump/drop, aperture and four-person tests also pass.

Before/after screenshots compare the preserved Alpha 9 and new environment art. They are positioned scene fixtures. [Cathedral before](screenshots/alpha10-vents-before.png) / [after](screenshots/alpha10-vents-after.png); [Orchard before](screenshots/alpha10-orchard-before.png) / [after](screenshots/alpha10-orchard-after.png); [Walking Foundry](screenshots/alpha10-walker.png). [Desktop warning](screenshots/alpha10-desktop.png), [tablet](screenshots/alpha10-tablet.png), [phone](screenshots/alpha10-phone.png).

A local headless 30-render sample at 1440×960 measured approximately **1.74 ms Cathedral, 0.92 ms Orchard and 1.25 ms Foundry per direct render call**. This diagnostic excludes a full frame budget, physical touch latency, Safari and sustained GPU/memory behavior. It is not a hardware frame-rate guarantee.

## Existing regression coverage

All nineteen Alpha 9 suites pass. These include a fresh Bell Engine introduction, prepared late-campaign continuation to a public ending, actual multi-area expeditions, the fresh optional Ward development/restoration loop, fresh Alpha 9 companion/workshop play, equipment, environmental combat, stock/services, boss phases, cartography, machinery gates and save validation. The new region does not replace any campaign requirement. The expansion district-count assertion now expects thirty-one persistent districts; the structural browser suite verifies the new objects are reachable.

## Reproduce and limits

Run `python tools/build.py`, serve the repository with `python -m http.server 8000 --bind 127.0.0.1`, then run each `python tests/<suite>_test.py`. Tests use Python Playwright and `/usr/bin/chromium` in isolated contexts. Evidence paths in these cloud tests use `/workspace/undergrid-alpha10-evidence`. The opt-in `?test` harness is absent in ordinary play. Source syntax, deterministic HTML rebuilding and whitespace checks pass.

An additional inline-document check starts the standalone HTML with all network requests blocked and observes zero asset requests. Direct `file://` navigation is blocked by this managed browser’s administrator policy, so that specific launch mode could not be verified here; ordinary local HTTP save/load is covered throughout.

Long human campaign pacing, organic four-person difficulty, physical iPad Safari and accessibility remain unmeasured. See [scope, exact mechanics, save rules and known limits](ALPHA_10.md).
