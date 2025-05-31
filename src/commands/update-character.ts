import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { fetchGameData } from '../data/sheet-reader';
import fs from 'fs';
import path from 'path';
import { Command } from '../types/Command';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Fetches latest character data from Google Sheets and updates local JSON cache'),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply({ ephemeral: true });

        try {
            const characters = await fetchGameData();

            const outputPath = path.resolve(__dirname, '../data/characters.json');
            fs.writeFileSync(outputPath, JSON.stringify(characters, null, 2));

            await interaction.editReply(
                `✅ Character data updated successfully.\nSaved ${characters.length} entries to \`characters.json\`.`
            );
        } catch (error: any) {
            console.error('❌ Failed to update characters:', error);
            await interaction.editReply('❌ Failed to update character data. Check logs for details.');
        }
    },
};

export default command;