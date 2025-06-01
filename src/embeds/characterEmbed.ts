import { EmbedBuilder } from "discord.js";
import { Character } from "../types/data/Character";
import { PageSessionData } from "../types/PageSessionData";
import { generatePageEmbed } from "../utils/pagination/PageEmbed";

export function generateCharacterEmbed(character: Character): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle(`${character.name} ${character.rarity ? `(${character.rarity})` : ""}`)
        .addFields(
            {
                name: "Class",
                value: character.class?.icon
                    ? `${character.class.icon} ${character.class.name}`
                    : "N/A",
                inline: true,
            },
            {
                name: "Faction",
                value: Array.isArray(character.faction)
                    ? character.faction.map((f) => f.icon).join(" ")
                    : "N/A",
                inline: true,
            },
        )
        .setThumbnail(character.pixelArt || null)
        .setImage(character.mainArt || null);
}

export function generateCharacterListByClassEmbed(
    session: PageSessionData<Character, { query: string }>,
    page: number,
) {
    return generatePageEmbed(session, page, {
        perPage: 10,
        generateTitle: (meta) => `📘 Characters in Class: ${meta.query}`,
        renderFields: (paginatedResult) => [
            {
                name: "Characters",
                value: paginatedResult.map(character => `• **${character.name}** - ${Array.isArray(character.faction)
                    ? character.faction.map((f) => f.icon).join(" ")
                    : "No data"
                    }`).join("\n"),
                inline: true,
            }
        ],
    })
}

export function generateCharacterListByFactionEmbed(
    session: PageSessionData<Character, { query: string }>,
    page: number,
) {
    return generatePageEmbed(session, page, {
        perPage: 10,
        generateTitle: (meta) => `📙 Characters in Faction: ${meta.query}`,
        renderFields: (paginatedResult) => [
            {
                name: "Characters",
                value: paginatedResult.map(character => `• **${character.name}** - ${character.class?.icon || "No data"}`).join("\n"),
                inline: true,
            }
        ],
    })
}