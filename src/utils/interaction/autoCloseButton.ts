import { Message } from "discord.js";

export async function autoClosePaginatedButtons(
    message: Message,
    timeout: number = 30000, // Default timeout of 30 seconds
) {
    setTimeout(async () => {
        if (!message || !message.editable) return;
        try {
            await message.edit({ components: [] });
        } catch (error) {
            console.error("Error while auto-closing paginated buttons:", error);
        }
    }, timeout);
}