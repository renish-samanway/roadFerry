import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';
import Colors from './extensions/Colors';

let BASE_URL = 'https://api.roadferry.in/api/'

export default {
  SYSLOCALTIME: 'system_local_time',
  TIMEZONE: 'system_time_zone',
  DEVICEID: 'device_id',
  SYSOSVERSION: 'system_os_version',
  APPVERSION: 'app_version',
  DEVICETYPE: 'device_type',
  DEVICEMMODEL: 'device_make_model',
  isAndroid: Platform.OS === 'android',
  isIOS: Platform.OS === 'ios',
  driverStatusVerifiedKey: 'verified',
  vehicleStatusVerifiedKey: 'verified',
  SEND_NOTIFICATION: `${BASE_URL}sendNotification`,
  google_place_api_key: 'AIzaSyCItzj5w3MbKo3zTyY0i4K6fPvbUYGNN-4',  
  country_code: "+91",
  opacityLevel: 0.6,

  device_details: {
    SYSLOCALTIME: new Date().toLocaleString(),
    TIMEZONE: 'EST',
    DEVICEID: DeviceInfo.getUniqueID,
    SYSOSVERSION: parseInt(Platform.Version, 10),
    APPVERSION: DeviceInfo.getVersion,
    DEVICETYPE: Platform.OS === 'ios' ? '2' : '1',
    DEVICEMMODEL: DeviceInfo.getModel(),
  },
};

export const customStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize:30,
  separatorStrokeWidth: 4,
  stepStrokeWidth: 0,
  currentStepStrokeWidth: 0,

  stepIndicatorFinishedColor: Colors.primaryColor,
  stepIndicatorCurrentColor: Colors.primaryColor,
  separatorFinishedColor: Colors.primaryColor,

  separatorUnFinishedColor: Colors.inActiveLineColor,
  stepIndicatorUnFinishedColor: Colors.inActiveLineColor,
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: "#ffffff",
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#ffffff",
  labelSize: 16,
  currentStepLabelColor: '#fe7013'
}

export const seconds = 30;