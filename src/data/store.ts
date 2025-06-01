import { Character, CharacterBuildRaw } from "../types/data/Character";
import { Trinket, Weapon } from "../types/data/Equipment";
import { Tarot } from "../types/data/Tarot";

export const characterStore: Character[] = [];
export const weaponStore: Weapon[] = [];
export const trinketStore: Trinket[] = [];
export const tarotStore: Tarot[] = [];
export const buildStore: CharacterBuildRaw[] = [];

export const loadAllGamedata = (): void => {
    // Load characters
    try {
        const characterData = require('./characters.json') as Character[];
        characterStore.push(...characterData);
    } catch (error) {
        console.error("Failed to load characters:", error);
    }

    // Load weapons
    try {
        const weaponData = require('./weapons.json') as Weapon[];
        weaponStore.push(...weaponData);
    } catch (error) {
        console.error("Failed to load weapons:", error);
    }

    // Load trinkets
    try {
        const trinketData = require('./trinkets.json') as Trinket[];
        trinketStore.push(...trinketData);
    } catch (error) {
        console.error("Failed to load trinkets:", error);
    }

    // Load tarots
    try {
        const tarotData = require('./tarots.json') as Tarot[];
        tarotStore.push(...tarotData);
    } catch (error) {
        console.error("Failed to load tarots:", error);
    }

    // Load builds
    try {
        const buildData = require('./builds.json') as CharacterBuildRaw[];
        buildStore.push(...buildData);
    } catch (error) {
        console.error("Failed to load builds:", error);
    }
}