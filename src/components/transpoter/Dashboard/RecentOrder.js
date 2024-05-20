import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

// Import the Plugins and Thirdparty library.
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

// Import the JS file.
import Colors from '../../../helper/extensions/Colors';
import SelectParcel from '../../../components/Customer/AddParcelDetails/SelectParcel';
const windowWidth = Dimensions.get('window').width;
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import MenuView from '../../design/MenuView';

const RecentOrder = (props) => {
  const { data: parcelData, navigation, isDriverRecentOrder, isDriverDetail } = props;
  // console.log(`data: ${JSON.stringify(data)}`)
  const openParcelDetailsScreen = (data) => {
    navigation.navigate({
      routeName: isDriverDetail ? 'DriverDetailScreen' : 'ParcelDetailsScreen',
      params: {
        historyStatus: 0,
        selectedOrderData: data,
      },
    })
  }
  if (parcelData == undefined) {
    return (null)
  }
  return (
    <TouchableOpacity
      style={styles.historyView}
      onPress={() => {
        openParcelDetailsScreen(parcelData)
      }}>
      <View style={styles.itemRow}>
        <Text style={styles.unSelectedStatusText}>#{parcelData.data.order_id}</Text>
        <Text style={styles.titleText}>₹ {parcelData.data.price}</Text>
      </View>
      <View style={styles.textView}>
        <Text style={styles.titleText} numberOfLines={1}>
          {parcelData.data.pickup_location.city}
        </Text>
        <Text style={styles.subTitleText}>-- to --</Text>
        <Text style={styles.titleText} numberOfLines={1}>
          {parcelData.data.drop_location.city}
        </Text>
      </View>
      <SelectParcel isTransporter={true} parcelHistory={true} data={parcelData.data.drop_location} />
      {/* {isDriverRecentOrder ? 
        <>
          <View style={styles.seperateLine} />
            <View style={{margin: 8}}>
              <Text style={styles.subTitleText}>Customer Details</Text>
              <Text style={{...styles.titleText, marginTop: 4}}>
                Michael Wayans
              </Text>
              <Text style={{...styles.subTitleText, marginTop: 4}}>
                Contact number
              </Text>
              <Text style={{...styles.titleText, marginTop: 4}}>
                +91 99844 38573
              </Text>
            </View>
          <View style={styles.seperateLine} />
        </>
       : null} */}
      {!isDriverRecentOrder ? <View style={styles.itemRow}>
        <TouchableOpacity 
          style={styles.detailView}
          onPress={() => {
            openParcelDetailsScreen(parcelData)
          }}>
          <Text style={styles.detailText}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.acceptView}
          onPress={() =>
            props.onPressAccept()
          }>
          <Text style={styles.acceptText}>Accept</Text>
        </TouchableOpacity>
      </View>
      : <View style={styles.itemRow}>
      <TouchableOpacity 
        style={styles.detailView}
        onPress={() => {
          openParcelDetailsScreen(parcelData)
        }}>
        <Text style={styles.detailText}>Details</Text>
      </TouchableOpacity>
      {isDriverRecentOrder ? 
        <MenuView
          navigation={props.navigation}
          data={parcelData} 
          isAssigned={true} 
          onRefreshList={() => {
            // consolesetIsLoading(false)
            if (props.onStatusChange) {
              props.onStatusChange()
            }
          }}
          showLoader={() => {
            // console.log(`showLoader`)
            //setIsLoading(true)
          }}
          hideLoader={() => {
            // console.log(`hideLoader`)
            //setIsLoading(false)
          }}
        /> : null
      }
    </View> }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  historyView: {
    // flex: 1,
    margin: 16,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 10,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 5,
    shadowOpacity: 0.15,
    elevation: 5,
  },
  itemRow: {
    margin: 8,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    margin: 8,
    marginBottom: 0,
    marginTop: 0,
    color: Colors.titleTextColor,
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-SemiBold',
  },
  subTitleText: {
    margin: 8,
    marginBottom: 0,
    marginTop: 0,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.8),
    color: Colors.subTitleTextColor,
  },
  textView: {
    margin: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  detailView: {
    margin: 16,
    marginTop: 0,
    width: windowWidth / 2 - 64,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.mainBackgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptView: {
    margin: 16,
    marginTop: 0,
    width: windowWidth / 2 - 64,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.acceptedViewColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailText: {
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Regular',
    color: Colors.titleTextColor,
  },
  acceptText: {
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Regular',
    color: Colors.backgroundColor,
  },
  acceptedView: {
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: Colors.acceptedViewColor,
    height: 55,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  unSelectedStatusText: {
    padding: 8,
    color: Colors.primaryColor,
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Regular',
  },
  optionView: {
    margin: 16,
    marginTop: 0,
    width: windowWidth / 2 - 64,
    height: 40,
    borderRadius: 20,
    borderColor: Colors.titleTextColor,
    borderWidth: 0.5,
    flexDirection: 'row',
    // backgroundColor: Colors.acceptedViewColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Regular',
    color: Colors.titleTextColor,
  },
  optionImage: {
    height: 30,
    width: 30,
  },
  seperateLine: {
    backgroundColor: Colors.subViewBGColor,
    height: 1,
  },
  menuItemText: {
    textAlign: 'center', 
    fontSize: RFPercentage(2), 
    fontFamily: 'SofiaPro-Regular'
  },
  menuItemView: {
    backgroundColor: Colors.mainBackgroundColor
  },
});

export default RecentOrder;
