# Validation and limitations

## Executed in this environment

- Built the portable release with Python 3.12.
- JavaScript syntax checked with Node 24.
- Ran `python tests/browser_test.py` in headless Chromium using installed Python Playwright: **82 reported integration checks passed; zero browser page errors**.
- Inspected desktop exploration, desktop combat and portrait touch screenshots.
- Verified the uploaded reference copies against their originals with SHA-256.

The browser suite tests actual keyboard movement and Mara interaction, keyboard ladder ascent, pointer-route hostile detection, pointer firing, end-turn completion, continued saves through the menu, touch movement and narrow-screen overflow.

Its other checks are explicitly **controlled fixture tests**: shortest routes to every authored interactable; valid/invalid save schemas; AP/ammo/damage/reload/heal; overwatch reaction; enemy-round completion; steel LOS; explosive cover/barrel interaction; victory XP and non-duplicated rewards; movement AP limits; retreat through the atlas; companion recruitment; quest gates, rewards and chapter completion; equipment ammo conservation; and full chapter save round trip. The quest walkthrough positions the player and clears hostiles directly to isolate narrative integration. It is not a claim of an unassisted human playthrough or of balanced end-to-end combat.

## Known limits

- This release is one opening chapter: six districts, 14 hostile placements across five combat districts, five enemy archetypes including one boss, four firearm types, two recruitable companions and one main quest with optional discoveries. It is not a massive finished RPG.
- The climbing rig unlocks the archive hatch; it does not yet provide a freely aimed grapple or new climb physics.
- Combat involves all surviving hostiles in a district, not independently staged encounter groups. Some multi-floor fights can take several repositioning rounds.
- Enemies reposition in discrete steps with a movement trace. Companions animate along routes. Enemy movement is not a fully animated navigation simulation.
- Platforms block shots; railing art does not. Crates and barrels are destructible, platforms and settlement structures are not. There is no terrain mining or full destruction system.
- Four guns share one abstract ammunition pool. No attachment, crafting, faction reputation, extensive dialogue trees, procedural world, sound or music system is implemented.
- Companions follow ladder routes, not arbitrary jumps. They can lag behind if the selected character drops to a disconnected position; ordinary authored ladder routes and door travel regroup them.
- No multiplayer, cloud saves or Alpha 1 save migration. Browser storage restrictions can require local HTTP serving or JSON backups.
- Browser automation ran in Chromium only. Firefox, Safari, iOS physical devices, gamepads and extended human balance/soak playtests remain unrun.
- Live external research was network-blocked; see DESIGN.md for the distinction between inspected source, prior design knowledge and recommended future research.

## Reproduce

```sh
python tools/build.py
node --check src/data.js
node --check src/game.js
python -m http.server 8000 --bind 127.0.0.1
# Separate terminal:
python tests/browser_test.py
```

No application dependencies are installed by these steps. Browser testing needs Python Playwright and a system Chromium executable at `/usr/bin/chromium`; both were already present in this environment.
