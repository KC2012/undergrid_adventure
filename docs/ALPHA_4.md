# Alpha 4 — The Adventure Loop / build 0.5

This build concentrates on making the existing campaign easier to operate and more rewarding to revisit. It retains 21 story districts, sixteen contracts, the original power/railway opening, four recruitable companions and Undergrid's in-world AP gunfights. Four new dispatch jobs share a separate freight site; they are not four new story districts.

## Playability and combat

Walking now interrupts queued click travel. Ladder capture accepts a 49-unit horizontal offset; jumping has 100 ms edge forgiveness and a 130 ms input buffer. Shared pathfinding adds directed drops and short hops so both crew and hostiles can avoid needless ladder detours. Companions follow during click travel as well as walking. The camera follows both axes with a small directional lead.

Nearby objects highlight; E uses the selected target and F cycles overlapping objects. Horizontal/vertical ranges are consistent. E performs a safe available machine operation, such as cutting an owned barrier, using an engineer or riding the lift. Shift+E opens the full options panel. Explosives and heavy structural shots always require an explicit choice. T aims the grapple immediately when owned.

PACK has Weapon, Armor, Gear, Mod and Growth tabs, an equipped-item title, live fighter preview and comparisons. Each fighter can keep two quick weapon choices; V swaps them freely outside battle and for one AP during battle, conserving all rounds. Q cycles targets, Space shoots, K opens abilities, and learned abilities have direct tactical buttons. Crew Watch puts ready fighters on overwatch and ends the round. Auto Next is optional and defaults off. Fast enemy turns default on; SYSTEM offers the steadier timing.

Ordinary contact starts a nearby authored group rather than every surviving enemy in the district. Hostiles can join when approached or attacked. Convoy, Bell Engine, Blacksite, the excavator and dispatched jobs remain full set pieces. A local victory returns to exploration while distant patrols remain; claimed kills cannot pay twice. District SECURED still means all hostiles are gone.

## Progression choices

Each fighter earns one active-ability licence at levels 2, 4 and 6, up to three learned abilities. Existing higher-level saves receive their earned licences. The six options cover precision, bracing heavy weapons, a longer combat dash, emergency field medicine, electrical control and shaped explosives. Passive talents, bonds, armor, mods and personal grudges remain in effect.

Calibration is a new continuing use for credits and salvage. Each fighter can buy three ranks on each gun; every rank adds two damage and two accuracy. Costs rise from 35 credits/four salvage to 75/seven and 115/ten. These belong to the fighter's use of that pattern; unlocking a pattern is still shared. The starter pistol and SMG favor mobility while long/heavy weapons reduce movement allowance. Different weapon ranges, penetration, statuses, bursts and blast risks remain distinct.

A free Last Light jumping stash teaches a useful detour. Discoveries and improvements give brief feedback with a saved journal history. The arsenal screen explains weapon roles and acquisition leads. Regional danger tiers are fixed; enemies do not scale automatically to crew level.

## Optional paid work

Open the work board's DISPATCH from Last Light or Rustmarket while out of combat. No prerequisite forces a new player to take a dangerous job. The board shows its tier, objective, entry price, supplies and next payout.

| Job | Tier / entry | Objective | First reward |
| --- | --- | --- | --- |
| The lost consignment | 2 / free | Recover upper freight and reach eastern exit | Union focus rail, +11 accuracy without a damage penalty |
| Three minutes of light | 3 / 10 credits | Protect a separately damaged relay for three hostile rounds, or clear its attackers sooner | Blast liner, half incoming blast damage |
| Wrong side of the cordon | 5 / 10 credits | Reach the extraction hatch; escorts need not die | Laser pattern |
| Collector's last notice | 5 / 15 credits | Kill the collector; escorts need not die | Hand cannon pattern |

The relay can be repaired by 35 HP once per round for one AP and three salvage; an active engineer waives the salvage. Enemy attacks and friendly explosions can damage it. Recovery/extraction actions cost one AP during combat. After clearing guards, finish the objective freely. The western dispatcher hatch allows withdrawal.

Material rewards pay 100%, 60%, 30%, 15% and 10% on successive wins, rounded. XP pays on only the first three wins. After five wins, a job is practice without rewards; entry prices still apply. First-clear patterns pay once. Enemy kills inside jobs do not also pay normal XP or currency. Failure/withdrawal loses entry and spent supplies; downed crew recover at 30%. Story enemies, chests and route flags are untouched. The older explicitly commissioned three-run salvage sites remain available after the freight escort.

Jobs save a safe checkpoint before entry. Saving, exporting and importing an active job are disabled. Closing the game restores that checkpoint; there is no mid-job persistence. Finish or withdraw to save the outcome.

Ward relief in either settlement restores shared total ammunition to at least 24 rounds and ensures one medkit. It grants no currency or XP and cannot be accumulated by repeated requests. Bunks still provide free healing.

## Existing-world changes

- Last Light: small stepping platforms and a spare-magazine stash.
- Furnace Mile: a visible conveyor moves grounded fighters and hostiles east; its drive can stop/restart it.
- Cinder Docks: a one-use cargo release causes a blast on the floor below.
- Blackwater Gardens: an engineer or three salvage permanently isolates the chemical seep.
- Regional signage, work crates, rail cargo and settlement laundry add context to familiar floors.

These join the previous persistent valves, power repairs, lift, cutter barriers and submerged routes. There is no new large map chapter or generic physics simulation.

## Stability and evidence

The previous release is preserved byte-for-byte at [Alpha 3](../releases/UNDERGRID_ADVENTURE_Alpha_3.html). Existing 0.2/0.3/0.4 saves migrate. Export a backup before moving between browser origins; do not open Alpha 4 saves in an older build.

The fresh-start bot completes recruitment, two local encounters, fuse retrieval, return to Mara, an earned ability and calibration without editing inventory, credits, XP, quest flags or health. A second prepared-crew simulation completes the new defense with ordinary movement/AP/shots/hostile activations and real relay damage. Controlled fixtures test all four objective branches, skill limits, economy bounds, utility persistence and saves. Actual browser input tests ladders, collision, cutting, lifts, grapple, equipment tabs, keyboard targeting, touch and import recovery. Full details and limitations are in [TESTING.md](TESTING.md).

## Limits and next priorities

The delivered systems work, but this remains an alpha campaign foundation. The brief's ambitions for comprehensive world density, long-form content, late-game economic tuning and every possible objective type remain partial. There is no human full-campaign/boss balance result, arbitrary grapple physics, mining, free driving, general morale system, randomized loot or configurable controls.

Prioritize next:

1. Human first-hour and full-campaign sessions, including solo play, resource recovery, optional job duration and the excavator under normal AP. Tune from observed difficulty and completion time.
2. Physical-phone touch testing and a dedicated inspect/confirm targeting mode; test Safari/Firefox and accessible input.
3. Give each existing district an individually authored landmark/secret route. Expand beyond the shared dispatch layout only after the loop is comfortable.
4. Add ability retraining and richer cooperative roles, then evaluate whether three learned abilities and calibration costs support lasting build variety.
5. Extract combat/state validation into clearer modules, animate enemy travel, profile low-end devices and add configurable controls.
