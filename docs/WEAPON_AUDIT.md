# Weapon artwork audit / Alpha 7

The supplied original reference and the repository's retained original are byte-identical, SHA256 `cf4d40e1ebaca82f88bf6b0b4cd03da4487eb247103183d0d8e23e5f771bf9bb`.

The incoming Adventure build already adapted the original's `canonicalWeaponPath` (original reference lines around 2982–3043, geometry version 1.36.4a). The uploaded reference contains later gameplay/FX patches too; these are not interchangeable with Adventure's combat rules. This audit found no justification for replacing already matching canonical outlines with generic replacements.

| Adventure class | Original canonical key |
| --- | --- |
| Salvage pistol | PISTOL |
| Ward carbine | CARBINE |
| Breach gun | SHOTGUN |
| Surveyor long rifle | SNIPER |
| Submachine gun | SMG |
| Hand cannon / needle pistol | HAND_CANNON / NEEDLE_PISTOL |
| Laser / arc / flame / plasma | LASER_RIFLE / ARC_GUN / FLAME_PROJECTOR / PLASMA_GUN |
| Grenade launcher / heavy | LAUNCHER / HEAVY |
| Chainblade / arc blade | CHAINBLADE / ARC_BLADE |
| Marksman / burst rifle | MARKSMAN_RIFLE / BURST_RIFLE |

Alpha 6 retains these mapped outlines and muzzle-right orientation. Pistol classes use a sidearm arm pose; two-AP weapons use a lowered supporting elbow; other long weapons use the two-arm support pose. Player, companions, enemy figures, inventory and inspection gallery use the same fighter/weapon renderer. Exceptional weapons extend the corresponding class with unique geometry rather than color changes. Mercy Killing uses the electrical muzzle palette and a real secondary tracer.

Open **WARD DEVELOPMENT → WEAPON GALLERY** for all 23 equipped models, including six exceptional weapons. The inspection does not change ownership. Inventory remains the place to equip owned patterns on an individual fighter. Existing reload, recoil, impact, tracer, energy and blast effects remain procedural; this release does not claim a full replacement of original FX.

The visual regression suite checks distinct weapon, armor and gear rasters, inventory parity, companion identity, animation state and one world draw per fighter. Staged gallery and settlement screenshots supplement those checks; they do not demonstrate combat balance.

## Alpha 7 follow-through

The canonical mapping remains unchanged. New firearm-specific firing poses/recoil and muzzle/shot geometry distinguish all six exceptional weapons. The Bell uses a fan, Dead Air a narrow suppressed trace, Mercy its independent chain ray, Disorder three traces, Widowmaker a heavy impact and Furnace Key its flame cone. Local synthesis gives each its own pitch and noise profile. These changes share the existing player, companion, enemy and preview renderer. No unrelated original Undergrid deployment system was imported.

The visual suite still raster-checks all 23 weapons, eight armors and eleven field-gear states. Audio execution is tested through the existing audio controls; human listening quality and physical-device behavior remain unreviewed.
