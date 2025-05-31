import { Character } from "../types/data/Character";
import { Trinket, Weapon } from "../types/data/Equipment";
import { Tarot } from "../types/data/Tarot";
import { fetchCharacterData } from "./reader/characterReader";
import { fetchEquipments } from "./reader/equipmentReader";
import { fetchTarots } from "./reader/tarotReader";

export async function fetchGameData(): Promise<{
    characters: Character[];
    weapons: Weapon[];
    trinkets: Trinket[];
    tarots: Tarot[];
}> {
    const [characters, equipment, tarots] = await Promise.all([
        fetchCharacterData(),
        fetchEquipments(),
        fetchTarots(),
    ]);
    const { weapons, trinkets } = equipment;
    
    return {
        characters,
        weapons,
        trinkets,
        tarots,
    };
}