import AsyncStorage from '@react-native-async-storage/async-storage';
import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert, Image, Keyboard,
  KeyboardAvoidingView, SafeAreaView,
  ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
// Import the Plugins and Thirdparty library.
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useDispatch } from 'react-redux';
import Loader from '../../components/design/Loader';
import AppConstants from '../../helper/constants/AppConstants';
// Import the JS file.
import Colors from '../../helper/extensions/Colors';
import AppPreference from '../../helper/preference/AppPreference';
import { setIsLoginUser } from '../../navigation/MainNavigation';
import * as fetchProfileDataActions from '../../store/actions/customer/profile/fetchProfileData'

// Load the main class.
let setOpenTime = moment(new Date());
let seconds = 30;

const VerificationScreen = (props) => {
  const dispatch = useDispatch();

  const phoneNumber = props.navigation.getParam('phoneNumber');
  const isLogin = props.navigation.getParam('isLogin');
  let phoneNumberWithCode = `${AppConstants.country_code} ${phoneNumber}`
  let confirm = props.navigation.getParam('confirm');
  let data = null
  if (isLogin) {
    data = props.navigation.getParam('loginData');
  } else {
    data = props.navigation.getParam('registerData');
  }
  /* if (confirm) {
    console.log(`confirm:`, JSON.parse(confirm))
  } else {
    console.log(`confirm undefine`)
  } */

  const [otp, setOtp] = useState({value: '', error: ''});
  const [isLoading, setIsLoading] = useState(false);
  const [isResendNow, setIsResendNow] = useState(false)
  const [timer, setTimer] = useState(0)
  // const [confirm, setConfirm] = useState(null);
  let clockCall = null

  const invalid = () => {
    Alert.alert(
      'Alert',
      'Phone Number invalid!',
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
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

  async function confirmCode() {
    try {
      console.log(`otp.value: ${otp.value}`)
      // console.log(`confirm:`, confirm)
      setIsLoading(true)
      confirm.confirm(otp.value)
      .then(response => {
        // console.log(`confirmResult:`, confirmResult)
        // console.log(`confirmResult: ${JSON.stringify(response)}`)
        console.log('rootRef is :', response.user.uid);
        if (isLogin) {
          console.log(`sign in`)
          // setIsLoading(false);
          response.user.getIdToken(true).then(token => {
            console.log('token:', token);
            data.forEach(documentSnapshot => {
              console.log('User ID: ', documentSnapshot.id);
              // if (documentSnapshot.id == response.user.uid) {
                AsyncStorage.setItem(AppPreference.IS_LOGIN, '1');
                AsyncStorage.setItem(AppPreference.LOGIN_UID,response.user.uid);
                AsyncStorage.setItem(AppPreference.LOGIN_TOKEN,token);

                AsyncStorage.getItem(AppPreference.FCM_TOKEN).then((fcmToken) => {
                  if (fcmToken == null) {
                    setIsLoading(false);
                    console.log(`AppPreference.FCM_TOKEN.null`)
                  } else {
                    setIsLoading(false);
                    console.log(`AppPreference.FCM_TOKEN:`, fcmToken)

                    let updatedData = { access_token: token, fcm_token: fcmToken }
                    firestore()
                    .collection('users')
                    .doc(documentSnapshot.id)
                    .update(updatedData)

                    let userData = {...documentSnapshot.data()}
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

                      setIsLoginUser(true)
                      props.navigation.navigate({
                        routeName: 'Dashboard',
                      });
                      // props.navigation.goBack()
                    })
                  }
                });
              // }
            });
          })
        } else {
          console.log(`sign up`)
          if (data != null) {
            response.user.getIdToken(true).then(token => {
              console.log('token:', token);
              AsyncStorage.getItem(AppPreference.FCM_TOKEN).then((fcmToken) => {
                if (fcmToken == null) {
                  setIsLoading(false);
                  console.log(`AppPreference.FCM_TOKEN.null`)
                } else {
                  console.log(`AppPreference.FCM_TOKEN:`, fcmToken)
                  data.fcm_token = fcmToken
                  data.access_token = token
                  console.log(`data:`, data)
                  firestore()
                  .collection('users')
                  .doc(response.user.uid)
                  .set(data)
                  .then(querySnapshot => {
                    // console.log('Total users: ', querySnapshot.size);
                    setIsLoading(false);
                    AsyncStorage.setItem(AppPreference.IS_LOGIN, '1');
                    AsyncStorage.setItem(AppPreference.LOGIN_TOKEN,token);
                    AsyncStorage.setItem(AppPreference.LOGIN_UID, response.user.uid).then(
                      () => {
                        console.log(`AsyncStorage.setItem.LOGIN_UID`)
                        AsyncStorage.setItem(
                          AppPreference.LOGIN_USER_DATA,
                          JSON.stringify(data),
                        ).then(() => {
                          dispatch({
                            type: fetchProfileDataActions.FETCH_PROFILE_DATA,
                            fetchProfileData: data,
                            userUID: response.user.uid
                          });

                          setIsLoginUser(true)
                          props.navigation.navigate({
                            routeName: 'Dashboard',
                          });
                        })
                      },
                    );
                  }).catch(error => {
                    setIsLoading(false);
                    console.error(error)
                  });
                }
              });
            })
          }
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
      setOtp({value: otp.value, error: "Invalid code."})
    }
  }
  
  function onPressLogin() {
    if (otp.value.length < 6) {
      setOtp({ value: otp.value, error: "Please enter valid code." })
      return
    }
    confirmCode()
  };

  const textInputRef = useRef(null);

  useEffect(() => {
    const focusTextInput = () => {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    };

    // Add an event listener for when the screen is focused
    const screenFocusListener = props.navigation.addListener('focus', focusTextInput);

    return () => {
      // Remove the event listener when the screen is unfocused
      screenFocusListener.remove();
    };
  }, []);

  useEffect(() => {
    textInputRef.current.focusField(0);
  }, []);

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
        style={{flex: 1, backgroundColor: Colors.mainBackgroundColor}}>
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
            <View style={{padding: 16}}>
              <OTPInputView
                pinCount={6}
                ref={textInputRef}
                autoFocusOnLoad={true}
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
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
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
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
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