module.exports = ({ env }) => ({

  upload: {
    config: {
      provider: "strapi-provider-upload-tencent-cloud-storage",
      providerOptions: {
        SecretId: env("TENCENT_SECRET_ID"),
        SecretKey: env("TENCENT_SECRET_KEY"),
        Region: env("TENCENT_REGION"),
        Bucket: env("TENCENT_BUCKET"),
        ACL: "private", // <= set ACL to private
      },
    },
  },
  i18n: {
    enabled: true,
    config: {
      locales: [
        'en',  // English
        'zh',  // Chinese
        'hi',  // Hindi
        'vi',  // Vietnamese
        ],
      defaultLocale: 'en',
    },
  },
  
});