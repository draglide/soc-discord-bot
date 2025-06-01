import { EmbedBuilder } from "discord.js";
import { Tarot } from "../types/data/Tarot";
import { PageSessionData } from "../types/PageSessionData";
import { generatePageEmbed } from "../utils/pagination/PageEmbed";

export function generateTarotEmbed(tarot: Tarot): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle(tarot.name)
        .setThumbnail(tarot.icon)
        .addFields(
            { name: 'Effect', value: tarot.effect || '-', inline: false },
            { name: '4th Slot Special Effect', value: tarot.lastSlotEffect || '-', inline: false },
        )
        .setColor(0x9146ff);
}

export function generateTarotListEmbed(
    session: PageSessionData<Tarot>,
    page: number,
) {
    return generatePageEmbed(session, page, {
        perPage: 10,
        generateTitle: (meta) => `📜 Tarot List`,
        renderFields: (paginatedResult) => [
            {
                name: "Tarot",
                value: paginatedResult.map(tarot => `• **${tarot.name}**`).join("\n"),
                inline: true,
            }
        ],
    })
}

export function generateTarotBuildEmbed(
    session: PageSessionData<Tarot>,
    page: number,
) {
    return generatePageEmbed(session, page, {
        perPage: 1,
        generateTitleWithItem: (tarot) => tarot.name,
        renderThumbnail: (tarot) => tarot.icon,
        renderField: (tarot) => [
            { name: 'Effect', value: tarot.effect || '-', inline: false },
            { name: '4th Slot Special Effect', value: tarot.lastSlotEffect || '-', inline: false },
        ],
        generateFooter: (page, totalPages) => "Use buttons below to view other builds.",
    })
}