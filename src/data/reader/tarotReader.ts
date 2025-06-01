import { Tarot } from "../../types/data/Tarot";
import { getSheetClient, SPREADSHEET_ID } from "./sheetsClient";

export async function fetchTarots(): Promise<Tarot[]> {
    const client = await getSheetClient();
    const sheet = await client.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: 'Tarot!A2:E' });

    const data: Tarot[] = (sheet.data.values || [])
        .filter((row) => row[3] && row[3].trim())
        .map(([name, icon, , effect, lastSlotEffect]) => ({
            name,
            icon,
            effect,
            lastSlotEffect,
        }));

    return data;
}