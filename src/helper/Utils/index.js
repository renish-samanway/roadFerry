import {Dimensions} from 'react-native';

export const images = {
  backWhiteBtn: require('../../assets/assets/icons/backWhiteBtn.png'),
  walletHeader: require('../../assets/assets/images/walletHeader.png'),
  depositMoneyIcon: require('../../assets/assets/icons/depositMoneyIcon.png'),
  withdrawMoneyIcon: require('../../assets/assets/icons/withdrawMoneyIcon.png'),
  rightArrow: require('../../assets/assets/icons/rightArrow.png'),
  longArrow: require('../../assets/assets/icons/longArrow.png'),
  backIcon: require('../../assets/assets/icons/ic_back.png'),
  filterIcon: require('../../assets/assets/icons/ic_filter.png'),
  repostFlagIcon: require('../../assets/assets/icons/ic_reportFlag.png'),
  transactionFailedImg: require('../../assets/assets/images/transactionFailed.png'),
  transactionSuccessImg: require('../../assets/assets/images/transactionSuccess.png'),
  phonpeImg: require('../../assets/assets/images/phonpeImg.png'),
  copyIcon: require('../../assets/assets/images/ic_file-copy.png'),
  greenTickImg: require('../../assets/assets/images/greenTick.png')
};

export const Dimens = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

export const stringValues = {
  rupeeSign: '\u20B9',
};

export const colors = {
  primary: '#F27351',
  white: '#fff',
  black: '#000',
  grey: '#D8D8D8',
  lightgrey: 'rgb(242,242,242)',
  red: '#B83232',
  green: '#289B4F',
  lightgreen: 'rgb(240,247,242)',
  lightGreenShadow: 'rgb(227, 240, 229)',
  transparent: 'rgba(0,0,0,0)',
  lightpurple: 'rgb(221,212,234)'
};

export const extractMonthAndYear = (date) => {
  let _s = date.split(' ');
  return `${_s[1]}, ${_s[3]}`;
};

// export const groupByDate = (arr, criteria) =>
//     arr.reduce((obj, item) => {
//         let key = typeof criteria === "function" ? criteria(item) : item[criteria];
//         if (!obj.hasOwnProperty(key)) obj[key] = [];
//         obj[key].push(item);
//         return obj;
//     }, {});
export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const formatWithCommas = (n) => { 
  return n.replace(/\B(?=(\d{3})+\b)/g, ","); 
}