import type { Pokemon, BattleSet } from '../types';
import { PokemonType } from '../types';
import { getRentalPassesForPokemon } from './rentalPassService';

// Raw database string provided by the user
const PBR_DATABASE_STRING = `
u/RestorerForer Pokémon Battle Revolution PBR DATABASE FILE THINGY (Last Updated 15/July/2025)
Search for a specific Pokémon/ Item/ Move/ Ability you want to use!
THIS IS THE FORMAT FOR PC (more spaces) if you want an excel spreadsheet it's in the folder!


Species		Box no.	Gender	Level	Ability		Move1		Move2		Move3		Move4		HeldItem	HP	ATK	DEF	SPA	SPD	SPE

Venusaur	[1]	F	100	Overgrow	Power Whip	Sludge Bomb	Frenzy Plant	Sleep Powder	Wide Lens	301	200	181	266	270	284
Venusaur	[1]	M	100	Overgrow	Giga Drain	Sludge Bomb	Sleep Powder	Leech Seed	Big Root	342	152	223	287	256	216
Charizard	[1]	M	100	Blaze		Heat Wave	Air Slash	Solar Beam	Blast Burn	Wise Glasses	297	155	193	317	206	328
Charizard	[1]	M	100	Blaze		Flare Blitz	Thunder Punch	Earthquake	Dragon Dance	Expert Belt	297	293	206	228	206	286
Blastoise	[1]	M	100	Torrent		Surf		Ice Beam	Hydro Cannon	Roar		Custap Berry	362	181	237	295	246	192
Blastoise	[1]	M	100	Torrent		Hydro Pump	Skull Bash	Rapid Spin	Roar		Power Herb	362	181	236	295	247	192
Butterfree	[1]	M	100	Compound Eyes	Bug Buzz	Sleep Powder	Tailwind	Protect		Focus Sash	261	85	137	259	196	262
Beedrill	[1]	M	100	Swarm		Twineedle	Poison Jab	Brick Break	Endure		Salac Berry	271	284	116	113	197	249
Pidgeot		[1]	M	100	Tangled Feet	Brave Bird	Mirror Move	Tailwind	Substitute	Iapapa Berry	307	259	168	176	176	309
Raticate	[1]	M	100	Guts		Facade		Flame Wheel	U-turn		Protect		Toxic Orb	252	261	156	122	176	322
Fearow		[1]	M	100	Keen Eye	Drill Peck	Frustration	Quick Attack	U-turn		Focus Sash	271	279	167	142	158	328
Arbok		[1]	M	100	Intimidate	Gunk Shot	Seed Bomb	Glare		Substitute	Gastro Acid	324	207	174	149	282	196
Pikachu		[1]	F	100	Static		Fake Out	Volt Tackle	Surf		Encore		Light Ball	211	209	86	137	116	306
Raichu		[1]	F	100	Static		Fake Out	Thunderbolt	Grass Knot	Magnet Rise	Wise Glasses	261	166	146	279	197	328
Sandslash	[1]	M	100	Sand Veil	Earthquake	Focus Punch	Sleep Talk	Substitute	Lax Incense	354	328	257	113	146	166
Nidoqueen	[1]	F	100	Poison Point	Earthquake	Ice Beam	Toxic Spikes	Protect		Sitrus Berry	384	200	286	187	219	169
Nidoking	[1]	M	100	Rivalry		Earth Power	Ice Beam	Thunderbolt	Superpower	Expert Belt	303	224	206	295	167	250
Ninetales	[1]	M	100	Flash Fire	Overheat	Solar Beam	Will-O-Wisp	Sunny Day	White Herb	305	141	186	244	236	328
Clefable	[1]	M	100	Magic Guard	Ice Beam	Seismic Toss	Follow Me	Wish		Leftovers	394	130	183	206	306	156
Wigglytuff	[1]	F	100	Cute Charm	Seismic Toss	Metronome	Attract		Wish		Leftovers	432	176	184	186	213	113
Golbat		[1]	M	100	Inner Focus	Brave Bird	U-turn		Tailwind	Roost		Sitrus Berry	291	259	177	149	186	306
Vileplume	[1]	M	100	Chlorophyll	Sludge Bomb	Solar Beam	Sleep Powder	Protect		Miracle Seed	300	148	206	328	216	191
Parasect	[1]	M	100	Dry Skin	Seed Bomb	X-Scissor	Spore		Protect		Life Orb	310	269	206	156	245	58
Venomoth	[1]	M	100	Tinted Lens	Bug Buzz	Psychic		U-turn		Sleep Powder	Focus Sash	281	167	140	279	186	306
Dugtrio		[1]	M	100	Arena Trap	Earthquake	Sucker Punch	Reversal	Endure		Liechi Berry	212	259	136	122	176	372
Persian		[1]	M	100	Technician	Fake Out	Swift		Water Pulse	Nasty Plot	Silk Scarf	272	158	156	229	166	361
Golduck		[1]	M	100	Cloud Nine	Surf		Icy Wind	Yawn		Encore		Leftovers	309	152	242	226	209	288
Primeape	[1]	M	100	Vital Spirit	Close Combat	U-turn		Punishment	Ice Punch	Focus Sash	279	309	156	140	176	310
Arcanine	[1]	M	100	Intimidate	Flare Blitz	Extreme Speed	Overheat	Will-O-Wisp	Lum Berry	369	350	196	212	196	242
Poliwrath	[1]	M	100	Water Absorb	Waterfall	Focus Punch	Encore		Substitute	Leftovers	384	295	227	158	216	176
Kadabra		[2]	M	100	Synchronize	Psychic		Encore		Disable		Kinesis		Focus Sash	222	67	96	339	176	339
Alakazam	[2]	M	100	Synchronize	Psychic		Energy Ball	Focus Blast	Protect		Focus Sash	252	94	126	369	206	372
Machoke		[2]	M	100	No Guard	Dynamic Punch	Fissure		Bullet Punch	Protect		Focus Sash	340	287	176	122	156	189
Machamp		[2]	M	100	No Guard	Dynamic Punch	Stone Edge	Bullet Punch	Protect		Sitrus Berry	384	394	196	149	207	146
Machamp		[2]	M	100	Guts		Close Combat	Earthquake	Bullet Punch	Protect		Flame Orb	383	394	196	149	208	146
Victreebel	[2]	M	100	Chlorophyll	Sludge Bomb	Solar Beam	Weather Ball	Sleep Powder	Wise Glasses	301	193	167	328	204	191
Tentacruel	[2]	M	100	Liquid Ooze	Rapid Spin	Surf		Toxic Spikes	Knock Off	Black Sludge	362	158	201	196	337	236
Graveler	[2]	M	100	Rock Head	Earthquake	Stone Edge	Double-Edge	Self-Destruct	Choice Band	252	317	329	126	126	67
Golem		[2]	M	100	Sturdy		Rock Blast	Earthquake	Hammer Arm	Sucker Punch	Focus Sash	362	350	299	146	166	85
Rapidash	[2]	M	100	Flash Fire	Flare Blitz	Overheat	Megahorn	Will-O-Wisp	Charcoal	271	299	177	176	196	339
Slowbro		[2]	M	100	Own Tempo	Surf		Psychic		Calm Mind	Slack Off	Leftovers	394	139	339	236	207	65
Magneton	[2]	-	100	Magnet Pull	Zap Cannon	Mirror Shot	Gravity		Magic Coat	Wide Lens	304	112	226	276	177	262
Farfetch’d	[2]	M	100	Inner Focus	Slash		Knock Off	U-turn		Toxic		Leek		308	251	146	136	160	157
Dodrio		[2]	M	100	Early Bird	Brave Bird	Frustration	Quick Attack	Taunt		Sharp Beak	261	319	177	140	156	328
Dewgong		[2]	M	100	Hydration	Ice Beam	Surf		Rain Dance	Rest		Quick Claw	384	130	243	176	226	215
Muk		[2]	M	100	Sticky Hold	Poison Jab	Fire Punch	Shadow Sneak	Curse		Black Sludge	414	246	206	149	308	136
Haunter		[2]	M	100	Levitate	Shadow Ball	Icy Wind	Skill Swap	Pain Split	Focus Sash	231	94	127	329	146	317
Gengar		[2]	M	100	Levitate	Shadow Ball	Focus Blast	Will-O-Wisp	Taunt		Focus Sash	281	121	156	340	186	350
Cloyster	[2]	M	100	Skill Link	Ice Shard	Rock Blast	Icicle Spear	Spikes		Razor Fang	280	303	396	185	150	190
Hypno		[2]	F	100	Insomnia	Psychic		Fire Punch	Sunny Day	Trick Room	Leftovers	374	182	226	163	308	170
Kingler		[2]	M	100	Hyper Cutter	Crabhammer	Rock Slide	Agility		Toxic		Wide Lens	278	394	266	122	136	223
Electrode	[2]	-	100	Static		Thunderbolt	Taunt		Light Screen	Self-Destruct	Focus Sash	261	152	176	259	176	400
Electrode	[2]	-	100	Soundproof	Thunder		Taunt		Rain Dance	Self-Destruct	Focus Sash	261	191	176	221	176	399
Exeggutor	[2]	M	100	Chlorophyll	Solar Beam	Dream Eater	Sunny Day	Sleep Powder	Leftovers	341	175	206	383	176	190
Marowak		[2]	M	100	Lightning Rod	Bonemerang	Thunder Punch	Icy Wind	Detect		Thick Club	261	259	257	122	196	207
Hitmonlee	[2]	M	100	Reckless	Fake Out	High Jump Kick	Blaze Kick	Bullet Punch	Wide Lens	242	339	142	95	256	300
Hitmonchan	[2]	M	100	Iron Fist	Fake Out	Mach Punch	Drain Punch	Ice Punch	Fist Plate	304	339	195	95	256	188
Weezing		[2]	M	100	Levitate	Sludge Bomb	Fire Blast	Haze		Pain Split	Black Sludge	334	166	331	220	201	156
Rhydon		[2]	M	100	Lightning Rod	Earthquake	Rock Slide	Avalanche	Counter		Focus Sash	414	394	276	127	126	104
Chansey		[3]	F	100	Natural Cure	Seismic Toss	Toxic		Wish		Protect		Leftovers	642	13	109	106	339	136
Kangaskhan	[3]	F	100	Scrappy		Fake Out	Return		Sucker Punch	Helping Hand	Sitrus Berry	404	236	222	104	222	250
Seadra		[3]	M	100	Poison Point	Octazooka	Disable		Rain Dance	Toxic		Focus Sash	301	121	233	273	126	253
Seaking		[3]	M	100	Swift Swim	Aqua Tail	Megahorn	Bounce		Protect		Wide Lens	301	311	149	166	220	212
Starmie		[3]	-	100	Natural Cure	Hydro Pump	Thunder		Ice Beam	Recover		Expert Belt	261	139	206	299	207	361
Starmie		[3]	-	100	Natural Cure	Surf		Thunderbolt	Thunder Wave	Rapid Spin	Sitrus Berry	324	139	206	236	207	361
Mr. Mime	[3]	M	100	Filter		Psychic		Focus Blast	Thunderbolt	Trick		Choice Scarf	264	85	166	313	276	251
Jynx		[3]	F	100	Forewarn	Icy Wind	Blizzard	Lovely Kiss	Nasty Plot	Focus Sash	313	94	106	288	226	317
Electabuzz	[3]	M	100	Static		Thunder		Psychic		Follow Me	Rain Dance	Focus Sash	272	153	150	289	206	339
Magmar		[3]	M	100	Flame Body	Fire Blast	Will-O-Wisp	Follow Me	Sunny Day	Focus Sash	271	175	150	299	207	313
Pinsir		[3]	M	100	Mold Breaker	X-Scissor	Close Combat	Flail		Endure		Salac Berry	271	383	237	131	176	269
Tauros		[3]	M	100	Intimidate	Giga Impact	Earthquake	Pursuit		Iron Head	Muscle Band	291	299	227	104	176	350
Lapras		[3]	M	100	Water Absorb	Surf		Icy Wind	Thunderbolt	Perish Song	Leftovers	464	157	196	281	240	156
Ditto		[3]	-	100	Limber		Transform	(None)		(None)		(None)		Leftovers	300	101	214	132	133	90
Gyarados	[3]	M	100	Intimidate	Waterfall	Thunder Wave	Rest		Roar		Chesto Berry	393	286	282	140	238	198
Gyarados	[3]	F	100	Intimidate	Waterfall	Earthquake	Ice Fang	Dragon Dance	Wacan Berry	333	380	196	140	236	261
Omastar		[3]	M	100	Swift Swim	Hydro Pump	Earth Power	Ice Beam	Stealth Rock	Shuca Berry	336	112	286	336	188	166
Kabutops	[3]	M	100	Swift Swim	Aqua Jet	Rock Slide	Low Kick	Swords Dance	Focus Sash	276	360	246	149	176	246
Aerodactyl	[3]	M	100	Pressure	Rock Slide	Earthquake	Taunt		Stealth Rock	Focus Sash	301	309	167	140	186	394
Ditto		[3]	-	100	Limber		Transform	(None)		(None)		(None)		Choice Scarf	300	90	132	132	133	214
Vaporeon	[3]	M	100	Water Absorb	Surf		Helping Hand	Wish		Rain Dance	Leftovers	463	121	233	256	235	166
Jolteon		[3]	M	100	Volt Absorb	Discharge	Shadow Ball	Helping Hand	Charm		Focus Sash	271	121	156	319	227	394
Flareon		[3]	M	100	Flash Fire	Lava Plume	Helping Hand	Wish		Sunny Day	Leftovers	333	238	167	226	330	176
Dragonair	[3]	M	100	Shed Skin	Outrage		Extreme Speed	Aqua Tail	Dragon Dance	Life Orb	276	293	166	158	176	227
Dragonite	[3]	F	100	Inner Focus	Dragon Claw	Earthquake	Fire Punch	Dragon Dance	Lum Berry	323	403	227	212	236	259
Snorlax		[3]	M	100	Immunity	Frustration	Earthquake	Curse		Sleep Talk	Leftovers	463	268	229	149	336	96
Articuno	[3]	-	100	Pressure	Blizzard	Ancient Power	Reflect		Tailwind	Leftovers	383	157	261	226	345	218
Zapdos		[3]	-	100	Pressure	Discharge	Heat Wave	U-turn		Roost		Leftovers	383	194	289	286	216	244
Moltres		[3]	-	100	Pressure	Heat Wave	Air Slash	Ominous Wind	Fire Spin	Flame Plate	321	184	216	383	207	279
Mewtwo		[3]	-	100	Pressure	Psybeam		Mega Punch	Me First	Taunt		Wise Glasses	354	269	194	394	216	394
Mew		[3]	-	100	Synchronize	Psybeam		Icy Wind	Transform	Aromatherapy	Sitrus Berry	404	184	236	237	236	328
Meganium	[4]	M	100	Overgrow	Giga Drain	Light Screen	Reflect		Leech Seed	Big Root	314	152	327	204	285	197
Typhlosion	[4]	M	100	Blaze		Heat Wave	Blast Burn	Extrasensory	Endure		Salac Berry	298	173	192	348	185	299
Feraligatr	[4]	M	100	Torrent		Waterfall	Earthquake	Ice Punch	Dragon Dance	Muscle Band	318	339	236	174	202	249
Furret		[4]	M	100	Run Away	Return		Brick Break	U-turn		Trick		Choice Band	312	251	164	113	146	306
Noctowl		[4]	M	100	Insomnia	Night Shade	Tailwind	Reflect		Whirlwind	Leftovers	404	94	162	188	291	177
Ledian		[4]	M	100	Early Bird	Agility		Swords Dance	Baton Pass	Encore		Focus Sash	289	67	136	146	282	295
Ariados		[4]	M	100	Insomnia	Poison Jab	Sucker Punch	Toxic Spikes	Protect		Focus Sash	344	306	176	140	157	116
Crobat		[4]	M	100	Inner Focus	Sky Attack	Super Fang	Taunt		Tailwind	Power Herb	352	216	216	130	216	376
Lanturn		[4]	M	100	Volt Absorb	Surf		Discharge	Icy Wind	Thunder Wave	Leftovers	391	108	177	270	232	170
Togetic		[4]	M	100	Serene Grace	Tri Attack	Nasty Plot	Follow Me	Baton Pass	Salac Berry	301	76	206	196	314	153
Xatu		[4]	M	100	Synchronize	Psychic		U-turn		Me First	Trick Room	Leftovers	334	186	165	226	176	310
Ampharos	[4]	M	100	Static		Discharge	Power Gem	Heal Bell	Reflect		Leftovers	384	139	186	314	260	146
Bellossom	[4]	F	100	Chlorophyll	Solar Beam	Sleep Powder	Worry Seed	Sunny Day	Focus Sash	291	148	206	306	237	199
Azumarill	[4]	M	100	Huge Power	Aqua Jet	Waterfall	Brick Break	Ice Punch	Muscle Band	402	218	197	122	197	137
Azumarill	[4]	M	100	Huge Power	Aqua Jet	Ice Punch	Superpower	Belly Drum	Sitrus Berry	403	218	197	122	197	136
Sudowoodo	[4]	M	100	Rock Head	Rock Slide	Hammer Arm	Wood Hammer	Stealth Rock	Custap Berry	344	275	320	86	166	96
Politoed	[4]	M	100	Water Absorb	Surf		Ice Beam	Toxic		Encore		Leftovers	384	139	212	216	301	176
Jumpluff	[4]	M	100	Chlorophyll	Solar Beam	Sunny Day	Encore		Memento		Focus Sash	354	103	177	146	206	350
Sunflora	[4]	M	100	Solar Power	Solar Beam	Earth Power	Light Screen	Sunny Day	Life Orb	354	155	147	339	206	58
Quagsire	[4]	M	100	Water Absorb	Earthquake	Counter		Yawn		Recover		Leftovers	394	206	207	149	251	106
Espeon		[4]	F	100	Synchronize	Psychic		Shadow Ball	Reflect		Substitute	Twisted Spoon	271	121	156	359	227	350
Umbreon		[4]	M	100	Synchronize	Payback		Curse		Toxic		Wish		Leftovers	394	166	282	140	367	166
Umbreon		[4]	M	100	Synchronize	Dark Pulse	Heal Bell	Yawn		Wish		Chople Berry	394	121	285	157	361	167
Slowking	[4]	M	100	Own Tempo	Surf		Me First	Slack Off	Trick Room	Leftovers	394	186	236	236	308	58
Unown		[4]	-	100	Levitate	Hidden PowerFIR	Shadow Force	Roar of Time	Judgment	Mind Plate	238	151	132	267	195	92
Wobbuffet	[4]	M	100	Shadow Tag	Mirror Coat	Counter		Encore		Destiny Bond	Custap Berry	528	63	209	102	236	102
Girafarig	[4]	M	100	Inner Focus	Razor Wind	Psychic		Agility		Baton Pass	Power Herb	344	148	166	306	167	206
Forretress	[4]	M	100	Sturdy		Payback		Rapid Spin	Toxic Spikes	Stealth Rock	Leftovers	354	216	317	140	240	116
Dunsparce	[4]	M	100	Serene Grace	Body Slam	Earthquake	Bite		Magic Coat	King’s Rock	377	176	248	149	206	127
Dunsparce	[4]	M	100	Run Away	Rollout		Defense Curl	Yawn		Agility		Wide Lens	341	262	176	149	166	189
Steelix		[5]	F	100	Sturdy		Gyro Ball	Earthquake	Curse		Roar		Leftovers	354	207	436	146	251	58
Granbull	[5]	M	100	Intimidate	Frustration	Crunch		Thunder Wave	Heal Bell	Leftovers	384	276	235	140	181	137
Qwilfish	[5]	M	100	Swift Swim	Aqua Jet	Toxic Spikes	Acupressure	Self-Destruct	Focus Sash	272	289	186	131	146	295
Scizor		[5]	M	100	Technician	U-turn		Bullet Punch	Superpower	Pursuit		Muscle Band	343	394	236	131	198	166
Scizor		[5]	M	100	Technician	Bug Bite	Bullet Punch	Swords Dance	Roost		Leftovers	343	341	236	131	247	166
Heracross	[5]	F	100	Guts		Brick Break	Megahorn	Sleep Talk	Rest		Leftovers	342	315	217	104	280	206
Shuckle		[5]	M	100	Sturdy		Toxic		Encore		Stealth Rock	Knock Off	Leftovers	244	56	500	56	610	15
Shuckle		[5]	M	100	Gluttony	Rock Slide	Earthquake	Gyro Ball	Power Trick	Custap Berry	244	57	614	56	496	13
Ursaring	[5]	M	100	Quick Feet	Facade		Close Combat	Crunch		Swords Dance	Toxic Orb	322	359	186	167	186	229
Magcargo	[5]	M	100	Flame Body	Lava Plume	Rock Slide	Stealth Rock	Will-O-Wisp	Leftovers	304	136	304	196	259	86
Corsola		[5]	M	100	Natural Cure	Surf		Toxic		Stealth Rock	Recover		Leftovers	314	103	268	166	232	106
Octillery	[5]	M	100	Suction Cups	Octazooka	Energy Ball	Ice Beam	Fire Blast	Expert Belt	354	193	186	339	187	126
Delibird	[5]	M	100	Hustle		Aerial Ace	Ice Punch	Ice Shard	Focus Punch	Life Orb	231	209	126	149	127	273
Mantine		[5]	M	100	Water Absorb	Surf		Icy Wind	Sleep Talk	Rain Dance	Leftovers	334	76	186	206	396	176
Skarmory	[5]	M	100	Keen Eye	Sky Attack	Thief		Stealth Rock	Tailwind	Power Herb	334	197	316	104	176	262
Skarmory	[5]	M	100	Keen Eye	Brave Bird	Spikes		Whirlwind	Roost		Leftovers	334	196	397	104	195	176
Kingdra		[5]	F	100	Swift Swim	Hydro Pump	Draco Meteor	Ice Beam	Rain Dance	White Herb	343	175	226	286	226	247
Kingdra		[5]	M	100	Swift Swim	Waterfall	Outrage		Dragon Dance	Rest		Lum Berry	327	292	226	203	236	247
Houndoom	[5]	F	100	Flash Fire	Dark Pulse	Fire Blast	Nasty Plot	Snatch		Passho Berry	291	166	136	319	197	317
Donphan		[5]	M	100	Sturdy		Earthquake	Ice Shard	Assurance	Sandstorm	Sitrus Berry	384	372	276	140	156	137
Porygon2	[5]	-	100	Download	Ice Beam	Thunderbolt	Trick Room	Recover		Leftovers	374	148	297	256	226	125
Stantler	[5]	M	100	Intimidate	Frustration	Megahorn	Sucker Punch	Hypnosis	Life Orb	288	289	160	185	166	295
Smeargle	[5]	M	100	Own Tempo	Follow Me	Magic Coat	Tailwind	Counter		Focus Sash	314	45	107	68	126	273
Smeargle	[5]	M	100	Own Tempo	Dark Void	Spore		Trick Room	Transform	Focus Sash	314	45	107	68	126	273
Hitmontop	[5]	M	100	Intimidate	Fake Out	Brick Break	Sucker Punch	Feint		Leftovers	304	227	317	95	256	176
Hitmontop	[5]	M	100	Technician	Fake Out	Rolling Kick	Aerial Ace	Sucker Punch	Focus Sash	241	317	227	95	256	239
Miltank		[5]	F	100	Scrappy		Body Slam	Heal Bell	Curse		Milk Drink	Leftovers	394	196	247	104	262	236
Blissey		[5]	F	100	Serene Grace	Blizzard	Charge Beam	Stealth Rock	Healing	Wish	Chople Berry	700	22	130	186	321	146
Tyranitar	[5]	M	100	Sand Stream	Crunch		Rock Slide	Superpower	Pursuit		Muscle Band	341	367	256	203	237	243
Tyranitar	[5]	M	100	Sand Stream	Crunch		Rock Slide	Earthquake	Dragon Dance	Chople Berry	341	367	256	203	237	243
Raikou		[6]	-	100	Pressure	Discharge	Aura Sphere	Shadow Ball	Magnet Rise	Shuca Berry	321	157	186	329	237	361
Entei		[6]	-	100	Pressure	Fire Blast	Stone Edge	Extreme Speed	Sleep Talk	Muscle Band	371	320	206	255	167	299
Suicune		[6]	-	100	Pressure	Surf		Signal Beam	Icy Wind	Calm Mind	Leftovers	341	139	266	279	267	295
Lugia		[6]	-	100	Pressure	Aeroblast	Aurora Beam	Reflect		Whirlwind	Leftovers	400	190	350	250	350	270
Ho-Oh		[6]	-	100	Pressure	Sacred Fire	Pluck		Earth Power	Whirlwind	Sharp Beak	400	275	275	275	350	225
Celebi		[6]	-	100	Natural Cure	Giga Drain	Future Sight	Thunder Wave	Stealth Rock	Leftovers	400	200	288	250	250	250
Sceptile	[6]	M	100	Overgrow	Leaf Storm	Mimic		Swagger		Worry Seed	White Herb	282	185	167	307	207	372
Blaziken	[6]	F	100	Blaze		Flare Blitz	Sky Uppercut	Thunder Punch	Endure		Salac Berry	301	372	176	230	177	259
Swampert	[6]	M	100	Torrent		Hydro Pump	Surf		Earth Power	Ice Beam	Expert Belt	400	225	221	295	216	112
Swampert	[6]	M	100	Torrent		Stealth Rock	Earthquake	Waterfall	Ice Punch	Leftovers	401	350	216	185	216	160
Mightyena	[6]	M	100	Intimidate	Sucker Punch	Super Fang	Snatch		Taunt		Leftovers	343	269	176	140	156	212
Linoone		[6]	M	100	Gluttony	Extreme Speed	Seed Bomb	Shadow Claw	Belly Drum	Salac Berry	338	262	158	122	158	258
Beautifly	[6]	M	100	Swarm		Bug Buzz	Giga Drain	Tailwind	Stun Spore	Focus Sash	261	130	137	306	136	229
Dustox		[6]	M	100	Shield Dust	Bug Buzz	Toxic		Roost		Whirlwind	Black Sludge	323	94	178	136	306	166
Ludicolo	[6]	M	100	Swift Swim	Fake Out	Grass Knot	Hydro Pump	Mist		Wise Glasses	309	158	176	306	236	232
Shiftry		[6]	M	100	Chlorophyll	Fake Out	Dark Pulse	Leaf Storm	Tailwind	Focus Sash	322	212	156	306	156	259
Swellow		[6]	M	100	Guts		Facade		Brave Bird	U-turn		Protect		Toxic Orb	262	269	156	122	136	383
Pelipper	[6]	M	100	Keen Eye	Hydro Pump	Air Cutter	Tailwind	Roost		Wise Glasses	261	94	237	295	176	229
Gardevoir	[6]	F	100	Trace		Psychic		Imprison	Trick Room	Protect		Leftovers	340	121	229	286	292	197
Gardevoir	[6]	M	100	Trace		Psychic		Thunderbolt	Shadow Ball	Trick		Choice Scarf	277	121	167	349	266	284
Masquerain	[6]	M	100	Intimidate	Hydro Pump	Air Slash	U-turn		Tailwind	Focus Sash	281	140	161	259	200	240
Breloom		[6]	M	100	Poison Heal	Seed Bomb	Superpower	Mach Punch	Spore		Toxic Orb	324	345	196	140	156	222
Vigoroth	[6]	M	100	Vital Spirit	Body Slam	Low Kick	Sucker Punch	Bulk Up		Leftovers	302	259	196	131	146	306
Slaking		[6]	M	100	Truant		Frustration	Earthquake	Fire Punch	Giga Impact	Muscle Band	454	460	236	204	166	286
Ninjask		[6]	M	100	Speed Boost	X-Scissor	Dig		Swords Dance	Baton Pass	Focus Sash	309	306	127	122	136	373
Shedinja	[6]	-	100	Wonder Guard	X-Scissor	Shadow Claw	Swords Dance	Will-O-Wisp	Focus Sash	1	306	126	86	96	179
Exploud		[6]	M	100	Soundproof	Frustration	Earthquake	Crunch		Surf		Life Orb	349	309	162	196	179	219
Hariyama	[6]	M	100	Guts		Fake Out	Close Combat	Stone Edge	Detect		Toxic Orb	465	372	156	116	184	94
Sableye		[6]	M	100	Keen Eye	Fake Out	Sucker Punch	Will-O-Wisp	Feint		Custap Berry	304	186	246	149	192	136
Mawile		[6]	F	100	Intimidate	Brick Break	Punishment	Fake Tears	Attract		Leftovers	304	231	206	131	206	136
Aggron		[7]	M	100	Rock Head	Head Smash	Low Kick	Ice Punch	Magnet Rise	Quick Claw	344	350	396	156	157	94
Delcatty	[7]	F	100	Normalize	Fake Out	Sucker Punch	Thunder Wave	Assist		Silk Scarf	324	231	166	131	146	216
Medicham	[7]	M	100	Pure Power	Fake Out	Zen Headbutt	High Jump Kick	Substitute	Salac Berry	270	218	189	140	189	270
Manectric	[7]	M	100	Lightning Rod	Thunderbolt	Overheat	Discharge	Endure		Petaya Berry	281	139	157	309	156	339
Plusle		[7]	F	100	Plus		Thunderbolt	Light Screen	Helping Hand	Encore		Sitrus Berry	324	94	116	206	187	317
Minun		[7]	M	100	Minus		Discharge	Grass Knot	Helping Hand	Nasty Plot	Life Orb	261	76	136	249	207	317
Volbeat		[7]	M	100	Swarm		U-turn		Brick Break	Zen Headbutt	Trick		Choice Scarf	271	269	146	117	187	269
Illumise	[7]	F	100	Tinted Lens	Bug Buzz	Helping Hand	Flatter		Tailwind	Focus Sash	271	89	147	245	186	295
Swalot		[7]	M	100	Liquid Ooze	Sludge Bomb	Pain Split	Stockpile	Yawn		Black Sludge	342	135	265	182	291	146
Sharpedo	[7]	M	100	Rough Skin	Crunch		Waterfall	Aqua Jet	Taunt		Focus Sash	282	372	116	203	116	289
Wailord		[7]	M	100	Water Veil	Water Spout	Self-Destruct	Roar		Rain Dance	Custap Berry	506	237	176	194	176	158
Camerupt	[7]	M	100	Solid Rock	Flamethrower	Earthquake	Stealth Rock	Will-O-Wisp	Leftovers	343	248	185	246	253	104
Torkoal		[7]	M	100	White Smoke	Heat Wave	Rapid Spin	Yawn		Stealth Rock	Charcoal	344	185	347	269	177	76
Grumpig		[7]	M	100	Thick Fat	Psychic		Thunder Wave	Heal Bell	Reflect		Leftovers	364	85	186	216	330	196
Spinda		[7]	M	100	Own Tempo	Flail		Teeter Dance	Trick Room	Endure		Silk Scarf	322	240	141	156	157	125
Flygon		[7]	M	100	Levitate	Earthquake	Draco Meteor	U-turn		Thunder Punch	Expert Belt	301	299	196	176	197	328
Cacturne	[7]	M	100	Sand Veil	Seed Bomb	Sucker Punch	Swords Dance	Substitute	Bright Powder	344	361	156	239	157	146
Altaria		[7]	M	100	Natural Cure	Dragon Claw	Earthquake	Roost		Dragon Dance	Leftovers	354	205	216	158	291	212
Zangoose	[7]	M	100	Immunity	Flail		Quick Attack	Close Combat	Endure		Salac Berry	287	361	157	140	156	279
Seviper		[7]	M	100	Shed Skin	Poison Jab	Earthquake	Sucker Punch	Aqua Tail	Life Orb	298	328	156	212	156	219
Lunatone	[7]	-	100	Levitate	Psychic		Shadow Ball	Earth Power	Rock Polish	Life Orb	306	103	176	316	206	206
Solrock		[7]	-	100	Levitate	Rock Slide	Cosmic Power	Trick Room	Baton Pass	Sitrus Berry	344	227	280	146	180	130
Whiscash	[7]	M	100	Anticipation	Earthquake	Waterfall	Zen Headbutt	Dragon Dance	Muscle Band	362	280	182	169	178	219
Crawdaunt	[7]	M	100	Hyper Cutter	Crunch		Waterfall	X-Scissor	Dragon Dance	Focus Sash	268	372	206	194	146	209
Claydol		[7]	-	100	Levitate	Earth Power	Psychic		Skill Swap	Trick Room	Sitrus Berry	324	145	277	233	277	139
Cradily		[7]	F	100	Suction Cups	Rock Slide	Ingrain		Toxic		Recover		Leftovers	376	199	230	178	344	122
Armaldo		[7]	M	100	Battle Armor	Stone Edge	X-Scissor	Earthquake	Swords Dance	Custap Berry	354	383	237	158	196	126
Milotic		[17]	M	100	Marvel Scale	Hydro Pump	Blizzard	Haze		Recover		Sitrus Berry	393	112	216	304	288	198
Milotic		[7]	M	100	Marvel Scale	Surf		Blizzard	Rest		Sleep Talk	Leftovers	394	112	244	236	330	198
Castform	[7]	M	100	Forecast	Blizzard	Thunder		Weather Ball	Tailwind	Focus Sash	320	130	176	262	176	201
Kecleon		[8]	M	100	Color Change	Frustration	Copycat		Stealth Rock	Recover		Leftovers	324	240	212	160	303	104
Banette		[8]	M	100	Insomnia	Shadow Claw	Trick Room	Taunt		Grudge		Focus Sash	270	361	166	202	225	121
Dusclops	[8]	M	100	Pressure	Night Shade	Will-O-Wisp	Pain Split	Trick Room	Leftovers	284	145	394	140	297	55
Tropius		[8]	M	100	Solar Power	Air Slash	Solar Beam	Sunny Day	Tailwind	Life Orb	339	126	204	243	210	220
Chimecho	[8]	M	100	Levitate	Psychic		Light Screen	Skill Swap	Trick Room	Focus Chimecho	332	94	196	284	196	179
Absol		[8]	M	100	Super Luck	Night Slash	Sucker Punch	Psycho Cut	Endure		Lansat Berry	272	359	156	167	156	273
Glalie		[8]	M	100	Inner Focus	Ice Shard	Taunt		Spikes		Self-Destruct	Focus Sash	302	259	196	176	196	284
Walrein		[8]	M	100	Ice Body	Blizzard	Surf		Super Fang	Aqua Ring	Leftovers	419	148	306	226	222	166
Gorebyss	[8]	F	100	Swift Swim	Hydro Pump	Ice Beam	Signal Beam	Psychic		Expert Belt	252	155	246	359	186	203
Huntail		[8]	M	100	Swift Swim	Waterfall	Ice Fang	Sucker Punch	Endure		Liechi Berry	251	337	246	225	167	203
Relicanth	[8]	M	100	Rock Head	Head Smash	Aqua Tail	Earthquake	Rest		Chesto Berry	404	306	297	113	166	115
Luvdisc		[8]	F	100	Swift Swim	Surf		Attract		Toxic		Rain Dance	Focus Sash	290	58	146	116	251	231
Salamence	[8]	M	100	Intimidate	Draco Meteor	Heat Wave	Rain Dance	Protect		White Herb	331	248	196	319	196	328
Salamence	[8]	M	100	Intimidate	Outrage		Hydro Pump	Earthquake	Dragon Dance	Sitrus Berry	332	369	196	230	196	328
Metang		[8]	-	100	Clear Body	Meteor Mash	Reflect		Stealth Rock	Self-Destruct	Light Clay	324	186	248	131	272	136
Metagross	[8]	-	100	Clear Body	Zen Headbutt	Meteor Mash	Bullet Punch	Stealth Rock	Leftovers	364	405	296	203	216	177
Metagross	[8]	-	100	Clear Body	Meteor Mash	Thunder Punch	Earthquake	Agility		Occa Berry	340	369	296	203	216	221
Jirachi		[8]	-	100	Serene Grace	Doom Desire	Iron Head	Thunder		Charge Beam	Figy Berry	342	236	236	299	236	299
Regirock	[8]	-	100	Clear Body	Stone Edge	Hammer Arm	Sandstorm	Stealth Rock	Leftovers	364	299	436	122	264	136
Regice		[8]	-	100	Clear Body	Blizzard	Zap Cannon	Lock-On		Hail		Quick Claw	364	94	299	236	480	136
Registeel	[8]	-	100	Clear Body	Iron Head	Shadow Claw	Thunder Wave	Stealth Rock	Custap Berry	364	186	337	167	438	136
Kyogre		[8]	-	100	Drizzle		Brine		Aurora Beam	Ancient Power	Whirlpool	Wiki Berry	360	220	220	400	320	275
Groudon		[8]	-	100	Drought		Stomp		Eruption	Earth Power	Stealth Rock	Iapapa Berry	360	350	330	320	230	200
Rayquaza	[8]	-	100	Air Lock	Dragon Pulse	Fly		Secret Power	Flamethrower	Aguav Berry	360	360	220	360	220	285
Latios		[8]	M	100	Levitate	Draco Meteor	Luster Purge	Grass Knot	Recover		Lum Berry	302	166	196	359	256	350
Latias		[8]	F	100	Levitate	Dragon Pulse	Mist Ball	Charge Beam	Psycho Shift	Flame Orb	301	148	216	319	297	350
Deoxys (N)	[8]	-	100	Pressure	Psycho Boost	Extreme Speed	Stealth Rock	Spikes		Focus Sash	240	340	140	390	120	438
Deoxys (A)	[8]	-	100	Pressure	Psycho Boost	Extreme Speed	Shadow Ball	Superpower	Focus Sash	240	400	80	450	70	438
Deoxys (D)	[8]	-	100	Pressure	Psycho Boost	Ice Beam	Recover		Spikes		Leftovers	300	130	360	180	455	215
Deoxys (S)	[8]	-	100	Pressure	Psycho Boost	Extreme Speed	Superpower	Spikes		Colbur Berry	250	290	200	270	220	420
Torterra	[9]	M	100	Overgrow	Wood Hammer	Earthquake	Rock Slide	Rock Polish	Muscle Band	333	347	246	167	206	211
Infernape	[9]	M	100	Blaze		Close Combat	Overheat	U-turn		Assist		Focus Sash	293	295	178	260	160	343
Empoleon	[9]	M	100	Torrent		Hydro Pump	Surf		Icy Wind	Stealth Rock	Wacan Berry	310	159	212	353	238	219
Staraptor	[9]	F	100	Intimidate	Brave Bird	Frustration	Close Combat	U-turn		Muscle Band	311	339	177	122	136	328
Bibarel		[9]	M	100	Simple		Waterfall	Frustration	Quick Attack	Curse		Leftovers	362	226	170	131	206	178
Kricketune	[9]	M	100	Swarm		X-Scissor	Brick Break	Night Slash	Sing		Focus Sash	295	269	139	131	138	251
Luxray		[9]	M	100	Intimidate	Thunderbolt	Superpower	Crunch		Hyper Beam	Salac Berry	301	359	194	255	174	223
Roserade	[9]	M	100	Natural Cure	Leaf Storm	Sludge Bomb	Weather Ball	Aromatherapy	Focus Sash	262	130	146	349	246	306
Rampardos	[9]	M	100	Mold Breaker	Rock Slide	Earthquake	Fire Punch	Rock Polish	Focus Sash	336	429	156	149	136	236
Bastiodon	[9]	M	100	Sturdy		Metal Burst	Fire Blast	Stealth Rock	Roar		Leftovers	324	109	372	131	412	58
Pachirisu	[9]	M	100	Pickup		Super Fang	Thunder Wave	Light Screen	Follow Me	Sitrus Berry	324	85	176	127	306	226
Vespiquen	[9]	F	100	Pressure	Attack Order	Defend Order	Tailwind	Roost		Leftovers	343	196	242	176	333	116
Wormadam	[9]	F	100	Anticipation	Leaf Storm	Psychic		Signal Beam	Sunny Day	Focus Sash	275	138	206	282	246	158
Wormadam	[9]	F	100	Anticipation	Earthquake	Fissure		Rain Dance	Attract		Quick Claw	320	194	312	138	236	108
Wormadam	[9]	F	100	Anticipation	Gyro Ball	Stealth Rock	Toxic		Attract		Leftovers	320	175	237	174	310	69
Mothim		[9]	M	100	Swarm		Bug Buzz	Air Slash	Energy Ball	U-turn		Focus Sash	281	173	136	287	137	254
Floatzel	[9]	M	100	Swift Swim	Waterfall	Crunch		Brick Break	Bulk Up		Life Orb	319	300	156	185	137	352
Cherrim		[9]	M	100	Flower Gift	Solar Beam	Helping Hand	Sunny Day	Protect		Focus Sash	344	112	176	211	266	219
Gastrodon	[9]	F	100	Storm Drain	Earth Power	Muddy Water	Counter		Recover		Sitrus Berry	422	153	191	220	273	114
Gastrodon	[9]	M	100	Storm Drain	Earthquake	Waterfall	Curse		Recover		Leftovers	426	202	176	198	286	114
Ambipom		[9]	M	100	Technician	Fake Out	Double Hit	U-turn		Pursuit		Silk Scarf	291	299	168	140	169	361
Drifblim	[9]	M	100	Unburden	Shadow Ball	Calm Mind	Baton Pass	Destiny Bond	Sitrus Berry	441	148	132	306	144	252
Lopunny		[9]	F	100	Klutz		Fake Out	Dizzy Punch	Switcheroo	Encore		Flame Orb	334	188	204	129	229	339
Mismagius	[9]	M	100	Levitate	Shadow Ball	Thunderbolt	Nasty Plot	Substitute	Salac Berry	262	112	156	309	246	339
Honchkrow	[9]	M	100	Insomnia	Sky Attack	Night Slash	Heat Wave	Tailwind	Power Herb	341	349	140	247	126	265
Purugly		[9]	M	100	Own Tempo	Fake Out	Flail		U-turn		Endure		Silk Scarf	284	263	164	147	154	355
Skuntank	[9]	M	100	Aftermath	Sucker Punch	Poison Jab	Fire Blast	Pursuit		Black Glasses	377	313	170	160	159	237
Bronzong	[9]	-	100	Levitate	Psychic		Gyro Ball	Rain Dance	Trick Room	Leftovers	336	214	272	194	363	63
Chatot		[9]	M	100	Tangled Feet	Hyper Voice	Heat Wave	Nasty Plot	Encore		Salac Chatot	294	121	126	283	120	309
Spiritomb	[9]	M	100	Pressure	Dark Pulse	Psychic		Pursuit		Will-O-Wisp	Leftovers	303	173	253	303	253	113
Garchomp	[10]	M	100	Sand Veil	Outrage		Earthquake	Stone Edge	Dragon Claw	Leftovers	358	359	226	176	206	333
Garchomp	[10]	M	100	Sand Veil	Dragon Rush	Earthquake	Fire Fang	Swords Dance	Haban Berry	358	359	226	176	206	333
Lucario		[10]	M	100	Inner Focus	Close Combat	Bone Rush	Extreme Speed	Swords Dance	Shuca Berry	281	350	176	239	177	279
Lucario		[10]	M	100	Inner Focus	Aura Sphere	Dark Pulse	Copycat		Vacuum Wave	Expert Belt	281	256	158	361	177	279
Hippowdon	[10]	M	100	Sand Stream	Earthquake	Ice Fang	Roar		Slack Off	Leftovers	420	261	368	154	180	130
Drapion		[10]	M	100	Battle Armor	Crunch		Aqua Tail	Earthquake	Swords Dance	Sitrus Berry	282	279	256	140	186	317
Toxicroak	[10]	M	100	Dry Skin	Fake Out	Cross Chop	Sucker Punch	Taunt		Black Sludge	308	311	166	187	166	295
Carnivine	[10]	M	100	Levitate	Power Whip	Crunch		Wring Out	Swords Dance	Life Orb	338	328	193	194	182	97
Lumineon	[10]	M	100	Swift Swim	Surf		U-turn		Safeguard	Rain Dance	Wacan Berry	342	128	189	174	208	309
Abomasnow	[10]	M	100	Snow Warning	Wood Hammer	Ice Shard	Natural Gift	Protect		Occa Berry	372	306	187	198	220	158
Abomasnow	[10]	F	100	Snow Warning	Energy Ball	Ice Shard	Blizzard	Protect		Chople Berry	372	200	191	306	214	157
Weavile		[10]	F	100	Pressure	Fake Out	Ice Punch	Punishment	Low Kick	Charti Berry	282	339	166	113	206	383
Lickilicky	[10]	M	100	Own Tempo	Wring Out	Aqua Tail	Lick		Swords Dance	Leftovers	384	295	238	176	238	153
Rhyperior	[10]	M	100	Solid Rock	Stone Edge	Earthquake	Megahorn	Rock Polish	Muscle Band	371	379	297	131	146	196
Tangrowth	[10]	M	100	Chlorophyll	Power Whip	Knock Off	Earthquake	Synthesis	Leftovers	404	249	320	230	182	136
Electivire	[10]	M	100	Motor Drive	Thunderbolt	Ice Punch	Cross Chop	Flamethrower	Expert Belt	291	342	153	287	206	263
Magmortar	[10]	M	100	Flame Body	Overheat	Thunderbolt	Solar Beam	Heat Wave	Power Herb	354	175	170	383	227	202
Yanmega		[10]	M	100	Speed Boost	Air Slash	Bug Buzz	Feint		Detect		Focus Sash	313	141	234	364	148	264
Togekiss	[10]	M	100	Serene Grace	Air Slash	Heat Wave	Follow Me	Roost		Sitrus Berry	368	105	250	352	268	148
Togekiss	[10]	M	100	Serene Grace	Air Slash	Aura Sphere	Fire Blast	Tailwind	Wise Glasses	359	94	246	368	266	196
Leafeon		[10]	M	100	Leaf Guard	Leaf Blade	Quick Attack	Swords Dance	Grass Whistle	Lax Incense	309	281	297	140	166	317
Glaceon		[10]	M	100	Snow Cloak	Blizzard	Shadow Ball	Hail		Substitute	Bright Powder	310	112	256	394	226	191
Gliscor		[10]	M	100	Sand Veil	Earthquake	Ice Fang	Swords Dance	Roost		Leftovers	291	289	287	113	186	317
Mamoswine	[10]	M	100	Snow Cloak	Earthquake	Ice Shard	Superpower	Stealth Rock	Muscle Band	361	359	197	158	156	284
Porygon-Z	[10]	-	100	Adaptability	Tri Attack	Dark Pulse	Agility		Hyper Beam	Chople Berry	311	148	177	405	224	241
Gallade		[10]	M	100	Steadfast	Close Combat	Ice Punch	Will-O-Wisp	Destiny Bond	Lum Berry	302	324	167	149	266	284
Magnezone	[10]	-	100	Magnet Pull	Flash Cannon	Thunderbolt	Thunder Wave	Magnet Rise	Chople Berry	289	130	267	394	216	211
Probopass	[10]	M	100	Magnet Pull	Power Gem	Thunder Wave	Gravity		Stealth Rock	Leftovers	324	103	327	186	438	116
Dusknoir	[10]	M	100	Pressure	Shadow Sneak	Will-O-Wisp	Rain Dance	Trick Room	Lum Berry	292	236	330	166	382	85
Dusknoir	[10]	M	100	Pressure	Shadow Sneak	Earthquake	Ice Punch	Destiny Bond	Custap Berry	294	328	307	149	306	126
Froslass	[11]	F	100	Snow Cloak	Shadow Ball	Blizzard	Icy Wind	Destiny Bond	Focus Sash	281	148	176	259	177	350
Rotom		[11]	-	100	Levitate	Thunderbolt	Shadow Ball	Will-O-Wisp	Trick		Choice Scarf	241	94	191	289	190	309
Uxie		[11]	-	100	Levitate	Future Sight	Thunderbolt	Toxic		Stealth Rock	Leftovers	333	140	390	200	300	233
Mesprit		[11]	-	100	Levitate	Zen Headbutt	Fire Punch	Skill Swap	Healing Wish	Expert Belt	333	333	253	222	250	222
Azelf		[11]	-	100	Levitate	Psychic		Ice Punch	Taunt		Stealth Rock	Lum Berry	333	260	213	290	180	333
Heatran		[11]	M	100	Flash Fire	Flash Cannon	Flamethrower	Earth Power	Substitute	Passho Berry	325	166	248	358	248	278
Regigigas	[11]	-	100	Slow Start	Crush Grip	Earthquake	Thunder Wave	Sleep Talk	Salac Berry	373	460	256	176	256	288
Cresselia	[11]	F	100	Levitate	Icy Wind	Lunar Dance	Toxic		Helping Hand	Custap Berry	444	130	372	186	297	206
Darkrai		[11]	M	100	Bad Dreams	Feint Attack	Dream Eater	Nightmare	Dark Void	Big Root	333	250	220	280	220	344
Shaymin		[11]	-	100	Natural Cure	Seed Flare	Earth Power	Leech Seed	Synthesis	Leftovers	342	184	236	299	236	328
Phione		[11]	-	100	Hydration	Surf		U-turn		Rain Dance	Rest		Bright Powder	364	177	196	196	196	284
Manaphy		[11]	-	100	Hydration	Surf		Grass Knot	Tail Glow	Heart Swap	Leftovers	361	184	236	299	236	308
Dialga		[11]	-	100	Pressure	Roar of Time	Metal Claw	Aura Sphere	Trick Room	Rowap Berry	400	280	310	310	280	220
Palkia		[11]	-	100	Pressure	Spacial Rend	Aqua Tail	Brick Break	Gravity		Jaboca Berry	350	280	240	310	300	320
Giratina	[11]	-	100	Pressure	Shadow Force	Twister		Rock Smash	Heal Block	Leftovers	500	253	303	253	303	199
Giratina	[11]	-	100	Pressure	Ominous Wind	Twister		Steel Wing	Growth		Enigma Berry	500	215	280	320	280	215
Arceus		[11]	-	100	Multitype	Judgment	Future Sight	Punishment	Extreme Speed	Lum Berry	410	280	320	280	320	278
Arceus		[11]	-	100	Multitype	Judgment	Flamethrower	Shock Wave	Sleep Talk	Iron Plate	410	250	300	300	300	300
Bulbasaur	[11]	M	5	Overgrow	Leaf Storm	Sludge Bomb	Giga Drain	Sleep Powder	Choice Scarf	21	9	11	17	13	14
Charmander	[11]	M	5	Blaze		Flare Blitz	Thunder Punch	Brick Break	Dragon Dance	Life Orb	21	15	11	10	12	16
Squirtle	[11]	M	5	Torrent		Fake Out	Aqua Jet	Waterfall	Return		Life Orb	19	15	13	9	13	14
Chikorita	[11]	M	5	Overgrow	Reflect		Light Screen	Leaf Storm	Worry Seed	Light Clay	24	9	15	11	15	11
Cyndaquil	[11]	M	5	Blaze		Eruption	Extrasensory	Double Kick	Fire Blast	Choice Scarf	21	12	10	16	9	16
Totodile	[11]	M	5	Torrent		Flail		Aqua Jet	Swords Dance	Substitute	Salac Berry	21	17	13	9	11	14
Treecko		[11]	M	5	Overgrow	Leaf Storm	Rock Slide	Grass Whistle	Quick Attack	Focus Sash	21	11	9	16	12	17
Torchic		[11]	M	5	Blaze		Fire Blast	Mud-Slap	Rock Slide	Quick Attack	Life Orb	21	13	9	16	12	15
Mudkip		[11]	M	5	Torrent		Waterfall	Rock Slide	Double-Edge	Superpower	Choice Scarf	23	16	11	9	11	14
Turtwig		[11]	M	5	Overgrow	Seed Bomb	Crunch		Stealth Rock	Protect		Oran Berry	25	14	15	9	13	10
Chimchar	[11]	M	5	Blaze		Fake Out	Overheat	Thunder Punch	Brick Break	Focus Sash	21	13	9	15	11	16
Piplup		[11]	M	5	Torrent		Hydro Pump	Icy Wind	Stealth Rock	Aqua Ring	Oran Berry	23	9	12	15	12	14
Sandshrew	[12]	M	5	Sand Veil	Earthquake	Rock Slide	Rapid Spin	Stealth Rock	Oran Berry	24	14	17	7	12	11
Zubat		[12]	M	5	Inner Focus	Pluck		U-turn		Taunt		Tailwind	Life Orb	19	13	11	8	11	15
Venonat		[12]	F	5	Compound Eyes	Bug Bite	Sleep Powder	Agility		Baton Pass	Focus Sash	25	13	11	9	12	15
Diglett		[12]	M	5	Arena Trap	Earthquake	Reversal	Sucker Punch	Stealth Rock	Focus Sash	18	15	9	9	11	20
Meowth		[12]	M	5	Technician	Fake Out	Return		Bite		Seed Bomb	Focus Sash	20	14	11	9	10	19
Mankey		[12]	M	5	Anger Point	Close Combat	Punishment	Ice Punch	U-turn		Choice Scarf	21	17	11	9	11	17
Growlithe	[12]	M	5	Intimidate	Flare Blitz	Overheat	Will-O-Wisp	Reversal	Choice Scarf	22	15	11	15	9	16
Abra		[12]	M	5	Inner Focus	Psychic		Signal Beam	Encore		Substitute	Focus Sash	19	7	8	20	12	19
Machop		[12]	M	5	No Guard	Dynamic Punch	Rock Slide	Ice Punch	Protect		Oran Berry	23	17	12	9	10	14
Tentacool	[12]	M	5	Clear Body	Sludge Bomb	Surf		Rapid Spin	Toxic Spikes	Berry Juice	23	9	12	12	16	16
Ponyta		[12]	M	5	Flash Fire	Flare Blitz	Return		Will-O-Wisp	Substitute	Oran Berry	23	17	12	11	13	19
Magnemite	[12]	-	5	Magnet Pull	Discharge	Flash Cannon	Magnet Rise	Substitute	Oran Berry	20	7	14	20	12	13
Doduo		[12]	M	5	Early Bird	Brave Bird	Return		Quick Attack	Roost		Life Orb	19	17	12	9	11	17
Gastly		[12]	M	5	Levitate	Shadow Ball	Sludge Bomb	Will-O-Wisp	Substitute	Focus Sash	19	9	9	20	10	17
Onix		[12]	M	5	Sturdy		Rock Slide	Earthquake	Roar		Stealth Rock	Oran Berry	21	14	22	8	11	17
Drowzee		[12]	M	5	Insomnia	Zen Headbutt	Ice Punch	Focus Punch	Substitute	Berry Juice	22	14	12	9	18	12
Krabby		[12]	M	5	Shell Armor	Crabhammer	X-Scissor	Rock Slide	Agility		Wide Lens	20	22	16	8	9	14
Voltorb		[12]	-	5	Static		Thunder		Sucker Punch	Rain Dance	Taunt		Focus Sash	21	10	9	15	12	20
Cubone		[12]	M	5	Lightning Rod	Earthquake	Ice Beam	Fire Punch	Substitute	Thick Club	24	15	17	10	12	7
Lickitung	[12]	M	5	Own Tempo	Wring Out	Power Whip	Fire Blast	Ice Beam	Oran Berry	26	16	14	15	14	9
Koffing		[12]	M	5	Levitate	Sludge Bomb	Fire Blast	Shadow Ball	Will-O-Wisp	Oran Berry	21	9	16	16	13	11
Staryu		[12]	-	5	Natural Cure	Surf		Ice Beam	Thunderbolt	Rapid Spin	Expert Belt	20	9	12	16	12	19
Magikarp	[12]	M	5	Swift Swim	Bounce		Flail		Hydro Pump	Splash		Power Herb	19	8	12	11	7	18
Eevee		[12]	M	5	Adaptability	Return		Quick Attack	Bite		Baton Pass	Silk Scarf	22	16	12	9	13	15
Porygon		[12]	-	5	Trace		Tri Attack	Shadow Ball	Trick		Recover		Choice Scarf	26	10	14	19	14	10
Omanyte		[12]	M	5	Shell Armor	Surf		Ancient Power	Stealth Rock	Spikes		Oran Berry	23	9	17	15	16	10
Kabuto		[12]	M	5	Swift Swim	Waterfall	Rock Slide	Earth Power	Aqua Jet	Life Orb	19	18	15	14	9	14
Dratini		[12]	F	5	Shed Skin	Extreme Speed	Outrage		Waterfall	Dragon Dance	Oran Berry	21	17	11	9	12	14
Sentret		[12]	M	5	Keen Eye	Return		Sucker Punch	Ice Beam	Thunderbolt	Life Orb	19	14	10	14	11	6
Chinchou	[12]	F	5	Volt Absorb	Surf		Thunderbolt	Ice Beam	Agility		Oran Berry	24	9	11	16	12	16
Pichu		[13]	M	5	Static		Volt Tackle	Toxic		Return		Iron Tail	Choice Band	20	13	8	9	10	16
Togepi		[13]	M	5	Serene Grace	Body Slam	Headbutt	Fire Blast	Metronome	Custap Berry	23	12	14	10	13	6
Natu		[13]	M	5	Synchronize	Heat Wave	Giga Drain	Light Screen	Reflect		Light Clay	22	9	12	13	12	17
Mareep		[13]	F	5	Static		Discharge	Light Screen	Reflect		Thunder Wave	Light Clay	22	9	14	13	12	13
Hoppip		[13]	F	5	Chlorophyll	Sunny Day	Sleep Powder	Memento		Encore		Focus Sash	23	7	11	10	12	15
Aipom		[13]	M	5	Run Away	Fake Out	Return		Shadow Claw	U-turn		Life Orb	23	16	12	9	12	19
Yanma		[13]	M	5	Compound Eyes	Bug Buzz	Air Slash	Giga Drain	Detect		Focus Sash	23	11	11	17	11	20
Wooper		[13]	M	5	Water Absorb	Earthquake	Ice Punch	Toxic		Recover		Berry Juice	23	12	14	8	11	8
Murkrow		[13]	M	5	Insomnia	Pluck		Dark Pulse	Haze		Roost		King’s Rock	23	15	13	13	14	16
Misdreavus	[13]	M	5	Levitate	Shadow Ball	Thunderbolt	Will-O-Wisp	Trick		Choice Specs	22	10	12	18	15	19
Pineco		[13]	M	5	Sturdy		Bug Bite	Payback		Rapid Spin	Toxic Spikes	Oran Berry	24	14	19	9	10	8
Snubbull	[13]	M	5	Intimidate	Return		Earthquake	Crunch		Ice Punch	Oran Berry	23	18	13	10	12	7
Swinub		[13]	M	5	Snow Cloak	Earthquake	Ice Shard	Stealth Rock	Protect		Lax Incense	23	14	10	8	9	15
Houndour	[13]	M	5	Flash Fire	Will-O-Wisp	Crunch		Fire Blast	Sucker Punch	Oran Berry	21	15	10	15	9	17
Phanpy		[13]	F	5	Pickup		Earthquake	Ice Shard	Head Smash	Stealth Rock	Oran Berry	27	15	15	9	11	11
Elekid		[13]	M	5	Static		Thunderbolt	Fire Punch	Low Kick	Ice Punch	Expert Belt	21	14	9	15	12	20
Magby		[13]	M	5	Flame Body	Fire Blast	Cross Chop	Thunder Punch	Psychic		Life Orb	19	14	9	16	12	19
Lotad		[13]	M	5	Swift Swim	Surf		Energy Ball	Ice Beam	Rain Dance	Berry Juice	21	8	10	14	12	12
Taillow		[13]	M	5	Guts		Pluck		Facade		Protect		Quick Attack	Flame Orb	21	15	9	8	9	19
Shroomish	[13]	M	5	Poison Heal	Giga Drain	Spore		Leech Seed	Protect		Toxic Orb	23	9	16	10	14	12
Azurill		[13]	M	5	Huge Power	Return		Waterfall	Substitute	Protect		Oran Berry	23	12	11	8	12	7
Nosepass	[13]	M	5	Magnet Pull	Rock Slide	Stealth Rock	Thunder Wave	Magnet Rise	Oran Berry	22	11	25	9	15	10
Aron		[13]	M	5	Rock Head	Head Smash	Iron Head	Rock Polish	Magnet Rise	Oran Berry	22	17	17	9	11	12
Meditite	[13]	M	5	Pure Power	High Jump Kick	Zen Headbutt	Bullet Punch	Fake Out	Oran Berry	20	13	12	9	13	16
Carvanha	[13]	M	5	Rough Skin	Crunch		Aqua Jet	Zen Headbutt	Substitute	Life Orb	19	19	9	11	9	16
Wailmer		[13]	F	5	Water Veil	Surf		Icy Wind	Attract		Protect		Leftovers	32	10	13	13	12	12
Numel		[13]	M	5	Simple		Overheat	Heat Wave	Earth Power	Stockpile	White Herb	22	10	10	16	11	14
Spoink		[13]	M	5	Thick Fat	Psychic		Trick Room	Light Screen	Reflect		Berry Juice	23	8	12	13	16	16
Cacnea		[13]	M	5	Sand Veil	Needle Arm	Sucker Punch	Focus Punch	Substitute	Bright Powder	23	19	12	13	11	10
Baltoy		[13]	-	5	Levitate	Earthquake	Zen Headbutt	Stealth Rock	Trick Room	Oran Berry	23	13	14	10	14	9
Lileep		[14]	M	5	Suction Cups	Seed Bomb	Swords Dance	Stockpile	Recover		Oran Berry	26	10	18	10	16	8
Anorith		[14]	M	5	Battle Armor	Rock Slide	X-Scissor	Brick Break	Body Slam	Choice Band	21	19	12	9	11	18
Duskull		[14]	M	5	Levitate	Shadow Sneak	Thief		Frustration	Will-O-Wisp	Oran Berry	21	11	17	8	18	9
Wynaut		[14]	M	5	Shadow Tag	Mirror Coat	Counter		Encore		Destiny Bond	Leftovers	27	6	13	8	15	9
Snorunt		[14]	M	5	Ice Body	Ice Beam	Ice Shard	Crunch		Spikes		Focus Sash	21	12	12	14	10	15
Spheal		[14]	M	5	Ice Body	Blizzard	Super Fang	Aqua Ring	Protect		Leftovers	24	9	15	13	14	9
Bagon		[14]	M	5	Rock Head	Outrage		Brick Break	Fire Fang	Dragon Dance	Oran Berry	21	18	13	9	10	14
Beldum		[14]	-	5	Clear Body	Zen Headbutt	Iron Head	Headbutt	Iron Defense	Oran Berry	20	16	17	9	12	10
Bidoof		[14]	M	5	Simple		Return		Quick Attack	Aqua Tail	Curse		Oran Berry	24	14	11	9	12	10
Cranidos	[14]	M	5	Mold Breaker	Head Smash	Rock Slide	Zen Headbutt	Protect		Oran Berry	24	24	10	8	9	15
Shieldon	[14]	M	5	Sturdy		Ice Beam	Thunderbolt	Stealth Rock	Metal Burst	Oran Berry	22	11	19	11	19	8
Buizel		[14]	M	5	Swift Swim	Waterfall	Aqua Jet	Return		Bulk Up		Life Orb	22	16	10	10	10	19
Drifloon	[14]	M	5	Unburden	Shadow Ball	Thunderbolt	Icy Wind	Substitute	Oran Berry	28	9	10	16	11	14
Glameow		[14]	F	5	Limber		Fake Out	Sucker Punch	U-turn		Attract		Focus Sash	21	15	11	9	10	19
Chingling	[14]	M	5	Levitate	Psychic		Thunder Wave	Heal Bell	Hypnosis	Berry Juice	24	8	12	13	11	15
Stunky		[14]	M	5	Aftermath	Crunch		Pursuit		Fire Blast	Sucker Punch	Lum Berry	23	16	11	9	10	18
Bronzor		[14]	-	5	Levitate	Psychic		Earthquake	Trick Room	Light Screen	Oran Berry	25	9	18	9	16	8
Munchlax	[14]	M	5	Thick Fat	Return		Pursuit		Ice Punch	Protect		Leftovers	32	19	11	10	16	6
Riolu		[14]	M	5	Inner Focus	High Jump Kick	Ice Punch	Crunch		Protect		Focus Sash	21	17	11	9	11	15
Hippopotas	[14]	M	5	Sand Stream	Earthquake	Crunch		Stealth Rock	Roar		Passho Berry	26	14	18	9	11	9
Skorupi		[14]	M	5	Sniper		Cross Poison	Night Slash	Aqua Tail	Agility		Scope Lens	21	15	16	8	15	13
Croagunk	[14]	M	5	Dry Skin	Fake Out	Vacuum Wave	Sucker Punch	Ice Punch	Focus Sash	21	16	9	15	10	13
Mantyke		[14]	M	5	Water Absorb	Hydro Pump	Ice Beam	Rain Dance	Tailwind	Oran Berry	22	7	12	16	18	14
Snover		[14]	M	5	Snow Warning	Energy Ball	Blizzard	Ice Shard	Protect		Chople Berry	24	15	11	16	10	10
Tangela		[14]	M	5	Chlorophyll	Leaf Storm	Endeavor	Sleep Powder	Sunny Day	Focus Sash	23	9	18	19	10	16
Scyther		[14]	M	5	Technician	Bug Bite	Wing Attack	Reversal	Endure		Liechi Berry	23	20	14	10	14	22
Gligar		[14]	M	5	Sand Veil	Aerial Ace	Earthquake	Aqua Tail	U-turn		Oran Berry	23	18	17	9	13	18
Sneasel		[14]	M	5	Inner Focus	Ice Shard	Pursuit		Low Kick	Punishment	Focus Sash	22	19	12	9	15	22
Trapinch	[14]	M	5	Arena Trap	Earthquake	Quick Attack	Crunch		Bug Bite	Focus Sash	22	20	13	11	12	5
Clamperl	[14]	M	5	Shell Armor	Surf		Ice Beam	Muddy Water	Protect		Deep Sea Tooth	23	11	15	18	12	7
Venusaur	[15]	M	100	Overgrow	Leaf Storm	Sludge Bomb	Leech Seed	Toxic		Black Sludge	364	152	202	310	254	196
Venusaur	[15]	M	100	Overgrow	Power Whip	Sludge Bomb	Sleep Powder	Synthesis	Wide Lens	301	234	181	266	236	284
Charizard	[15]	M	100	Blaze		Fire Blast	Air Slash	Focus Blast	Tailwind	Focus Sash	297	155	192	317	207	328
Charizard	[15]	M	100	Blaze		Flare Blitz	Thunder Punch	Earthquake	Dragon Dance	Focus Sash	298	293	192	228	206	299
Blastoise	[15]	M	100	Torrent		Hydro Cannon	Skull Bash	Counter		Mirror Coat	Power Herb	362	203	236	228	315	172
Pidgeot		[15]	M	100	Tangled Feet	Hyper Beam	Air Slash	Heat Wave	Tailwind	Focus Sash	307	148	186	239	177	309
Pikachu		[15]	M	100	Static		Fake Out	Volt Tackle	Iron Tail	Fling		Light Ball	211	209	96	122	117	306
Raichu		[15]	M	100	Static		Thunderbolt	Grass Knot	Hyper Beam	Magnet Rise	Life Orb	261	166	146	279	197	328
Clefable	[15]	F	100	Magic Guard	Seismic Toss	Hyper Beam	Follow Me	Calm Mind	Leftovers	375	130	236	236	236	156
Ninetales	[15]	F	100	Flash Fire	Overheat	Solar Beam	Sunny Day	Will-O-Wisp	Charcoal	300	141	236	199	236	328
Arcanine	[15]	M	100	Intimidate	Overheat	Extreme Speed	Will-O-Wisp	Roar		Sitrus Berry	361	231	196	284	259	226
Arcanine	[15]	M	100	Intimidate	Flare Blitz	Extreme Speed	Overheat	Will-O-Wisp	Flame Plate	369	350	196	212	196	242
Alakazam	[15]	M	100	Inner Focus	Psychic		Energy Ball	Focus Blast	Substitute	Wise Glasses	252	94	126	369	206	372
Alakazam	[15]	M	100	Inner Focus	Psychic		Focus Blast	Shadow Ball	Calm Mind	Expert Belt	251	94	126	369	207	372
Victreebel	[15]	M	100	Chlorophyll	Leaf Blade	Sucker Punch	Swords Dance	Morning Sun	Life Orb	301	339	166	212	194	202
Tentacruel	[15]	F	100	Clear Body	Sludge Bomb	Knock Off	Rain Dance	Protect		Black Sludge	364	158	166	196	369	240
Rapidash	[15]	M	100	Flash Fire	Flare Blitz	Megahorn	Bounce		Overheat	Expert Belt	271	299	158	197	196	339
Cloyster	[15]	M	100	Skill Link	Ice Shard	Rock Blast	Toxic Spikes	Explosion	Custap Berry	303	317	396	185	128	176
Gengar		[15]	M	100	Levitate	Shadow Ball	Icy Wind	Focus Blast	Curse		Expert Belt	261	121	157	359	186	350
Gengar		[15]	M	100	Levitate	Shadow Ball	Thunderbolt	Psychic		Disable		Focus Sash	261	121	156	359	187	350
Hypno		[15]	M	100	Insomnia	Seismic Toss	Wish		Thunder Wave	Baton Pass	Petaya Berry	374	135	226	182	308	170
Exeggutor	[15]	M	100	Chlorophyll	Psychic		Solar Beam	Sunny Day	Substitute	Petaya Berry	350	175	206	366	179	194
Kangaskhan	[15]	F	100	Scrappy		Fake Out	Last Resort	(None)		(None)		Silk Scarf	384	317	215	104	207	217
Tauros		[15]	M	100	Intimidate	Giga Impact	Earthquake	Pursuit		Endure		Liechi Berry	291	299	227	104	176	350
Gyarados	[15]	M	100	Intimidate	Waterfall	Earthquake	Ice Fang	Thunder Wave	Wacan Berry	331	383	195	140	249	248
Gyarados	[15]	M	100	Intimidate	Aqua Tail	Iron Head	Giga Impact	Thunder Wave	Leftovers	394	369	194	140	250	198
Lapras		[15]	M	100	Water Absorb	Blizzard	Hydro Pump	Ice Shard	Thunderbolt	Sitrus Berry	463	208	196	295	226	140
Aerodactyl	[15]	M	100	Rock Head	Rock Slide	Earthquake	Thunder Fang	Protect		Life Orb	301	309	166	140	187	394
Snorlax		[15]	M	100	Thick Fat	Double-Edge	Crunch		Earthquake	Self-Destruct	Custap Berry	461	350	167	149	319	96
Snorlax		[15]	M	100	Thick Fat	Frustration	Earthquake	Crunch		Curse		Leftovers	524	264	166	149	343	96
Dragonite	[16]	M	100	Inner Focus	Aerial Ace	Outrage		Fire Punch	Dragon Dance	Lum Berry	323	403	227	212	236	259
Dragonite	[16]	M	100	Inner Focus	Outrage		Ice Punch	Extreme Speed	Dragon Dance	Yache Berry	336	403	226	237	212	246
Mew		[16]	-	100	Synchronize	Confusion	Icy Wind	Transform	Barrier		Leftovers	404	184	236	236	236	328
Feraligatr	[16]	M	100	Torrent		Aqua Tail	Brick Break	Crunch		Dragon Dance	Focus Sash	311	339	236	174	203	255
Crobat		[16]	M	100	Inner Focus	Brave Bird	Cross Poison	U-turn		Roost		Black Sludge	373	236	225	158	196	343
Lanturn		[16]	F	100	Volt Absorb	Discharge	Hydro Pump	Icy Wind	Thunder Wave	Life Orb	391	108	177	270	232	170
Ampharos	[16]	F	100	Static		Discharge	Power Gem	Focus Blast	Protect		Sitrus Berry	356	155	216	360	216	103
Azumarill	[16]	M	100	Huge Power	Aqua Tail	Brick Break	Ice Punch	Aqua Jet	Life Orb	398	218	196	122	197	142
Jumpluff	[16]	F	100	Chlorophyll	Leaf Storm	Tailwind	Encore		Sleep Powder	Focus Sash	292	103	176	209	206	350
Espeon		[16]	M	100	Synchronize	Psychic		Shadow Ball	Magic Coat	Calm Mind	Wise Glasses	271	121	156	359	227	350
Wobbuffet	[16]	F	100	Shadow Tag	Mirror Coat	Counter		Encore		Charm		Leftovers	584	63	176	102	211	102
Forretress	[16]	F	100	Sturdy		Bug Bite	Toxic Spikes	Light Screen	Self-Destruct	Custap Berry	338	306	316	156	173	76
Steelix		[16]	M	100	Sturdy		Earthquake	Toxic		Stealth Rock	Roar		Bright Powder	354	207	436	146	251	58
Scizor		[16]	F	100	Technician	Bug Bite	Bullet Punch	Aerial Ace	Swords Dance	Expert Belt	343	394	236	131	198	166
Heracross	[16]	M	100	Guts		Megahorn	Brick Break	Rock Slide	Protect		Flame Orb	301	349	186	104	227	295
Skarmory	[16]	M	100	Keen Eye	Brave Bird	Toxic Spikes	Sandstorm	Roost		Leftovers	334	254	347	104	176	182
Skarmory	[16]	F	100	Keen Eye	Sky Attack	U-turn		Assurance	Whirlwind	Power Herb	334	284	316	116	177	130
Houndoom	[16]	M	100	Flash Fire	Dark Pulse	Fire Blast	Nasty Plot	Endure		Salac Berry	291	166	136	319	197	317
Kingdra		[16]	M	100	Swift Swim	Surf		Draco Meteor	Blizzard	Rain Dance	White Herb	341	175	237	317	226	209
Blaziken	[16]	M	100	Blaze		Brick Break	Flare Blitz	Overheat	Agility		Charcoal	301	372	217	257	158	218
Beautifly	[16]	F	100	Swarm		Bug Buzz	Shadow Ball	Tailwind	Stun Spore	Focus Sash	261	130	137	279	136	251
Ludicolo	[16]	M	100	Swift Swim	Fake Out	Giga Drain	Surf		Protect		Wise Glasses	301	130	189	306	237	226
Swellow		[16]	F	100	Guts		Facade		Brave Bird	U-turn		Protect		Flame Orb	262	269	156	122	136	383
Gardevoir	[16]	F	100	Synchronize	Psychic		Thunderbolt	Will-O-Wisp	Calm Mind	Sitrus Berry	315	121	213	342	267	212
Breloom		[16]	F	100	Poison Heal	Seed Bomb	Mach Punch	Superpower	Spore		Toxic Orb	324	345	196	140	156	222
Aggron		[16]	M	100	Rock Head	Head Smash	Earthquake	Aqua Tail	Ice Punch	Shell Bell	343	350	396	140	158	105
Manectric	[16]	F	100	Lightning Rod	Discharge	Signal Beam	Overheat	Thunder		White Herb	282	139	156	309	156	339
Wailord		[16]	M	100	Water Veil	Rain Dance	Endure		Toxic		Self-Destruct	Custap Berry	501	270	176	194	152	157
Flygon		[16]	M	100	Levitate	Earthquake	Solar Beam	U-turn		Tailwind	Power Herb	351	249	196	197	176	328
Altaria		[16]	F	100	Natural Cure	Draco Meteor	Feather Dance	Tailwind	Toxic		White Herb	354	130	240	177	313	196
Cradily		[17]	F	100	Suction Cups	Giga Drain	Pain Split	Stockpile	Ingrain		Big Root	328	150	292	222	303	91
Claydol		[17]	-	100	Levitate	Psychic		Trick Room	Light Screen	Self-Destruct	Light Clay	324	183	303	176	303	139
Armaldo		[17]	M	100	Battle Armor	X-Scissor	Rock Slide	Earthquake	Swords Dance	Custap Berry	341	383	249	158	197	95
Milotic		[7]	F	100	Marvel Scale	Surf		Ice Beam	Toxic		Recover		Flame Orb	393	112	268	236	300	199
Milotic		[17]	F	100	Marvel Scale	Ice Beam	Hydro Pump	Mirror Coat	Recover		Flame Orb	331	112	194	299	315	261
Milotic		[17]	F	100	Marvel Scale	Surf		Blizzard	Rest		Sleep Talk	Leftovers	394	112	232	259	312	198
Whiscash	[17]	M	100	Anticipation	Earthquake	Waterfall	Bounce		Dragon Dance	Life Orb	361	255	182	169	179	240
Relicanth	[17]	F	100	Swift Swim	Head Smash	Bounce		Yawn		Psych Up	Hard Stone	366	306	296	113	169	182
Metagross	[17]	-	100	Clear Body	Meteor Mash	Zen Headbutt	Sandstorm	Substitute	Salac Berry	302	405	296	203	216	239
Empoleon	[17]	M	100	Torrent		Hydro Pump	Flash Cannon	Ice Beam	Stealth Rock	Leftovers	372	160	233	321	238	156
Staraptor	[17]	M	100	Intimidate	Brave Bird	Close Combat	U-turn		Tailwind	Focus Sash	311	339	176	122	136	328
Gastrodon	[17]	F	100	Storm Drain	Muddy Water	Icy Wind	Toxic		Counter		Leftovers	426	153	172	283	221	114
Roserade	[17]	M	100	Natural Cure	Sludge Bomb	Leaf Storm	Shadow Ball	Toxic Spikes	White Herb	261	130	146	349	247	306
Roserade	[17]	F	100	Poison Point	Leaf Storm	Sludge Bomb	Extrasensory	Toxic Spikes	Focus Sash	261	130	146	349	247	306
Roserade	[17]	M	100	Poison Point	Energy Ball	Sludge Bomb	Shadow Ball	Leaf Storm	Focus Sash	261	130	146	349	247	306
Honchkrow	[17]	M	100	Insomnia	Brave Bird	Sucker Punch	Heat Wave	Haze		Life Orb	354	314	165	247	148	241
Bronzong	[17]	-	100	Heatproof	Zen Headbutt	Gyro Ball	Trick Room	Skill Swap	Iron Ball	338	240	268	194	336	63
Spiritomb	[17]	F	100	Pressure	Dark Pulse	Psychic		Sucker Punch	Will-O-Wisp	Sitrus Berry	303	222	252	311	252	95
Garchomp	[17]	F	100	Sand Veil	Dragon Claw	Earthquake	Fire Blast	Swords Dance	Yache Berry	357	394	227	176	206	303
Lucario		[17]	M	100	Inner Focus	Aura Sphere	Dragon Pulse	Vacuum Wave	Protect		Wise Glasses	281	202	176	329	177	306
Hippowdon	[17]	F	100	Sand Stream	Earthquake	Fire Fang	Roar		Protect		Sitrus Berry	420	260	291	154	247	130
Drapion		[17]	M	100	Battle Armor	Night Slash	Cross Poison	Swords Dance	Whirlwind	Razor Claw	344	265	257	140	224	226
Weavile		[17]	M	100	Pressure	Fake Out	Pursuit		Ice Punch	Low Kick	Occa Berry	291	339	166	113	206	374
Weavile		[17]	M	100	Pressure	Fake Out	Ice Shard	Ice Punch	Pursuit		Focus Sash	291	339	166	113	206	374
Abomasnow	[17]	F	100	Snow Warning	Blizzard	Energy Ball	Ice Shard	Protect		Focus Sash	383	198	186	311	206	158
Magnezone	[17]	-	100	Magnet Pull	Discharge	Flash Cannon	Light Screen	Reflect		Light Clay	344	130	266	382	216	168
Magnezone	[17]	-	100	Magnet Pull	Discharge	Flash Cannon	Mirror Coat	Magnet Rise	Magnet		333	145	266	394	228	112
Rhyperior	[17]	M	100	Solid Rock	Earthquake	Stone Edge	Megahorn	Crunch		Custap Berry	404	410	296	131	183	116
Rhyperior	[17]	F	100	Solid Rock	Avalanche	Fire Punch	Earthquake	Rock Slide	Leftovers	434	400	296	131	162	116
Gallade		[17]	M	100	Steadfast	Drain Punch	Ice Punch	Earthquake	Bulk Up		Black Belt	304	286	191	149	335	232
Regirock	[18]	-	100	Clear Body	Rock Slide	Counter		Stealth Rock	Explosion	Custap Berry	364	261	436	122	301	137
Regice		[18]	-	100	Clear Body	Blizzard	Thunderbolt	Focus Blast	Protect		Life Orb	363	94	236	328	438	136
Registeel	[18]	-	100	Clear Body	Iron Head	Brick Break	Curse		Thunder Wave	Leftovers	350	273	336	167	351	136
Regigigas	[18]	-	100	Slow Start	Crush Grip	Drain Punch	Avalanche	Thunder Wave	Leftovers	366	458	256	176	256	297
Cresselia	[18]	F	100	Levitate	Psychic		Toxic		Reflect		Skill Swap	Sitrus Berry	444	130	372	186	297	206
Heatran		[18]	M	100	Flash Fire	Flash Cannon	Lava Plume	Dragon Pulse	Roar		Shuca Berry	386	166	248	296	308	222
Metagross	[18]	-	100	Clear Body	Meteor Mash	Bullet Punch	Explosion	Stealth Rock	Custap Berry	301	405	296	203	217	239
Staraptor	[18]	M	100	Intimidate	Brave Bird	U-turn		Close Combat	Sleep Talk	Choice Band	311	339	177	122	136	328
Starmie		[18]	-	100	Natural Cure	Hydro Pump	Thunderbolt	Ice Beam	Rapid Spin	Life Orb	261	139	206	299	207	361
Dragonite	[18]	F	100	Inner Focus	Outrage		Extreme Speed	Earthquake	Dragon Dance	Lum Berry	323	403	227	212	236	259
Magnezone	[18]	-	100	Magnet Pull	Thunderbolt	Hidden PowerFIR	Thunder Wave	Explosion	Choice Scarf	281	158	266	358	216	239
Tyranitar	[18]	F	100	Sand Stream	Crunch		Fire Blast	Pursuit		Stone Edge	Sitrus Berry	353	374	230	239	282	178
Swampert	[18]	M	100	Torrent		Waterfall	Earthquake	Ice Punch	Stealth Rock	Life Orb	404	350	216	185	217	156
Snorlax		[18]	M	100	Thick Fat	Body Slam	Pursuit		Superpower	Earthquake	Choice Band	524	350	166	149	257	96
Slowbro		[18]	F	100	Own Tempo	Slack Off	Surf		Thunder Wave	Hidden PowerELE	Wacan Berry	394	142	350	236	196	96
Jirachi		[18]	-	100	Serene Grace	Iron Head	Wish		Thunder Wave	Substitute	Leftovers	404	236	328	212	237	236
Machamp		[18]	M	100	No Guard	Dynamic Punch	Stone Edge	Ice Punch	Payback		Custap Berry	383	394	196	149	208	146
Latias		[18]	F	100	Levitate	Dragon Pulse	Hidden PowerFIR	Thunder Wave	Recover		Expert Belt	364	150	306	256	296	255
Bronzong	[18]	-	100	Levitate	Gyro Ball	Stealth Rock	Hypnosis	Explosion	Sitrus Berry	338	214	300	194	330	63
Lucario		[18]	M	100	Inner Focus	Bullet Punch	Close Combat	Extreme Speed	Swords Dance	Life Orb	281	319	176	239	177	306
Dragonite	[18]	F	100	Inner Focus	Outrage		Extreme Speed	Earthquake	Fire Punch	Choice Band	323	403	226	212	237	259
Latias		[18]	F	100	Levitate	Draco Meteor	Dragon Pulse	Surf		Trick		Choice Scarf	301	148	216	350	297	319
Gengar		[18]	M	100	Levitate	Shadow Ball	Focus Blast	Disable		Substitute	Black Sludge	261	121	156	359	187	350
Heatran		[18]	M	100	Flash Fire	Magma Storm	Earth Power	Toxic		Substitute	Leftovers	323	166	248	359	248	278
Skarmory	[18]	F	100	Keen Eye	Brave Bird	Whirlwind	Stealth Rock	Roost		Leftovers	334	196	317	104	262	176
Blissey		[18]	F	100	Natural Cure	Ice Beam	Stealth Rock	Thunder Wave	Healing Wish	Custap Berry	714	22	130	187	306	146
Nidoqueen	[18]	F	100	Poison Point	Earthquake	Flamethrower	Toxic Spikes	Protect		Black Sludge	384	200	300	187	206	169
Celebi		[18]	-	100	Natural Cure	Grass Knot	U-turn		Perish Song	Recover		Sitrus Berry	404	212	328	236	237	236
Starmie		[18]	-	100	Natural Cure	Surf		Thunderbolt	Rapid Spin	Recover		Colbur Berry	323	139	275	239	210	280
Rotom		[18]	-	100	Levitate	Thunderbolt	Hydro Pump	Trick		Hidden PowerICE	Choice Scarf	262	121	249	289	250	298
Rattata		[PARTY]	M	1	Guts		Endeavor	Quick Attack	Taunt		Protect		Focus Sash	11	7	4	5	5	7
Wynaut		[PARTY]	M	100	Shadow Tag	Mirror Coat	Counter		Destiny Bond	Encore		Custap Berry	369	73	177	82	193	82
Clamperl	[PARTY]	M	100	Shell Armor	Surf		Ice Beam	Muddy Water	Protect		Deep Sea Tooth	274	133	207	271	146	62
Scyther		[PARTY]	M	100	Technician	Bug Bite	Wing Attack	Reversal	Endure		Liechi Berry	281	319	196	131	197	339
`;

