# Alpha 5 — The Greater Adventure / build 0.6

Alpha 5 adds a complete **Common Line** arc with a beginning, middle, final encounter and three authored conclusions. The existing Bell Engine remains playable and now completes Act I. The larger mystery is suggested by freight orders and impossible timetables; the ending resolves the crew's immediate place in the wards.

The playable arc is a compact foundation for the intended larger campaign. The eventual targets of 8–12 hours main story and 15–25 with optional content remain **unmeasured long-term goals**, not claims about this release.

## Actually playable campaign

| Stage | Player goal and access | Reward / consequence |
| --- | --- | --- |
| I — Last Light | Existing fuse, rig, condenser, cipher and Bell Engine adventure | Power, allies, equipment, freight channel and an invitation to build a longer line |
| II — The Wards | Existing locomotive repair, first freight delivery and clean-water work. Ratify the Common Line at Rustmarket's ground concourse | Choose public carriage or factor backing; open the high Dead Rail route to Kettle Junction |
| III — The Deep Works | Ask Ada at Kettle Junction. Descend the Counterweight Abyss, disable the Cold Foundry's magnetic couplers, defeat its Marshal and recover the governor | Ada restores the junction's heat and Orchard duct; burst rifle, balanced recoil cradle, credits and ammunition |
| IV — The Hidden Network | Reconnect the three Relay Orchard exchanges; recover the manifest at the Unlisted Station above it | The Heart conduit opens. Optional Anik rescue and return to Ada adds ward trust and a settlement service |
| V — A Place in the Grid | Enter Load-Bearing Heart, release both requisition couplers, stop the Receiver and reach the far switch | Select a public, bonded or independent conclusion. Open Cable Commons, unlock the arc blade and continue exploring |

The original flag for finishing the Bell Engine is retained as introductory completion. The new ending is recorded separately. Older completed expeditions enter Act II; no previously earned equipment, companions, wounds, upgrades or quest flags are reset.

A tracked unfinished job may temporarily replace the main objective rail. J → MAIN STORY → TRACK MAIN STORY restores campaign guidance. Main-story requirements are always visible in that journal page.

## Charter and conclusions

At Rustmarket's Common Line desk, **common carriage** grants two ward trust, costs one factor trust and provides two medkits/six salvage. **Bonded freight** grants two factor trust, costs one ward trust, pays 100 credits and applies a further 10% supplier-price reduction. Charter rewards pay once. Both open the same adventure; neither demands reputation grinding.

After the Receiver, a public conclusion requires ward trust or positive local standing. A bonded conclusion requires the factors' backing or trust. An independent crew charter is always available, preventing a reputation softlock. Public ownership provides six medkits, bonded ownership pays 180 credits, and independence grants thirty salvage. All unlock the crew's platform and arc blade, heal the crew and strengthen bonds once.

The epilogue reflects the chosen ownership, Anik's return, the Redoubt resolution, Nix's existing outcome and the crew's bonds. There is no claim of simulated faction territory, dynamically generated politics or a wholly branching second campaign. Unfinished work and dangerous destinations remain open afterward.

## New permanent regions

- **Kettle Junction:** remote freight hub with Ada, bunks, Rell's supply counter, work board and discovered-station rail. Recovered machinery lights its platforms; a rescued operator uses the seventh cup.
- **Counterweight Abyss:** a 1,600-unit shaft with building-sized moving counterweights, eleven elevations, multiple ladders, a reusable grapple crown and a diving return cut into the Pressure Vault. The rigger's cache can also be reached by ladders.
- **Cold Foundry:** a broken industrial complex with magnetic feed controls, the Shift Marshal and the governor. Controls and gunfire both disable couplers.
- **Redoubt Six:** optional layered military checkpoint. Captain Vey calls one reserve. Reaching the armistice order ends its encounter peacefully; the service record supports a later amnesty/evidence choice.
- **Relay Orchard:** tall cable trees and three exchanges. Connections cost one AP during battle and persist individually. The manifest and all three connections are jointly required.
- **Unlisted Station:** quiet residential mystery, missing manifest, a shelter and Anik trapped behind a shutter. An engineer, cutter or four salvage resolves the rescue; Anik uses an authored safe return passage.
- **Load-Bearing Heart:** two independently released couplers shield the Receiver. Its phases change weapons and protection. Announced floor surges punish staying put unless grounded; a high coolant control stops surges.
- **Cable Commons:** the crew's conclusion platform, bunks, rail and a persistent epilogue ledger. The ending leaves the wider setting unexplained.

