import { ApplicationCommandOptionChoiceData, SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../types/Command";
import { Rarity } from "../types/data/Equipment";
import { trinketStore, weaponStore } from "../data/store";
import { generateEquipmentEmbed, generateEquipmentListEmbed } from "../embeds/equipmentEmbed";
import { PageSessionData } from "../types/PageSessionData";
import { autoClosePaginatedButtons } from "../utils/interaction/autoCloseButton";
import { paginationSessionMap } from "../utils/pagination/paginationMap";

const rarityChoices: ApplicationCommandOptionChoiceData<string>[] = Object.values(Rarity).map(type => ({
    name: type,   // Displayed label in Discord
    value: type   // Actual value passed to your command
}));

const command: Command = {
    data: new SlashCommandBuilder()
        .setName("trinket")
        .setDescription("Show list or details about trinket.")
        .addStringOption(option =>
            option.setName("name")
                .setDescription("Show exact trinket by name")
                .setRequired(false)
                .setAutocomplete(true)
        )
        .addStringOption(option =>
            option.setName("rarity")
                .setDescription("Filter by trinket rarity")
                .addChoices(...rarityChoices)
                .setRequired(false)
        ) as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: false });

        const name = interaction.options.getString("name");
        const rarity = interaction.options.getString("rarity");

        let filteredTrinkets = trinketStore;

        if (name) filteredTrinkets = filteredTrinkets.filter(w => w.name.toLowerCase() === name.toLowerCase());
        else filteredTrinkets = filteredTrinkets.filter(w => !rarity || w.rarity === rarity);

        if (filteredTrinkets.length === 0) {
            await interaction.editReply("❌ No trinket found for the given filters.");
            return;
        }

        if (filteredTrinkets.length === 1) {
            const trinket: typeof trinketStore = [];

            for (const t of filteredTrinkets[0].tier) trinket.push({ ...filteredTrinkets[0] })

            const session: PageSessionData<typeof weaponStore[number] | typeof trinketStore[number]> = {
                timestamp: Date.now(),
                results: trinket,
                userId: interaction.user.id,
                page: 0,
                renderPage: (session, page) => generateEquipmentEmbed(session, page)
            };

            paginationSessionMap.set(interaction.id, session);

            const message = await interaction.editReply(generateEquipmentEmbed(session, 0));

            autoClosePaginatedButtons(message, 120000)
            return;
        }

        const session: PageSessionData<typeof weaponStore[number] | typeof trinketStore[number]> = {
            timestamp: Date.now(),
            results: filteredTrinkets,
            userId: interaction.user.id,
            page: 0,
            renderPage: (session, page) => generateEquipmentListEmbed(session, page)
        };

        paginationSessionMap.set(interaction.id, session);

        const message = await interaction.editReply(generateEquipmentListEmbed(session, 0));

        autoClosePaginatedButtons(message, 120000);
    },

    autocomplete: async (interaction) => {
        const focusedOption = interaction.options.getFocused(true);
        const value = focusedOption.value.toLowerCase();

        // Helper to enforce 25-character limit
        const truncate = (s: string, max = 25) => s.length > max ? s.slice(0, max - 1) + "…" : s;

        if (focusedOption.name === "name") {
            const suggestions = trinketStore.map(trinket => trinket.name)
                .filter(name => name.toLowerCase().includes(value))
                .slice(0, 25); // Discord allows max 25 suggestions

            await interaction.respond(
                suggestions.map(name => ({ name: truncate(name), value: name }))
            );
        } else {
            await interaction.respond([]);
        }
    }
}

export default command;