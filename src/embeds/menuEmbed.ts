import { EmbedBuilder } from "discord.js";

export function generateMainMenuEmbed(): EmbedBuilder {
    return new EmbedBuilder().setTitle('📘 Guide Menu')
        .setDescription([
            '**1. General Guide** – `/guide topic:general`',
            '**2. Character Guide** – `/character name:[Acambe]`',
            '**3. Weapon & Trinket Guide** – `/weapon OR /trinket name:[Dawnlight] OR type:[Sword] rarity:[Epic]`',
            '**4. Tarot Guide** – `/tarot name:[The Fool]`',
            '**5. List Commands** – `/help` or `/menu` again',
        ].join('\n'))
        .setColor(0x00AE86)
        .setFooter({ text: 'Use the slash commands to explore guides.' });
}