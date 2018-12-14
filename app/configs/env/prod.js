/**
 * Prod
 */

module.exports = {
    port: process.env.PORT || 3000,
    // MongoDB connection options
    clientOrigin: process.env.PYC_PROD_ORIGIN || "https://app.stellanova.tgraph.us"
};

