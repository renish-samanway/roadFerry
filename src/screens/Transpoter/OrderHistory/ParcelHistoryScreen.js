import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Linking
} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

// Import the Plugins and Thirdparty library.

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import {
  historyStatus,
  OrderHistroyData,
} from '../../../helper/extensions/dummyData';
import SelectParcel from '../../../components/Customer/AddParcelDetails/SelectParcel';
import * as getOrderHistoryDataActions from '../../../store/actions/customer/orderHistory/getOrderHistoryData';
import {useSelector, useDispatch, useStore} from 'react-redux';
import EmptyData from '../../../components/design/EmptyData';
import BottomSheetView from '../../../components/design/BottomSheetView';
import Modal from 'react-native-modal';
import { closestIndexTo } from 'date-fns/esm';
import AppConstants from '../../../helper/constants/AppConstants';
import MenuView from '../../../components/design/MenuView';

// Load the main class.
const windowWidth = Dimensions.get('window').width;

const ParcelHistoryScreen = (props) => {
  let selectedHistoryStatus = props.navigation.getParam('historyStatus');
  // console.log(`selectedHistoryStatus: ${selectedHistoryStatus}`)
  if (selectedHistoryStatus == undefined) {
    selectedHistoryStatus = 0
  }

  let isRefresh = props.navigation.getParam('isRefresh', false);
  console.log(`ParcelHistoryScreen.isRefresh: ${isRefresh}`)

  let userUID = useSelector(
    (state) => state.fetchProfileData.userUID,
  );
  // userUID = "B4Ti8IgLgpsKZECGqOJ0"
  console.log(`ParcelHistoryScreen.userUID: ${userUID}`)

  const store = useStore()
  let pendingData = props.navigation.getParam('pendingData');
  // if (pendingData == undefined/*  || isRefresh */) {
    pendingData = useSelector(
      (state) => state.customerPendingOrderData.customerPendingOrderData,
    )
  // }

  let ongoingData = props.navigation.getParam('ongoingData');
  // if (ongoingData == undefined/*  || isRefresh */) {
    ongoingData = useSelector(
      (state) => state.customerOngoingOrderData.customerOngoingOrderData,
    )
  // }

  let completedData = props.navigation.getParam('completedData');
  // if (completedData == undefined/*  || isRefresh */) {
    completedData = useSelector(
      (state) => state.customerCompletedOrderData.customerCompletedOrderData,
    )
  // }

  let rejectedData = props.navigation.getParam('rejectedData');
  // if (rejectedData == undefined/*  || isRefresh */) {
    rejectedData = useSelector(
      (state) => state.customerRejectedOrderData.customerRejectedOrderData,
    )
  // }

  const [flagAccept, setFlagAccept] = useState(false);
  const [tapOrderData, setTapOrderData] = useState(undefined);
  const [popup, setPopup] = useState(false);

  const dispatch = useDispatch();
  const loadOrderHistoryData = useCallback(async () => {
    try {
      dispatch(getOrderHistoryDataActions.getCustomerOrderData(userUID, true, true));
    } catch (err) {
      console.log('Error is : ', err);
    }
  }, [dispatch]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      'willFocus',() => {
        console.log(`willFocus`)
        // setSelectedIndex(selectedHistoryStatus)
        loadOrderHistoryData()
      });

    return () => {
      willFocusSub.remove();
    };
  }, [loadOrderHistoryData]);

  useEffect(() => {
    loadOrderHistoryData().then(() => {
      console.log(`ParcelHistoryScreen.loadOrderHistoryData.pendingData:`, pendingData)
      /* pendingData = useSelector(
        (state) => state.customerPendingOrderData.customerPendingOrderData,
      );

      ongoingData = useSelector(
        (state) => state.customerOngoingOrderData.customerOngoingOrderData,
      );

      completedData = useSelector(
        (state) => state.customerCompletedOrderData.customerCompletedOrderData,
      );

      rejectedData = useSelector(
        (state) => state.customerRejectedOrderData.customerRejectedOrderData,
      ); */
    });
  }, [dispatch, loadOrderHistoryData]);

  const refreshData = () => {
    /* loadOrderHistoryData().then(() => {
      props.navigation.setParams({ isRefresh: true })
    }); */
  }

  const openParcelDetailsScreen = (itemData) => {
    props.navigation.navigate({
      routeName: 'ParcelDetailsScreen',
      params: {
        historyStatus: selectedIndex,
        selectedOrderData: itemData.item,
        refreshData: () => {
          refreshData()
        }
      },
    })
  }

  const renderPendingHistoryData = (itemData) => {
    // console.log(`itemData: ${JSON.stringify(itemData)}`)
    return (
      <TouchableOpacity
        disabled={flagAccept}
        style={styles.historyView}
        onPress={() =>
          openParcelDetailsScreen(itemData)
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
            {itemData.item.data.drop_location && itemData.item.data.drop_location.city != null ? itemData.item.data.drop_location.city : '[drop_location.city]'}
          </Text>
        </View>
        <SelectParcel isTransporter={true} parcelHistory={true} data={itemData.item.data.drop_location}/>
        <View style={styles.itemRow}>
          <TouchableOpacity 
            style={styles.detailView}
            disabled={flagAccept}
            onPress={() => {
              openParcelDetailsScreen(itemData)
            }}>
            <Text style={styles.detailText}>Details</Text>
          </TouchableOpacity>
          {itemData.item.data.status === "pending" ? <TouchableOpacity
            style={styles.cancelView}
            disabled={flagAccept}
            onPress={() => {
              console.log(`AcceptTapHandler: ${itemData.index}`)
              setTapOrderData(itemData.item)
              setFlagAccept(true)
              // setPopup(true)
            }}>
            <Text style={styles.cancelText}>Accept</Text>
          </TouchableOpacity> : 
          <MenuView
            navigation={props.navigation}
            data={itemData.item}
            isAssigned={true}
            onRefreshList={() => {
              //setIsLoading(false)
              loadOrderHistoryData().then(() => {})
            }}
            showLoader={() => {
              // console.log(`showLoader`)
              //setIsLoading(true)
            }}
            hideLoader={() => {
              // console.log(`hideLoader`)
              //setIsLoading(false)
            }}
          />}
        </View>
      </TouchableOpacity>
    );
  };

  const openMaps = (daddr, saddr) => {
    //22.310971336030473, 73.18372684767557
    // const daddr = `${latitude},${longitude}`;
    const company = AppConstants.isIOS ? "apple" : "google";
    Linking.openURL(`http://maps.${company}.com/maps?daddr=${daddr}&saddr=${saddr}&directionsmode=driving`);
  }

  const getFormattedAddress = (location) => {
    return `${location.flat_name +
      ', ' +
      location.area +
      ', ' +
      location.city +
      ', ' +
      location.state +
      ' - ' +
      location.pincode +
      '. ' +
      location.country}`
  }

  const renderOngoingdHistroyData = (itemData) => {
    console.log('on going data',itemData)
    let backgroundColor = Colors.acceptedViewColor
    let statusText = 'Accepted'
    if (itemData.item.data.status == 'assigned') {

    } else if (itemData.item.data.status == 'on-loading') {
      backgroundColor = Colors.onloadingViewColor
      statusText = 'On-loading'
    } else if (itemData.item.data.status == 'on-way') {
      backgroundColor = Colors.onwayViewColor
      statusText = 'On-way'
    } else if (itemData.item.data.status == 'unloading') {
      backgroundColor = Colors.unloadingViewColor
      statusText = 'Unloading'
    } else if (itemData.item.data.status == 'dispute') {
      backgroundColor = Colors.disputeViewColor
      statusText = 'Dispute'
    }

    let isSelfOrder = false
    if (itemData.item.data.driver_details.user_uid === userUID) {
      isSelfOrder = true
    }

    return (
      <TouchableOpacity
        style={styles.completedHistoryMainView}
        onPress={() =>
          openParcelDetailsScreen(itemData)
        }>
        {isSelfOrder ? null : <View style={[styles.acceptedView, {backgroundColor: backgroundColor}]}>
          <Text style={styles.selectedStatusText}>{statusText}</Text>
        </View>}
        <View style={[styles.completedHistorySubView, {marginTop: isSelfOrder ? 0 : -16}]}>
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
          <SelectParcel isTransporter={true} parcelHistory={true} data={itemData.item.data.drop_location}/>
          {isSelfOrder ? null : <>
            <View style={styles.seperateLine} />
            <View style={{margin: 8}}>
              <Text style={styles.subTitleText}>Driver Details</Text>
              <Text style={{...styles.titleText, marginTop: 4}}>
                {`${itemData.item.data.driver_details.first_name} ${itemData.item.data.driver_details.last_name}`}
              </Text>
              <Text style={{...styles.subTitleText, marginTop: 4}}>
                Contact number
              </Text>
              <Text style={{...styles.titleText, marginTop: 4}}>
                {itemData.item.data.driver_details.phone_number}
              </Text>
            </View>
            <View style={styles.seperateLine} />
          </>}
          <View style={styles.itemRow}>
            <TouchableOpacity style={styles.detailView} onPress={()=> {
              openParcelDetailsScreen(itemData)
            }}>
              <Text style={styles.detailText}>Details</Text>
            </TouchableOpacity>
            {isSelfOrder ? 
            <MenuView 
              navigation={props.navigation}
              data={itemData.item} 
              isAssigned={false} 
              onRefreshList={() => {
                // setIsLoading(false)
                loadOrderHistoryData().then(() => {})
              }}
              showLoader={() => {
                // console.log(`showLoader`)
                // setIsLoading(true)
              }}
              hideLoader={() => {
                // console.log(`hideLoader`)
                // setIsLoading(false)
              }}
            /> :
            <TouchableOpacity style={styles.trackOrderView}
            onPress={() => {
              // openMaps(`${22.6898},${72.8566}`, `${22.3109},${73.1837}`)
              // openMaps(getFormattedAddress(itemData.item.data.drop_location), getFormattedAddress(itemData.item.data.pickup_location))
              props.navigation.navigate({
                routeName: 'TrackOrder',
                params: {
                  orderData: itemData.item
                }
              })
            }}>
              <Text style={styles.selectedStatusText}>Track Order</Text>
            </TouchableOpacity>
            }
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCompletedHistroyData = (itemData) => {
    return (
      <TouchableOpacity
        style={styles.historyView}
        onPress={() =>
          openParcelDetailsScreen(itemData)
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
          <TouchableOpacity style={styles.detailView} onPress={()=> {
            openParcelDetailsScreen(itemData)
          }}>
            <Text style={styles.detailText}>Details</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.cancelView}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity> */}
        </View>
      </TouchableOpacity>
    );
  };

  const renderRejectedHistroyData = (itemData) => {
    console.log(`renderRejectedHistroyData`)
    return (
      <TouchableOpacity
        style={styles.historyView}
        onPress={() =>
          openParcelDetailsScreen(itemData)
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
          <TouchableOpacity style={styles.detailView} onPress={()=> {
              openParcelDetailsScreen(itemData)
            }}>
            <Text style={styles.detailText}>Details</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };
  const flatList = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(selectedHistoryStatus);

  const historyStatusData = (itemData) => {
    return (
      <TouchableOpacity
        disabled={flagAccept}
        style={
          selectedIndex === itemData.item.id
            ? styles.selectedStatusView
            : styles.unSelectedStatusView
        }
        onPress={() => {
          setSelectedIndex(itemData.item.id)
          if (itemData.item.id == historyStatus.length - 1) {
            flatList.current.scrollToEnd({animated: true})
          } 
          if (itemData.item.id == 0) {
            flatList.current.scrollToIndex({animated: true, index: 0})
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

  return (
    <View style={styles.container}>
      <View style={styles.statusContainerView}>
        <FlatList
          ref={flatList}
          horizontal
          keyExtractor={(item, index) => item.id}
          data={historyStatus}
          disabled={flagAccept}
          renderItem={historyStatusData}
          showsHorizontalScrollIndicator={false}
          onContentSizeChange={(contentWidth, contentHeight)=> {
            if (selectedIndex == historyStatus.length - 1) {
              flatList.current.scrollToEnd({animated: true})
            } 
            if (selectedIndex == 0) {
              flatList.current.scrollToIndex({animated: true, index: 0})
            }
          }}
        />
      </View>
      {selectedIndex === 0 ?
        pendingData != undefined && pendingData.length != 0 ? <FlatList
          style={{marginBottom: 16}}
          keyExtractor={(item, index) => item.id}
          data={pendingData}
          renderItem={renderPendingHistoryData}
          showsVerticalScrollIndicator={false}
        /> : <EmptyData data={"pending data"} tryAgain={() => {
          loadOrderHistoryData().then(() => {})
        }} />
      : null }
      {selectedIndex === 1 ?
        ongoingData != undefined && ongoingData.length != 0 ? <FlatList
          style={{marginBottom: 16}}
          keyExtractor={(item, index) => item.id}
          data={ongoingData}
          renderItem={renderOngoingdHistroyData}
          showsVerticalScrollIndicator={false}
        /> : <EmptyData data={"ongoing data"} tryAgain={() => {
          loadOrderHistoryData().then(() => {})
        }} />
      : null}
      {selectedIndex === 2 ?
        completedData != undefined && completedData.length != 0 ? <FlatList
          style={{marginBottom: 16}}
          keyExtractor={(item, index) => item.id}
          data={completedData}
          renderItem={renderCompletedHistroyData}
          showsVerticalScrollIndicator={false}
        /> : <EmptyData data={"completed data"} tryAgain={() => {
          loadOrderHistoryData().then(() => {})
        }} />
      : null }
      {selectedIndex === 3 ?
        rejectedData != undefined && rejectedData.length != 0 ? <FlatList
          style={{marginBottom: 16}}
          keyExtractor={(item, index) => item.id}
          data={rejectedData}
          renderItem={renderRejectedHistroyData}
          showsVerticalScrollIndicator={false}
        /> : <EmptyData data={"rejected data"} tryAgain={() => {
          loadOrderHistoryData().then(() => {})
        }} />
      : null }
      {flagAccept && tapOrderData && (
        <BottomSheetView
          userUID={userUID}
          parcelData={tapOrderData}
          onPressClose={() => setFlagAccept(false)} 
          onPressAcceptOrder={() => {
            setTapOrderData(undefined)
            setFlagAccept(false)
            setPopup(true)
          }}
        />
      )}
      {popup && (
        <Modal isVisible={popup}>
          <View style={{flex: 1}}>
            <View style={styles.centeredView}>
              <View style={styles.popupView}>
                <Image
                  style={styles.clickImage}
                  source={require('../../../assets/assets/PlaceOrder/checkout_click.png')}
                />
                <Text style={{...styles.totalAmountText, textAlign: 'center'}}>
                  Order has been successfully accepted.
                </Text>
                <TouchableOpacity
                  style={styles.homeButtonView}
                  onPress={() => {
                    console.log(`OKAY.popupView`)
                    setPopup(false)
                    // props.navigation.setParams({ isRefresh: true })
                    refreshData()
                  }}>
                  <Text style={styles.placeOrderText}>OKAY</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

ParcelHistoryScreen.navigationOptions = (navigationData) => {
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
    // borderColor: Colors.primaryColor,
    // borderWidth: 0.5,
    backgroundColor: Colors.acceptedViewColor,
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
  completedHistoryMainView: {
    margin: 16,
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clickImage: {
    marginTop: 16,
    height: 50,
    width: 50,
  },
  totalAmountText: {
    margin: 16,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
  },
  homeButtonView: {
    margin: 16,
    fontSize: RFPercentage(2),
    backgroundColor: Colors.buttonColor,
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  popupView: {
    backgroundColor: Colors.backgroundColor,
    // height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth - 64,
    borderRadius: 10,
  },
  placeOrderText: {
    color: Colors.backgroundColor,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    // color: Colors.backgroundColor,
  },
});

export default ParcelHistoryScreen;
