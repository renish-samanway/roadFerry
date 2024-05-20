import firestore from '@react-native-firebase/firestore';
import {Platform} from 'react-native';
import storage from '@react-native-firebase/storage';
import _, {remove, uniqBy} from 'lodash';
import messaging from '@react-native-firebase/messaging';

// export const getUserDataById = async (userId) => {
//   return await firestore()
//     .collection('users')
//     .doc(userId)
//     .get()
//     .then((querySnapshot) => {
//       return querySnapshot.data();
//     });
// };

export const addUserWallet = async(userId, data) => {
  console.log("w data: ", data);
  return await firestore().collection('users').doc(userId).collection('wallet').add(data);
};

export const getWalletDataByUserId = async (userId) => {
  return new Promise(async (resolve, reject) => {
    await firestore()
      .collection('users')
      .doc(userId)
      .collection('wallet')
      .get()
      .then((userWalletQS) => {
        if (userWalletQS.size) {
          let transArr = [];
          userWalletQS.forEach(async (userDS) => {
            let walletDocId = userDS.id;
            await firestore()
              .collection('users')
              .doc(userId)
              .collection('wallet')
              .doc(walletDocId)
              .collection('transactions')
              .get()
              .then((transQS) => {
                transQS.forEach((transDS) => {
                  transArr.push({id: transDS.id, ...transDS.data()});
                });
                resolve({
                  wallet: {
                    ...userDS.data(),
                  },
                  transactions: transArr,
                });
              });
          });
        } else {
          resolve(false);
        }
      });
  });
};

export const addTransaction = async (userId, data) => {
  return await firestore()
    .collection('users')
    .doc(userId)
    .collection('wallet')
    .get()
    .then((userWalletQS) => {
      userWalletQS.forEach(async (userDS) => {
        let walletDocId = userDS.id;
        await firestore()
          .collection('users')
          .doc(userId)
          .collection('wallet')
          .doc(walletDocId)
          .collection('transactions')
          .add(data);
      });
    });
};
