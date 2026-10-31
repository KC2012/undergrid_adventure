# Alpha 8 validation

All **16 suites passed: 1,198 reported checks**, with zero reported browser page errors. The suites also contain additional portrait/tablet, local-map zoom, offline-content and control-bound assertions. Exact final output is in [TEST_RESULTS.txt](TEST_RESULTS.txt). Historical [Alpha 7 validation](ALPHA_7_TESTING.md) and its output remain separate.

| Suite | Reported checks |
| --- | ---: |
| `browser_test.py` | 351 |
| `expansion_test.py` | 141 |
| `visual_test.py` | 71 |
| `living_test.py` | 76 |
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

## Navigation and actual save migration

The atlas suite checks partial proximity discovery, actual door edges, unknown frontier naming, multilevel geometry/masking, an observed rig gate, route explanations, tool-unlocked planning, text notes, pins, validated persistence, malformed-cell rejection and discovered powered tram links. Every reported door edge is checked against the real room object graph. Portrait bounds and local-map zoom are exercised through their UI controls.

The real-input suite produces a save using the preserved **Alpha 7 HTML**, verifies that it has no atlas record, then imports it through the Alpha 8 file chooser. Its current room, old map pin and newly migrated atlas validate. This supplements the controlled migration fixture; it is not merely an object produced by the new version with a field removed.

The fresh navigation bot starts with the ordinary kit and makes no health, resource, XP, inventory or quest edits. It explores the Ward and Cableworks, recruits Vera, surveys upper decks, records a locked archive passage, pins and annotates the district, earns the rig and Orren through normal encounters, opens the previously recorded route, restores story prerequisites, plans its return and saves/reloads its partial map. The deterministic run uses **eight encounters / four hostile rounds**. The world/local screenshots are restored from that genuine quiet checkpoint.

## Combat forecasts, environment and role fixtures

The tactical suite resolves real shots for 17 ordinary/exceptional weapon categories and compares actual damage, AP and rounds with the forecast. It tests blocked/no-cost shots, cover direction, ignoring/destruction of cover, a valid elevated ray, exact movement endpoints/AP, unaffordable routes and Dash limits. It demonstrates explicit suppression, a heavy gunner losing its firing opportunity, a real overwatch reaction, industrial friendly fire, one-AP electrical isolation, grounding protection and steam warnings.

It also checks a reachable cover decision, a heavy gun holding its lane, a flanker **actually crossing to the unprotected side before attacking**, and a medic healing an injured ally. These are declared controlled fixtures with actors positioned, weapons granted or prerequisites set to isolate mechanics. They are not presented as organic acquisition or balance demonstrations. A 20-decision local headless timing sample is in the raw output; it is not a physical-tablet latency guarantee.

Forecast testing caught explosive weapons omitting their primary blast from the displayed total. The shared forecast now includes impact and primary splash. A wrong elevated fixture was corrected to a real platform-edge ray rather than relaxing steel obstruction. Target vulnerability scoring is used both when choosing a position and when choosing the eventual attack.

## Real input and complete routes

Mouse hover and clicks verify movement-preview cost/endpoints and attack AP/ammunition. Keyboard 2 and Q switch the actor and target. Coarse-pointer tablet taps inspect a hostile without spending resources, fire on the second tap, preview a floor route without spending AP and execute that preview on the second tap. The same viewport is checked at 390 pixels for page overflow. The new movement confirmation is confined to touch combat; ordinary exploration and direct mouse input remain.

The navigation suite separately starts a declared prepared tier-five crew and completes Carriage Zero's approach, work floor and guarded deep reserve using ordinary paths, AP, shots, supplies and turns, then banks its deep-cache weapon and reloads. The strong prepared crew needed **one hostile round** across the recorded trip. This demonstrates a complete executable route, not organic tier-five difficulty or a duration claim.

The retained campaign suite completes the fresh introductory act (**nine encounters / five hostile rounds**), prepared late-act public ending (**seven hostile rounds**) and prepared Mill (**three hostile rounds**). The retained fresh restoration/repeat-expedition route still passes (**16 encounters / nine hostile rounds**), alongside settlement services, both restorations, companion systems, dispatch, machinery, all families/work orders and corrupted-import checks.

## Build, preservation, presentation and offline operation

All JavaScript source files and extracted assembled script blocks passed `node --check`. Building twice produced identical HTML; `git diff --check` passed. The preserved Alpha 7 HTML SHA256 is `726f71e14d05678b09bc933aaf84deecbddb42f6dc0fa576730253ff7100c802`. Its 26-check fresh baseline passed against the preserved file before feature work. Original reference files and earlier release snapshots remain unchanged.

World/local atlas and desktop/tablet/portrait tactical screenshots were inspected. The shared renderer still passes distinct-raster checks for 23 weapons, eight armors and eleven gear states. Existing focus-loss and compact active-boss checks remain. No external app dependencies or paid APIs were introduced.

The environment provides Python 3.12.14, Node 24.19.0, Python Playwright 1.62.0 and `/usr/bin/chromium`. From the existing checkout, run `python tools/build.py`, serve with `python -m http.server 8000 --bind 127.0.0.1`, and run the 16 commands in README. The command sandbox requires the supported outside-sandbox context for local sockets and Chromium; no network policy broadening or verification bypass was used.

Managed Chromium blocks direct `file://` navigation, so that operation remains **unverified here**. The retained Ward suite establishes a local origin, disables networking, executes the complete standalone content, begins normal play and checks that the test API is absent. This demonstrates dependency-free offline-content execution through the supported origin.

## Limits

These are automated deterministic bots, controlled fixtures and real browser input checks. No human first-hour/full-campaign study, physical iPad/phone test, extended soak, enlarged-text accessibility review or organically earned clear of every late build/ending was performed. The tier-five fixture uses a strong prepared crew. Atlas fog is coarse proximity observation; enemy decisions are bounded local heuristics. See [Alpha 8 scope, unfinished areas and Alpha 9 recommendations](ALPHA_8.md).
