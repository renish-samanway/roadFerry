import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';

// Import the Plugins and Thirdparty library.
import {RFPercentage} from 'react-native-responsive-fontsize';
import { useDispatch } from 'react-redux';

// Import the JS file.

import Colors from '../helper/Color';
import TextInput from '../Components/TextInput';
import {
  flatNameValidator,
  areaValidator,
  cityValidator,
  stateValidator,
  countryValidator,
  pinCodeValidator,
} from '../helper/extensions/Validator';
import Loader from '../Components/Loader';
import AppConstants from '../helper/AppConstants';

// Load the main class.

const RegisterAddressScreen = (props) => {
  const ref = useRef();

  const [flatName, setFlatName] = useState({value: '', error: ''});
  const [area, setArea] = useState({value: '', error: ''});
  const [city, setCity] = useState({value: '', error: ''});
  const [state, setState] = useState({value: '', error: ''});
  const [country, setCountry] = useState({value: '', error: ''});
  const [pincode, setPincode] = useState({value: '', error: ''});
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const onPressRegister = () => {
    const firstName = props.navigation.getParam('firstName');
    const lastName = props.navigation.getParam('lastName');
    const email = props.navigation.getParam('email');
    const phone = props.navigation.getParam('phone');
    const password = props.navigation.getParam('password');
    const latitude = props.navigation.getParam('latitude');
    const longitude = props.navigation.getParam('longitude');

    const flatNameError = flatNameValidator(ref ? ref.current?.getAddressText() : flatName.value);
    const areaError = areaValidator(area.value);
    const cityError = cityValidator(city.value);
    const stateError = stateValidator(state.value);
    const countryError = countryValidator(country.value);
    const pincodeError = pinCodeValidator(pincode.value);

    if (flatNameError) {
      setFlatName({...flatName, error: flatNameError});
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
      setIsLoading(true);
      let phoneNumberWithCode = `${AppConstants.country_code} ${phone}`
      console.log(`phoneNumberWithCode: ${phoneNumberWithCode}`)
      // auth()
      // .signInWithPhoneNumber(phoneNumberWithCode)
      // .then(confirmResult => {
      //   // console.log(`confirmResult:`, confirmResult)
      //   console.log(`confirmResult: ${JSON.stringify(confirmResult)}`)
      //   setIsLoading(false);
        
      //   let addressData = {}
      //   addressData.flat_number = flatName.value
      //   addressData.area = area.value
      //   addressData.city = city.value
      //   addressData.state = state.value
      //   addressData.country = country.value
      //   addressData.pincode = pincode.value
      //   addressData.latitude = latitude
      //   addressData.longitude = longitude

      //   let registerData = {
      //     // access_token: token,
      //     // fcm_token: fcmToken,
      //     first_name: firstName,
      //     last_name: lastName,
      //     email: email,
      //     phone_number: phone,
      //     country_code: AppConstants.country_code,
      //     latitude: latitude,
      //     longitude: longitude,
      //     user_type: 'customer',
      //     // device_details: AppConstants.device_details,
      //     address: addressData,
      //     reason: '',
      //     status: true,
      //     is_deleted: false,
      //     created_at: new Date()
      //   }

      //   props.navigation.navigate({
      //     routeName: 'VerificationScreen',
      //     params: {
      //       isLogin: false,
      //       phoneNumber: phone,
      //       confirm: confirmResult,
      //       registerData: registerData
      //     },
      //   });
      // })
      // .catch(error => {
      //   setIsLoading(false);
      //   alert(error.message)
      //   console.log(error)
      // });
      
      return
      let addressData = {}
      addressData.flat_number = flatName.value
      addressData.area = area.value
      addressData.city = city.value
      addressData.state = state.value
      addressData.country = country.value
      addressData.pincode = pincode.value
      addressData.latitude = latitude
      addressData.longitude = longitude
      // setAddressDict(addressData);

      setIsLoading(true);
      // auth()
      //   .createUserWithEmailAndPassword(email, password)
      //   .then((response) => {
      //     response.user.getIdToken(true).then(token => {
      //       AsyncStorage.getItem(AppPreference.FCM_TOKEN).then((fcmToken) => {
      //         if (fcmToken == null) {
      //           setIsLoading(false);
      //           console.log(`AppPreference.FCM_TOKEN.null`)
      //         } else {
      //           console.log(`AppPreference.FCM_TOKEN:`, fcmToken)

      //           let registerData = {
      //             access_token: token,
      //             fcm_token: fcmToken,
      //             first_name: firstName,
      //             last_name: lastName,
      //             email: email,
      //             phone_number: phone,
      //             latitude: latitude,
      //             longitude: longitude,
      //             user_type: 'customer',
      //             device_details: AppConstants.device_details,
      //             address: addressData,
      //             reason: '',
      //             status: true,
      //             is_deleted: false,
      //             created_at: new Date()
      //           }

      //           firestore()
      //           .collection('users')
      //           .doc(response.user.uid)
      //           .set(registerData)
      //           .then(querySnapshot => {
      //             // console.log('Total users: ', querySnapshot.size);
      //             setIsLoading(false);
      //             AsyncStorage.setItem(AppPreference.IS_LOGIN, '1');
      //             AsyncStorage.setItem(AppPreference.LOGIN_TOKEN,token);
      //             AsyncStorage.setItem(AppPreference.LOGIN_UID, response.user.uid).then(
      //               () => {
      //                 AsyncStorage.setItem(
      //                   AppPreference.LOGIN_USER_DATA,
      //                   JSON.stringify(registerData),
      //                 ).then(() => {
      //                   setIsLoginUser(true)
      //                   // dispatch({
      //                   //   type: fetchProfileDataActions.FETCH_PROFILE_DATA,
      //                   //   fetchProfileData: registerData,
      //                   //   userUID: response.user.uid
      //                   // });
      //                   props.navigation.navigate({
      //                     routeName: 'Dashboard',
      //                   });
      //                 })
      //               },
      //             );
      //           }).catch(error => {
      //             setIsLoading(false);
      //             console.error(error)
      //           });
      //         }
      //       });
            
      //     })
      //   }).catch((error) => {
      //     setIsLoading(false);
      //     console.log('Error is : ', error.code);
      //     // console.log('Please login with Email with password account');
      //     setTimeout(() => {
      //       Alert.alert(
      //         'Alert',
      //         'Email id already exist. Please login',
      //         [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      //         {cancelable: false},
      //       );
      //     }, 500)
      //   });
    }
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

    setFlatName({value: flatDetails, error: ''})
    setArea({value: area, error: ''})
    setCity({value: city, error: ''})
    setState({value: state, error: ''})
    setCountry({value: country, error: ''})
    setPincode({value: pincode, error: ''})

    if (ref) {
      ref.current?.setAddressText(flatDetails);
    }
  }

  const setRegisterAddressView = () => {
    return (
      <>
        <StatusBar
          backgroundColor={Colors.mainBackgroundColor}
          barStyle="dark-content"
        />
        <SafeAreaView
          style={{flex: 1, backgroundColor: Colors.mainBackgroundColor}}>
          <ScrollView style={styles.container} keyboardShouldPersistTaps='always'>
            <Loader loading={isLoading} />
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate({
                  routeName: 'LoginScreen',
                })
              }>
              <Image
                style={styles.backImage}
                source={require('../assets/assets/Authentication/back.png')}
              />
            </TouchableOpacity>
            <Text style={styles.tilteText}>Sign Up</Text>
            <View style={styles.lineView}>
              <View style={styles.inActiveDotView}>
                <Text style={styles.inActiveNumberText}>1</Text>
              </View>
              <View style={styles.inActiveLineView} />
              <View style={styles.activeLineView} />
              <View style={styles.activeDotView}>
                <Text style={styles.activeNumberText}>2</Text>
              </View>
            </View>
            <View style={styles.lineViewText}>
              <Text style={styles.registerText}>General details</Text>
              <Text style={styles.haveAnAccountText}>Address</Text>
            </View>
            <View style={{padding: 16}}>
              <ScrollView 
                horizontal={true}
                style={{ flex: 1, marginBottom: 8 }}
                contentContainerStyle={{ flex: 1 }}
                keyboardShouldPersistTaps='always'
              >
                {/* <GooglePlacesAutocomplete
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
                      backgroundColor: Colors.surfaceColor,
                      borderRadius: 4,
                      borderWidth: 1
                    },
                  }}
                /> */}
              </ScrollView>
              {flatName.error == '' ? null : (
                <Text style={styles.error}>{flatName.error}</Text>
              )}
              <TextInput
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
                onSubmitEditing={() =>
                  this._cityinput && this._cityinput.focus()
                }
              />
              <TextInput
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
                onSubmitEditing={() =>
                  this._stateinput && this._stateinput.focus()
                }
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
            </View>
            <TouchableOpacity
              style={styles.buttonLogin}
              onPress={onPressRegister}>
              <Text style={styles.loginText}>SIGN UP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => props.navigation.pop()}>
              <Text style={styles.registerText}>
                Already have an account?
              </Text>
              <Text style={styles.haveAnAccountText}> Login</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }

  return AppConstants.isAndroid ? (
    <View style={{ flex: 1 }}>{setRegisterAddressView()}</View>
  ) : (
    <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#fff' }}
        behavior="padding"
        enabled>
        {setRegisterAddressView()}
    </KeyboardAvoidingView>
  );
};