These add to the original 21 story districts. The nine expedition rooms are separate work sites, not nine more permanent story settlements. The four short Alpha 4 dispatch jobs retain their separate arena.

## Expeditions and optional activity

Three new families each span three connected areas: **Brasslung Mill**, **Drowned Post** and **Carriage Zero**. Every trip has a recoverable primary objective on its middle floor and an optional pressure-controlled deep reserve. Extract from any area's return hatch. Quiet checkpoints persist the seed, enemy wounds, opened caches, haul and objectives. Full rules are in [EXPEDITIONS.md](EXPEDITIONS.md).

Four new formal jobs bring the board to twenty: Seven cups, six names; Orders that outlived their officers; Paid in heat; Flowers at every hundred. The journal separates personal side quests from paid contracts while the physical board remains the place to accept and settle them. Existing companion stories and choices remain in place.

Anik's settled rescue discounts expedition entries by five credits. The Redoubt can be resolved without executions; publishing its service record and offering amnesty have different payments/standing. The Cold Foundry and rigger memorial reward revisiting meaningful landmarks. These are authored outcomes, not generic escort or settlement simulation frameworks.

## Equipment and combat

The arsenal now has seventeen weapon patterns. The **Union three-stamp rifle** spends two rounds per burst, always suppresses, and trades ammunition/penetration against carbine flexibility. The **Switchman's arc blade** is ammo-free melee with shock, trading the chainblade's raw armor punch for control. Both use distinct canonical-style physical weapon paths shared with inspection.

The **balanced recoil cradle** grants four accuracy/two penetration; the **Redoubt breach feed** grants three damage/two penetration. The **deep survey harness** combines twenty-five movement units per AP with chemical protection. Equipment is still a permanent shared pattern; per-fighter calibration, talents, active abilities, bonds, grudges and visible customization remain unchanged.

The new riflemen suppress, old support specialists retain their roles, and Vey can call only one reserve. Mechanical bosses are drawn as machinery, carry their actual phase weapon, and expose the same component state used by shooting and controls. This is not a general reinforcement director or universal enemy environmental planner.

## Tested functionality and limits

The full fresh introduction, a prepared continuation through its public ending, and a prepared three-area expedition were completed by deterministic normal-action bots. No health/AP/enemy-health rewriting occurs during those fights. Controlled fixtures separately cover migration, all expedition families and outcomes, economy caps, charter branches, boss shields, cooling, stand-down and saved endings. Actual browser inputs cover the existing control/traversal flows plus journal tabs, expedition imports and portrait bounds. See [TESTING.md](TESTING.md) for exact scope and results.

The prepared continuation starts at level seven with a marksman-equipped, grounded crew and supplies. It does not establish that every organically developed build is balanced. No full human campaign, physical-phone certification or gameplay-hours measurement has been performed. There is no claim that every expedition variant has had a normal-action clear; the Mill has, while Drowned Post and Carriage Zero have integration fixtures.

Room geography is authored. Survey variation changes patrols, cache deck and a middle-floor contamination condition; it does not rearrange an arbitrary world. New residents perform small ambient movements and do not run a life simulation. Anik's return is a safe authored rescue, not a damageable escort. Procedural objectives, rolling rarity, freely driven vehicles, mining, a new companion and a general faction-war system remain outside this build.

## Alpha 6 priorities

1. Human first-hour and complete-campaign sessions with organically earned equipment, including solo/three-person play, all conclusions and optional detours. Measure duration before making length claims.
2. Normal-action clears of every expedition family/seed case and the legacy excavator. Tune ammo, XP, entry prices and deep-cache danger from those results.
3. Enrich the distinct middle acts with more authored discoveries and regional decisions. Preserve a coherent ending while working toward the eventual length target.
4. Add a true protect/escort mission, stronger cover/flanking behaviors and clearer enemy movement animation before multiplying combat frameworks.
5. Physical phone testing, dedicated inspect/confirm targeting, accessible controls, configurable bindings and performance work.
6. Extract state validation/combat further, add ability retraining, and evaluate factions from actual player choices rather than building a large simulation prematurely.
