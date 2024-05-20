import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image, Keyboard,
  KeyboardAvoidingView, SafeAreaView,
  ScrollView, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Menu, { MenuItem } from 'react-native-material-menu';
import { TextInput as Input } from 'react-native-paper';
// Import the Plugins and Thirdparty library.
import { RFPercentage } from 'react-native-responsive-fontsize';
import StepIndicator from 'react-native-step-indicator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationActions, StackActions } from 'react-navigation';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/design/Loader';
import TextInput from '../../components/design/TextInput';
import UploadImage from '../../components/transpoter/Drivers/UploadImage';
import AppConstants from '../../helper/constants/AppConstants';
import { customStyles, seconds } from '../../helper/Data';
// Import the JS file.
import Colors from '../../helper/extensions/Colors';
import {
  ageValidator, areaValidator, chasisNumberValidator, cityValidator, commentValidator, countryValidator, emailValidator, flatNameValidator, lastNameValidator, nameValidator, phoneValidator, pinCodeValidator, stateValidator, vehicleNumberValidator, vehiclePhotsValidator, vehicleTypeValidator
} from '../../helper/extensions/Validator';
import AppPreference from '../../helper/preference/AppPreference';
import * as fetchTransporterDataAction from '../../store/actions/customer/orderHistory/getTrasporterData';
import * as fetchProfileDataActions from '../../store/actions/customer/profile/fetchProfileData';
import * as fetchVehicleTypeListAction from '../../store/actions/transporter/vehicle/getVehicleType';

const stepLabels = ["Transporter\nDetails", "Driver\nDetails", "Verification", "Vehicle\nDetails"];

const resetDriverDashboardAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "DriverDashboard" })]
});

const resetDashboardAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "Dashboard" })]
});

const data = [
  { label: 'Item 1', value: { id: '1', title: 'abc' }},
  { label: 'Item 2', value: { id: '2', title: 'xyz' }},
  { label: 'Item 3', value: { id: '3', title: 'pqr' }}
];

