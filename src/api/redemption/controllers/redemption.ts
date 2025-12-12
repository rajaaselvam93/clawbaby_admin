"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::redemption.redemption", ({ strapi }) => ({
  async find(ctx) {
    const locale = ctx.query.locale || "en";
    const filters = ctx.query.filters || {};
    const pagination = ctx.query.pagination || {};

    // Detect if unlimited mode is requested
    const isUnlimited =
      pagination.limit === "-1" ||
      pagination.limit === -1;

    let start = 0;
    let limit = null;
    let page = 1;
    let pageSize = 10;

    if (isUnlimited) {
      // Unlimited mode -> fetch all
      limit = -1;
    } else {
      // Normal pagination mode
      page = parseInt(pagination.page, 10) || 1;
      pageSize = parseInt(pagination.pageSize, 10) || 10;

      start = (page - 1) * pageSize;
      limit = pageSize;
    }

    // Fetch entries
    const entries = await strapi.entityService.findMany("api::redemption.redemption", {
      locale,
      filters,
      populate: {
        Images: true,
        Category: true,
      },
      start: isUnlimited ? undefined : start,
      limit: isUnlimited ? -1 : limit,
    });

    // Count total for pagination metadata
    const total = await strapi.entityService.count("api::redemption.redemption", { filters });

    // Convert rich text to plain text
    const convertRichTextToPlain = (blocks) => {
      if (!Array.isArray(blocks)) return "";
      return blocks.map((block) =>
        block.children
          ? block.children.map((child) => child.text || "").join("")
          : ""
      ).join("\n");
    };

    // Format clean output
    const cleanData = entries.map((item) => ({
      id: item.id,
      Title: item.Title,
      subtitle: item.Subtitle,
      description: convertRichTextToPlain(item.Description),
      Coins: item.Coins,
      Status: item.RedemptionStatus,
      Category: item.Category?.Name || "",
      images: item.Images?.map((img) => ({
        id: img.id,
        url: img.url,
      })) || [],
    }));

    // Pagination meta only for paginated requests
    let paginationMeta = null;

    if (!isUnlimited) {
      paginationMeta = {
        page,
        pageSize,
        pageCount: Math.ceil(total / pageSize),
        total,
      };
    }

    return {
      data: cleanData,
      meta: {
        pagination: paginationMeta,
      },
    };
  },
}));

