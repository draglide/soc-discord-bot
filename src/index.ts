import dotenv from 'dotenv';
import { Client, Collection, GatewayIntentBits, Interaction } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { Command } from './types/Command';

dotenv.config();

// CommonJS variables
declare const __filename: string;
declare const __dirname: string;

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

declare module 'discord.js' {
    interface Client {
        commands: Collection<string, Command>;
    }
}

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
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

client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '⚠️ There was an error executing that command.', ephemeral: true });
        }
    } else if (interaction.isAutocomplete()) {
        const command = client.commands.get(interaction.commandName);
        if (!command?.autocomplete) return;
        try {
            await command.autocomplete(interaction);
        } catch (error) {
            console.error(error);
        }
    }
});

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user?.tag}`);
});

client.login(process.env.DISCORD_TOKEN);