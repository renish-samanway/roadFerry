import firestore from '@react-native-firebase/firestore';

export const SET_ADDRESS_LIST = 'SET_ADDRESS_LIST';
import AppPreference from '../../../helper/preference/AppPreference';

export const fetchAddressList = (valueUID) => {
  return async (dispatch) => {
    // any async code you want!
    try {
      const loadedAddressData = [];
      firestore()
        .collection('users')
        .doc(valueUID)
        .collection('address_details')
        .get()
        .then((querySnapshot) => {
          console.log('Total address data: ', querySnapshot.size);
          querySnapshot.forEach((documentSnapshot) => {
            loadedAddressData.push(documentSnapshot.data());
          });
          dispatch({
            type: SET_ADDRESS_LIST,
            allAddressData: loadedAddressData,
          });
        });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};
