require('ts-node/register');

// const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// module.exports = wrapWithReanimatedMetroConfig(config);
module.exports = config;
