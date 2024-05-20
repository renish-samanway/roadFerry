import React, { useState, useEffect } from 'react';
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
  NativeModules,
} from 'react-native';

// Import the Plugins and Thirdparty library.
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Import the JS file.

import Colors from '../../helper/extensions/Colors';
import Button from '../../components/design/Button';
import TextInput from '../../components/design/TextInput';
import PasswordTextInput from '../../components/design/PasswordTextInput';

import {
  emailValidator,
  passwordValidator,
} from '../../helper/extensions/Validator';
import Loader from '../../components/design/Loader';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import AppConstants from '../../helper/constants/AppConstants';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppPreference from '../../helper/preference/AppPreference';
import { useDispatch } from 'react-redux';
import * as fetchProfileDataActions from '../../store/actions/customer/profile/fetchProfileData';
import { setIsLoginUser } from '../../navigation/MainNavigation';
import { NavigationActions, StackActions } from 'react-navigation';
import NotificationCall from '../../helper/NotificationCall';
import { useSelector } from 'react-redux';

// Load the main class.
const resetDriverDashboardAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "DriverDashboard" })]
});

const resetDashboardAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "Dashboard" })]
});

const transporterRegistrationAction = (user_id) => {
  return StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: "TransporterRegistration", params: { user_id: user_id, is_from_login: true } })]
  })
};

let setOpenTime = moment(new Date());
let seconds = 30;

