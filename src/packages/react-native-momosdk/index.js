var RNMomosdk = require('react-native').NativeModules.RNMomosdk;

module.exports = {
  requestPayment: function (jsonData) {
    return RNMomosdk.requestPayment(jsonData);
  },
};
