import { Client, Collection } from "discord.js";
import fs from 'fs';
import path from 'path';
import { Command } from "../types/Command";

export function registerCommands(client: Client) {
    client.commands = new Collection();

    const commandsPath = path.join(__dirname, '..', 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command: Command = require(filePath).default;

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`✅ Registered command: ${command.data.name}`);
        } else {
            console.warn(`⚠️ The command at ${filePath} is missing "data" or "execute"`);
        }
    }
}