import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';
import { Character, CharacterClass, Faction } from '../types/Character';
dotenv.config();

const SPREADSHEET_ID = process.env.SHEET_ID!;

async function getSheetClient() {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'google-credentials.json',
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const client = (await auth.getClient()) as JWT;
    return google.sheets({ version: 'v4', auth: client });
}

export async function fetchGameData(): Promise<Character[]> {
    const client = await getSheetClient();
    const [classSheet, factionSheet, characterSheet] = await Promise.all([
        client.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Class & Faction!A2:B',
        }),
        client.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Class & Faction!D2:E',
        }),
        client.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Character List!A2:F',
        }),
    ]);

    const classMap = new Map<string, CharacterClass>();
    const factionMap = new Map<string, Faction>();

    for (const row of classSheet.data.values || []) {
        const [name, icon] = row;
        if (name) {
            classMap.set(name.trim(), { name: name.trim(), icon });
        }
    }

    for (const row of factionSheet.data.values || []) {
        const [name, icon] = row;
        if (name) {
            factionMap.set(name.trim(), { name: name.trim(), icon });
        }
    }

    const characters: Character[] = [];
    for (const row of characterSheet.data.values || []) {
        const [name, rarity, pixelArt, className, factionList, mainArt] = row;

        const charClass = classMap.get(className.trim());
        const charFactions = factionList.split(',').map((f: string) => factionMap.get(f.trim())).filter(Boolean) as Faction[];
    
        if (name && charClass && charFactions.length > 0) {
            characters.push({
                name: name.trim(),
                rarity: rarity.trim(),
                pixelArt,
                class: charClass,
                faction: charFactions,
                mainArt,
            });
        }
    }

    return characters;
}