// Pokedex data for types and IDs, as this is missing from the source file.
// Note: The PBR database is based on Generation 4. Pokémon that received type changes
// in later generations (e.g., Clefable becoming Fairy-type) are represented here
// with their original Gen 4 typings. Types introduced after Gen 4, such as Fairy,
// are not included in this database.
const POKEDEX_DATA: Record<string, { id: number; types: PokemonType[] }> = {
  'Bulbasaur': { id: 1, types: [PokemonType.Grass, PokemonType.Poison] },
  'Ivysaur': { id: 2, types: [PokemonType.Grass, PokemonType.Poison] },
  'Venusaur': { id: 3, types: [PokemonType.Grass, PokemonType.Poison] },
  'Charmander': { id: 4, types: [PokemonType.Fire] },
  'Charmeleon': { id: 5, types: [PokemonType.Fire] },
  'Charizard': { id: 6, types: [PokemonType.Fire, PokemonType.Flying] },
  'Squirtle': { id: 7, types: [PokemonType.Water] },
  'Wartortle': { id: 8, types: [PokemonType.Water] },
  'Blastoise': { id: 9, types: [PokemonType.Water] },
  'Caterpie': { id: 10, types: [PokemonType.Bug] },
  'Metapod': { id: 11, types: [PokemonType.Bug] },
  'Butterfree': { id: 12, types: [PokemonType.Bug, PokemonType.Flying] },
  'Weedle': { id: 13, types: [PokemonType.Bug, PokemonType.Poison] },
  'Kakuna': { id: 14, types: [PokemonType.Bug, PokemonType.Poison] },
  'Beedrill': { id: 15, types: [PokemonType.Bug, PokemonType.Poison] },
  'Pidgey': { id: 16, types: [PokemonType.Normal, PokemonType.Flying] },
  'Pidgeotto': { id: 17, types: [PokemonType.Normal, PokemonType.Flying] },
  'Pidgeot': { id: 18, types: [PokemonType.Normal, PokemonType.Flying] },
  'Rattata': { id: 19, types: [PokemonType.Normal] },
  'Raticate': { id: 20, types: [PokemonType.Normal] },
  'Spearow': { id: 21, types: [PokemonType.Normal, PokemonType.Flying] },
  'Fearow': { id: 22, types: [PokemonType.Normal, PokemonType.Flying] },
  'Ekans': { id: 23, types: [PokemonType.Poison] },
  'Arbok': { id: 24, types: [PokemonType.Poison] },
  'Pikachu': { id: 25, types: [PokemonType.Electric] },
  'Raichu': { id: 26, types: [PokemonType.Electric] },
  'Sandshrew': { id: 27, types: [PokemonType.Ground] },
  'Sandslash': { id: 28, types: [PokemonType.Ground] },
  'Nidoran♀': { id: 29, types: [PokemonType.Poison] },
  'Nidorina': { id: 30, types: [PokemonType.Poison] },
  'Nidoqueen': { id: 31, types: [PokemonType.Poison, PokemonType.Ground] },
  'Nidoran♂': { id: 32, types: [PokemonType.Poison] },
  'Nidorino': { id: 33, types: [PokemonType.Poison] },
  'Nidoking': { id: 34, types: [PokemonType.Poison, PokemonType.Ground] },
  'Clefairy': { id: 35, types: [PokemonType.Normal] },
  'Clefable': { id: 36, types: [PokemonType.Normal] },
  'Vulpix': { id: 37, types: [PokemonType.Fire] },
  'Ninetales': { id: 38, types: [PokemonType.Fire] },
  'Jigglypuff': { id: 39, types: [PokemonType.Normal] },
  'Wigglytuff': { id: 40, types: [PokemonType.Normal] },
  'Zubat': { id: 41, types: [PokemonType.Poison, PokemonType.Flying] },
  'Golbat': { id: 42, types: [PokemonType.Poison, PokemonType.Flying] },
  'Oddish': { id: 43, types: [PokemonType.Grass, PokemonType.Poison] },
  'Gloom': { id: 44, types: [PokemonType.Grass, PokemonType.Poison] },
  'Vileplume': { id: 45, types: [PokemonType.Grass, PokemonType.Poison] },
  'Paras': { id: 46, types: [PokemonType.Bug, PokemonType.Grass] },
  'Parasect': { id: 47, types: [PokemonType.Bug, PokemonType.Grass] },
  'Venonat': { id: 48, types: [PokemonType.Bug, PokemonType.Poison] },
  'Venomoth': { id: 49, types: [PokemonType.Bug, PokemonType.Poison] },
  'Diglett': { id: 50, types: [PokemonType.Ground] },
  'Dugtrio': { id: 51, types: [PokemonType.Ground] },
  'Meowth': { id: 52, types: [PokemonType.Normal] },
  'Persian': { id: 53, types: [PokemonType.Normal] },
  'Psyduck': { id: 54, types: [PokemonType.Water] },
  'Golduck': { id: 55, types: [PokemonType.Water] },
  'Mankey': { id: 56, types: [PokemonType.Fighting] },
  'Primeape': { id: 57, types: [PokemonType.Fighting] },
  'Growlithe': { id: 58, types: [PokemonType.Fire] },
  'Arcanine': { id: 59, types: [PokemonType.Fire] },
  'Poliwag': { id: 60, types: [PokemonType.Water] },
  'Poliwhirl': { id: 61, types: [PokemonType.Water] },
  'Poliwrath': { id: 62, types: [PokemonType.Water, PokemonType.Fighting] },
  'Abra': { id: 63, types: [PokemonType.Psychic] },
  'Kadabra': { id: 64, types: [PokemonType.Psychic] },
  'Alakazam': { id: 65, types: [PokemonType.Psychic] },
  'Machop': { id: 66, types: [PokemonType.Fighting] },
  'Machoke': { id: 67, types: [PokemonType.Fighting] },
  'Machamp': { id: 68, types: [PokemonType.Fighting] },
  'Bellsprout': { id: 69, types: [PokemonType.Grass, PokemonType.Poison] },
  'Weepinbell': { id: 70, types: [PokemonType.Grass, PokemonType.Poison] },
  'Victreebel': { id: 71, types: [PokemonType.Grass, PokemonType.Poison] },
  'Tentacool': { id: 72, types: [PokemonType.Water, PokemonType.Poison] },
  'Tentacruel': { id: 73, types: [PokemonType.Water, PokemonType.Poison] },
  'Geodude': { id: 74, types: [PokemonType.Rock, PokemonType.Ground] },
  'Graveler': { id: 75, types: [PokemonType.Rock, PokemonType.Ground] },
  'Golem': { id: 76, types: [PokemonType.Rock, PokemonType.Ground] },
  'Ponyta': { id: 77, types: [PokemonType.Fire] },
  'Rapidash': { id: 78, types: [PokemonType.Fire] },
  'Slowpoke': { id: 79, types: [PokemonType.Water, PokemonType.Psychic] },
  'Slowbro': { id: 80, types: [PokemonType.Water, PokemonType.Psychic] },
  'Magnemite': { id: 81, types: [PokemonType.Electric, PokemonType.Steel] },
  'Magneton': { id: 82, types: [PokemonType.Electric, PokemonType.Steel] },
  'Farfetch’d': { id: 83, types: [PokemonType.Normal, PokemonType.Flying] },
  'Doduo': { id: 84, types: [PokemonType.Normal, PokemonType.Flying] },
  'Dodrio': { id: 85, types: [PokemonType.Normal, PokemonType.Flying] },
  'Seel': { id: 86, types: [PokemonType.Water] },
  'Dewgong': { id: 87, types: [PokemonType.Water, PokemonType.Ice] },
  'Grimer': { id: 88, types: [PokemonType.Poison] },
  'Muk': { id: 89, types: [PokemonType.Poison] },
  'Shellder': { id: 90, types: [PokemonType.Water] },
  'Cloyster': { id: 91, types: [PokemonType.Water, PokemonType.Ice] },
  'Gastly': { id: 92, types: [PokemonType.Ghost, PokemonType.Poison] },
  'Haunter': { id: 93, types: [PokemonType.Ghost, PokemonType.Poison] },
  'Gengar': { id: 94, types: [PokemonType.Ghost, PokemonType.Poison] },
  'Onix': { id: 95, types: [PokemonType.Rock, PokemonType.Ground] },
  'Drowzee': { id: 96, types: [PokemonType.Psychic] },
  'Hypno': { id: 97, types: [PokemonType.Psychic] },
  'Krabby': { id: 98, types: [PokemonType.Water] },
  'Kingler': { id: 99, types: [PokemonType.Water] },
  'Voltorb': { id: 100, types: [PokemonType.Electric] },
  'Electrode': { id: 101, types: [PokemonType.Electric] },
  'Exeggcute': { id: 102, types: [PokemonType.Grass, PokemonType.Psychic] },
  'Exeggutor': { id: 103, types: [PokemonType.Grass, PokemonType.Psychic] },
  'Cubone': { id: 104, types: [PokemonType.Ground] },
  'Marowak': { id: 105, types: [PokemonType.Ground] },
  'Hitmonlee': { id: 106, types: [PokemonType.Fighting] },
  'Hitmonchan': { id: 107, types: [PokemonType.Fighting] },
  'Lickitung': { id: 108, types: [PokemonType.Normal] },
  'Koffing': { id: 109, types: [PokemonType.Poison] },
  'Weezing': { id: 110, types: [PokemonType.Poison] },
  'Rhyhorn': { id: 111, types: [PokemonType.Rock, PokemonType.Ground] },
  'Rhydon': { id: 112, types: [PokemonType.Rock, PokemonType.Ground] },
  'Chansey': { id: 113, types: [PokemonType.Normal] },
  'Tangela': { id: 114, types: [PokemonType.Grass] },
  'Kangaskhan': { id: 115, types: [PokemonType.Normal] },
  'Horsea': { id: 116, types: [PokemonType.Water] },
  'Seadra': { id: 117, types: [PokemonType.Water] },
  'Goldeen': { id: 118, types: [PokemonType.Water] },
  'Seaking': { id: 119, types: [PokemonType.Water] },
  'Staryu': { id: 120, types: [PokemonType.Water] },
  'Starmie': { id: 121, types: [PokemonType.Water, PokemonType.Psychic] },
  'Mr. Mime': { id: 122, types: [PokemonType.Psychic] },
  'Scyther': { id: 123, types: [PokemonType.Bug, PokemonType.Flying] },
  'Jynx': { id: 124, types: [PokemonType.Ice, PokemonType.Psychic] },
  'Electabuzz': { id: 125, types: [PokemonType.Electric] },
  'Magmar': { id: 126, types: [PokemonType.Fire] },
  'Pinsir': { id: 127, types: [PokemonType.Bug] },
  'Tauros': { id: 128, types: [PokemonType.Normal] },
  'Magikarp': { id: 129, types: [PokemonType.Water] },
  'Gyarados': { id: 130, types: [PokemonType.Water, PokemonType.Flying] },
  'Lapras': { id: 131, types: [PokemonType.Water, PokemonType.Ice] },
  'Ditto': { id: 132, types: [PokemonType.Normal] },
  'Eevee': { id: 133, types: [PokemonType.Normal] },
  'Vaporeon': { id: 134, types: [PokemonType.Water] },
  'Jolteon': { id: 135, types: [PokemonType.Electric] },
  'Flareon': { id: 136, types: [PokemonType.Fire] },
  'Porygon': { id: 137, types: [PokemonType.Normal] },
  'Omanyte': { id: 138, types: [PokemonType.Rock, PokemonType.Water] },
  'Omastar': { id: 139, types: [PokemonType.Rock, PokemonType.Water] },
  'Kabuto': { id: 140, types: [PokemonType.Rock, PokemonType.Water] },
  'Kabutops': { id: 141, types: [PokemonType.Rock, PokemonType.Water] },
  'Aerodactyl': { id: 142, types: [PokemonType.Rock, PokemonType.Flying] },
  'Snorlax': { id: 143, types: [PokemonType.Normal] },
  'Articuno': { id: 144, types: [PokemonType.Ice, PokemonType.Flying] },
  'Zapdos': { id: 145, types: [PokemonType.Electric, PokemonType.Flying] },
  'Moltres': { id: 146, types: [PokemonType.Fire, PokemonType.Flying] },
  'Dratini': { id: 147, types: [PokemonType.Dragon] },
  'Dragonair': { id: 148, types: [PokemonType.Dragon] },
  'Dragonite': { id: 149, types: [PokemonType.Dragon, PokemonType.Flying] },
  'Mewtwo': { id: 150, types: [PokemonType.Psychic] },
  'Mew': { id: 151, types: [PokemonType.Psychic] },
  'Chikorita': { id: 152, types: [PokemonType.Grass] },
  'Bayleef': { id: 153, types: [PokemonType.Grass] },
  'Meganium': { id: 154, types: [PokemonType.Grass] },
  'Cyndaquil': { id: 155, types: [PokemonType.Fire] },
  'Quilava': { id: 156, types: [PokemonType.Fire] },
  'Typhlosion': { id: 157, types: [PokemonType.Fire] },
  'Totodile': { id: 158, types: [PokemonType.Water] },
  'Croconaw': { id: 159, types: [PokemonType.Water] },
  'Feraligatr': { id: 160, types: [PokemonType.Water] },
  'Sentret': { id: 161, types: [PokemonType.Normal] },
  'Furret': { id: 162, types: [PokemonType.Normal] },
  'Hoothoot': { id: 163, types: [PokemonType.Normal, PokemonType.Flying] },
  'Noctowl': { id: 164, types: [PokemonType.Normal, PokemonType.Flying] },
  'Ledyba': { id: 165, types: [PokemonType.Bug, PokemonType.Flying] },
  'Ledian': { id: 166, types: [PokemonType.Bug, PokemonType.Flying] },
  'Spinarak': { id: 167, types: [PokemonType.Bug, PokemonType.Poison] },
  'Ariados': { id: 168, types: [PokemonType.Bug, PokemonType.Poison] },
  'Crobat': { id: 169, types: [PokemonType.Poison, PokemonType.Flying] },
  'Chinchou': { id: 170, types: [PokemonType.Water, PokemonType.Electric] },
  'Lanturn': { id: 171, types: [PokemonType.Water, PokemonType.Electric] },
  'Pichu': { id: 172, types: [PokemonType.Electric] },
  'Cleffa': { id: 173, types: [PokemonType.Normal] },
  'Igglybuff': { id: 174, types: [PokemonType.Normal] },
  'Togepi': { id: 175, types: [PokemonType.Normal] },
  'Togetic': { id: 176, types: [PokemonType.Normal, PokemonType.Flying] },
  'Natu': { id: 177, types: [PokemonType.Psychic, PokemonType.Flying] },
  'Xatu': { id: 178, types: [PokemonType.Psychic, PokemonType.Flying] },
  'Mareep': { id: 179, types: [PokemonType.Electric] },
  'Flaaffy': { id: 180, types: [PokemonType.Electric] },
  'Ampharos': { id: 181, types: [PokemonType.Electric] },
  'Bellossom': { id: 182, types: [PokemonType.Grass] },
  'Marill': { id: 183, types: [PokemonType.Water] },
  'Azumarill': { id: 184, types: [PokemonType.Water] },
  'Sudowoodo': { id: 185, types: [PokemonType.Rock] },
  'Politoed': { id: 186, types: [PokemonType.Water] },
  'Hoppip': { id: 187, types: [PokemonType.Grass, PokemonType.Flying] },
  'Skiploom': { id: 188, types: [PokemonType.Grass, PokemonType.Flying] },
  'Jumpluff': { id: 189, types: [PokemonType.Grass, PokemonType.Flying] },
  'Aipom': { id: 190, types: [PokemonType.Normal] },
  'Sunkern': { id: 191, types: [PokemonType.Grass] },
  'Sunflora': { id: 192, types: [PokemonType.Grass] },
  'Yanma': { id: 193, types: [PokemonType.Bug, PokemonType.Flying] },
  'Wooper': { id: 194, types: [PokemonType.Water, PokemonType.Ground] },
  'Quagsire': { id: 195, types: [PokemonType.Water, PokemonType.Ground] },
  'Espeon': { id: 196, types: [PokemonType.Psychic] },
  'Umbreon': { id: 197, types: [PokemonType.Dark] },
  'Murkrow': { id: 198, types: [PokemonType.Dark, PokemonType.Flying] },
  'Slowking': { id: 199, types: [PokemonType.Water, PokemonType.Psychic] },
  'Misdreavus': { id: 200, types: [PokemonType.Ghost] },
  'Unown': { id: 201, types: [PokemonType.Psychic] },
  'Wobbuffet': { id: 202, types: [PokemonType.Psychic] },
  'Girafarig': { id: 203, types: [PokemonType.Normal, PokemonType.Psychic] },
  'Pineco': { id: 204, types: [PokemonType.Bug] },
  'Forretress': { id: 205, types: [PokemonType.Bug, PokemonType.Steel] },
  'Dunsparce': { id: 206, types: [PokemonType.Normal] },
  'Gligar': { id: 207, types: [PokemonType.Ground, PokemonType.Flying] },
  'Steelix': { id: 208, types: [PokemonType.Steel, PokemonType.Ground] },
  'Snubbull': { id: 209, types: [PokemonType.Normal] },
  'Granbull': { id: 210, types: [PokemonType.Normal] },
  'Qwilfish': { id: 211, types: [PokemonType.Water, PokemonType.Poison] },
  'Scizor': { id: 212, types: [PokemonType.Bug, PokemonType.Steel] },
  'Shuckle': { id: 213, types: [PokemonType.Bug, PokemonType.Rock] },
  'Heracross': { id: 214, types: [PokemonType.Bug, PokemonType.Fighting] },
  'Sneasel': { id: 215, types: [PokemonType.Dark, PokemonType.Ice] },
  'Teddiursa': { id: 216, types: [PokemonType.Normal] },
  'Ursaring': { id: 217, types: [PokemonType.Normal] },
  'Slugma': { id: 218, types: [PokemonType.Fire] },
  'Magcargo': { id: 219, types: [PokemonType.Fire, PokemonType.Rock] },
  'Swinub': { id: 220, types: [PokemonType.Ice, PokemonType.Ground] },
  'Piloswine': { id: 221, types: [PokemonType.Ice, PokemonType.Ground] },
  'Corsola': { id: 222, types: [PokemonType.Water, PokemonType.Rock] },
  'Remoraid': { id: 223, types: [PokemonType.Water] },
  'Octillery': { id: 224, types: [PokemonType.Water] },
  'Delibird': { id: 225, types: [PokemonType.Ice, PokemonType.Flying] },
  'Mantine': { id: 226, types: [PokemonType.Water, PokemonType.Flying] },
  'Skarmory': { id: 227, types: [PokemonType.Steel, PokemonType.Flying] },
  'Houndour': { id: 228, types: [PokemonType.Dark, PokemonType.Fire] },
  'Houndoom': { id: 229, types: [PokemonType.Dark, PokemonType.Fire] },
  'Kingdra': { id: 230, types: [PokemonType.Water, PokemonType.Dragon] },
  'Phanpy': { id: 231, types: [PokemonType.Ground] },
  'Donphan': { id: 232, types: [PokemonType.Ground] },
  'Porygon2': { id: 233, types: [PokemonType.Normal] },
  'Stantler': { id: 234, types: [PokemonType.Normal] },
  'Smeargle': { id: 235, types: [PokemonType.Normal] },
  'Tyrogue': { id: 236, types: [PokemonType.Fighting] },
  'Hitmontop': { id: 237, types: [PokemonType.Fighting] },
  'Smoochum': { id: 238, types: [PokemonType.Ice, PokemonType.Psychic] },
  'Elekid': { id: 239, types: [PokemonType.Electric] },
  'Magby': { id: 240, types: [PokemonType.Fire] },
  'Miltank': { id: 241, types: [PokemonType.Normal] },
  'Blissey': { id: 242, types: [PokemonType.Normal] },
  'Raikou': { id: 243, types: [PokemonType.Electric] },
  'Entei': { id: 244, types: [PokemonType.Fire] },
  'Suicune': { id: 245, types: [PokemonType.Water] },
  'Larvitar': { id: 246, types: [PokemonType.Rock, PokemonType.Ground] },
  'Pupitar': { id: 247, types: [PokemonType.Rock, PokemonType.Ground] },
  'Tyranitar': { id: 248, types: [PokemonType.Rock, PokemonType.Dark] },
  'Lugia': { id: 249, types: [PokemonType.Psychic, PokemonType.Flying] },
  'Ho-Oh': { id: 250, types: [PokemonType.Fire, PokemonType.Flying] },
  'Celebi': { id: 251, types: [PokemonType.Psychic, PokemonType.Grass] },
  'Treecko': { id: 252, types: [PokemonType.Grass] },
  'Grovyle': { id: 253, types: [PokemonType.Grass] },
  'Sceptile': { id: 254, types: [PokemonType.Grass] },
  'Torchic': { id: 255, types: [PokemonType.Fire] },
  'Combusken': { id: 256, types: [PokemonType.Fire, PokemonType.Fighting] },
  'Blaziken': { id: 257, types: [PokemonType.Fire, PokemonType.Fighting] },
  'Mudkip': { id: 258, types: [PokemonType.Water] },
  'Marshtomp': { id: 259, types: [PokemonType.Water, PokemonType.Ground] },
  'Swampert': { id: 260, types: [PokemonType.Water, PokemonType.Ground] },
  'Poochyena': { id: 261, types: [PokemonType.Dark] },
  'Mightyena': { id: 262, types: [PokemonType.Dark] },
  'Zigzagoon': { id: 263, types: [PokemonType.Normal] },
  'Linoone': { id: 264, types: [PokemonType.Normal] },
  'Wurmple': { id: 265, types: [PokemonType.Bug] },
  'Silcoon': { id: 266, types: [PokemonType.Bug] },
  'Beautifly': { id: 267, types: [PokemonType.Bug, PokemonType.Flying] },
  'Cascoon': { id: 268, types: [PokemonType.Bug] },
  'Dustox': { id: 269, types: [PokemonType.Bug, PokemonType.Poison] },
  'Lotad': { id: 270, types: [PokemonType.Water, PokemonType.Grass] },
  'Lombre': { id: 271, types: [PokemonType.Water, PokemonType.Grass] },
  'Ludicolo': { id: 272, types: [PokemonType.Water, PokemonType.Grass] },
  'Seedot': { id: 273, types: [PokemonType.Grass] },
  'Nuzleaf': { id: 274, types: [PokemonType.Grass, PokemonType.Dark] },
  'Shiftry': { id: 275, types: [PokemonType.Grass, PokemonType.Dark] },
  'Taillow': { id: 276, types: [PokemonType.Normal, PokemonType.Flying] },
  'Swellow': { id: 277, types: [PokemonType.Normal, PokemonType.Flying] },
  'Wingull': { id: 278, types: [PokemonType.Water, PokemonType.Flying] },
  'Pelipper': { id: 279, types: [PokemonType.Water, PokemonType.Flying] },
  'Ralts': { id: 280, types: [PokemonType.Psychic] },
  'Kirlia': { id: 281, types: [PokemonType.Psychic] },
  'Gardevoir': { id: 282, types: [PokemonType.Psychic] },
  'Surskit': { id: 283, types: [PokemonType.Bug, PokemonType.Water] },
  'Masquerain': { id: 284, types: [PokemonType.Bug, PokemonType.Flying] },
  'Shroomish': { id: 285, types: [PokemonType.Grass] },
  'Breloom': { id: 286, types: [PokemonType.Grass, PokemonType.Fighting] },
  'Slakoth': { id: 287, types: [PokemonType.Normal] },
  'Vigoroth': { id: 288, types: [PokemonType.Normal] },
  'Slaking': { id: 289, types: [PokemonType.Normal] },
  'Nincada': { id: 290, types: [PokemonType.Bug, PokemonType.Ground] },
  'Ninjask': { id: 291, types: [PokemonType.Bug, PokemonType.Flying] },
  'Shedinja': { id: 292, types: [PokemonType.Bug, PokemonType.Ghost] },
  'Whismur': { id: 293, types: [PokemonType.Normal] },
  'Loudred': { id: 294, types: [PokemonType.Normal] },
  'Exploud': { id: 295, types: [PokemonType.Normal] },
  'Makuhita': { id: 296, types: [PokemonType.Fighting] },
  'Hariyama': { id: 297, types: [PokemonType.Fighting] },
  'Azurill': { id: 298, types: [PokemonType.Normal] },
  'Nosepass': { id: 299, types: [PokemonType.Rock] },
  'Skitty': { id: 300, types: [PokemonType.Normal] },
  'Delcatty': { id: 301, types: [PokemonType.Normal] },
  'Sableye': { id: 302, types: [PokemonType.Dark, PokemonType.Ghost] },
  'Mawile': { id: 303, types: [PokemonType.Steel] },
  'Aron': { id: 304, types: [PokemonType.Steel, PokemonType.Rock] },
  'Lairon': { id: 305, types: [PokemonType.Steel, PokemonType.Rock] },
  'Aggron': { id: 306, types: [PokemonType.Steel, PokemonType.Rock] },
  'Meditite': { id: 307, types: [PokemonType.Fighting, PokemonType.Psychic] },
  'Medicham': { id: 308, types: [PokemonType.Fighting, PokemonType.Psychic] },
  'Electrike': { id: 309, types: [PokemonType.Electric] },
  'Manectric': { id: 310, types: [PokemonType.Electric] },
  'Plusle': { id: 311, types: [PokemonType.Electric] },
  'Minun': { id: 312, types: [PokemonType.Electric] },
  'Volbeat': { id: 313, types: [PokemonType.Bug] },
  'Illumise': { id: 314, types: [PokemonType.Bug] },
  'Roselia': { id: 315, types: [PokemonType.Grass, PokemonType.Poison] },
  'Gulpin': { id: 316, types: [PokemonType.Poison] },
  'Swalot': { id: 317, types: [PokemonType.Poison] },
  'Carvanha': { id: 318, types: [PokemonType.Water, PokemonType.Dark] },
  'Sharpedo': { id: 319, types: [PokemonType.Water, PokemonType.Dark] },
  'Wailmer': { id: 320, types: [PokemonType.Water] },
  'Wailord': { id: 321, types: [PokemonType.Water] },
  'Numel': { id: 322, types: [PokemonType.Fire, PokemonType.Ground] },
  'Camerupt': { id: 323, types: [PokemonType.Fire, PokemonType.Ground] },
  'Torkoal': { id: 324, types: [PokemonType.Fire] },
  'Spoink': { id: 325, types: [PokemonType.Psychic] },
  'Grumpig': { id: 326, types: [PokemonType.Psychic] },
  'Spinda': { id: 327, types: [PokemonType.Normal] },
  'Trapinch': { id: 328, types: [PokemonType.Ground] },
  'Vibrava': { id: 329, types: [PokemonType.Ground, PokemonType.Dragon] },
  'Flygon': { id: 330, types: [PokemonType.Ground, PokemonType.Dragon] },
  'Cacnea': { id: 331, types: [PokemonType.Grass] },
  'Cacturne': { id: 332, types: [PokemonType.Grass, PokemonType.Dark] },
  'Swablu': { id: 333, types: [PokemonType.Normal, PokemonType.Flying] },
  'Altaria': { id: 334, types: [PokemonType.Dragon, PokemonType.Flying] },
  'Zangoose': { id: 335, types: [PokemonType.Normal] },
  'Seviper': { id: 336, types: [PokemonType.Poison] },
  'Lunatone': { id: 337, types: [PokemonType.Rock, PokemonType.Psychic] },
  'Solrock': { id: 338, types: [PokemonType.Rock, PokemonType.Psychic] },
  'Barboach': { id: 339, types: [PokemonType.Water, PokemonType.Ground] },
  'Whiscash': { id: 340, types: [PokemonType.Water, PokemonType.Ground] },
  'Corphish': { id: 341, types: [PokemonType.Water] },
  'Crawdaunt': { id: 342, types: [PokemonType.Water, PokemonType.Dark] },
  'Baltoy': { id: 343, types: [PokemonType.Ground, PokemonType.Psychic] },
  'Claydol': { id: 344, types: [PokemonType.Ground, PokemonType.Psychic] },
  'Lileep': { id: 345, types: [PokemonType.Rock, PokemonType.Grass] },
  'Cradily': { id: 346, types: [PokemonType.Rock, PokemonType.Grass] },
  'Anorith': { id: 347, types: [PokemonType.Rock, PokemonType.Bug] },
  'Armaldo': { id: 348, types: [PokemonType.Rock, PokemonType.Bug] },
  'Feebas': { id: 349, types: [PokemonType.Water] },
  'Milotic': { id: 350, types: [PokemonType.Water] },
  'Castform': { id: 351, types: [PokemonType.Normal] },
  'Kecleon': { id: 352, types: [PokemonType.Normal] },
  'Shuppet': { id: 353, types: [PokemonType.Ghost] },
  'Banette': { id: 354, types: [PokemonType.Ghost] },
  'Duskull': { id: 355, types: [PokemonType.Ghost] },
  'Dusclops': { id: 356, types: [PokemonType.Ghost] },
  'Tropius': { id: 357, types: [PokemonType.Grass, PokemonType.Flying] },
  'Chimecho': { id: 358, types: [PokemonType.Psychic] },
  'Absol': { id: 359, types: [PokemonType.Dark] },
  'Wynaut': { id: 360, types: [PokemonType.Psychic] },
  'Snorunt': { id: 361, types: [PokemonType.Ice] },
  'Glalie': { id: 362, types: [PokemonType.Ice] },
  'Spheal': { id: 363, types: [PokemonType.Ice, PokemonType.Water] },
  'Sealeo': { id: 364, types: [PokemonType.Ice, PokemonType.Water] },
  'Walrein': { id: 365, types: [PokemonType.Ice, PokemonType.Water] },
  'Clamperl': { id: 366, types: [PokemonType.Water] },
  'Huntail': { id: 367, types: [PokemonType.Water] },
  'Gorebyss': { id: 368, types: [PokemonType.Water] },
  'Relicanth': { id: 369, types: [PokemonType.Water, PokemonType.Rock] },
  'Luvdisc': { id: 370, types: [PokemonType.Water] },
  'Bagon': { id: 371, types: [PokemonType.Dragon] },
  'Shelgon': { id: 372, types: [PokemonType.Dragon] },
  'Salamence': { id: 373, types: [PokemonType.Dragon, PokemonType.Flying] },
  'Beldum': { id: 374, types: [PokemonType.Steel, PokemonType.Psychic] },
  'Metang': { id: 375, types: [PokemonType.Steel, PokemonType.Psychic] },
  'Metagross': { id: 376, types: [PokemonType.Steel, PokemonType.Psychic] },
  'Regirock': { id: 377, types: [PokemonType.Rock] },
  'Regice': { id: 378, types: [PokemonType.Ice] },
  'Registeel': { id: 379, types: [PokemonType.Steel] },
  'Latias': { id: 380, types: [PokemonType.Dragon, PokemonType.Psychic] },
  'Latios': { id: 381, types: [PokemonType.Dragon, PokemonType.Psychic] },
  'Kyogre': { id: 382, types: [PokemonType.Water] },
  'Groudon': { id: 383, types: [PokemonType.Ground] },
  'Rayquaza': { id: 384, types: [PokemonType.Dragon, PokemonType.Flying] },
  'Jirachi': { id: 385, types: [PokemonType.Steel, PokemonType.Psychic] },
  'Deoxys': { id: 386, types: [PokemonType.Psychic] },
  'Deoxys (N)': { id: 386, types: [PokemonType.Psychic] },
  'Deoxys (A)': { id: 386, types: [PokemonType.Psychic] },
  'Deoxys (D)': { id: 386, types: [PokemonType.Psychic] },
  'Deoxys (S)': { id: 386, types: [PokemonType.Psychic] },
  'Turtwig': { id: 387, types: [PokemonType.Grass] },
  'Grotle': { id: 388, types: [PokemonType.Grass] },
  'Torterra': { id: 389, types: [PokemonType.Grass, PokemonType.Ground] },
  'Chimchar': { id: 390, types: [PokemonType.Fire] },
  'Monferno': { id: 391, types: [PokemonType.Fire, PokemonType.Fighting] },
  'Infernape': { id: 392, types: [PokemonType.Fire, PokemonType.Fighting] },
  'Piplup': { id: 393, types: [PokemonType.Water] },
  'Prinplup': { id: 394, types: [PokemonType.Water] },
  'Empoleon': { id: 395, types: [PokemonType.Water, PokemonType.Steel] },
  'Starly': { id: 396, types: [PokemonType.Normal, PokemonType.Flying] },
  'Staravia': { id: 397, types: [PokemonType.Normal, PokemonType.Flying] },
  'Staraptor': { id: 398, types: [PokemonType.Normal, PokemonType.Flying] },
  'Bidoof': { id: 399, types: [PokemonType.Normal] },
  'Bibarel': { id: 400, types: [PokemonType.Normal, PokemonType.Water] },
  'Kricketot': { id: 401, types: [PokemonType.Bug] },
  'Kricketune': { id: 402, types: [PokemonType.Bug] },
  'Shinx': { id: 403, types: [PokemonType.Electric] },
  'Luxio': { id: 404, types: [PokemonType.Electric] },
  'Luxray': { id: 405, types: [PokemonType.Electric] },
  'Budew': { id: 406, types: [PokemonType.Grass, PokemonType.Poison] },
  'Roserade': { id: 407, types: [PokemonType.Grass, PokemonType.Poison] },
  'Cranidos': { id: 408, types: [PokemonType.Rock] },
  'Rampardos': { id: 409, types: [PokemonType.Rock] },
  'Shieldon': { id: 410, types: [PokemonType.Rock, PokemonType.Steel] },
  'Bastiodon': { id: 411, types: [PokemonType.Rock, PokemonType.Steel] },
  'Burmy': { id: 412, types: [PokemonType.Bug] },
  'Wormadam': { id: 413, types: [PokemonType.Bug, PokemonType.Grass] },
  'Mothim': { id: 414, types: [PokemonType.Bug, PokemonType.Flying] },
  'Combee': { id: 415, types: [PokemonType.Bug, PokemonType.Flying] },
  'Vespiquen': { id: 416, types: [PokemonType.Bug, PokemonType.Flying] },
  'Pachirisu': { id: 417, types: [PokemonType.Electric] },
  'Buizel': { id: 418, types: [PokemonType.Water] },
  'Floatzel': { id: 419, types: [PokemonType.Water] },
  'Cherubi': { id: 420, types: [PokemonType.Grass] },
  'Cherrim': { id: 421, types: [PokemonType.Grass] },
  'Shellos': { id: 422, types: [PokemonType.Water] },
  'Gastrodon': { id: 423, types: [PokemonType.Water, PokemonType.Ground] },
  'Ambipom': { id: 424, types: [PokemonType.Normal] },
  'Drifloon': { id: 425, types: [PokemonType.Ghost, PokemonType.Flying] },
  'Drifblim': { id: 426, types: [PokemonType.Ghost, PokemonType.Flying] },
  'Buneary': { id: 427, types: [PokemonType.Normal] },
  'Lopunny': { id: 428, types: [PokemonType.Normal] },
  'Mismagius': { id: 429, types: [PokemonType.Ghost] },
  'Honchkrow': { id: 430, types: [PokemonType.Dark, PokemonType.Flying] },
  'Glameow': { id: 431, types: [PokemonType.Normal] },
  'Purugly': { id: 432, types: [PokemonType.Normal] },
  'Chingling': { id: 433, types: [PokemonType.Psychic] },
  'Stunky': { id: 434, types: [PokemonType.Poison, PokemonType.Dark] },
  'Skuntank': { id: 435, types: [PokemonType.Poison, PokemonType.Dark] },
  'Bronzor': { id: 436, types: [PokemonType.Steel, PokemonType.Psychic] },
  'Bronzong': { id: 437, types: [PokemonType.Steel, PokemonType.Psychic] },
  'Bonsly': { id: 438, types: [PokemonType.Rock] },
  'Mime Jr.': { id: 439, types: [PokemonType.Psychic] },
  'Happiny': { id: 440, types: [PokemonType.Normal] },
  'Chatot': { id: 441, types: [PokemonType.Normal, PokemonType.Flying] },
  'Spiritomb': { id: 442, types: [PokemonType.Ghost, PokemonType.Dark] },
  'Gible': { id: 443, types: [PokemonType.Dragon, PokemonType.Ground] },
  'Gabite': { id: 444, types: [PokemonType.Dragon, PokemonType.Ground] },
  'Garchomp': { id: 445, types: [PokemonType.Dragon, PokemonType.Ground] },
  'Munchlax': { id: 446, types: [PokemonType.Normal] },
  'Riolu': { id: 447, types: [PokemonType.Fighting] },
  'Lucario': { id: 448, types: [PokemonType.Fighting, PokemonType.Steel] },
  'Hippopotas': { id: 449, types: [PokemonType.Ground] },
  'Hippowdon': { id: 450, types: [PokemonType.Ground] },
  'Skorupi': { id: 451, types: [PokemonType.Poison, PokemonType.Bug] },
  'Drapion': { id: 452, types: [PokemonType.Poison, PokemonType.Dark] },
  'Croagunk': { id: 453, types: [PokemonType.Poison, PokemonType.Fighting] },
  'Toxicroak': { id: 454, types: [PokemonType.Poison, PokemonType.Fighting] },
  'Carnivine': { id: 455, types: [PokemonType.Grass] },
  'Finneon': { id: 456, types: [PokemonType.Water] },
  'Lumineon': { id: 457, types: [PokemonType.Water] },
  'Mantyke': { id: 458, types: [PokemonType.Water, PokemonType.Flying] },
  'Snover': { id: 459, types: [PokemonType.Grass, PokemonType.Ice] },
  'Abomasnow': { id: 460, types: [PokemonType.Grass, PokemonType.Ice] },
  'Weavile': { id: 461, types: [PokemonType.Dark, PokemonType.Ice] },
  'Magnezone': { id: 462, types: [PokemonType.Electric, PokemonType.Steel] },
  'Lickilicky': { id: 463, types: [PokemonType.Normal] },
  'Rhyperior': { id: 464, types: [PokemonType.Rock, PokemonType.Ground] },
  'Tangrowth': { id: 465, types: [PokemonType.Grass] },
  'Electivire': { id: 466, types: [PokemonType.Electric] },
  'Magmortar': { id: 467, types: [PokemonType.Fire] },
  'Togekiss': { id: 468, types: [PokemonType.Normal, PokemonType.Flying] },
  'Yanmega': { id: 469, types: [PokemonType.Bug, PokemonType.Flying] },
  'Leafeon': { id: 470, types: [PokemonType.Grass] },
  'Glaceon': { id: 471, types: [PokemonType.Ice] },
  'Gliscor': { id: 472, types: [PokemonType.Ground, PokemonType.Flying] },
  'Mamoswine': { id: 473, types: [PokemonType.Ice, PokemonType.Ground] },
  'Porygon-Z': { id: 474, types: [PokemonType.Normal] },
  'Gallade': { id: 475, types: [PokemonType.Psychic, PokemonType.Fighting] },
  'Probopass': { id: 476, types: [PokemonType.Rock, PokemonType.Steel] },
  'Dusknoir': { id: 477, types: [PokemonType.Ghost] },
  'Froslass': { id: 478, types: [PokemonType.Ice, PokemonType.Ghost] },
  'Rotom': { id: 479, types: [PokemonType.Electric, PokemonType.Ghost] },
  'Uxie': { id: 480, types: [PokemonType.Psychic] },
  'Mesprit': { id: 481, types: [PokemonType.Psychic] },
  'Azelf': { id: 482, types: [PokemonType.Psychic] },
  'Dialga': { id: 483, types: [PokemonType.Steel, PokemonType.Dragon] },
  'Palkia': { id: 484, types: [PokemonType.Water, PokemonType.Dragon] },
  'Heatran': { id: 485, types: [PokemonType.Fire, PokemonType.Steel] },
  'Regigigas': { id: 486, types: [PokemonType.Normal] },
  'Giratina': { id: 487, types: [PokemonType.Ghost, PokemonType.Dragon] },
  'Cresselia': { id: 488, types: [PokemonType.Psychic] },
  'Phione': { id: 489, types: [PokemonType.Water] },
  'Manaphy': { id: 490, types: [PokemonType.Water] },
  'Darkrai': { id: 491, types: [PokemonType.Dark] },
  'Shaymin': { id: 492, types: [PokemonType.Grass] },
  'Arceus': { id: 493, types: [PokemonType.Normal] },
};

