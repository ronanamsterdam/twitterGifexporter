/**
 * Config
 */
require('dotenv').config();

/**
 * Detect env
 */

const env = process.env.PAYCO_ENV || 'dev';

/**
 * Set correct config
 */

const config = require(`./${env}`);

/**
 * Helpers
 */
config.env      = env;
config.prod     = env === 'prod';
config.dev      = env === 'dev';
config.test     = env === 'test';

config.secrets = {
    session:            process.env.SESSION_SECRET              || 'local session',
    token:              process.env.TOKEN_SECRET                || 'local token',
};

config.chromePath = process.env.APP_CHROME_PATH || ""

config.expireTimes = {
    // in milliseconds
    token: process.env.TOKEN_EXPIRE_TIME || 7 * 24 * 60 * 60 * 1000,
};

/**
 * Expose
 */
exports = module.exports = config;
