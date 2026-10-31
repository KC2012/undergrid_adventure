# Alpha 9 — The Open Undergrid

Open [the standalone game](../UNDERGRID_ADVENTURE.html). Build with `python tools/build.py`; no runtime dependencies or external assets are needed. The preserved [Alpha 8](../releases/UNDERGRID_ADVENTURE_Alpha_8.html) remains available. This draft has not been published.

## Traversal and shared geometry

`src/geometry.js` supplies the authoritative solid deck sections, apertures, wall tests, jump arcs and drop routes. `src/open-data.js` refines existing room data instead of maintaining a separate collision map.

- Running accelerates toward 240 units/second. Jumps use gravity, horizontal momentum, a short input buffer and coyote time. Climbing equipment and Nim increase jump height. Solid ceilings stop an ascent; maintenance shelves allow ascent from below. Ordinary cover and narrow hatch gaps are automatically vaulted.
- S+Space or touch DROP uses a nearby designated hatch or a one-way shelf. Solid steel requires an edge, ladder or opening. Normal landings are forgiving; very long uncontrolled falls cost eight HP without killing the fighter. Planned drops are bounded to 520 units.
- Ladders distinguish genuine authored openings from side attachments. The Ward watch hatch, Cableworks east/crown hatches and Furnace east hatch are real holes. Reaching a ladder’s open top dismounts onto a supported rim. Other ladder connections remain side-mounted; they grant climbing access without making steel transparent to fire.
- Dijkstra routing includes directed jump/drop edges alongside walking and ladders. Jump feasibility uses the fighter’s actual kit and a sampled physical arc. Previews show arcs, drop labels and the existing route-length AP cost: ceiling of route distance divided by movement allowance, with at least one AP. Exploration uses the same route without AP.
- Platforms render only their solid sections. Local survey and minimap use those sections and hide the service ladder until repaired. Shots, enemy targeting, chain conduction, lobbed grenades and blast shielding use the same deck/wall tests. Directional low cover retains its accuracy/destruction rules.
- Winches require a clear line through this geometry. In combat, two AP moves only the selected fighter. Outside combat, living crew in range with clear cables move together. Landing points sit beside a hatch instead of hovering in it. Progression doors still check their existing quest/tool requirements.
- Followers use routes and ordinary arcs rather than teleporting across rooms. Watching fighters hold position. Unsupported followers fall to a safe lower deck and retry the route. A failed route gives one explanation until conditions change. Shelter swaps and explicit room transitions remain regrouping points.
- The existing two-axis, smoothed camera tracks vertical movement. Focus loss continues to clear held input without opening SYSTEM. The compact boss panel remains in use.

## Four demonstration areas

| District | Changes and alternatives |
| --- | --- |
| Disintegration Ward | Safe offset shelf between residential decks, one-way teaching steps, real watch-deck ladder hatch. Original settlement concourse and doors remain accessible. |
| Cableworks | 100-unit broken upper catwalk: jump, lower ladder detour, or clear maintenance winch. A scored panel opens a permanent service ladder to an abandoned workshop, overhead maintenance crossing, survey terminal, letter and Nim. |
| Furnace Mile | 80-unit broken bridge, offset maintenance crossing between the residential-height decks, real east hatch and Ilex’s damaged harness. Original steam valve and heart access remain available. |
| Counterweight Abyss | Optional rigging shelves and return seal between the existing industrial decks. Descend from the eastern 820 deck or use the recovery winch; climbing kit helps approach from below. Main exits and counterweight machinery are preserved. |

The shared movement/collision rules apply throughout the existing world and expedition templates. The remaining districts retain their authored layouts; this release does not claim thirty comprehensive geometry redesigns.

## Crew and recruitment

Rook always travels. Maximum active capacity is **four total**. All seven companions can be recruited; overflow waits in the existing shelter reserve. The roster shows fighter previews, equipment, health, bond and field roles. Keys 1–4, Tab, clickable figures, the crew dock, touch layouts, AP refresh and validation support four fighters. Swapping preserves equipment, talents, abilities, bonds and names.

| Companion | Recruitment | Field / combat role | Personal work |
| --- | --- | --- | --- |
| Vera | Original Cableworks pinned-courier encounter | Existing courier route knowledge, ledger alternative and quieter movement; comments on the survey | Existing ledger quest preserved |
| Orren | Original Sump encounter | Existing repairs plus free workshop/terminal repair and hoist extraction | Existing apprentice/housing content preserved |
| Sable | Original Tenement clinic encounter | Existing medical rig and survivors; new free treatment of Cableworks courier | Existing clinic progression preserved |
| Latch | Original Vent Cathedral maintenance encounter | Existing shock resistance/interfaces; new workshop and terminal repair | Existing maintenance content preserved |
| Nim | Repair the scored Cableworks upper-deck panel, climb into the workshop and invite the roof surveyor | Longer-range seam hint, slightly higher jump, +6 pistol accuracy; argues that maps should preserve names | **A map with room for people**: read paper survey or repair terminal; work board rewards climbing equipment, credits and salvage |
| Brass | Ashline western 470 deck. Earn +1 standing, clear Ashline, or repay ¢30 to the tenants. Clear immediate threats first | Receipt-backed checkpoint negotiation, +4 handcannon damage; history with toll notices and distrust of old automaton orders | **The value of a promise**: record the opened checkpoint, publish the record or keep a crew copy |
| Ilex | Furnace west 660 deck. Close steam, bring Sable, spend one medkit, or fit four salvage to the harness. Clear immediate threats first | Free trapped-freight recovery, +2 victory salvage, +3 shotgun damage; respects Orren and trades dry jokes with Sable | **Every name comes home**: recover the optional Abyss return seal, then register the workers’ return or rebuild field supplies |

