import dotenv from 'dotenv';
import { Client, Collection, GatewayIntentBits, Interaction } from 'discord.js';
import { handleCommands } from './handlers/commandHandler';
import { handleAutocomplete } from './handlers/autocompleteHandler';
import { handleButtons } from './handlers/buttonHandler';
import { registerCommands } from './client/registerCommands';
import { Command } from './types/Command';
import { loadAllGamedata } from './data/store';

declare module 'discord.js' {
    interface Client {
        commands: Collection<string, Command>;
    }
}

dotenv.config();

loadAllGamedata();

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

registerCommands(client);

client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) return handleCommands(client, interaction);
    if (interaction.isAutocomplete()) return handleAutocomplete(client, interaction);
    if (interaction.isButton()) return handleButtons(interaction);
});

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user?.tag}`);
});

client.login(process.env.DISCORD_TOKEN);