# Alpha 7 validation

All **12 suites passed, with 1059 reported checks** and zero reported browser page errors. Additional Python assertions verify portrait/tablet bounds, compact active-boss status, coarse-pointer interaction cycling and standalone offline execution. Exact output is retained in [TEST_RESULTS.txt](ALPHA_7_TEST_RESULTS.txt). The previous [Alpha 6 report](ALPHA_6_TESTING.md) and its raw output are archived separately.

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

## Fresh gameplay evidence

`ward_play_test.py` begins with the actual starter kit. It talks to Nell, recovers the starter cache, traverses and fights through three Service Drains areas, banks Sunday Best and an incomplete Funeral Bell frame, builds the workshop and housing, follows a newly appearing scavenger camp, recruits Vera, reaches the Pump Test Annex through the Cableworks, operates its isolator, clears its watchers, recovers the governor and rescues Rill. It returns to Edda, reunites the engineers, restores/equips the Bell through the actual interface, repeats the expedition with a changed work order, completes its optional deep objective and extracts again.

The bot makes no resource, health, XP, quest, inventory or world-state edits during that route. It uses real path orders, AP, ammunition, enemy turns and equipment buttons, with a deterministic random seed. Its helper waits for following crew to reach service positions. Main-story quest acceptance and relay power remain unset. The run executes **16 encounters / nine hostile rounds**, with 26 reported assertions and validated saves. It is not a human playtime or balance study.

The existing campaign bot still completes the fresh introductory act, a prepared late-act continuation through the public ending, and a prepared ordinary-AP Mill run. Its late continuation and Mill begin from declared prepared fixtures. Existing fresh-opening, dispatched-defense, convoy, recruitment, keyboard/pointer/touch, equipment parity and machinery tests remain.

## Controlled Alpha 7 evidence

The life suite covers old ownership migration, optional-room migration, rejected malformed state, optional tracking, saved regional encounters, supply/standing choices, unique-event non-repetition, seven projects, named residents, limited merchant stock, treatment, both engineer outcomes, both restorations, reunion costs/rewards and persistent combined state. It checks all three work orders on all five families: task objects, saved assignment/layout, task conditions, at-risk payout and duplicate-reward rejection. It also tests net late rewards on a fee-bearing route, no renewable XP, stock restocking, home weapon displays, real walking return guidance and chaining against a melee-equipped victim.

Fixtures intentionally place actors, clear hostiles, grant resources or set prerequisites. They demonstrate integration and transactions, not organic completion of every event or late equipment hunt. The second restoration, merchant sequence and alternative rescue outcome have fixture coverage; only the Bell/engineer route has the new full fresh gameplay demonstration.

## UI and presentation

The visual suite raster-checks all **23 weapon**, **eight armor** and **eleven gear** states, shared inventory/companion/enemy rendering, identities, animation state and one world draw per fighter. The life suite verifies focus loss leaves gameplay visible while explicit SYSTEM requests still open its menu. Boss checks run during actual combat at desktop, 768-pixel tablet and 390-pixel portrait sizes; the portrait campaign check keeps the fighter between the crew dock and tactical controls. A coarse-pointer tablet context taps the start button and exposes NEXT for overlapping interactions.

The portrait regression exposed old overlay code assigning a bottom position to the new top-anchored boss panel; that conflict was removed. Return-guidance testing also exposed a missing exploration-mode flag; the button now follows a real route without teleporting or extracting. Watching companions no longer abandon their positions to auto-follow.

Staged settlement, ledger and tablet risk-report screenshots were inspected. The fresh-return image comes from the normal-action bot. The Ward suite includes a 60-render headless sample; its exact timing is in the output. This is not a physical-tablet frame-rate, input-latency or long-session measurement. Audio controls and synthesis paths execute in browser tests; human listening quality is not certified.

## Build, preservation and offline checks

Run `python tools/build.py` from the checkout, serve with `python -m http.server 8000 --bind 127.0.0.1`, then run the twelve `python tests/<name>_test.py` commands listed in README. The prepared environment supplies Python 3.12.14, Node 24.19.0, Python Playwright 1.62.0 and `/usr/bin/chromium`; there are no application package-install steps. Socket/browser commands use the supported execution context outside the restrictive command sandbox.

All source JavaScript and extracted assembled script blocks passed `node --check`. Rebuilding twice produced identical output. `git diff --check` passed. The preserved Alpha 6 HTML includes the user's UI fixes and has SHA256 `ee8cab91c3aabb4a92b8a49c530e510e095c9cf48fb5d552218dc770715d89cb`; its 14-check fresh optional baseline passed before Alpha 7 feature work. Original supplied references and preserved Alpha 5 remain unchanged.

Managed Chromium denies direct `file://` navigation. That operation remains **unverified here**, rather than counted as a passing offline test. The Ward suite establishes a local origin, turns networking offline, executes the complete standalone HTML, starts normal play and verifies the absence of `UG_TEST`. This demonstrates dependency-free standalone content execution under the supported browser route.

## Limits

No physical iPad/phone or human first-hour/full-campaign playtest was performed. Measured duration, accessibility at enlarged text sizes, organic late-game economy, every survey case with every crew build, all relic acquisition paths and every ending with naturally earned equipment remain unrun. The current results validate executable routes, saved state, bounds and effects under automation. [Scope, partial implementations and next-milestone recommendations](ALPHA_7.md) describe the practical limits.
