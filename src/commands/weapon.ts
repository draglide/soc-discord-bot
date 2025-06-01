import { ApplicationCommandOptionChoiceData, SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../types/Command";
import { Rarity, WeaponType } from "../types/data/Equipment";
import { trinketStore, weaponStore } from "../data/store";
import { generateEquipmentEmbed, generateEquipmentListEmbed } from "../embeds/equipmentEmbed";
import { PageSessionData } from "../types/PageSessionData";
import { autoClosePaginatedButtons } from "../utils/interaction/autoCloseButton";
import { paginationSessionMap } from "../utils/pagination/paginationMap";

const weaponTypeChoices: ApplicationCommandOptionChoiceData<string>[] = Object.values(WeaponType).map(type => ({
    name: type,   // Displayed label in Discord
    value: type   // Actual value passed to your command
}));

const rarityChoices: ApplicationCommandOptionChoiceData<string>[] = Object.values(Rarity).map(type => ({
    name: type,   // Displayed label in Discord
    value: type   // Actual value passed to your command
}));

const command: Command = {
    data: new SlashCommandBuilder()
        .setName("weapon")
        .setDescription("Show list or details about weapon.")
        .addStringOption(option =>
            option.setName("name")
                .setDescription("Show exact weapon by name")
                .setRequired(false)
                .setAutocomplete(true)
        )
        .addStringOption(option =>
            option.setName("type")
                .setDescription("Filter by weapon type")
                .addChoices(...weaponTypeChoices)
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("rarity")
                .setDescription("Filter by weapon rarity")
                .addChoices(...rarityChoices)
                .setRequired(false)
        ) as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: false });

        const name = interaction.options.getString("name");
        const type = interaction.options.getString("type");
        const rarity = interaction.options.getString("rarity");

        let filteredWeapons = weaponStore;

        if (name) filteredWeapons = filteredWeapons.filter(w => w.name.toLowerCase() === name.toLowerCase());
        else filteredWeapons = filteredWeapons.filter(w => (!type || w.type === type) && (!rarity || w.rarity === rarity));

        if (filteredWeapons.length === 0) {
            await interaction.editReply("❌ No weapons found for the given filters.");
            return;
        }

        if (filteredWeapons.length === 1) {
            const weapon: typeof weaponStore = [];

            for (const t of filteredWeapons[0].tier) weapon.push({ ...filteredWeapons[0] })

            const session: PageSessionData<typeof weaponStore[number] | typeof trinketStore[number]> = {
                timestamp: Date.now(),
                results: weapon,
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
            results: filteredWeapons,
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
            const suggestions = weaponStore.map(weapon => weapon.name)
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