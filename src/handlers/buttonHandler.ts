import { ButtonInteraction } from "discord.js";
import { paginationSessionMap } from "../utils/pagination/paginationMap";

export async function handleButtons(interaction: ButtonInteraction) {
    const customId = interaction.customId;
    const originalInteractionId = interaction.message.interaction?.id;

    if (!originalInteractionId) {
        return await interaction.reply({ content: "Session expired.", ephemeral: true });
    }

    const session = paginationSessionMap.get(originalInteractionId);
    if (!session) {
        return await interaction.reply({ content: "Session expired or not found.", ephemeral: true });
    }

    if (interaction.user.id !== session.userId) {
        return await interaction.reply({ content: "You are not allowed to use this button.", ephemeral: true });
    }

    switch (customId) {
        case "prev_page":
            session.page--;
            return interaction.update(session.renderPage(session, session.page));
        case "next_page":
            session.page++;
            return interaction.update(session.renderPage(session, session.page));
        case "close_button":
            paginationSessionMap.delete(originalInteractionId);
            const noButtonsPage = session.renderPage(session, session.page);
            noButtonsPage.components = [];
            return interaction.update(noButtonsPage);
        default:
            return;
    }
}