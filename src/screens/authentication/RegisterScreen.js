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
  AsyncStorage,
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

// Import the JS file.

import Colors from '../../helper/extensions/Colors';
import Button from '../../components/design/Button';
import TextInput from '../../components/design/TextInput';
import {
  nameValidator,
  emailValidator,
  phoneValidator,
  passwordValidator,
  lastNameValidator,
} from '../../helper/extensions/Validator';
import Loader from '../../components/design/Loader';
import AppConstants from '../../helper/constants/AppConstants';

// Load the main class.

const RegisterScreen = (props) => {
  const [name, setName] = useState({value: '', error: ''});
  const [lastName, setLastName] = useState({value: '', error: ''});
  const [email, setEmail] = useState({value: '', error: ''});
  const [phone, setPhone] = useState({value: '', error: ''});
  const [address, setAddress] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});
  const [isLoading, setIsLoading] = useState(false);
  const [currentLong, setCurrentLongitude] = useState('unknown');
  const [currentLat, setCurrentLatitude] = useState('unknown');
  
  useEffect(() => {
    componentDidMount();
  }, []);

  const onPressRegister = () => {
    const nameError = nameValidator(name.value);
    const lastNameError = lastNameValidator(lastName.value);
    const emailError = emailValidator(email.value);
    const phoneError = phoneValidator(phone.value);
    const passwordError = passwordValidator(password.value);

    if (nameError) {
      setName({...name, error: nameError});
      return;
    } else if (lastNameError) {
      setLastName({...lastName, error: lastNameError});
      return;
    } else if (emailError) {
      setEmail({...email, error: emailError});
      return;
    } else if (phoneError) {
      setPhone({...phone, error: phoneError});
      return;
    } else if (passwordError) {
      setPassword({...password, error: passwordError});
      return;
    } else {
      props.navigation.navigate({
        routeName: 'RegisterAddressScreen',
        params: {
          firstName: name.value,
          lastName: lastName.value,
          email: email.value,
          phone: phone.value,
          password: password.value,
          latitude: currentLat,
          longitude: currentLong,
        },
      });
      // setIsLoading(true);
      // auth()
      //   .createUserWithEmailAndPassword(email.value, password.value)
      //   .then((response) => {
      //     console.log('Email response is : ', response);
      //     const ref = firestore().collection('user');
      //     console.log('rootRef is : ', response.user.uid);
      //     ref.add({
      //       email: email.value,
      //       firstname: name.value,
      //       lastname: lastName.value,
      //       mobile: phone.value,
      //       address: address.value,
      //       latitude: currentLat,
      //       longitude: currentLong,
      //       user_type: 'Customer',
      //       device_details: AppConstants.device_details,
      //     });
      //     setIsLoading(false);
      //     props.navigation.pop();
      //   })
      //   .catch((error) => {
      //     setIsLoading(false);
      //     console.log('Eroor is : ', error.code);
      //     console.log('Please login with Email with password account');
      //     Alert.alert(
      //       'Alert',
      //       'Email id already exist.Please login',
      //       [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      //       {cancelable: false},
      //     );
      //   });
    }
  };

  const componentDidMount = () => {
    var that = this;
    if (Platform.OS === 'ios') {
      callLocation(that);
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
            callLocation(that);
          } else {
            alert('Permission Denied');
          }
        } catch (err) {
          alert('err', err);
          console.warn(err);
        }
      }
      requestLocationPermission();
    }
  };
  const callLocation = (that) => {
    //alert("callLocation Called");
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        const currentLongitude = position.coords.longitude;
        //getting the Longitude from the location json
        const currentLatitude = position.coords.latitude;
        console.log('Latitude : ', currentLatitude);
        console.log('Longitude : ', currentLongitude);
        //getting the Latitude from the location json
        setCurrentLongitude(currentLongitude);
        // that.setState({ currentLongitude:currentLongitude });
        //Setting state Longitude to re re-render the Longitude Text
        // that.setState({ currentLatitude:currentLatitude });
        setCurrentLatitude(currentLatitude);
        //Setting state Latitude to re re-render the Longitude Text
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
      console.log('Latitude : ', currentLatitude);
      console.log('Longitude : ', currentLongitude);

      //getting the Latitude from the location json
      //  that.setState({ currentLongitude:currentLongitude });
      setCurrentLongitude(currentLongitude);

      //Setting state Longitude to re re-render the Longitude Text
      //  that.setState({ currentLatitude:currentLatitude });
      setCurrentLatitude(currentLatitude);
      //Setting state Latitude to re re-render the Longitude Text
    });
  };
  const componentWillUnmount = () => {
    Geolocation.clearWatch(this.watchID);
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
            <TouchableOpacity onPress={() => props.navigation.pop()}>
              <Image
                style={styles.backImage}
                source={require('../../assets/assets/Authentication/back.png')}
              />
            </TouchableOpacity>
            <Text style={styles.tilteText}>Sign Up</Text>
            <View style={styles.lineView}>
              <View style={styles.activeDotView}>
                <Text style={styles.activeNumberText}>1</Text>
              </View>
              <View style={styles.activeLineView} />
              <View style={styles.inActiveLineView} />
              <View style={styles.inActiveDotView}>
                <Text style={styles.inActiveNumberText}>2</Text>
              </View>
            </View>
            <View style={styles.lineViewText}>
              <Text style={styles.registerText}>General details</Text>
              <Text style={styles.haveAnAccountText}>Address</Text>
            </View>
            <View style={{padding: 16}}>
              <TextInput
                //   style={styles.nameInputText}
                label="First Name"
                returnKeyType="next"
                value={name.value}
                onChangeText={(text) => setName({value: text, error: ''})}
                error={!!name.error}
                errorText={name.error}
                autoCapitalize="none"
                autoCompleteType="name"
                textContentType="name"
                keyboardType="default"
                ref={(ref) => {
                  this._nameinput = ref;
                }}
                onSubmitEditing={() =>
                  this._lastinput && this._lastinput.focus()
                }
              />
              <TextInput
                //   style={styles.nameInputText}
                label="Last Name"
                returnKeyType="next"
                value={lastName.value}
                onChangeText={(text) => setLastName({value: text, error: ''})}
                error={!!lastName.error}
                errorText={lastName.error}
                autoCapitalize="none"
                autoCompleteType="name"
                textContentType="name"
                keyboardType="default"
                ref={(ref) => {
                  this._lastinput = ref;
                }}
                onSubmitEditing={() =>
                  this._emailinput && this._emailinput.focus()
                }
              />
              <TextInput
                //   style={styles.emailInputText}
                label="Email"
                returnKeyType="next"
                value={email.value}
                onChangeText={(text) => setEmail({value: text, error: ''})}
                error={!!email.error}
                errorText={email.error}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
                ref={(ref) => {
                  this._emailinput = ref;
                }}
                onSubmitEditing={() =>
                  this._phoneinput && this._phoneinput.focus()
                }
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
                ref={(ref) => {
                  this._phoneinput = ref;
                }}
                onSubmitEditing={() =>
                  this._addressinput && this._addressinput.focus()
                }
              />
              {/* <TextInput
                //   style={styles.nameInputText}
                label="Address"
                returnKeyType="next"
                value={address.value}
                onChangeText={(text) => setAddress({value: text, error: ''})}
                error={!!address.error}
                errorText={address.error}
                autoCapitalize="none"
                autoCompleteType="name"
                textContentType="name"
                keyboardType="default"
                ref={(ref) => {
                  this._addressinput = ref;
                }}
                onSubmitEditing={() =>
                  this._passwordinput && this._passwordinput.focus()
                }
                multiline
              /> */}
              <TextInput
                //   style={styles.passwordInputText}
                label="Password"
                returnKeyType="done"
                value={password.value}
                onChangeText={(text) => setPassword({value: text, error: ''})}
                error={!!password.error}
                errorText={password.error}
                secureTextEntry={true}
                ref={(ref) => {
                  this._passwordinput = ref;
                }}
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>
            <TouchableOpacity style={styles.nextView} onPress={onPressRegister}>
              <Image
                style={styles.nextImage}
                source={require('../../assets/assets/SliderScreen/next.png')}
              />
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.buttonLogin}
              onPress={onPressRegister}>
              <Text style={styles.loginText}>SIGN UP</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => props.navigation.pop()}>
              <Text style={styles.haveAnAccountText}>
                Already have an account?
              </Text>
              <Text style={styles.registerText}>Login</Text>
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
  },
  haveAnAccountText: {
    fontFamily: 'SofiaPro-Medium',
    fontSize: RFPercentage(1.7),
    color: Colors.subTitleTextColor,
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

export default RegisterScreen;
