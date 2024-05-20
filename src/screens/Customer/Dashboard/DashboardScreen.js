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
  Keyboard,
  FlatList,
} from 'react-native';
import {useSelector, useDispatch, connect} from 'react-redux';

// Import the Plugins and Thirdparty library.

import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import Menu, {MenuItem} from 'react-native-material-menu';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';
import Geolocation from '@react-native-community/geolocation';

import * as userListActions from '../../../store/actions/dashboard/userlist';
import * as addressSetActions from '../../../store/actions/dashboard/setSourceValue';
import * as destinationSetActions from '../../../store/actions/dashboard/setDestinationValue';
import * as filterTraspoterListActions from '../../../store/actions/dashboard/filterTranspoterList';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
// import TextInput from '../../../components/design/TextInput';
import GooglePlacesTextInput from '../../../components/design/GooglePlacesTextInput';
import {VehicleData} from '../../../helper/extensions/dummyData';

// Load the main class.

const windowHeight = Dimensions.get('window').height;

const DashboardScreen = (props) => {
  const [getRegion, setGetRegion] = useState({
    latitude: 23.08571,
    longitude: 72.55132,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });
  const [source, setSource] = useState('');
  const [sourceLatLong, setSourceLatLong] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [destination, setDestination] = useState('');
  const [destinationLatLong, setDestinationLatLong] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [weight, setWeight] = useState({value: '', error: ''});
  const [dimensions, setDimensions] = useState({value: '', error: ''});
  const [width, setWidth] = useState({value: '', error: ''});
  const [height, setHeight] = useState({value: '', error: ''});
  const [vehicleType, setVehicleType] = useState('Vehicle Type');
  const [vehicleTypeFlag, setVehicleTypeFlag] = useState(true);
  const [upperSlider, setUpperSlider] = useState(false);

  const userDataList = useSelector((state) => state.allUserData.allUserData);
  const sourceText = useSelector(
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
  );
  const filterDataList = useSelector(
    (state) => state.allFilterData.allFilterData,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    try {
      setInterval(async () => {
        backgroundLocationTask('near');
      }, 60000);
    } catch (err) {
      console.log('Error is : ', err);
    }
    // BackgroundLocationTask();
  }, []);

  const backgroundLocationTask = (valueType) => {
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
            latitude: currentLatitude,
            longitude: currentLongitude,
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
                sourceText,
                destinationText,
                weight.value,
                dimensions.value,
                width.value,
                height.value,
                vehicleType,
                sourceLatitude,
                sourceLongitude,
                destinationLatitude,
                destinationLongitude,
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
          latitude: currentLatitude,
          longitude: currentLongitude,
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
              sourceText,
              destinationText,
              weight.value,
              dimensions.value,
              width.value,
              height.value,
              vehicleType,
              sourceLatitude,
              sourceLongitude,
              destinationLatitude,
              destinationLongitude,
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
                  latitude: currentLatitude,
                  longitude: currentLongitude,
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
                      sourceText,
                      destinationText,
                      weight.value,
                      dimensions.value,
                      width.value,
                      height.value,
                      vehicleType,
                      sourceLatitude,
                      sourceLongitude,
                      destinationLatitude,
                      destinationLongitude,
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
                latitude: currentLatitude,
                longitude: currentLongitude,
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
                    sourceText,
                    destinationText,
                    weight.value,
                    dimensions.value,
                    width.value,
                    height.value,
                    vehicleType,
                    sourceLatitude,
                    sourceLongitude,
                    destinationLatitude,
                    destinationLongitude,
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
  };

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
    setWeight({value: weightValue, error: ''});
    setDimensions({value: dimensionsValue, error: ''});
    setWidth({value: widthValue, error: ''});
    if (
      sourceText.length !== 0 &&
      destinationText.length !== 0 &&
      weight.value.length !== 0
    ) {
      setUpperSlider(true);
    }
    setHeight({value: heightValue, error: ''});
    setVehicleType(vehicleTypeValue);
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

    if (
      sourceText.length !== 0 &&
      destinationText.length !== 0 &&
      weight.value.length !== 0
    ) {
      backgroundLocationTask('filter');
    }
  };

  const [selectedIndex, setSelectedIndex] = useState(100000);

  const onPressVehicle = (selectedID, selectedName) => {
    setSelectedIndex(selectedID);
    setVehicleType(selectedName);
    filterTranspoterList(
      sourceText,
      destinationText,
      weight.value,
      dimensions.value,
      width.value,
      height.value,
      selectedName,
      sourceLatitude,
      sourceLongitude,
      destinationLatitude,
      destinationLongitude,
      '',
    );
  };

  const renderVehicleData = (itemData) => {
    return (
      <TouchableOpacity
        style={{alignItems: 'center', justifyContent: 'center'}}
        onPress={() => onPressVehicle(itemData.item.id, itemData.item.name)}>
        <View
          style={
            selectedIndex === itemData.item.id
              ? styles.selectedVehicelView
              : styles.vehicleView
          }>
          <Image
            style={styles.vehicleImage}
            source={itemData.item.itemImageUrl}
          />
          {selectedIndex === itemData.item.id && (
            <View style={{flex: 1, position: 'absolute'}}>
              <Image
                style={styles.vehicleImage}
                source={require('../../../assets/assets/dashboard/click.png')}
              />
            </View>
          )}
        </View>
        <Text style={styles.vehicleNameText}>{itemData.item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        // provider={PROVIDER_GOOGLE}
        initialRegion={getRegion}
        showsUserLocation={true}
        // onRegionChangeComplete={onRegionChange}
        showsMyLocationButton={true}>
        {userDataList.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.data.address.coordinates}
            image={require('../../../assets/assets/dashboard/delivery-truck.png')}
            // title={marker.address.title}
            // description={marker.description}
          />
        ))}
      </MapView>
      <View style={styles.markerFixed}>
        <Image
          style={styles.marker}
          source={require('../../../assets/assets/dashboard/markerpin.png')}
        />
      </View>
      {upperSlider ? (
        <View style={styles.upperTrackingView}>
          <View style={{margin: 16, flexDirection: 'row'}}>
            <Text
              style={{...styles.traspoterText, width: 120}}
              numberOfLines={1}>
              {sourceText}
            </Text>
            <Text style={styles.deliveryText}>-- to --</Text>
            <Text
              style={{...styles.traspoterText, width: 120}}
              numberOfLines={1}>
              {destinationText}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.upperPanelView}
            onPress={() => setUpperSlider(false)}>
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
              placeholder="Pickup Location"
              soureValue={(data, getLat, getLong) => {
                dispatch(
                  addressSetActions.setSourceAddressValue(
                    data,
                    getLat,
                    getLong,
                  ),
                );
                filterTranspoterList(
                  sourceText,
                  data,
                  weight.value,
                  dimensions.value,
                  width.value,
                  height.value,
                  vehicleType,
                  getLat,
                  getLong,
                  destinationLatitude,
                  destinationLongitude,
                  'Source',
                );
              }}
            />
          </View>
          <View style={styles.rowView}>
            <Image
              style={styles.pickupImage}
              source={require('../../../assets/assets/dashboard/destination.png')}
            />
            <GooglePlacesTextInput
              placeholder="Destination"
              destinationValue={(data, getLat, getLong) => {
                dispatch(
                  destinationSetActions.setDestinationAddressValue(
                    data,
                    getLat,
                    getLong,
                  ),
                );
                filterTranspoterList(
                  data,
                  destinationText,
                  weight.value,
                  dimensions.value,
                  width.value,
                  height.value,
                  vehicleType,
                  sourceLatitude,
                  sourceLongitude,
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
              onChangeText={(text) =>
                filterTranspoterList(
                  sourceText,
                  destinationText,
                  text,
                  dimensions.value,
                  width.value,
                  height.value,
                  vehicleType,
                  sourceLatitude,
                  sourceLongitude,
                  destinationLatitude,
                  destinationLongitude,
                  '',
                )
              }
              error={!!weight.error}
              errorText={weight.error}
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="number-pad"
              ref={(ref) => {
                this._weightinput = ref;
              }}
              onSubmitEditing={() =>
                this._dimensioninput && this._dimensioninput.focus()
              }
            />
            <View style={styles.lineView} />
            <View style={styles.viewKG}>
              <Text style={styles.textKG}>KG</Text>
            </View>
          </View>
          <View style={styles.dimentionView}>
            <TextInput
              style={styles.widthInputText}
              placeholder="123 cm"
              returnKeyType="next"
              value={dimensions.value}
              onChangeText={(text) =>
                filterTranspoterList(
                  sourceText,
                  destinationText,
                  weight.value,
                  text,
                  width.value,
                  height.value,
                  vehicleType,
                  sourceLatitude,
                  sourceLongitude,
                  destinationLatitude,
                  destinationLongitude,
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
                this._dimensioninput = ref;
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
              onChangeText={(text) =>
                filterTranspoterList(
                  sourceText,
                  destinationText,
                  weight.value,
                  dimensions.value,
                  text,
                  height.value,
                  vehicleType,
                  sourceLatitude,
                  sourceLongitude,
                  destinationLatitude,
                  destinationLongitude,
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
                this._widthinput = ref;
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
              onChangeText={(text) =>
                filterTranspoterList(
                  sourceText,
                  destinationText,
                  weight.value,
                  dimensions.value,
                  width.value,
                  text,
                  vehicleType,
                  sourceLatitude,
                  sourceLongitude,
                  destinationLatitude,
                  destinationLongitude,
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
                this._heightinput = ref;
              }}
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>
          <View style={{marginLeft: 55}}>
            <Text style={styles.vehicleText}>Select Vehicle</Text>
            <FlatList
              horizontal
              keyExtractor={(item, index) => item.id}
              data={VehicleData}
              renderItem={renderVehicleData}
              showsHorizontalScrollIndicator={false}
            />
          </View>
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
      {sourceText.length !== 0 &&
        destinationText.length !== 0 &&
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
                  <Text style={styles.distanceText}>294 KM</Text>
                </View>
              </View>
            )}
            data={filterDataList}
            keyExtractor={(i) => i}
            renderItem={({item}) => (
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
                    <Text style={styles.traspoterText}>
                      {item.data.first_name}
                    </Text>
                    <Text style={styles.deliveryText}>
                      Delivery time: 3-4 Days
                    </Text>
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
        )}
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
    marginTop: Dimensions.get('window').height / -1.8,
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
    fontSize: RFPercentage(2),
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
    marginTop: 16,
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
    backgroundColor: Colors.selectedIndexColor,
    opacity: 0.53,
  },
  vehicleImage: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
  vehicleNameText: {
    marginBottom: 16,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.5),
    color: '#9DA4BB',
    textAlign: 'center',
  },
});

export default DashboardScreen;
