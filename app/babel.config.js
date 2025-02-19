module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      'moduleName': '@env',
      'path': '.env',
      'safe': true,
      'allowUndefined': false
    }],
    'react-native-reanimated/plugin', // <- Asegúrate de que esto está al final
    'react-native-gesture-handler',
  ]
};

