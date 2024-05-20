import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

// Import the Plugins and Thirdparty library.

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import {
  driverHistoryStatus,
  OrderHistroyData,
} from '../../../helper/extensions/dummyData';
import SelectParcel from '../../../components/Customer/AddParcelDetails/SelectParcel';
import { useDispatch, useSelector } from 'react-redux';
import EmptyData from '../../../components/design/EmptyData';
import * as getOrderHistoryDataActions from '../../../store/actions/customer/orderHistory/getOrderHistoryData';
import MenuView from '../../../components/design/MenuView';
import Loader from '../../../components/design/Loader';

// Load the main class.
const windowWidth = Dimensions.get('window').width;

const DriverHistoryScreen = (props) => {
  let selectedHistoryStatus = props.navigation.getParam('historyStatus');
  if (selectedHistoryStatus == undefined) {
    selectedHistoryStatus = 0
  }

  let userUID = useSelector(
    (state) => state.fetchProfileData.userUID,
  );
  // userUID = "B4Ti8IgLgpsKZECGqOJ0"
  console.log(`DriverHistoryScreen.userUID: ${userUID}`)

  let assignedData = props.navigation.getParam('assignedData');
  assignedData = useSelector(
    (state) => state.customerAssignedOrderData.customerAssignedOrderData,
  );

  let ongoingData = props.navigation.getParam('ongoingData');
  ongoingData = useSelector(
    (state) => state.customerOngoingOrderData.customerOngoingOrderData,
  );

  let completedData = props.navigation.getParam('completedData');
  completedData = useSelector(
    (state) => state.customerCompletedOrderData.customerCompletedOrderData,
  );

  let rejectedData = props.navigation.getParam('rejectedData');
  rejectedData = useSelector(
    (state) => state.customerRejectedOrderData.customerRejectedOrderData,
  );

  const isDetailPageLoading = useSelector((state) => state.customerOrderData.isDetailLoading)

  const dispatch = useDispatch();
  const loadOrderHistoryData = useCallback(async () => {
    try {
      dispatch(getOrderHistoryDataActions.getCustomerOrderData(userUID, false, true));
    } catch (err) {
      console.log('Error is : ', err);
    }
  }, [dispatch]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      'willFocus', () => {
        console.log(`willFocus`)
        // setSelectedIndex(selectedIndex)
        loadOrderHistoryData()
      });

    return () => {
      willFocusSub.remove();
    };
  }, [loadOrderHistoryData]);

  useEffect(() => {
    loadOrderHistoryData().then(() => {
    });
  }, [dispatch, loadOrderHistoryData]);

  const [isLoading, setIsLoading] = useState(false);

  const openDriverDetailScreen = (itemData) => {
    props.navigation.navigate({
      routeName: 'DriverDetailScreen',
      params: {
        historyStatus: selectedIndex,
        selectedOrderData: itemData.item,
        isOngoingList: (ongoingData != undefined && ongoingData.length !== 0)
      },
    })
  }

  const renderPendingHistoryData = (itemData) => {
    return (
      <TouchableOpacity
        style={styles.historyView}
        onPress={() =>
          openDriverDetailScreen(itemData)
        }>
        <View style={styles.itemRow}>
          <Text style={styles.unSelectedStatusText}>#{itemData.item.data.order_id}</Text>
          <Text style={styles.titleText}>₹ {itemData.item.data.price}</Text>
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
        <SelectParcel isTransporter={true} parcelHistory={true} data={itemData.item.data.drop_location} />
        {/* <View style={styles.seperateLine} />
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
        <View style={styles.seperateLine} /> */}
        <View style={styles.itemRow}>
          <TouchableOpacity
            style={styles.detailView}
            onPress={() => {
              openDriverDetailScreen(itemData)
            }}>
            <Text style={styles.detailText}>Details</Text>
          </TouchableOpacity>
          <MenuView
            navigation={props.navigation}
            data={itemData.item}
            isAssigned={true}
            onRefreshList={() => {
              setIsLoading(false)
              loadOrderHistoryData().then(() => { })
            }}
            showLoader={() => {
              // console.log(`showLoader`)
              setIsLoading(true)
            }}
            hideLoader={() => {
              // console.log(`hideLoader`)
              setIsLoading(false)
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderOngoingHistoryData = (itemData) => {
    const { item } = itemData
    const { data } = item
    const { status } = data
    return (
      <TouchableOpacity
        style={styles.historyView}
        onPress={() =>
          openDriverDetailScreen(itemData)
        }>
        {/* <View style={styles.acceptedView}>
          <Text style={styles.selectedStatusText}>Accepted</Text>
        </View> */}
        {/* <View style={styles.completedHistorySubView}> */}
        <View style={styles.itemRow}>
          <Text style={styles.unSelectedStatusText}>#{itemData.item.data.order_id}</Text>
          <Text style={styles.titleText}>₹ {itemData.item.data.price}</Text>
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
        <SelectParcel isTransporter={true} parcelHistory={true} data={itemData.item.data.drop_location} />
        {/* <View style={styles.seperateLine} />
          <View style={{margin: 8}}>
            <Text style={styles.subTitleText}>Driver Details</Text>
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
          <View style={styles.seperateLine} /> */}
        <View style={styles.itemRow}>
          <TouchableOpacity
            style={styles.detailView}
            onPress={() => {
              openDriverDetailScreen(itemData)
            }}>
            <Text style={styles.detailText}>Details</Text>
          </TouchableOpacity>
          {/* {itemData} */}
          {status != undefined && status != 'dispute' &&
            <MenuView
              navigation={props.navigation}
              data={itemData.item}
              isAssigned={false}
              onRefreshList={() => {
                setIsLoading(false)
                loadOrderHistoryData().then(() => { })
              }}
              showLoader={() => {
                // console.log(`showLoader`)
                setIsLoading(true)
              }}
              hideLoader={() => {
                // console.log(`hideLoader`)
                setIsLoading(false)
              }}
            />}
        </View>
        {/* </View> */}
      </TouchableOpacity>
    );
  };

  const renderCompletedHistoryData = (itemData) => {
    return (
      <TouchableOpacity
        style={styles.historyView}
        onPress={() =>
          openDriverDetailScreen(itemData)
        }>
        <View style={styles.itemRow}>
          <Text style={styles.unSelectedStatusText}>#{itemData.item.data.order_id}</Text>
          <Text style={styles.titleText}>₹ {itemData.item.data.price}</Text>
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
        <SelectParcel isTransporter={true} parcelHistory={true} data={itemData.item.data.drop_location} />
        <View style={styles.itemRow}>
          <TouchableOpacity
            style={styles.detailView}
            onPress={() => {
              openDriverDetailScreen(itemData)
            }}
          >
            <Text style={styles.detailText}>Details</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRejectedHistoryData = (itemData) => {
    return (
      <TouchableOpacity
        style={styles.historyView}
        onPress={() =>
          openDriverDetailScreen(itemData)
        }>
        <View style={styles.itemRow}>
          <Text style={styles.unSelectedStatusText}>#{itemData.item.data.order_id}</Text>
          <Text style={styles.titleText}>₹ {itemData.item.data.price}</Text>
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
        <SelectParcel isTransporter={true} parcelHistory={true} data={itemData.item.data.drop_location} />
        <View style={styles.itemRow}>
          <TouchableOpacity
            style={styles.detailView}
            onPress={() => {
              openDriverDetailScreen(itemData)
            }}
          >
            <Text style={styles.detailText}>Details</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const [selectedIndex, setSelectedIndex] = useState(selectedHistoryStatus);

  const historyStatusData = (itemData) => {
    return (
      <TouchableOpacity
        style={
          selectedIndex === itemData.item.id
            ? styles.selectedStatusView
            : styles.unSelectedStatusView
        }
        onPress={() => {
          setSelectedIndex(itemData.item.id)
          if (itemData.item.id == driverHistoryStatus.length - 1) {
            flatList.current.scrollToEnd({ animated: true })
          }
          if (itemData.item.id == 0) {
            flatList.current.scrollToIndex({ animated: true, index: 0 })
          }
        }}>
        <Text
          style={
            selectedIndex === itemData.item.id
              ? styles.selectedStatusText
              : styles.unSelectedStatusText
          }>
          {itemData.item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const flatList = useRef(null);
  return (
    <View style={styles.container}>
      <View style={styles.statusContainerView}>
        <FlatList
          ref={flatList}
          horizontal
          keyExtractor={(item, index) => item.id}
          data={driverHistoryStatus}
          renderItem={historyStatusData}
          showsHorizontalScrollIndicator={false}
          onContentSizeChange={(contentWidth, contentHeight) => {
            if (selectedIndex == driverHistoryStatus.length - 1) {
              flatList.current.scrollToEnd({ animated: true })
            }
            if (selectedIndex == 0) {
              flatList.current.scrollToIndex({ animated: true, index: 0 })
            }
          }}
        />
      </View>
      {selectedIndex === 0 ?
        assignedData != undefined && assignedData.length != 0 ? <FlatList
          style={{ marginBottom: 16 }}
          keyExtractor={(item, index) => item.id}
          data={assignedData}
          renderItem={renderPendingHistoryData}
          showsVerticalScrollIndicator={false}
        /> : <EmptyData data={"assigned data"} tryAgain={() => {
          loadOrderHistoryData().then(() => { })
        }} />
        : null}
      {selectedIndex === 1 ?
        ongoingData != undefined && ongoingData.length != 0 ? <FlatList
          style={{ marginBottom: 16 }}
          keyExtractor={(item, index) => item.id}
          data={ongoingData}
          renderItem={renderOngoingHistoryData}
          showsVerticalScrollIndicator={false}
        /> : <EmptyData data={"ongoing data"} tryAgain={() => {
          loadOrderHistoryData().then(() => { })
        }} />
        : null}
      {selectedIndex === 2 ?
        completedData != undefined && completedData.length != 0 ? <FlatList
          style={{ marginBottom: 16 }}
          keyExtractor={(item, index) => item.id}
          data={completedData}
          renderItem={renderCompletedHistoryData}
          showsVerticalScrollIndicator={false}
        /> : <EmptyData data={"completed data"} tryAgain={() => {
          loadOrderHistoryData().then(() => { })
        }} />
        : null}
      {selectedIndex === 3 ?
        rejectedData != undefined && rejectedData.length != 0 ? <FlatList
          style={{ marginBottom: 16 }}
          keyExtractor={(item, index) => item.id}
          data={rejectedData}
          renderItem={renderRejectedHistoryData}
          showsVerticalScrollIndicator={false}
        /> : <EmptyData data={"rejected data"} tryAgain={() => {
          loadOrderHistoryData().then(() => { })
        }} />
        : null}
      <Loader loading={isLoading || isDetailPageLoading} />
    </View>
  );
};

DriverHistoryScreen.navigationOptions = (navigationData) => {
  let selectedHistoryStatus = navigationData.navigation.getParam('historyStatus');
  let isShowDrawer = false
  if (selectedHistoryStatus === undefined) {
    isShowDrawer = true
  }

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
            if (isShowDrawer) {
              navigationData.navigation.toggleDrawer();
            } else {
              navigationData.navigation.pop();
            }
          }}>
          {isShowDrawer ?
            <Image
              style={styles.menuImage}
              source={require('../../../assets/assets/dashboard/ic_menu.png')}
            /> :
            <Image
              style={styles.menuImage}
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
  menuItemText: {
    textAlign: 'center',
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Regular'
  },
  menuItemView: {
    backgroundColor: Colors.mainBackgroundColor
  },
  viewHeaderLeft: {
    paddingLeft: 16,
  },
  menuImage: {
    height: 40,
    width: 40,
  },
  statusContainerView: {
    margin: 16,
    marginBottom: 0,
    // marginRight: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundColor,
    borderRadius: 25,
    // borderTopStartRadius: 25,
    // borderBottomStartRadius: 25,
    borderWidth: 0.5,
    borderColor: Colors.subViewBGColor,
  },
  selectedStatusView: {
    width: windowWidth / 4,
    height: 50,
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  unSelectedStatusView: {
    width: windowWidth / 4,
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
    shadowOffset: { width: 0, height: 5 },
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
  detailText: {
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Regular',
    color: Colors.titleTextColor,
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
    backgroundColor: Colors.backgroundColor,
    borderRadius: 10,
  },
  completedHistorySubView: {
    // marginTop: -16,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 5 },
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

export default DriverHistoryScreen;
