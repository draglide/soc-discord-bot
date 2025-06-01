import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { fetchGameData } from '../data/sheet-reader';
import fs from 'fs';
import path from 'path';
import { Command } from '../types/Command';
import { buildStore, characterStore, tarotStore, trinketStore, weaponStore } from '../data/store';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Fetches latest game data from Google Sheets and updates local JSON cache'),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply({ ephemeral: true });

        try {
            const { characters, weapons, trinkets, tarots, builds } = await fetchGameData();

            const baseDir = path.resolve(__dirname, '../data');
            fs.writeFileSync(path.join(baseDir, 'characters.json'), JSON.stringify(characters, null, 2));
            fs.writeFileSync(path.join(baseDir, 'weapons.json'), JSON.stringify(weapons, null, 2));
            fs.writeFileSync(path.join(baseDir, 'trinkets.json'), JSON.stringify(trinkets, null, 2));
            fs.writeFileSync(path.join(baseDir, 'tarots.json'), JSON.stringify(tarots, null, 2));
            fs.writeFileSync(path.join(baseDir, 'builds.json'), JSON.stringify(builds, null, 2));

            characterStore.length = 0;
            characterStore.push(...characters);

            weaponStore.length = 0;
            weaponStore.push(...weapons);

            trinketStore.length = 0;
            trinketStore.push(...trinkets);

            tarotStore.length = 0;
            tarotStore.push(...tarots);

            buildStore.length = 0;
            buildStore.push(...builds);

            await interaction.editReply(`✅ All game data updated successfully:
- Characters: ${characters.length}
- Weapons: ${weapons.length}
- Trinkets: ${trinkets.length}
- Tarots: ${tarots.length}
- Builds: ${builds.length}`);
        } catch (error: any) {
            console.error('❌ Failed to update game data:', error);
            await interaction.editReply('❌ Failed to update game data. Check logs for details.');
        }
    },
};

export default command;