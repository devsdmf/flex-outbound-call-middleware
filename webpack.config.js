const DotEnv = require('dotenv-webpack');

module.exports = (config, { isProd, isDev, isTest }) => {
  /**
   * Customize the webpack by modifying the config object.
   * Consult https://webpack.js.org/configuration for more information
   */

  config.plugins.push(
    new DotEnv({
      prefix: 'FLEX_APP_'
    })
  );

  return config;
}
