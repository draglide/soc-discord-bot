import { characterStore, tarotStore, trinketStore, weaponStore } from "../data/store";
import { CharacterBuild, CharacterBuildRaw } from "../types/data/Character";

export function convertRawBuild(raw: CharacterBuildRaw): CharacterBuild | null {
    const character = characterStore.find(c => c.name.toLowerCase() === raw.character.toLowerCase());
    if (!character) return null;

    const weapon = weaponStore.filter(w => raw.weapon?.includes(w.name));
    const trinket = trinketStore.filter(t => raw.trinket?.includes(t.name));
    const tarot = tarotStore.filter(t => raw.tarot?.includes(t.name));

    return {
        character,
        weapon,
        trinket,
        tarot
    };
}