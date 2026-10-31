# Alpha 7 work orders and extraction

The existing five routes, regions and access gates remain. A new trip's saved survey cycles through three orders:

| Order | Optional task | Where | Unscaled haul added to freight |
| --- | --- | --- | --- |
| Routine recovery | Inspect the upper survey plate | Approach upper deck | ¢12, two salvage |
| Lost shift | Clear the deep floor and guide its worker out | Deep reserve | ¢22, four salvage |
| Pressure inspection | Open the drive, then read its isolated gauge | Work-floor upper deck | ¢16, three salvage |

Tasks pay once per trip, travel as unbanked haul and obey the normal return scaling. The work order, completion and patrol case survive checkpoint saves. Patrol pairs have three bounded composition cases; these are not arbitrary generated rooms or level-scaled enemies.

The **RETURN** corner button explains what is banked or at risk, whether primary freight is secured, and which relics are cargo. **WALK TO THIS AREA’S RETURN HATCH** follows normal paths to the west entrance outside combat. In combat the report points out the entrance; ordinary movement/AP and the hatch interaction are still required. There is no remote extraction.

After five trips, a successful primary return on **every** family reimburses its entry fare and pays eight additional credits plus one salvage. It grants no repeat XP. Failed/withdrawn late trips pay nothing and do not reimburse their fare. This keeps a small net delivery payment on routes with fees while preserving rarity caps. The original first-success and deep-cache pattern rules remain. Completed named relic recoveries/restorations cannot duplicate.

The freight merchant Osa restocks at most two paid supply parcels after a successful delivery. Preparation and equipment comparison are linked directly from the expedition board. The early dispatch conversation explains that the Bell locker contains an incomplete frame, not an immediately usable weapon.

---

## Previous Alpha 6 access and mechanics

# Alpha 6 access additions

Talk to **Nell** at Disintegration Ward's ground-level dispatch hatch. The desktop sidebar and **JOURNAL → EXPEDITIONS** also open the board. The board lists locked routes, requirements, fixed tier, fee, current payout and successful/trip history. Depart from Disintegration Ward, Rustmarket, Kettle Junction or Cable Commons outside combat and other active jobs.

| Route | Access | Tier | Character |
| --- | --- | ---: | --- |
| Service Drains | Immediate, no story gate or entry fee | 1 | Pump freight, service stairs, courier coat and guarded bell locker |
| Brasslung Mill | Restore Mara's relay | 2 | Press complex and exhaust crown |
| Signal Ossuary | Complete Ward power and freight-depot projects | 3 | Deep vertical receiver rooms, repairable signal, optical watch |
| Drowned Post | Tenement clinic diving apparatus | 4 | Flooded dispatch annex |
| Carriage Zero | Repair Locomotive 09 | 5 | Military consist and armory |

Primary freight is on the middle floor. Open its drive to enter the optional reserve; return hatches are available throughout. First successful Service Drains delivery gives one workshop machinery unit. Exceptional cases travel as unbanked cargo and require successful primary extraction. Withdrawal or defeat loses those cases; later attempts can recover them. Banked exceptional patterns cannot duplicate.

The existing diminishing returns and XP cap remain. After five trips the original routes stop paying materials. In Alpha 6, the two new routes retained **¢8 and one salvage for a successful primary delivery**, no XP; failed/withdrawn late trips pay nothing. This is modest continued work, not a repeat source of exceptional items. Depot discounts do not stack with the rescued operator's discount.

---

## Retained expedition mechanics

# Multi-area expeditions / Alpha 5

Open J → EXPEDITIONS → EXPEDITION BOARD, or use Ada's expedition button. Depart while quiet from Disintegration Ward, Rustmarket, Kettle Junction or Cable Commons. Supplies and entry are real; enemies have fixed regional tiers and do not scale to level.

