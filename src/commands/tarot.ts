import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../types/Command";
import { tarotStore } from "../data/store";
import { generateTarotEmbed, generateTarotListEmbed } from "../embeds/tarotEmbed";
import { PageSessionData } from "../types/PageSessionData";
import { paginationSessionMap } from "../utils/pagination/paginationMap";
import { autoClosePaginatedButtons } from "../utils/interaction/autoCloseButton";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('tarot')
        .setDescription('Show details about a tarot card')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Tarot name')
                .setRequired(false)
                .setAutocomplete(true),
        ) as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        const name = interaction.options.getString('name');

        if (name) {
            const tarot = tarotStore.find(t => t.name === name);
            if (!tarot) {
                await interaction.reply({ content: `❌ Tarot \`${name}\` not found.`, ephemeral: true, });
                return;
            }

            await interaction.reply({ embeds: [generateTarotEmbed(tarot)] });
            return;
        }

        await interaction.deferReply();

        const session: PageSessionData<typeof tarotStore[number]> = {
            timestamp: Date.now(),
            results: tarotStore,
            userId: interaction.user.id,
            page: 0,
            renderPage: (session, page) => generateTarotListEmbed(session, page)
        };

        paginationSessionMap.set(interaction.id, session);

        const message = await interaction.editReply(generateTarotListEmbed(session, 0));

        autoClosePaginatedButtons(message, 30000); // Auto-close after 30 seconds
    },

    async autocomplete(interaction) {
        const focused = interaction.options.getFocused().toLowerCase();
        const suggestions = tarotStore
            .filter(t => t.name && t.name.toLowerCase().includes(focused))
            .slice(0, 25)
            .map(t => ({ name: t.name, value: t.name }));

        await interaction.respond(suggestions);
    },
};

export default command;