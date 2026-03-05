const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix for Zustand v5 "import.meta" error on Expo Web
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'zustand' || moduleName.startsWith('zustand/')) {
    return {
      filePath: require.resolve(moduleName),
      type: 'sourceFile',
    };
  }
  // Chain to the standard Metro resolver for everything else
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;