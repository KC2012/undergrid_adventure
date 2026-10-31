# Alpha 8 — Cartography & Combat

Alpha 8 improves navigation and tactical clarity within the existing world. It preserves 30 permanent districts, 23 weapon patterns, twelve exceptional items, seven settlement projects, five expedition families, the three-person crew and five-act campaign. A playable Alpha 7 HTML is preserved in `releases/UNDERGRID_ADVENTURE_Alpha_7.html`.

[Atlas guide](ATLAS.md) · [Combat and balance notes](ALPHA_8_COMBAT.md) · [Original Undergrid review](ALPHA_8_COMBAT_REVIEW.md) · [Player guide](PLAYER_GUIDE.md) · [Testing](TESTING.md).

## Implemented

- Connected, directed world atlas derived from observed real doors, with unknown frontiers, current location, live gate explanations and discovered tram access.
- Geometry-derived progressive local survey and minimap. Platforms, ladders, exits, machinery, services and important observed landmarks persist; loot and secrets are not automatically mapped. Readable symbols, zoom and touch scrolling support smaller screens.
- Optional route plans between discovered districts, per-district pins, 120-character notes and Alpha 7 migration. Planning never issues movement or fast travel.
- Shared attack and movement forecasts: damage, chance, AP, rounds, range, cover, elevation, armor/penetration, effects, actual paths, Dash limits and hazard warnings.
- Intentional volume-fire suppression, visible status/protection feedback and distinct hit/miss/blocked/armor outcomes. Existing overwatch, class tradeoffs and exceptional presentation remain.
- Bounded cover/flanking/target decisions, useful heavy-gun holding behavior and conservative industrial barrel opportunities, while retaining special enemy roles and encounter rules.
- One cover refinement in each of the Cableworks, Ashline and Relay Orchard; a one-AP counter for the Annex live floor. No new enemy HP or damage inflation.
- Real touch inspection/confirmation for attacks and tactical floor movement. Mouse/keyboard remain direct; focus loss still clears keys without opening a menu, and boss warnings remain compact during combat.

## Gameplay evidence

A fresh navigation bot explores the Ward and Cableworks, recruits Vera, surveys the upper decks, records a locked archive passage, pins and annotates the district, earns the climbing rig and Orren through normal encounters, opens the recorded route, restores story prerequisites, plans its return and reloads its partial map. It makes no health, resource, XP, inventory or quest edits. The recorded route takes eight encounters and four hostile rounds.

The same suite then starts a declared prepared tier-five crew and completes all three Carriage Zero work areas and its guarded deep cache using normal AP, ammunition, routes and enemy turns. The prepared crew is strong; this is executable-route evidence, not organic difficulty or a promise of a long encounter.

Separate fixtures prove shared forecast/resolver costs and effects across weapon categories, cover destruction/flanking, real suppression/overwatch, induction isolation, role decisions and friendly-fire hazards. Real mouse, keyboard and touch checks confirm previews/commands and import a save actually produced by the preserved Alpha 7 build. Existing full-introduction, prepared continuation/ending, settlement, restoration and expedition suites remain.

## Known limitations

The world diagram is a topological schematic. It is not a physical coordinate/depth map and does not plan inside-room walking distances. Pins are per discovered permanent district, not arbitrary hand-drawn local coordinates. Local discovery uses coarse proximity cells rather than raycast fog of war. Notes and observations follow the existing quiet-save policy; combat edits persist when the encounter ends.

Cover remains binary and uses a single body ray. Touch inspection applies to actor attacks and tactical floor destinations; the explicit barrel interaction retains its established detonation behavior. Movement hazard warnings sample route segments and do not simulate every future hazard state or guarantee safe arrival. Enemy planning is local and bounded; special bosses/support roles retain their established systems and not every enemy operates every valve.

There is no new enemy-health scaling, wholesale weapon rebalance, skirmish resource model, HMG deployment, advanced grenade-zone simulation or randomized environment director. Secondary explosive chains and future status damage are not fully summed in a direct-hit forecast. No measured human playtime, physical iPad/phone test, accessibility review at large text sizes, long-session soak or organic clear of every late build/ending is claimed. Direct file navigation remains blocked by managed Chromium policy; standalone content execution with networking offline is tested through a supported local origin.

## Alpha 9 recommendations

1. Human-test map discovery, route explanations and touch confirmation, especially understanding directional cover and firing from a platform edge.
2. Test physical tablets, enlarged text and color accessibility; refine atlas layout for a fully discovered graph without adding route spoilers.
3. Organically clear Carriage Zero and other deep expeditions with several crew/equipment builds; measure supplies, turn count and encounter pacing.
4. Add specific environment-aware behavior to one more enemy role after evaluating the bounded planner's actual play quality.
5. Extend hazard sampling and forecast explanations only where observed mistakes justify the extra complexity.
