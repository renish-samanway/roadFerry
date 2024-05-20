import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef } from 'react';
import { Linking } from 'react-native';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import { fcmService } from './src/FCMService';
import AppPreference from './src/helper/preference/AppPreference';
import { localNotificationService } from './src/LocalNotificationService';
import Navigator from './src/navigation/MainNavigation';
import pickupAddressReducer from './src/store/reducers/addAddress/addAddress';
import addressDataReducer from './src/store/reducers/addAddress/addressData';
import dropAddAddressReducer from './src/store/reducers/addAddress/dropAddAddress';
import setDropLocationDataReducer from './src/store/reducers/customer/addParcelDetails/setDropLocationData';
import setPickupLocationDataReducer from './src/store/reducers/customer/addParcelDetails/setPickupLocationData';
import getOrderHistoryDataReducer from './src/store/reducers/customer/orderHistory/getOrderHistoryData';
import getTransporterDataReducer from './src/store/reducers/customer/orderHistory/getTrasporterData';
import fetchProfileDataReducer from './src/store/reducers/customer/profile/fetchProfileData';
import filterTraspoterListReducer from './src/store/reducers/dashboard/filterTranspoterList';
import saveNotificationReducer from './src/store/reducers/dashboard/saveNotificationData';
import destinationAddressSetReducer from './src/store/reducers/dashboard/setDestinationValue';
import addressSetReducer from './src/store/reducers/dashboard/setSourceValue';
import userlistReducer from './src/store/reducers/dashboard/userlist';
import getTransporterDriverDataReducer from './src/store/reducers/transporter/driver/getDriverData';
import getTransporterVehicleDataReducer from './src/store/reducers/transporter/vehicle/getVehicleData';
import getVehicleTypeReducer from './src/store/reducers/transporter/vehicle/getVehicleType';
// import walletReducer from './src/store/reducers/wallet/walletReducer';

const rootReducer = combineReducers({
  allUserData: userlistReducer,
  setSourceTextValue: addressSetReducer,
  setSourceLatitude: addressSetReducer,
  setSourceLongitude: addressSetReducer,
  setDestinationTextValue: destinationAddressSetReducer,
  setDestinationLatitude: destinationAddressSetReducer,
  setDestinationLongitude: destinationAddressSetReducer,
  allFilterData: filterTraspoterListReducer,
  pickupAddressData: pickupAddressReducer,
  dropAddressData: dropAddAddressReducer,
  allAddressData: addressDataReducer,
  pickupLocationData: setPickupLocationDataReducer,
  dropLocationData: setDropLocationDataReducer,
  customerOrderData: getOrderHistoryDataReducer,
  customerPendingOrderData: getOrderHistoryDataReducer,
  customerOngoingOrderData: getOrderHistoryDataReducer,
  customerRejectedOrderData: getOrderHistoryDataReducer,
  customerAssignedOrderData: getOrderHistoryDataReducer,
  customerCompletedOrderData: getOrderHistoryDataReducer,
  transporterDriverData: getTransporterDriverDataReducer,
  transporterData: getTransporterDataReducer,
  transporterVehicleData: getTransporterVehicleDataReducer,
  fetchProfileData: fetchProfileDataReducer,
  getVehicleTypeReducer: getVehicleTypeReducer,
  saveNotificationReducer: saveNotificationReducer,
  // userWalletData: walletReducer
});
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));


export default function App(props) {
  useEffect(() => {
    fcmService.registerAppWithFCM()
    fcmService.register(onRegister, onNotification, onOpenNotification)
    localNotificationService.configure(onOpenNotification)

    function onRegister(token) {
      console.log(`[App] onRegister:`, token)
      AsyncStorage.setItem(AppPreference.FCM_TOKEN, token);
    }

    function onNotification(notify) {
      // console.log(`[App] onNotification:`, notify)
      //AsyncStorage.setItem(AppPreference.NOTIFICATION_DATA, JSON.stringify(notify));
      const option = {
        soundName: 'default',
        playSound: true
      }
      localNotificationService.showNotification(
        0,
        notify.notification.title,
        notify.notification.body,
        notify.notification,
        option
      )
    }

    function onOpenNotification(notify) {
      console.log(`onOpenNotification.notify: ${JSON.stringify(notify)}`)
      if (notify) {
        AsyncStorage.setItem(AppPreference.NOTIFICATION_DATA, JSON.stringify(notify));
      }
    }

    return() => {
      console.log(`[App] unRegister`)
      fcmService.unRegister()
      localNotificationService.unRegister()
    }
  }, [])

  return (
    <Provider store={store}>
      <Navigator />
    </Provider>
  );
}
