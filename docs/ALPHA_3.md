# Alpha 3 — The Living Undergrid (build 0.4)

## What changed

The equipment pass comes first. All fifteen weapons use distinct canonical line paths adapted from the original Undergrid reference. Those paths are shared by held weapons and inventory glyphs. The modular fighter model combines head/identity, armor, legs/boots, arms, weapon, gear and modification details. Six armor patterns have different silhouettes; respirators, targeters, harnesses, medical packs, grounding braids and salvage rigs have visible components. Vera’s scarf, Orren’s goggles, Sable’s medical band and Latch’s mechanical head remain identifiable when equipment changes.

World models and equipment inspection read the same weapon/armor/gear fields. Firing/recoil, reloading, hurt reactions, climbing, walking, jumping/falling and incapacitation have lightweight poses or effects. Humanoid enemies use their own weapon and armor role, drones carry their actual laser profile, and Excavator Zero changes weapons by phase. The current renderer originally contained one crew loop, not two; the audit retained one authoritative world draw per fighter and extended it to incapacitated fighters. Automated draw counters guard against duplicate world actors. No duplicate render was claimed where none was found.

The adventure now has **21 districts**, **16 contracts**, four recruitable companions and a three-person active crew. Five new spaces emphasize different uses of the world:

- **Tenement Nine:** investigate missing wages, restore power or settle arrears, and resolve the ward guards without killing them. The clinic and roof cache support practical rewards.
- **Vent Cathedral:** a taller industrial shaft with rotating fans, a power generator, a controlled freight lift, a steam bypass and an optional high fan cache.
- **Pressure Vault:** diving-access routes from two established districts, a buckled barrier, flood machinery, an injured attendant and a way into the excavation site.
- **Excavator Zero:** a mechanical encounter with separate stabilizers, a shielded core, changing weapons/armor, announced floor surges and a coolant countermeasure.
- **Room for One:** a safe apartment, radio mystery, packed bag and shelter. It connects old routes without forcing another fight.

## Interactive systems

Machine controls use E/USE and clearly list resource or AP costs. The same state persists between exploration and combat. Electrical repairs can use an active engineer, salvage or a loaded arc gun. Structural interactions use an earned cutter, a chainblade, suitable heavy fire or a frag; blasts can hurt nearby crew. Steam damages exposed actors at activation, and enemy pathfinding adds a penalty to active steam routes. The original furnace shutoff is also usable for one AP during combat.

A restored freight cage moves its riders through intermediate world coordinates. It is an operated ride, not a general physics object that can be jumped onto while moving. Saving defers while crew are in transit, avoiding mid-lift saves with missing carrier state.

Three traversal tools have repeated uses:

- The **magnetic grapple** winches the crew to authored anchors in the Cableworks, Tenement Nine and Vent Cathedral. T opens the tool menu; a pointer/tap chooses an anchor within 650 units. It costs two AP in combat.
- The **diving apparatus** opens submerged access from both the Sump and Cinder Docks. It does not add free swimming or an oxygen simulation.
- The **powered cutter** opens structural obstacles in the Vault and Foundry and sealed apartment entrances. A chainblade, heavy weapon or frag provides alternatives for the structural obstacles.

## People and consequences

Sable joins after stabilizing the Tenement courier and completing the clean-water clinic work order. Her presence adds eight HP to crew medkit healing, and she treats an injured flood attendant without consuming a kit. The attendant teaches a pump bypass that also works solo.

Latch joins after the Cathedral work order. The maintenance unit resists shock intrinsically and can perform engineer repairs. A shelter roster lets the player bench companions and form a different three-person party, retaining equipment, talents and bonds.

Vera recognizes the apartment service latch after her courier ledger is settled, giving an alternate entrance without a cutter. Orren repairs machinery without salvage costs. Choosing a workshop for Nix in the existing personal quest now provides a visible repair bench presence and a permanent 20% fabrication discount. The other personal-quest rewards remain intact.

Residents stand down when Tenement power is restored; their windows light up and the former guards appear as residents. The clinic opens, fans restart, water drains, barriers remain open, boss components stay disabled, and the final return tunnel becomes usable. These changes persist in saves. Short companion reactions are recorded once per place rather than repeated every visit. Deeper lore remains implied by missing readings, abandoned work orders and a radio voice.

## Atmosphere and controls

Optional local Web Audio synthesis adds weapon/mechanical cues, reloads, impacts, discoveries, quest feedback and a low industrial hum. It starts muted by default and needs a user gesture. SYSTEM → SOUND / VOLUME provides mute and master volume. No audio assets, external requests or paid services are used. All important cues also appear visually.

The equipment sheet has live fighter previews, weapon/armor art, and comparisons with the equipped weapon. The atlas supports persistent district pins. The crew dock and AP controls remain available on narrow screens.

## What remains

This is a richer campaign foundation, not a finished giant RPG. The tools use authored destinations; there is no pendulum grapple, free swimming, crawler drone or terrain mining. There is no generic moving-platform physics, dynamic faction simulation or general surrender AI. Tenement Nine has a specific nonviolent resolution. The staged boss is checked through controlled phase and completion fixtures, not an unassisted human balance run. Audio controls and API behavior were tested, but no formal listening test or browser/device matrix is claimed.

Next priorities: human playtests of the full new route and boss; more flexible navigation/panning; encounter grouping; stronger environmental sound variation; then another region built around the proven machinery and equipment systems. See TESTING.md for evidence and remaining limits.
