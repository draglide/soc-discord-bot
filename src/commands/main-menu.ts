import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../types/Command.js'; // Adjust if your type is elsewhere

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('menu')
        .setDescription('Show main guide menu'),

    async execute(interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder()
            .setTitle('📘 Guide Menu')
            .setDescription([
                '**1. General Guide** – `/guide topic:general`',
                '**2. Character Guide** – `/character name:[Acambe]`',
                '**3. Item Guide** – `/item name:[Sword]`',
                '**4. List Commands** – `/help` or `/menu` again',
            ].join('\n'))
            .setColor(0x00AE86)
            .setFooter({ text: 'Use the slash commands to explore guides.' });

        await interaction.reply({ embeds: [embed] });
    }
};

export default command;