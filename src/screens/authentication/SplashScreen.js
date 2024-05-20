import React, {useEffect} from 'react';
import {View, StyleSheet, Image, Linking} from 'react-native';

// Import the Plugins and Thirdparty library.
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import the JS file.

import Colors from '../../helper/extensions/Colors';
import AppPreference from '../../helper/preference/AppPreference';
import * as fetchProfileDataActions from '../../store/actions/customer/profile/fetchProfileData';
import * as saveNotificationDataActions from '../../store/actions/dashboard/saveNotificationData';
import {useDispatch} from 'react-redux';

import { NavigationActions, StackActions } from 'react-navigation';
const resetAuthAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "auth" })]
});

const resetSliderAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "sliderScreen" })]
});

const resetDriverDashboardAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "DriverDashboard" })]
});

const resetDashboardAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "Dashboard" })]
});

const transporterRegistrationAction = (user_id, is_from_login) => {
  return StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: "TransporterRegistration", params: { user_id: user_id, is_from_login: is_from_login } })]
  })
};

// Load the main class.

const SplashScreen = (props) => {

  const redirectLinkPage = (url) => {
    console.log(`handleOpenURL.event.url: ${url}`);
    const route = url.replace(/.*?:\/\//g, '');
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
            props.navigation.dispatch(transporterRegistrationAction(element, false))
          }
        });
      }
    }
  }

  useEffect(() => {
    Linking.getInitialURL().then((url)=>{
      console.log('SplashScreen.AppLink=>>>',url);
      redirectLinkPage(url);
    }).catch(err => console.error('An error occurred',err));
  })

  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(() => {
      //   AsyncStorage.getItem(AppPreference.IS_SLIDER).then((value) =>
      //     props.navigation.navigate(
      //       JSON.parse(value) === '1' ? 'Dashboard' : 'Slider1',
      //     ),
      //   );
      AsyncStorage.getItem(AppPreference.IS_SLIDER).then((value) => {
        const slideData = JSON.parse(value);
        console.log('Slider Value is : ', slideData);
        AsyncStorage.getItem(AppPreference.IS_LOGIN).then((valueLogin) => {
          const isLogin = JSON.parse(valueLogin);
          console.log('Login Value is : ', isLogin);
          AsyncStorage.getItem(AppPreference.LOGIN_USER_DATA).then((userData) => {
          console.log(`userData: ${userData}`)
          if (userData == null) {
              Linking.getInitialURL().then((url)=>{
                console.log('SplashScreen.AppLink=>>>',url);
                // props.navigation.dispatch(resetDashboardAction)
                // return
                if (url == null) {
                  props.navigation.dispatch(slideData === 1 ? resetAuthAction : resetSliderAction)
                }
              }).catch(err => console.error('An error occurred',err));
            } else {
              let convertedUserData = JSON.parse(userData)
              AsyncStorage.getItem(AppPreference.LOGIN_UID).then((userUID) => {
                console.log(`userUID: ${userUID}`)
                dispatch({
                  type: fetchProfileDataActions.FETCH_PROFILE_DATA,
                  fetchProfileData: convertedUserData,
                  userUID: userUID
                });

                /* AsyncStorage.getItem(AppPreference.NOTIFICATION_DATA).then((notificationData) => {
                  console.log(`SplashScreen.notificationData:`, notificationData)
                  if (notificationData != null) {
                    dispatch({
                      type: saveNotificationDataActions.SAVE_NOTIFICATION_DATA,
                      notificationData: JSON.parse(notificationData)
                    });
                  }
                }); */

                Linking.getInitialURL().then((url)=>{
                  console.log('SplashScreen.AppLink=>>>',url);
                  if (url == null) {
                    if (isLogin === 1) {
                      let userType = convertedUserData.user_type.toLowerCase();
                      if (userType == 'driver') {
                        props.navigation.dispatch(resetDriverDashboardAction)
                      } else {
                        if (convertedUserData.is_registered) {
                          props.navigation.dispatch(resetDashboardAction)
                        } else {
                          props.navigation.dispatch(transporterRegistrationAction(userUID, true))
                        }
                      }
                    } else {
                      props.navigation.dispatch(slideData === 1 ? resetAuthAction : resetSliderAction)
                    }
                  }
                }).catch(err => console.error('An error occurred',err));
                
              });
            }
          });
        });
      });
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoView}>
        <Image
          style={styles.logoImage}
          source={require('../../assets/assets/Authentication/logo.png')}
        />
      </View>
    </View>
  );
};

// Set the components styles.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoView: {
    backgroundColor: Colors.backgroundColor,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    marginLeft: 32,
    marginRight: 32,
    height: 50,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
