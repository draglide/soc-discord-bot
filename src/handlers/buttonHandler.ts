import { ButtonInteraction } from "discord.js";
import { generateSummaryEmbedPage, paginationSessionMap } from "../utils/CharacterEmbedPage";

export async function handleButtons(interaction: ButtonInteraction) {
    const match = interaction.customId.match(/^(prev|next)_page_(\d+)$/);
    if (!match) return;

    const [, , pageStr] = match;
    const newPage = parseInt(pageStr, 10);

    const originalInteractionId = interaction.message.interaction?.id;
    if (!originalInteractionId) {
        return await interaction.reply({ content: "Session expired.", ephemeral: true });
    }

    const session = paginationSessionMap.get(originalInteractionId);
    if (!session) {
        return await interaction.reply({ content: "Session expired or not found.", ephemeral: true });
    }

    const { embeds, components } = generateSummaryEmbedPage(session, newPage);
    await interaction.update({ embeds, components });
}