# Alpha 10 — Strange Industry

[Play / download](../UNDERGRID_ADVENTURE.html) · [Source](../src/industry.js) · [Authored content](../src/industry-data.js) · [Verification](TESTING.md)

This release develops three industrial spaces, five enemy archetypes and three rare field patterns. Vent Cathedral and Relay Orchard are transformed existing districts; the Walking Foundry is one new connected optional branch. The five-act campaign and Alpha 9 traversal/crew systems remain. The game is still one offline HTML file, built by `python tools/build.py` with no external assets.

## Visual identity

- **Vent Cathedral:** three enormous ribbed bellows, brass fan housings, suspended work lights and occupied duct houses. Repaired home supply animates the bellows and lights the occupied rooms. The original generator still drives the fans and freight lift.
- **Relay Orchard:** curved copper roots, hanging porcelain insulators, suspended inhabited pods and live electrical branches. Home allocation lights the pods; work allocation powers its direct maintenance ladder. The original three story exchanges are preserved.
- **Walking Foundry:** an arrested articulated leg crosses the entire space behind the service decks. Huge geared joints, hydraulic members, hanging work cages and the intake exhaust establish a different silhouette. Restoring the stride governor animates the gearing and activates the exhaust strip.

The machinery is drawn behind the collidable deck sections; actual floors, holes, ladders and fighters remain in front. Existing terminal/HUD conventions are retained. Dedicated enemy renderers distinguish the pressure suit, staff-and-tether operator, fastening rig, crucible carrier and asymmetric inspection machine. Equipment previews also draw the three new field patterns.

Before/after views: [Cathedral before](screenshots/alpha10-vents-before.png), [after](screenshots/alpha10-vents-after.png); [Orchard before](screenshots/alpha10-orchard-before.png), [after](screenshots/alpha10-orchard-after.png). [Walking Foundry](screenshots/alpha10-walker.png). These are declared positioned scene views rather than evidence of organic acquisition.

## Finding and using the content

### Vent Cathedral

Enter from the original Skyhook maintenance road. The **Choir manifold** is on the west 1200 deck, x390. Orren, Latch or an equipped relay interface can repair it without parts; any crew can spend four salvage. The repair feeds occupied ducts, unfolds a service ladder from 1160 to 900, and disables industrial special attacks in the Cathedral. Enemies retain their ordinary weapons.

Before repairing, a one-use emergency purge can instead damage everybody on the east 1200 work deck for 24 HP. It can hit crew. The home repair remains available afterward; a repaired home circuit cannot be purged again.

Read the **ninth-shift roll** on the 900 deck and the **disciplinary docket** on the west 1200 deck. Moth waits near the intake floor. The original upper generator still grants `ventPower`; restoring it also unlocks the **Walking Foundry intake cradle** at x370 on the 1480 floor.

The **Choirmaster’s locker**, x1260 on the 590 deck, requires the home repair and a cleared district. It grants the **Choirmaster’s baffle**: +15 movement/AP, half damage from industrial marked blasts and protection from the new stride exhaust.

### Walking Foundry

The return cradle always leads back to the Cathedral. Its intake service kit provides ordinary ammunition, medical supplies and a grenade. Existing-style ladders connect the decks; an offset step provides an alternative across the broken 1100 deck. The upper machine is reachable by the longer ordinary ladder route.

- **Cargo cradle**, x780 on the intake 1320 floor: discharge once over the eastern intake around x1570, radius 175, up to 42 blast damage. It uses the shared explosion/steel/cover/barrel rules and can hurt crew.
- **Stride governor**, x540 on the west 1100 deck: crew/interface repair or four salvage. Opens the direct 700–1100 spine ladder, wakes a reserve inspector and vents hot exhaust across intake x1000–1280. Exhaust deals six damage per combat activation or three HP/second during exploration; exploration damage cannot kill. The baffle protects against it, and upper routes avoid it. The movement forecast reports it.
- **Replacement orders**, x430 on the 920 deck: read and then transmit the conflicting inspection spool to stand down current unfinished inspectors, including an awakened reserve. No kill bounty or kill count is granted. Transmitting remains possible if a later drive repair wakes a new inspector.
- **Auxiliary feed**, x1020 on the 700 deck: after drive repair, choose homes or field supplies once. Homes grant +2 standing, a permanent 10% supply-exchange discount, a visible Ward intake/worker and a two-medkit follow-up delivery from Moth/Hess. Field supplies instead grant forty rounds and eight salvage. The choice is recorded.
- **Last-step locker**, x1590 on the 480 deck: requires the running drive and a cleared site. Grants the **Last-step retrieval rig**: +30 movement/AP, +2 victory salvage and a 750-range winch without the original tenants’ tool.

Hess, the bolted retrieval boot and an undelivered-cargo record provide quiet discoveries. They do not grant extra currencies or XP.

### Relay Orchard

The **root exchange**, x430 on the west 880 deck, reallocates current for one AP in combat, free outside combat. It is independent of the original three campaign exchanges.

- **Homes:** inhabited pods light up; unfinished inspectors spend their activations scanning rather than firing while that supply remains active.
- **Work:** unfolds the direct 420–880 service ladder at x1040 and disables shepherd recharging. Inspectors become active again.

