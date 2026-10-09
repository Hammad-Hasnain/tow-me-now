const path = require('path');

module.exports = {
  reactNativePath: path.resolve(__dirname, '../../node_modules/react-native'),
  dependencies: {
    'react-native-image-picker': {
      root: path.resolve(__dirname, '../../node_modules/react-native-image-picker'),
    },
  },
};