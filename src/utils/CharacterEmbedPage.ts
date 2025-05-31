import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Character } from "../types/data/Character";
import { PageSessionData } from "../types/PageSessionData";

type CharacterMeta = {
    type: "class" | "faction";
    query: string;
};

export const paginationSessionMap = new Map<string, PageSessionData<Character, CharacterMeta>>();

export function generateSummaryEmbedPage(
    session: PageSessionData<Character, CharacterMeta>,
    page: number,
) {
    const { results: matchedCharacters, meta } = session;
    const { type, query } = meta || { type: "class", query: "" };

    const perPage = 10;
    const start = page * perPage;
    const end = start + perPage;
    const slice = matchedCharacters.slice(start, end);

    const lines: string[] = slice.map((char) => {
        const extra =
            type === "class"
                ? Array.isArray(char.faction)
                    ? char.faction.map((f) => f.icon).join(" ")
                    : "N/A"
                : char.class?.icon || "N/A";
        return `• **${char.name}** - ${extra}`;
    });

    const embed = new EmbedBuilder()
        .setColor(0x2f3136)
        .setTitle(
            type === "class"
                ? `📘 Characters in Class: ${query}`
                : `📙 Characters in Faction: ${query}`,
        )
        .addFields({
            name: "Characters",
            value: lines.join("\n") || "No data",
        })
        .setFooter({
            text:
                matchedCharacters.length > end
                    ? `Showing ${start + 1}–${end} of ${matchedCharacters.length} results`
                    : `${matchedCharacters.length} result(s) found`,
        });

    const components = [];

    if (matchedCharacters.length > perPage) {
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId(`prev_page_${Math.max(0, page - 1)}`)
                .setLabel("Previous")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(page === 0),
            new ButtonBuilder()
                .setCustomId(`next_page_${page + 1}`)
                .setLabel("Next")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(end >= matchedCharacters.length),
        );
        components.push(row);
    }

    return { embeds: [embed], components };
}