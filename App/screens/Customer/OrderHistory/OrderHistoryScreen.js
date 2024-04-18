import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import {useSelector, useDispatch, connect} from 'react-redux';

// Import the Plugins and Thirdparty library.
import {RFPercentage} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import {OrderHistroyData} from '../../../helper/extensions/dummyData';
import SelectParcel from '../../../components/Customer/AddParcelDetails/SelectParcel';
import * as getOrderHistoryDataActions from '../../../store/actions/customer/orderHistory/getOrderHistoryData';
import AppPreference from '../../../helper/preference/AppPreference';
import EmptyData from '../../../components/design/EmptyData';
import Loader from '../../../components/design/Loader';
// import { NavigationActions, StackActions } from 'react-navigation';

// Load the main class.
const windowWidth = Dimensions.get('window').width;
/* const resetAuthAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "LoginScreen" })]
}); */

const OrderHistoryScreen = (props) => {
  // let isShowBack = props.navigation.getParam('isShowBack');
  // console.log(`isShowBack:`, isShowBack)

  let userUID = useSelector(
    (state) => state.fetchProfileData.userUID,
  );
  // console.log(`OrderHistoryScreen.userUID: ${userUID}`)
  const checkAndNavigateToLogin = () => {
    AsyncStorage.getItem(AppPreference.IS_LOGIN).then((valueLogin) => {
      const isLogin = JSON.parse(valueLogin);
      console.log('Login Value is : ', isLogin);
      if (isLogin != 1) {
        props.navigation.navigate('LoginScreen')
      }
    });
  }

  const [pendingFlag, setPendingFlag] = useState(true);
  const [onGoingFlag, setOnGoingFlag] = useState(false);
  const [completedFlag, setCompletedFlag] = useState(false);

  const pendingData = useSelector(
    (state) => state.customerPendingOrderData.customerPendingOrderData,
  );
  const ongoingData = useSelector(
    (state) => state.customerOngoingOrderData.customerOngoingOrderData,
  );
  const completedData = useSelector(
    (state) => state.customerCompletedOrderData.customerCompletedOrderData,
  );

  const orderDataLoading = useSelector(
    (state) => state.customerPendingOrderData.isLoading,
  );

  const dispatch = useDispatch();
  const loadOrderHistoryData = useCallback(async () => {
    checkAndNavigateToLogin()
    try {
      dispatch(getOrderHistoryDataActions.getCustomerOrderData(userUID));
    } catch (err) {
      console.log('Error is : ', err);
      // Alert.alert(
      //   'Alert',
      //   err.message.replace(/[[&\/\\#,+()$~%.'":*?<>{}]/g, ''),
      //   [
      //     {
      //       text: 'OK',
      //       onPress: () => console.log('Cickeed!'),
      //     },
      //   ],
      //   {cancelable: false},
      // );
    }
  }, [dispatch, userUID]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      'willFocus',
      loadOrderHistoryData,
    );

    return () => {
      willFocusSub.remove();
    };
  }, [loadOrderHistoryData]);

  useEffect(() => {
    // setIsLoading(true);
    loadOrderHistoryData().then(() => {
      // setIsLoading(false);
    });
  }, [dispatch, loadOrderHistoryData]);

  // useEffect(() => {
  //   dispatch(getOrderHistoryDataActions.getCustomerOrderData());
  // }, [dispatch]);

  const renderPendingHistroyData = (itemData) => {
    console.log(`itemData.item:`, itemData.item)
    return (
      <TouchableOpacity
        style={styles.historyView}
        onPress={() =>
          props.navigation.navigate({
            routeName: 'OrderDetailsScreen',
            params: {
              selectedOrderData: itemData.item,
            },
          })
        }>
        <View style={styles.itemRow}>
          <Text style={styles.unSelectedStatusText}>
            #{itemData.item.data.order_id}
          </Text>
          <Text style={styles.titleText}>₹{itemData.item.data.price}</Text>
        </View>
        <View style={styles.textView}>
          <Text style={styles.titleText} numberOfLines={1}>
            {itemData.item.data.pickup_location.city}
          </Text>
          <Text style={styles.subTitleText}>-- to --</Text>
          <Text style={styles.titleText} numberOfLines={1}>
            {itemData.item.data.drop_location.city}
          </Text>
        </View>
        <SelectParcel
          parcelHistory={true}
          transporterData={itemData.item.data.transporter_details}
        />
        <View style={styles.itemRow}>
          <TouchableOpacity
            style={styles.detailView}
            onPress={() =>
              itemData?.item?.data?.transporter_uid
              ?
                props.navigation.navigate({
                  routeName: 'OrderDetailsScreen',
                  params: {
                    selectedOrderData: itemData.item,
                  },
                })
              :
                props.navigation.navigate({
                  routeName: 'DashboardScreen',
                  params: {
                    selectedOrderData: itemData.item?.data,
                    selectedOrderDataId: itemData.item?.id,
                    assignTransporterMode: true
                  },
                })
            }>
            <Text style={styles.detailText}>
              {itemData?.item?.data?.transporter_uid ? 'Details' : 'Assign Transporter'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelView}
            onPress={() =>
              props.navigation.navigate({
                routeName: 'CancelOrderScreen',
                params: {
                  orderData: itemData.item,
                  refreshData: () => {
                    loadOrderHistoryData().then(() => {
                    });
                  }
                }
              })
            }>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCompletedHistroyData = (itemData) => {
    return (
      <TouchableOpacity
        style={styles.historyView}
        onPress={() =>
          props.navigation.navigate({
            routeName: 'OrderDetailsScreen',
            params: {
              selectedOrderData: itemData.item,
            },
          })
        }>
        <View style={styles.itemRow}>
          <Text style={styles.unSelectedStatusText}>
            #{itemData.item.data.order_id}
          </Text>
          <Text style={styles.titleText}>₹{itemData.item.data.price}</Text>
        </View>
        <View style={styles.textView}>
          <Text style={styles.titleText} numberOfLines={1}>
            {itemData.item.data.pickup_location.city}
          </Text>
          <Text style={styles.subTitleText}>-- to --</Text>
          <Text style={styles.titleText} numberOfLines={1}>
            {itemData.item.data.drop_location.city}
          </Text>
        </View>
        <SelectParcel
          parcelHistory={true}
          transporterData={itemData.item.data.transporter_details}
        />
        <View style={styles.itemRow}>
          <TouchableOpacity
            style={styles.detailView}
            onPress={() =>
              props.navigation.navigate({
                routeName: 'OrderDetailsScreen',
                params: {
                  selectedOrderData: itemData.item,
                },
              })
            }>
            <Text style={styles.detailText}>Details</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.cancelView}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity> */}
        </View>
      </TouchableOpacity>
    );
  };

  const renderOngoingdHistroyData = (itemData) => {
    const {item} = itemData;
    const {data} = item;
    const {driver_details} = data;
    let name='';
    if(driver_details!=undefined && driver_details.first_name!=undefined){
      name = driver_details.first_name
    }
    if(driver_details!=undefined && driver_details.last_name){
      name = name +' '+driver_details.last_name
    }
    return (
      <TouchableOpacity
        style={styles.completedHistoryMainView}
        onPress={() =>
          props.navigation.navigate({
            routeName: 'OrderDetailsScreen',
            params: {
              selectedOrderData: itemData.item,
            },
          })
        }>
        <View style={styles.acceptedView}>
          <Text style={styles.selectedStatusText}>Accepted</Text>
        </View>
        <View style={styles.completedHistorySubView}>
          <View style={styles.itemRow}>
            <Text style={styles.unSelectedStatusText}>
              #{itemData.item.data.order_id}
            </Text>
            <Text style={styles.titleText}>₹{itemData.item.data.price}</Text>
          </View>
          <View style={styles.textView}>
            <Text style={styles.titleText} numberOfLines={1}>
              {itemData.item.data.pickup_location.city}
            </Text>
            <Text style={styles.subTitleText}>-- to --</Text>
            <Text style={styles.titleText} numberOfLines={1}>
              {itemData.item.data.drop_location.city}
            </Text>
          </View>
          <SelectParcel
            parcelHistory={true}
            transporterData={itemData.item.data.transporter_details}
          />
          <View style={styles.seperateLine} />
          <View style={{margin: 8}}>
            <Text style={styles.subTitleText}>Driver Details</Text>
            <Text style={{...styles.titleText, marginTop: 4}}>
              {name.trim()}
            </Text>
            <Text style={{...styles.subTitleText, marginTop: 4}}>
              Contact number
            </Text>
            <Text style={{...styles.titleText, marginTop: 4}}>
              +91 {itemData.item.data.driver_details.phone_number}
            </Text>
          </View>
          <View style={styles.seperateLine} />
          <View style={styles.itemRow}>
            <TouchableOpacity
              style={styles.detailView}
              onPress={() =>
                props.navigation.navigate({
                  routeName: 'OrderDetailsScreen',
                  params: {
                    selectedOrderData: itemData.item,
                  },
                })
              }>
              <Text style={styles.detailText}>Details</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{
              props.navigation.navigate({
                routeName: 'TrackOrder',
                params: {
                  orderData: itemData.item
                }
              })
            }} style={styles.trackOrderView}>
              <Text style={styles.selectedStatusText}>Track Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  const statusSelected = (valueType) => {
    if (valueType === 'pending') {
      setPendingFlag(true);
      setOnGoingFlag(false);
      setCompletedFlag(false);
    } else if (valueType === 'onGoing') {
      setPendingFlag(false);
      setOnGoingFlag(true);
      setCompletedFlag(false);
    } else {
      setPendingFlag(false);
      setOnGoingFlag(false);
      setCompletedFlag(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainerView}>
        <TouchableOpacity
          style={
            pendingFlag
              ? styles.selectedStatusView
              : styles.unSelectedStatusView
          }
          onPress={() => statusSelected('pending')}>
          <Text
            style={
              pendingFlag
                ? styles.selectedStatusText
                : styles.unSelectedStatusText
            }>
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            onGoingFlag
              ? styles.selectedStatusView
              : styles.unSelectedStatusView
          }
          onPress={() => statusSelected('onGoing')}>
          <Text
            style={
              onGoingFlag
                ? styles.selectedStatusText
                : styles.unSelectedStatusText
            }>
            Ongoing
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            completedFlag
              ? styles.selectedStatusView
              : styles.unSelectedStatusView
          }
          onPress={() => statusSelected('completed')}>
          <Text
            style={
              completedFlag
                ? styles.selectedStatusText
                : styles.unSelectedStatusText
            }>
            Completed
          </Text>
        </TouchableOpacity>
      </View>
      {pendingFlag ? 
        orderDataLoading ? <Loader loading={orderDataLoading} noModal={true}/> : 
        (pendingData != undefined && pendingData.length != 0) ? 
        <FlatList
          style={{marginBottom: 16}}
          keyExtractor={(item, index) => item.id}
          data={pendingData}
          renderItem={renderPendingHistroyData}
          showsVerticalScrollIndicator={false}
        />
       : <EmptyData data={"pending data"} tryAgain={() => {
        loadOrderHistoryData().then(() => {})
      }} /> : null
      }
      {onGoingFlag && (
        orderDataLoading ? <Loader loading={orderDataLoading} noModal={true}/> : 
        ongoingData != undefined && ongoingData.length != 0 ? <FlatList
          style={{marginBottom: 16}}
          keyExtractor={(item, index) => item.id}
          data={ongoingData}
          renderItem={renderOngoingdHistroyData}
          showsVerticalScrollIndicator={false}
        /> : <EmptyData data={"ongoing data"} tryAgain={() => {
          loadOrderHistoryData().then(() => {})
        }} />
      )}
      {completedFlag && (
        orderDataLoading ? <Loader loading={orderDataLoading} noModal={true}/> : 
        completedData != undefined && completedData.length != 0 ? <FlatList
          style={{marginBottom: 16}}
          keyExtractor={(item, index) => item.id}
          data={completedData}
          renderItem={renderCompletedHistroyData}
          showsVerticalScrollIndicator={false}
        /> : <EmptyData data={"completed data"} tryAgain={() => {
          loadOrderHistoryData().then(() => {})
        }} />
      )}
    </View>
  );
};

