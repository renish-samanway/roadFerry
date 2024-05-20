import React, {useState, useEffect} from 'react';
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
  Platform,
  PermissionsAndroid,
} from 'react-native';

// Import the Plugins and Thirdparty library.
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import auth, {firebase} from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import the JS file.

import Colors from '../../helper/extensions/Colors';
import TextInput from '../../components/design/TextInput';
import {
  flatNameValidator,
  areaValidator,
  cityValidator,
  stateValidator,
  countryValidator,
  pinCodeValidator,
} from '../../helper/extensions/Validator';
import Loader from '../../components/design/Loader';
import AppConstants from '../../helper/constants/AppConstants';
import AppPreference from '../../helper/preference/AppPreference';

// Load the main class.

const RegisterAddressScreen = (props) => {
  const [flatname, setFlatName] = useState({value: '', error: ''});
  const [area, setArea] = useState({value: '', error: ''});
  const [city, setCity] = useState({value: '', error: ''});
  const [state, setState] = useState({value: '', error: ''});
  const [country, setCountry] = useState({value: '', error: ''});
  const [pincode, setPincode] = useState({value: '', error: ''});
  const [isLoading, setIsLoading] = useState(false);
  const [addressDict, setAddressDict] = useState({
    flatNumber: '',
    area: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    latitude: '',
    longitude: '',
  });
  const onPressRegister = () => {
    const firstName = props.navigation.getParam('firstName');
    const lastName = props.navigation.getParam('lastName');
    const email = props.navigation.getParam('email');
    const phone = props.navigation.getParam('phone');
    const password = props.navigation.getParam('password');
    const latitude = props.navigation.getParam('latitude');
    const longitude = props.navigation.getParam('longitude');

    const flatNameError = flatNameValidator(flatname.value);
    const areaError = areaValidator(area.value);
    const cityError = cityValidator(city.value);
    const stateError = stateValidator(state.value);
    const countryError = countryValidator(country.value);
    const pincodeError = pinCodeValidator(pincode.value);

    if (flatNameError) {
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
      //   setAddressDict.flatNumber(flatname);
      //   setAddressDict.area(area);
      //   setAddressDict.city(city);
      //   setAddressDict.state(state);
      //   setAddressDict.country(country);
      //   setAddressDict.pincode(pincode);
      //   setAddressDict.latitude(latitude);
      //   setAddressDict.longitude(longitude);

      setIsLoading(true);
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then((response) => {
          console.log('Email response is : ', response.user.uid);
          const ref = firestore().collection('users').doc(response.user.uid);
          console.log('rootRef is : ', response.user.uid);
          ref.set({
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone_number: phone,
            latitude: latitude,
            longitude: longitude,
            user_type: 'Customer',
            device_details: AppConstants.device_details,
            address: addressDict,
          });
          setIsLoading(false);
          AsyncStorage.setItem(AppPreference.IS_LOGIN, '1');
          AsyncStorage.setItem(AppPreference.LOGIN_UID, response.user.uid).then(
            () => {
              props.navigation.navigate({
                routeName: 'Dashboard',
              });
            },
          );
        })
        .catch((error) => {
          setIsLoading(false);
          console.log('Error is : ', error.code);
          // console.log('Please login with Email with password account');
          Alert.alert(
            'Alert',
            'Email id already exist.Please login',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
        });
    }
  };

  return (
    <>
      <StatusBar
        backgroundColor={Colors.mainBackgroundColor}
        barStyle="dark-content"
      />
      <SafeAreaView
        style={{flex: 0, backgroundColor: Colors.mainBackgroundColor}}
      />
      <SafeAreaView
        style={{flex: 1, backgroundColor: Colors.mainBackgroundColor}}>
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={30}>
            <Loader loading={isLoading} />
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate({
                  routeName: 'LoginScreen',
                })
              }>
              <Image
                style={styles.backImage}
                source={require('../../assets/assets/Authentication/back.png')}
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
              <Text style={styles.haveAnAccountText}>General details</Text>
              <Text style={styles.registerText}>Address</Text>
            </View>
            <View style={{padding: 16}}>
              <TextInput
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
                onSubmitEditing={() =>
                  this._areainput && this._areainput.focus()
                }
              />
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
                onSubmitEditing={() =>
                  this._cityinput && this._cityinput.focus()
                }
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
                keyboardType="default"
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
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    </>
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
