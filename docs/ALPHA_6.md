> Historical Alpha 6 scope. Current behavior is documented in [Alpha 7](ALPHA_7.md).

# Alpha 6 — The Living Undergrid

Alpha 6 adds a persistent home-development and optional-discovery loop to the existing five-act campaign. The release remains one offline HTML file. `releases/UNDERGRID_ADVENTURE_Alpha_5.html` preserves the verified incoming build; the two supplied reference files remain unchanged.

## Implemented

- Disintegration Ward replaces the former settlement name in current presentation. `hearth`, quest flags, storage key and save version remain stable. Older journal notes migrate on load.
- Seven resource-funded facilities have visible construction and completed scenery, working services and persistent progress. Construction takes eight seconds of active, peaceful time in the Ward; it pauses elsewhere and in menus.
- Twelve named exceptional patterns: six weapons, two armors, two field tools and two modifications. Effects use the normal combat, movement and equipment systems. Their patterns are shared with companions.
- Nell introduces optional work and two relic leads before any main quest. The Service Drains are available immediately. The restored freight depot opens Signal Ossuary. Both contain three connected authored areas; the original Mill, Drowned Post and Carriage Zero remain.
- Rumors distinguish heard leads, investigated regions and banked discoveries. Expedition relics remain cargo until a successful primary-freight extraction; withdrawal and defeat lose that cargo. Quiet saves preserve it.
- Six fixed local opportunities: courier aid, missing freight, hoist repair, housing dispute, surgical-machine investigation and receiver repair. They have finite rewards and do not change campaign objectives.
- Residents carry scrap, workers attend restored facilities, freight moves at the restored depot, workshop sparks and receiver/power machinery animate. Decorative actors have no collision or combat AI. Workers appear on selected safe regional routes.
- A personal bunk interface displays recovered trophies and opens the shared collection and roster. The existing cot remains the resting/checkpoint service.
- Shared canonical weapon art, category-dependent arms, unique exceptional weapon attachments and equipment silhouettes, and a full equipped inspection gallery.

## Guides

[Settlement upgrades](SETTLEMENT.md) · [Exceptional catalog](EXCEPTIONAL_EQUIPMENT.md) · [Artwork audit](WEAPON_AUDIT.md) · [Expedition access](EXPEDITIONS.md) · [Player guide](PLAYER_GUIDE.md) · [Tests](TESTING.md).

## Known limitations

Ambient activity is a lightweight visual system with persistent facility/quest conditions, not an autonomous settlement economy or simulated traveling population. Optional encounters are authored local interactions, not randomized roaming gangs or a rotating bounty director. The two new expeditions share the existing three-area freight/deep-cache objective framework; Signal Ossuary adds its receiver event and a different vertical layout. Construction has one short intermediate state per facility, not multiple upgrade levels.

The Funeral Bell pushes along a safe platform; it does not knock enemies off ledges. Dead Air uses an opening-round bonus rather than a stealth-awareness simulation. A Forest provides continuous optical evasion, not invisibility or a temporary concealment action. The Hanging Man uses existing anchors, not arbitrary grappling points. Weapon animations retain the established lightweight procedural effects; there is no full animation-system rewrite or port of original Undergrid's unrelated HMG deployment rules.

The fresh Service Drains/workshop loop has normal-action bot coverage. Signal Ossuary, many relic acquisitions, local events and most facility combinations have controlled integration coverage rather than equivalent fresh full playthroughs. Physical mobile devices, long sessions, human balance, every ending choice with organic equipment, and difficulty across all crew compositions remain untested. Render timing is a local headless measurement, not a hardware-independent performance promise.

## Alpha 7 recommendations

1. Human playtest the fresh optional loop and tune its ammunition pressure; test an organic Signal Ossuary run and all late relic hunts.
2. Give the new expedition families more distinct primary objectives and expand normal-action coverage to Drowned Post and Carriage Zero.
3. Add restrained rotating work after the finite local events, without recurring exceptional-pattern rewards.
4. Build deeper companion/resident conversations and specialist arrivals around completed facilities.
5. Extend armor/tool discovery inspection, accessibility and physical-device touch testing; refine atmosphere where measurements permit.