OrderHistoryScreen.navigationOptions = (navigationData) => {
  let isShowBack = navigationData.navigation.getParam('isShowBack');
  if (isShowBack === undefined) {
    isShowBack = false
  }
  console.log(`navigationOptions.isShowBack:`, isShowBack)
  // isShowBack = false
  return {
    headerShown: true,
    headerTitle: 'Parcel History',
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
    headerLeft: (
      <View style={styles.viewHeaderLeft}>
        <TouchableOpacity
          onPress={() => {
            console.log(`isShowBack:`, isShowBack)
            if (!isShowBack) {
              navigationData.navigation.toggleDrawer();
            } else {
              navigationData.navigation.pop();
            }
          }}>
          {!isShowBack ?
          <Image
            style={styles.menuImage}
            source={require('../../../assets/assets/dashboard/ic_menu.png')}
          /> :
          <Image
            style={styles.backImage}
            source={require('../../../assets/assets/Authentication/back.png')}
          />}
        </TouchableOpacity>
      </View>
    ),
  };
};

// Set the components styles.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  viewHeaderLeft: {
    paddingLeft: 16,
  },
  menuImage: {
    height: 30,
    width: 30,
  },
  backImage: {
    height: 40,
    width: 40,
  },
  statusContainerView: {
    margin: 16,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundColor,
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: Colors.subViewBGColor,
  },
  selectedStatusView: {
    width: windowWidth / 3 - 16,
    height: 50,
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  unSelectedStatusView: {
    width: windowWidth / 3 - 16,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  selectedStatusText: {
    padding: 8,
    color: Colors.backgroundColor,
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Regular',
  },
  unSelectedStatusText: {
    padding: 8,
    color: Colors.primaryColor,
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Regular',
  },
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
  cancelView: {
    margin: 16,
    marginTop: 0,
    width: windowWidth / 2 - 64,
    height: 40,
    borderRadius: 20,
    borderColor: Colors.primaryColor,
    borderWidth: 0.5,
    backgroundColor: Colors.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailText: {
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Regular',
    color: Colors.titleTextColor,
  },
  cancelText: {
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Regular',
    color: Colors.primaryColor,
  },
  acceptedView: {
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: Colors.acceptedViewColor,
    height: 55,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  completedHistoryMainView: {
    margin: 16,
    marginBottom: 0,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 10,
  },
  completedHistorySubView: {
    marginTop: -16,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 20,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 5,
    shadowOpacity: 0.15,
    elevation: 5,
  },
  seperateLine: {
    backgroundColor: Colors.subViewBGColor,
    height: 1,
  },
  trackOrderView: {
    margin: 16,
    marginTop: 0,
    width: windowWidth / 2 - 64,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.trackOrderViewColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OrderHistoryScreen;