The player can reassign power. Original routes and main-story exchanges stay available. Read the inspection spool on the west 650 deck to transmit replacement orders, or fight the inspectors normally. A service-wages record at x650 on the 420 deck explains the shepherd’s named tether reels.

The **ceramic root locker**, x1390 on the 420 deck, requires an allocation and a cleared district. It grants the **Widow’s relay spool**: +5 accuracy, shock protection and an interface that substitutes for a specialist at Strange Industry repair controls. It does not automatically replace engineers at every older machine.

## Enemies and counterplay

| Type | Behavior | Counterplay / narrative |
| --- | --- | --- |
| Pressure diver | Marks a crew position, spends an activation venting, then bursts a 125-radius zone on its next activation. Venting removes four armor. | Move away, exploit exposed armor, suppress/shock, kill it or repair the Cathedral manifold. Its ninth-shift roll names eight workers for nine suits. |
| Rivet penitent | Locks a position before a 100-radius, 32-damage slam that destroys nearby low cover. | Leave the mark, interrupt the rig or spread the crew. The docket records a worker repaying broken fasteners through compulsory machinery work. |
| Kiln carrier | Telegraphs a hot-cargo spill before a 125-radius, 28-damage release. | Reposition, suppress/shock or use cargo/industrial explosives. Its delivery record repeats a rejected load for forty years. |
| Cable shepherd | Uses a clear tether to restore fourteen HP to a wounded nearby machine; otherwise fights with its normal rifle. | Focus the operator, break the firing/tether geometry or isolate its circuit. A real inspector/shepherd pair occupies the Foundry’s upper deck. |
| Unfinished inspector | Uses an ordinary laser and obeys local current/inspection orders. | Home current in the Orchard pauses its attacks; replacement orders stand it down. Investigation reveals incompatible evacuation and occupancy instructions. |

The warning itself deals no damage. Markers remain at their original positions; they do not follow a retreating fighter. Suppression or shock cancels an industrial windup. Shared geometry shields crew from marked blasts through steel. Attacks can still punish crew who remain clustered on the mark. Inspecting an enemy reports its tell/counterplay. Enemy role differences come from these actions rather than very large health pools.

## Companions and persistent consequences

**A breath worth keeping** is Latch’s new side contract at existing boards. Read the ninth-shift roll and choose the Foundry’s auxiliary destination; return with Latch active to settle it. The contract grants credits/salvage and records Latch’s maintenance promise. Existing companion quests remain.

Orren and Latch save repair parts. Ilex recognizes the moving machine’s route/hazard tradeoff. Nim comments on mapping live branches. These use existing sparse chatter cooldowns and seen flags.

Persistent outcomes include repaired home ventilation, the service ladder, power allocation, the running stride drive and awakened inspector, spent cargo, rare patterns, corrected orders, the auxiliary destination, the visible Ward intake and bounded medical delivery. Repeated clicks do not duplicate rewards. The home supplier discount stacks with existing standing/charter pricing.

## Implementation and compatibility

`industry-data.js` extends the same room, enemy and gear definitions used by the engine. `industry.js` implements transactions, tells, rendering and additive validation. Hooks connect it to existing interaction, damage/armor forecasts, activation hazards, world drawing, atlas landmarks and save migration. No second collision system or external texture dependency is introduced.

The original save version and slot remain. `industry` adds versioned records, bounded claims and allocation choices. Old enemy identities are preserved where types change, keeping their saved positions, wounds and cleared states. A new `walker` world is initialized during migration. The drive’s reserve starts dormant and wakes only through its actual transaction. A real Alpha 9 HTML save imports with its old wound value and personal atlas note intact. Industrial marks are range/type checked. Newer saves are not promised compatible with old game versions.

## Verification and remaining limits

See [current results](TESTING.md) and [raw output](TEST_RESULTS.txt). There is a prepared midgame playthrough through actual doors, routes, battles, controls, discoveries, gear claims and save/load. The fixture grants its starting kit/levels/reached checkpoint; no health, AP, world or resources are edited after departure. It does not establish organically acquired midgame balance or a measured playtime.

Limits:

- The Foundry is an authored stationary exploration space with animated background joints; it does not physically walk between districts or simulate a whole moving city.
- The air and power systems are bounded authored states. Airflow opens a service route and changes weapon supply; it does not simulate continuous wind forces. Branch sparks are visual; the explicitly marked exhaust and existing hazards cause damage.
- Foreground play still uses the existing platform/ladder renderer. This release gives three spaces distinct machinery and palette treatments, not a world-wide texture or lighting overhaul.
- Special attacks use marked radius/LOS checks rather than physical fluid simulation. Ordinary fighters retain the existing weapon/AI systems. Enemy health remains modest, but four-person human difficulty needs longer testing.
- Coarse-pointer Chromium checks do not substitute for physical iPad Safari, long-session performance or accessibility testing. A headless rendering sample is diagnostic only.

Next priorities: human-test the three sites and four-person balance, profile on actual tablets, add more environmental sound/impact feedback, improve enemy animation transitions and selectively carry the successful visual treatment into older districts. Preserve the existing working progression while expanding.
