const path = require('path');
const { compose } = require('react-app-rewired');
const rewireSass = require('./webpack/sass');

module.exports = function override(config, env) {
  const rewireBabelLoader = require('react-app-rewire-babel-loader');

  config = rewireBabelLoader.include(config, path.resolve(__dirname, './node_modules/@lightspeed'));
  config = rewireSass(config, env);

  return config;
};
