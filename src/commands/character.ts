import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    AutocompleteInteraction,
} from 'discord.js';
import { Command } from '../types/Command.js';
import { characterStore } from '../data/store';
import { generateCharacterEmbed, generateCharacterListByClassEmbed, generateCharacterListByFactionEmbed } from '../embeds/characterEmbed';
import { paginationSessionMap } from '../utils/pagination/paginationMap';
import { PageSessionData } from '../types/PageSessionData';
import { autoClosePaginatedButtons } from '../utils/interaction/autoCloseButton';

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

        const characters = characterStore;

        const type = interaction.options.getString("type", true);
        const query = interaction.options.getString("query", true).toLowerCase();

        let matchedCharacters = characters;

        switch (type) {
            case "name":
                matchedCharacters = characters.filter((c) => c.name.toLowerCase().includes(query));
                break;
            case "class":
                matchedCharacters = characters.filter((c) => (c.class?.name || "").toLowerCase() === query);
                break
            case "faction":
                matchedCharacters = characters.filter((c) => (c.faction || []).some((f) => f.name.toLowerCase() === query));
                break
            default:
                await interaction.editReply({ content: "❌ Invalid type provided." });
                return;
        }

        if (matchedCharacters.length === 0) {
            await interaction.editReply({ content: "❌ No characters found for your query." });
            return;
        }

        if (type === "name") {
            await interaction.editReply({ embeds: [generateCharacterEmbed(matchedCharacters[0])] });
            return
        }
        const generator = type === "class" ? generateCharacterListByClassEmbed : generateCharacterListByFactionEmbed;
        const session: PageSessionData<typeof characterStore[number], { query: string }> = {
            timestamp: Date.now(),
            results: matchedCharacters,
            userId: interaction.user.id,
            page: 0,
            meta: { query },
            renderPage: (session, page) => generator(session, page)
        }

        paginationSessionMap.set(interaction.id, session);

        const message = await interaction.editReply(generator(session, 0));

        autoClosePaginatedButtons(message, 60000); // Auto-close after 60 seconds
    },

    async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
        const characters = characterStore;
        const type = interaction.options.getString('type');
        const focused = interaction.options.getFocused();

        let suggestions: string[] = [];

        switch (type) {
            case 'name':
                suggestions = characters.map(c => c.name);
                break;
            case 'class':
                suggestions = unique(characters.map(c => c.class?.name).filter((cls): cls is string => !!cls));
                break;
            case 'faction':
                suggestions = unique(characters.flatMap(c => {
                    const factionsArray = Array.isArray(c.faction) ? c.faction : [c.faction];
                    return factionsArray.map(f => f?.name).filter(Boolean);
                }));
                break;
            default:
                suggestions = [];
        }

        const filtered = suggestions
            .filter(s => s.toLowerCase().includes(focused.toLowerCase()))
            .slice(0, 25);

        await interaction.respond(filtered.map(name => ({ name, value: name })));
    },
};

export default command;