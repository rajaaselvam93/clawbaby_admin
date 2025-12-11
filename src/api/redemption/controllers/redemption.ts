"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::redemption.redemption",
  ({ strapi }) => ({
    async find(ctx) {
      const locale = ctx.query.locale || "en";

      // ---- PAGINATION ----
      const page = parseInt(ctx.query.pagination?.page, 10) || 1;
      const pageSize = parseInt(ctx.query.pagination?.pageSize, 10) || 10;
      const start = (page - 1) * pageSize;
      const limit = pageSize;

      // ---- FILTERS ----
      const filters = ctx.query.filters || {};

      // ---- FETCH PAGINATED RESULTS ----
      const entries = await strapi.entityService.findMany(
        "api::redemption.redemption",
        {
          locale,
          filters,
          populate: {
            Images: true,
            Category: true,
          },
          start,
          limit,
        }
      );

      // ---- GET TOTAL COUNT ----
      const total = await strapi.entityService.count(
        "api::redemption.redemption",
        { filters }
      );

      // ---- HELPER: convert rich text blocks to plain text ----
      const convertRichTextToPlain = (blocks) => {
        if (!Array.isArray(blocks)) return "";
        return blocks
          .map((block) => {
            if (!block.children) return "";
            return block.children.map((child) => child.text || "").join("");
          })
          .join("\n");
      };

      // ---- CLEAN DATA ----
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

      // ---- META PAGINATION ----
      const pageCount = Math.ceil(total / pageSize);

      return {
        data: cleanData,
        meta: {
          pagination: {
            page,
            pageSize,
            pageCount,
            total,
          },
        },
      };
    },
  })
);
