interface BaseEquipment {
    name: string;
    rarity: Rarity
    tier: Tier[];
    icon: string;
    description: string;
}

export interface Weapon extends BaseEquipment {
    type: WeaponType;
}

export interface Trinket extends BaseEquipment {
    type: 'Trinket';
}

export interface Tier {
    level: number;
    effect: string;
}

enum Rarity {
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