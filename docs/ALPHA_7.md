# Alpha 7 — The Adventurer’s Life

Alpha 7 connects the existing settlement, equipment, regional activity and expedition systems. It retains the five-act campaign, all companions, the twelve exceptional patterns and five expedition families. It adds one optional persistent site, bringing the non-expedition district count to 30. The game remains one offline HTML file with no external runtime dependencies.

[Opening audit](ALPHA_7_AUDIT.md) · [Settlement](SETTLEMENT.md) · [Equipment](EXCEPTIONAL_EQUIPMENT.md) · [Regional events](REGIONAL_EVENTS.md) · [Expeditions](EXPEDITIONS.md) · [Player guide](PLAYER_GUIDE.md) · [Testing](TESTING.md).

## Completed connections

- New Funeral Bell and Mercy Killing discoveries bank as incomplete frames. Edda assesses them at the restored workshop. A governor in the Pump Test Annex completes the Bell; a matched capacitor from the Ossuary receiver completes Mercy. Existing owned Alpha 6 weapons remain usable.
- The optional Annex has an isolatable induction floor, two fixed-tier watchers, the governor and missing test engineer Rill. Housing Rill unlocks a workshop reunion and discounted restorations; sending them with the freight crew instead gives one machinery unit. Both outcomes persist and cannot pay twice.
- Five named residents become available with their facilities; Rill can become a sixth. They connect existing services to equipment hunts, community requests and personal relationships. Osa trades limited supply parcels, Meda treats actual wounds, and Edda handles restoration.
- Construction visibly advances through foundations, assembly and commissioning during its existing eight-second active-time window. Completed facilities add extended roof rails, walls, working lights and named workers without changing the original settlement paths.
- The home displays recovered firearm art, a route-map link, a charter/remembrance line and companion remarks based on bond. Shared equipment storage remains the ordinary collection; there is no second inventory to lose items in.
- Four sparse regional encounters depend on location, visits, development or previous work. They persist across reload, offer finite choices and never repopulate story hostiles. Completed unique events stay completed.
- Every expedition cycles through three authored work orders: upper survey, deep-reserve survivor and isolated-drive inspection. Orders have different locations and completion conditions. Patrol pair variation now also has a third bounded case; geometry remains authored.
- A compact RETURN button opens the active risk report. It explains successful extraction, withdrawal, defeat and relic cargo. WALK TO RETURN HATCH uses ordinary routes outside combat; it does not extract remotely or teleport.
- Late successful trips on every route return the entry fare plus eight credits and one salvage. No renewable XP is added. Rare patterns remain one-time recoveries. Osa restocks at most two paid parcels per successful delivery.
- Weapon cards compare effective damage, accuracy, AP, range and penetration. Exceptional weapons have differentiated recoil, muzzle/shot geometry and synthesized sound pitches. Chaining uses an independent conductive ray, not the victim's gun range. A Forest's evasion applies to ranged attacks as described.
- Watching companions keep their positions. Touch players can explicitly cycle overlapping interactions with NEXT, including coarse-pointer tablet layouts. Restoration tracking is optional and can be cleared by TRACK MAIN STORY.
- Focus loss clears movement keys without opening a menu. Boss status stays compact during actual combat; the old bottom-overlay positioning conflict has been removed.

## Required experience demonstrated

The fresh bot begins with the ordinary starter kit and no resource, health, inventory or quest edits. It extracts an incomplete Bell frame and courier coat, builds the workshop and housing, follows a returning scavenger camp's clue, recruits Vera, clears and isolates the Annex, recovers the governor, rescues Rill, returns to Edda, restores and equips the Bell, then completes a different deep objective on a second Service Drains trip. It reloads successfully and never accepts Mara's main quest. The run uses normal paths, AP, ammunition and enemy turns: 16 encounters and nine hostile rounds in the recorded deterministic simulation. That is executable-route evidence, not measured human playtime.

The merchant's appearance/trade, second restoration and other regional outcomes are validated with declared controlled fixtures. They are not claimed as parts of that fresh route; the original freight depot still requires repaired relay power.

## Known limitations and partial scope

Regional events are a small saved visit-based framework, not a free-running population or faction simulation. There are no newly spawned hostile gang patrols, random industrial-accident director or open-ended rotating bounty system. This avoids interfering with the established story. Unique regional interactions exhaust; repeatable work comes from expeditions.

Expedition orders change an optional task around the retained freight objective; they do not replace every family's main objective with a different mission type. A family still uses its authored geometry, bounded patrol cases and established progression gate. The survivor is an abstract safe-floor escort transaction, not a pathfinding escort actor.

Facilities have one build level and a short visual construction sequence. There is no furniture placement, new housing economy or arbitrary grappling system. Named residents have concise authored dialogue, not branching conversation trees. The home remains a lightweight interface and display within the Ward.

Effects are procedural line art and local synthesis, not a complete animation/audio-engine replacement. Funeral Bell displacement remains on a safe platform, Dead Air uses an opening-round bonus, and A Forest remains evasion rather than invisibility. Human listening tests, accessibility review, physical iPad/phone tests, long sessions and organic late-campaign balance remain outstanding. Direct `file://` navigation is blocked by the managed Chromium policy; standalone content with networking offline is tested at a local origin.

## Next milestone

1. Human-play the fresh restoration route, especially learning the isolator and choosing when to extract; measure ammunition use and actual pacing.
2. Organically play Mercy's restoration, Drowned Post, Carriage Zero and multiple endings with ordinary crew development.
3. Add one distinct primary mission type per family after the current optional-order system has been balanced.
4. Give the small resident cast more conversations tied to completed work, and test the home/settlement at large text sizes.
5. Expand event diversity cautiously, with explicit safeguards around existing quest sequences and performance measurements on physical tablets.
