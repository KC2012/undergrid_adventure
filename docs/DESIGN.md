# Design direction

## What the supplied games taught us

The Alpha 1 source contains a useful persistent-state RPG loop, several equipment types, discovery flags, party bonuses, sector gates, shops and a portable HTML delivery model. Its room generation and out-of-world shootouts would need substantial changes to deliver the exploration requested here. Its numerical breadth is not carried forward as a claim of finished content.

The original Undergrid source was inspected around its weapon definitions, fighter renderer, shooting presentation, ammunition service, cover/LOS, AP, overwatch, armor and grenade systems. Its tactical gunplay is the strongest link to the setting. The original's large skirmish/campaign architecture would be cumbersome as this adventure's runtime.

This build selectively adapts the **design and recognizable presentation**: articulated line figures, phosphor industrial palette, side-view positioning, three-AP decisions, weapon range roles, armor penetration, cover penalties, elevation bonuses, reloads, suppression, reaction fire and blast hazards. It is a clean, simplified implementation, not the original engine running inside the RPG. Exact original accuracy formulas, full arsenals, injury rules, crew economies and environmental simulation are not claimed to be preserved. Both uploaded reference files remain byte-identical in `references/`.

## Reference study and research limits

The requested live reference research was attempted for Final Fantasy Adventure, Metroidvania design and SteamWorld Heist. The environment's outbound proxy denied the Wikipedia requests (403). No pages from those requests were read, and no fresh research conclusions are claimed. The following are design influences from established prior knowledge, recorded separately from that unsuccessful live research:

- **Early Final Fantasy / handheld RPGs:** readable local objectives, a safe settlement, distinctive party roles, visible equipment rewards, economical dialogue, and the larger world suggested through concise environmental writing.
- **Final Fantasy Adventure:** exploration and action in a compact world; key tools change where you can go. The powered rig is a progression gate on a previously visible archive hatch.
- **Metroid / interconnected adventures:** revisit familiar geography with a new capability; shortcuts reward mastery of a place. The chapter uses a loop between settlement, Sump, Furnace and Cableworks, with powered rail as a later shortcut.
- **Terraria / Spelunky:** vertical information and risky spatial relationships matter. Floors overlap; shafts create firing lanes; barrels, cover, steam and ladders change approach choices. This build uses authored geometry rather than procedural mining.
- **SteamWorld Heist:** a relevant reference for readable side-view squad gunfights. This implementation uses Undergrid-like hit probabilities rather than copying manual ricochet aiming.
- **Fallout / Jagged Alliance-style pacing:** real-time travel can shift into deliberate AP combat without throwing away the environment's geography.

Suggested sources for later live verification: Nintendo's Final Fantasy Adventure manual, original developer Spelunky level-generation writings, Image & Form's SteamWorld Heist design interviews, and the original games themselves. These are follow-up research recommendations, not sources consulted during this build.

## A place rather than a corridor

Six districts share a fixed 1000-unit vertical coordinate space. Each has three or four elevations, hand-placed objects, bidirectional entrances, platform-specific ladders and a distinct regional palette. World dimensions do not change when a browser resizes. Pathfinding uses the actual platform/ladder graph, shared by player click-movement, following companions and enemy repositioning.

The core adventure is: settlement → expedition → encounter → meaningful discovery → return/progression → new route. The fuse restores settlement services. The rig opens an elevated archive hatch. The condenser and cipher prepare the final bulkhead. Party recruitment changes combat resources and survivability. Optional pump, valve, lore and armories reward deviation from the main route.

## Expansion priorities

1. Playtest encounter duration and difficulty with human players, especially solo play and portrait touch controls.
2. Add a second authored chapter and one meaningful alternate quest resolution before multiplying sectors.
3. Expand traversal abilities beyond a hatch gate: a lift/power-routing puzzle and a physically usable ascender are natural next steps.
4. Extract combat and rendering into further source modules once content growth makes that useful; retain the standalone build pipeline.
5. Improve enemy movement animation, navigation previews, encounter grouping and companion path resilience around jumps.
6. Add optional audio, configurable bindings, color/contrast options and a dedicated touch target-inspection mode.
7. Consider specialist ammunition, abilities and faction consequences only when they produce decisions beyond extra statistics.
