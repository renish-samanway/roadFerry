import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import { getDistance } from 'geolib';
import React, { useEffect, useState, useRef } from 'react';
import {
  Alert,
  Dimensions, FlatList, Image, Keyboard, PermissionsAndroid, Platform, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View
} from 'react-native';
import {firebase} from '@react-native-firebase/auth';
import Geocoder from 'react-native-geocoding';
import { TouchableOpacity as RNGHTouchableOpacity } from "react-native-gesture-handler";
// Import the Plugins and Thirdparty library.
import MapView, { Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import MapViewDirections from 'react-native-maps-directions';
import { RFPercentage } from 'react-native-responsive-fontsize';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
// import TextInput from '../../../components/design/TextInput';
import GooglePlacesTextInput from '../../../components/design/GooglePlacesTextInput';
import Loader from '../../../components/design/Loader';
import LargeImage from '../../../components/design/LargeImage';
import AppConstants from '../../../helper/constants/AppConstants';
// Import the JS file.
import Colors from '../../../helper/extensions/Colors';
import AppPreference from '../../../helper/preference/AppPreference';
import * as fetchVehicleTypeListAction from '../../../store/actions/customer/addParcelDetails/getVehicleType';
import * as filterTraspoterListActions from '../../../store/actions/dashboard/filterTranspoterList';
import * as destinationSetActions from '../../../store/actions/dashboard/setDestinationValue';
import * as addressSetActions from '../../../store/actions/dashboard/setSourceValue';
import * as userListActions from '../../../store/actions/dashboard/userlist';
import NotificationCall from '../../../helper/NotificationCall';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

// Load the main class.
navigator.geolocation = require('@react-native-community/geolocation');
Geocoder.init(AppConstants.google_place_api_key);
const windowHeight = Dimensions.get('window').height;

const homePlace = {
  description: 'Home',
  geometry: { location: { lat: 22.6898, lng: 72.8567 } },
};

const _onChangeTextValue = (text) => {
  console.log(`_onChangeTextValue:`, text)
}

let watchId = null

const DashboardScreen = (props) => {
  // const addressRef = useRef();
  const map = useRef();

  const selectedOrderData = props.navigation.getParam('selectedOrderData');
  const selectedOrderDataId = props.navigation.getParam('selectedOrderDataId');
  const assignTransporterMode = props.navigation.getParam('assignTransporterMode');

  let userUID = useSelector(
    (state) => state.fetchProfileData.userUID,
  );
  // console.log(`DashboardScreen.userUID: ${userUID}`)
  const [isLoading, setIsLoading] = useState(false);
  const [isShowLargeImage, setIsShowLargeImage] = useState(false);

  const [getRegion, setGetRegion] = useState({
    latitude: 23.08571,
    longitude: 72.55132,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });
  console.log(`DashboardScreen`)
  const [source, setSource] = useState('');
  const [sourceLatLong, setSourceLatLong] = useState(
    selectedOrderData?.pickup_location?.coordinate ? {...selectedOrderData?.pickup_location?.coordinate} :
    {
      latitude: 0,
      longitude: 0,
    }
  );
  const [destination, setDestination] = useState('');
  const [destinationLatLong, setDestinationLatLong] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [distance, setDistance] = useState(`${selectedOrderData?.distance} km` || '');
  const [distanceValue, setDistanceValue] = useState('');
  useEffect(() => {
    calculatePrice()
  }, [distanceValue, selectedVehicleTypeData, sourceLatLong, destinationLatLong, weight, selectedVehicleTypeData]);
  const [price, setPrice] = useState(selectedOrderData?.price || '');

  /* useEffect(() => {
    dispatch(
      filterTraspoterListActions.newFetchFilterTransporterList(
        vehicleType,
        distanceValue
      )
    );
  }, [distanceValue, selectedVehicleTypeData, sourceLatLong, destinationLatLong, weight, selectedVehicleTypeData]); */

  const [weight, setWeight] = useState({value: '', error: ''});
  const [dimensions, setDimensions] = useState({value: '', error: ''});
  const [width, setWidth] = useState({value: '', error: ''});
  const [height, setHeight] = useState({value: '', error: ''});
  const [vehicleType, setVehicleType] = useState(selectedOrderData?.vehicle_type || 'Vehicle Type');
  const [vehicleTypeFlag, setVehicleTypeFlag] = useState(true);
  const [upperSlider, setUpperSlider] = useState(selectedOrderData ? true : false);
  const [selectedVehicleTypeData, setSelectedVehicleTypeData] = useState();
  const [longPressedData, setLongPressedData] = useState();

  const userDataList = useSelector((state) => state.allUserData.allUserData);
  /* const sourceText = useSelector(
    (state) => state.setSourceTextValue.setSourceTextValue,
  );
  const sourceLatitude = useSelector(
    (state) => state.setSourceLatitude.setSourceLatitude,
  );
  const sourceLongitude = useSelector(
    (state) => state.setSourceLongitude.setSourceLongitude,
  );
  const destinationText = useSelector(
    (state) => state.setDestinationTextValue.setDestinationTextValue,
  );
  const destinationLatitude = useSelector(
    (state) => state.setDestinationLatitude.setDestinationLatitude,
  );
  const destinationLongitude = useSelector(
    (state) => state.setDestinationLongitude.setDestinationLongitude,
  ); */

  const filterDataList = useSelector(
    (state) => state.allFilterData.allFilterData,
  );

  const filterIsLoading = useSelector(
    (state) => state.allFilterData.isLoading,
  );

  // const [filterDataList, setFilterDataList] = useState([]);
  
  const [vehicleTypeSearchList, setVehicleTypeSearchList] = useState([]);

  const vehicleTypeList = useSelector(
    (state) => state.getVehicleTypeReducer.vehicleTypeList,
  );

  const dispatch = useDispatch();
  useEffect(() => {
    getVehicleTypeList(true);
  }, [dispatch]);

  useEffect(() => {
    if(assignTransporterMode && selectedOrderData){
      setDestinationLatLong({...selectedOrderData?.drop_location?.coordinate});
      setSource(selectedOrderData?.pickup_location?.flat_name);
      setDestination(selectedOrderData?.drop_location?.flat_name);
      setWeight({value: selectedOrderData?.pickup_location?.weight, error: ''})

      getTransporterList('filter');
    }
  },[selectedOrderData])

  const getVehicleTypeList = (isStartProgress) => {
    try {
      dispatch(fetchVehicleTypeListAction.fetchVehicleTypeList(isStartProgress));
    } catch (err) {
      console.log(`fetchVehicleTypeListAction.fetchVehicleTypeList.error: ${err}`);
    }
  };

  const hasLocationPermission = async () => {
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

  const fitPadding = () => {
    console.log(`fitPadding.sourceLatLong:`, sourceLatLong)
    console.log(`fitPadding.destinationLatLong:`, destinationLatLong)
    map.current?.fitToCoordinates([sourceLatLong, destinationLatLong], {
      edgePadding: { top: 100, right: 100, bottom: windowHeight - 300, left: 100 },
      animated: true,
    });
  }

  const getCurrentLocation = async () => {
    console.log(`getCurrentLocation`)
    const checkLocationPermission = await hasLocationPermission();
    if (!checkLocationPermission) {
      return;
    }
    Geolocation.getCurrentPosition(
      position => {
        console.log(`getCurrentLocation.position:`, position)
        let latitude = position.coords['latitude'].toFixed(6);
        let longitude = position.coords['longitude'].toFixed(6);
        // console.log(`getCurrentLocation.latitude: ${typeof(latitude)}`);
        // console.log(`getCurrentLocation.longitude: ${typeof(longitude)}`);
        let coordinates = {latitude: parseFloat(latitude), longitude: parseFloat(longitude)}
        console.log(`coordinates: ${JSON.stringify(coordinates)}`)
        setGetRegion({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        });
      },
      error => {
        console.log(`getCurrentLocation.error:`,error);
      }
    );
  }

  const getLocationUpdates = async () => {
    const checkLocationPermission = await hasLocationPermission();
    if (!checkLocationPermission) {
      return;
    }
    console.log(`getLocationUpdates.1`)
    removeLocationUpdates();
    console.log(`getLocationUpdates.2`)
    watchId = Geolocation.watchPosition(
      position => {
        console.log(`getLocationUpdates.position:`, position)
        let currentLatitude = position.coords['latitude'].toFixed(6);
        let currentLongitude = position.coords['longitude'].toFixed(6);
        console.log(`getLocationUpdates.latitude: ${currentLatitude}`);
        console.log(`getLocationUpdates.longitude: ${currentLongitude}`);
        setGetRegion({
          latitude: parseFloat(currentLatitude),
          longitude: parseFloat(currentLongitude),
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        });
        
      }, error => {
        console.log(`getLocationUpdates.error:`,error);
      }
    );
  };

  const removeLocationUpdates = () => {
    if (watchId !== null) {
      // console.log(`removeLocationUpdates.this.watchId: ${watchId}`);
      Geolocation.stopObserving()
    }
  };

  useEffect(() => {
    console.log(`DashboardScreen.useEffect`)
    // getLocationUpdates()
    getCurrentLocation()
  }, []);

  /* useEffect(() => {
    // console.log(`afterChange-selectedVehicleTypeData:`, vehicleType)
    getTransporterList('near');
  }, [selectedVehicleTypeData, getRegion]); */

  const getTransporterList = (valueType) => {
    if (valueType === 'near') {
      dispatch(
        userListActions.fetchUserList(getRegion.latitude, getRegion.longitude),
      );
      dispatch({
        type: filterTraspoterListActions.IS_TRANSPORTER_LOADING,
        isLoading: false
      });
    } else {
      dispatch(
      // setFilterDataList(
        filterTraspoterListActions.newFetchFilterTransporterList(
          vehicleType,
          sourceLatLong.latitude,
          sourceLatLong.longitude,
          selectedOrderData?.rejected_transporters
        ),
      // )
      );
    }
  }

  /* const backgroundLocationTask = (valueType) => {
    // console.log('<<< BackgroundLocationTask');
    var that = this;
    //Checking for the permission just after component loaded
    if (Platform.OS === 'ios') {
      // callLocation(that);
      Geolocation.getCurrentPosition(
        //Will give you the current location
        (position) => {
          const currentLongitude = position.coords.longitude;
          //getting the Longitude from the location json
          const currentLatitude = position.coords.latitude;
          //getting the Latitude from the location json
          // console.log(
          //   '<<< LAT/LAN' + currentLatitude + ', ' + currentLongitude,
          // );
          setGetRegion({
            latitude: parseFloat(currentLatitude),
            longitude: parseFloat(currentLongitude),
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          });
          if (valueType === 'near') {
            dispatch(
              userListActions.fetchUserList(currentLatitude, currentLongitude),
            );
          } else {
            dispatch(
              filterTraspoterListActions.fetchFilterTranspoterList(
                source,
                destination,
                weight.value,
                dimensions.value,
                width.value,
                height.value,
                vehicleType,
                sourceLatLong.latitude,
                sourceLatLong.longitude,
                destinationLatLong.latitude,
                destinationLatLong.longitude,
                currentLatitude,
                currentLongitude,
              ),
            );
          }
        },
        // (error) => alert(error.message),
        // {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
      that.watchID = Geolocation.watchPosition((position) => {
        //Will give you the location on location change
        console.log(position);
        const currentLongitude = position.coords.longitude;
        //getting the Longitude from the location json
        const currentLatitude = position.coords.latitude;
        //getting the Latitude from the location json
        // console.log('<<< LAT/LAN' + currentLatitude + ', ' + currentLongitude);
        setGetRegion({
          latitude: parseFloat(currentLatitude),
          longitude: parseFloat(currentLongitude),
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        });
        if (valueType === 'near') {
          dispatch(
            userListActions.fetchUserList(currentLatitude, currentLongitude),
          );
        } else {
          dispatch(
            filterTraspoterListActions.fetchFilterTranspoterList(
              source,
              destination,
              weight.value,
              dimensions.value,
              width.value,
              height.value,
              vehicleType,
              sourceLatLong.latitude,
              sourceLatLong.longitude,
              destinationLatLong.latitude,
              destinationLatLong.longitude,
              currentLatitude,
              currentLongitude,
            ),
          );
        }
      });
    } else {
      async function requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            // callLocation(that);
            Geolocation.getCurrentPosition(
              //Will give you the current location
              (position) => {
                const currentLongitude = position.coords.longitude;
                //getting the Longitude from the location json
                const currentLatitude = position.coords.latitude;
                //getting the Latitude from the location json
                // console.log(
                //   '<<< LAT/LAN' + currentLatitude + ', ' + currentLongitude,
                // );
                setGetRegion({
                  latitude: parseFloat(currentLatitude),
                  longitude: parseFloat(currentLongitude),
                  latitudeDelta: 0.5,
                  longitudeDelta: 0.5,
                });
                if (valueType === 'near') {
                  dispatch(
                    userListActions.fetchUserList(
                      currentLatitude,
                      currentLongitude,
                    ),
                  );
                } else {
                  dispatch(
                    filterTraspoterListActions.fetchFilterTranspoterList(
                      source,
                      destination,
                      weight.value,
                      dimensions.value,
                      width.value,
                      height.value,
                      vehicleType,
                      sourceLatLong.latitude,
                      sourceLatLong.longitude,
                      destinationLatLong.latitude,
                      destinationLatLong.longitude,
                      currentLatitude,
                      currentLongitude,
                    ),
                  );
                }
              },
              // (error) => alert(error.message),
              // {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
            );
            that.watchID = Geolocation.watchPosition((position) => {
              //Will give you the location on location change
              console.log(position);
              const currentLongitude = position.coords.longitude;
              //getting the Longitude from the location json
              const currentLatitude = position.coords.latitude;
              //getting the Latitude from the location json
              // console.log(
              //   '<<< LAT/LAN' + currentLatitude + ', ' + currentLongitude,
              // );
              setGetRegion({
                latitude: parseFloat(currentLatitude),
                longitude: parseFloat(currentLongitude),
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
              });
              if (valueType === 'near') {
                dispatch(
                  userListActions.fetchUserList(
                    currentLatitude,
                    currentLongitude,
                  ),
                );
              } else {
                dispatch(
                  filterTraspoterListActions.fetchFilterTranspoterList(
                    source,
                    destination,
                    weight.value,
                    dimensions.value,
                    width.value,
                    height.value,
                    vehicleType,
                    sourceLatLong.latitude,
                    sourceLatLong.longitude,
                    destinationLatLong.latitude,
                    destinationLatLong.longitude,
                    currentLatitude,
                    currentLongitude,
                  ),
                );
              }
            });
          } else {
            Alert.alert('Permission Denied');
          }
        } catch (err) {
          Alert.alert('err', err);
          console.warn(err);
        }
      }
      requestLocationPermission();
    }
  }; */

  var _menu;
  const setMenuRef = (ref) => {
    _menu = ref;
  };

  const showMenu = () => {
    _menu.show();
  };

  const hideMenu = (popupName) => {
    _menu.hide();
    setVehicleTypeFlag(false);
    setVehicleType(popupName);
    filterTranspoterList(
      source,
      destination,
      weight.value,
      dimensions.value,
      width.value,
      height.value,
      popupName,
      sourceLatLong,
      destinationLatLong,
      '',
    );
  };

  const filterTranspoterList = (
    sourceValue,
    destinationValue,
    weightValue,
    dimensionsValue,
    widthValue,
    heightValue,
    vehicleTypeValue,
    sourceLatitudeValue,
    sourceLongitudeValue,
    destinationLatitudeValue,
    destinationLongitudeValue,
    addressType,
  ) => {
    console.log(`sourceLatitudeValue:`, sourceLatitudeValue)
    console.log(`sourceLongitudeValue:`, sourceLongitudeValue)
    console.log(`destinationLatitudeValue:`, destinationLatitudeValue)
    console.log(`destinationLongitudeValue:`, destinationLongitudeValue)
    // console.log(`destinationValue:`, destinationValue)

    setWeight({value: weightValue, error: ''});
    setDimensions({value: dimensionsValue, error: ''});
    setWidth({value: widthValue, error: ''});
    /* if (
      sourceText.length !== 0 &&
      destinationText.length !== 0 &&
      weight.value.length !== 0
    ) {
      setUpperSlider(true);
    } */
    setHeight({value: heightValue, error: ''});
    setSource(sourceValue)
    setDestination(destinationValue)
    setVehicleType(vehicleTypeValue);
    setSourceLatLong({latitude: sourceLatitudeValue, longitude: sourceLongitudeValue})
    setDestinationLatLong({latitude: destinationLatitudeValue, longitude: destinationLongitudeValue})
    // if (addressType === 'Source') {
    //   dispatch(
    //     addressSetActions.setSourceAddressValue(
    //       sourceValue,
    //       sourceLatitudeValue,
    //       sourceLongitudeValue,
    //     ),
    //   );
    // } else if (addressType === 'Destination') {
    //   dispatch(
    //     destinationSetActions.setDestinationAddressValue(
    //       destinationValue,
    //       destinationLatitudeValue,
    //       destinationLongitudeValue,
    //     ),
    //   );
    // }
    // console.log('Source lat long' + sourceLatitude + sourceLongitude);
    // console.log(
    //   'Destination lat long' + destinationLatitude + destinationLongitude,
    // );

    /* if (
      source.length !== 0 &&
      destination.length !== 0 &&
      weight.value.length !== 0 &&
      selectedVehicleTypeData
    ) {
      getTransporterList('filter');
    } */
  };

  const [selectedIndex, setSelectedIndex] = useState(100000);

  const onPressVehicle = /* (selectedID, selectedName) */ (vehicleTypeData) => {
    setSelectedVehicleTypeData(vehicleTypeData)
    // setSelectedIndex(selectedID);
    // setVehicleType(selectedName);
    console.log(`setSelectedVehicleTypeData: ${JSON.stringify(vehicleTypeData)}`)
    let dimensions = vehicleTypeData.data.dimensions.v_length
    let width = vehicleTypeData.data.dimensions.v_width
    let height = vehicleTypeData.data.dimensions.v_height

    setDimensions(dimensions)
    setWidth(width)
    setHeight(height)
    filterTranspoterList(
      source,
      destination,
      weight.value,
      dimensions,
      width,
      height,
      vehicleTypeData.data.vehicle_type,
      sourceLatLong.latitude,
      sourceLatLong.longitude,
      destinationLatLong.latitude,
      destinationLatLong.longitude,
      '',
    );
  };

  const renderVehicleData = (itemData) => {
    //console.log(`itemData: ${JSON.stringify(itemData)}`)
    //console.log(`itemData.item.data.icon: ${itemData.item.data.icon}`)
    return (
      <TouchableOpacity
        style={{alignItems: 'center', justifyContent: 'center'}}
        onPress={() => onPressVehicle(itemData.item)}
        onLongPress={() => {
          // console.log("renderVehicleData.onLongPress")
          setLongPressedData(itemData.item)
          setIsShowLargeImage(true)
        }}
      >
        <View
          style={
            selectedVehicleTypeData && selectedVehicleTypeData.id === itemData.item.id
              ? styles.selectedVehicelView
              : styles.vehicleView
          }>
          {itemData.item.data && itemData.item.data.icon ?
          <Image
            style={[styles.vehicleImage, {resizeMode : "cover"}]}
            source={{uri: itemData.item.data.icon, width: 30, height: 30}}
          />
          : <Image
            style={styles.vehicleImage}
            source={require('../../../assets/assets/dashboard/bike.png')}
          />}
          {selectedVehicleTypeData && selectedVehicleTypeData.id === itemData.item.id && (
            <View style={{flex: 1, position: 'absolute', width: 50, height: 50, justifyContent: 'center', backgroundColor: Colors.selectedIndexColor, borderRadius: 5}}>
              <Image
                style={styles.selectedVehicleIndicatorImage}
                source={require('../../../assets/assets/dashboard/click.png')}
              />
            </View>
          )}
        </View>
        <Text style={styles.vehicleNameText}>{itemData.item.data.vehicle_type}</Text>
      </TouchableOpacity>
    );
  };

  const contains = (data, query) => {
    if (data.vahicle_capacity >= query) {
        return true
    }
    return false
  }

  const checkAndClearData = (list, text) => {
    console.log(`list:`, list)
    let isClearSelectedData = true
    if (selectedVehicleTypeData != undefined) {
      for (let i = 0; i < list.length; i++) {
        let searchData = list[i];
        if (searchData.id == selectedVehicleTypeData.id) {
          isClearSelectedData = false
          break
        }
      }
    }

    if (isClearSelectedData) {
      setSelectedVehicleTypeData(undefined)
      setDimensions({value: '', error: ''});
      setWidth({value: '', error: ''});
      setHeight({value: '', error: ''});
      filterTranspoterList(
        source,
        destination,
        text,
        '',
        '',
        '',
        vehicleType,
        sourceLatLong.latitude,
        sourceLatLong.longitude,
        destinationLatLong.latitude,
        destinationLatLong.longitude,
        '',
      )
    } else {
      filterTranspoterList(
        source,
        destination,
        text,
        dimensions.value,
        width.value,
        height.value,
        vehicleType,
        sourceLatLong.latitude,
        sourceLatLong.longitude,
        destinationLatLong.latitude,
        destinationLatLong.longitude,
        '',
      )
    }
  }

  const handleFilter = text => {
    const formattedQuery = parseInt(text)
    let searchList = []
    searchList = vehicleTypeList.filter(vehicleTypeData => {
        return contains(vehicleTypeData.data, formattedQuery)
    })
    setVehicleTypeSearchList(searchList)
    /* console.log(`searchList: `, searchList)
    console.log(`vehicleTypeList: `, vehicleTypeList) */
    if (text == '') {
      checkAndClearData(vehicleTypeList, text)
    } else {
      checkAndClearData(searchList, text)
    }
    
    /* this.setState({ searchList: searchList, search: text }, () => {
        console.log(`this.state.searchList:`, this.state.searchList)
    }) */
  }

  const calculatePrice = () => {
    if (selectedVehicleTypeData == undefined) {
      return
    }
    console.log(`distance:`, distanceValue)
    console.log(`minimumRate:`, selectedVehicleTypeData.data.minimumRate)
    let minRate = 0
    if (selectedVehicleTypeData.data.minimumRate != undefined) {
      minRate = selectedVehicleTypeData.data.minimumRate
    }
    console.log(`selectedVehicleType:`, selectedVehicleTypeData.data.rates)
    let finalRate = parseFloat(minRate)
    console.log(`finalRate:`, finalRate)
    let differenceDistance = parseFloat(distanceValue)
    for (let i = 0; i < selectedVehicleTypeData.data.rates.length; i++) {
      let ratesData = selectedVehicleTypeData.data.rates[i];
      let start = parseFloat(ratesData.start)
      let end = parseFloat(ratesData.end)
      let rate = parseFloat(ratesData.rate)
      /* if (end == -1 && distance >= start) {
        finalRate = distance * rate
        break
      } else if (distance >= start && distance <= end) {
        finalRate = distance * rate
        break
      } */
      
      if (i == 0 && start == 0) {
        start = 1
      }
      if (distanceValue >= start) {
        start = start - 1
      }
      //console.log(`start:`, start)

      if ((end == -1 || distanceValue <= end || i == selectedVehicleTypeData.data.rates.length-1) && distanceValue >= start) {
        console.log(`differenceOfStart:`, distanceValue-start)
        finalRate = finalRate + ((distanceValue-start) * rate)
        break
      } else if (differenceDistance >= start) {
        differenceDistance = differenceDistance - end
        let differenceOfStartNEnd = end - start
        console.log(`differenceOfStartNEnd:`, differenceOfStartNEnd)
        finalRate = finalRate + (differenceOfStartNEnd * rate)
      }
      console.log(`finalRate:`, finalRate)
    }
    console.log(`finalRate:`, finalRate)
    setPrice(finalRate.toFixed(2))
    fitPadding()
  }

  const showVehicleList = () => {
    return (
      <FlatList
        horizontal
        keyExtractor={(item, index) => item.id}
        data={weight.value != '' ? vehicleTypeSearchList : vehicleTypeList}
        renderItem={renderVehicleData}
        showsHorizontalScrollIndicator={false}
      />
    )
  }

  const showNoVehiclesTypeView = () => {
    return(<Text style={styles.noVehicleText}>No Vehicle Types</Text>)
  }

  const transporterItemView = (item) => {
    return (
      <>
        <View style={styles.item}>
          {item.data.transporter_photo ? 
          <Image
            style={styles.itemImage}
            source={{uri: item.data.transporter_photo}}
          />
          :
          <Image
            style={styles.itemImage}
            source={require('../../../assets/assets/default_user.png')}
          />}
          {/* <Image
            style={styles.driverImage}
            // source={require('../../../assets/assets/dashboard/parcelImage.jpeg')}
            // source={{uri: `data:${itemData.item.data.driver_photo.type};base64,${itemData.item.data.driver_photo.base64.toBase64()}`}}
            source={{uri: `data:${item.data.driver_photo.type};base64,${item.data.driver_photo.base64}`}}
          /> */}
          <View>
            <Text style={styles.traspoterText}>
              {item.data.first_name} {item.data.last_name}
            </Text>
            {/* <Text style={styles.deliveryText}>
              Delivery time: 3-4 Days
            </Text> */}
          </View>
          <View style={styles.priceView}>
            <Text style={styles.priceText}>₹ {price}</Text>
            <Text style={styles.priceText}>(Approx)</Text>
          </View>
        </View>
        <View style={styles.seperateLine} />
      </>
    )
  }

  const assignNewTransporter = (transporterSelectedData) => {
    let priority = transporterSelectedData?.data?.priority;
    setIsLoading(true)
    firebase.firestore()
      .collection('users')
      .doc(transporterSelectedData?.id)
      .update({priority: priority+1})
      .then(() => {
        firebase.firestore()
        .collection('order_details')
        .doc(selectedOrderDataId)
        .update({
          transporter_uid: transporterSelectedData?.id,
          transporter_details: transporterSelectedData?.data,
          status: "pending"
        })
        .then(() => {
          setIsLoading(false);
          Alert.alert("Success", "Transporter assigned successfully")

          let parameters = {
            "userId": transporterSelectedData?.id,
            "type": "request",
            order_id: selectedOrderDataId,
            orderId: selectedOrderDataId
          }
          NotificationCall(parameters);
          props.navigation.goBack();
        }).catch(err => {
          console.log(`priority.Error.1:`, err)
          Alert.alert("","Something went wrong, Please try again.")
          setIsLoading(false)
        });
      })
      .catch(err => {
        console.log(`priority.Error.2:`, err)
        Alert.alert("","Something went wrong, Please try again.")
        setIsLoading(false)
      })
  }

  const onPressTransporterItem = (item) => {
    console.log(`AddParcelDetails`)
    AsyncStorage.getItem(AppPreference.IS_LOGIN).then((valueLogin) => {
      const isLogin = JSON.parse(valueLogin);
      console.log('Login Value is : ', isLogin);
      if (isLogin === 1) {
        if(assignTransporterMode){
          Alert.alert(
              'Confirmation',
              `Are you sure you want to assign "${item?.data?.first_name} ${item?.data?.last_name}" as transporter ?`,
              [
                {
                  text: 'Yes',
                  onPress: ()=>assignNewTransporter(item),
                },
                {
                  text: 'No',
                },
              ],
              {cancelable: true},
          );
        }
        else{
          props.navigation.navigate({
            routeName: 'AddParcelDetails',
            params: {
              source: sourceLatLong,
              destination: destinationLatLong,
              selectedData: item,
              selectedVehicleData: selectedVehicleTypeData,
              vehicle_type: vehicleType,
              price: price,
              weight: weight.value,
              dimensions: dimensions.value,
              width: width.value,
              height: height.value
            },
          });
        }
      } else {
        props.navigation.navigate('LoginScreen');
      }
    });
  }

  // Pass Latitude & Longitude of both points as a parameter
  const fetchDistanceBetweenPoints = (lat1, lng1, lat2, lng2) => {
    var urlToFetchDistance = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=' + lat1 + ',' + lng1 + '&destinations=' + lat2 + '%2C' + lng2 + '&key=' + AppConstants.google_place_api_key;// + '&mode=driving';
    console.log(`urlToFetchDistance: ${urlToFetchDistance}`)
    fetch(urlToFetchDistance)
      .then(res => {
        return res.json()
      })
      .then(res => {
        console.log(`res: ${JSON.stringify(res)}`)
        var tDistanceValue = (res.rows[0].elements[0].distance.value);
        let finalDistanceValue = (((tDistanceValue/1000) * 10) / 10).toFixed(2)
        //var distanceString = res.rows[0].elements[0].distance.text;
        setDistance(`${finalDistanceValue} km`)
        console.log(`tDistanceValue: ${tDistanceValue}`)
        setDistanceValue(finalDistanceValue)
        // console.log(`distanceValue: ${distanceValue}`)
        // calculatePrice()
        getTransporterList('filter');
      })
      .catch(error => {
        console.log("Problem occurred: ", error);
        dispatch({
          type: filterTraspoterListActions.IS_TRANSPORTER_LOADING,
          isLoading: false
        });
      });
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={map}
        style={styles.map}
        // provider={PROVIDER_GOOGLE}
        initialRegion={getRegion}
        // showsUserLocation={true}
        // onRegionChangeComplete={onRegionChange}
        // showsMyLocationButton={true}
      >
        {/* {userDataList.map((marker, index) => {
          // console.log(`marker.data.address:`, marker.data.address)
          // console.log(`typeof(marker.data.address.coordinates.latitude):`, typeof(marker.data.address.coordinates.latitude))
          // console.log(`typeof(marker.data.address.coordinates.longitude):`, typeof(marker.data.address.coordinates.longitude))
          let coordinates = {latitude: parseFloat(marker.data.address.coordinates.latitude), longitude: parseFloat(marker.data.address.coordinates.longitude)}
          return (
            <Marker
              key={index}
              coordinate={coordinates}
              image={require('../../../assets/assets/dashboard/delivery-truck.png')}
              // title={marker.address.title}
              // description={marker.description}
            />
          )}
        )} */}
        {sourceLatLong.latitude != 0 && sourceLatLong.longitude != 0 ? 
          <Marker
            key={"pick"}
            coordinate={sourceLatLong}
            image={require('../../../assets/assets/dashboard/delivery-truck.png')}
            // title={marker.address.title}
            // description={marker.description}
          />
        : null }
        {destinationLatLong.latitude != 0 && destinationLatLong.longitude != 0 ? 
          <Marker
            key={"drop"}
            coordinate={destinationLatLong}
            // image={require('../../../assets/assets/dashboard/delivery-truck.png')}
            // title={marker.address.title}
            // description={marker.description}
          />
        : null }
        <MapViewDirections
          origin={sourceLatLong}
          destination={destinationLatLong}
          apikey={AppConstants.google_place_api_key}
          strokeWidth={4}
          strokeColor={Colors.accentColor}
          onError={(errorMessage) => {
            console.log(`errorMessage:`, errorMessage)
          }}
        />
      </MapView>
      {/* <View style={styles.markerFixed}>
        <Image
          style={styles.marker}
          source={require('../../../assets/assets/dashboard/markerpin.png')}
        />
      </View> */}
      {upperSlider ? (
        <View style={styles.upperTrackingView}>
          <View style={{margin: 8, flexDirection: 'row'}}>
            <Text
              style={{...styles.traspoterText, flex: 1, textAlign: 'center', alignSelf: 'center'}}
            >
              {source}
            </Text>
            <Text style={[styles.deliveryText, {alignSelf: 'center'}]}>-- to --</Text>
            <Text
              style={{...styles.traspoterText, flex: 1, textAlign: 'center', alignSelf: 'center'}}
            >
              {destination}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.upperPanelView}
            onPress={() => assignTransporterMode ? {} : setUpperSlider(false)}>
            <View style={styles.panelHandle} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.trackingView}>
          <View style={styles.rowView}>
            <Image
              style={styles.pickupImage}
              source={require('../../../assets/assets/dashboard/pickup.png')}
            />
            <GooglePlacesTextInput
              // ref={ref => (addressRef = ref)}
              placeholder="Pickup Location"
              setAddressText={source}
              /* textInputProps={{
                onChangeText:(_onChangeTextValue)
              }} */
              soureValue={(data, getLat, getLong, allData, allDetails) => {
                console.log(`Pickup Location data: ${JSON.stringify(data)}`)
                dispatch(
                  addressSetActions.setSourceAddressValue(
                    data,
                    getLat,
                    getLong,
                    {data: allData, details: allDetails}
                  ),
                );
                filterTranspoterList(
                  data,
                  destination,
                  weight.value,
                  dimensions.value,
                  width.value,
                  height.value,
                  vehicleType,
                  getLat,
                  getLong,
                  destinationLatLong.latitude,
                  destinationLatLong.longitude,
                  'Source',
                );
              }}
              // currentLocation={true}
              // currentLocationLabel='Current location'
              // predefinedPlaces={[homePlace]}
              renderRightButton={() => {
                return (
                  <TouchableOpacity onPress={() => {
                    setIsLoading(true)
                    Geocoder.from(getRegion.latitude, getRegion.longitude)
                      .then(json => {
                        setIsLoading(false)
                        // console.log(`Geocoder.json: ${JSON.stringify(json)}`)
                        // var addressComponent = json.results[0].address_components[0];
                        // console.log(addressComponent);
                        if (json && json.results && json.results[0] && json.results[0].formatted_address) {
                          let formattedAddress = json.results[0].formatted_address
                          console.log(`Pickup Location: ${json.results[0].formatted_address}`)
                          // setSource(formattedAddress)
                          // addressRef.setAddressText(formattedAddress);
                          dispatch(
                            addressSetActions.setSourceAddressValue(
                              formattedAddress,
                              getRegion.latitude,
                              getRegion.longitude,
                              {details: json.results[0], data: {
                                place_id: json.results[0].place_id,
                              }}
                            ),
                          );
                          filterTranspoterList(
                            formattedAddress,
                            destination,
                            weight.value,
                            dimensions.value,
                            width.value,
                            height.value,
                            vehicleType,
                            getRegion.latitude,
                            getRegion.longitude,
                            destinationLatLong.latitude,
                            destinationLatLong.longitude,
                            'Source',
                          );
                        }
                      })
                      .catch(error => {
                        setIsLoading(false)
                        console.warn(error)
                      });
                  }}>
                    <MaterialCommunityIcons
                      style={{ alignSelf: 'flex-start', marginLeft: 8, marginRight: -8, marginTop: 10 }}
                      name={'crosshairs-gps'}
                      size={24}
                      color={Colors.primaryColor}
                    />
                  </TouchableOpacity>
                )
              }}
            />
            {/* <MaterialCommunityIcons
              style={{ alignSelf: 'flex-start', marginLeft: 8, marginRight: -8, marginTop: 10 }}
              name={'crosshairs-gps'}
              size={24}
              color={Colors.primaryColor}
            /> */}
          </View>
          <View style={styles.rowView}>
            <Image
              style={styles.pickupImage}
              source={require('../../../assets/assets/dashboard/destination.png')}
            />
            <GooglePlacesTextInput
              placeholder="Destination"
              setAddressText={destination}
              destinationValue={(data, getLat, getLong, allData, allDetails) => {
                console.log('Destination data:', allData);
                console.log('Destination details:', allDetails);
                dispatch(
                  destinationSetActions.setDestinationAddressValue(
                    data,
                    getLat,
                    getLong,
                    {data: allData, details: allDetails}
                  ),
                );
                filterTranspoterList(
                  source,
                  data,
                  weight.value,
                  dimensions.value,
                  width.value,
                  height.value,
                  vehicleType,
                  sourceLatLong.latitude,
                  sourceLatLong.longitude,
                  getLat,
                  getLong,
                  'Destination',
                );
              }}
            />
          </View>

          <View style={styles.viewInputText}>
            <TextInput
              style={styles.weightInputText}
              placeholder="Weight"
              returnKeyType="next"
              value={weight.value}
              onChangeText={(text) => {
                handleFilter(text)
              }}
              error={!!weight.error}
              errorText={weight.error}
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="decimal-pad"
              ref={(ref) => {
                // this._weightinput = ref;
              }}
              onSubmitEditing={() => {
                // this._dimensioninput && this._dimensioninput.focus()
              }}
            />
            <View style={styles.lineView} />
            <View style={styles.viewKG}>
              <Text style={styles.textKG}>Tons</Text>
            </View>
          </View>
          <View style={{marginLeft: 55}}>
            <Text style={styles.vehicleText}>Select Vehicle</Text>
            {weight.value != '' ? 
              vehicleTypeSearchList && vehicleTypeSearchList.length != 0 ? 
                showVehicleList() : showNoVehiclesTypeView()
              : vehicleTypeList && vehicleTypeList.length != 0 ? 
                showVehicleList() : showNoVehiclesTypeView()
            }
          </View>
          <View style={styles.dimentionView}>
            <TextInput
              style={styles.widthInputText}
              placeholder="123 feet"
              returnKeyType="next"
              value={dimensions.value}
              editable={false}
              onChangeText={(text) =>
                filterTranspoterList(
                  source,
                  destination,
                  weight.value,
                  text,
                  width.value,
                  height.value,
                  vehicleType,
                  sourceLatLong.latitude,
                  sourceLatLong.longitude,
                  destinationLatLong.latitude,
                  destinationLatLong.longitude,
                  '',
                )
              }
              error={!!dimensions.error}
              errorText={dimensions.error}
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="number-pad"
              ref={(ref) => {
                // this._dimensioninput = ref;
              }}
              onSubmitEditing={() =>
                this._widthinput && this._widthinput.focus()
              }
            />
            <Text style={{...styles.textKG, color: Colors.subViewBGColor}}>
              X
            </Text>
            <TextInput
              style={styles.widthInputText}
              placeholder="Width"
              returnKeyType="next"
              value={width.value}
              editable={false}
              onChangeText={(text) =>
                filterTranspoterList(
                  source,
                  destination,
                  weight.value,
                  dimensions.value,
                  text,
                  height.value,
                  vehicleType,
                  sourceLatLong.latitude,
                  sourceLatLong.longitude,
                  destinationLatLong.latitude,
                  destinationLatLong.longitude,
                  '',
                )
              }
              error={!!width.error}
              errorText={width.error}
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="number-pad"
              ref={(ref) => {
                // this._widthinput = ref;
              }}
              onSubmitEditing={() =>
                this._heightinput && this._heightinput.focus()
              }
            />
            <Text style={{...styles.textKG, color: Colors.subViewBGColor}}>
              X
            </Text>
            <TextInput
              style={styles.widthInputText}
              placeholder="Height"
              returnKeyType="next"
              value={height.value}
              editable={false}
              onChangeText={(text) =>
                filterTranspoterList(
                  source,
                  destination,
                  weight.value,
                  dimensions.value,
                  width.value,
                  text,
                  vehicleType,
                  sourceLatLong.latitude,
                  sourceLatLong.longitude,
                  destinationLatLong.latitude,
                  destinationLatLong.longitude,
                  '',
                )
              }
              error={!!height.error}
              errorText={height.error}
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="number-pad"
              ref={(ref) => {
                // this._heightinput = ref;
              }}
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>
          <TouchableOpacity
            style={styles.buttonView}
            onPress={() => {
              // console.log(`selectedVehicleTypeData:`, selectedVehicleTypeData)
              console.log(`onPress-selectedVehicleTypeData:`, vehicleType)
              if (
                source.length !== 0 &&
                destination.length !== 0 &&
                weight.value.length !== 0 &&
                weight.value > 0 &&
                selectedVehicleTypeData
              ) {
                // console.log(`sourceLatLong: ${JSON.stringify(sourceLatLong)}`)
                // console.log(`destinationLatLong: ${JSON.stringify(destinationLatLong)}`)
                // let distance = parseInt(getDistance({latitude: sourceLatLong.latitude, longitude: sourceLatLong.longitude}, {latitude: destinationLatLong.latitude, longitude: destinationLatLong.longitude}) / 1000)
                // let distance = parseInt(getDistance({latitude: 21.884957993378286, longitude: 73.5034902941858}, {latitude: 22.32264811629811, longitude:73.17939362263893}, 0.01)/ 1000)
                // let distance = parseInt(getPreciseDistance({latitude: 21.884957993378286, longitude: 73.5034902941858}, {latitude: 22.32264811629811, longitude:73.17939362263893}, 0.01)/ 1000)
                // setDistance(distance)
                dispatch({
                  type: filterTraspoterListActions.IS_TRANSPORTER_LOADING,
                  isLoading: true
                });
                fetchDistanceBetweenPoints(sourceLatLong.latitude, sourceLatLong.longitude, destinationLatLong.latitude, destinationLatLong.longitude)
                setUpperSlider(true);
              } else {
                if (source.length == 0) {
                  Alert.alert("", "Please select pickup location.")
                } else if (destination.length == 0) {
                  Alert.alert("", "Please select destination location.")
                } else if (weight.value.length == 0) {
                  Alert.alert("", "Please fill weight value.")
                } else if (weight.value <= 0) {
                  Alert.alert("", "Please fill weight value more then 0.")
                } else if (!selectedVehicleTypeData) {
                  Alert.alert("", "Please select vehicle type.")
                } else {
                  Alert.alert("", "Please fill required details.")
                }
              }
            }}>
            <Text style={styles.buttonText}>SEARCH</Text>
          </TouchableOpacity>
          {/* <Menu
            ref={(ref) => setMenuRef(ref)}
            button={
              <TouchableOpacity style={styles.popupView} onPress={showMenu}>
                <Text
                  style={
                    !vehicleTypeFlag
                      ? styles.popupTextUnSelected
                      : styles.popupTextSelected
                  }>
                  {vehicleType}
                </Text>
              </TouchableOpacity>
            }>
            <View style={styles.contectMenu}>
              <MenuItem onPress={() => hideMenu('Truck')}>Truck</MenuItem>
              <MenuItem onPress={() => hideMenu('Truck')}>
                <Text style={{color: 'white'}}>
                  {
                    '                                                                             '
                  }
                </Text>
              </MenuItem>
            </View>
            <MenuItem onPress={() => hideMenu('Tempo')}>Tempo</MenuItem>
            <MenuItem onPress={() => hideMenu('Eicher')}>Eicher</MenuItem>
            <MenuItem onPress={() => hideMenu('Utility')}>Utility</MenuItem>
            <MenuItem onPress={() => hideMenu('Bolero')}>Bolero</MenuItem>
          </Menu> */}
        </View>
      )}
      {
      source.length !== 0 &&
        destination.length !== 0 &&
        weight.value.length !== 0 &&
        upperSlider && (
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
                  <Text style={styles.distanceText}>{distance}</Text>
                </View>
              </View>
            )}
            data={
              filterDataList?.length > 0
              ?
              filterDataList
              :
              (!isLoading && !filterIsLoading)
              ?
              [{noTransporterAvailable: true}]
              :
              []
            }
            keyExtractor={(i) => i}
            renderItem={({item}) => {
              if(item.noTransporterAvailable){
                return <View><Text>No transporters available</Text></View>
              }
              return AppConstants.isAndroid ? 
              (
                <RNGHTouchableOpacity
                  onPress={() => {
                    onPressTransporterItem(item)
                  }}>
                  {transporterItemView(item)}
                </RNGHTouchableOpacity>
              )
              :
              (
                <TouchableOpacity
                  onPress={() => {
                    onPressTransporterItem(item)
                  }}>
                  {transporterItemView(item)}
                </TouchableOpacity>
              )
            }}
            contentContainerStyle={styles.contentContainerStyle}
          />
        )}
      <Loader loading={isLoading || filterIsLoading} />
      <LargeImage showLargeImage={isShowLargeImage} onClosePressed={() => {
        setIsShowLargeImage(false)
      }} vehicleData={longPressedData} />
    </View>
  );
};