// Load the main class.
const TransporterRegistration = (props) => {
  // const opacityLevel = 0.6
  const ref = useRef();
  const scrollRef = useRef();

  const transporterData = useSelector(
    (state) => state.transporterData.transporterData,
  );
  // console.log(`transporterData: ${JSON.stringify(transporterData)}`)

  const isLoading = useSelector(
    (state) => state.transporterData.isLoading,
  );

  /* let userUID = useSelector(
    (state) => state.fetchProfileData.userUID,
  ); */
  // let userUID = "0bnZWHiSGPZD50UpZRRc8sBwIpk2"
  let userUID = props.navigation.getParam('user_id');
  // console.log(`TransporterRegistration.userUID: ${userUID}`)

  let isShowBackButton = props.navigation.getParam('is_show_back_button');

  const dispatch = useDispatch();
  useEffect(() => {
    // setIsLoading(true);
    fetchTransporterData(true);
  }, [dispatch]);

  const profileData = useSelector(
    (state) => state.fetchProfileData.fetchProfileData,
  );

  const fetchProfileData = useCallback(async () => {
    try {
      dispatch(fetchProfileDataActions.fetchProfileData(userUID));
    } catch (err) {
      console.log('Error is : ', err);
    }
  }, [dispatch]);

  useEffect(() => {
    // setIsLoading(true);
    fetchProfileData().then(() => {
      // setIsLoading(false);
      // console.log(`profileData:`, profileData)
    });
  }, [dispatch, fetchProfileData]);

  const fetchTransporterData = (isLoading) => {
    try {
      dispatch(fetchTransporterDataAction.getTransporterData(userUID, isLoading));
    } catch (err) {
      console.log('Error is : ', err);
    }
  };

  /* useEffect(() => {
    const willFocusSub = props.navigation.addListener('willFocus', () => {
      console.log(`ProfileScreen.willFocus`)
      fetchProfileData().then(() => {
      });
    });

    return () => {
      willFocusSub.remove();
    };
  }, [fetchProfileData]); */


  const statusAddAddress = props.navigation.getParam('statusAddAddress');
  // console.log('statusAddAddress', statusAddAddress);

  let isEdit = props.navigation.getParam('isEdit');
  if (isEdit === undefined) {
    isEdit = false
  }
  // props.navigation.setParams({ isEdit: isEdit })

  let driverData = undefined 
  // props.navigation.setOptions({ title: 'Add Driver' })
  if (isEdit) {
    driverData = props.navigation.getParam('driverData');
    // props.navigation.setOptions({ title: 'Edit Driver' })
  }

  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);

  // ! transporter details
  let nameValue = {value: '', error: ''}
  let lastNameValue = {value: '', error: ''}
  let emailValue = {value: '', error: ''}
  let phoneValue = {value: '', error: ''}
  let passwordValue = {value: '', error: ''}
  let coordinatesValue = {latitude: 0.0, longitude: 0.0}

  const [name, setName] = useState(nameValue);
  const [lastName, setLastName] = useState(lastNameValue);
  const [email, setEmail] = useState(emailValue);
  const [phone, setPhone] = useState(phoneValue);
  const [password, setPassword] = useState(passwordValue);
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [flatname, setFlatName] = useState({value: '', error: ''});
  const [area, setArea] = useState({value: '', error: ''});
  const [city, setCity] = useState({value: '', error: ''});
  const [state, setState] = useState({value: '', error: ''});
  const [country, setCountry] = useState({value: '', error: ''});
  const [pincode, setPincode] = useState({value: '', error: ''});
  const [registerNumber, setRegisterNumber] = useState({value: '', error: ''});
  const [GSTNumber, setGSTNumber] = useState({value: '', error: ''});
  //const [coordinates, setCoordinates] = useState(coordinatesValue);

  var coordinates = coordinatesValue

  function setCoordinates({latitude, longitude}) {
    coordinates = {latitude: latitude, longitude: longitude}
  }
  
  useEffect(() => {
    // setIsLoading(true);
    if (transporterData && transporterData != undefined && transporterData.length != 0) {
      setName({value: transporterData.first_name, error: ''})
      setLastName({value: transporterData.last_name, error: ''})
      setEmail({value: !transporterData.email ? '' : transporterData.email, error: ''})
      setPhone({value: transporterData.phone_number, error: ''})
      setRegisterNumber({value: !transporterData.register_number ? '' : transporterData.register_number ? transporterData.register_number : '', error: ''})
      setGSTNumber({value: !transporterData.gst_number ? '' : transporterData.gst_number, error: ''})

      if (transporterData.address) {
        console.log(`useEffect.transporterData.address: ${JSON.stringify(transporterData.address)}`)
        ref.current?.setAddressText(transporterData.address.flat_number);
        setFlatName({value: transporterData.address.flat_number, error: ''})
        setArea({value: transporterData.address.area, error: ''})
        setCity({value: transporterData.address.city, error: ''})
        setState({value: transporterData.address.state, error: ''})
        setCountry({value: transporterData.address.country, error: ''})
        setPincode({value: transporterData.address.pincode, error: ''})
        setCoordinates(transporterData.address.coordinates)
      }

      if (transporterData.completed_step_index && transporterData.completed_step_index != -1) {
        console.log(`transporterData.completed_step_index`)
        if (transporterData.transporter_as_driver) {
          setCurrentPosition(transporterData.completed_step_index+1)
        } else {
          setCurrentPosition(transporterData.completed_step_index)
        }
      } else {
        console.log(`transporterData.completed_step_index.else`)
      }
    }
  }, [transporterData]);

  // ! driver details
  let nameDriverValue = {value: '', error: ''}
  let lastNameDriverValue = {value: '', error: ''}
  let emailDriverValue = {value: '', error: ''}
  let phoneDriverValue = {value: '', error: ''}
  let ageValue = {value: '', error: ''}

  const [transporterAsDriver, setTransporterAsDriver] = useState(false);
  const [driverName, setDriverName] = useState(nameDriverValue);
  const [driverLastName, setDriverLastName] = useState(lastNameDriverValue);
  const [driverEmail, setDriverEmail] = useState(emailDriverValue);
  const [driverPhone, setDriverPhone] = useState(phoneDriverValue);
  const [age, setAge] = useState(ageValue);
  // const [lastNameInputRef, setLastNameInputRef] = React.useState(null);
  const lastNameInputRef = useRef(null);
  const [addressProof, setAddressProof] = useState({data: {}, error: ''});
  const [addressProofBack,setAddressProofBack] = useState({data:{},error:''})
  const [identityProof, setIdentityProof] = useState({data: {}, error: ''});
  const [driverPhoto, setDriverPhoto] = useState({data: {}, error: ''});

  const [otp, setOtp] = useState({value: '', error: ''});
  const [isResendNow, setIsResendNow] = useState(false)
  const [timer, setTimer] = useState(0)
  const [confirm, setConfirm] = useState(null);
  const [uID, setUID] = useState(null);

  let clockCall = null

  // ! vehicle details
  let vehicleTypeValue = {value: '', error: ''}
  let vehicleNumberValue = {value: '', error: ''}
  let chassisNumberValue = {value: '', error: ''}
  let commentValue = {value: '', error: ''}
  let vehiclePhotosValue = {value: '', error: ''}
  let vehicleTypeFlagValue = true

  const vehicleTypeList = useSelector(
    (state) => state.getVehicleTypeReducer.vehicleTypeList,
  );

  // const dispatch = useDispatch();
  useEffect(() => {
    getVehicleTypeList(true);
  }, [dispatch]);

  const getVehicleTypeList = (isStartProgress) => {
    try {
      dispatch(fetchVehicleTypeListAction.fetchVehicleTypeList(isStartProgress));
    } catch (err) {
      console.log(`fetchVehicleTypeListAction.fetchVehicleTypeList.error: ${err}`);
    }
  };

  const [vehicleType, setVehicleType] = useState(vehicleTypeValue);
  const [vehicleNumber, setVehicleNumber] = useState(vehicleNumberValue);
  const [chasisNumber, setChassisNumber] = useState(chassisNumberValue);
  const [comments, setComments] = useState(commentValue);
  const [vehiclePhotos, setVehiclePhotos] = useState(vehiclePhotosValue);
  const [vehicleTypeFlag, setVehicleTypeFlag] = useState(vehicleTypeFlagValue);

  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const updateTransporterData = () => {
    let tTransporterData = transporterData
    tTransporterData.created_at = new Date()
    tTransporterData.driver_count = 0
    tTransporterData.email = email.value
    // tTransporterData.fcm_token = ""
    tTransporterData.first_name = name.value
    tTransporterData.gst_number = GSTNumber.value
    tTransporterData.is_assign = false
    tTransporterData.status = false
    tTransporterData.is_verified = 'pending'
    tTransporterData.is_deleted = false
    tTransporterData.is_request = false
    tTransporterData.last_name = lastName.value
    tTransporterData.phone_number = phone.value
    tTransporterData.country_code = AppConstants.country_code
    tTransporterData.priority = 1
    tTransporterData.reason = ""
    tTransporterData.register_number = registerNumber.value
    tTransporterData.completed_step_index = 1
    let addressData =  {}
    addressData.area = area.value
    addressData.city = city.value
    addressData.country = country.value
    addressData.flat_number = ref ? ref.current?.getAddressText() : flatname.value
    addressData.pincode = pincode.value
    addressData.state = state.value
    addressData.coordinates = coordinates
    tTransporterData.address = addressData
    // console.log(`tTransporterData: ${JSON.stringify(tTransporterData)}`)
    // console.log(`userUID: ${userUID}`)
    // return
    if (!isLocalLoading) {
      setIsLocalLoading(true)
    }
    firestore()
      .collection('users')
      .doc(userUID)
      .update(tTransporterData)
      .then(() => {
        console.log(`users.updated`)
        setIsLocalLoading(false)
        setCurrentPosition(currentPosition+1)
        if (scrollRef) {
          scrollRef.current?.scrollTo({
            y: 0,
            animated: false,
          });
        }
      })
      .catch(error => {
        console.log(`users.error:`,error)
        setIsLocalLoading(false)
      })
  }

  setDriverData = () => {
    if (transporterData && transporterData != undefined && transporterData.length != 0) {
      if (!transporterAsDriver) {
        setDriverName({value: name.value, error: ''})
        setDriverLastName({value: lastName.value, error: ''})
        setDriverEmail({value: email.value, error: ''})
        setDriverPhone({value: phone.value, error: ''})
      } else {
        setDriverName({value: '', error: ''})
        setDriverLastName({value: '', error: ''})
        setDriverEmail({value: '', error: ''})
        setDriverPhone({value: '', error: ''})
      }
    }
  }

  useEffect(() => {
    if (transporterData && transporterData != undefined && transporterData.length != 0) {
      if (transporterAsDriver) {
        setDriverName({value: transporterData.first_name, error: ''})
        setDriverLastName({value: transporterData.last_name, error: ''})
        setDriverEmail({value: transporterData.email, error: ''})
        setDriverPhone({value: transporterData.phone_number, error: ''})
      } else {
        setDriverName({value: '', error: ''})
        setDriverLastName({value: '', error: ''})
        setDriverEmail({value: '', error: ''})
        setDriverPhone({value: '', error: ''})
      }
    }
  }, [transporterAsDriver])

  const fetchCoordinatesFromAddress = (formattedAddress) => {
    var urlToFetchCoordinate = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + formattedAddress + '&key=' + AppConstants.google_place_api_key;// + '&mode=driving';
    console.log(`urlToFetchCoordinate: ${urlToFetchCoordinate}`)
    setIsLocalLoading(true)
    fetch(urlToFetchCoordinate)
      .then(res => {
        return res.json()
      })
      .then(res => {
        // console.log("fetchCoordinatesFromAddress.res ", res);
        if (res.status == "OK") {
          if (res.results.length != 0) {
            let geometry = res.results[0].geometry
            console.log(`geometry: ${JSON.stringify(geometry)}`);
            console.log(`latitude: ${geometry.location.lat.toFixed(6)}`)
            setCoordinates({ latitude: geometry.location.lat.toFixed(6), longitude: geometry.location.lng.toFixed(6) })
            /* setTimeout(()=> {
              console.log(`coordinates: ${JSON.stringify(coordinates)}`);
            }, 1000) */
            updateTransporterData()
          }
        }
      })
      .catch(error => {
        console.log("Problem occurred: ", error);
        setIsLocalLoading(false)
      });
  }

  const onPressStep1 = () => {
    console.log(`profileData: ${JSON.stringify(profileData)}`)
    console.log(`fetchProfileData: ${JSON.stringify(fetchProfileData)}`)
    
    // return
    const nameError = nameValidator(name.value);
    const lastNameError = lastNameValidator(lastName.value);
    const phoneError = phoneValidator(phone.value);
    // const emailError = emailValidator(email.value);
    // const passwordError = passwordValidator(password.value);

    const flatNameError = flatNameValidator(ref ? ref.current?.getAddressText() : flatname.value);
    const areaError = areaValidator(area.value);
    const cityError = cityValidator(city.value);
    const stateError = stateValidator(state.value);
    const countryError = countryValidator(country.value);
    const pincodeError = pinCodeValidator(pincode.value);

    if (nameError) {
      setName({...name, error: nameError});
      return;
    } else if (lastNameError) {
      setLastName({...lastName, error: lastNameError});
      return;
    } else if (phoneError) {
      setPhone({...phone, error: phoneError});
      return;
    } /* else if (emailError) {
      setEmail({...email, error: emailError});
      return;
    } */ /* else if (passwordError) {
      setPassword({...password, error: passwordError});
      return;
    } */ else if (flatNameError) {
      setFlatName({...flatname, error: flatNameError});
      return;
    } else if (areaError) {
      setArea({...area, error: areaError});
      return;
    } else if (cityError) {
      setCity({...city, error: cityError});
      return;
    } else if (stateError) {
      setState({...state, error: stateError});
      return;
    } else if (countryError) {
      setCountry({...country, error: countryError});
      return;
    } else if (pincodeError) {
      setPincode({...pincode, error: pincodeError});
      return;
    } else {
      // setCurrentPosition(currentPosition+1)
      console.log(`coordinates.latitude: ${coordinates.latitude}`)
      console.log(`coordinates.longitude: ${coordinates.longitude}`)
      if (coordinates.latitude != 0 && coordinates.longitude != 0) {
        // updateTransporterData()
      } else {
        var formattedAddress = `${flatname.value}, ${area.value}, ${city.value}, ${state.value} ${pincode.value}, ${country.value}`
        fetchCoordinatesFromAddress(formattedAddress)
      }
      
    }
  }

  const invalid = () => {
    Alert.alert(
      'Alert',
      'User already registered. Please try again with different number.',
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  }

  const onPressStep2 = () => {
    const nameError = nameValidator(driverName.value);
    const lastNameError = lastNameValidator(driverLastName.value);
    const phoneError = phoneValidator(driverPhone.value);
    const emailError = emailValidator(driverEmail.value);
    const ageError = ageValidator(age.value);
    
    console.log(`error: ${nameError}`)

    if (nameError) {
      setDriverName({...driverName, error: nameError});
      return;
    } else if (lastNameError) {
      setDriverLastName({...driverLastName, error: lastNameError});
      return;
    } else if (phoneError) {
      setDriverPhone({...driverPhone, error: phoneError});
      return;
    } /* else if (emailError) {
      setDriverEmail({...driverEmail, error: emailError});
      return;
    } */ else if (ageError) {
      setAge({...age, error: ageError});
      return;
    } else if (addressProof.data && Object.keys(addressProof.data).length == 0) {
      setAddressProof({...addressProof, error: 'Please upload Address Proof Front page'});
      return;
    }
    else if(addressProofBack.data && Object.keys(addressProofBack.data).length == 0){
      setAddressProofBack({...addressProofBack,error:'Please upload Address Proof Back page'})
      return
    } 
    else if (identityProof.data && Object.keys(identityProof.data).length == 0) {
      setIdentityProof({
        ...identityProof,
        error: 'Please upload Identity Proof',
      });
      return;
    } else if (driverPhoto.data && Object.keys(driverPhoto.data).length == 0) {
      setDriverPhoto({...driverPhoto, error: 'Please upload Driver Photo'});
      return;
    } else {
      if (scrollRef) {
        scrollRef.current?.scrollTo({
          y: 0,
          animated: false,
        });
      }
      if (transporterAsDriver) {
        saveDriverDetails()
      } else {
        setIsLocalLoading(true)
        firestore()
        .collection('users')
        .where('user_type', 'in', ['transporter', 'Transporter', 'driver', 'Driver'])
        .where('phone_number', '==', driverPhone.value)
        .where('is_deleted','==',false)
        .get()
        .then(querySnapshot => {
          console.log('Total users: ', querySnapshot.size);
          setIsLocalLoading(false);
          if (querySnapshot.size != 0) {
            setTimeout(() => {
              invalid()
            }, 100)
          } else {
            startTimer()
            let phoneNumberWithCode = `${AppConstants.country_code} ${driverPhone.value}`
            signInWithPhoneNumber(phoneNumberWithCode, false)
          }
        }).catch(error => {
          setIsLocalLoading(false)
          console.error(error)
        });
      }
    }
  }

  const saveVehicleDetails = async () => {
    setIsLocalLoading(true)

    firestore()
      .collection('vehicle_details')
      .where('vehicle_number', '==', vehicleNumber.value)
      .get()
      .then(querySnapshot => {
        console.log('Total users: ', querySnapshot.size);
        if (querySnapshot.size == 0) {
          firestore()
            .collection('vehicle_details')
            .where('chassis_number', '==', chasisNumber.value)
            .get()
            .then(async querySnapshot => {
              console.log('Total users: ', querySnapshot.size);
              if (querySnapshot.size == 0) {
                let vehiclePhotosList = []
                for (let index = 0; index < vehiclePhotos.value.length; index++) {
                  let data = vehiclePhotos.value[index];
                  // console.log(`data: ${JSON.stringify(data)}`)
                  // dataObject.base64 = firestore.Blob.fromBase64String(data.base64)
                  let fileURL = ''
                  if (typeof(data) == 'string') {
                    fileURL = data
                  } else {
                    let ref = await storage().ref(data.fileName)
                    await ref.putFile(data.uri)
                    fileURL = await ref.getDownloadURL()
                  }
                  console.log(`fileURL:`, fileURL)
                  // dataObject.base64 = data.base64
                  // dataObject.type = data.type
                  vehiclePhotosList.push(fileURL)
                  console.log(`finish`)
                }
                
                let vehicleDataObject = {
                  vehicle_type: vehicleType.value,
                  vehicle_number: vehicleNumber.value,
                  chassis_number: chasisNumber.value,
                  comment: comments.value,
                  // device_details: AppConstants.device_details,
                  vehicle_photos: vehiclePhotosList,
                  is_assign: false,
                  is_verified: 'pending',
                  status: false,
                  is_deleted: false,
                  created_at: new Date()
                }

                AsyncStorage.getItem(AppPreference.FCM_TOKEN).then((fcmToken) => {
                  if (fcmToken == null) {
                    setIsLocalLoading(false)
                    console.log(`Token Getting Null`)
                  } else {
                    firestore()
                    .collection('users')
                    .doc(userUID)
                    .update({ completed_step_index: -1, is_registered: true, fcm_token: fcmToken })

                    const ref = firestore().collection('users').doc(userUID).collection('vehicle_details');
                    ref.add({...vehicleDataObject}).then((response) => {
                      console.log(`response.user.uid:`, response.id)
                      const addVehicleDetailsRef = firestore().collection('vehicle_details').doc(response.id);
                      addVehicleDetailsRef.set({...vehicleDataObject});
                    });

                    firestore()
                      .collection('users')
                      .doc(userUID)
                      .get()
                      .then(querySnapshot => {
                        let loadedProfileData = querySnapshot.data();
                        console.log('loadedProfileData Data : ', loadedProfileData);

                        AsyncStorage.setItem(AppPreference.IS_LOGIN, '1');
                        AsyncStorage.setItem(AppPreference.LOGIN_UID, userUID);
                        let tProfileData = JSON.parse(JSON.stringify(loadedProfileData))
                        tProfileData.is_registered = true
                        AsyncStorage.setItem(
                          AppPreference.LOGIN_USER_DATA,
                          JSON.stringify(tProfileData),
                        ).then(() => {
                          dispatch({
                            type: fetchProfileDataActions.FETCH_PROFILE_DATA,
                            fetchProfileData: tProfileData,
                            userUID: userUID
                          });
                          props.navigation.dispatch(resetDashboardAction)
                        })
                      });
                    
                      setIsLocalLoading(false)
                      console.log(`Success`)
                  }
                })
                
              } else {
                setChassisNumber({...chasisNumber, error: "Chassis number is already exists!"});
                setIsLocalLoading(false);
              }
            }).catch(error => {
              setIsLocalLoading(false)
              console.error(error)
            });
        } else {
          setVehicleNumber({...vehicleNumber, error: "Vehicle number is already exists!"});
          setIsLocalLoading(false);
        }
      }).catch(error => {
        setIsLocalLoading(false)
        console.error(error)
      });
      // setIsLoading(false);
      // props.navigation.pop()
      // goBack()
      /* props.navigation.navigate({
        routeName: 'Dashboard',
      }); */
  }
  
  const saveDriverDetails = async (newUserID) => {
    setIsLocalLoading(true)
    let addressProofURL = ''
    if (typeof(addressProof.data) === 'string') {
      addressProofURL = addressProof.data
    } else {
      // console.log(`addressProof.data:`, addressProof.data)
      let ref = await storage().ref(addressProof.data.fileName)
      await ref.putFile(addressProof.data.uri)
      addressProofURL = await ref.getDownloadURL()
      console.log(`addressProofURL:`, addressProofURL)
    }

    let addressProofBackURL = ''
      if(typeof (addressProofBack.data) === 'string'){
        addressProofBackURL = addressProofBack.data
      }
      else{
        let ref = await storage().ref(addressProofBack.data.fileName)
        await ref.putFile(addressProofBack.data.uri)
        addressProofBackURL = await ref.getDownloadURL()
        console.log(`addressProofURL:`, addressProofBackURL)
      }

    let identityProofURL = ''
    if (typeof(identityProof.data) === 'string') {
      identityProofURL = identityProof.data
    } else {
      let ref = await storage().ref(identityProof.data.fileName)
      await ref.putFile(identityProof.data.uri)
      identityProofURL = await ref.getDownloadURL()
      console.log(`identityProofURL:`, identityProofURL)
    }

    let driverPhotoURL = ''
    if (typeof(driverPhoto.data) === 'string') {
      driverPhotoURL = driverPhoto.data
    } else {
      let ref = await storage().ref(driverPhoto.data.fileName)
      await ref.putFile(driverPhoto.data.uri)
      driverPhotoURL = await ref.getDownloadURL()
      console.log(`driverPhotoURL:`, driverPhotoURL)
    }

    let password = Math.random().toString(36).slice(-8);
    let driverData = {
      first_name: driverName.value,
      last_name: driverLastName.value,
      email: driverEmail.value,
      phone_number: driverPhone.value,
      country_code: AppConstants.country_code,
      age: age.value,
      address_proof: addressProofURL,
      identity_proof: identityProofURL,
      driver_photo: driverPhotoURL,
      transporter_as_driver: transporterAsDriver,
      address_proof_back: addressProofBackURL
    }
    
    // driverData.temp_password = password
    driverData.is_assign = false
    driverData.status = false
    driverData.is_deleted = false
    driverData.created_at = new Date()
    if (!transporterAsDriver) {
      driverData.is_verified = 'pending'
    } else {
      driverData.is_verified = 'verified'
    }
    // console.log(`driverData.fromBase64String: ${JSON.stringify(driverData.driver_photo)}`)
    // console.log(`driverData.toBase64: ${driverData.driver_photo.toBase64()}`)
    // return
    let driverCount = transporterData.driver_count
    if (!driverCount) {
      driverCount = 0
    }
    if (transporterAsDriver) {
      firestore()
      .collection('users')
      .doc(userUID)
      .update({ ...driverData, driver_count: driverCount+1, completed_step_index: currentPosition+2, is_request: true })
    } else {
      firestore()
      .collection('users')
      .doc(userUID)
      .update({ driver_count: driverCount+1, completed_step_index: currentPosition+1, is_request: true })
      console.log(`uID: ${newUserID}`)
      firestore()
        .collection('users')
        .doc(newUserID)
        .set({...driverData, user_type: 'driver', transporter_uid: userUID})
    }
    
    if (transporterAsDriver) {
      setCurrentPosition(currentPosition+2)
    } else {
      setCurrentPosition(currentPosition+1)
    }
    const ref = firestore().collection('users').doc(userUID).collection('driver_details');
    ref.add({...driverData, user_uid: transporterAsDriver ? userUID : newUserID});
    setIsLocalLoading(false)
  }

  onPressSubmit = async () => {
    const vehicleTypeError = vehicleTypeValidator(vehicleType.value);
    const vehicleNumberError = vehicleNumberValidator(vehicleNumber.value);
    const chasisNumberError = chasisNumberValidator(chasisNumber.value);
    const commentsError = commentValidator(comments.value);
    const vehiclePhotosError = vehiclePhotsValidator(vehiclePhotos.value);

    if (vehicleTypeError) {
      setVehicleType({...vehicleType, error: vehicleTypeError});
      return;
    } else if (vehicleNumberError) {
      setVehicleNumber({...vehicleNumber, error: vehicleNumberError});
      return;
    } else if (chasisNumberError) {
      setChassisNumber({...chasisNumber, error: chasisNumberError});
      return;
    } /* else if (commentsError) {
      setComments({...comments, error: commentsError});
      return;
    } */ else if (vehiclePhotosError) {
      setVehiclePhotos({...vehiclePhotos, error: vehiclePhotosError});
      return;
    } else {
      saveVehicleDetails()
      /* auth()
        .createUserWithEmailAndPassword(email.value, password)
        .then((response) => {
          saveDriverAndVehicleDetails(response)
        })
        .catch((error) => {
          // setIsLoading(false);
          console.log('Error is : ', error.code);
          console.log('Please login with Email with password account');
          Alert.alert(
            'Alert',
            'Email id already exist.Please login',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
        }); */
    }
  }

  onPageChange = (position) => {
    if (scrollRef) {
      scrollRef.current?.scrollTo({
        y: 0,
        animated: false,
      });
    }
    if (currentPosition > position) {
      setCurrentPosition(position)
    }
  }

  var _menu;
  const setMenuRef = (ref) => {
    _menu = ref;
  };

  const showMenu = () => {
    _menu.show();
  };

  const hideMenu = (popupName) => {
    _menu.hide();
    console.log(`popupName:`, popupName)
    setVehicleTypeFlag(false);
    setVehicleType({value: popupName, error: ''})
  };

  const setMenuItems = () => {
    if (!vehicleTypeList) {
      return
    }
    // console.log(`vehicleTypeList:`, vehicleTypeList)
    let menuItemList = []
    for (let i = 0; i < vehicleTypeList.length; i++) {
      let vehicleTypeData = vehicleTypeList[i];
      menuItemList.push(
        <MenuItem
          onPress={() => {
            hideMenu(vehicleTypeData.data.vehicle_type)
          }}>
            {vehicleTypeData.data.vehicle_type}
        </MenuItem>
      )
    }
    // console.log(`menuItemList:`, menuItemList)
    return menuItemList
  }

  const saveImageData = (imageType, response) => {
    // imageType is for tap index
    // console.log(`response:`, response)
    let tVehiclePhotos = [...vehiclePhotos.value]
    if (vehiclePhotos.value.length <= imageType-1) {
      tVehiclePhotos.push(response)
    } else {
      tVehiclePhotos[imageType-1] = response
    }
    setVehiclePhotos({ value: tVehiclePhotos, error: '' })
  };

  const saveDriverImageData = (imageType, response) => {
    //imageType => 1 for Address Proof, 2 for Identity Proof, 3 for Driver Photo
    // console.log(`imageType: ${imageType}`);
    // console.log(`response: ${JSON.stringify(response)}`);
    if (imageType == 1) {
      setAddressProof({data: response, error: ''});
    }
    else if(imageType == 4){
      setAddressProofBack({data:response,error:''})
    } 
    else if (imageType == 2) {
      setIdentityProof({data: response, error: ''});
    } else if (imageType == 3) {
      setDriverPhoto({data: response, error: ''});
    }
  };

  const addMultipleUploadImageView = () => {
    let uploadImageViewList = []
    for (let i = 0; i < vehiclePhotos.value.length; i++) {
      const photoData = vehiclePhotos.value[i];
      uploadImageViewList.push(
        <View style={{ flexDirection: 'row' }}>
          <UploadImage 
            titleName="Vehicle Photo" 
            titleShow={true}
            imageType={i+1}
            saveImageData={saveImageData}
            data={photoData}
            isEdit={isEdit}
            // isVerified={isVerified}
            isVehicle={true}
          />
          {<TouchableOpacity 
            style={{ borderRadius: 32, padding: 2, backgroundColor: 'black', position: 'absolute', top: 42, right: 6 }}
            onPress={() => {
              vehiclePhotos.value.splice(i, 1)
              setVehiclePhotos({ value: vehiclePhotos.value, error: '' })
            }}>
            <Icon name="close" size={24} color={'white'} style={{ }} />
          </TouchableOpacity>}
        </View>
      )
    }
    // console.log(`vehiclePhotos.value.length: ${vehiclePhotos.value.length}`)
    if (vehiclePhotos.value.length < 5) {
      uploadImageViewList.push(
        <UploadImage
          titleName=""
          titleShow={true}
          imageType={vehiclePhotos.value.length+1}
          saveImageData={saveImageData}
          data={undefined}
          isEdit={isEdit}
        />
      )
    }
    return uploadImageViewList
  }

  const transporterRegistrationScreenView = () => {
    return (
      <SafeAreaView style={[styles.container]}>
        <View style={{ marginTop: 16, marginBottom: 8 }}>
          <StepIndicator
            customStyles={customStyles}
            currentPosition={currentPosition}
            labels={stepLabels}
            stepCount={stepLabels.length}
            renderLabel={({position, stepStatus, label, currentPosition}) => {
              return (
                <Text style={[position == currentPosition ? styles.registerText : styles.haveAnAccountText, {marginTop: 8}]}>
                  {stepLabels[position]}
                </Text>
              )
            }}
            // onPress={onPageChange}
          />
        </View>
        <ScrollView 
          ref={scrollRef}
          style={styles.container}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{ paddingVertical: 12 }}
          // automaticallyAdjustContentInsets={false}
          showsVerticalScrollIndicator={false}>
            <Loader loading={isLoading || isLocalLoading} />
            {currentPosition == 0 ?
              step1View() 
            : currentPosition == 1 ?
              step2View()
            : currentPosition == 2 ?
            step3View() : step4View()}
        </ScrollView>
      </SafeAreaView>
    )
  }

  const changePwdType = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onPressAddressItem = (data, details) => {
    console.log(`data: ${JSON.stringify(data)}`)
    console.log(`details: ${JSON.stringify(details)}`)
    var componentList = details.adr_address.split(', ');

    let flatDetails = ''  // ? extended-address
    let area = ''         // ? street-address
    let city = ''         // ? locality
    let state = ''        // ? region
    let country = ''      // ? country-name
    let pincode = ''      // ? postal-code

    for (const component of details.address_components) {
      const componentType = component.types[0];
  
      switch (componentType) {
        case "street_number": {
          flatDetails = `${component.long_name}`;
          break;
        }
  
        /* case "route": {
          flatDetails += component.short_name;
          break;
        } */

        case "sublocality_level_2": {
          flatDetails = flatDetails === '' ? '' : `${flatDetails}, ` + `${component.long_name}`;
          break;
        }
  
        case "route": {
          area += component.long_name;
          break;
        }
  
        case "postal_code_suffix": {
          pincode = `${pincode}-${component.long_name}`;
          break;
        }

        case "locality": {
          city = component.long_name;
          break;
        }

        case "administrative_area_level_1": {
          state = component.short_name;
          break;
        }

        case "country": {
          country = component.long_name;
          break;
        }

        case "postal_code": {
          pincode = `${component.long_name}${pincode}`;
          break;
        }
      }
    }
    if(flatDetails!=undefined && flatDetails!=null && flatDetails!=''){
      ref.current?.setAddressText(flatDetails);
      setFlatName({value: flatDetails, error: ''})
    }
    else{
      ref.current?.setAddressText(details.name)
      setFlatName({value:details.name,error:''})
    }
    setArea({value: area, error: ''})
    setCity({value: city, error: ''})
    setState({value: state, error: ''})
    setCountry({value: country, error: ''})
    setPincode({value: pincode, error: ''})
    setCoordinates({ latitude: details.geometry.location.lat.toFixed(6), longitude: details.geometry.location.lng.toFixed(6) })

    console.log(`onPressAddressItem.coordinates: ${JSON.stringify(coordinates)}`)
    // if (ref) {
    //   ref.current?.setAddressText(flatDetails);
    // }
  }

  const step1View = () => {
    return (
      <>
        <View style={{padding: 16, paddingTop: 0}}>
          <TextInput
            //   style={styles.nameInputText}
            label="First Name"
            returnKeyType="next"
            value={name.value}
            onChangeText={(text) => setName({value: text, error: ''})}
            // editable={!isVerified}
            error={!!name.error}
            errorText={name.error}
            autoCapitalize="words"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            // blurOnSubmit={false}
            ref={(ref) => {
              this._nameinput = ref;
            }}
            onSubmitEditing={() => {
              console.log(`lastNameInputRef: `, lastNameInputRef)
              /* if (lastNameInputRef != null) {
                lastNameInputRef.current._root.focus()
              } */
            }}
          />
          <TextInput
            ref={lastNameInputRef}
            label="Last Name"
            returnKeyType="next"
            value={lastName.value}
            onChangeText={(text) => setLastName({value: text, error: ''})}
            // editable={!isVerified}
            error={!!lastName.error}
            errorText={lastName.error}
            autoCapitalize="words"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            onSubmitEditing={() => this._emailinput && this._emailinput.focus()}
          />
          <TextInput
            //   style={styles.phoneInputText}
            label="Phone"
            returnKeyType="next"
            value={phone.value}
            onChangeText={(text) => setPhone({value: text, error: ''})}
            error={!!phone.error}
            errorText={phone.error}
            autoCapitalize="none"
            autoCompleteType="tel"
            textContentType="telephoneNumber"
            maxLength={10}
            keyboardType="phone-pad"
            editable={false}
            left={<Input.Affix customTextStyle={{ marginRight: 12 }} text={`${AppConstants.country_code} `} />}
            style={{ opacity: AppConstants.opacityLevel, backgroundColor: 'white' }}
            ref={(ref) => {
              this._phoneinput = ref;
            }}
            onSubmitEditing={() => this._ageinput && this._ageinput.focus()}
          />
          <TextInput
            //   style={styles.emailInputText}
            label="Email"
            returnKeyType="next"
            value={email.value}
            onChangeText={(text) => setEmail({value: text, error: ''})}
            // editable={!isVerified}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            ref={(ref) => {
              this._emailinput = ref;
            }}
            onSubmitEditing={() => this._phoneinput && this._phoneinput.focus()}
          />
          {/* <PasswordTextInput
            style={styles.passwordInputText}
            label="Password"
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) => setPassword({value: text, error: ''})}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry={passwordVisible}
            ref={(ref) => {
              this._passwordinput = ref;
            }}
            onSubmitEditing={Keyboard.dismiss}
            changePwdType={() => changePwdType()}
            imageName={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
          /> */}

          {/* <TextInput
            //   style={styles.nameInputText}
            label="Flat name or Number"
            returnKeyType="next"
            value={flatname.value}
            onChangeText={(text) => setFlatName({value: text, error: ''})}
            error={!!flatname.error}
            errorText={flatname.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            ref={(ref) => {
              this._flatinput = ref;
            }}
            onSubmitEditing={() => this._areainput && this._areainput.focus()}
          /> */}

          <ScrollView 
            horizontal={true}
            style={{ flex: 1, paddingTop: 16 ,paddingBottom: 12 }}
            contentContainerStyle={{ flex: 1 }}
            keyboardShouldPersistTaps='always'
          >
            <View style={{ flex: 1 }}>
              <GooglePlacesAutocomplete
                ref={ref}
                placeholder={"Flat name or Number"}
                minLength={3}
                returnKeyType={'next'}
                listViewDisplayed="auto"
                fetchDetails={true}
                keyboardShouldPersistTaps='always'
                onPress={onPressAddressItem}
                onNotFound={() => {
                  console.log(`onNotFound`)
                }}
                query={{
                  key: AppConstants.google_place_api_key,
                  language: 'en',
                  components: 'country:in'
                }}
                enablePoweredByContainer={false}
                styles={{
                  textInputContainer: {
                    height: 60,
                    borderRadius: 4
                  },
                  textInput: {
                    height: 60,
                    color: Colors.textColor,
                    fontSize: RFPercentage(2.4),
                    // fontFamily: 'SofiaPro-Regular',
                    backgroundColor: Colors.surfaceColor,
                    borderRadius: 4,
                    borderWidth: 1
                  }
                }}
              />
              {flatname.error != '' ? <Text style={styles.error}>{flatname.error}</Text> : null}
            </View>
          </ScrollView>

          <TextInput
            //   style={styles.nameInputText}
            label="Area"
            returnKeyType="next"
            value={area.value}
            onChangeText={(text) => setArea({value: text, error: ''})}
            error={!!area.error}
            errorText={area.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            ref={(ref) => {
              this._areainput = ref;
            }}
            onSubmitEditing={() => this._cityinput && this._cityinput.focus()}
          />
          <TextInput
            //   style={styles.nameInputText}
            label="City or Town"
            returnKeyType="next"
            value={city.value}
            onChangeText={(text) => setCity({value: text, error: ''})}
            error={!!city.error}
            errorText={city.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            ref={(ref) => {
              this._cityinput = ref;
            }}
            onSubmitEditing={() => this._stateinput && this._stateinput.focus()}
          />
          <TextInput
            //   style={styles.nameInputText}
            label="State"
            returnKeyType="next"
            value={state.value}
            onChangeText={(text) => setState({value: text, error: ''})}
            error={!!state.error}
            errorText={state.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            ref={(ref) => {
              this._stateinput = ref;
            }}
            onSubmitEditing={() =>
              this._countryinput && this._countryinput.focus()
            }
          />
          <TextInput
            //   style={styles.nameInputText}
            label="Country"
            returnKeyType="next"
            value={country.value}
            onChangeText={(text) => setCountry({value: text, error: ''})}
            error={!!country.error}
            errorText={country.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            ref={(ref) => {
              this._countryinput = ref;
            }}
            onSubmitEditing={() =>
              this._pincodeinput && this._pincodeinput.focus()
            }
          />
          <TextInput
            //   style={styles.nameInputText}
            label="Pincode"
            returnKeyType="next"
            value={pincode.value}
            onChangeText={(text) => setPincode({value: text, error: ''})}
            error={!!pincode.error}
            errorText={pincode.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="number-pad"
            ref={(ref) => {
              this._pincodeinput = ref;
            }}
            onSubmitEditing={Keyboard.dismiss}
          />
          <TextInput
            //   style={styles.nameInputText}
            label="Register Number"
            returnKeyType="next"
            value={registerNumber.value}
            onChangeText={(text) => setRegisterNumber({value: text, error: ''})}
            error={!!registerNumber.error}
            errorText={registerNumber.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="number-pad"
            ref={(ref) => {
              this._pincodeinput = ref;
            }}
            onSubmitEditing={Keyboard.dismiss}
          />
          <TextInput
            //   style={styles.nameInputText}
            label="GST Number"
            returnKeyType="next"
            value={GSTNumber.value}
            onChangeText={(text) => setGSTNumber({value: text, error: ''})}
            error={!!GSTNumber.error}
            errorText={GSTNumber.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="number-pad"
            maxLength={13}
            ref={(ref) => {
              this._pincodeinput = ref;
            }}
            onSubmitEditing={Keyboard.dismiss}
          />
        </View>
        <TouchableOpacity style={styles.nextView} onPress={onPressStep1}>
          <Image
            style={styles.nextImage}
            source={require('../../assets/assets/SliderScreen/next.png')}
          />
        </TouchableOpacity>
      </>
    )
  }

  const step2View = () => {
    return (
      <>
        <TouchableOpacity onPress={() => {
          setTransporterAsDriver(!transporterAsDriver)
          // setDriverData()
        }} style={styles.buttonNotify}>
          <Text style={styles.textNotify}>
            Transporter as Driver
          </Text>
          <Image
            style={styles.calanderImage}
            source={
              transporterAsDriver
                ? require('../../assets/assets/PlaceOrder/ic_checkbox_check.png')
                : require('../../assets/assets/PlaceOrder/ic_checkbox_uncheck.png')
            }
          />
        </TouchableOpacity>
        <View style={{padding: 16}}>
          <TextInput
            style={{ opacity: transporterAsDriver ? AppConstants.opacityLevel : 1, backgroundColor: 'white' }}
            label="First Name"
            returnKeyType="next"
            value={driverName.value}
            onChangeText={(text) => setDriverName({value: text, error: ''})}
            editable={!transporterAsDriver}
            error={driverName.error}
            errorText={driverName.error}
            autoCapitalize="words"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            // blurOnSubmit={false}
            ref={(ref) => {
              this._nameinput = ref;
            }}
            onSubmitEditing={() => {
              console.log(`lastNameInputRef: `, lastNameInputRef)
              /* if (lastNameInputRef != null) {
                lastNameInputRef.current._root.focus()
              } */
            }}
          />
          <TextInput
            style={{ opacity: transporterAsDriver ? AppConstants.opacityLevel : 1, backgroundColor: 'white' }}
            ref={lastNameInputRef}
            label="Last Name"
            returnKeyType="next"
            value={driverLastName.value}
            onChangeText={(text) => setDriverLastName({value: text, error: ''})}
            editable={!transporterAsDriver}
            error={driverLastName.error}
            errorText={driverLastName.error}
            autoCapitalize="words"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            onSubmitEditing={() => this._emailinput && this._emailinput.focus()}
          />
          <TextInput
            style={{ opacity: transporterAsDriver ? AppConstants.opacityLevel : 1, backgroundColor: 'white' }}
            label="Email"
            returnKeyType="next"
            value={driverEmail.value}
            onChangeText={(text) => setDriverEmail({value: text, error: ''})}
            editable={!transporterAsDriver}
            error={driverEmail.error}
            errorText={driverEmail.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            ref={(ref) => {
              this._emailinput = ref;
            }}
            onSubmitEditing={() => this._phoneinput && this._phoneinput.focus()}
          />
          <TextInput
            style={{ opacity: transporterAsDriver ? AppConstants.opacityLevel : 1, backgroundColor: 'white' }}
            label="Phone"
            returnKeyType="next"
            value={driverPhone.value}
            onChangeText={(text) => setDriverPhone({value: text, error: ''})}
            editable={!transporterAsDriver}
            error={driverPhone.error}
            errorText={driverPhone.error}
            autoCapitalize="none"
            autoCompleteType="tel"
            textContentType="telephoneNumber"
            maxLength={10}
            left={<Input.Affix customTextStyle={{ marginRight: 12 }} text={`${AppConstants.country_code} `} />}
            keyboardType="phone-pad"
            ref={(ref) => {
              this._phoneinput = ref;
            }}
            onSubmitEditing={() => this._ageinput && this._ageinput.focus()}
          />
          <TextInput
            //   style={styles.phoneInputText}
            label="Age"
            returnKeyType="next"
            value={age.value}
            onChangeText={(text) => setAge({value: text, error: ''})}
            // editable={!isVerified}
            error={age.error}
            errorText={age.error}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={10}
            keyboardType="number-pad"
            ref={(ref) => {
              this._ageinput = ref;
            }}
            onSubmitEditing={() => Keyboard.dismiss}
          />
        </View>
        {/* <UploadImage
          titleName="Address Proof (Adhaar Card, Voter Id) - At Least One"
          imageType={1}
          errorMessage={addressProof.error}
          saveImageData={saveDriverImageData}
          data={addressProof.data}
        /> */}
        <Text
            style={styles.addressTitleText}>
            Address Proof (Adhaar Card, Voter Id) - At Least One
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Text
                style={styles.addressFrontBackText}>
                Front
              </Text>
              <UploadImage
                isRow={true}
                imageType={1}
                errorMessage={''}
                saveImageData={saveDriverImageData}
                data={addressProof.data}
              />
            </View>

            <View>
              <Text
                style={styles.addressFrontBackText}>
                Back
              </Text>
              <UploadImage
                isRow={true}
                imageType={4}
                errorMessage={''}
                saveImageData={saveDriverImageData}
                data={addressProofBack.data}
              />
            </View>
          </View>
          {(addressProof.error!='' || addressProofBack.error!='' ) && 
        <Text style={styles.errorText}>{addressProof.error!=''?addressProof.error:addressProofBack.error}</Text>}
        <UploadImage
          titleName="Identity Proof (License)"
          imageType={2}
          errorMessage={identityProof.error}
          saveImageData={saveDriverImageData}
          data={identityProof.data}
        />
        <UploadImage
          titleName="Driver Photo"
          imageType={3}
          errorMessage={driverPhoto.error}
          saveImageData={saveDriverImageData}
          data={driverPhoto.data}
        />
        <TouchableOpacity style={styles.nextView} onPress={onPressStep2}>
          <Image
            style={styles.nextImage}
            source={require('../../assets/assets/SliderScreen/next.png')}
          />
        </TouchableOpacity>
      </>
    )
  }

  async function confirmCode() {
    try {
      setIsLocalLoading(true)
      console.log(`otp.value: ${otp.value}`)
      console.log(`confirm:`, confirm)
      await confirm.confirm(otp.value)
      .then(confirmResult => {
        // console.log(`confirmResult:`, confirmResult)
        console.log(`confirmResult: ${JSON.stringify(confirmResult)}`)
        setUID(confirmResult.user.uid)
        setIsLocalLoading(false);
        // setCurrentPosition(currentPosition+1)
        saveDriverDetails(confirmResult.user.uid)
      })
      .catch(error => {
        setIsLocalLoading(false);
        setOtp({...otp.value, error: "Invalid Code."})
        console.log(error)
      });;
    } catch (error) {
      setIsLocalLoading(false);
      setOtp({...otp.value, error: "Invalid Code."})
      console.log('Invalid code.');
    }
  }

  async function signInWithPhoneNumber(phoneNumber, isResend=false) {
    console.log(`phoneNumber: ${phoneNumber}`)
    setIsLocalLoading(true);
    auth()
      .signInWithPhoneNumber(phoneNumber,isResend)
      .then(confirmResult => {
        // console.log(`confirmResult: ${JSON.stringify(confirmResult)}`)
        setIsLocalLoading(false);
        setConfirm(confirmResult)
        if (!isResend) {
          setCurrentPosition(currentPosition+1)
        }
      })
      .catch(error => {
        setIsLocalLoading(false);
        alert(error.message)
        console.log(error)
      });
  }

  let onlyNumberFieldRegex = '^[0-9]+$';
  const validateOnlyNumber = text => {
    let reg = new RegExp(onlyNumberFieldRegex, 'i');
    if (reg.test(text) === false) {
      return false;
    } else {
      return true;
    }
  };

  const decrementClock = asSeconds => {
    if (asSeconds <= -seconds) {
      if (clockCall) {
        clearInterval(clockCall);
      }
      setIsResendNow(true)
    }
    setTimer(asSeconds)
  };

  const startTimer = () => {
    setIsResendNow(false)
    setTimer(0)
    let setOpenTime = moment(new Date());
    clockCall = setInterval(() => {
      let nowTime = moment(new Date());
      let asSeconds = Math.round(
        moment.duration(setOpenTime.diff(nowTime)).asSeconds(),
      );
      decrementClock(asSeconds);
    }, 1000);
  };

  const onPressVerifyOTP = () => {
    if (otp.value.length < 6) {
      setOtp({ value: otp.value, error: "Please enter valid code." })
      return
    }
    confirmCode()
  }

  const step3View = () => {
    return (
      <KeyboardAvoidingView behavior="position">
        <Loader loading={isLoading} />
        <View style={{padding: 16}}>
          <Text style={styles.subTitleText}>{"An authentication code has been sent to "}
            <Text style={{ color: Colors.accentColor }}>
              {AppConstants.country_code} {driverPhone.value}
            </Text>
          </Text>
          <View style={{marginTop: 16}}>
            <OTPInputView
            autoFocusOnLoad={false}
              pinCount={6}
              style={{height: 64, alignSelf: 'center', width: '94%'}}
              codeInputFieldStyle={{
                width: 44,
                height: 44,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: Colors.borderColor,
                color: Colors.textColor,
                fontSize: 20,
                // fontFamily: getFontFamily().BOLD,
              }}
              codeInputHighlightStyle={{
                borderColor: Colors.primaryColor,
                borderWidth: 3,
              }}
              onCodeChanged={code => {
                if (!validateOnlyNumber(code)) {
                  return;
                }
                setOtp({value: code, error: ''})
                /* this.setState({otp: '' + code, errorMessage: ''}, () => {
                  let tIsDisable = true;
                  if (this.state.otp.length == 4) {
                    tIsDisable = false;
                  }
                  this.setState({isDisable: tIsDisable});
                }); */
              }}
            />
            {otp.error == '' ? null : (
              <Text style={styles.errorText}>{otp.error}</Text>
            )}
          </View>
          {/* <TouchableOpacity style={styles.buttonLogin} onPress={() => {
            // onPressLogin()
          }}>
            <Text style={styles.loginText}>SUBMIT</Text>
          </TouchableOpacity> */}

          <TouchableOpacity style={styles.nextView} onPress={onPressVerifyOTP}>
            <Image
              style={styles.nextImage}
              source={require('../../assets/assets/SliderScreen/next.png')}
            />
          </TouchableOpacity>

          <View
            style={{
              flexDirection: 'row',
              marginTop: -24,
              justifyContent: 'center',
            }}>
            {isResendNow ? (
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.subTitleTextColor,
                    textAlign: 'center',
                    fontFamily: "SofiaPro-Regular"
                  }}>
                  {"Didn't receive OTP? "}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    let phoneNumberWithCode = `${AppConstants.country_code} ${driverPhone.value}`
                    startTimer()
                    signInWithPhoneNumber(phoneNumberWithCode, true)
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: Colors.primaryColor,
                      fontFamily: "SofiaPro-Regular"
                    }}>
                    {" Resend Code"}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.subTitleTextColor,
                    textAlign: 'center',
                    fontFamily: "SofiaPro-Regular"
                  }}>
                  {"Code sent. Resend code in "}
                  <Text
                    style={{
                      fontSize: 16,
                      color: Colors.subTitleTextColor,
                      fontFamily: "SofiaPro-Regular"
                    }}>
                    {timer + seconds}
                  </Text>
                </Text>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }

  const step4View = () => {
    console.log(`selectedVehicleType: ${JSON.stringify(selectedVehicleType)}`)
    return (
      <>
        <Menu
          style={{ maxHeight: 300, flex: 1 }}
          ref={(ref) => setMenuRef(ref)}
          button={
            <View style={{ marginBottom: -8 }}>
              <TouchableOpacity 
                style={[styles.popupView, {borderColor: vehicleType.error != '' ? Colors.errorColor : Colors.borderColor}]} 
                onPress={showMenu}>
                <Text
                  style={
                    !vehicleTypeFlag
                      ? styles.popupTextUnSelected
                      : styles.popupTextSelected
                  }>
                  {vehicleType.value == '' ? 'Select vehicle type' : vehicleType.value}
                </Text>
              </TouchableOpacity>
              {vehicleType.error != '' ?
              <Text style={styles.error}>{vehicleType.error}</Text> : null
              }
            </View>
          }>
            <ScrollView>
              {setMenuItems()}
            </ScrollView>
        </Menu>
        {/* <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={vehicleTypeList}
          maxHeight={240}
          placeholder={'Select vehicle type'}
          valueField={'id'}
          labelField={'data.vehicle_type'}
          value={selectedVehicleType != null ? selectedVehicleType : null}
          // value={selectedVehicleType}
          onChange={item => {
            // console.log(`item: ${JSON.stringify(item)}`)
            console.log(`item.data.vehicle_type: ${item.data.vehicle_type}`)
            // setSelectedVehicleType(item.data);
            setSelectedVehicleType(item.data.vehicle_type);
            // setSelectedVehicleType(item.value);
            // onselect?.(item.data.vehicle_type)
          }}
          renderItem={item => {
            return (
              <Text style={{ padding: 12, borderBottomWidth: 0.5, borderBottomColor: 'red' }}>
                {item.data.vehicle_type}
              </Text>
            )
          }}
        />

        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={data}
          maxHeight={240}
          placeholder={'Select vehicle type'}
          valueField={'id'}
          labelField={'label'}
          value={selectedVehicleType}
          onChange={item => {
            setSelectedVehicleType(item.value.title);
          }}
          // renderItem={item => {
          //   return (
          //     <Text style={{ padding: 12, borderBottomWidth: 0.5, borderBottomColor: 'red' }}>
          //       {item.data.vehicle_type}
          //     </Text>
          //   )
          // }}
        /> */}
        <View style={{padding: 16}}>
          <TextInput
            //   style={styles.nameInputText}
            label="Vehicle number"
            returnKeyType="next"
            value={vehicleNumber.value}
            // editable={!isVerified}
            error={!!vehicleNumber.error}
            errorText={vehicleNumber.error}
            onChangeText={(text) => setVehicleNumber({value: text, error: ''})}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            ref={(ref) => {
              this._lastinput = ref;
            }}
            onSubmitEditing={() => this._emailinput && this._emailinput.focus()}
          />
          <TextInput
            //   style={styles.emailInputText}
            label="Chassis number"
            returnKeyType="next"
            value={chasisNumber.value}
            // editable={!isVerified}
            error={!!chasisNumber.error}
            onChangeText={(text) => setChassisNumber({value: text, error: ''})}
            errorText={chasisNumber.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            ref={(ref) => {
              this._emailinput = ref;
            }}
            onSubmitEditing={() => this._phoneinput && this._phoneinput.focus()}
          />
          <TextInput
            //   style={styles.phoneInputText}
            label="Comments"
            returnKeyType="next"
            value={comments.value}
            // editable={!isVerified}
            error={!!comments.error}
            onChangeText={(text) => setComments({value: text, error: ''})}
            errorText={comments.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            ref={(ref) => {
              this._phoneinput = ref;
            }}
            onSubmitEditing={() => Keyboard.dismiss}
            multiline
          />
        </View>
        <Text
          style={styles.tilteText}>
          Vehicle Photo
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {addMultipleUploadImageView()}
        </ScrollView>
        {vehiclePhotos.error != '' ? <Text style={[styles.error, {marginTop: -12}]}>{vehiclePhotos.error}</Text> : null}
        <TouchableOpacity style={styles.buttonLogin} onPress={onPressSubmit}>
          <Text style={styles.loginText}>{"Submit"}</Text>
        </TouchableOpacity>
      </>
    )
  }

  return AppConstants.isAndroid ? (
    <View style={{ flex: 1 }}>{transporterRegistrationScreenView()}</View>
  ) : (
    <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#fff' }}
        behavior="padding"
        // keyboardVerticalOffset={64}
        enabled>
        {transporterRegistrationScreenView()}
    </KeyboardAvoidingView>
  );
};

TransporterRegistration.navigationOptions = (navigationData) => {
  var isEdit = navigationData.navigation.getParam('isEdit');
  if (isEdit === undefined) {
    isEdit = false
  }
  let isShowBackButton = navigationData.navigation.getParam('is_show_back_button');
  // console.log(`isEdit: ${isEdit}`)

  return {
    headerShown: true,
    headerTitle: "Transporter",
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
      backgroundColor: Colors.mainBackgroundColor,
    },
    headerLeft: isShowBackButton ? (
      <View style={styles.viewHeaderLeft}>
        <TouchableOpacity
          onPress={() => {
            navigationData.navigation.pop();
          }}>
          <Image
            style={styles.backImage}
            source={require('../../assets/assets/Authentication/back.png')}
          />
        </TouchableOpacity>
      </View>
    ) : null,
  };
};
// Set the components styles.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor
  },
  backImage: {
    marginLeft: 16,
    height: 40,
    width: 40,
  },
  tilteText: {
    margin: 16,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    // fontWeight: '500',
    marginBottom: -28,
    marginTop: 12,
    color: Colors.textColor,
  },
  subTitleText: {
    marginTop: 8,
    // fontFamily: 'Roboto-Regular',
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
  },
  nameInputText: {
    margin: 32,
    backgroundColor: Colors.surfaceColor,
  },
  emailInputText: {
    margin: 32,
    marginTop: -16,
    backgroundColor: Colors.surfaceColor,
  },
  phoneInputText: {
    margin: 32,
    marginTop: -16,
    backgroundColor: Colors.surfaceColor,
  },
  passwordInputText: {
    // margin: 32,
    // marginTop: -16,
    backgroundColor: Colors.surfaceColor,
  },
  buttonLogin: {
    margin: 64,
    marginTop: 32,
    marginBottom: 0,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Medium',
    backgroundColor: Colors.buttonColor,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  loginText: {
    fontFamily: 'SofiaPro-Medium',
    color: Colors.backgroundColor,
    fontSize: RFPercentage(2),
  },
  registerButton: {
    marginTop: -32,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    // justifyContent: 'space-around',
  },
  registerText: {
    marginLeft: 4,
    fontFamily: 'SofiaPro-Medium',
    fontSize: RFPercentage(1.7),
    color: Colors.primaryColor,
    textAlign: 'center'
  },
  haveAnAccountText: {
    fontFamily: 'SofiaPro-Medium',
    fontSize: RFPercentage(1.7),
    color: Colors.subTitleTextColor,
    textAlign: 'center'
  },
  socialButtonView: {
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialImage: {
    height: 60,
    width: 60,
  },
  // loginText: {
  //   color: Colors.backgroundColor,
  //   fontSize: RFPercentage(2.5),
  // },
  lineView: {
    margin: 16,
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDotView: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeNumberText: {
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.7),
    color: Colors.backgroundColor,
  },
  activeLineView: {
    marginLeft: -1,
    width: 80,
    height: 5,
    backgroundColor: Colors.primaryColor,
  },
  inActiveDotView: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.inActiveLineColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inActiveNumberText: {
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.7),
    color: Colors.backgroundColor,
  },
  inActiveLineView: {
    marginLeft: -1,
    width: 80,
    height: 5,
    backgroundColor: Colors.inActiveLineColor,
  },
  lineViewText: {
    marginLeft: 55,
    marginRight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nextView: {
    alignItems: 'center',
    justifyContent: 'center'
    // backgroundColor: Colors.backgroundColor,
  },
  nextImage: {
    height: 150,
    width: 150,
    resizeMode: 'contain'
  },
  popupView: {
    margin: 16,
    marginBottom: 0,
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
  error: {
    fontSize: RFPercentage(2),
    // fontFamily: 'Roboto-Regular',
    color: Colors.errorColor,
    paddingHorizontal: 8,
    paddingTop: 8
  },
  dropdown: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 8,
    margin: 16,
    marginBottom: -8,
    backgroundColor: 'white'
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    color: 'darkgray',
    fontSize: RFPercentage(2)
  },
  selectedTextStyle: {
    fontSize: 16,
    color: Colors.titleTextColor,
    fontSize: RFPercentage(2)
  },
  calanderImage: {
    marginRight: 16,
    height: 30,
    width: 30,
  },
  buttonNotify: {
    // margin: 16,
    marginTop: 24,
    height: 40,
    marginBottom: -16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textNotify: {
    marginLeft: 16,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
  },
  addressFrontBackText: {
    marginLeft: 16,
    marginTop: 5,
    marginBottom: 16,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    color: Colors.textColor,
  },
  errorText: {
    marginLeft: 16,
    marginTop: 0,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    // fontWeight: '500',
    color: Colors.errorColor,
    marginRight: 16,
  },
  addressTitleText:{
    margin: 16,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    color: Colors.textColor,
  }
});

export default TransporterRegistration;