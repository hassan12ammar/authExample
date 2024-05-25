export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,

    accesSecret: process.env.ACCESS_SECRET,
    refreshSecret: process.env.REFRESH_SECRET,
  });
