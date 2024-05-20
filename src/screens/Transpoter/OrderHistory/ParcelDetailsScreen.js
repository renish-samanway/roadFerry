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
  Linking
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
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomSheetView from '../../../components/design/BottomSheetView';
import Loader from '../../../components/design/Loader';
import firestore from '@react-native-firebase/firestore';
import AppConstants from '../../../helper/constants/AppConstants';
import MenuView from '../../../components/design/MenuView';

// Load the main class.
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ParcelDetailsScreen = (props) => {
  const selectedHistoryStatus = props.navigation.getParam('historyStatus');
  const refreshData = props.navigation.getParam('refreshData');
  const orderData = props.navigation.getParam('selectedOrderData');
  const orderID = props.navigation.getParam('orderID');
  // console.log(`ParcelDetailsScreen.parcelData: ${JSON.stringify(parcelData)}`)
  const user = useSelector(state => state.fetchProfileData.fetchProfileData)

  let userUID = useSelector(
    (state) => state.fetchProfileData.userUID,
  );
  // userUID = "B4Ti8IgLgpsKZECGqOJ0"
  console.log(`ParcelDetailsScreen.userUID: ${userUID}`)

  useEffect(() => {
    console.log(`ParcelDetailsScreen.orderID: ${orderID}`)
    if (orderID) {
      try {
        setIsLoading(true)
        firestore()
          .collection('order_details')
          .doc(orderID)
          .onSnapshot((querySnapshot) => {
            let tSelectedOrderData = { id: orderID, data: querySnapshot.data() }
            console.log(`order data: ${JSON.stringify(tSelectedOrderData)}`);
            setParcelData(tSelectedOrderData)
            setIsLoading(false)
          });
      } catch (err) {
        console.log(`error: ${error}`)
        setIsLoading(false)
      }
    }
  }, [orderID]);

  useEffect(() => {
    console.log(`orderData:`, orderData);
    if (orderData) {
      setParcelData(orderData)
    }
  }, [orderData])

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [flagAccept, setFlagAccept] = useState(false);
  const [flagDriver, setFlagDriver] = useState(true);
  const [flagVehicle, setFlagVehicle] = useState(false);
  const [search, setSearch] = useState({ value: '', error: '' });
  const [selectedDriverIndex, setSelectedDriverIndex] = useState('');
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState('');
  const [popup, setPopup] = useState(false);
  const [parcelData, setParcelData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  /* const dropAddressData = useSelector(
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

  const driverList = useSelector(
    (state) => state.transporterDriverData.driverData,
  );

  const openMaps = (daddr, saddr) => {
    //22.310971336030473, 73.18372684767557
    // const daddr = `${latitude},${longitude}`;
    const company = AppConstants.isIOS ? "apple" : "google";
    Linking.openURL(`http://maps.${company}.com/maps?daddr=${daddr}&saddr=${saddr}`);
  }

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

  const showMenuView = () => {
    return (
      <View style={{ ...styles.actionButtonRow, justifyContent: 'center' }}>
        <MenuView
          navigation={props.navigation}
          data={parcelData}
          isAssigned={selectedHistoryStatus == 0 ? true : false}
          onRefreshList={() => {
            setIsLoading(false)
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
    )
  }

  return (
    <View style={styles.container}>
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
          {selectedIndex === 0 && parcelData && (
            <View>
              <ParcelOptionsData
                optionTitle="Tracking Id"
                optionTitleValue={`#${parcelData.data.order_id}`}
              />
              <ParcelOptionsData
                optionTitle="Items"
                optionTitleValue={parcelData.data.pickup_location.sending}
              />
              <ParcelOptionsData
                optionTitle="Parcel Value"
                optionTitleValue={parcelData.data.pickup_location.parcel_value}
              />
              <ParcelOptionsData
                optionTitle="Parcel Weight"
                optionTitleValue={parcelData.data.pickup_location.weight + ' Tons'}
              />
              <ParcelOptionsData
                optionTitle="Parcel LWH"
                optionTitleValue={
                  parcelData.data.pickup_location.dimensions +
                  ' feet * ' +
                  parcelData.data.pickup_location.width +
                  ' feet * ' +
                  parcelData.data.pickup_location.height +
                  ' feet '
                }
                cm
              />
              <ParcelOptionsData
                optionTitle="Vehicle"
                optionTitleValue={
                  parcelData.data.vehicle_type
                }
              />
              {(parcelData.data.status!='pending' && parcelData.data.status!='rejected') && parcelData.data.vehicle_details?.vehicle_number != undefined &&
                <ParcelOptionsData
                  optionTitle="Vehicle Number"
                  optionTitleValue={
                    parcelData.data.vehicle_details.vehicle_number
                  }
                />}
              <ParcelOptionsData
                optionTitle="Pickup Date and Time"
                optionTitleValue={parcelData.data.pickup_location.pickup_date_time}
              />
              <ParcelOptionsData
                optionTitle="Comment"
                optionTitleValue={parcelData.data.pickup_location.comment}
              />
              {(parcelData.data.status!='pending' && parcelData.data.status!='rejected')?
              <View>
              {parcelData.data.driver_details?.user_uid != parcelData.data.transporter_uid &&
                <>
                  <ParcelOptionsData
                    optionTitle="Driver Name"
                    optionTitleValue={parcelData.data.driver_details.first_name + ' ' + parcelData.data.driver_details.last_name}
                  />
                  <ParcelOptionsData
                    optionTitle="Driver Contact Number"
                    openDialer={true}
                    optionTitleValue={parcelData.data.driver_details.phone_number}
                  />
                </>
              }
              </View>
              :
              <View>
              {parcelData.data.created_by?.first_name != undefined &&
                <>
                  <ParcelOptionsData
                    optionTitle="Customer Name"
                    optionTitleValue={parcelData.data.created_by.first_name + ' ' + parcelData.data.created_by.last_name}
                  />
                  <ParcelOptionsData
                    optionTitle="Customer Contact Number"
                    openDialer={true}
                    optionTitleValue={parcelData.data.created_by.phone_number}
                  />
                </>
              }
              </View>
              }
            </View>
          )}
          {selectedIndex === 1 && parcelData && (
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
                      {parcelData.data.pickup_location.first_name +
                        ' ' +
                        parcelData.data.pickup_location.last_name}
                    </Text>
                  </View>
                  <Text style={styles.locationText}>
                    {getFormattedAddress(parcelData.data.pickup_location)}
                  </Text>
                  <Text style={styles.locationText}>
                    {parcelData.data.pickup_location.phone_number}
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
                      {parcelData.data.drop_location.first_name +
                        ' ' +
                        parcelData.data.drop_location.last_name}
                    </Text>
                  </View>
                  <Text style={styles.locationText}>
                    {getFormattedAddress(parcelData.data.drop_location)}
                  </Text>
                  <Text style={styles.locationText}>
                    {parcelData.data.drop_location.phone_number}
                  </Text>
                </View>
              </View>
              {parcelData.data?.distance!=undefined && 
            <View style={{marginTop: 16}}>
              <Text style={styles.locationTitleText}>Total Distance</Text>
              <Text
                    style={{...styles.titleText, fontSize: RFPercentage(2.2)}}>{parcelData.data.distance} KM</Text>
              </View>}
            </View>
          )}
          {selectedIndex === 2 && parcelData && (
            <View>
              <ParcelOptionsData
                optionTitle="Payment method"
                optionTitleValue={parcelData.data.payment_mode}
              />
              <ParcelOptionsData
                optionTitle="Total paid amount"
                optionTitleValue={`₹ ${parcelData.data.price}`}
              />
            </View>
          )}
        </ScrollView>
      </View>
      {selectedHistoryStatus === 0 && parcelData && (
        parcelData.data.status === "pending" ? <View style={styles.actionButtonRow}>
          <TouchableOpacity
            style={styles.cancelView}
            onPress={() => {
              props.navigation.navigate({
                routeName: 'CancelOrderScreen',
                params: {
                  orderData: parcelData,
                  refreshData: () => {
                    /* if (refreshData) {
                      refreshData()
                    } */
                    props.navigation.goBack()
                  }
                }
              })
              /* Alert.alert(
                'Reject',
                'Are you sure? you want to reject this order.',
                [{text: 'YES', onPress: () => {
                  setIsLoading(true)
                  firestore()
                  .collection('order_details')
                  .doc(parcelData.id)
                  .update({status: 'rejected'})
                  .then(()=> {
                      console.log(`order_details.updated`)
                      // this.hideLoading()
                      // this.props.onPressAcceptOrder()
                      setIsLoading(false)
                      refreshData()
                      props.navigation.goBack()
                  }).catch(error => {
                      console.log(`order_details.error:`, error)
                      setIsLoading(false)
                  })
                }},
                {text: 'NO', onPress: () => console.log('OK Pressed')}],
                {cancelable: false},
              ); */
            }}>
            <Text style={styles.cancelText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.cancelView,
              backgroundColor: Colors.acceptedViewColor,
            }}
            onPress={() => {
              console.log(`driverList: ${JSON.stringify(driverList)}`)
              setFlagAccept(true)
            }}>
            <Text style={styles.cancelText}>Accept & Assign</Text>
          </TouchableOpacity>
        </View> :
          showMenuView()
      )}
      {selectedHistoryStatus === 1 && parcelData && (
        parcelData.data.driver_details.user_uid === userUID ? showMenuView()
          : <View style={{ ...styles.actionButtonRow, justifyContent: 'center' }}>
            <TouchableOpacity
              style={{
                ...styles.cancelView,
                backgroundColor: Colors.trackOrderViewColor,
              }}
              onPress={() => {
                // openMaps(`${22.6898},${72.8566}`, `${22.3109},${73.1837}`)
                console.log(`parcelData.data: ${JSON.stringify(parcelData.data)}`)
                // openMaps(getFormattedAddress(parcelData.data.drop_location), getFormattedAddress(parcelData.data.pickup_location))
                props.navigation.navigate({
                  routeName: 'TrackOrder',
                  params: {
                    orderData: parcelData
                  }
                })
              }}>
              <Text style={styles.cancelText}>Track Order</Text>
            </TouchableOpacity>
          </View>
      )}
      {flagAccept && (
        <BottomSheetView
          userUID={userUID}
          parcelData={parcelData}
          onPressClose={() => setFlagAccept(false)}
          onPressAcceptOrder={() => {
            setFlagAccept(false)
            setPopup(true)
          }}
        />
      )}
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
                  Order has been successfully accepted.
                </Text>
                <TouchableOpacity
                  style={styles.homeButtonView}
                  onPress={() => {
                    setPopup(false)
                    // refreshData()
                    props.navigation.goBack()
                  }}>
                  <Text style={styles.placeOrderText}>OKAY</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
      <Loader loading={isLoading} />
    </View>
  );
};

ParcelDetailsScreen.navigationOptions = (navigationData) => {
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
    flexDirection: 'row'
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
});

export default ParcelDetailsScreen;
