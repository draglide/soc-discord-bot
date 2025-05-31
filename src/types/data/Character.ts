import { Trinket, Weapon } from "./Equipment";
import { Tarot } from "./Tarot";

export interface Character {
    name: string;
    rarity: string;
    pixelArt: string;
    class: CharacterClass;
    faction: Faction[];
    mainArt: string;
}

export interface Faction {
    name: string;
    icon: string;
}

export interface CharacterClass {
    name: string;
    icon: string;
}

export interface CharacterBuild {
    character: Character;
    weapon?: Weapon[];
    trinket?: Trinket[];
    tarot?: Tarot[];
}