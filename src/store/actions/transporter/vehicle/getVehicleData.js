import firestore from '@react-native-firebase/firestore';

export const GET_VEHICLE_LIST = 'GET_VEHICLE_LIST';
export const IS_VEHICLE_LOADING = 'IS_VEHICLE_LOADING';

export const fetchVehicleList = (userID, isStartProgress) => {
  return async (dispatch) => {
    // any async code you want!
    try {
      const vehicleList = [];
      if (isStartProgress) {
        dispatch({
          type: IS_VEHICLE_LOADING,
          isLoading: true,
        });
      }
      firestore()
        .collection('users')
        .doc(userID)
        .collection('vehicle_details')
        .where('is_deleted', '==', false)
        .get()
        .then((querySnapshot) => {
          console.log('Total vehicle_details data: ', querySnapshot.size);
          querySnapshot.forEach((documentSnapshot) => {
            // console.log('documentSnapshot.id: ', documentSnapshot.id);
            vehicleList.push({id: documentSnapshot.id, data: documentSnapshot.data()});
          });
          dispatch({
            type: GET_VEHICLE_LIST,
            vehicleData: vehicleList,
            isLoading: false
          });
        });
    } catch (err) {
      // send to custom analytics server
      dispatch({
        type: IS_VEHICLE_LOADING,
        isLoading: false,
      });
      throw err;
    }
  };
};