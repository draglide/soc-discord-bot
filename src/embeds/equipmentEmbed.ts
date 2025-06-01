import { Trinket, Weapon } from "../types/data/Equipment";
import { PageSessionData } from "../types/PageSessionData";
import { generatePageEmbed } from "../utils/pagination/PageEmbed";

export function generateEquipmentEmbed(
    session: PageSessionData<Weapon | Trinket>,
    page: number,
) {
    return generatePageEmbed(session, page, {
        perPage: 1,
        generateTitleWithItem: (equipment) => `${equipment.name} (${equipment.rarity})`,
        renderField: (equipment) => [
            { name: "Type", value: equipment.type || "N/A", inline: true },
            { name: "Tier", value: `${"⭐".repeat(equipment.tier[page].level)}`, inline: true },
            { name: "Effect", value: equipment.tier[page]?.effect || "No effect description.", inline: false }
        ],
        renderLine: (equipment) => equipment.description || "No description available.",
        renderThumbnail: (equipment) => equipment.icon || null,
        generateFooter: (page, totalPages) => "Use buttons below to view other tiers.",
    });
}

export function generateEquipmentListEmbed(
    session: PageSessionData<Weapon | Trinket>,
    page: number,
) {
    return generatePageEmbed(session, page, {
        perPage: 10,
        generateTitle: (meta) => `Filtered Equipment - ${"⭐".repeat(5)} effect`,
        renderField: (equipment) => [
            {
                name: `• **${equipment.name}** (${equipment.rarity}, ${equipment.type})`,
                value: `${equipment.tier.find(t => t.level === 5)?.effect ?? "No level 5 effect available."}`,
                inline: false
            },
        ],
    });
}

export function generateEquipmentBuildEmbed(
    session: PageSessionData<Weapon | Trinket>,
    page: number,
) {
    return generatePageEmbed(session, page, {
        perPage: 1,
        generateTitleWithItem: (equipment) => `${equipment.name} (${equipment.rarity})`,
        renderField: (equipment) => [
            { name: "Type", value: equipment.type || "N/A", inline: true },
            { name: "Tier", value: `${"⭐".repeat(5)}`, inline: true },
            { name: "Effect", value: equipment.tier.find(t => t.level === 5)?.effect || "No effect description.", inline: false }
        ],
        renderLine: (equipment) => equipment.description || "No description available.",
        renderThumbnail: (equipment) => equipment.icon || null,
        generateFooter: (page, totalPages) => "Use buttons below to view other builds.",
    });
}