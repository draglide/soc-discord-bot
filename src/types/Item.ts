export interface Item {
    name: string;
    rarity: Rarity
    tier: Tier[];
    icon: string;
    description: string;
    type: WeaponType | "Trinket";
}

export interface Tier {
    level: number;
    effect: string;
}

export enum Rarity {
    Common = "Common",
    Rare = "Rare",
    Epic = "Epic",
    Legendary = "Legendary",
}

export enum WeaponType {
    Axe = "Axe",
    Bow = "Bow",
    Spear = "Spear",
    Staff = "Staff",
    Sword = "Sword",
}