import { google } from "googleapis";
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';
dotenv.config();

const SPREADSHEET_ID = process.env.SHEET_ID!;

export async function getSheetClient() {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'google-credentials.json',
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const client = (await auth.getClient()) as JWT;
    return google.sheets({ version: 'v4', auth: client });
}

export { SPREADSHEET_ID };