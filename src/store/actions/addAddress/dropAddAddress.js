import DropAddAddress from '../../../helper/models/addAddress/DropAddAddress';

export const SET_DROP_ADDRESS_DATA = 'SET_DROP_ADDRESS_DATA';
import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';

export const setDropAddressData = (
  firstName,
  lastName,
  email,
  phone,
  flatName,
  area,
  city,
  state,
  country,
  pincode,
  status,
  flag,
  UID,
) => {
  return async (dispatch) => {
    // any async code you want!
    //   if (status === 'pickup') {
    console.log('ENTER');
    const loadedDropAddressData = new DropAddAddress(
      firstName,
      lastName,
      email,
      phone,
      flatName,
      area,
      city,
      state,
      country,
      pincode,
    );
    console.log('CLOSE');

    if (flag === 'yes') {
      firebase
        .firestore()
        .collection('users')
        .doc(UID)
        .collection('address_details')
        .add({
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone_number: phone,
          flat_name: flatName,
          area: area,
          city: city,
          state: state,
          country: country,
          pincode: pincode,
        });
    }
    dispatch({
      type: SET_DROP_ADDRESS_DATA,
      dropAddressData: loadedDropAddressData,
    });
    //   } catch (err) {
    //     throw err;
    //     //   throw new Error(err, 0);
    //   }
  };
};
