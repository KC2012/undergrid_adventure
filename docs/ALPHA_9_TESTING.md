# Alpha 9 validation

**19 suites pass, with 1305 reported checks and no page errors.** [Raw results](TEST_RESULTS.txt). Historical [Alpha 8 validation](ALPHA_8_TESTING.md) and [output](ALPHA_8_TEST_RESULTS.txt) are preserved separately.

| Suite | Reported checks |
| --- | ---: |
| `browser_test.py` | 363 |
| `expansion_test.py` | 141 |
| `visual_test.py` | 74 |
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

## New physical and input coverage

`geometry_test.py` uses declared room/actor fixtures to test vertical and diagonal shots through the authored Cableworks hatch, reciprocal hostile LOS, neighboring solid-deck blockage, shared rendered sections, legal/blocked lob trajectories and actual grenade/shot costs and damage. It verifies zero-cost blocked throws, jump preview/AP/endpoints and airborne arcs, controlled tactical drops, one-way drops and solid-floor refusal, the Ward shelf route, three followers crossing a broken catwalk, a multilevel ladder recovery and a follower actually falling to regain footing before returning. Combat winching moves only its selected fighter for two AP, and intervening steel blocks its cable.

Actual keyboard input then runs and jumps across the Cableworks gap, climbs through the Ward hatch, selects fighter four and executes an actual S+Space tactical drop. A coarse-pointer Chromium context at 1024×768 and 390×844 executes touch DROP and checks viewport bounds and the four-person dock. Screenshots are inspected visually. These are emulated tablet/phone inputs, not physical Safari or performance certification.

## People, choices and old saves

`open_test.py` declares positioned fixtures for workshop repair alternatives, paper/terminal investigation, a purely atmospheric letter without money or XP, all seven companion recruitments, four-active/four-reserve storage, the three new personal contracts, an actual tactical checkpoint negotiation, marked-spared/no-kill accounting, the existing toll objective, free crew treatment and cargo recovery, medicine donation, once-only payout rules, sparse seen reactions, equipment/bond retention and malformed-record/fifth-active rejection. A terminal repair preserves a pre-existing personal atlas note.

The suite creates a genuine save with three crew in the preserved **Alpha 8 HTML**, imports it through the Alpha 9 file chooser, checks location/crew/additive state, then saves and validates it again. The old actor position falls in the newly broken catwalk, exercising safe import footing. Existing Alpha 7 real file import and older migration fixtures also pass. This does not claim that an Alpha 9 four-person save can be opened in old builds.

## Fresh normal-action adventure

`open_play_test.py` starts with the normal kit and does not edit health, resources, XP, AP, equipment or quest progress. Its bot uses real route orders, combat actions, supplies, recruitment controls and work-board transactions. It repairs the workshop for earned salvage, recruits Nim and Vera, reads the paper survey, brings Orren out, crosses the broken upper deck with four fighters, completes Nim’s personal job and changes the roster at the Ward. It saves/reloads the shortcut, quest and crew. The opening main story remains unaccepted. Recorded run: **four encounters / two hostile rounds**. This is functional acquisition evidence rather than a human balance or duration claim.

## Existing campaign and regression coverage

All sixteen prior suites pass. `greater_play_test.py` completes a fresh Bell Engine introduction, an explicitly prepared late-campaign continuation through the public ending, and a prepared multi-area Mill run through its deep reserve. `ward_play_test.py` completes the fresh optional expedition, workshop/housing/restoration loop and a repeat work order. `cartography_play_test.py` completes normal fresh navigation/recruitment/story prerequisites and a prepared Carriage Zero deep reserve. The late continuation fixtures are documented as prepared, not organic full-game acquisition from zero. Together they verify the existing five-act progression path; multi-hour pacing and four-person late-game difficulty are not established.

Other coverage includes all equipment rendering and forecasts, enemy roles, destructible cover, machinery, gated doors, boss phases, stock/workshop transactions, map masks/notes/pins/trams, dispatch jobs, save validation, mouse/keyboard/touch input and responsive overlays. The original roster expectation was updated for the new fourth slot; grapple endpoints now assert supported rims. The atlas route assertion permits a real discovered powered tram when that is the shortest route.

## Reproduce

Build with `python tools/build.py`, then serve the repository using `python -m http.server 8000 --bind 127.0.0.1`. The suites require Python Playwright and `/usr/bin/chromium`; run `python tests/<suite>_test.py` against that local server. Each suite uses its own browser context. The opt-in `?test` hooks do not appear during ordinary play. Source syntax checks and `git diff --check` also pass.

[Scope, compatibility, limitations and next priorities](ALPHA_9.md). [Four-person Cableworks view](screenshots/alpha9-crew.png) · [Phone controls](screenshots/alpha9-phone.png) · [Tablet controls](screenshots/alpha9-tablet.png).
