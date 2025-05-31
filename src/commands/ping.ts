import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../types/Command.js'; // Adjust the path as needed

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),

    async execute(interaction) {
        const sent = await interaction.reply({ content: '🏓 Pinging...', fetchReply: true });
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        await interaction.editReply(`🏓 Pong! (Latency: ${latency}ms, API Ping: ${interaction.client.ws.ping}ms)`);
    }
};

export default command;