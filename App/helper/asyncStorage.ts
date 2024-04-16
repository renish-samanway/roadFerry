import AsyncStorage from '@react-native-async-storage/async-storage';

export default {
  IS_LOGIN: 'IS_LOGIN',
  LOGIN_UID: 'LOGIN_UID',
  LOGIN_USER_DATA: 'LOGIN_USER_DATA',
  LOGIN_TOKEN: 'LOGIN_TOKEN',
  DISTANCE_MARGIN: 100,
  MIN_DISTANCE: 5,
  IS_SLIDER: 'IS_SLIDER',
  PICKUP_ADDRESS: 'PICKUP_ADDRESS',
  DROP_ADDRESS: 'DROP_ADDRESS',
  LOCAL_ADDRESS: 'LOCAL_ADDRESS',
  FCM_TOKEN: 'FCM_TOKEN',
  NOTIFICATION_DATA: 'NOTIFICATION_DATA'
};

export const setPreferenceData = async (key:string, data:any) => {
  await AsyncStorage.setItem(key, JSON.stringify(data));
};

export const getPreferenceData = async (key:string) => {
  await AsyncStorage.getItem(key).then((value) => {
    if(value){
        return JSON.parse(value)
    }
  });
};