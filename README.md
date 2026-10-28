# Undergrid Adventure: Ward Bound

A standalone, offline side-view survival RPG built from the supplied Adventure alpha and original Undergrid references. Explore **16 connected districts**, recruit a three-person crew, take ten linked contracts, restore a freight locomotive and unlock new routes. Customize each fighter with 15 weapon patterns, six armor patterns, field gear, modifications, talents, a callsign and a color. Combat takes place on the platforms and ladders you explore.

**0.3 / Ward Bound:** the stakes are a living wage, clean water, old grudges and people worth coming back for. The first Last Light mission still opens the railway. The story keeps the deeper Undergrid lore implied. Existing 0.2 saves migrate automatically; export a backup first.

**Play:** open `UNDERGRID_ADVENTURE.html` in a modern desktop or mobile browser. No installation, account, assets, CDN, or Internet connection is required. If your browser restricts local files or storage, serve the directory:

```sh
cd /workspace/undergrid_adventure
python -m http.server 8000 --bind 127.0.0.1
```

Open the served `UNDERGRID_ADVENTURE.html` in your browser. Save storage is specific to the browser and origin; use SYSTEM → EXPORT before switching origins or devices.

## Development

```sh
python tools/build.py
node --check src/data.js
node --check src/game.js
```

- `src/data.js`: hand-authored rooms, platform/ladder graph, NPCs, equipment, enemy archetypes.
- `src/game.js`: state, save validation, exploration, routing, combat and canvas presentation.
- `src/expansion-data.js`: additional authored districts, arsenal, equipment and contracts.
- `src/campaign.js`: save migration, gear/talent effects, jobs, bonds, grudges, crew dock and campaign menus. Its code is inserted inside the engine closure by the build script.
- `src/style.css`: responsive terminal UI.
- `src/index.html`: application shell.
- `tools/build.py`: assembles readable sources into the complete portable HTML release.
- `tests/browser_test.py`: browser integration suite (Python Playwright and Chromium required for development testing only).
- `references/`: unmodified supplied games. They are not loaded by the new game.

Run the browser suite while the local server is running:

```sh
python tests/browser_test.py
python tests/expansion_test.py
```

The test URL opts into an isolated harness with `?test`. Normal play exposes no test API. Use the existing checkout in cloud tasks; it is already isolated and does not require a worktree.

See [player guide](docs/PLAYER_GUIDE.md), [design notes](docs/DESIGN.md), [release notes](docs/CHANGELOG.md), and [validation / limitations](docs/TESTING.md). This is a substantially expanded playable campaign foundation, not a finished massive full-length RPG. See the validation report for the distinction between fixture tests, input tests and the simulated convoy encounter.
