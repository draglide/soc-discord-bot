import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { fetchGameData } from '../data/sheet-reader';
import fs from 'fs';
import path from 'path';
import { Command } from '../types/Command';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Fetches latest game data from Google Sheets and updates local JSON cache'),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply({ ephemeral: true });

        try {
            const { characters, weapons, trinkets, tarots } = await fetchGameData();

            const baseDir = path.resolve(__dirname, '../data');
            fs.writeFileSync(path.join(baseDir, 'characters.json'), JSON.stringify(characters, null, 2));
            fs.writeFileSync(path.join(baseDir, 'weapons.json'), JSON.stringify(weapons, null, 2));
            fs.writeFileSync(path.join(baseDir, 'trinkets.json'), JSON.stringify(trinkets, null, 2));
            fs.writeFileSync(path.join(baseDir, 'tarots.json'), JSON.stringify(tarots, null, 2));

            await interaction.editReply(`✅ All game data updated successfully:
- Characters: ${characters.length}
- Weapons: ${weapons.length}
- Trinkets: ${trinkets.length}
- Tarots: ${tarots.length}`);
        } catch (error: any) {
            console.error('❌ Failed to update game data:', error);
            await interaction.editReply('❌ Failed to update game data. Check logs for details.');
        }
    },
};

export default command;