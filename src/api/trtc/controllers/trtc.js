"use strict";

const TLSSigAPIv2 = require("tls-sig-api-v2");

module.exports = {
  async getSig(ctx) {
    try {
      const { userId } = ctx.query;

      if (!userId) {
        return ctx.badRequest("Missing userId");
      }

      // Put these into .env
      const SDKAPPID = process.env.TRTC_SDK_APP_ID;
      const SECRETKEY = process.env.TRTC_SECRET_KEY;

      const api = new TLSSigAPIv2.Api(SDKAPPID, SECRETKEY);
      const userSig = api.genUserSig(userId, 86400); // valid 1 day

      return {
        sdkAppId: SDKAPPID,
        userId,
        userSig,
      };

    } catch (err) {
      ctx.send({ error: err.message }, 500);
    }
  },
};
