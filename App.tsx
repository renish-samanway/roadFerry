/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import Navigator from './App/service/navigation/navigation';

import userlistReducer from "./App/helper/Redux/store/reducers/dashboard/userlist";
import addressSetReducer from "./App/helper/Redux/store/reducers/dashboard/setSourceValue";
import destinationAddressSetReducer from "./App/helper/Redux/store/reducers/dashboard/setDestinationValue";
import filterTraspoterListReducer from "./App/helper/Redux/store/reducers/dashboard/filterTranspoterList";
import pickupAddressReducer from "./App/helper/Redux/store/reducers/addAddress/addAddress";
import dropAddAddressReducer from "./App/helper/Redux/store/reducers/addAddress/dropAddAddress";
import addressDataReducer from "./App/helper/Redux/store/reducers/addAddress/addressData";
import setPickupLocationDataReducer from "./App/helper/Redux/store/reducers/customer/addParcelDetails/setPickupLocationData";
import setDropLocationDataReducer from "./App/helper/Redux/store/reducers/customer/addParcelDetails/setDropLocationData";
import getVehicleTypeReducer from "./App/helper/Redux/store/reducers/customer/addParcelDetails/getVehicleType";
import getOrderHistoryDataReducer from "./App/helper/Redux/store/reducers/customer/orderHistory/getOrderHistoryData";
import getTransporterDriverDataReducer from "./App/helper/Redux/store/reducers/transporter/driver/getDriverData";
import getTransporterDataReducer from "./App/helper/Redux/store/reducers/customer/orderHistory/getTrasporterData";
import getTransporterVehicleDataReducer from "./App/helper/Redux/store/reducers/transporter/vehicle/getVehicleData";
import fetchProfileDataReducer from "./App/helper/Redux/store/reducers/customer/profile/fetchProfileData";

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
  getVehicleTypeReducer: getVehicleTypeReducer,
  customerPendingOrderData: getOrderHistoryDataReducer,
  customerOngoingOrderData: getOrderHistoryDataReducer,
  customerCompletedOrderData: getOrderHistoryDataReducer,
  customerRejectedOrderData: getOrderHistoryDataReducer,
  transporterDriverData: getTransporterDriverDataReducer,
  transporterData: getTransporterDataReducer,
  transporterVehicleData: getTransporterVehicleDataReducer,
  fetchProfileData: fetchProfileDataReducer,
});

const store = createStore(rootReducer);

function App(): React.JSX.Element {

  return (
    <Provider store={store}>
      <Navigator />
    </Provider>
      );
}

export default App;
