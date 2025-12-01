// export default [
//   'strapi::logger',
//   'strapi::errors',
//   'strapi::security',
//   'strapi::cors',
//   'strapi::poweredBy',
//   'strapi::query',
//   'strapi::body',
//   'strapi::session',
//   'strapi::favicon',
//   'strapi::public',
// ];

// export default [
//   'strapi::logger',
//   // 'strapi::errors',
//   'strapi::security',
//   // 'strapi::cors',
//   'strapi::poweredBy',
//   // 'strapi::query',
//   // 'strapi::body',
//   'strapi::session',
//   // 'strapi::favicon',
//   // 'strapi::public',
// ];


module.exports = [
'strapi::errors',
{
    name: "strapi::security",
    config: {
     contentSecurityPolicy: {
        useDefaults: true,
        directives: {
         "connect-src": ["'self'", "https:"],
         "img-src": [
            "'self'",
            "data:",
            "blob:",
            "market-assets.strapi.io",
            "clawbaby-1373784094.cos.ap-shenzhen-fsi.myqcloud.com",

         ],
         "media-src": [
            "'self'",
            "data:",
            "blob:",
            "market-assets.strapi.io",
            // "clawbaby-1373784094",
            "clawbaby-1373784094.cos.ap-shenzhen-fsi.myqcloud.com",

         ],
         upgradeInsecureRequests: null,
        },
     },
    },
},
'strapi::cors',
'strapi::query',
'strapi::body',
'strapi::favicon',
'strapi::public',
];
