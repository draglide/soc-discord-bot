import { CharacterBuildRaw } from "../../types/data/Character";
import { getSheetClient, SPREADSHEET_ID } from "./sheetsClient";

export async function fetchBuild(): Promise<CharacterBuildRaw[]> {
    const client = await getSheetClient();
    const sheet = await client.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: 'Character Build - DB!A2:D' });

    const data: CharacterBuildRaw[] = (sheet.data.values || [])
        .filter((row) => row[0] && row[0].trim())
        .map(([character, weapon, trinket, tarot]) => ({
            character,
            weapon,
            trinket,
            tarot
        }));

    return data;
}