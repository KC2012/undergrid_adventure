# Alpha 8 combat review and adaptation decisions

Reference: the retained supplied `UNDERGRID_v15034_crew_back_to_menu.html`, SHA256 `cf4d40e1ebaca82f88bf6b0b4cd03da4487eb247103183d0d8e23e5f771bf9bb`. Alpha 7's 26-check fresh optional route passed against its preserved HTML before feature work. No new reference upload was supplied for this round.

| Original concept reviewed | Adventure audit | Adaptation |
| --- | --- | --- |
| `shotInfo`, around lines 1113–1166 | Existing range/steel/cover/high-ground calculation works, but the preview omits damage, penetration and ammo | Share damage/AP/ammo predictions with the resolver; show compact range, directional-cover, elevation and effect information |
| Floor-slab audit and multi-body-point cover rays | Adventure has solid platforms, one body ray and binary low cover | Keep the established body ray and directional low cover; document flanking and destruction rather than copying incompatible exposure tiers |
| Suppression status, around 1208–1325; movement factor around 1371 | Existing misses/heavy hits suppress, affecting accuracy while marked and next AP; no deliberate volume-fire control | Add explicit suppressive fire for SMG/heavy/burst classes and readable status marks; retain existing AP scale and penalties |
| `move`, `climb`, `jumpData`, around 1371–1384 | Player route/AP code works, but dash previews can advertise unaffordable destinations | Use one movement forecast for command and preview, including dash range, real route, elevation, cover and hazards |
| Bounded activation AI, around 1384–1400 | Most enemies pick nearest target and approach a fixed distance; heavy guns can move instead of taking an available shot | Add bounded target/cover/position scoring and conservative fallback, while retaining boss, medic, bomber, dispatch and pursuit logic |
| Final industrial-hazard patches, around 16500–16830 | Adventure already has explosive barrels, steam, chemicals, conveyors and machine switches | Expose those rules in previews; permit tactical electrical isolation; let eligible enemies recognize safe barrel opportunities without random hazard generation |
| Canonical weapon artwork and later resource/FX patches | Adventure already shares matching canonical geometry and six exceptional FX variants | Keep that renderer and class balance; add restrained protection/suppression/blocked/armor feedback |

Not ported: multi-ray visibility, separate skirmish stats, ammo reliability/jam system, heavy-gun packing/deployment, procedural battlefield generator, full grenade-zone model or unrestricted AI search. Adventure's RPG HP, three-player-AP rhythm, campaign/expedition gates and offline architecture remain its own.
