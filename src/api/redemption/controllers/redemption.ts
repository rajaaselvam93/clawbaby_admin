"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::redemption.redemption", ({ strapi }) => ({
  async find(ctx) {

    const locale = ctx.query.locale || 'en';
    // Manually fetch with populate
    const entries = await strapi.entityService.findMany(
      "api::redemption.redemption",
      {
         locale, 
        populate: {
          Images: true,
          Category: true,
        },
      }
    );

    // Format output
    const cleanData = entries.map((item) => {
      return {
        id: item.id,
        Title: item.Title,
        subtitle: item.Subtitle,
        description: item.Description,
        Coins: item.Coins,
        Status: item.RedemptionStatus,
        Category: item.Category?.Name || "",
        images: item.Images
          ? item.Images.map((img) => ({
              id: img.id,
              url: img.url,
              formats: {
                small: img.formats?.small
                  ? { url: img.formats.small.url }
                  : null,
                thumbnail: img.formats?.thumbnail
                  ? { url: img.formats.thumbnail.url }
                  : null,
              },
            }))
          : [],
      };
    });

    return { data: cleanData };
  },
}));
