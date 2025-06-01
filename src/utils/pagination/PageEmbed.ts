import { ActionRowBuilder, APIEmbed, APIEmbedField, ButtonBuilder, ButtonStyle } from "discord.js";
import { PageSessionData } from "../../types/PageSessionData";
import { buildPaginatedEmbed } from "../../embeds/pageEmbed";

export function generatePageEmbed<T, TMeta = unknown>(
    session: PageSessionData<T, TMeta>,
    page: number,
    options: {
        perPage?: number;
        generateTitle?: (meta: TMeta) => string;
        generateTitleWithItem?: (item: T) => string;
        renderLine?: (item: T, index: number) => string;
        renderField?: (item: T, index: number) => APIEmbedField[]
        renderFields?: (items: T[]) => APIEmbedField[];
        renderThumbnail?: (item: T) => string | null;
        renderImage?: (item: T) => string | null;
        generateFooter?: (page: number, totalPages: number) => string;
    }
): { embeds: [APIEmbed], components: ActionRowBuilder<ButtonBuilder>[] } {
    const { results, meta } = session;
    const perPage = options.perPage ?? 10;

    const start = page * perPage;
    const end = start + perPage;
    const paginatedItems = results.slice(start, end);
    let title = "";
    if (options.generateTitle) title = options.generateTitle(meta!);
    else if (options.generateTitleWithItem) title = options.generateTitleWithItem(paginatedItems[0]);

    let lines: string[] | undefined;
    let fields: APIEmbedField[] | undefined;
    let thumbnail: string | undefined;
    let image: string | undefined;

    if (options.renderField) fields = paginatedItems.flatMap((item, idx) => options.renderField!(item, idx));
    else if (options.renderFields) fields = options.renderFields(paginatedItems);
    if (options.renderLine) lines = paginatedItems.map(options.renderLine);
    if (options.renderThumbnail) thumbnail = options.renderThumbnail(paginatedItems[0]) ?? undefined;
    if (options.renderImage) image = options.renderImage(paginatedItems[0]) ?? undefined;

    const footer = options.generateFooter ? options.generateFooter(page, Math.ceil(results.length / perPage)) : undefined;

    const embed = buildPaginatedEmbed({
        title,
        lines,
        fields,
        start,
        end,
        total: results.length,
        thumbnail,
        image,
        footer
    });

    const components = [];

    if (results.length > perPage) {
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId(`prev_page`)
                .setEmoji("⬅️")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(page === 0),
            new ButtonBuilder()
                .setCustomId(`next_page`)
                .setEmoji("➡️")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(end >= results.length),
            new ButtonBuilder()
                .setCustomId(`close_button`)
                .setEmoji("❌")
                .setStyle(ButtonStyle.Secondary)
        );
        components.push(row);
    }

    return { embeds: [embed], components: components };
}