// Set the components styles.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
  },
  headerContainer: {
    height: 200,
    backgroundColor: Colors.headerBGColor,
    // justifyContent: 'flex-end',
  },
  backImage: {
    marginLeft: 16,
    height: 40,
    width: 40,
  },
  cellHeaderFooler: {
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tilteText: {
    margin: 16,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(4),
    // fontWeight: '500',
    color: Colors.textColor,
  },
  subTitleText: {
    marginTop: 8,
    // fontFamily: 'Roboto-Regular',
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
  },
  headerImage: {
    height: 120,
    width: 70,
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
    margin: 32,
    marginTop: -16,
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
    // marginTop: -32,
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
    color: Colors.subTitleTextColor,
  },
  haveAnAccountText: {
    fontFamily: 'SofiaPro-Medium',
    fontSize: RFPercentage(1.7),
    color: Colors.primaryColor,
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
  error: {
    fontSize: RFPercentage(2),
    // fontFamily: 'Roboto-Regular',
    color: Colors.errorColor,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  // loginText: {
  //   color: Colors.backgroundColor,
  //   fontSize: RFPercentage(2.5),
  // },
  lineView: {
    margin: 16,
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
    marginRight: 85,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nextView: {
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: Colors.backgroundColor,
  },
  nextImage: {
    height: 150,
    width: 150,
    resizeMode: 'contain',
  },
});

export default RegisterAddressScreen;
