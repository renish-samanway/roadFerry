import Polyline from '@mapbox/polyline';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import firestore from '@react-native-firebase/firestore';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions, Image, PermissionsAndroid, Platform, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View
} from 'react-native';
import MapView, { Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import MapViewDirections from 'react-native-maps-directions';
// Import the Plugins and Thirdparty library.
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../components/design/Loader';
import RecentOrder from '../../../components/transpoter/Dashboard/RecentOrder';
import AppConstants from '../../../helper/constants/AppConstants';
// Import the JS file.
import Colors from '../../../helper/extensions/Colors';
import AppPreference from '../../../helper/preference/AppPreference';
import * as getOrderHistoryDataActions from '../../../store/actions/customer/orderHistory/getOrderHistoryData';

// Load the main class.

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
let mapRef = null
const GOOGLE_API_KEY = "AIzaSyDWcZSbyp_kYJSNxLRVVemkx_5V9JlQDHA"
const mapEdgePadding = 36
const coords = []
let watchId = null

const getGoogleRoute = (origin, destination) => {
  let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_API_KEY}`
  console.log(`URL: ${url}`)
  fetch(url)
  .then(response => response.json())
  .then(responseJson => {
      console.log(`responseJson: ${JSON.stringify(responseJson)}`)
      if (responseJson.routes.length) {
          // console.log(`responseJson: ${JSON.stringify(responseJson)}`)
          let points = Polyline.decode(responseJson.routes[0].overview_polyline.points);
          let coords = points.map((point, index) => {
              return  {
                  latitude : point[0],
                  longitude : point[1]
              }
          })
          
          mapRef.fitToCoordinates(
            coords, 
              { edgePadding: { top: mapEdgePadding, right: mapEdgePadding, bottom: mapEdgePadding, left: mapEdgePadding }, animated: false }
          )
      } else {
          console.log("Could not find direction between origin to destination, Please try again with valid origin or destination.")
      }
  })
  .catch(e => {console.warn(e)});
}

const DriverDashboardScreen = (props) => {
  const map = useRef();
  const LATITUDE_DELTA = 0.09;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const [isPolyline, setIsPolyline] = useState(false)
  const [getRegion, setGetRegion] = useState({
    latitude: 23.08571,
    longitude: 72.55132,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [dropLocation, setDropLocation] = useState({
    latitude: 23.08571,
    longitude: 72.55132
  })

  let userUID = useSelector(
    (state) => state.fetchProfileData.userUID,
  );
  console.log(`DriverDashboardScreen.userUID: ${userUID}`)

  /* let notificationData = useSelector(
    (state) => state.saveNotificationReducer.notificationData,
  );

  useEffect(() => {
    console.log(`notificationData:`, notificationData.driverId)
    
    if (Object.keys(notificationData).length != 0) {
      if (notificationData.type == 'verified') {
        props.navigation.navigate({
          routeName: 'DriverlistScreen',
          params: {
            isShowBack: true
          },
        })
      } else {
        props.navigation.navigate({
          routeName: 'NotificationScreen',
        });
      }
      dispatch({
        type: saveNotificationDataActions.SAVE_NOTIFICATION_DATA,
        notificationData: {}
      });
      AsyncStorage.removeItem(AppPreference.NOTIFICATION_DATA);
    }
  }, [notificationData]); */

  const isDriverLoading = useSelector(
    (state) => state.customerOrderData.isDriverLoading,
  );

  const assignedData = useSelector(
    (state) => state.customerAssignedOrderData.customerAssignedOrderData,
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
    AsyncStorage.getItem(AppPreference.NOTIFICATION_DATA).then((notificationData) => {
      if (notificationData != null) {
        let notificationDataObj = JSON.parse(notificationData)
        if (notificationDataObj.type == "assign_driver") {
          openDriverOrderHistoryScreen()
        }
      }
    });
  }, [assignedData, ongoingData, completedData, rejectedData])

  const openDriverOrderHistoryScreen = () => {
    if (!assignedData || !ongoingData || !completedData || !rejectedData) {
      return
    }
    props.navigation.navigate({
      routeName: 'DriverHistoryScreen',
      params: {
        historyStatus: 0,
        assignedData: assignedData,
        ongoingData: ongoingData,
        completedData: completedData,
        rejectedData: rejectedData
      },
    })
    AsyncStorage.removeItem(AppPreference.NOTIFICATION_DATA)
  }

  const fitPadding = () => {
    map.current?.fitToCoordinates([{latitude: getRegion.latitude, longitude: getRegion.longitude}, dropLocation], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
    });
  }

  useEffect(() => {
    // console.log(`ongoingData: ${JSON.stringify(ongoingData)}`)
    if (ongoingData && ongoingData.length != 0) {
      let tmpOngoingData = ongoingData[0].data
      if (tmpOngoingData.drop_location && tmpOngoingData.drop_location.coordinate) {
        setDropLocation(tmpOngoingData.drop_location.coordinate)
        fitPadding()
      }
    }
  }, [ongoingData, getRegion]);

  hasLocationPermission = async () => {
    console.log(`hasLocationPermission`)
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

  const updateUserLocation = (coordinates) => {
    firestore()
        .collection('users')
        .doc(userUID)
        .update({coordinates: coordinates})
        .then(() => {
            console.log(`users.updated`)
        })
        .catch(error => {
            console.log(`users.error:`,error)
        })
  }

  const getLocationUpdates = async () => {
    const checkLocationPermission = await hasLocationPermission();
    if (!checkLocationPermission) {
      return;
    }
    removeLocationUpdates();
    watchId = Geolocation.watchPosition(
      position => {
        // console.log(`position:`, position)
        let latitude = position.coords['latitude'].toFixed(6);
        let longitude = position.coords['longitude'].toFixed(6);
        // console.log(`getLocationUpdates.latitude: ${typeof(latitude)}`);
        // console.log(`getLocationUpdates.longitude: ${typeof(longitude)}`);
        setGetRegion({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        })
        let coordinates = {latitude: parseFloat(latitude), longitude: parseFloat(longitude)}
        /* if (!isPolyline)
        {
          getGoogleRoute(`${coordinates.latitude},${coordinates.longitude}`, `${dropLocation.latitude},${dropLocation.longitude}`)
          setIsPolyline(true)
        } */
        updateUserLocation(coordinates)
      },
      error => {
        console.log(`getLocationUpdates.error:`,error);
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
      console.log(`removeLocationUpdates.this.watchId: ${watchId}`);
      Geolocation.stopObserving()
    }
  };

  useEffect(() => {
    console.log(`getLocationUpdates.useEffect`)
    if (ongoingData != undefined && ongoingData.length != 0) {
      getLocationUpdates()
    } else {
      removeLocationUpdates()
    }
  }, [ongoingData]);

  const dispatch = useDispatch();
  const loadOrderHistoryData = useCallback(async () => {
    // AsyncStorage.getItem(AppPreference.LOGIN_UID).then((UID) => {
      /* const store = useStore()
      userUID = store.getState().fetchProfileData.userUID */
      console.log('loadOrderHistoryData.userUID:', userUID);
      try {
        dispatch(getOrderHistoryDataActions.getCustomerOrderData(userUID, false, true));
      } catch (err) {
        console.log('Error is : ', err);
      }
    // });
  }, [dispatch]);

  useEffect(() => {
    getNotificationCount()
    const willFocusSub = props.navigation.addListener(
    'willFocus',() => {
      getNotificationCount()
      loadOrderHistoryData()
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
        .then(querySnapshot => {
          console.log('Total Notification:', querySnapshot.size);
          props.navigation.setParams({ notificationCount: querySnapshot.size })
        }).catch(error => {
          setIsLoginUser(true)
          console.error(error)
        });
      }
    });
  }

  useEffect(() => {
    loadOrderHistoryData().then(() => {
      console.log(`loadOrderHistoryData.ongoingData:`, ongoingData)
      /* if (ongoingData != undefined && ongoingData.length != 0) {
        getLocationUpdates()
      } */
    });
  }, [dispatch, loadOrderHistoryData]);

  const openDriverHistoryScreen = (index) => {
    props.navigation.navigate({
      routeName: 'DriverHistoryScreen',
      params: {
        historyStatus: index,
        assignedData: assignedData,
        ongoingData: ongoingData,
        completedData: completedData,
        rejectedData: rejectedData
      },
    })
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={styles.container}>
      <View style={styles.optionView}>
        <View style={styles.firstView}>
          <TouchableOpacity
            style={styles.otherRowView}
            onPress={() =>
              openDriverHistoryScreen(0)
            }>
            <View style={styles.subRowView}>
              <Text style={{...styles.tilteText, color: Colors.tilteText}}>
                Assigned
              </Text>
              <Image
                style={styles.optionImage}
                source={require('../../../assets/assets/Driver/Dashboard/assigned.png')}
              />
            </View>
            <Text style={styles.countTitleText}>{assignedData == undefined ? 0 : assignedData.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.otherRowView}
            onPress={() =>
              openDriverHistoryScreen(1)
            }>
            <View style={styles.subRowView}>
              <Text style={{...styles.tilteText, color: Colors.tilteText}}>
                Ongoing
              </Text>
              <Image
                style={styles.optionImage}
                source={require('../../../assets/assets/Transpoter/Dashboard/ongoing.png')}
              />
            </View>
            <Text style={styles.countTitleText}>{ongoingData == undefined ? 0 : ongoingData.length}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.firstView}>
          <TouchableOpacity
            style={styles.otherRowView}
            onPress={() =>
              openDriverHistoryScreen(2)
            }>
            <View style={styles.subRowView}>
              <Text style={{...styles.tilteText, color: Colors.tilteText}}>
                Completed
              </Text>
              <Image
                style={styles.optionImage}
                source={require('../../../assets/assets/Transpoter/Dashboard/accepted.png')}
              />
            </View>
            <Text style={styles.countTitleText}>{completedData == undefined ? 0 : completedData.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.otherRowView}
            onPress={() =>
              openDriverHistoryScreen(3)
            }>
            <View style={styles.subRowView}>
              <Text style={{...styles.tilteText, color: Colors.tilteText}}>
                Rejected
              </Text>
              <Image
                style={styles.optionImage}
                source={require('../../../assets/assets/Transpoter/Dashboard/rejected.png')}
              />
            </View>
            <Text style={styles.countTitleText}>{rejectedData == undefined ? 0 : rejectedData.length}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {assignedData != undefined && assignedData.length > 0 ? 
        <>
          <Text
            style={{
              ...styles.countTitleText,
              fontSize: RFPercentage(2.5),
              marginTop: 16,
            }}>
            Recent order
          </Text>
          <RecentOrder
            isDriverDetail={true}
            isDriverRecentOrder={true}
            data={assignedData[0]}
            navigation={props.navigation}
            onStatusChange={()=> {
              loadOrderHistoryData().then(() => {});
            }}
            onPressAccept={()=> {
              
            }}
            isOngoingList={(ongoingData != undefined && ongoingData.length !== 0)}
          />
        </> : null
      }
      {ongoingData != undefined && ongoingData.length > 0 ? 
        <>
          <Text
            style={{
              ...styles.countTitleText,
              fontSize: RFPercentage(2.5),
              marginTop: 32,
            }}>
            Track Ongoing order
          </Text>
          <View style={styles.historyView}>
            <TouchableOpacity
              activeOpacity={1}
              // disabled={true}
              onPress={() =>
                props.navigation.navigate({
                  routeName: 'DriverDetailScreen',
                  params: {
                    historyStatus: 1,
                    selectedOrderData: ongoingData[0],
                  },
                })
              }>
                <View style={styles.itemRow}>
                  <Text style={styles.unSelectedStatusText}>#{ongoingData[0].data.order_id}</Text>
                  <Text style={styles.titleText}>₹ {ongoingData[0].data.price}</Text>
                </View>
                <View style={styles.textView}>
                  <Text style={styles.titleText} numberOfLines={1}>
                    {ongoingData[0].data.pickup_location.city}
                  </Text>
                  <Text style={styles.subTitleText}>-- to --</Text>
                  <Text style={styles.titleText} numberOfLines={1}>
                    {ongoingData[0].data.drop_location.city}
                  </Text>
                </View>
              </TouchableOpacity>
              <MapView
                ref={map}
                style={styles.map}
                // provider={PROVIDER_GOOGLE}
                initialRegion={getRegion}
                // showsUserLocation={true}
                // onRegionChangeComplete={onRegionChange}
                // showsMyLocationButton={true}
              >
                {getRegion.latitude != 0 && getRegion.longitude != 0 ? 
                  <Marker
                    key={"pick"}
                    coordinate={{latitude: getRegion.latitude, longitude: getRegion.longitude}}
                    image={require('../../../assets/assets/dashboard/delivery-truck.png')}
                  />
                : null }
                {dropLocation.latitude != 0 && dropLocation.longitude != 0 ? 
                  <Marker
                    key={"drop"}
                    coordinate={{latitude:parseFloat(dropLocation.latitude),longitude:parseFloat(dropLocation.longitude)}}
                  />
                : null }
                <MapViewDirections
                  origin={{latitude: getRegion.latitude, longitude: getRegion.longitude}}
                  destination={{latitude:parseFloat(dropLocation.latitude),longitude:parseFloat(dropLocation.longitude)}}
                  apikey={AppConstants.google_place_api_key}
                  strokeWidth={4}
                  strokeColor={Colors.accentColor}
                  onError={(errorMessage) => {
                      console.log(`errorMessage:`, errorMessage)
                  }}
                />
              </MapView>
          </View>
        </> : null
      }
      <Loader loading={isDriverLoading} />
    </ScrollView>
    </SafeAreaView>
  );
};

DriverDashboardScreen.navigationOptions = (navigationData) => {
  let notificationCount = navigationData.navigation.getParam('notificationCount');
  if (notificationCount == undefined || notificationCount == null) {
    notificationCount = 0
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
          }}>
          <Image
            style={styles.menuImage}
            source={require('../../../assets/assets/dashboard/ic_menu.png')}
          />
        </TouchableOpacity>
      </View>
    ),
    headerRight: (
      <View style={styles.viewHeaderRight}>
        <TouchableOpacity
          onPress={() => {
            navigationData.navigation.navigate({
              routeName: 'NotificationScreen',
            });
          }}>
          <Image
            style={styles.menuImage}
            source={require('../../../assets/assets/dashboard/notification.png')}
          />
        </TouchableOpacity>
        {notificationCount == 0 ? null : 
          <View style={{
            backgroundColor: 'red', 
            paddingHorizontal: 6, 
            paddingVertical: 2, 
            borderRadius: 12,
            right: 12,
            top: -4,
            position: 'absolute'
          }}>
            <Text style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 12
            }}>
              {notificationCount >= 100 ? '+99' : notificationCount}
            </Text>
          </View>}
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
  popupView: {
    marginTop: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 40,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 5,
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
  historyView: {
    // flex: 1,
    margin: 16,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 10,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 5,
    shadowOpacity: 0.15,
    elevation: 5,
  },
  itemRow: {
    margin: 8,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unSelectedStatusText: {
    padding: 8,
    color: Colors.primaryColor,
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Regular',
  },
  textView: {
    margin: 8,
    // marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  titleText: {
    margin: 8,
    marginBottom: 0,
    marginTop: 0,
    color: Colors.titleTextColor,
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-SemiBold',
  },
  subTitleText: {
    margin: 8,
    marginBottom: 0,
    marginTop: 0,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.8),
    color: Colors.subTitleTextColor,
  },
  map: {
    // flex: 1,
    height: 200,
    // ...StyleSheet.absoluteFillObject,
    // marginBottom: 32,
    borderTopStartRadius: 50,
    borderTopEndRadius: 50,
    borderRadius: 10,
  },
});

export default DriverDashboardScreen;
