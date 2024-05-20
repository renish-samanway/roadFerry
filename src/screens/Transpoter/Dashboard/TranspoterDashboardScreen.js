import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Alert,
  Platform,
  PermissionsAndroid,
  ScrollView,
  ToastAndroid,
  Linking,
} from 'react-native';
import {useSelector, useDispatch, connect} from 'react-redux';

// Import the Plugins and Thirdparty library.

import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import RecentOrder from '../../../components/transpoter/Dashboard/RecentOrder';
import * as getOrderHistoryDataActions from '../../../store/actions/customer/orderHistory/getOrderHistoryData';
import * as saveNotificationDataActions from '../../../store/actions/dashboard/saveNotificationData';
import Loader from '../../../components/design/Loader';
import BottomSheetView from '../../../components/design/BottomSheetView';
import Modal from 'react-native-modal';
import Geolocation from '@react-native-community/geolocation';
import AppConstants from '../../../helper/constants/AppConstants';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppPreference from '../../../helper/preference/AppPreference';
import CText from '../../../common/CText';

// Load the main class.
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
let watchId = null;

const TranspoterDashboardScreen = (props) => {
  /* useEffect(() => {
    // subscribe event
    Linking.addEventListener("url", handleOpenURL);
    return () => {
      // unsubscribe event
      Linking.removeEventListener("url", handleOpenURL);
    };
  }, []); */

  const handleOpenURL = (event) => {
    console.log(`handleOpenURL.event.url: ${event.url}`);
    const route = event.url.replace(/.*?:\/\//g, '');
    console.log(`handleOpenURL.route: ${route}`);
    let splitBySplash = route.split('/');
    console.log(`splitBySplash: ${JSON.stringify(splitBySplash)}`);
    for (let i = 0; i < splitBySplash.length; i++) {
      const element = splitBySplash[i];
      if (element != 'road_ferry') {
        console.log(`element: ${element}`);
        AsyncStorage.getItem(AppPreference.IS_LOGIN).then((valueLogin) => {
          const isLogin = JSON.parse(valueLogin);
          console.log(`isLogin: ${isLogin}`);
          if (isLogin != 1) {
            props.navigation.navigate({
              routeName: 'TransporterRegistration',
              params: {
                user_id: element,
                is_from_login: false,
              },
            });
          }
        });
      }
    }
  };

  /* const [pendingCount, setPendingCount] = useState(0);
  const [ongoingCount, setOngoingCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0); */
  const [flagAccept, setFlagAccept] = useState(false);
  const [popup, setPopup] = useState(false);

  let notificationData = useSelector(
    (state) => state.saveNotificationReducer.notificationData,
  );

  useEffect(() => {
    console.log(`notificationData:`, notificationData.driverId);

    if (Object.keys(notificationData).length != 0) {
      if (notificationData.type == 'verified') {
        props.navigation.navigate({
          routeName: 'DriverlistScreen',
          params: {
            isShowBack: true,
          },
        });
      } else {
        props.navigation.navigate({
          routeName: 'NotificationScreen',
        });
      }
      dispatch({
        type: saveNotificationDataActions.SAVE_NOTIFICATION_DATA,
        notificationData: {},
      });
      AsyncStorage.removeItem(AppPreference.NOTIFICATION_DATA);
    }
  }, [notificationData]);

  let userUID = useSelector((state) => state.fetchProfileData.userUID);
  // userUID = "B4Ti8IgLgpsKZECGqOJ0"
  console.log(`TranspoterDashboardScreen.userUID: ${userUID}`);

  const profileData = useSelector(
    (state) => state.fetchProfileData.fetchProfileData,
  );

  const isLoading = useSelector((state) => state.customerOrderData.isLoading);
  /* const driverList = useSelector(
    (state) => state.transporterDriverData.driverData,
  ); */

  const pendingData = useSelector(
    (state) => state.customerPendingOrderData.customerPendingOrderData,
  );

  const ongoingData = useSelector(
    (state) => state.customerOngoingOrderData.customerOngoingOrderData,
  );

  const completedData = useSelector(
    (state) => state.customerCompletedOrderData.customerCompletedOrderData,
  );

  const rejectedData = useSelector(
    (state) => state.customerRejectedOrderData.customerRejectedOrderData,
  );

  useEffect(() => {
    AsyncStorage.getItem(AppPreference.NOTIFICATION_DATA).then(
      (notificationData) => {
        if (notificationData != null) {
          let notificationDataObj = JSON.parse(notificationData);
          if (notificationDataObj.type == 'confirm') {
            openOrderHistoryScreen();
          } else if (notificationDataObj.type == 'driver_reject') {
            openOrderHistoryScreen();
          } else if (notificationDataObj.type == 'request') {
            openOrderHistoryScreen();
          } else if (notificationDataObj.type == 'verified') {
            openDriverListScreen();
          } else if (notificationDataObj.type == 'rejected') {
            openDriverListScreen();
          }
        }
      },
    );
  }, [pendingData, ongoingData, completedData, rejectedData]);

  const openOrderHistoryScreen = () => {
    if (!pendingData || !ongoingData || !completedData || !rejectedData) {
      return;
    }
    props.navigation.navigate({
      routeName: 'ParcelHistoryScreen',
      params: {
        historyStatus: 0,
        pendingData: pendingData,
        ongoingData: ongoingData,
        completedData: completedData,
        rejectedData: rejectedData,
      },
    });
    AsyncStorage.removeItem(AppPreference.NOTIFICATION_DATA);
  };

  const openDriverListScreen = () => {
    props.navigation.navigate({
      routeName: 'DriverlistScreen',
      params: {
        isShowBack: true,
      },
    });
    AsyncStorage.removeItem(AppPreference.NOTIFICATION_DATA);
  };

  const dispatch = useDispatch();
  const loadOrderHistoryData = useCallback(async () => {
    // AsyncStorage.getItem(AppPreference.LOGIN_UID).then((UID) => {
    // console.log('UID IS : ', UID);
    try {
      dispatch(
        getOrderHistoryDataActions.getCustomerOrderData(userUID, true, true),
      );
    } catch (err) {
      console.log('Error is : ', err);
    }
    // });
  }, [dispatch]);

  useEffect(() => {
    getNotificationCount();
    const willFocusSub = props.navigation.addListener('willFocus', () => {
      getNotificationCount();
      loadOrderHistoryData();
    });

    return () => {
      willFocusSub.remove();
    };
  }, [getNotificationCount, loadOrderHistoryData]);

  const getNotificationCount = () => {
    AsyncStorage.getItem(AppPreference.LOGIN_UID).then((userID) => {
      if (userID != null) {
        firestore()
          .collection('notification')
          .where('user_id', '==', userID)
          .where('is_read', '==', false)
          .get()
          .then((querySnapshot) => {
            console.log('Total Notification:', querySnapshot.size);
            props.navigation.setParams({notificationCount: querySnapshot.size});
          })
          .catch((error) => {
            setIsLoginUser(true);
            console.error(error);
          });
      }
    });
  };

  useEffect(() => {
    loadOrderHistoryData().then(() => {
      /* console.log(`pendingData: ${pendingData}`)
      console.log(`ongoingData: ${ongoingData}`)
      console.log(`completedData: ${completedData}`)
      console.log(`rejectedData: ${rejectedData}`) */
    });
  }, [dispatch, loadOrderHistoryData]);

  hasLocationPermission = async () => {
    console.log(`hasLocationPermission`);
    if (
      AppConstants.isIOS ||
      (AppConstants.isAndroid && Platform.Version < 23)
    ) {
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
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  const updateUserLocation = (coordinates) => {
    let addressData = profileData.address;
    // console.log(`addressData:`, addressData)
    addressData.coordinates = coordinates;
    firestore()
      .collection('users')
      .doc(userUID)
      .update({coordinates: coordinates})
      .then(() => {
        console.log(`users.updated`);
      })
      .catch((error) => {
        console.log(`users.error:`, error);
      });
  };

  const getLocationUpdates = async () => {
    const checkLocationPermission = await hasLocationPermission();
    if (!checkLocationPermission) {
      return;
    }
    removeLocationUpdates();
    watchId = Geolocation.watchPosition(
      (position) => {
        // console.log(`position:`, position)
        let latitude = position.coords['latitude'].toFixed(6);
        let longitude = position.coords['longitude'].toFixed(6);
        let coordinates = {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        };
        console.log(`coordinates:`, coordinates);
        updateUserLocation(coordinates);
      },
      (error) => {
        console.log(`getLocationUpdates.error:`, error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 50,
        interval: 5000,
        fastestInterval: 2000,
      },
    );
  };

  const removeLocationUpdates = () => {
    if (watchId !== null) {
      // console.log(`removeLocationUpdates.this.watchId: ${watchId}`);
      Geolocation.stopObserving();
    }
  };

  const getCurrentLocation = async () => {
    console.log(`getCurrentLocation`);
    const checkLocationPermission = await hasLocationPermission();
    if (!checkLocationPermission) {
      return;
    }
    Geolocation.getCurrentPosition(
      (position) => {
        let latitude = position.coords['latitude'].toFixed(6);
        let longitude = position.coords['longitude'].toFixed(6);
        // console.log(`getCurrentLocation.latitude: ${typeof(latitude)}`);
        // console.log(`getCurrentLocation.longitude: ${typeof(longitude)}`);
        // setGetRegion({
        //   latitude: parseFloat(latitude),
        //   longitude: parseFloat(longitude),
        //   latitudeDelta: LATITUDE_DELTA,
        //   longitudeDelta: LONGITUDE_DELTA
        // })
        let coordinates = {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        };
        console.log(`coordinates: ${JSON.stringify(coordinates)}`);
        updateUserLocation(coordinates);
      },
      (error) => {
        console.log(`getCurrentLocation.error:`, error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 50,
        interval: 5000,
        fastestInterval: 2000,
      },
    );
  };

  useEffect(() => {
    console.log(`ongoingData.useEffect`);
    if (ongoingData != undefined && ongoingData.length != 0) {
      let isGetLocation = false;
      for (let i = 0; i < ongoingData.length; i++) {
        let orderData = ongoingData[i];
        // console.log(`orderData:`, orderData)
        if (orderData.data.driver_details.user_uid == userUID) {
          isGetLocation = true;
          break;
        }
      }
      if (isGetLocation) {
        getLocationUpdates();
      } else {
        removeLocationUpdates();
      }
    } else {
      removeLocationUpdates();
      getCurrentLocation();
    }
  }, [ongoingData]);

  const openParcelHistoryScreen = (index) => {
    setFlagAccept(false);
    props.navigation.navigate({
      routeName: 'ParcelHistoryScreen',
      params: {
        historyStatus: index,
        pendingData: pendingData,
        ongoingData: ongoingData,
        completedData: completedData,
        rejectedData: rejectedData,
      },
    });
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.optionView}>
          <View style={styles.firstView}>
            <TouchableOpacity
              style={styles.otherRowView}
              onPress={() => openParcelHistoryScreen(0)}
            >
              <View style={styles.subRowView}>
                <Text style={{...styles.tilteText, color: Colors.tilteText}}>
                  Pending
                </Text>
                <Image
                  style={styles.optionImage}
                  source={require('../../../assets/assets/Transpoter/Dashboard/pending.png')}
                />
              </View>
              <Text style={styles.countTitleText}>
                {pendingData == undefined ? 0 : pendingData.length}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.otherRowView}
              onPress={() => openParcelHistoryScreen(1)}
            >
              <View style={styles.subRowView}>
                <Text style={{...styles.tilteText, color: Colors.tilteText}}>
                  Ongoing
                </Text>
                <Image
                  style={styles.optionImage}
                  source={require('../../../assets/assets/Transpoter/Dashboard/ongoing.png')}
                />
              </View>
              <Text style={styles.countTitleText}>
                {ongoingData == undefined ? 0 : ongoingData.length}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.firstView}>
            <TouchableOpacity
              style={styles.otherRowView}
              onPress={() => openParcelHistoryScreen(2)}
            >
              <View style={styles.subRowView}>
                <Text style={{...styles.tilteText, color: Colors.tilteText}}>
                  Completed
                </Text>
                <Image
                  style={styles.optionImage}
                  source={require('../../../assets/assets/Transpoter/Dashboard/accepted.png')}
                />
              </View>
              <Text style={styles.countTitleText}>
                {completedData == undefined ? 0 : completedData.length}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.otherRowView}
              onPress={() => openParcelHistoryScreen(3)}
            >
              <View style={styles.subRowView}>
                <Text style={{...styles.tilteText, color: Colors.tilteText}}>
                  Rejected
                </Text>
                <Image
                  style={styles.optionImage}
                  source={require('../../../assets/assets/Transpoter/Dashboard/rejected.png')}
                />
              </View>
              <Text style={styles.countTitleText}>
                {rejectedData == undefined ? 0 : rejectedData.length}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text
          style={{
            ...styles.countTitleText,
            fontSize: RFPercentage(2.5),
            marginTop: 16,
          }}
        >
          Quick access
        </Text>
        <View style={styles.firstView}>
          <TouchableOpacity
            style={styles.otherRowView}
            onPress={() => {
              setFlagAccept(false);
              props.navigation.navigate({
                routeName: 'VehicleListScreen',
                params: {
                  isShowBack: true,
                },
              });
            }}
          >
            <View style={{...styles.subRowView, marginBottom: 16}}>
              <Image
                style={styles.optionImage}
                source={require('../../../assets/assets/Transpoter/Dashboard/add_vehicle.png')}
              />
              <Text style={{...styles.tilteText, color: Colors.tilteText}}>
                Add Vehicle
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.otherRowView}
            onPress={() => {
              /* setPopup(true)
              return */
              setFlagAccept(false);
              props.navigation.navigate({
                routeName: 'DriverlistScreen',
                params: {
                  isShowBack: true,
                },
              });
            }}
          >
            <View style={{...styles.subRowView, marginBottom: 16}}>
              <Image
                style={styles.optionImage}
                source={require('../../../assets/assets/Transpoter/Dashboard/add_driver.png')}
              />
              <Text style={{...styles.tilteText, color: Colors.tilteText}}>
                Add Driver
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {pendingData != undefined && pendingData.length > 0 ? (
          <>
            <Text
              style={{
                ...styles.countTitleText,
                fontSize: RFPercentage(2.5),
                marginTop: 16,
              }}
            >
              Recent order
            </Text>
            <RecentOrder
              isDriverDetail={false}
              isDriverRecentOrder={
                pendingData[0].data.status === 'pending' ? false : true
              }
              data={pendingData[0]}
              navigation={props.navigation}
              onStatusChange={() => {
                loadOrderHistoryData().then(() => {});
              }}
              onPressAccept={() => {
                setFlagAccept(true);
              }}
              isOngoingList={
                ongoingData != undefined && ongoingData.length !== 0
              }
            />
          </>
        ) : null}
      </ScrollView>
      <Loader loading={isLoading} />
      {flagAccept && pendingData != undefined && pendingData.length > 0 && (
        <BottomSheetView
          userUID={userUID}
          parcelData={pendingData[0]}
          onPressClose={() => setFlagAccept(false)}
          onPressAcceptOrder={() => {
            setFlagAccept(false);
            setPopup(true);
          }}
        />
      )}
      {popup && (
        <Modal isVisible={popup}>
          <View style={{flex: 1}}>
            <View style={styles.centeredView}>
              <View style={styles.popupView}>
                <Image
                  style={styles.clickImage}
                  source={require('../../../assets/assets/PlaceOrder/checkout_click.png')}
                />
                <Text style={{...styles.totalAmountText, textAlign: 'center'}}>
                  Order has been successfully accepted.
                </Text>
                <TouchableOpacity
                  style={styles.homeButtonView}
                  onPress={() => {
                    setPopup(false);
                    loadOrderHistoryData().then(() => {});
                  }}
                >
                  <Text style={styles.placeOrderText}>OKAY</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

TranspoterDashboardScreen.navigationOptions = (navigationData) => {
  let notificationCount =
    navigationData.navigation.getParam('notificationCount');
  if (notificationCount == undefined || notificationCount == null) {
    notificationCount = 0;
  }

  return {
    headerShown: true,
    // headerTitle: 'Dashboard',
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
      backgroundColor: Colors.mainBackgroundColor,
    },
    headerTitle: (
      <Image
        style={{width: 100, height: 30}}
        source={require('../../../assets/assets/Authentication/logo.png')}
        resizeMode="contain"
      />
    ),
    headerLeft: (
      <View style={styles.viewHeaderLeft}>
        <TouchableOpacity
          onPress={() => {
            navigationData.navigation.toggleDrawer();
          }}
        >
          <Image
            style={styles.menuImage}
            source={require('../../../assets/assets/dashboard/ic_menu.png')}
          />
        </TouchableOpacity>
      </View>
    ),
    headerRight: (
      <View style={{...styles.viewHeaderRight, flexDirection: 'row'}}>
        <TouchableOpacity
          style={{marginEnd: 8, justifyContent: 'center', alignItems: 'center'}}
          onPress={() => {
            navigationData.navigation.navigate({
              routeName: 'WalletScreen',
            });
          }}
        >
          {/* <Image
            style={styles.menuImage}
            source={require('../../../assets/assets/dashboard/notification.png')}
          /> */}
          <CText>Wallet</CText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigationData.navigation.navigate({
              routeName: 'NotificationScreen',
            });
          }}
        >
          <Image
            style={styles.menuImage}
            source={require('../../../assets/assets/dashboard/notification.png')}
          />
        </TouchableOpacity>
        {notificationCount == 0 ? null : (
          <View
            style={{
              backgroundColor: 'red',
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 12,
              right: 12,
              top: -4,
              position: 'absolute',
            }}
          >
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 12,
              }}
            >
              {notificationCount >= 100 ? '+99' : notificationCount}
            </Text>
          </View>
        )}
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
  viewHeaderLeft: {
    paddingLeft: 16,
  },
  menuImage: {
    height: 40,
    width: 40,
  },
  viewHeaderRight: {
    paddingRight: 16,
    // width: 64,
  },
  optionView: {
    backgroundColor: Colors.mainBackgroundColor,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },
  firstView: {
    margin: 16,
    width: Dimensions.get('window').width - 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowView: {
    // height: 110,
    width: Dimensions.get('window').width / 2 - 32,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 10,
    // justifyContent: 'center',
  },
  otherRowView: {
    width: Dimensions.get('window').width / 2 - 32,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 15,
    justifyContent: 'center',
  },
  subRowView: {
    flexDirection: 'row',
    margin: 16,
    marginBottom: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionImage: {
    // margin: 16,
    height: 25,
    width: 25,
  },
  tilteText: {
    // margin: 16,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.8),
    // color: Colors.backgroundColor,
  },
  countTitleText: {
    margin: 16,
    marginTop: 0,
    fontFamily: 'SofiaPro-Bold',
    fontSize: RFPercentage(3),
    color: Colors.titleTextColor,
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
  popupTextUnSelected: {
    marginLeft: 12,
    marginRight: 12,
    color: Colors.titleTextColor,
    fontSize: RFPercentage(2),
  },
  popupTextSelected: {
    marginLeft: 12,
    marginRight: 12,
    color: 'darkgray',
    fontSize: RFPercentage(2),
  },
  contectMenu: {
    marginTop: 16,
    flexDirection: 'row',
  },
  contentContainerStyle: {
    padding: 16,
    backgroundColor: '#F3F4F9',
  },
  header: {
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
    paddingVertical: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  panelHandle: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 4,
  },
  item: {
    backgroundColor: Colors.backgroundColor,
    marginVertical: 8,
  },
  traspoterText: {
    padding: 8,
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
    fontWeight: 'bold',
  },
  priceView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceText: {
    padding: 8,
    paddingTop: 0,
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
    fontWeight: 'bold',
  },
  vehicleText: {
    padding: 8,
    paddingTop: 0,
    fontSize: RFPercentage(1.7),
    color: Colors.titleTextColor,
  },
  totalAmountText: {
    margin: 16,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
  },
});

export default TranspoterDashboardScreen;
