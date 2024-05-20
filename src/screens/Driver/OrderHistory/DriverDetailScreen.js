import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  ScrollView,
  TextInput,
  Keyboard,
  Alert,
  SafeAreaView
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useSelector, useDispatch } from 'react-redux';

// Import the Plugins and Thirdparty library.
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';
import Modal from 'react-native-modal';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import { OrderDetailsOptions } from '../../../helper/extensions/dummyData';
import ParcelOptionsData from '../../../components/Customer/AddParcelDetails/ParcelOptionsData';
import MenuView from '../../../components/design/MenuView';
import Loader from '../../../components/design/Loader';
import { SET_IS_DRIVER_DETAILS_LOADING } from '../../../store/actions/customer/orderHistory/getOrderHistoryData';

// Load the main class.
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const DriverDetailScreen = (props) => {
  const selectedHistoryStatus = props.navigation.getParam('historyStatus');
  const refreshData = props.navigation.getParam('refreshData');
  const orderData = props.navigation.getParam('selectedOrderData');

  let userUID = useSelector(
    (state) => state.fetchProfileData.userUID,
  );
  // userUID = "B4Ti8IgLgpsKZECGqOJ0"
  console.log(`DriverDetailScreen order data.userUID:`, orderData)

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [flagAccept, setFlagAccept] = useState(false);
  const [flagDriver, setFlagDriver] = useState(true);
  const [flagVehicle, setFlagVehicle] = useState(false);
  const [search, setSearch] = useState({ value: '', error: '' });
  const [selectedDriverIndex, setSelectedDriverIndex] = useState('');
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState('');
  const [popup, setPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch()

  /* const pickupAddressData = useSelector(
    (state) => state.pickupAddressData.pickupAddressData,
  );
  const dropAddressData = useSelector(
    (state) => state.dropAddressData.dropAddressData,
  ); */
  const renderDetailsOption = (itemData) => {
    return (
      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => setSelectedIndex(itemData.item.id)}>
        <Text
          style={
            selectedIndex === itemData.item.id
              ? styles.titleText
              : styles.subTitleText
          }>
          {itemData.item.title}
        </Text>
        <View
          style={
            selectedIndex === itemData.item.id
              ? styles.activeDotView
              : styles.unActiveDotView
          }
        />
      </TouchableOpacity>
    );
  };

  const onPressAccept = () => {
    return (
      <ScrollBottomSheet // If you are using TS, that'll infer the renderItem `item` type
        componentType="FlatList"
        snapPoints={[100, '50%', windowHeight - 300]}
        initialSnapIndex={2}
        renderHandle={() => (
          <View>
            <View style={styles.header}>
              <View style={styles.panelHandle} />
              {/* <Text
                  style={{
                    ...styles.vehicleText,
                    paddingTop: 8,
                    paddingBottom: 0,
                  }}>
                  Choose a traspoter, or swipe up for more
                </Text> */}
            </View>
            <View style={styles.distanceView}>
              <Text style={styles.distanceText}>Total Distance</Text>
              <Text style={styles.distanceText}>294 KM</Text>
            </View>
          </View>
        )}
        data={OrderDetailsOptions}
        keyExtractor={(i) => i}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate({
                routeName: 'AddParcelDetails',
                params: {
                  selectedData: item,
                },
              });
            }}>
            <View style={styles.item}>
              <Image
                style={styles.itemImage}
                source={require('../../../assets/assets/default_user.png')}
              />
              <View>
                <Text style={styles.traspoterText}>sdsdsd</Text>
                <Text style={styles.deliveryText}>Delivery time: 3-4 Days</Text>
              </View>
              <View style={styles.priceView}>
                <Text style={styles.priceText}>₹ {2000}</Text>
              </View>
            </View>
            <View style={styles.seperateLine} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.contentContainerStyle}
      />
    );
  };

  // On press select driver and vehicle event
  const onPressSelectDriver_Vehicle = (valueType) => {
    if (valueType === 'driver') {
      setFlagDriver(true);
      setFlagVehicle(false);
    } else {
      setFlagDriver(false);
      setFlagVehicle(true);
    }
  };

  const onPressDriverNext = () => {
    console.log('Driver Index : ', selectedDriverIndex);
    if (selectedDriverIndex !== '') {
      setFlagDriver(false);
      setFlagVehicle(true);
    } else {
      Alert.alert(
        'Alert',
        'Please select the driver',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false },
      );
    }
  };

  const onPressVehicleAssign = () => {
    console.log('Driver Index : ', selectedDriverIndex);
    console.log('Vehicle Index : ', selectedVehicleIndex);
    if (selectedDriverIndex !== '' && selectedVehicleIndex !== '') {
      setPopup(true);
    } else {
      Alert.alert(
        'Alert',
        'Please select the Driver or Vehicle',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false },
      );
    }
  };

  const getFormattedAddress = (location) => {
    return `${location.flat_name +
      ', ' +
      location.area +
      ', ' +
      location.city +
      ', ' +
      location.state +
      ' - ' +
      location.pincode +
      '. ' +
      location.country}`
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View>
          <FlatList
            horizontal
            keyExtractor={(item, index) => item.id}
            data={OrderDetailsOptions}
            renderItem={renderDetailsOption}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <ScrollView style={{ margin: 16, marginTop: 0 }}>
          {selectedIndex === 0 && (
            <View>
              <ParcelOptionsData
                optionTitle="Tracking Id"
                optionTitleValue={`#${orderData.data.order_id}`}
              />
              <ParcelOptionsData
                optionTitle="Items"
                optionTitleValue={orderData.data.pickup_location.sending}
              />
              <ParcelOptionsData
                optionTitle="Parcel Value"
                optionTitleValue={orderData.data.pickup_location.parcel_value}
              />
              <ParcelOptionsData
                optionTitle="Parcel Weight"
                optionTitleValue={orderData.data.pickup_location.weight + ' Tons'}
              />
              <ParcelOptionsData
                optionTitle="Parcel LWH"
                optionTitleValue={
                  orderData.data.pickup_location.dimensions +
                  ' feet * ' +
                  orderData.data.pickup_location.width +
                  ' feet * ' +
                  orderData.data.pickup_location.height +
                  ' feet '
                }
                cm
              />
              <ParcelOptionsData
                optionTitle="Vehicle"
                optionTitleValue="Mini Truck"
              />
              {orderData.data.vehicle_details?.vehicle_number &&
                <ParcelOptionsData
                  optionTitle="Vehicle Number"
                  optionTitleValue={orderData.data.vehicle_details.vehicle_number}
                />}
              <ParcelOptionsData
                optionTitle="Pickup Date and Time"
                optionTitleValue={orderData.data.pickup_location.pickup_date_time}
              />
              <ParcelOptionsData
                optionTitle="Comment"
                optionTitleValue={orderData.data.pickup_location.comment}
              />
              {orderData.data.transporter_details?.first_name != undefined &&
                <ParcelOptionsData
                  optionTitle="Transporter Name"
                  optionTitleValue={orderData.data.transporter_details.first_name + ' ' + orderData.data.transporter_details.last_name}
                />}
              {orderData.data.transporter_details?.phone_number != undefined &&
                <ParcelOptionsData
                  optionTitle="Transporter Contact Number"
                  openDialer={true}
                  optionTitleValue={orderData.data.transporter_details.phone_number}
                />}
              {orderData.data.created_by != undefined &&
                <>
                  <ParcelOptionsData
                    optionTitle="Customer Name"
                    optionTitleValue={orderData.data.created_by.first_name + ' ' + orderData.data.created_by.last_name}
                  />
                  <ParcelOptionsData
                    optionTitle="Customer Contact Number"
                    openDialer={true}
                    optionTitleValue={orderData.data.created_by.phone_number}
                  />
                </>
              }
            </View>
          )}
          {selectedIndex === 1 && (
            <View>
              <View>
                <Text style={styles.locationTitleText}>Pickup Point</Text>
                <View style={{ marginTop: 8 }}>
                  <View style={styles.locationView}>
                    <Text
                      style={{
                        ...styles.titleText,
                        fontSize: RFPercentage(2.2),
                      }}>
                      {orderData.data.pickup_location.first_name +
                        ' ' +
                        orderData.data.pickup_location.last_name}
                    </Text>
                  </View>
                  <Text style={styles.locationText}>
                    {getFormattedAddress(orderData.data.pickup_location)}
                  </Text>
                  <Text style={styles.locationText}>
                    {orderData.data.pickup_location.phone_number}
                  </Text>
                </View>
              </View>
              <View style={{ marginTop: 16 }}>
                <Text style={styles.locationTitleText}>Drop Point</Text>
                <View style={{ marginTop: 8 }}>
                  <View style={styles.locationView}>
                    <Text
                      style={{
                        ...styles.titleText,
                        fontSize: RFPercentage(2.2),
                      }}>
                      {orderData.data.drop_location.first_name +
                        ' ' +
                        orderData.data.drop_location.last_name}
                    </Text>
                  </View>
                  <Text style={styles.locationText}>
                    {getFormattedAddress(orderData.data.drop_location)}
                  </Text>
                  <Text style={styles.locationText}>
                    {orderData.data.drop_location.phone_number}
                  </Text>
                </View>
              </View>
              {orderData.data.distance != undefined &&
                <View style={{ marginTop: 16 }}>
                  <Text style={styles.locationTitleText}>Total Distance</Text>
                  <Text
                    style={{ ...styles.titleText, fontSize: RFPercentage(2.2) }}>{orderData.data.distance} KM</Text>
                </View>}
            </View>
          )}
          {selectedIndex === 2 && (
            <View>
              <ParcelOptionsData
                optionTitle="Payment method"
                optionTitleValue={orderData.data.payment_mode}
              />
              <ParcelOptionsData
                optionTitle="Total paid amount"
                optionTitleValue={`₹ ${orderData.data.price}`}
              />
            </View>
          )}
        </ScrollView>
      </View>
      {(selectedHistoryStatus == 0 || selectedHistoryStatus == 1) && (
        <View style={{ ...styles.actionButtonRow, justifyContent: 'center' }}>
          {/* <TouchableOpacity
            style={styles.cancelView}
            onPress={() =>
              props.navigation.navigate({
                routeName: 'CancelOrderScreen',
                params: {
                  orderData: orderData,
                  refreshData: () => {
                    props.navigation.goBack()
                  }
                }
              })
            }>
            <Text style={styles.cancelText}>Reject</Text>
          </TouchableOpacity> */}
          <MenuView
            navigation={props.navigation}
            data={orderData}
            isAssigned={selectedHistoryStatus == 0 ? true : false}
            onRefreshList={() => {
              setIsLoading(false)
              dispatch({ type: SET_IS_DRIVER_DETAILS_LOADING })
              props.navigation.goBack()
              // loadOrderHistoryData().then(() => {})
            }}
            showLoader={() => {
              // console.log(`showLoader`)
              setIsLoading(true)
            }}
            hideLoader={() => {
              // console.log(`hideLoader`)
              setIsLoading(false)
            }}
          />
        </View>
      )}
      {/* {selectedHistoryStatus === 0 && (
        <View style={styles.actionButtonRow}>
          <TouchableOpacity
            style={styles.cancelView}
            onPress={() =>
              props.navigation.navigate({
                routeName: 'CancelOrderScreen',
              })
            }>
            <Text style={styles.cancelText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionView}
            onPress={() =>
              props.navigation.navigate({
                routeName: 'CancelOrderScreen',
              })
            }>
            <Text style={styles.optionText}>Not started</Text>
            <Image
              style={styles.optionImage}
              source={require('../../../assets/assets/Driver/Dashboard/ic_dropdown.png')}
            />
          </TouchableOpacity>
        </View>
      )}
      {selectedHistoryStatus === 1 && (
        <View style={{...styles.actionButtonRow, justifyContent: 'center'}}>
          <TouchableOpacity
            style={{
              ...styles.cancelView,
              backgroundColor: Colors.trackOrderViewColor,
            }}
            onPress={() =>
              props.navigation.navigate({
                routeName: 'CancelOrderScreen',
              })
            }>
            <Text style={styles.cancelText}>Track Order</Text>
          </TouchableOpacity>
        </View>
      )} */}
      {popup && (
        <Modal isVisible={popup}>
          <View style={{ flex: 1 }}>
            <View style={styles.centeredView}>
              <View style={styles.popupView}>
                <Image
                  style={styles.clickImage}
                  source={require('../../../assets/assets/PlaceOrder/checkout_click.png')}
                />
                <Text style={{ ...styles.totalAmountText, textAlign: 'center' }}>
                  Your order has been successfully assigned.
                </Text>
                <TouchableOpacity
                  style={styles.homeButtonView}
                  onPress={() =>
                    props.navigation.navigate({
                      routeName: 'TranspoterDashboardScreen',
                    })
                  }>
                  <Text style={styles.placeOrderText}>HOME</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
      <Loader loading={isLoading} />
    </SafeAreaView>
  );
};

DriverDetailScreen.navigationOptions = (navigationData) => {
  return {
    headerShown: true,
    headerTitle: 'Order Details',
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
    headerLeft: (
      <View style={styles.viewHeaderLeft}>
        <TouchableOpacity
          onPress={() => {
            navigationData.navigation.pop();
          }}>
          <Image
            style={styles.menuImage}
            source={require('../../../assets/assets/Authentication/back.png')}
          />
        </TouchableOpacity>
      </View>
    ),
  };
};

// Set the components styles.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: Colors.backgroundColor,
    justifyContent: 'space-between',
  },
  viewHeaderLeft: {
    paddingLeft: 16,
  },
  menuImage: {
    height: 40,
    width: 40,
  },
  optionRow: {
    margin: 16,
    // height: 40,
    // marginRight: 0,
    // backgroundColor: Colors.backgroundColor,
  },
  titleText: {
    color: Colors.titleTextColor,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-SemiBold',
  },
  subTitleText: {
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    color: Colors.subTitleTextColor,
  },
  activeDotView: {
    marginTop: 8,
    height: 3,
    width: 25,
    backgroundColor: Colors.primaryColor,
    borderRadius: 5,
  },
  unActiveDotView: {
    marginTop: 8,
    height: 3,
    width: 25,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 5,
  },
  locationTitleText: {
    color: Colors.primaryColor,
    fontSize: RFPercentage(2.2),
    fontFamily: 'SofiaPro-SemiBold',
  },
  locationView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationText: {
    marginTop: 4,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.8),
    color: Colors.otherTextColor,
  },
  actionButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundColor,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    shadowOpacity: 0.15,
    elevation: 5,
  },
  cancelView: {
    margin: 16,
    marginBottom: 32,
    width: windowWidth / 2 - 32,
    height: 50,
    borderRadius: 25,
    // borderColor: Colors.primaryColor,
    // borderWidth: 0.5,
    backgroundColor: Colors.rejectedColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Regular',
    color: Colors.backgroundColor,
  },
  contentContainerStyle: {
    flex: 1,
    padding: 16,
    // marginLeft: 55,
    backgroundColor: Colors.backgroundColor,
  },
  header: {
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
    paddingVertical: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowOffset: { width: 5, height: 0 },
    shadowRadius: 5,
    shadowOpacity: 0.25,
    elevation: 5,
  },
  panelHandle: {
    width: 35,
    height: 3,
    backgroundColor: Colors.subViewBGColor,
    borderRadius: 4,
  },
  selectView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  selectText: {
    // margin: 16,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    color: Colors.primaryColor,
  },
  unSelectText: {
    // margin: 16,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
  },
  seperateLine: {
    backgroundColor: Colors.backgroundColor,
    height: 10,
  },
  trackingView: {
    width: '100%',
    backgroundColor: Colors.backgroundColor,
  },
  viewInputText: {
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.subViewBGColor,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.subViewBGColor,
  },
  weightInputText: {
    paddingLeft: 12,
    paddingRight: 16,
    fontSize: RFPercentage(1.8),
    // fontFamily: 'SofiaPro-Medium',
    color: Colors.titleTextColor,
    // backgroundColor: Colors.backgroundColor,
    height: 50,
    width: Dimensions.get('window').width - 124,
    borderRadius: 10,
  },
  trackingImage: {
    marginLeft: 16,
    height: 25,
    width: 25,
  },
  searchView: {
    marginRight: 16,
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  itemRow: {
    flexGrow: 1,
    marginTop: 16,
    flexDirection: 'row',
    backgroundColor: Colors.backgroundColor,
    alignItems: 'center',
  },
  itemImage: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  selectTitleText: {
    marginLeft: 16,
    color: Colors.primaryColor,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-SemiBold',
  },
  unSelectTitleText: {
    marginLeft: 16,
    color: Colors.titleTextColor,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-SemiBold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clickImage: {
    marginTop: 16,
    height: 50,
    width: 50,
  },
  totalAmountText: {
    margin: 16,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
  },
  homeButtonView: {
    margin: 16,
    fontSize: RFPercentage(2),
    backgroundColor: Colors.buttonColor,
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  popupView: {
    backgroundColor: Colors.backgroundColor,
    // height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth - 64,
    borderRadius: 10,
  },
  placeOrderText: {
    color: Colors.backgroundColor,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    // color: Colors.backgroundColor,
  },
  optionView: {
    margin: 16,
    marginTop: 0,
    width: windowWidth / 2 - 64,
    height: 50,
    borderRadius: 25,
    borderColor: Colors.titleTextColor,
    borderWidth: 0.5,
    flexDirection: 'row',
    // backgroundColor: Colors.acceptedViewColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Regular',
    color: Colors.titleTextColor,
  },
  optionImage: {
    height: 30,
    width: 30,
  },
});

export default DriverDetailScreen;
