import { PassCategory, Trainer, Pokemon, StoredPokemon } from '../types';
import { getPokemonDatabase } from './pokemonService';

const findSetSourceName = (pokemonName: string, partialMoves: string[]): string => {
    const db = getPokemonDatabase();
    const pokemon = db.find(p => p.name === pokemonName);
    if (!pokemon) {
        console.warn(`[passService] Could not find pokemon: ${pokemonName}`);
        return `NOT_FOUND: ${pokemonName}`;
    }
    const set = pokemon.sets.find(s => partialMoves.every(pm => s.moves.includes(pm)));
    if (!set) {
        console.warn(`[passService] Could not find set for ${pokemonName} with moves: ${partialMoves.join(', ')}`);
        return `SET_NOT_FOUND: ${pokemonName}`;
    }
    return set.sourceName;
}


const BATTLE_PASS_DATA: PassCategory[] = [
    {
        title: 'Custom Passes',
        passes: [
            {
                id: 'custom-1',
                title: 'Page 1/9: Champions',
                trainers: [
                    {
                        name: 'Lance',
                        title: 'Dragon Tamer',
                        passColor: { from: 'from-red-500', to: 'to-orange-700' },
                        team: [
                            { pokemonName: 'Dragonite', setSourceName: findSetSourceName('Dragonite', ['Aerial Ace', 'Outrage', 'Fire Punch', 'Dragon Dance'])},
                            { pokemonName: 'Charizard', setSourceName: findSetSourceName('Charizard', ['Heat Wave', 'Air Slash', 'Solar Beam', 'Blast Burn'])},
                            { pokemonName: 'Salamence', setSourceName: findSetSourceName('Salamence', ['Draco Meteor', 'Heat Wave', 'Rain Dance', 'Protect'])},
                            { pokemonName: 'Gyarados', setSourceName: findSetSourceName('Gyarados', ['Waterfall', 'Earthquake', 'Ice Fang', 'Dragon Dance'])},
                            { pokemonName: 'Aerodactyl', setSourceName: findSetSourceName('Aerodactyl', ['Rock Slide', 'Earthquake', 'Taunt', 'Stealth Rock'])},
                            { pokemonName: 'Kingdra', setSourceName: findSetSourceName('Kingdra', ['Hydro Pump', 'Draco Meteor', 'Blizzard', 'Rain Dance'])},
                        ]
                    },
                    {
                        name: 'Steven',
                        title: 'Steel Guy',
                        passColor: { from: 'from-gray-500', to: 'to-slate-700' },
                        team: [
                            { pokemonName: 'Metagross', setSourceName: findSetSourceName('Metagross', ['Zen Headbutt', 'Meteor Mash', 'Bullet Punch', 'Stealth Rock'])},
                            { pokemonName: 'Aggron', setSourceName: findSetSourceName('Aggron', ['Head Smash', 'Low Kick', 'Ice Punch', 'Magnet Rise'])},
                            { pokemonName: 'Skarmory', setSourceName: findSetSourceName('Skarmory', ['Brave Bird', 'Spikes', 'Whirlwind', 'Roost'])},
                            { pokemonName: 'Claydol', setSourceName: findSetSourceName('Claydol', ['Earth Power', 'Psychic', 'Skill Swap', 'Trick Room'])},
                            { pokemonName: 'Cradily', setSourceName: findSetSourceName('Cradily', ['Rock Slide', 'Ingrain', 'Toxic', 'Recover'])},
                            { pokemonName: 'Armaldo', setSourceName: findSetSourceName('Armaldo', ['rock slide', 'X-Scissor', 'Earthquake', 'Curse'])},
                        ]
                    },
                    {
                        name: 'Wallace',
                        title: 'Surfing Guy',
                        passColor: { from: 'from-sky-400', to: 'to-cyan-600' },
                        team: [
                            { pokemonName: 'Milotic', setSourceName: findSetSourceName('Milotic', ['Hydro Pump', 'Blizzard', 'Haze', 'Recover'])},
                            { pokemonName: 'Ludicolo', setSourceName: findSetSourceName('Ludicolo', ['Fake Out', 'Grass Knot', 'Hydro Pump', 'Mist'])},
                            { pokemonName: 'Whiscash', setSourceName: findSetSourceName('Whiscash', ['Earthquake', 'Waterfall', 'Zen Headbutt', 'Dragon Dance'])},
                            { pokemonName: 'Walrein', setSourceName: findSetSourceName('Walrein', ['Blizzard', 'Surf', 'Super Fang', 'Aqua Ring'])},
                            { pokemonName: 'Gorebyss', setSourceName: findSetSourceName('Gorebyss', ['Hydro Pump', 'Ice Beam', 'Signal Beam', 'Psychic'])},
                            { pokemonName: 'Relicanth', setSourceName: findSetSourceName('Relicanth', ['Head Smash', 'Aqua Tail', 'Earthquake', 'Rest'])},
                        ]
                    },
                    {
                        name: 'Cynthia',
                        title: 'Top Star',
                        passColor: { from: 'from-gray-800', to: 'to-black' },
                        team: [
                            { pokemonName: 'Garchomp', setSourceName: findSetSourceName('Garchomp', ['Dragon Claw', 'Earthquake', 'Fire Blast', 'Stealth Rock'])},
                            { pokemonName: 'Roserade', setSourceName: findSetSourceName('Roserade', ['Sludge Bomb', 'Energy Ball', 'Shadow Ball', 'Toxic Spikes'])},
                            { pokemonName: 'Lucario', setSourceName: findSetSourceName('Lucario', ['Aura Sphere', 'Dragon Pulse', 'Vacuum Wave', 'Protect'])},
                            { pokemonName: 'Togekiss', setSourceName: findSetSourceName('Togekiss', ['Air Slash', 'Heat Wave', 'Follow Me', 'Roost'])},
                            { pokemonName: 'Spiritomb', setSourceName: findSetSourceName('Spiritomb', ['Dark Pulse', 'Confuse Ray', 'Calm Mind', 'Will-O-Wisp'])},
                            { pokemonName: 'Milotic', setSourceName: findSetSourceName('Milotic', ['Ice Beam', 'Hydro Pump', 'Mirror Coat', 'Recover'])},
                        ]
                    }
                ]
            },
            {
                id: 'custom-2',
                title: 'Page 2/9: Kanto Legends',
                trainers: [
                    {
                        name: 'Red',
                        title: 'Major Trainer',
                        passColor: { from: 'from-red-500', to: 'to-rose-700' },
                        team: [
                            { pokemonName: 'Charizard', setSourceName: findSetSourceName('Charizard', ['Flare Blitz', 'Thunder Punch', 'Earthquake', 'Dragon Dance'])},
                            { pokemonName: 'Blastoise', setSourceName: findSetSourceName('Blastoise', ['Hydro Pump', 'Skull Bash', 'Rapid Spin', 'Roar'])},
                            { pokemonName: 'Venusaur', setSourceName: findSetSourceName('Venusaur', ['Power Whip', 'Earthquake', 'Sleep Powder', 'Synthesis'])},
                            { pokemonName: 'Pikachu', setSourceName: findSetSourceName('Pikachu', ['Fake Out', 'Volt Tackle', 'Surf', 'Encore'])},
                            { pokemonName: 'Snorlax', setSourceName: findSetSourceName('Snorlax', ['Frustration', 'Earthquake', 'Crunch', 'Curse'])},
                            { pokemonName: 'Espeon', setSourceName: findSetSourceName('Espeon', ['Psychic', 'Shadow Ball', 'Magic Coat', 'Calm Mind'])},
                        ]
                    },
                     {
                        name: 'Blue',
                        title: 'Pokétopia Master',
                        passColor: { from: 'from-blue-500', to: 'to-indigo-700' },
                        team: [
                            { pokemonName: 'Blastoise', setSourceName: findSetSourceName('Blastoise', ['Surf', 'Ice Beam', 'Hydro Cannon', 'Roar'])},
                            { pokemonName: 'Arcanine', setSourceName: findSetSourceName('Arcanine', ['Flare Blitz', 'Extreme Speed', 'Overheat', 'Will-O-Wisp'])},
                            { pokemonName: 'Exeggutor', setSourceName: findSetSourceName('Exeggutor', ['Solar Beam', 'Dream Eater', 'Sunny Day', 'Sleep Powder'])},
                            { pokemonName: 'Machamp', setSourceName: findSetSourceName('Machamp', ['Dynamic Punch', 'Stone Edge', 'Bullet Punch', 'Protect'])},
                            { pokemonName: 'Alakazam', setSourceName: findSetSourceName('Alakazam', ['Psychic', 'Focus Blast', 'Shadow Ball', 'Calm Mind'])},
                            { pokemonName: 'Pidgeot', setSourceName: findSetSourceName('Pidgeot', ['Brave Bird', 'Mirror Move', 'Tailwind', 'Substitute'])},
                        ]
                    },
                    {
                        name: 'Green',
                        title: 'Blossoming Trainer',
                        passColor: { from: 'from-green-400', to: 'to-lime-600' },
                        team: [
                           { pokemonName: 'Venusaur', setSourceName: findSetSourceName('Venusaur', ['Giga Drain', 'Sludge Bomb', 'Sleep Powder', 'Leech Seed']) },
                           { pokemonName: 'Ninetales', setSourceName: findSetSourceName('Ninetales', ['Overheat', 'Energy Ball', 'Disable', 'Will-O-Wisp']) },
                           { pokemonName: 'Clefable', setSourceName: findSetSourceName('Clefable', ['Ice Beam', 'Seismic Toss', 'Follow Me', 'Wish']) },
                           { pokemonName: 'Kangaskhan', setSourceName: findSetSourceName('Kangaskhan', ['Fake Out', 'Return', 'Sucker Punch', 'Helping Hand']) },
                           { pokemonName: 'Machamp', setSourceName: findSetSourceName('Machamp', ['Close Combat', 'Earthquake', 'Bullet Punch', 'Protect']) },
                           { pokemonName: 'Gengar', setSourceName: findSetSourceName('Gengar', ['Shadow Ball', 'Focus Blast', 'Will-O-Wisp', 'Taunt']) },
                        ]
                    },
                    {
                        name: 'Oak',
                        title: 'Senior Trainer',
                        passColor: { from: 'from-stone-400', to: 'to-neutral-500' },
                        team: [
                            { pokemonName: 'Venusaur', setSourceName: findSetSourceName('Venusaur', ['Power Whip', 'Earthquake', 'Sleep Powder', 'Synthesis']) },
                            { pokemonName: 'Charizard', setSourceName: findSetSourceName('Charizard', ['Flare Blitz', 'Thunder Punch', 'Earthquake', 'Dragon Dance']) },
                            { pokemonName: 'Blastoise', setSourceName: findSetSourceName('Blastoise', ['Hydro Pump', 'Skull Bash', 'Rapid Spin', 'Roar']) },
                            { pokemonName: 'Tauros', setSourceName: findSetSourceName('Tauros', ['Giga Impact', 'Earthquake', 'Pursuit', 'Iron Head']) },
                            { pokemonName: 'Arcanine', setSourceName: findSetSourceName('Arcanine', ['Dragon Pulse', 'Extreme Speed', 'Overheat', 'Will-O-Wisp']) },
                            { pokemonName: 'Gyarados', setSourceName: findSetSourceName('Gyarados', ['Waterfall', 'Thunder Wave', 'Rest', 'Roar']) },
                        ]
                    },
                ]
            }
        ]
    }
];


export const getPassCategories = (): PassCategory[] => {
    return BATTLE_PASS_DATA;
}
