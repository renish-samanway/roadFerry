import firestore from '@react-native-firebase/firestore';

export const GET_ORDER_HISTORY_DATA = 'GET_ORDER_HISTORY_DATA';
export const IS_DASHBOARD_LOADING = 'IS_DASHBOARD_LOADING';
export const IS_DRIVER_DASHBOARD_LOADING = 'IS_DRIVER_DASHBOARD_LOADING';
export const SET_IS_DRIVER_DETAILS_LOADING = 'SET_IS_DRIVER_DETAILS_LOADING'

const isLoadingView = (isFromTransporter, isShow) => {
  return async (dispatch) => {
    if (isFromTransporter) {
      dispatch({
        type: IS_DASHBOARD_LOADING,
        isLoading: isShow,
      });
    } else {
      dispatch({
        type: IS_DRIVER_DASHBOARD_LOADING,
        isDriverLoading: isShow,
      });
    }
  }
}

export const getCustomerOrderData = (UID, isFromTransporter, isStartProgress) => {
  return async (dispatch) => {
    // any async code you want!
    try {
      const loadedPendingData = [];
      const loadedOngoingData = [];
      const loadedRejectedData = [];
      const loadedAssignedData = [];
      const loadedCompletedData = [];
      if (isStartProgress) {
        isLoadingView(isFromTransporter, true)
      }
      firestore()
        .collection('order_details')
        .orderBy('created_at', 'desc')
        .get()
        .then((querySnapshot) => {
          console.log('Total order data: ', querySnapshot.size);
          querySnapshot.forEach((documentSnapshot) => {
            // console.log(`documentSnapshot.data(): ${JSON.stringify(documentSnapshot.data())}`)
            let loginUID = ''
            if (isFromTransporter) {
              loginUID = documentSnapshot.get('transporter_uid')
            } else {
              let driverDetails = documentSnapshot.get('driver_details')
              // console.log(`driverDetails:`, driverDetails)
              if (driverDetails != undefined) {
                loginUID = driverDetails.user_uid
              }
            }
            // console.log(`loginUID: `, loginUID)
            // console.log(`UID: `, UID)
            if (loginUID === UID) {
              // console.log('Status is : ', documentSnapshot.get('status'));
              if (documentSnapshot.get('status') === 'pending') {
                loadedPendingData.push({ id: documentSnapshot.id, data: documentSnapshot.data() });
              } else if (documentSnapshot.get('status') === 'assigned' && isFromTransporter) {
                let driverDetails = documentSnapshot.get('driver_details')
                if (driverDetails != undefined) {
                  if (driverDetails.user_uid == UID) {
                    loadedPendingData.push({ id: documentSnapshot.id, data: documentSnapshot.data() });
                  } else {
                    loadedOngoingData.push({ id: documentSnapshot.id, data: documentSnapshot.data() });
                  }
                } else {
                  loadedOngoingData.push({ id: documentSnapshot.id, data: documentSnapshot.data() });
                }

              } else if (documentSnapshot.get('status') === 'on-loading' ||
                documentSnapshot.get('status') === 'on-way' ||
                documentSnapshot.get('status') === 'unloading' ||
                documentSnapshot.get('status') === 'dispute' ||
                documentSnapshot.get('status') === 'unloaded') {
                loadedOngoingData.push({ id: documentSnapshot.id, data: documentSnapshot.data() });
              } else if (documentSnapshot.get('status') === 'rejected') {
                // loadedRejectedData.push({id: documentSnapshot.id, data: documentSnapshot.data()});
              } else if (documentSnapshot.get('status') === 'assigned') {
                loadedAssignedData.push({ id: documentSnapshot.id, data: documentSnapshot.data() });
              } else { //if (documentSnapshot.get('status') === 'completed') {
                loadedCompletedData.push({ id: documentSnapshot.id, data: documentSnapshot.data() });
              }
            }

            let orderData = documentSnapshot.data()
            let rejectDetailsList = orderData.reject_details
            if (rejectDetailsList != undefined) {
              for (let i = 0; i < rejectDetailsList.length; i++) {
                let rejectDetailsData = rejectDetailsList[i];
                // console.log('rejectDetailsData.rejected_by: ', rejectDetailsData.rejected_by);
                // console.log('UID: ', UID);
                if (UID == rejectDetailsData.rejected_by) {
                  loadedRejectedData.push({ id: documentSnapshot.id, data: documentSnapshot.data() });
                  break
                }
              }
            }
          });
          // console.log('Pending Data is : ', loadedPendingData.length);
          // console.log('Ongoing Data is : ', loadedOngoingData.length);
          console.log('Rejected Data is : ', loadedRejectedData.length);
          // console.log('Assigned Data is : ', loadedAssignedData.length);
          // console.log('Completed Data is : ', loadedCompletedData.length);
          dispatch({
            type: GET_ORDER_HISTORY_DATA,
            customerPendingOrderData: loadedPendingData,
            customerOngoingOrderData: loadedOngoingData,
            customerRejectedOrderData: loadedRejectedData,
            customerAssignedOrderData: loadedAssignedData,
            customerCompletedOrderData: loadedCompletedData,
            isLoading: false,
            isDriverLoading: false
          });
          // isLoadingView(isFromTransporter, false)
        });
    } catch (err) {
      // send to custom analytics server
      isLoadingView(isFromTransporter, false)
      throw err;
    }
  };
};
