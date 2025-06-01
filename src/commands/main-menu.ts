import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../types/Command.js'; // Adjust if your type is elsewhere
import { generateMainMenuEmbed } from '../embeds/menuEmbed';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('menu')
        .setDescription('Show main guide menu'),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({ embeds: [generateMainMenuEmbed()] });
    }
};

export default command;