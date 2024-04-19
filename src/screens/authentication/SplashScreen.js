import React, {useEffect} from 'react';
import {View, StyleSheet, Image} from 'react-native';

// Import the Plugins and Thirdparty library.
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import the JS file.

import Colors from '../../helper/extensions/Colors';
import AppPreference from '../../helper/preference/AppPreference';
import * as fetchProfileDataActions from '../../store/actions/customer/profile/fetchProfileData';
import {useDispatch} from 'react-redux';
import { NavigationActions, StackActions } from 'react-navigation';
import { setIsLoginUser } from '../../navigation/MainNavigation';

// Load the main class.
const actions = [NavigationActions.navigate({ routeName: "Dashboard"/* , params: {}, action: NavigationActions.navigate({ routeName: 'Dashboard' }) */})]
const resetDashboardAction = StackActions.reset({
  index: 0,
  actions: actions
});

const resetSliderAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "Slider1" })]
});

const SplashScreen = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(() => {
        AsyncStorage.getItem(AppPreference.IS_SLIDER).then((value) => {
          const slideData = JSON.parse(value);
          AsyncStorage.getItem(AppPreference.LOGIN_USER_DATA).then((userData) => {
            if (userData != null) {
              let convertedUserData = JSON.parse(userData)
              AsyncStorage.getItem(AppPreference.LOGIN_UID).then((userUID) => {
                console.log(`userUID: ${userUID}`)
                dispatch({
                  type: fetchProfileDataActions.FETCH_PROFILE_DATA,
                  fetchProfileData: convertedUserData,
                  userUID: userUID
                });
                setIsLoginUser(true)
              })
            }
          })
          // props.navigation.navigate(slideData === 1 ? 'Dashboard' : 'Slider1');
          props.navigation.dispatch(slideData === 1 ? resetDashboardAction : resetSliderAction);
        }

          // props.navigation.navigate(
          //   JSON.parse(value) === '1' ? 'Dashboard' : 'Slider1',
          // ),
        );

      // AsyncStorage.getItem(AppPreference.IS_SLIDER).then((value) => {
      //   const slideData = JSON.parse(value);
      //   console.log('Slider Value is : ', slideData);
      //   AsyncStorage.getItem(AppPreference.IS_LOGIN).then((valueLogin) => {
      //     const isLogin = JSON.parse(valueLogin);
      //     console.log('Login Value is : ', isLogin);
      //     if (isLogin === 1) {
      //       props.navigation.navigate('Dashboard');
      //     } else {
      //       props.navigation.navigate(slideData === 1 ? 'auth' : 'Slider1');
      //     }
      //   });
      // });
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
    width: '100%',
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
