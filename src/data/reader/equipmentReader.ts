import { Tier, Trinket, Weapon, WeaponType } from "../../types/data/Equipment";
import { getSheetClient, SPREADSHEET_ID } from "./sheetsClient";

export interface EquipmentData {
    weapons: Weapon[];
    trinkets: Trinket[];
}

export async function fetchEquipments(): Promise<EquipmentData> {
    const client = await getSheetClient();
    const sheet = await client.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: 'Weapon & Trinket!A2:J' });

    const weapons: Weapon[] = [];
    const trinkets: Trinket[] = [];

    for (const row of sheet.data.values || []) {
        const [
            name,
            icon,
            rarity,
            type,
            star1,
            star2,
            star3,
            star4,
            star5,
            description,
        ] = row;

        const tiers: Tier[] = [
            { level: 1, effect: star1 },
            { level: 2, effect: star2 },
            { level: 3, effect: star3 },
            { level: 4, effect: star4 },
            { level: 5, effect: star5 },
        ].filter(t => t.effect); // Filter out undefined effects if needed

        if (name != null && rarity != null) {
            if (type === 'Trinket') {
                trinkets.push({ name, icon, type: 'Trinket', description, rarity, tier: tiers });
            } else {
                weapons.push({ name, icon, type: type as WeaponType, description, rarity, tier: tiers });
            }
        }
    }

    return { weapons, trinkets };
}