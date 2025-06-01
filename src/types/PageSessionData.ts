import { ActionRowBuilder, APIEmbed, MessageActionRowComponentBuilder } from "discord.js";

export interface BaseSession {
    timestamp: number;
}

export type PageSessionData<TResult, TMeta = unknown> = BaseSession & {
    results: TResult[];
    meta?: TMeta;
    userId: string
    page: number;
    renderPage: (session: PageSessionData<TResult, TMeta>, page: number) => {
        embeds: APIEmbed[]
        components: ActionRowBuilder<MessageActionRowComponentBuilder>[];
    };
};