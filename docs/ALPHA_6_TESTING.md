# Alpha 6 validation

All eleven Chromium / Python Playwright suites completed successfully: **916 reported checks**, with zero reported browser page errors. There are also explicit portrait-width and standalone offline assertions. Exact output is retained in [TEST_RESULTS.txt](ALPHA_6_TEST_RESULTS.txt). Historical Alpha 5 evidence is [preserved separately](ALPHA_5_TESTING.md).

| Suite | Reported checks |
| --- | ---: |
| `browser_test.py` | 346 |
| `expansion_test.py` | 139 |
| `visual_test.py` | 71 |
| `living_test.py` | 76 |
| `adventure_loop_test.py` | 16 |
| `adventure_systems_test.py` | 60 |
| `dispatch_play_test.py` | 6 |
| `greater_test.py` | 85 |
| `greater_play_test.py` | 14 |
| `ward_test.py` | 89 |
| `ward_play_test.py` | 14 |

Run from `/workspace/undergrid_adventure` with `python -m http.server 8000 --bind 127.0.0.1` in another session, followed by each `python tests/<name>_test.py` command above. The environment already provides Python 3.12.14, Node 24.19.0, Playwright 1.62.0 and system Chromium. Browser/socket commands use the supported execution context outside the restrictive command sandbox.

## What the evidence demonstrates

The new **fresh optional-loop** bot starts with an ordinary solo starter kit. It talks to Nell, takes the starter stash, traverses all three Service Drains areas, fights six encounters using ordinary ammunition/AP/turns, recovers Sunday Best and the Funeral Bell, extracts primary freight and machinery, commissions and completes the workshop, equips the shotgun and reloads a validated save. It never accepts the main quest, restores Mara's power, or edits health, inventory, resources, XP or quest progress. Five hostile rounds were needed in this deterministic run. Bot speed is not human playtime.

The controlled Ward suite separately checks all seven project costs/dependencies, repeated-payment rejection, construction saves and actual rendered differences; services; twelve valid relic landings; rumor/listening access; escrow save/load, withdrawal loss and retry; equipment shooting effects, AP and ammo, armor/movement tradeoffs, extended grappling, optical hit-chance reduction and modification effects; renewable-return limits; receiver-repair leads; malformed cargo rejection; journal navigation; and the equipped gallery. Its fixtures intentionally place actors, clear enemies or grant equipment to isolate mechanics. Those fixtures are not fresh playthroughs of all acquisition routes.

Existing suites retain real keyboard/pointer/touch checks, all reachable story interactions, shared equipment rasters, companions, audio/machinery, save migration, dispatch combat, all five expedition families, malformed imports and the full main-campaign continuation. The existing campaign play bot still completes the fresh introduction, a prepared continuation through the public ending, and a prepared normal-AP Mill run. The late continuation and Mill begin from declared prepared fixtures, not organically developed crews.

## Build, references and offline operation

`python tools/build.py` rebuilds the standalone release. Every JavaScript source passes `node --check`; extracted assembled script blocks also passed syntax checking. Rebuilding twice produced identical bytes. The provided original reference remains unchanged. The preserved Alpha 5 HTML has SHA256 `c7163026e3ba96bf695bcccffeab0397f7ee0fac22ef3675d06f1aeec7d3b154` and matched the uploaded Adventure reference exactly. Its baseline core browser suite passed 293 checks before development.

Managed Chromium denies `file://` navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`. Therefore direct-file opening was **not verified in this environment**. The standalone-content assertion instead establishes a local origin, disables networking, injects the complete release HTML, begins normal play and verifies Disintegration Ward and the absence of the test API. No external dependency is required by that execution. Local HTTP serving and meaningful gameplay requests were verified independently.

## Presentation, performance and limits

The visual suite distinguishes every one of 23 weapon, eight armor and eleven gear renders. Desktop gallery, developed settlement and portrait facility views were inspected. The complete settlement image is a staged fixture; the workshop image comes from the fresh optional bot. A synchronous 60-render headless desktop sample was sub-millisecond per frame in the final controlled run; exact timing is in the raw output and does not measure input latency, long sessions, mobile devices or a universal frame-rate guarantee.

No suite failed in the recorded final results. Human balance, measured campaign duration, physical-device testing, every seed, every ending with organic gear, and fresh full playthroughs of all relic hunts and Signal Ossuary remain unrun. See [implemented scope, known limits and Alpha 7 recommendations](ALPHA_6.md).
