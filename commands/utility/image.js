const { SlashCommandBuilder } = require('discord.js');
const OpenAI = require('openai');
require('dotenv').config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('image')
        .setDescription('Replies with image from DALL·E 3')
        .addStringOption(option => option.setName('prompt').setDescription('Prompts for generate image').setRequired(true)),
    async execute(interaction) {
        const prompt = interaction.options.getString('prompt');
        await interaction.deferReply({ content: `Got '${prompt}'` });
        const response = await client.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024", // When using DALL·E 3, images can have a size of 1024x1024, 1024x1792 or 1792x1024 pixels.
            // quality: "hd" // When using DALL·E 3 you can set quality: "hd" for enhanced detail. Square, standard quality images are the fastest to generate.
        });
        await interaction.editReply({ embeds: [{ title: `Your ${prompt}`, image: { url: response.data[0].url } }] });
    },
};