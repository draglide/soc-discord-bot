import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../types/Command";
import { buildStore, tarotStore, trinketStore, weaponStore } from "../data/store";
import { convertRawBuild } from "../utils/characterBuildConverter";
import { generateCharacterEmbed } from "../embeds/characterEmbed";
import { PageSessionData } from "../types/PageSessionData";
import { generateEquipmentBuildEmbed } from "../embeds/equipmentEmbed";
import { paginationSessionMap } from "../utils/pagination/paginationMap";
import { autoClosePaginatedButtons } from "../utils/interaction/autoCloseButton";
import { generateTarotBuildEmbed } from "../embeds/tarotEmbed";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('guide')
        .setDescription('Show build guide for specific character')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Search by character name')
                .setRequired(true)
                .setAutocomplete(true),
        ) as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        const name = interaction.options.getString('name');

        if (name) {
            const character = buildStore.find(t => t.character === name);
            if (!character) {
                await interaction.reply({ content: `❌ Character with name \`${name}\` not found.`, ephemeral: true, });
                return;
            }

            const build = convertRawBuild(character);
            if (!build) {
                await interaction.reply({ content: `❌ No build found for character \`${name}\`.`, ephemeral: true });
                return;
            }

            await interaction.reply({ embeds: [generateCharacterEmbed(build.character)] });

            if (build.weapon?.length) {
                const session: PageSessionData<typeof weaponStore[number] | typeof trinketStore[number]> = {
                    timestamp: Date.now(),
                    results: build.weapon,
                    userId: interaction.user.id,
                    page: 0,
                    renderPage: (session, page) => generateEquipmentBuildEmbed(session, page)
                };

                paginationSessionMap.set(`${interaction.id}`, session);

                const message = await interaction.followUp(generateEquipmentBuildEmbed(session, 0));

                autoClosePaginatedButtons(message, 120000)

            }

            if (build.trinket?.length) {
                const session: PageSessionData<typeof weaponStore[number] | typeof trinketStore[number]> = {
                    timestamp: Date.now(),
                    results: build.trinket,
                    userId: interaction.user.id,
                    page: 0,
                    renderPage: (session, page) => generateEquipmentBuildEmbed(session, page)
                };

                paginationSessionMap.set(`${interaction.id}`, session);

                const message = await interaction.followUp(generateEquipmentBuildEmbed(session, 0));

                autoClosePaginatedButtons(message, 120000)

            }
            
            if (build.tarot?.length) {
                const session: PageSessionData<typeof tarotStore[number]> = {
                    timestamp: Date.now(),
                    results: build.tarot,
                    userId: interaction.user.id,
                    page: 0,
                    renderPage: (session, page) => generateTarotBuildEmbed(session, page)
                }

                paginationSessionMap.set(`${interaction.id}`, session);

                const message = await interaction.followUp(generateTarotBuildEmbed(session, 0));

                autoClosePaginatedButtons(message, 120000)
            }
        }
    },

    async autocomplete(interaction) {
        const focused = interaction.options.getFocused().toLowerCase();
        const suggestions = buildStore
            .filter(t => t.character && t.character.toLowerCase().includes(focused))
            .slice(0, 25)
            .map(t => ({ name: t.character, value: t.character }));

        await interaction.respond(suggestions);
    },
};

export default command;