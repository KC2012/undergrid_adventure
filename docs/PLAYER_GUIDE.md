# Field guide / Ward Bound 0.3

You are Rook, a drifter in Last Light. Speak to Mara beside the settlement lamp. Her instructions lead to the main expedition. Read the current objective in the left rail or open the journal with J.

## Controls

| Input | Action |
| --- | --- |
| A/D or left/right | Walk during exploration |
| W/S or up/down | Climb a nearby ladder |
| Space | Jump during exploration |
| Click a floor | Follow a connected ladder route; during combat, costs AP |
| E / USE | Talk, loot, use a hatch, read, rest, activate |
| 1 / 2 / 3, crew dock, or click a fighter | Select crew member |
| Tab / NEXT READY | Cycle to the next living fighter with AP remaining |
| Click a hostile | Shoot during combat |
| Click an explosive barrel | Shoot barrel (1 AP, 1 round) |
| R | Reload; 1 AP in combat |
| O | Spend remaining AP on one overwatch reaction |
| G, then click | Throw frag; 2 AP, range 550 |
| H | Heal selected crew member by up to 50; 1 AP |
| I / M / J | Equipment / atlas / journal |
| Enter / END TURN | Activate hostiles and begin the next round |
| Esc | Close a menu, cancel a frag, or pause |

Touch controls provide walk, climb, jump and interact. Tap floors or hostiles in combat. The crew dock stays visible on narrow screens. Its large numbers and three pips show each fighter’s AP; fallen fighters cannot be selected. Menus pause the world. Combat movement uses pointer/touch routes, not walking keys.

## Combat

Visible enemies trigger a district encounter when a crew member approaches within 430 world units. All living hostiles in that district participate. Each living crew member starts with 3 AP per round; you may alternate between them. Click a connected floor to preview and execute a walk/ladder route. Base movement costs 1 AP per 240 route units, rounded up; armor, gear and Tunnel Legs talents change this allowance (shown in PACK). choose shorter intermediate destinations when a route exceeds your available AP.

Shot chances include weapon accuracy, effective range, distance, level, suppression, cover and elevation. Steel platforms block firing lines through them. Crates protect a nearby target when they are on the shooter-facing side. Misses suppress targets; suppressed crew lose one AP on the next round. Shotguns also suppress and push enemies back on their floor. Range differs substantially between weapons; the long rifle costs two AP.

Barrels and frags damage allies as well as enemies, can trigger other barrels, and destroy crates. Be careful where you stand. Overwatch spends all remaining AP and permits one reaction shot during hostile movement if line of sight and ammo allow it. A shot consumes ammunition even if it misses.

Wire hounds rush into melee. Breachers close to shotgun range. Riflemen seek longer lanes. Wounded enemies stay wounded if you retreat. To retreat, move the selected crew member within 180 units of the encounter entry, open M, and select RETREAT. The crew returns to Last Light.

Clearing a district awards XP, credits and ammunition. Levels increase maximum HP and grant partial recovery. Fallen crew recover to 30% HP after victory. A full defeat returns you to your last bunk checkpoint with 75% HP and costs 15% of credits; discoveries and world wounds remain. Last Light's bunk heals freely. If completely out of ammunition, click a hostile within 70 units to strike with a knife for 1 AP.

## Preparing the crew

Ivo trades from the settlement's market balcony. The crew shares spare ammunition, medkits, grenades and credits. Each weapon keeps its own current magazine only while equipped; swapping unloads its rounds into reserves and loads the new gun from reserves. It never grants free ammo. All ranged weapons use the shared ammunition resource intentionally. The chainblade uses no rounds.

Two allies can join: Vera is a carbine courier; Orren is an armored shotgun engineer who restores 8 HP to surviving crew after a victory. They follow the selected character through the ladder graph outside combat. In combat, each is directly controlled and receives their own AP. Speak to them after clearing nearby hostiles.

## Opening route (spoilers)

1. Talk to Mara at Last Light. Take the ground-level eastern hatch to the Cableworks.
2. Clear the scavengers; recruit Vera on the western balcony. Follow the ladders to the high eastern platform and recover the live fuse.
3. Return to Mara for settlement power, a carbine, XP and credits.
4. Take Last Light's eastern balcony hatch to the Sump. Find the climbing rig on the upper platform, recruit Orren, recover the breach gun, and optionally restore the drainage pump.
5. Enter the Furnace Mile from the Sump or Cableworks. The high valve shuts off steam on the lower route. Recover the condenser heart from the eastern balcony and the carbine cache from the bridge.
6. With the rig, use the high Cableworks hatch to enter the Archive. Recover its cipher and optional long rifle.
7. Bring the heart and cipher to Mara. Her decoded signal opens the Furnace's eastern bulkhead.
8. Enter the Bell Engine, defeat the keeper and its escort, then interact with the listening terminal. You can keep exploring after the chapter ending.

Rail terminals in Last Light, the Archive and the Engine allow travel between discovered terminal districts after power is restored.

## Saving

Discoveries, purchases, travel, resting, and victories save automatically. Quiet periodic saves also run outside battle. SAVE manually before leaving. Saves and exports are disabled during battle. SYSTEM offers JSON backup export/import; malformed or incompatible saves are rejected without replacing the active expedition. Alpha 1 saves are not compatible. Reference games use separate storage.


