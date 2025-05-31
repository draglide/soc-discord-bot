import { AutocompleteInteraction, Client } from "discord.js";

export async function handleAutocomplete(client: Client, interaction: AutocompleteInteraction) {
    const command = client.commands?.get(interaction.commandName);
    if (!command?.autocomplete) return;

    try {
        await command.autocomplete(interaction);
    } catch (err) {
        console.error(err);
    }
}