import dotenv from 'dotenv';
import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
import path from 'path';

dotenv.config();

(async () => {
    const commands: any[] = [];
    const commandsDir = path.join(__dirname, 'commands');

    const commandFiles = fs
        .readdirSync(commandsDir)
        .filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsDir, file);
        let commandModule;

        try {
            commandModule = require(filePath);
        } catch (err) {
            console.warn(`⚠️ Could not load command ${file}:`, err);
            continue;
        }

        const command = commandModule.default ?? commandModule;

        if (!command?.data || typeof command.data.toJSON !== 'function') {
            console.warn(`⚠️ Skipping ${file}: Missing or invalid "data" export.`);
            continue;
        }

        commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

    try {
        console.log('📤 Registering slash commands...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
            { body: commands }
        );
        console.log('✅ Slash commands registered.');
    } catch (error) {
        console.error('❌ Failed to register commands:', error);
    }
})();