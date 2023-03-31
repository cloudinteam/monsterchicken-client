import * as CryptoJS from 'crypto-js';

export const environment = {
  production: true,
  secret: 'testkey',
  enKey: CryptoJS.enc.Utf8.parse('s#Jv6ejUxs7MKcgyTkC3X9zZLjslGw2f'),
  enIv: CryptoJS.enc.Utf8.parse('K10Djpm7%9On%q7K'),
  firebase: {
    apiKey: "AIzaSyA3rD3Ump2EYOPSn7bOhzpaxo79uozcPiw",
    authDomain: "cryptotrack-26c5d.firebaseapp.com",
    projectId: "cryptotrack-26c5d",
    storageBucket: "cryptotrack-26c5d.appspot.com",
    messagingSenderId: "1032283370273",
    appId: "1:1032283370273:web:d295b763854bd21d354460",
    measurementId: "G-2F12CLVS28",
    vapidKey:
      'BEsjyG7h5VTn6XOy1wSnfJTjxf83kxW-2VmWXviLQ16F65xBAgK35e1bBhET8jPUEhA6eyyu0Gi_bM28xCNfC_Y',
  },
};