DashboardScreen.navigationOptions = (navigationData) => {
  return {
    headerShown: true,
    // headerTitle: 'Dashboard',
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
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
            navigationData.navigation.pop();
          }}>
          <Image
            style={styles.menuImage}
            source={require('../../../assets/assets/Authentication/back.png')}
          />
        </TouchableOpacity>
      </View>
    ),
    // headerRight: (
    //   <View style={styles.viewHeaderRight}>
    //     <TouchableOpacity
    //       onPress={() => {
    //         navigationData.navigation.navigate({
    //           routeName: 'NotificationScreen',
    //         });
    //       }}>
    //       <Image
    //         style={styles.menuImage}
    //         source={require('../../../assets/assets/dashboard/notification.png')}
    //       />
    //     </TouchableOpacity>
    //   </View>
    // ),
  };
};

// Set the components styles.

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  map: {
    // flex: 1,
    height: Dimensions.get('window').height,
    // ...StyleSheet.absoluteFillObject,
  },
  markerFixed: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Dimensions.get('window').height / -2.0,
  },
  marker: {
    height: 48,
    width: 48,
    resizeMode: 'contain',
  },
  trackingView: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    backgroundColor: Colors.backgroundColor,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
  },
  upperTrackingView: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundColor,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
  },
  rowView: {
    flexDirection: 'row',
    margin: 16,
    marginBottom: -8,
    alignItems: 'center',
  },
  pickupImage: {
    height: 30,
    width: 30,
  },
  viewInputText: {
    marginTop: 16,
    marginLeft: 55,
    flexDirection: 'row',
    width: Dimensions.get('window').width - 68,
    alignItems: 'center',
    // justifyContent: 'space-between',
    backgroundColor: Colors.subViewBGColor,
    borderRadius: 10,
  },
  weightInputText: {
    paddingLeft: 12,
    paddingRight: 16,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Regular',
    color: Colors.titleTextColor,
    height: 45,
    width: Dimensions.get('window').width - 150,
    // borderRadius: 5,
  },
  popupView: {
    margin: 16,
    marginLeft: 55,
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 45,
    backgroundColor: Colors.subViewBGColor,
    borderRadius: 5,
  },
  popupTextUnSelected: {
    marginLeft: 12,
    marginRight: 12,
    color: Colors.titleTextColor,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
  },
  popupTextSelected: {
    marginLeft: 12,
    marginRight: 12,
    color: 'darkgray',
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
  },
  contectMenu: {
    marginTop: 16,
    flexDirection: 'row',
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
  },
  panelHandle: {
    width: 35,
    height: 3,
    backgroundColor: Colors.subViewBGColor,
    borderRadius: 4,
  },
  item: {
    flexDirection: 'row',
    // alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
    // marginVertical: 8,
  },
  traspoterText: {
    marginLeft: 8,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(1.5),
    color: Colors.textColor,
  },
  deliveryText: {
    marginLeft: 8,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.8),
    color: Colors.subTitleTextColor,
  },
  priceView: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  priceText: {
    // padding: 8,
    // paddingTop: 0,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
  },
  vehicleText: {
    marginTop: 16,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.8),
    color: '#9DA4BB',
  },
  noVehicleText: {
    marginTop: 16,
    marginBottom: 24,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
  },
  lineView: {
    width: 1,
    height: 45,
    backgroundColor: Colors.subViewBGColor,
  },
  viewKG: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textKG: {
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    color: '#9DA4BB',
  },
  dimentionView: {
    marginTop: 0,
    marginBottom: 16,
    marginLeft: 55,
    flexDirection: 'row',
    width: Dimensions.get('window').width - 68,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  widthInputText: {
    paddingLeft: 12,
    paddingRight: 16,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Regular',
    color: Colors.titleTextColor,
    height: 45,
    width: Dimensions.get('window').width / 3 - 48,
    backgroundColor: Colors.subViewBGColor,
    borderRadius: 10,
    textAlign: 'center',
  },
  distanceView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // margin: 16,
    backgroundColor: Colors.backgroundColor,
    // height: 30,
  },
  distanceText: {
    paddingLeft: 16,
    paddingRight: 16,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
  },
  itemImage: {
    height: 50,
    width: 60,
    // marginLeft: 16,
    // resizeMode: 'contain',
    borderRadius: 10,
  },
  itemRow: {
    flex: 1,
    alignItems: 'center',
  },
  seperateLine: {
    backgroundColor: Colors.subViewBGColor,
    height: 1,
    marginTop: 16,
    marginBottom: 16,
    marginLeft: -16,
    marginRight: -16,
  },
  upperPanelView: {
    marginTop: -16,
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleView: {
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: '#9DA4BB',
    borderWidth: 0.5,
    height: 50,
    width: 50,
  },
  selectedVehicelView: {
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: '#9DA4BB',
    borderWidth: 0.5,
    height: 50,
    width: 50,
  },
  vehicleImage: {
    height: 50,
    width: 50,
    borderRadius: 5,
    resizeMode: 'contain'
  },
  selectedVehicleIndicatorImage: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  vehicleNameText: {
    marginBottom: 16,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.5),
    color: '#9DA4BB',
    textAlign: 'center',
  },
  buttonView: {
    margin: 16,
    marginTop: 0,
    width: 200,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Medium',
    backgroundColor: Colors.buttonColor,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 30,
  },
  buttonText: {
    fontFamily: 'SofiaPro-Medium',
    color: Colors.backgroundColor,
    fontSize: RFPercentage(2),
  },
});

export default DashboardScreen;
