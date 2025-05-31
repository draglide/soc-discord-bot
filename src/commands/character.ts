import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    AutocompleteInteraction,
    EmbedBuilder,
} from 'discord.js';
import { Command } from '../types/Command.js';
import fs from 'fs';
import path from 'path';
import { Character } from '../types/data/Character.js';
import { generateSummaryEmbedPage, paginationSessionMap } from '../utils/CharacterEmbedPage';

const loadCharacters = (): Character[] => {
    const filePath = path.resolve(__dirname, '../data/characters.json');
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ File not found: ${filePath}`);
        return [];
    }

    try {
        const raw = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(raw) as Character[];
    } catch (err) {
        console.warn(`⚠️ Failed to load character data: ${err}`);
        return [];
    }
};

const unique = <T>(arr: T[]) => [...new Set(arr)];

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('character')
        .setDescription('Search character by name, class, or faction')
        .addStringOption(option =>
            option
                .setName('type')
                .setDescription('Search by...')
                .setRequired(true)
                .addChoices(
                    { name: 'Name', value: 'name' },
                    { name: 'Class', value: 'class' },
                    { name: 'Faction', value: 'faction' }
                )
        )
        .addStringOption(option =>
            option
                .setName('query')
                .setDescription('Search query')
                .setRequired(true)
                .setAutocomplete(true)
        ) as SlashCommandBuilder,
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply({ ephemeral: false });

        const characters = loadCharacters();

        const type = interaction.options.getString("type", true);
        const query = interaction.options.getString("query", true).toLowerCase();

        let matchedCharacters = characters;

        if (type === "name") {
            matchedCharacters = characters.filter((c) =>
                c.name.toLowerCase().includes(query),
            );
        } else if (type === "class") {
            matchedCharacters = characters.filter(
                (c) => (c.class?.name || "").toLowerCase() === query,
            );
        } else if (type === "faction") {
            matchedCharacters = characters.filter((c) =>
                (c.faction || []).some((f) => f.name.toLowerCase() === query),
            );
        }

        if (matchedCharacters.length === 0) {
            await interaction.editReply({
                content: "❌ No characters found for your query.",
            });
            return;
        }

        const trimToLength = (str: string, max: number) =>
            str.length > max ? str.slice(0, max - 3) + "..." : str;

        if (type === "name") {
            const topMatch = matchedCharacters[0];
            if (!topMatch) {
                await interaction.editReply({ content: "❌ No characters found." });
                return;
            }
            const embed = new EmbedBuilder()
                .setTitle(`${topMatch.name} ${topMatch.rarity ? `(${topMatch.rarity})` : ""}`)
                .addFields(
                    {
                        name: "Class",
                        value: topMatch.class?.icon
                            ? `${topMatch.class.icon} ${topMatch.class.name}`
                            : "N/A",
                        inline: true,
                    },
                    {
                        name: "Faction",
                        value: Array.isArray(topMatch.faction)
                            ? trimToLength(topMatch.faction.map((f) => f.icon).join(" "), 1024)
                            : "N/A",
                        inline: true,
                    },
                )
                .setThumbnail(topMatch.pixelArt || null)
                .setImage(topMatch.mainArt || null);
            await interaction.editReply({ embeds: [embed] });
        } else {
            if (type === "class" || type === "faction") {

                const session = {
                    timestamp: Date.now(),
                    results: matchedCharacters,
                    meta: {
                        type: type as "class" | "faction",
                        query,
                    },
                }

                paginationSessionMap.set(interaction.id, session);

                const { embeds, components } = generateSummaryEmbedPage(session, 0);
                await interaction.editReply({ embeds, components });

                return;
            }
        }
    },

    async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
        const characters = loadCharacters();
        const type = interaction.options.getString('type');
        const focused = interaction.options.getFocused();

        let suggestions: string[] = [];

        if (type === 'name') {
            suggestions = characters.map(c => c.name);
        } else if (type === 'class') {
            suggestions = unique(
                characters.map(c => c.class?.name).filter((cls): cls is string => !!cls)
            );
        } else if (type === 'faction') {
            suggestions = unique(
                characters
                    .flatMap(c => {
                        const factionsArray = Array.isArray(c.faction) ? c.faction : [c.faction];
                        return factionsArray.map(f => f?.name).filter(Boolean);
                    })
            );
        }

        const filtered = suggestions
            .filter(s => s.toLowerCase().includes(focused.toLowerCase()))
            .slice(0, 25);

        await interaction.respond(filtered.map(name => ({ name, value: name })));
    },
};

export default command;