| Site | Access / entry | Three-area identity | First freight return | Deep reserve |
| --- | --- | --- | --- | --- |
| Brasslung Mill | Settlement power / free | Press approach, hot work floor, tall exhaust crown | Union focus rail | Deep survey harness |
| Drowned Post | Diving apparatus / 15 credits | Flooded approach, lower maintenance chamber, drowned archive | Deep survey harness | Balanced recoil cradle |
| Carriage Zero | Freight charter / 20 credits | Derelict rail approach, military work floor, reserve carriage | Redoubt breach feed | Switchman's arc blade |

Settling Anik's rescue at a work board discounts entry by five credits, floored at zero.

## The trip

Each family has three separately authored connected spaces. The survey seed changes enemy composition, a cache's deck and whether the middle floor has contamination. Family geometry remains recognizable. The same seed and all wounds/opened caches restore from saves; reloading cannot reroll the trip.

The approach teaches the site's layout. A service cache provides bounded supplies and at-risk credits/salvage. The middle floor holds the contracted freight. Recovering it is sufficient for a successful return: walk back to that area's extraction hatch and bank it. There is no requirement to eliminate every guard before extracting.

To go deeper, operate the middle floor's pressure drive with a cutter, an active engineer or three salvage. This opens the third reserve and isolates its middle-floor contamination. The reserve has a guarded rare cache and an elite patrol; Carriage Zero also has a stand-down order. Guards must be cleared or stood down before its deep cache opens. All areas offer a return hatch; previous-area hatches preserve wounds and opened caches.

In tactical combat, freight, ordinary cache, drive and exit interactions each cost one AP. The western extraction hatch can withdraw even while guards remain. Long-distance travel and combat use the existing crew/AP/gear mechanics. No one is forced to push beyond the contracted freight.

## Haul and safety

Credits, salvage and XP from expedition kills/caches stay in the run's **unbanked haul**. They do not also pay ordinary kill/encounter rewards. Quitting a fight is not a payout. Useful cache ammunition and one middle-floor medkit enter supplies immediately, with the same trip cap described below.

A successful freight extraction adds the site's base reward and banks the haul. Returning without freight keeps half of recovered material value and no XP/patterns. Defeat keeps one quarter of materials, no XP/patterns, and revives downed crew at half HP. Spent supplies and entry are not refunded. The crew returns to its departure location. Story populations and discoveries remain untouched.

Material rewards are multiplied by 100%, 60%, 30%, 15%, then 10% on the family's first five **finished trips**, including withdrawals and defeats. XP can pay only on the first three finished trips and only with freight. After five trips there are no material, XP or cache-supply rewards. This closes the repeated partial-withdrawal farming route. The board shows clears and total trips separately.

First successful freight patterns pay once regardless of prior failed attempts. A recovered deep cache can still unlock its permanent pattern; there is no saleable instance inventory to multiply. Later practice is optional. The four short dispatch jobs keep their own Alpha 4 reward records and rules.

## Checkpoints

Unlike short dispatched jobs, multi-area expeditions **can save/export/import outside combat and controlled transit**. Area transitions, quiet objectives and victories save. The run stores its family, survey seed, origin, primary/drive/cache state and unbanked haul together with the existing per-room wounds and discoveries.

Loading rebuilds definitions from that seed before checking the world. A malformed run is rejected before replacing the active expedition, and temporary definitions are restored after validation. Imports retain the existing crew and equipment validation. Saving during combat remains disabled.

An extraction outcome is banked at the next update, then saved in the departure settlement. Expedition-specific grudges end with that generated encounter; permanent story grudges remain. Only that family's active rooms are populated, and no expedition is shown as a discovered story district.

## Limits

Variation is a bounded authored system, not a procedural world generator. There are two basic survey cases per family, not unlimited unique room arrangements. All three families have integration coverage; a complete normal-action deep-reserve simulation currently covers the Mill. Human difficulty, long sessions and every seed/family route still need playtesting. No duration claim is made.
