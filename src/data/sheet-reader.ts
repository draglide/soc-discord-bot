import { Character, CharacterBuildRaw } from "../types/data/Character";
import { Trinket, Weapon } from "../types/data/Equipment";
import { Tarot } from "../types/data/Tarot";
import { fetchBuild } from "./reader/buildReader";
import { fetchCharacterData } from "./reader/characterReader";
import { fetchEquipments } from "./reader/equipmentReader";
import { fetchTarots } from "./reader/tarotReader";

export async function fetchGameData(): Promise<{
    characters: Character[];
    weapons: Weapon[];
    trinkets: Trinket[];
    tarots: Tarot[];
    builds: CharacterBuildRaw[];
}> {
    const [characters, equipment, tarots, builds] = await Promise.all([
        fetchCharacterData(),
        fetchEquipments(),
        fetchTarots(),
        fetchBuild()
    ]);
    const { weapons, trinkets } = equipment;
    
    return {
        characters,
        weapons,
        trinkets,
        tarots,
        builds
    };
}