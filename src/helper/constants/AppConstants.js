import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';

// let BASE_URL = 'https://logistics-dev-api.herokuapp.com/api/'
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
  country_code: "+91",
  opacityLevel: 0.6,
  // ! Key 1
  // ? Account: unknown
  // ? Project: unknown
  // ? Link: unknown
  // google_place_api_key: 'AIzaSyCDcXgJPp5FE1Tiw_Uzh7LJlbfoHu3SwLc',
  // ! Key 2
  // ? Account: models.mobio@gmail.com
  // ? Project: Logistics-OnDemand app
  // ? Link: https://console.cloud.google.com/google/maps-apis/credentials?project=logistics-ondemand-app
  // google_place_api_key: 'AIzaSyDWcZSbyp_kYJSNxLRVVemkx_5V9JlQDHA',
  // ! Key 3
  // ? Account: models.mobio@gmail.com
  // ? Project: Road Ferry
  // ? Link: https://console.cloud.google.com/google/maps-apis/credentials?authuser=3&project=road-ferry-338510&supportedpurview=project
  google_place_api_key: 'AIzaSyCItzj5w3MbKo3zTyY0i4K6fPvbUYGNN-4',  
  transporterRegisterLink: "https://api.roadferry.in/register",
  device_details: {
    SYSLOCALTIME: new Date().toLocaleString(),
    TIMEZONE: 'EST',
    DEVICEID: DeviceInfo.getUniqueID,
    SYSOSVERSION: parseInt(Platform.Version, 10),
    APPVERSION: DeviceInfo.getVersion,
    DEVICETYPE: Platform.OS === 'ios' ? '2' : '1',
    DEVICEMMODEL: DeviceInfo.getModel(),
  },
  SEND_NOTIFICATION: `${BASE_URL}sendNotification`
};
