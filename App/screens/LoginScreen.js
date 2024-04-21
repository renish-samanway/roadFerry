import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';

// Import the Plugins and Thirdparty library.
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
// import auth, {firebase} from '@react-native-firebase/auth';
// Import the JS file.
import Colors from '../helper/Color';
import Button from '../Components/Button';
import TextInput from '../Components/TextInput';
import PasswordTextInput from '../Components/PasswordTextInput';
import AppPreference from '../helper/asyncStorage';
import * as fetchProfileDataActions from '../helper/Redux/store/actions/customer/profile/fetchProfileData';

import {phoneValidator} from '../helper/Validator';
import Loader from '../Components/Loader';
import {
  setIsLoginUser,
  setLoginUserType,
} from '../../navigation/MainNavigation';
import {NavigationActions, StackActions} from 'react-navigation';
import AppConstants from '../helper/AppConstants';
import {useDispatch} from 'react-redux';
import {TextInput as Input} from 'react-native-paper';

// Load the main class.
const resetDashboardAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({routeName: 'Dashboard'})],
});

const LoginScreen = props => {
  const [phone, setPhone] = useState({
    value: __DEV__ ? '9537386566' : '',
    error: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const dispatch = useDispatch();

  const invalid = () => {
    Alert.alert(
      'Alert',
      'User not register.',
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  };

  const clearUserData = () => {
    dispatch({
      type: fetchProfileDataActions.FETCH_PROFILE_DATA,
      fetchProfileData: [],
      userUID: '',
    });
  };

  useEffect(() => {
    clearUserData();
    const willFocusSub = props.navigation.addListener('willFocus', () => {
      clearUserData();
    });

    return () => {
      willFocusSub.remove();
    };
  }, []);

  const onPressSkip = () => {
    // props.navigation.dispatch(resetDashboardAction)
    console.log(`onPressSkip`);
    // props.navigation.pop(2)
    /* props.navigation.navigate({
      routeName: 'Dashboard',
    }); */
    props.navigation.goBack();
  };

  async function signInWithPhoneNumber(phoneNumber) {
    console.log(`phoneNumber: ${phoneNumber}`);
    // ! check user exist or not on database
    firestore()
      .collection('users')
      .where('user_type', 'in', ['Customer', 'customer'])
      .where('phone_number', '==', phone.value)
      .get()
      .then(querySnapshot => {
        console.log('Total users: ', querySnapshot.size);
        if (querySnapshot.size == 0) {
          setIsLoading(false);
          setTimeout(() => {
            invalid();
          }, 500);
        } else {
          console.log(`Sending code....`);
          auth()
            .signInWithPhoneNumber(phoneNumber)
            .then(confirmResult => {
              console.log(`SIGN IN WITH PHONE`, confirmResult);
              // console.log(`confirmResult: ${JSON.stringify(confirmResult)}`)
              console.log(`Code sent`);
              setIsLoading(false);
              props.navigation.navigate({
                routeName: 'VerificationScreen',
                params: {
                  isLogin: true,
                  phoneNumber: phone.value,
                  confirm: confirmResult,
                  loginData: querySnapshot,
                },
              });
            })
            .catch(error => {
              setIsLoading(false);
              alert(error.message);
              console.log(error);
            });
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error(error);
      });
    return;
    // ! verify phone number with otp send
    /* auth()
    .verifyPhoneNumber(phoneNumber)
    .then(confirmResult => {
      // console.log(`confirmResult:`, confirmResult)
      console.log(`confirmResult: ${JSON.stringify(confirmResult)}`)
      setIsLoading(false);
    })
    .catch(error => {
      setIsLoading(false);
      alert(error.message)
      console.log(error)
    });
    return */
    // ! sign-in with phone number with otp send
    auth()
      .signInWithPhoneNumber(phoneNumber)
      .then(confirmResult => {
        // console.log(`confirmResult:`, confirmResult)
        console.log(`confirmResult: ${JSON.stringify(confirmResult)}`);
        setIsLoading(false);
        props.navigation.navigate({
          routeName: 'VerificationScreen',
          params: {
            isLogin: true,
            phoneNumber: phone.value,
            confirm: confirmResult,
          },
        });
      })
      .catch(error => {
        setIsLoading(false);
        alert(error.message);
        console.log(error);
      });
    //setConfirm(confirmation);
    //setIsLoading(false);
  }

  const onPressNewLogin = () => {
    Keyboard.dismiss();
    const phoneError = phoneValidator(phone.value);
    if (phoneError) {
      setPhone({...phone, error: phoneError});
      return;
    }
    /* props.navigation.navigate({
      routeName: 'VerificationScreen',
      params: {
        isLogin: true,
        phoneNumber: phone.value,
        // confirm: JSON.stringify(confirmation)
      },
    });

    return */
    setIsLoading(true);
    let phoneNumber = `${AppConstants.country_code} ${phone.value}`;
    signInWithPhoneNumber(phoneNumber);
  };

  /* const onPressLogin = () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError) {
      setEmail({...email, error: emailError});
      return;
    } else if (passwordError) {
      setPassword({...password, error: passwordError});
      return;
    } else {
      setIsLoading(true);
      auth()
        .fetchSignInMethodsForEmail(email.value)
        .then((result) => {
          console.log('result', result);
          if (result.toString() === 'password') {
            auth()
              .signInWithEmailAndPassword(email.value, password.value)
              .then((response) => {
                setIsLoading(false);
                // console.log('Email response is : ', response);
                console.log('rootRef is :', response.user.uid);
                console.log('firebase.firestore.FieldPath.documentId():', firebase.firestore.FieldPath.documentId());

                response.user.getIdToken(true).then(token => {
                  firestore()
                  .collection('users')
                  .where('user_type', 'in', ['Customer', 'customer'])
                  .where(firebase.firestore.FieldPath.documentId(), '==', response.user.uid)
                  .get()
                  .then(querySnapshot => {
                    console.log('Total users: ', querySnapshot.size);
                    if (querySnapshot.size == 0) {
                      setIsLoading(false);
                      setTimeout(() => {
                        invalid()
                      }, 500)
                    } else {
                      querySnapshot.forEach(documentSnapshot => {
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
                                setIsLoginUser(true)
                                dispatch({
                                  type: fetchProfileDataActions.FETCH_PROFILE_DATA,
                                  fetchProfileData: documentSnapshot.data(),
                                  userUID: documentSnapshot.id
                                });
                                // props.navigation.navigate({
                                //   routeName: 'Dashboard',
                                // });
                                props.navigation.goBack()
                              })
                            }
                          });
                        // }
                      });
                    }
                  }).catch(error => {
                    setIsLoginUser(true)
                    console.error(error)
                  });
                }).catch(error => {
                  setIsLoginUser(true)
                  console.log(`error:`, error)
                })
                // props.navigation.navigate({
                //   routeName: 'Dashboard',
                //   params: {
                //     firebaseUID: response.user.uid,
                //   },
                // });
              })
              .catch((error) => {
                setIsLoading(false);
                console.log('Error is : ', error.code);
                setTimeout(() => {
                  invalid()
                }, 500)
              });
          } else {
            setIsLoading(false);
            console.log('Email id not available');
            setTimeout(() => {
              Alert.alert(
                'Alert',
                'Email id not available',
                [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                {cancelable: false},
              );
            }, 500)
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.log('Error is : ', error.code);
        });
    }
  }; */

  const changePwdType = () => {
    setPassworVisible(!passworVisible);
  };

  const setLoginView = () => {
    return (
      <>
        <StatusBar
          backgroundColor={Colors.mainBackgroundColor}
          barStyle="dark-content"
        />
        <SafeAreaView
          style={{flex: 1, backgroundColor: Colors.mainBackgroundColor}}>
          <ScrollView
            style={styles.container}
            keyboardShouldPersistTaps={'handled'}
            automaticallyAdjustContentInsets={false}
            showsVerticalScrollIndicator={false}>
            <Loader loading={isLoading} />
            {/* <TouchableOpacity onPress={() => props.navigation.pop()}>
              <Image
                style={styles.backImage}
                source={require('../../assets/assets/Authentication/back.png')}
              />
            </TouchableOpacity> */}
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                style={styles.logoImage}
                source={require('../assets/assets/Authentication/logo.png')}
              />
            </View>
            <Text style={styles.tilteText}>Login</Text>
            <View style={{padding: 16}}>
              <TextInput
                //   style={styles.phoneInputText}
                label="Phone"
                returnKeyType="next"
                value={phone.value}
                onChangeText={text => setPhone({value: text, error: ''})}
                error={!!phone.error}
                errorText={phone.error}
                autoCapitalize="none"
                autoCompleteType="tel"
                textContentType="telephoneNumber"
                maxLength={10}
                keyboardType="phone-pad"
                left={
                  <Input.Affix
                    customTextStyle={{marginRight: 12}}
                    text={`${AppConstants.country_code} `}
                  />
                }
                /* ref={(ref) => {
                this._phoneinput = ref;
              }} */
                /* onSubmitEditing={() =>
                this._addressinput && this._addressinput.focus()
              } */
              />
              {/* <PasswordTextInput
                style={styles.passwordInputText}
                label="Password"
                returnKeyType="done"
                value={password.value}
                onChangeText={(text) => setPassword({value: text, error: ''})}
                error={!!password.error}
                errorText={password.error}
                secureTextEntry={passworVisible}
                ref={(ref) => {
                  this._passwordinput = ref;
                }}
                onSubmitEditing={Keyboard.dismiss}
                changePwdType={() => changePwdType()}
                imageName={passworVisible ? 'eye-outline' : 'eye-off-outline'}
              /> */}
            </View>
            {/* <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={() =>
                props.navigation.navigate({
                  routeName: 'ForgotPasswordScreen',
                })
              }>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.buttonLogin}
              onPress={onPressNewLogin}>
              <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSkip} onPress={onPressSkip}>
              <Text style={styles.skipText}>SKIP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() =>
                props.navigation.navigate({
                  routeName: 'RegisterScreen',
                })
              }>
              <Text style={styles.haveAnAccountText}>
                Don't have an account yet?
              </Text>
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  };

  return AppConstants.isAndroid ? (
    <View style={{flex: 1}}>{setLoginView()}</View>
  ) : (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: '#fff'}}
      behavior="padding"
      enabled>
      {setLoginView()}
    </KeyboardAvoidingView>
  );
};

// Set the components styles.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
  },
  logoImage: {
    margin: 32,
    marginTop: 64,
    height: 40,
    resizeMode: 'contain',
  },
  backImage: {
    marginLeft: 16,
    height: 40,
    width: 40,
  },
  tilteText: {
    margin: 16,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(4),
    // fontWeight: '500',
    color: Colors.textColor,
  },
  enailInputText: {
    margin: 16,
    backgroundColor: Colors.surfaceColor,
  },
  passwordInputText: {
    backgroundColor: Colors.surfaceColor,
  },
  buttonLogin: {
    margin: 64,
    marginTop: 32,
    marginBottom: 32,
    fontSize: RFPercentage(2),
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
  buttonSkip: {
    margin: 64,
    marginTop: -16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    height: 60,
    borderRadius: 30,
    borderColor: Colors.buttonColor,
  },
  skipText: {
    fontFamily: 'SofiaPro-Medium',
    color: Colors.buttonColor,
    fontSize: RFPercentage(2),
  },
  registerButton: {
    marginTop: 32,
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
  forgotPasswordButton: {
    marginRight: 16,
    marginTop: -8,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  forgotPasswordText: {
    fontFamily: 'SofiaPro-Medium',
    fontSize: RFPercentage(1.7),
    color: Colors.primaryColor,
  },
});

export default LoginScreen;
