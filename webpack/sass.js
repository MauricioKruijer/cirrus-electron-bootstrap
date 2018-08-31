const path = require('path');
const { getLoader, loaderNameMatches } = require('react-app-rewired');

const sassExtension = /\.scss$/;
const nodeModulesPath = path.resolve(__dirname, './../node_modules');

/**
 * Overwrites the current webpack config with the following:
 * - Adds a rule for .scss files to be parsed through sass-loader
 * - Excludes .scss from the file-loader
 */
module.exports = function rewireSass(config, env) {
  // Overwrite the file-loader config with the .scss extension
  const fileLoader = getLoader(config.module.rules, rule => {
    return loaderNameMatches(rule, 'file-loader') && rule.exclude;
  });
  fileLoader.exclude.push(sassExtension);

  // TODO: Check if production build still works
  // Create the .scss rule
  const sassRules = {
    test: /\.scss$/,
    use: [
      { loader: 'style-loader' },
      { loader: 'css-loader', options: { modules: true, localIdentName: '[local]' } },
      {
        loader: 'sass-loader',
        options: {
          includePaths: [nodeModulesPath, nodeModulesPath],
        },
      },
    ],
  };

  // Check if there is a oneOf rule
  const oneOfRule = config.module.rules.find(rule => rule.oneOf !== undefined);

  if (oneOfRule) {
    oneOfRule.oneOf.unshift(sassRules);
  } else {
    // Fallback to previous behaviour of adding to the end of the rules list.
    config.module.rules.push(sassRules);
  }

  return config;
};
