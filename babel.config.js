module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@appHooks': './src/appHooks',
          '@assets': './src/assets',
          '@navigation': './src/navigation',
          '@screens': './src/screens',
          '@redux': './src/redux',
          '@sharedComponents': './src/sharedComponents',
          '@styles': './src/styles',
          '@constants': './src/constants',
          // '@contexts': './src/contexts',
        },
      },
    ],
  ],
};
