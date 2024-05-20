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
  Keyboard,
  KeyboardAvoidingView,
  ToastAndroid,
  PermissionsAndroid,
  Platform
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useSelector, useDispatch } from 'react-redux';

// Import the Plugins and Thirdparty library.
import Modal from 'react-native-modal';
import Menu, { MenuItem } from 'react-native-material-menu';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import TextInput from '../../../components/design/TextInput';
import AppConstants from '../../../helper/constants/AppConstants';

import {
  selectReasonValidator,
  reasonCommentValidator
} from '../../../helper/extensions/Validator';
import firestore from '@react-native-firebase/firestore';
import Loader from '../../../components/design/Loader';
import Geolocation from '@react-native-community/geolocation';

// Load the main class.
const windowWidth = Dimensions.get('window').width;
import { getPreciseDistance } from 'geolib';
import AppPreference from '../../../helper/preference/AppPreference';
import NotificationCall from '../../../helper/NotificationCall';

const CancelOrderScreen = (props) => {
  let orderData = props.navigation.getParam('orderData');
  const refreshData = props.navigation.getParam('refreshData');
  console.log('order data from navigation', orderData)
  const profileData = useSelector(
    (state) => state.fetchProfileData.fetchProfileData,
  );

  let userUID = useSelector(
    (state) => state.fetchProfileData.userUID,
  );
  // userUID = "B4Ti8IgLgpsKZECGqOJ0"
  console.log(`DriverDetailScreen.userUID: ${userUID}`)

  // console.log(`orderData:`, orderData)
  let orderIDValue = { value: '', error: '' }
  if (orderData != undefined) {
    orderIDValue = { value: `#${orderData.data.order_id}`, error: '' }
  }

  useEffect(() => {
    getTransporterCurrentPosition()
  }, [nextTransporter]);

  hasLocationPermission = async () => {
    // console.log(`hasLocationPermission`)
    if (AppConstants.isIOS || (AppConstants.isAndroid && Platform.Version < 23)) {
      return true;
    }
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  const getNearByTransporterList = (lat, lang) => {
    const loadedUserData = [];
    firestore()
      .collection('users')
      .orderBy('priority', 'asc')
      .get()
      .then((querySnapshot) => {
        console.log('Total users: ', querySnapshot.size);
        querySnapshot.forEach((documentSnapshot) => {
          if (documentSnapshot.get('user_type') === 'transporter' && documentSnapshot.get('is_request')) {
            var address = documentSnapshot.get('address');
            // console.log('Coordinate is : ', address.coordinates.latitude);
            if (address.coordinates != undefined && Object.keys(address.coordinates).length != 0) {
              var distance = getPreciseDistance(
                {
                  latitude: lat,
                  longitude: lang
                },
                {
                  latitude: address.coordinates.latitude,
                  longitude: address.coordinates.longitude,
                },
              );
              // console.log('Distance is : ', address.title, distance);
              if (distance / 1000 <= AppPreference.DISTANCE_MARGIN) {
                // console.log('Distance is : ', address.title, distance);
                if (userUID != documentSnapshot.id) {
                  console.log('\n')
                  console.log(`documentSnapshot.id:`, documentSnapshot.id)
                  console.log(`name:`, documentSnapshot.get('first_name'), documentSnapshot.get('last_name'))
                  console.log(`priority:`, documentSnapshot.get('priority'))
                  console.log(`orderData.data.vehicle_type:`, orderData.data.vehicle_type)
                  let vehicleType = orderData.data.vehicle_type
                  firestore()
                    .collection('users')
                    .doc(documentSnapshot.id)
                    .collection('vehicle_details')
                    .where('vehicle_type', '==', vehicleType)
                    .where('is_verified', '==', 'verified')
                    .where('is_assign', '==', false)
                    .where('is_deleted', '==', false)
                    .get()
                    .then((querySnapshot) => {
                      console.log('documentSnapshot.id->Total vehicle_details (vehicle_type) data: ', documentSnapshot.id, querySnapshot.size);
                      if (querySnapshot.size != 0) {
                        // loadedUserData.push(documentSnapshot.data());
                        loadedUserData.push({ id: documentSnapshot.id, data: documentSnapshot.data() });
                        // console.log(`found next transporter`)
                        return
                      }
                      // querySnapshot.forEach((documentSnapshot) => {
                      //     console.log('documentSnapshot.id: ', documentSnapshot.id);
                      // });
                    }).catch(error => {
                      console.log(`error:`, error)
                    });
                }
              }
            }
          }
        });
        console.log('transporterList.count:', loadedUserData.length);
        setNextTransporter(loadedUserData)
        return loadedUserData
      });
  };

  const getTransporterCurrentPosition = async () => {
    const checkLocationPermission = await hasLocationPermission();
    if (!checkLocationPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const currentLongitude = position.coords.longitude;
        const currentLatitude = position.coords.latitude;
        console.log('<<< LAT/LAN: ' + currentLatitude + ', ' + currentLongitude);
        getNearByTransporterList(currentLatitude, currentLongitude);
      },
    );
  }

  // console.log(`orderIDValue:`, orderIDValue)
  const [orderId, setOrderId] = useState(orderIDValue);
  const [selectReason, setSelectReason] = useState({ value: '', error: '' });
  const [reasonTypeFlag, setReasonTypeFlag] = useState(false);
  const [comment, setComment] = useState({ value: '', error: '' });
  const [popup, setPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nextTransporter, setNextTransporter] = useState([]);

  var _menu;
  const setMenuRef = (ref) => {
    _menu = ref;
  };

  const showMenu = () => {
    _menu.show();
  };

  const hideMenu = (popupName) => {
    _menu.hide();
    setReasonTypeFlag(true);
    setSelectReason({ value: popupName, error: '' });
  };

  const onPressHomeButton = () => {
    setPopup(false);
    refreshData()
    props.navigation.goBack()
  };

  const updateVehicleDetails = (transporterUID, vehicleID) => {
    firestore().collection('vehicle_details').doc(vehicleID).update({ is_assign: true })
    firestore()
      .collection('users')
      .doc(transporterUID)
      .collection('vehicle_details')
      .doc(vehicleID)
      .update({ is_assign: false })
      .then(() => {
        console.log(`vehicle_details.updated`)
        //notification send to transporter
        setIsLoading(false)
        setPopup(true);
      }).catch(error => {
        console.log(`vehicle_details.update.error:`, error)
        setIsLoading(false)
      });
  }

  const updateDriverDetails = (transporterUID, driverID, vehicleID) => {
    firestore()
      .collection('users')
      .doc(userUID)
      .update({ is_assign: false })
      .then(() => {
        console.log(`users.updated`)
        firestore()
          .collection('users')
          .doc(transporterUID)
          .collection('driver_details')
          .doc(driverID)
          .update({ is_assign: false })
          .then(() => {
            console.log(`driver_details.updated`)
            updateVehicleDetails(transporterUID, vehicleID)
          })
          .catch(error => {
            console.log(`users.driver_details.error:`, error)
            setIsLoading(false)
          })
      })
      .catch(error => {
        console.log(`users.error:`, error)
        setIsLoading(false)
      })
  }

  /* const getPriority = () => {
    return nextTransporter.map(orderData => orderData.data.priority)
  } */


  const updateDriverVehicleTransporter = () => {
    firestore()
      .collection('users')
      .doc(userUID)
      .collection('driver_details')
      .doc(orderData.data.driver_details.driver_id)
      .update({ is_assign: false })
      .then(() => {
        console.log('driver of this transporter is updated')
        firestore().collection('vehicle_details').doc(orderData.data.vehicle_details.vehicle_id).update({ is_assign: false })
        firestore()
          .collection('users')
          .doc(userUID)
          .collection('vehicle_details')
          .doc(orderData.data.vehicle_details.vehicle_id)
          .update({ is_assign: false }).then(() => {
            setIsLoading(false)
            setPopup(true);
          }).catch((e) => {
            console.log('exception is generated', e)
            setIsLoading(false)
          })
      })
      .catch((e) => {
        console.log('exception is generated while updating driver details', e)
        setIsLoading(false)
      })
  }
  const rejectOrderTapHandler = async () => {
    Keyboard.dismiss()
    const selectReasonError = selectReasonValidator(selectReason.value);
    const commentError = reasonCommentValidator(comment.value);

    if (selectReasonError) {
      setSelectReason({ ...selectReason, error: selectReasonError });
      return;
    } else if (commentError) {
      setComment({ ...comment, error: commentError });
      return;
    } else {
      let rejectDetailsList = []
      let rejectDetails = {
        reason_type: selectReason.value,
        reason_comment: comment.value,
        rejected_by: userUID,
        user_type: profileData.user_type,
        rejected_at: new Date()
      }
      // console.log(`orderData.data.reject_details:`, orderData.data.reject_details)
      if (orderData.data.reject_details != undefined) {
        rejectDetailsList = [...orderData.data.reject_details]
      }
      rejectDetailsList.push(rejectDetails)
      // console.log(`rejectDetails:`, rejectDetailsList)
      let status = ''
      let nextTransporterData = {}
      let parameters = undefined
      if (profileData.user_type == 'driver') {
        status = 'pending'
        parameters = {
          "userId": orderData.data.transporter_uid,
          "orderId": orderData.id,
          "type": "driver_reject"
        }
      } else {
        if (nextTransporter.length != 0) {
          status = 'pending'
          nextTransporterData = await nextTransporter.reduce((minOrderData, orderData) => minOrderData.data.priority < orderData.data.priority ? minOrderData : orderData)
          parameters = {
            "userId": orderData.data.requested_uid,
            "orderId": orderData.id,
            "type": "transporter_reject",
            "transporterId": orderData.data.transporter_uid
          }
        } else {
          status = 'rejected'
          parameters = {
            "userId": orderData.data.requested_uid,
            "orderId": orderData.id,
            "type": "no_transporter_reject"
          }
        }
      }
      console.log(`status:`, status)
      // console.log(`profileData.transporter_uid:`, profileData.transporter_uid)
      // console.log(`orderData.data.driver_details.driver_id:`, orderData.data.driver_details.driver_id)
      // console.log(`orderData.data.vehicle_details.vehicle_id:`, orderData.data.vehicle_details.vehicle_id)
      // console.log(`orderData.data.vehicle_details.vehicle_id:`, orderData.data.vehicle_details.vehicle_id)

      let updatedData = {
        status: status,
        reject_details: rejectDetailsList
      }

      if (Object.keys(nextTransporterData).length != 0) {
        updatedData.transporter_uid = nextTransporterData.id
        updatedData.transporter_details = nextTransporterData.data
      }

      console.log(`updatedData:`, updatedData)
      // console.log(`orderData.data.transporter_uid:`, orderData.data.transporter_uid)
      // return

      setIsLoading(true)
      firestore()
        .collection('order_details')
        .doc(orderData.id)
        .update(updatedData)
        .then(() => {
          console.log(`order_details.updated`)
          // this.hideLoading()
          // this.props.onPressAcceptOrder()
          /* setIsLoading(false)
          setPopup(true); */

          if (parameters != undefined) {
            NotificationCall(parameters)
          }

          if (profileData.user_type == 'driver') {
            console.log(`profileData.transporter_uid:`, profileData.transporter_uid)
            updateDriverDetails(profileData.transporter_uid, orderData.data.driver_details.driver_id, orderData.data.vehicle_details.vehicle_id)
          }
          else if (profileData.user_type == 'transporter' && orderData.data?.driver_details?.user_uid == userUID) {
            updateDriverVehicleTransporter()
          }
          else {
            setIsLoading(false)
            setPopup(true);
          }

          firestore()
            .collection('users')
            .doc(orderData.data.transporter_uid)
            .update({ is_request: true, is_assign: false })
        }).catch(error => {
          console.log(`order_details.error:`, error)
          setIsLoading(false)
        })
    }
  }

  const cancelOrderScreenView = () => {
    return (
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps={'handled'}
        automaticallyAdjustContentInsets={false}
        showsVerticalScrollIndicator={false}>
        <View style={{ margin: 16 }}>
          <TextInput
            label="Order id"
            returnKeyType="next"
            value={orderId.value}
            onChangeText={(text) => setOrderId(text)}
            error={orderId.error}
            errorText={orderId.errorText}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            ref={(ref) => {
              this._orderidinput = ref;
            }}
            onSubmitEditing={() =>
              this._selectReasoninput && this._selectReasoninput.focus()
            }
            editable={false}
          />
          <Menu
            ref={(ref) => setMenuRef(ref)}
            button={
              <View>
                <TouchableOpacity style={styles.popupView} onPress={showMenu}>
                  <Text
                    style={
                      !reasonTypeFlag
                        ? styles.popupTextUnSelected
                        : styles.popupTextSelected
                    }>
                    {selectReason.value == '' ? 'Select reason' : selectReason.value}
                  </Text>
                </TouchableOpacity>
                {selectReason.error != '' ?
                  <Text style={styles.error}>{selectReason.error}</Text> : null
                }
              </View>
            }>
            <MenuItem onPress={() => hideMenu('Change in delivery address')}>
              Change in delivery address
            </MenuItem>
            {/* <MenuItem onPress={() => hideMenu('Recipient not available')}>
              Driver is not available
            </MenuItem> */}
            <MenuItem onPress={() => hideMenu('Recipient not available')}>
              Recipient not available
            </MenuItem>
            <MenuItem onPress={() => hideMenu('Cash not available for COD')}>
              Cash not available for COD
            </MenuItem>
            <MenuItem onPress={() => hideMenu('Cheaper alternative available')}>
              Cheaper alternative available
            </MenuItem>
            {/* <MenuItem onPress={() => hideMenu('Bolero')}>Bolero</MenuItem> */}
          </Menu>
          <TextInput
            label="Describe your reason to cancel"
            returnKeyType="next"
            style={{ maxHeight: 160, backgroundColor: Colors.surfaceColor, textAlignVertical: 'top', paddingTop: 0, paddingBottom: 0 }}
            // textAlignVertical={'top'}
            value={comment.value}
            onChangeText={(text) => setComment({ value: text, error: '' })}
            error={comment.error}
            errorText={comment.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            /* ref={(ref) => {
              this._orderidinput = ref;
            }} */
            onSubmitEditing={() => {
              // Keyboard.dismiss()
            }}
            multiline
          />
        </View>
        <TouchableOpacity
          style={styles.buttonBookNow}
          onPress={() => {
            rejectOrderTapHandler()
          }}>
          <Text style={styles.bookNowText}>REJECT NOW</Text>
        </TouchableOpacity>
        <Modal isVisible={popup}>
          <View style={{ flex: 1 }}>
            <View style={styles.centeredView}>
              <View style={styles.popupMessageView}>
                <Image
                  style={styles.clickImage}
                  source={require('../../../assets/assets/PlaceOrder/checkout_click.png')}
                />
                <Text style={{ ...styles.totalAmountText, textAlign: 'center' }}>
                  Your order has been successfully cancelled. Thank you for
                  choosing us
                </Text>
                <TouchableOpacity
                  style={styles.homeButtonView}
                  onPress={() => onPressHomeButton()}>
                  <Text style={styles.placeOrderText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Loader loading={isLoading} />
      </ScrollView>
    );
  }

  return AppConstants.isAndroid ? (
    <View style={{ flex: 1 }}>{cancelOrderScreenView()}</View>
  ) : (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior="padding"
      keyboardVerticalOffset={64}
      enabled>
      {cancelOrderScreenView()}
    </KeyboardAvoidingView>
  );
};

CancelOrderScreen.navigationOptions = (navigationData) => {
  return {
    headerShown: true,
    headerTitle: 'Cancel Order',
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
      backgroundColor: Colors.mainBackgroundColor,
    },
    headerLeft: (
      <View style={styles.viewHeaderLeft}>
        <TouchableOpacity
          onPress={() => {
            navigationData.navigation.goBack();
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
    backgroundColor: Colors.mainBackgroundColor,
  },
  error: {
    fontSize: RFPercentage(2),
    // fontFamily: 'Roboto-Regular',
    color: Colors.errorColor,
    paddingHorizontal: 8,
    paddingTop: 8,
    marginBottom: 0
  },
  viewHeaderLeft: {
    paddingLeft: 16,
  },
  menuImage: {
    height: 40,
    width: 40,
  },
  popupView: {
    marginTop: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 55,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 5,
    borderColor: Colors.borderColor,
    borderWidth: 0.8,
  },
  popupTextUnSelected: {
    marginLeft: 12,
    marginRight: 12,
    color: 'gray',
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Regular',
  },
  popupTextSelected: {
    marginLeft: 12,
    marginRight: 12,
    color: Colors.titleTextColor,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Regular',
  },
  contectMenu: {
    marginTop: 16,
    flexDirection: 'row',
  },
  buttonBookNow: {
    margin: 64,
    marginLeft: 64,
    marginRight: 64,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Medium',
    backgroundColor: Colors.buttonColor,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  bookNowText: {
    fontFamily: 'SofiaPro-Medium',
    color: Colors.backgroundColor,
    fontSize: RFPercentage(2),
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
  popupMessageView: {
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

export default CancelOrderScreen;
