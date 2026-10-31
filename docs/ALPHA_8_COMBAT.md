# Alpha 8 tactical changes and balance

The objective is clearer decisions and more useful positioning. No new regions, quests, weapons or enemy archetypes were added. Existing campaign, settlement, exceptional-equipment and expedition systems remain. Enemy HP, base weapon damage, encounter rewards and the three-player-AP rhythm were not increased.

## Predict before committing

Target information shows hit probability, damage on a hit, AP and ammunition cost, range penalty, directional-cover effect, elevation, penetration, armor absorbed and weapon effects. The damage calculation is shared with attack resolution. For explosive guns it includes both impact and the primary target's blast damage. Secondary industrial chain reactions, future burn/toxin ticks and damage to other actors are effects, not promised additions to that single-target number.

Steel or barrier obstruction, range failure and an empty magazine are distinct. A blocked shot spends neither AP nor ammunition. Direct hits retain their damage numbers and hit reaction; misses show MISS; protected hits add a restrained armor glyph/absorption label. Exceptional weapons retain their distinct geometry, recoil, shot effects and local synthesized audio.

A movement preview uses the same route and AP calculation as the movement command, including Dash's maximum distance. It shows the actual path, endpoint, affordability, elevation change, nearby directional cover and relevant steam/chemical/electrical/surge warnings. A nearby cover marker does not promise protection from every angle. The preview is a decision aid, not a persistent objective trail.

Mouse controls retain hover-to-inspect and click-to-command. On touch screens, the first hostile tap selects its forecast and the second fires. A floor tap previews a movement route; tap that destination again to confirm. Selecting another fighter or an explicit action clears the pending movement inspection. Keyboard Q/Space and crew switching remain available.

## Cover, suppression and overwatch

Low cover remains directional: it protects only when it lies between the shooter and a nearby defender. It reduces hit probability by 28 points, not direct damage. Flanking removes that protection. Flame weapons ignore it; melee no longer receives a ranged low-cover penalty. Existing cover damage and blast destruction remain. Solid floors still block shots, so elevated firing often requires an exposed platform edge rather than firing through the floor beneath you.

High ground retains +12 hit probability and +3 direct damage; low ground retains -8 hit probability. Armor penetration reduces the armor applied to a direct hit. The existing minimum direct damage rule remains.

**SUPPRESS** is available to SMG, heavy, Union burst and Disorder users. It costs **2 AP and two rounds**, requires a visible unshielded hostile, applies suppression reliably and deals no direct damage. It is an alternative to a normal attack, not an extra damage bonus. Existing suppression still reduces accuracy while marked and removes one AP at the affected activation. Existing weapon/miss suppression is retained.

Overwatch keeps its existing commitment: it reserves the fighter's remaining activation and fires one legal reaction when an enemy moves. The normal weapon consumes its ordinary rounds and uses its ordinary effects. Watching companions hold their positions. There is no new facing cone, multiple reaction-shot entitlement or automatic crew repositioning.

## Industrial opportunities

Industrial barrels show their 145-unit blast radius, fixed one-AP/one-round interaction and friendly-fire warning before a mouse attack. Their 42-point center damage falls off with distance, destroys cover and can chain existing barrels. Eligible enemies may detonate a barrel when at least two crew are exposed and no nearby allied enemy would be caught; they do not create hazards or use a general demolition planner.

Existing Furnace steam, Gardens chemicals, active steam machinery, work-floor contamination, conveyors and announced boss surges remain. Forecasts warn about relevant routes using those same region/flag conditions. The Pump Test Annex live floor now deals four damage and shock at activation; grounding gear protects against it. Its isolator can be operated during combat for one AP, so the electrical danger has an explicit tactical counter. Original valves, switches, boss couplers and conveyor rules are retained.

## Enemy decisions and representative encounters

Normal marksmen/flankers and a medic's non-healing fallback evaluate a small bounded set of reachable cover/flanking positions. They consider a firing lane, direction of cover, target vulnerability, health, movement cost and known hazards. Two-AP gunners hold a legal lane rather than wasting the firing opportunity to approach a fixed distance. A close flanker can cross to a defender's unprotected side. The planner considers at most seven candidate positions and retains the established pursuit/pathfinding fallback when no useful local plan exists.

Existing medics still spend an activation healing an injured nearby ally. Rushers, bombers, bosses, fixed mechanisms and special dispatch objectives keep their specialized logic. This is not expensive multi-turn AI, and fallback pursuit is not guaranteed to avoid every possible danger.

Three existing sites gained one useful cover position each: the Cableworks approach, Ashline's firing terrace and the first Relay Orchard exchange. Hostile rosters, HP, rewards, story gates and region/weapon counts are unchanged. These represent early, middle and late encounters without scattering new hazards across the world.

## Reference and limits

[Original mechanics reviewed and adaptation decisions](ALPHA_8_COMBAT_REVIEW.md) separates the reused tactical vocabulary from incompatible skirmish systems. Adventure retains its single body-ray model, binary low cover, existing burst multiplier, shared spare ammunition and RPG progression. It does not import multi-body-point cover, ammo reliability/jams, heavy-gun deployment, grenade-zone simulation or an unrestricted AI director.

[Testing](TESTING.md) distinguishes controlled effect fixtures, real-input checks, fresh navigation, the full existing campaign bot and a prepared tier-five expedition. Organic difficulty for all builds, human first-hour pacing and physical-device usability remain to be tested.
