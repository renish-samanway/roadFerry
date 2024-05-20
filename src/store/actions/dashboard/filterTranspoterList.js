import firestore from '@react-native-firebase/firestore';
import UserList from '../../../helper/models/dashboard/UserList';

export const SET_FILTER_TRANSPOTER_LIST = 'SET_FILTER_TRANSPOTER_LIST';
import {getDistance, getPreciseDistance} from 'geolib';
import AppPreference from '../../../helper/preference/AppPreference';

export const fetchFilterTranspoterList = (
  source,
  destination,
  weight,
  dimensions,
  width,
  height,
  vehicletype,
  sourceLatitude,
  sourceLongitude,
  destinationLatitude,
  destinationLongitude,
  currentLat,
  currentLong,
) => {
  return async (dispatch) => {
    // any async code you want!
    try {
      const loadedFilterData = [];
      firestore()
        .collection('users')
        .get()
        .then((querySnapshot) => {
          console.log('Total users filter: ', querySnapshot.size);
          querySnapshot.forEach((documentSnapshot) => {
            // console.log(
            //   'User data: ',
            //   documentSnapshot.id,
            //   documentSnapshot.data(),
            // );

            // documentSnapshot.ref
            //   .collection('transpoters_details')
            //   .get()
            //   .then((querySnapshot1) => {
            //     querySnapshot1.forEach((document) => {
            //       console.log('Trasport Data : ', document.data());
            //     });
            //   });
            // var transport = querySnapshot.documentSnapshot
            //   .collection('transpoters_details')
            //   .get();
            // console.log('Transport is : ', transport);
            if (documentSnapshot.get('user_type') === 'transporter') {
              var address = documentSnapshot.get('address');
              var distance = getPreciseDistance(
                {latitude: currentLat, longitude: currentLong},
                {
                  latitude: address.coordinates.latitude,
                  longitude: address.coordinates.longitude,
                },
              );
              if (distance / 1000 <= AppPreference.DISTANCE_MARGIN) {
                // console.log('Distance is : ', address.title, distance);
                // var distanceSourceDestination = getPreciseDistance(
                //   {latitude: sourceLatitude, longitude: sourceLongitude},
                //   {
                //     latitude: destinationLatitude,
                //     longitude: destinationLongitude,
                //   },
                // );
                loadedFilterData.push(
                  new UserList(documentSnapshot.id, documentSnapshot.data()),
                );
                // loadedFilterData.push(documentSnapshot.data());
              }
            }
          });
          // console.log('User Data is : ', loadedFilterData);
          dispatch({
            type: SET_FILTER_TRANSPOTER_LIST,
            allFilterData: loadedFilterData,
          });
        });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};


// {
//   "rules": {
//     ".read": false,
//     ".write": false
//   }
// }

// {
//   "rules": {
//     ".read": "now < 1605724200000",  // 2020-11-19
//     ".write": "now < 1605724200000",  // 2020-11-19
//   }
// }