const VerificationScreen = (props) => {
  const dispatch = useDispatch();

  const phoneNumber = props.navigation.getParam('phoneNumber');
  let phoneNumberWithCode = `${AppConstants.country_code} ${phoneNumber}`
  let confirm = props.navigation.getParam('confirm');
  let data = props.navigation.getParam('loginData');
  const isUserVerification = props.navigation.getParam('isUserVerification', false)
  const orderData = props.navigation.getParam('orderData', undefined)
  const status = props.navigation.getParam('status')
  const user = useSelector(state=>state.fetchProfileData.fetchProfileData)
  const userUID = useSelector(state=>state.fetchProfileData.userUID)
  console.log('verification screen data', isUserVerification, orderData)
  /* if (confirm) {
    console.log(`confirm:`, JSON.parse(confirm))
  } else {
    console.log(`confirm undefine`)
  } */

  const [otp, setOtp] = useState({ value: '', error: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isResendNow, setIsResendNow] = useState(false)
  const [timer, setTimer] = useState(0)
  // const [confirm, setConfirm] = useState(null);
  let clockCall = null

  const invalid = () => {
    Alert.alert(
      'Alert',
      'Phone Number invalid!',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: false },
    );
  }

  async function signInWithPhoneNumber(phoneNumber) {
    console.log(`phoneNumber: ${phoneNumber}`)
    setIsLoading(true);
    auth()
      .signInWithPhoneNumber(phoneNumber,true)
      .then(confirmResult => {
        // console.log(`confirmResult: ${JSON.stringify(confirmResult)}`)
        setIsLoading(false);
        confirm = confirmResult
      })
      .catch(error => {
        setIsLoading(false);
        alert(error.message)
        console.log(error)
      });
  }

  /* useEffect(() => {
    signInWithPhoneNumber(phoneNumberWithCode)
  }, []) */

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
    setOpenTime = moment(new Date());
    clockCall = setInterval(() => {
      let nowTime = moment(new Date());
      let asSeconds = Math.round(
        moment.duration(setOpenTime.diff(nowTime)).asSeconds(),
      );
      decrementClock(asSeconds);
    }, 1000);
  };

  useEffect(() => {
    startTimer()
    return () => {
      if (clockCall) {
        clearInterval(clockCall);
      }
    };
  }, [])

  let onlyNumberFieldRegex = '^[0-9]+$';
  const validateOnlyNumber = text => {
    let reg = new RegExp(onlyNumberFieldRegex, 'i');
    if (reg.test(text) === false) {
      return false;
    } else {
      return true;
    }
  };


  const onCompleteOrder = (orderData) => {
    console.log('menu item is pressed', orderData)
    const { user_type } = user
    if (user_type == 'driver') {
        firestore()
            .collection('users')
            .doc(orderData.data.transporter_uid)
            .collection('driver_details')
            .doc(orderData.data.driver_details.driver_id)
            .update({ is_assign: false }).then(() => {
                firestore()
                    .collection('users')
                    .doc(orderData.data.transporter_uid)
                    .update({ is_assign: false, is_request: true }).then(() => {
                        firestore().collection('vehicle_details').doc(orderData.data.vehicle_details.vehicle_id).update({is_assign:false})
                        firestore()
                            .collection('users')
                            .doc(userUID)
                            .update({ is_assign: false }).then(() => {
                                firestore()
                                .collection('users')
                                .doc(orderData.data.transporter_uid)
                                .collection('vehicle_details')
                                .doc(orderData.data.vehicle_details.vehicle_id)
                                .update({is_assign:false})
                            }).catch((e) => console.log('while updating vehicle exception is generated', e))
                    }).catch((e) => console.log('while updating firebase driver exception is generated', e))
            }).catch((e) => console.log('exception is generated', e))
    }
    else {
        if(user_type == 'transporter' && orderData.data.driver_details.user_uid == userUID){
            firestore()
            .collection('users')
            .doc(userUID)
            .update({is_assign: false, is_request: true})
            .then(()=>{
                    console.log('transporter is updated')
                    firestore()
                    .collection('users')
                    .doc(userUID)
                    .collection('driver_details')
                    .doc(orderData.data.driver_details.driver_id)
                    .update({is_assign:false})
                    .then(()=>{
                        console.log('driver of this transporter is updated')
                        firestore().collection('vehicle_details').doc(orderData.data.vehicle_details.vehicle_id).update({is_assign:false})
                        firestore()
                        .collection('users')
                        .doc(userUID)
                        .collection('vehicle_details')
                        .doc(orderData.data.vehicle_details.vehicle_id)
                        .update({is_assign:false})
                    })
                    .catch((e)=>console.log('exception is generated while updating driver details',e))
            })
            .catch((e)=>console.log('exception is generated while updating transporter',e))
        }
        // user type transporter as driver
    }
}

  const updateFirebaseOrderDocument = () => {
    const { id, data } = orderData;
    console.log('order id', id)
    firestore()
      .collection('order_details')
      .doc(id)
      .update({ status: status })
      .then(() => {
        setIsLoading(false);
        if (status == "on-loading") {
          let parameters = {
            userId: data.requested_uid,
            orderId: id,
            type: "started"
          }
          NotificationCall(parameters)
        }
        if (status == "completed") {
          let parameters = {
            userId: data.requested_uid,
            orderId: id,
            type: "unloaded"
          }
          NotificationCall(parameters)
          onCompleteOrder(orderData)
        }
        props.navigation.pop();
      })
      .catch((e) => {
        console.log('exception is generated', e)
        setIsLoading(false)
      })
  }

  async function confirmCode() {
    try {
      console.log(`otp.value: ${otp.value}`)
      // console.log(`confirm:`, confirm)
      setIsLoading(true)
      confirm.confirm(otp.value)
        .then(response => {
          if (isUserVerification) {
            updateFirebaseOrderDocument()
          } else {

            // console.log(`confirmResult:`, confirmResult)
            // console.log(`confirmResult: ${JSON.stringify(response)}`)
            console.log('rootRef is :', response.user.uid);
            // setIsLoading(false);
            response.user.getIdToken(true).then(token => {
              console.log('token:', token);
              data.forEach(documentSnapshot => {
                console.log('documentSnapshot.id:', documentSnapshot.id);
                console.log('user.uid:', response.user.uid);
                AsyncStorage.setItem(AppPreference.IS_LOGIN, '1');
                AsyncStorage.setItem(AppPreference.LOGIN_UID, response.user.uid);
                AsyncStorage.setItem(AppPreference.LOGIN_TOKEN, token);

                AsyncStorage.getItem(AppPreference.FCM_TOKEN).then((fcmToken) => {
                  if (fcmToken == null) {
                    setIsLoading(false);
                    console.log(`AppPreference.FCM_TOKEN.null`)
                  } else {
                    console.log(`AppPreference.FCM_TOKEN:`, fcmToken)

                    let updatedData = { access_token: token, fcm_token: fcmToken }
                    firestore()
                      .collection('users')
                      .doc(documentSnapshot.id)
                      .update(updatedData)

                    let userData = { ...documentSnapshot.data() }
                    userData.access_token = token
                    userData.fcm_token = fcmToken
                    console.log(`userData:`, userData)
                    AsyncStorage.setItem(
                      AppPreference.LOGIN_USER_DATA,
                      JSON.stringify(userData),
                    ).then(() => {
                      dispatch({
                        type: fetchProfileDataActions.FETCH_PROFILE_DATA,
                        fetchProfileData: documentSnapshot.data(),
                        userUID: documentSnapshot.id
                      });
                      let userType = documentSnapshot.data().user_type.toLowerCase();
                      if (userType == 'driver') {
                        /* props.navigation.navigate({
                          routeName: 'DriverDashboard',
                        }); */
                        props.navigation.dispatch(resetDriverDashboardAction)
                      } else {
                        /* props.navigation.navigate({
                          routeName: 'Dashboard',
                        }); */
                        if (documentSnapshot.data().is_registered) {
                          props.navigation.dispatch(resetDashboardAction)
                        } else {
                          props.navigation.dispatch(transporterRegistrationAction(documentSnapshot.id))
                        }
                      }
                    })
                  }
                });
              });
            })
          }
        })
        .catch(error => {
          setIsLoading(false);
          alert(error.message)
          console.log(error)
        });;
    } catch (error) {
      setIsLoading(false);
      console.log('Invalid code.');
      setOtp({ value: otp.value, error: "Invalid code." })
    }
  }

  function onPressLogin() {
    if (otp.value.length < 6) {
      setOtp({ value: otp.value, error: "Please enter valid code." })
      return
    }
    confirmCode()
  };

  return (
    <>
      <StatusBar
        backgroundColor={Colors.mainBackgroundColor}
        barStyle="dark-content"
      />
      {/* <SafeAreaView
        style={{flex: 0, backgroundColor: Colors.mainBackgroundColor}}
      /> */}
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.mainBackgroundColor }}>
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView behavior="position">
            <Loader loading={isLoading} />
            <TouchableOpacity onPress={() => props.navigation.pop()}>
              <Image
                style={styles.backImage}
                source={require('../../assets/assets/Authentication/back.png')}
              />
            </TouchableOpacity>
            <Text style={styles.tilteText}>Verification</Text>
            <Text style={styles.subTitleText}>{"An authentication code has been sent to "}
              <Text style={{ color: Colors.accentColor }}>
                {phoneNumberWithCode}
              </Text>
            </Text>
            <View style={{ padding: 16 }}>
              <OTPInputView
              autoFocusOnLoad={false}
                pinCount={6}
                style={{ height: 64, alignSelf: 'center', width: '94%' }}
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
                  setOtp({ value: code, error: '' })
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
            <TouchableOpacity style={styles.buttonLogin} onPress={() => {
              onPressLogin()
            }}>
              <Text style={styles.loginText}>SUBMIT</Text>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: 'row',
                marginTop: -16,
                justifyContent: 'center',
              }}>
              {isResendNow ? (
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: Colors.subTitleTextColor,
                      textAlign: 'center',
                    }}>
                    {"Didn't receive OTP? "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      Keyboard.dismiss();
                      startTimer()
                      signInWithPhoneNumber(phoneNumberWithCode)
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.primaryColor,
                      }}>
                      {" Resend Code"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: Colors.subTitleTextColor,
                      textAlign: 'center',
                    }}>
                    {"Code sent. Resend code in "}
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.subTitleTextColor,
                      }}>
                      {timer + seconds}
                    </Text>
                  </Text>
                </View>
              )}
            </View>
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
  errorText: {
    marginLeft: 8,
    marginTop: 0,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    // fontWeight: '500',
    color: Colors.errorColor,
    marginRight: 16,
  },
  cellHeaderFooler: {
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tilteText: {
    margin: 16,
    marginBottom: 0,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(4),
    // fontWeight: '500',
    color: Colors.textColor,
  },
  subTitleText: {
    marginTop: 8,
    marginLeft: 16,
    marginRight: 16,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
  },
  headerImage: {
    height: 120,
    width: 70,
  },
  enailInputText: {
    margin: 16,
    backgroundColor: Colors.surfaceColor,
  },
  buttonLogin: {
    margin: 64,
    marginTop: 32,
    fontSize: RFPercentage(2),
    backgroundColor: Colors.buttonColor,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  loginText: {
    color: Colors.backgroundColor,
    fontSize: RFPercentage(2.5),
  },
});

export default VerificationScreen;