Personal contracts use existing work boards and require their companion in the active crew. No main-story door requires a new companion.

Crew remarks are short, conditional and recorded in `open.chatter`. A minimum sixteen-second global interval and persistent seen flags prevent repeated lines. Place, discovery and completed personal-work conditions drive the remarks; not every pairing has a conversation.

## Discoveries, choices and visible consequences

- Workshop latch: Orren/Latch repairs for free, or any crew spends three salvage. A ladder and local-map landmark become permanently available.
- Survey: read the paper with any crew, or repair the terminal using engineering/three salvage. Both advance Nim’s work. Repair changes the terminal and adds a note only if the player has no personal Cableworks note; existing notes are preserved.
- Workshop letter: a quiet note about leaving a kettle warm. It records atmosphere without currency, loot or XP.
- Tenement receipt: evidence that Ashline’s shift toll was paid already.
- **No more tolls**, existing side contract: fight as before, present the receipt with Brass or +2 standing, or post a ¢45 public bond. Negotiation during combat costs two AP. A stand-down marks guards spared and already accounted for; it does not pay kill XP, ammunition or victory salvage. Workers visibly return. All approaches fulfill the original clearance contract.
- **Injured courier**, existing encounter: spend the original medkit, or use Sable’s field skill without consuming it. A safe-return notice appears afterward.
- **Broken service hoist**, existing encounter: spend the original three salvage, or use Ilex/Orren without parts. The original reward and machinery are granted once. A worker and recovered crate appear afterward.
- **Two scavengers, one kettle**, existing encounter: divide the original salvage, or donate two medkits instead for +2 standing and let the scavengers keep their stock. The housing prerequisite remains.
- Ilex’s return seal contains a personal note rather than an equipment chest. Her settlement and Brass’s record choices have different supplies, standing and bond rewards.

These build on the existing reputation, tools, contracts, local events and stock. There are no new currencies or dialogue statistics. Original Tenement repairs, clinic tools, machinery routes, charter branches and ending choices remain.

## Saves and compatibility

The original `undergrid.hollow-signal.v2` slot and version remain. Additive migration introduces `open = {version:1, discoveries:{}, choices:{}, chatter:{}}`; existing flags, quests, equipment, worlds, notes, atlas cells, bonds and reserves are retained. Validation accepts at most four active crew, requires Rook and unique valid identities, and checks exploration records. Old completed encounters remain completed.

A genuine save created in the preserved Alpha 8 HTML is imported through the file chooser in `open_test.py`, then saved and restored by Alpha 9. Older migration coverage remains in the existing suites. Positions on newly removed catwalk sections or new hatch openings are adjusted to nearby supported footing at load/import/arrival. This is a location safety adjustment, not a world/progression reset.

Jump/vault/drop arcs, paths, cable motion and follow warnings are runtime state. Saving waits for active traversal to land. Import and travel clear that runtime. Exporting during a planned airborne arc is deferred. Export a backup before switching browser origins; origin-specific storage rules still apply. Older builds do not support Alpha 9’s extra companions or four-person saves.

## Verification and limits

See [testing results](TESTING.md), [raw output](TEST_RESULTS.txt), [geometry/input tests](../tests/geometry_test.py), [people/choice/import tests](../tests/open_test.py), and [fresh Alpha 9 play](../tests/open_play_test.py). Controlled fixtures are distinguished from runs that acquire resources through play.

Known limits:

- This is a forgiving side-view RPG, with discrete ladder connections and planned traversal, rather than a continuous rigid-body simulation. Grappling is a clear-line winch, without rope swinging. Route AP measures the route’s node distance; it does not bill jump animation time separately.
- Narrow-obstacle vaulting uses sampled arcs. Very crowded authored future geometry needs its own clearance checks and playtests. Some ladders remain intentionally side-mounted. A broad metadata pass across the remaining districts is future work.
- Followers can take a longer ladder route after a fall. Unsupported, isolated geometry without a safe lower deck produces a warning and needs a winch or shelter regroup. Ordinary following does not teleport.
- Peaceful Ashline resolution stands down the district’s toll crew as a group. It is a small authored consequence, not a simulated faction system. Chatter is deliberately sparse.
- Four fighters increase available actions and firepower. Existing campaign and new adventure simulations complete, but prolonged human balance testing and physical iPad testing remain necessary. Chromium touch emulation checks layout/input, not hardware performance or browser diversity.

Next priorities: human-test jump timing and four-person difficulty; audit each remaining district’s ladder metadata and recovery routes; add a few deeper companion scenes with consequences; test on actual iPad Safari; profile dense fights and long save histories before adding more world area.
