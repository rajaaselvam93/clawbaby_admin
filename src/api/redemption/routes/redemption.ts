/**
 * redemption router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::redemption.redemption');

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/redemptions-items",
      handler: "redemption.find",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
