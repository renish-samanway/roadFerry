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
  NativeModules,
  Linking,
} from 'react-native';

// Import the Plugins and Thirdparty library.
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import the JS file.

import Colors from '../../helper/extensions/Colors';
import Button from '../../components/design/Button';
import TextInput from '../../components/design/TextInput';
import PasswordTextInput from '../../components/design/PasswordTextInput';
import AppPreference from '../../helper/preference/AppPreference';

import {
  emailValidator,
  passwordValidator,
  phoneValidator,
} from '../../helper/extensions/Validator';
import Loader from '../../components/design/Loader';
import * as fetchProfileDataActions from '../../store/actions/customer/profile/fetchProfileData';
import {useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/database';
import { NavigationActions, StackActions } from 'react-navigation';
import AppConstants from '../../helper/constants/AppConstants';
import {TextInput as Input} from 'react-native-paper';

// Load the main class.
const resetDriverDashboardAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "DriverDashboard" })]
});

const resetDashboardAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "Dashboard" })]
});

const LoginScreen = (props) => {

  useEffect(() => {
    // subscribe event
    Linking.addEventListener("url", handleOpenURL);
    return () => {
      // unsubscribe event
      Linking.removeEventListener("url", handleOpenURL);
    };
  }, []);

  const handleOpenURL = (event) => {
    console.log(`handleOpenURL.event.url: ${event.url}`);
    const route = event.url.replace(/.*?:\/\//g, '');
    console.log(`handleOpenURL.route: ${route}`)
    let splitBySplash = route.split("/");
    console.log(`splitBySplash: ${JSON.stringify(splitBySplash)}`)
    for (let i = 0; i < splitBySplash.length; i++) {
      const element = splitBySplash[i];
      if (element != "road_ferry") {
        console.log(`element: ${element}`)
        AsyncStorage.getItem(AppPreference.IS_LOGIN).then((valueLogin) => {
          const isLogin = JSON.parse(valueLogin);
          console.log(`isLogin: ${isLogin}`)
          if (isLogin != 1) {
            props.navigation.navigate({
              routeName: 'TransporterRegistration',
              params: {
                user_id: element, is_from_login: false
              },
            })
          }
        });
      }
    }
  }

  // const [email, setEmail] = useState({value: '', error: ''});
  // const [password, setPassword] = useState({value: '', error: ''});
  const [phone, setPhone] = useState({value: '', error: ''});
  const [isLoading, setIsLoading] = useState(false);
  // const [passworVisible, setPassworVisible] = useState(true);
  // const [loaded, setLoaded] = useState(false);
  // const [userName, setUserName] = useState('');
  // const [userEmail, setUserEmail] = useState('');
  const dispatch = useDispatch();

  const invalid = () => {
    Alert.alert(
      'Alert',
      'User not register.',
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  }

  const clearUserData = () => {
    console.log(`clearUserData`)
    dispatch({
      type: fetchProfileDataActions.FETCH_PROFILE_DATA,
      fetchProfileData: [],
      userUID: ''
    });
  }

  useEffect(() => {
    clearUserData()
    const willFocusSub = props.navigation.addListener('willFocus', () => {
      console.log(`willFocus`)
      clearUserData()
    });

    return () => {
      willFocusSub.remove();
    };
  }, []);

  async function signInWithPhoneNumber(phoneNumber) {
    console.log(`phoneNumber: ${phoneNumber}`)
    // ! check user exist or not on database
    firestore()
      .collection('users')
      .where('user_type', 'in', ['transporter', 'Transporter', 'driver', 'Driver'])
      .where('phone_number', '==', phone.value)
      .where('is_deleted','==',false)
      .get()
      .then(querySnapshot => {
        console.log('Total users: ', querySnapshot.size);
        if (querySnapshot.size == 0) {
          setIsLoading(false);
          setTimeout(() => {
            invalid()
          }, 100)
        } else {
          console.log(`Sending code....`)
          auth()
          .signInWithPhoneNumber(phoneNumber)
          .then(confirmResult => {
            console.log(`Code sent`)
            setIsLoading(false);
            props.navigation.navigate({
              routeName: 'VerificationScreen',
              params: {
                phoneNumber: phone.value,
                confirm: confirmResult,
                loginData: querySnapshot
              },
            });
          })
          .catch(error => {
            setIsLoading(false);
            alert(error.message)
            console.log(error)
          });
        }
      }).catch(error => {
        setIsLoading(false)
        console.error(error)
      });
  }

  const onPressNewLogin = () => {
    Keyboard.dismiss()
    const phoneError = phoneValidator(phone.value);
    if (phoneError) {
      setPhone({...phone, error: phoneError});
      return;
    }

    setIsLoading(true);
    let phoneNumber = `${AppConstants.country_code} ${phone.value}`
    signInWithPhoneNumber(phoneNumber)
  }

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
          // console.log('result', result);
          if (result.toString() === 'password') {
            auth()
              .signInWithEmailAndPassword(email.value, password.value)
              .then((response) => {
                // setIsLoading(false);
                // console.log('Email response is : ', response);
                // console.log('response.user : ', response.user);
                // console.log('getUserIDToken():', getUserIDToken());
                response.user.getIdToken(true).then(token => {
                  // console.log(`token:`, token)
                  firestore()
                    .collection('users')
                    .where('user_type', 'in', ['transporter', 'Transporter', 'driver', 'Driver'])
                    .where(firebase.firestore.FieldPath.documentId(), '==', response.user.uid)
                    .get()
                    .then(querySnapshot => {
                      // console.log('Total users: ', querySnapshot.size);
                      setIsLoading(false);
                      if (querySnapshot.size == 0) {
                        setTimeout(() => {
                          invalid()
                        }, 500)
                      } else {
                        querySnapshot.forEach(documentSnapshot => {
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
                                let userType = documentSnapshot.data().user_type.toLowerCase();
                                if (userType == 'driver') {
                                  // props.navigation.navigate({
                                  //   routeName: 'DriverDashboard',
                                  // });
                                  props.navigation.dispatch(resetDriverDashboardAction)
                                } else {
                                  // props.navigation.navigate({
                                  //   routeName: 'Dashboard',
                                  // });
                                  props.navigation.dispatch(resetDashboardAction)
                                }
                              })
                            }
                          });
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
                console.log('error is : ', error.code);
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
          console.log('error is : ', error.code);
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
          style={{flex: 0, backgroundColor: Colors.mainBackgroundColor}}
        />
        <SafeAreaView
          style={{flex: 1, backgroundColor: Colors.mainBackgroundColor}}>
          <ScrollView style={styles.container}
          keyboardShouldPersistTaps={'handled'}
          automaticallyAdjustContentInsets={false}
          showsVerticalScrollIndicator={false}>
            <Loader loading={isLoading} />
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                style={styles.logoImage}
                source={require('../../assets/assets/Authentication/logo.png')}
              />
            </View>
            <Text style={styles.tilteText}>Login</Text>
            <View style={{padding: 16}}>
              {/* <TextInput
                // style={styles.enailInputText}
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
                  this._passwordinput && this._passwordinput.focus()
                }
              />
              <PasswordTextInput
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
              <TextInput
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
                left={<Input.Affix customTextStyle={{ marginRight: 12 }} text={`${AppConstants.country_code} `} />}
              />
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
            <TouchableOpacity style={styles.buttonLogin} onPress={onPressNewLogin}>
              <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => {
                let url = AppConstants.transporterRegisterLink
                Linking.canOpenURL(url).then(supported => {
                  console.log(`supported: ${supported}`)
                  if (supported) {
                    Linking.openURL(url);
                  } else {
                    console.log("Don't know how to open URI: " + url);
                  }
                });
                
                /*props.navigation.navigate({
                  routeName: 'TransporterRegistration',
                  params: {
                    is_from_login: false,
                    is_show_back_button: true
                  },
                })*/
              }
              }>
              <Text style={styles.haveAnAccountText}>
                Don't have an account yet?
              </Text>
              <Text style={styles.registerText}>Register Transporter</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
  return AppConstants.isAndroid ? (
    <View style={{ flex: 1 }}>{setLoginView()}</View>
  ) : (
    <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#fff' }}
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
