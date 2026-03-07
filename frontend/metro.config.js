const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for @/ alias
config.resolver.alias = {
  '@': path.resolve(__dirname),
};

// Make sure Metro watches the right directories
config.watchFolders = [__dirname];

module.exports = config;