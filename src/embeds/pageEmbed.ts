import { APIEmbed, EmbedBuilder } from "discord.js";
import { EmbedPaginationInfo } from "../types/embed";

export function buildPaginatedEmbed(
    meta: EmbedPaginationInfo
): APIEmbed {
    const { title, fields, lines, start, end, total, color, footer, thumbnail, image } = meta;
    const embed = new EmbedBuilder().setColor(color || 0x00AE86).setTitle(title);

    if (lines) embed.setDescription(lines.join('\n'));
    if (fields && fields.length > 0) embed.addFields(fields);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (image) embed.setImage(image);
    embed.setFooter({
        text: footer || (total > end
            ? `Showing ${start + 1}–${end} of ${total} results`
            : `${total} result(s) found`),
    });

    return embed.toJSON();
}