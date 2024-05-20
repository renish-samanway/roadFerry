import firestore from '@react-native-firebase/firestore';

export const GET_VEHICLE_TYPE_LIST = 'GET_VEHICLE_TYPE_LIST';
export const IS_VEHICLE_TYPE_LOADING = 'IS_VEHICLE_TYPE_LOADING';

export const fetchVehicleTypeList = (isStartProgress) => {
  return async (dispatch) => {
    // any async code you want!
    try {
      const vehicleTypeList = [];
      if (isStartProgress) {
        dispatch({
          type: IS_VEHICLE_TYPE_LOADING,
          isLoading: true,
        });
      }
      firestore()
        .collection('vehicles')
        .get()
        .then((querySnapshot) => {
          // console.log('Total vehicles data: ', querySnapshot.size);
          querySnapshot.forEach((documentSnapshot) => {
            // console.log('documentSnapshot.data(): ', documentSnapshot.data());
            const data = documentSnapshot.data()
            if(!data.is_deleted){
              vehicleTypeList.push({id: documentSnapshot.id, data: data});
            }
          });
          dispatch({
            type: GET_VEHICLE_TYPE_LIST,
            vehicleTypeList: vehicleTypeList,
            isLoading: false
          });
          /* dispatch({
            type: IS_LOADING,
            isLoading: false,
          }); */
        });
    } catch (err) {
      // send to custom analytics server
      dispatch({
        type: IS_VEHICLE_TYPE_LOADING,
        isLoading: false,
      });
      throw err;
    }
  };
};