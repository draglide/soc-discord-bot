import { ChatInputCommandInteraction, Client } from "discord.js";

export async function handleCommands(client: Client, interaction: ChatInputCommandInteraction) {
    const command = client.commands?.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (err) {
        console.error(err);
        await interaction.reply({ content: '⚠️ There was an error executing that command.', ephemeral: true });
    }
}