## Ward Bound / beyond the first job

After returning the live fuse to Mara, climb to Last Light’s western balcony. Its new hatch leads to **Rustmarket**, a safe freight settlement with bunks, a supplier, a work board and a bench. You can accept and settle contracts at the boards in Last Light or Rustmarket. The journal lets you inspect all jobs; incomplete accepted jobs can be tracked on the objective rail.

| Job | What it changes |
| --- | --- |
| A living on the rails | Salvage the axle in Switchyard Nine, diesel in Ashline, and drive regulator in the Foundry. Repairs Locomotive 09 and grants a freight charter. |
| What we drink | Find filter membranes above Blackwater Gardens. Opens the sluice to Cinder Docks. |
| The weight of wages | Recover the Foundry coupler. Powers the counterweight lift to the Skyhook Stack. |
| Old routes, old wounds | Recruit Vera and find her ledger at the Dead Rail. Choose to burn or sell it. Either yields a Blacksite access key; bond and standing differ. |
| The kid who stayed | Recruit Orren, clear the Foundry and rescue Nix. Choose a clinic bed or a workshop. |
| Medicine before bullets | Recover the clinic cargo from the high crane deck at Cinder Docks. |
| Payday at gunpoint | Retrieve the lift-workers’ wages from the Skyhook crown. |
| No more tolls | Clear Rusk and the Ashline collectors. |
| The Rolling Mile | Board the repaired locomotive at Switchyard Nine. Clear its freight ambush and use the cab to complete delivery. |
| No receipts | Recover the unregistered cache from Blacksite Delta. |

The Dead Rail service road is on the Bell Engine’s eastern balcony, accessible after Mara decodes the freight signal. The Engine terminal now concludes a practical freight job; it does not reveal the universe’s hidden history.

Powered terminals allow travel between discovered stations. The locomotive provides an actual boarding/delivery loop and an ambush battlefield. During that fight, move to the brake van near the entry and USE to abandon the run. It is not a free-driving vehicle simulation. After the first delivery, work boards offer up to three salvage runs each at the yard, Ashline and Gardens. These repopulate enemies while preserving looted chests and quest discoveries.

## Build your fighters

PACK is now each fighter’s character sheet. Select the person you want to change, then set their callsign, phosphor color, gun, armor, field gear and weapon modification. Equipment is a collection of **patterns**, not individual rolled items: every fighter can use an unlocked pattern. All changes are available outside combat.

- **Armor:** leathers favor movement; mesh is balanced; breach plate protects at a movement cost; a ceramic firecoat blocks burn; ghostweave adds evasion and speed; Blacksite carapace provides the most protection at the largest mobility cost. Supplier reinforcements add to that fighter’s base armor.
- **Gear:** targeter adds aim; respirator blocks toxin and seep exposure; climbing rig improves route movement allowance; medic rig improves medkits; grounding braid blocks shock; salvage rig adds resources on victory. Each fighter equips one.
- **Mods:** optic rail trades damage for accuracy; hot-load breech trades accuracy for damage; penetrator feed trades damage for armor penetration. One mod per fighter.
- **Talents:** every level grants each fighter one point. Steady Hands improves aim, Hard Hitter improves damage, Tunnel Legs improves movement per AP, and Street Medicine improves medkits. Each has four ranks. Retrain the selected fighter for eight salvage to refund their spent points.
- **Bonds:** three victories together raise a fighter’s bond by one (maximum three); personal-job choices can change companion bonds. Each bond rank adds two accuracy.
- **Grudges:** a fighter downed by an identified hostile remembers them. Until that enemy dies, the fighter deals five extra damage against them. This survives a retreat or defeat.
- **Standing:** helping the wards increases standing. At +3, suppliers discount prices by 20%, rounded up. At -2, prices rise by 15%. Selling Vera’s ledger makes money immediately and costs standing and trust.

The bench is also accessible from PACK as a field-fabrication menu. Craft permanent gear/mod/weapon patterns with salvage. Chests, jobs and cleared districts supply salvage. Talent points and equipment are assigned separately to each person.

## Expanded arsenal and enemies

SMGs spend two rounds per burst. Hand cannons punch armor and knock targets back. Needle weapons apply toxin; flame projectors ignore low cover and apply burn. Arc guns apply shock; grounding braids counter them. Heavy machine guns always suppress. Launchers and plasma guns add friendly-fire blast damage. The chainblade is armor-ripping melee. The dead-letter marksman rifle comes from Vera’s personal job.

Toxin and burn tick once at the target’s next activation. Shock removes an additional AP, stacking with suppression. Enemy stitchers spend an activation healing nearby wounded allies. Demolition runners rush toward the crew and detonate when close. Hounds and chainblade collectors close for melee; drones and gunners seek firing lanes. Major collectors have their own weapons and armor, not just larger health bars.

## Save compatibility

0.2 Hollow Signal saves and JSON backups migrate to Ward Bound while retaining inventory, wounds, credits, companions and discoveries. New districts and customization defaults are added. Newer Ward Bound saves should not be opened in the old 0.2 build. Storage remains tied to the browser origin, so export a backup when moving between GitHub downloads, local files or a local server.
