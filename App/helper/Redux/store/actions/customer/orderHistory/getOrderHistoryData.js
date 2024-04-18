import firestore from '@react-native-firebase/firestore';

export const GET_ORDER_HISTORY_DATA = 'GET_ORDER_HISTORY_DATA';
export const LOADING_ORDER_HISTORY_DATA = 'LOADING_ORDER_HISTORY_DATA';

export const getCustomerOrderData = (UID, isFromTransporter) => {
  return async (dispatch) => {
    // any async code you want!
    try {
      const loadedPendingData = [];
      const loadedOngoingData = [];
      const loadedCompletedData = [];
      const loadedRejectedData = [];

      dispatch({
        type: LOADING_ORDER_HISTORY_DATA,
        isLoading: true
      });

      firestore()
        .collection('order_details')
        .orderBy('created_at', 'desc')
        .get()
        .then((querySnapshot) => {
          console.log('Total order data: ', querySnapshot.size);
          querySnapshot.forEach((documentSnapshot) => {
            let loginUID = ''
            if (isFromTransporter) {
              loginUID = documentSnapshot.get('transporter_uid')
            } else {
              loginUID = documentSnapshot.get('requested_uid')
            }
            if (loginUID === UID) {
              // console.log('Status is : ', documentSnapshot.get('status'));
              if (documentSnapshot.get('status') === 'on-loading' ||
              documentSnapshot.get('status') === 'on-way' ||
              documentSnapshot.get('status') === 'unloading' ||
              documentSnapshot.get('status') === 'dispute' ||
              documentSnapshot.get('status') === 'unloaded') {
                loadedOngoingData.push({id: documentSnapshot.id, data: documentSnapshot.data()});
              } else if (documentSnapshot.get('status') === 'rejected') {
                loadedRejectedData.push({id: documentSnapshot.id, data: documentSnapshot.data()});
              } else if (documentSnapshot.get('status') === 'completed') {
                loadedCompletedData.push({id: documentSnapshot.id, data: documentSnapshot.data()});
              } else {
                loadedPendingData.push({id: documentSnapshot.id, data: documentSnapshot.data()});
              }
            }
          });
          /* console.log('Pending Data is : ', loadedPendingData.length);
          console.log('Ongoing Data is : ', loadedOngoingData.length);
          console.log('Accepted Data is : ', loadedAcceptedData.length);
          console.log('Rejected Data is : ', loadedRejectedData.length);
          console.log('Completed Data is : ', loadedCompletedData.length); */
          dispatch({
            type: GET_ORDER_HISTORY_DATA,
            customerPendingOrderData: loadedPendingData,
            customerOngoingOrderData: loadedOngoingData,
            customerCompletedOrderData: loadedCompletedData,
            customerRejectedOrderData: loadedRejectedData
          });
        });
    } catch (err) {
      // send to custom analytics server
      dispatch({
        type: LOADING_ORDER_HISTORY_DATA,
        isLoading: false
      });
      throw err;
    }
  };
};
