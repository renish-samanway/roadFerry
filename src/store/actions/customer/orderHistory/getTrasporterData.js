import firestore from '@react-native-firebase/firestore';

export const GET_TRANSPOTER_DATA = 'GET_TRANSPOTER_DATA';
export const IS_TRANSPORTER_LOADING = 'IS_TRANSPORTER_LOADING';

export const getTransporterData = (transporter_uid, isStartProgress) => {
  return async (dispatch) => {
    // any async code you want!
    try {
      let loadedTransporterData = {};

      if (isStartProgress) {
        dispatch({
          type: IS_TRANSPORTER_LOADING,
          isLoading: true,
        });
      }
      firestore()
        .collection('users')
        .doc(transporter_uid)
        .get()
        .then((querySnapshot) => {
          /* querySnapshot.forEach((documentSnapshot) => {
            loadedTransporterData.push(documentSnapshot.data());
          }); */
          loadedTransporterData = querySnapshot.data()
          dispatch({
            type: GET_TRANSPOTER_DATA,
            transporterData: loadedTransporterData,
            isLoading: false
          });
        });
    } catch (err) {
      // send to custom analytics server
      dispatch({
        type: IS_TRANSPORTER_LOADING,
        isLoading: false,
      });
      throw err;
    }
  };
};
