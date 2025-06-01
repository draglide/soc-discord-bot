import { APIEmbedField } from "discord.js";

export interface EmbedPaginationInfo {
    title: string;
    fields?: APIEmbedField[]
    lines?: string[];
    start: number;
    end: number;
    total: number;
    color?: number;
    footer?: string;
    thumbnail?: string;
    image?: string;
}