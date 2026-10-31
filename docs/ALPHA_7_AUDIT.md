# Alpha 7 opening-experience audit

Before feature work, the existing fresh solo optional-adventure bot passed 14 checks: dispatch, all three Service Drains areas, six fights/five hostile rounds, two recoveries, extraction, workshop construction, equip and save/load. This is a deterministic bot, not a human first-hour timing study.

| Area | Finding | Alpha 7 response |
| --- | --- | --- |
| Controls and screenshots | Focus loss previously opened SYSTEM; broad boss warning hid the field | Retain the user's focus-loss and compact warning fixes; add regression coverage |
| First-hour choices | Lesson keeps requesting Mara even when the player chose optional work | Contextual optional-work, recovery and return-hatch hints |
| Equipment | Cards omit effective accuracy and AP comparison; all relics are effectively containers | Compact comparable stats; two workshop restoration chains while retaining old owned weapons |
| Rare effects | Mercy's secondary ray uses the struck enemy's weapon range; opening-round bonus is opaque | Independent conductive range/ray check; visible effect notes and distinctive firing feedback |
| Settlement | Seven projects work but give mostly transactions and unnamed scenery | Named residents, facility-linked requests/services, construction stages and expanded landmarks |
| Home | Trophy list is text only | Equipped weapon displays, expedition map and companion visits |
| World events | Unique static aid objects only; little variation on revisiting regions | Persisted, visit-based regional encounters with prerequisite checks and finite unique outcomes |
| Expeditions | Two survey cases; identical primary objective; return risks difficult to inspect | Three bounded work orders, optional objectives, compact field report and route-to-return action |
| Economy | Short material caps protect rarity, but original late routes have little reason to repeat | Low fixed successful-delivery pay for all routes, no renewable XP or rare patterns |
| Combat | Existing roles mostly work; companions can abandon watch while auto-following | Preserve role rules; leave watching companions in place; show suppression/equipment feedback |
| Saves | Existing machinery/world schemas support additive migration | Add a validated life-state record; preserve room IDs, campaign flags and old ownership |
| Touch | Journal button exists; overlapping objects still need keyboard F | Visible touch interaction-cycle control and bounded field-status UI |

No measured human campaign duration or physical-device usability conclusion is inferred from automation. Final results and narrower limitations belong in the Alpha 7 testing report.