const parsePbrDatabase = (): Pokemon[] => {
  const lines = PBR_DATABASE_STRING.split('\n');
  const pokemonMap = new Map<string, Pokemon>();

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('u/') || trimmedLine.startsWith('Search for') || trimmedLine.startsWith('THIS IS THE FORMAT') || trimmedLine.startsWith('Species')) {
      continue;
    }
    
    // Ignore eggs and other non-pokemon entries
    if(trimmedLine.includes("EGG") || trimmedLine.includes("Egg")) continue;

    const parts = trimmedLine.split(/\s\s+/).flatMap(p => p.trim().split('\t')).filter(Boolean);
    if (parts.length < 12) continue;

    try {
      const stats = parts.slice(-6).map(Number);
      const [hp, attack, defense, spAtk, spDef, speed] = stats;
      const heldItem = parts[parts.length - 7];
      const moves = parts.slice(4, parts.length - 7).filter(move => move !== '(None)');
      const ability = parts[3];
      const level = parseInt(parts[2], 10);
      const gender = parts[1];
      const box = parts[0].includes('[') ? parts[0].substring(parts[0].indexOf('[')) : '';
      let species = parts[0].split(' ')[0].trim();
      
      if(species === "Farfetch'd") species = "Farfetch’d"; // Fix apostrophe

      const pokedexEntry = POKEDEX_DATA[species] || POKEDEX_DATA[species.replace('(N)','').replace('(A)','').replace('(D)','').replace('(S)','')];
      if (!pokedexEntry) {
        console.warn(`Could not find pokedex data for: ${species}`);
        continue;
      }
      
      const battleSet: BattleSet = {
        sourceName: trimmedLine,
        box,
        gender,
        level,
        ability,
        moves,
        heldItem,
        stats: { hp, attack, defense, spAtk, spDef, speed }
      };

      if (pokemonMap.has(species)) {
        pokemonMap.get(species)!.sets.push(battleSet);
      } else {
        const rentalPasses = getRentalPassesForPokemon(species);
        const newPokemon: Pokemon = {
          id: pokedexEntry.id,
          name: species,
          types: pokedexEntry.types,
          sprite: {
            animated: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokedexEntry.id}.gif`,
            static: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokedexEntry.id}.png`,
          },
          shinySprite: {
            animated: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/${pokedexEntry.id}.gif`,
            static: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokedexEntry.id}.png`,
          },
          sets: [battleSet],
          ...(rentalPasses && { rentalPasses }),
        };
        pokemonMap.set(species, newPokemon);
      }
    } catch (e) {
      console.error("Failed to parse line:", trimmedLine, e);
    }
  }

  const allPokemon = Array.from(pokemonMap.values());
  return allPokemon.sort((a, b) => a.id - b.id);
};


let pokemonDB: Pokemon[] | null = null;

export const getPokemonDatabase = (): Pokemon[] => {
  if (!pokemonDB) {
    pokemonDB = parsePbrDatabase();
  }
  return pokemonDB;
};