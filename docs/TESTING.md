# Validation / Alpha 3 (build 0.4)

## Executed in this environment

- Built the portable HTML with Python 3.12; syntax checked all seven JavaScript source files with Node 24.
- Chromium / Python Playwright suites: core gameplay, Ward Bound regressions, visual acceptance and Living Undergrid integration. **436 reported checks passed, with zero browser page errors.** Detailed output is retained in TEST_RESULTS.txt.
- Inspected the full weapon and armor render sheets, live inventory, portrait equipment screen, Vent Cathedral and the mechanical boss scene.
- Confirmed original reference files remain unchanged.

### Visual acceptance first

Before environmental expansion, the first visual milestone passed 51 checks. The final suite grows with the new companions and enemies. It rasterizes all fifteen equipped guns under identical colors/armor and confirms fifteen distinct results; does the same for six armor silhouettes and seven gear states; checks identity differences in identical kit; and checks companion/enemy equipment mappings. Inventory and world model fields are tested through actual equip buttons. Reload/fire events drive the model's animation state. World draw counters confirm one render per fighter.

The render sheets were also visually inspected. Distinct pixels alone are not presented as proof of good art. Original Undergrid canonical weapon paths were deliberately adapted, with a shared drawing model for the world and previews. Modifications add smaller physical details. No duplicated crew loop existed in the starting 0.3 renderer; the audit preserved one draw loop and replaced the fallen-actor shortcut with the shared model.

### Gameplay and campaign regressions

The core suite exercises real keyboard movement and interaction, ladder ascent, pointer encounters/shooting, round completion, saving/continue, touch movement and screen bounds. Controlled fixtures check paths to every interactable, with explicitly marked grapple ledges distinguished from ordinary ladder destinations. Existing AP/ammo, combat, recruitment, opening quest gates and progression remain covered.

Ward Bound checks all door destination floors, old-save migration, kit effects, talents/retraining, contract choices and route rewards, standing prices, job tracking, replayed salvage sites and safe callsign rendering. Its full convoy combat simulation uses ordinary AP, movement, shooting, reloads, healing and enemy turns with prepared equipment and deterministic randomness; it does not edit enemy HP during that fight.

### Living Undergrid integration

Controlled fixtures test 0.3 migration, residential repair/peaceful resolution, investigation rewards, repeated grapple use in three rooms, saving deferral in transit, clinic treatment/diving access, Sable's healing and free rescue utility, Latch's shock resistance, roster swaps, reserve saves in smaller rooms, the powered lift, valve damage/removal, hazard-aware enemy route costs, barrier geometry, repeated cutter uses, real arc-ammo consumption, pump/quest state, and persistent world changes.

The mechanical boss fixture tests shield immunity, both control breakers, three phase states, exposed damage, announced floor damage, coolant immunity, victory/unlock and its investigation conclusion. The completion segment uses weapons and magazines with fixture AP resets; **it is not a full normal-AP boss playthrough or a human balance result**. Component interactions are real game operations. No claim of an unassisted boss clear is made.

Actual browser input separately verifies a closed barrier stops keyboard walking, cutting it allows walking through, operating a lift changes position over time and reaches its upper deck, and T plus a pointer click performs a complete grapple. Inventory previews and portrait bounds are checked. Actual file chooser imports verify a corrupt file leaves the active expedition unchanged and an older file migrates without losing its credits or recorded enemy wound. Audio enable/mute controls run without browser errors; no formal listening test is claimed.

## Implemented content

21 districts, 16 contracts, 54 initial hostile/component placements, four recruitable companions (three active fighters plus reserves), 15 weapon patterns, six armor patterns, six field gear types plus an empty slot, three mods plus factory parts, four talent tracks, 11 machine definitions plus the original furnace shutoff, three reusable field tools, and one staged mechanical boss. The two Tenement guards can be resolved peacefully and are not counted as kills in that outcome.

## Known limits / unrun checks

- This is still an expanded campaign foundation, not a finished massive RPG. A full human playthrough, solo difficulty tuning and long sessions across every route remain unrun.
- Grappling uses authored anchor destinations and a crew winch, not a pendulum or arbitrary-surface physics. Diving unlocks submerged routes; there is no free swimming or oxygen meter. Cutter interactions use authored barriers and doors.
- The lift carries nearby crew through actual world coordinates when operated. It is not a freely moving physics platform that can be jumped onto. Enemy movement remains discrete. Group encounters still include all surviving hostiles in the district.
- Steam-aware route penalties are limited hazard reasoning, not general tactical environmental planning. Tenement Nine has a specific peaceful resolution; no general morale/surrender simulation is implemented.
- Gear is a collection of permanent patterns, not rolled individual items with durability. No crafting weight, faction territory simulation, cloud saves, multiplayer, paid assets or external runtime services.
- Audio uses local synthesized cues and a low ambience tone. No music score, voice acting, formal audition or device-specific audio tuning was performed.
- Chromium desktop and emulated touch/portrait layouts were exercised. Physical iOS/Android, Safari, Firefox, gamepads, screen-reader flows and performance profiling on low-end hardware remain unrun.
- Equipment and machinery are tested in fixtures and selected practical inputs. Not every possible combination has been exhaustively played. Old 0.2/0.3 saves migrate; newer saves must not be opened in older builds. Alpha 1 save migration is not supported.
- Live external design research was network-blocked during the first pass. The original source was inspected directly; see DESIGN.md for research/source distinctions.

## Reproduce

```sh
python tools/build.py
for source in src/*.js; do node --check "$source"; done
python -m http.server 8000 --bind 127.0.0.1
# In another terminal:
python tests/browser_test.py
python tests/expansion_test.py
python tests/visual_test.py
python tests/living_test.py
```

No application packages are required. Tests use the environment's Python Playwright and `/usr/bin/chromium`. Test APIs require `?test`; run them in isolated browser contexts because fixture tests start new expeditions.
