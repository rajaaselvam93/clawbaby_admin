"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::redemption.redemption", ({ strapi }) => ({
  async find(ctx) {
    const locale = ctx.query.locale || "en";

    // 🔥 Extract and pass filters from the query
    const { filters } = ctx.query;

    const entries = await strapi.entityService.findMany(
      "api::redemption.redemption",
      {
        locale,
        filters,   // <-- VERY IMPORTANT
        populate: {
          Images: true,
          Category: true,
        },
      }
    );

    // Convert rich text blocks -> plain text
    const convertRichTextToPlain = (blocks) => {
      if (!Array.isArray(blocks)) return "";
      return blocks
        .map((block) => {
          if (!block.children) return "";
          return block.children.map((child) => child.text || "").join("");
        })
        .join("\n");
    };

    const cleanData = entries.map((item) => ({
      id: item.id,
      Title: item.Title,
      subtitle: item.Subtitle,
      description: convertRichTextToPlain(item.Description),
      Coins: item.Coins,
      Status: item.RedemptionStatus,
      Category: item.Category?.Name || "",
      images: item.Images
        ? item.Images.map((img) => ({
            id: img.id,
            url: img.url,
          }))
        : [],
    }));

    return { data: cleanData };
  },
}));
