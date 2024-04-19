import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  ScrollView,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useSelector, useDispatch } from 'react-redux';
import firestore from '@react-native-firebase/firestore';

// Import the Plugins and Thirdparty library.
import Modal from 'react-native-modal';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import { OrderDetailsOptions } from '../../../helper/extensions/dummyData';
import ParcelOptionsData from '../../../components/Customer/AddParcelDetails/ParcelOptionsData';
import Loader from '../../../components/design/Loader';
const windowWidth = Dimensions.get('window').width;

const OrderDetailsScreen = (props) => {
  const orderID = props.navigation.getParam('orderID');
  const orderData = props.navigation.getParam('selectedOrderData');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const pickupAddressData = useSelector(
    (state) => state.pickupAddressData.pickupAddressData,
  );
  const dropAddressData = useSelector(
    (state) => state.dropAddressData.dropAddressData,
  );

  const [selectedOrderData, setSelectedOrderData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (orderID) {
      console.log('order id from detials screen', orderData)
      try {
        setIsLoading(true)
        firestore()
          .collection('order_details')
          .doc(orderID)
          .onSnapshot((querySnapshot) => {
            let tSelectedOrderData = { id: orderID, data: querySnapshot.data() }
            console.log(`order data: ${JSON.stringify(tSelectedOrderData)}`);
            setSelectedOrderData(tSelectedOrderData)
            setIsLoading(false)
          });
      } catch (err) {
        console.log(`error:`,err)
        setIsLoading(false)
      }
    }
  }, [orderID]);

  useEffect(() => {
    console.log(`orderData:`, orderData)
    if (orderData) {
      setSelectedOrderData(orderData)
    }
  }, [orderData])

  const renderDetailsOption = (itemData) => {
    return (
      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => setSelectedIndex(itemData.item.id)}>
        <Text
          style={
            selectedIndex === itemData.item.id
              ? styles.titleText
              : styles.subTitleText
          }>
          {itemData.item.title}
        </Text>
        <View
          style={
            selectedIndex === itemData.item.id
              ? styles.activeDotView
              : styles.unActiveDotView
          }
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          horizontal
          keyExtractor={(item, index) => item.id}
          data={OrderDetailsOptions}
          renderItem={renderDetailsOption}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <ScrollView style={{ margin: 16, marginTop: 0 }}>
        {selectedIndex === 0 && selectedOrderData && (
          <View>
            <ParcelOptionsData
              optionTitle="Tracking Id"
              optionTitleValue={selectedOrderData.data.order_id}
            />
            <ParcelOptionsData
              optionTitle="Items"
              optionTitleValue={selectedOrderData.data.pickup_location.sending}
            />
            <ParcelOptionsData
              optionTitle="Parcel Value"
              optionTitleValue={selectedOrderData.data.pickup_location.parcel_value}
            />
            <ParcelOptionsData
              optionTitle="Parcel Weight"
              optionTitleValue={selectedOrderData.data.pickup_location.weight + ' Tons'}
            />
            <ParcelOptionsData
              optionTitle="Parcel LWH"
              optionTitleValue={
                selectedOrderData.data.pickup_location.dimensions +
                ' feet * ' +
                selectedOrderData.data.pickup_location.width +
                ' feet *' +
                selectedOrderData.data.pickup_location.height +
                ' feet '
              }
              cm
            />
            <ParcelOptionsData
              optionTitle="Vehicle"
              optionTitleValue={
                selectedOrderData.data.vehicle_type
              }
            />
            {(selectedOrderData.data.status != 'pending' && selectedOrderData.data.status != 'rejected') && selectedOrderData.data.vehicle_details?.vehicle_number &&
              <ParcelOptionsData
                optionTitle="Vehicle Number"
                optionTitleValue={selectedOrderData.data.vehicle_details.vehicle_number}
              />}
            <ParcelOptionsData
              optionTitle="Pickup Date and Time"
              optionTitleValue={
                selectedOrderData.data.pickup_location.pickup_date_time
              }
            />
            <ParcelOptionsData
              optionTitle="Comment"
              optionTitleValue={selectedOrderData.data.pickup_location.comment}
            />
            {(selectedOrderData.data.status != 'pending' && selectedOrderData.data.status != 'rejected') ?
              <View>
                {selectedOrderData.data.driver_details?.user_uid == selectedOrderData.data.transporter_uid ?
                  <View>
                    <ParcelOptionsData
                      optionTitle="Transporter/Driver Name"
                      optionTitleValue={selectedOrderData.data.transporter_details.first_name + ' ' + selectedOrderData.data.transporter_details.last_name}
                    />
                    <ParcelOptionsData
                      optionTitle="Transporter/Driver Contact Number"
                      openDialer={true}
                      optionTitleValue={selectedOrderData.data.transporter_details.phone_number}
                    />
                  </View>
                  :
                  <View>
                    <ParcelOptionsData
                      optionTitle="Transporter Name"
                      optionTitleValue={selectedOrderData.data.transporter_details.first_name + ' ' + selectedOrderData.data.transporter_details.last_name}
                    />
                    <ParcelOptionsData
                      optionTitle="Transporter Contact Number"
                      openDialer={true}
                      optionTitleValue={selectedOrderData.data.transporter_details.phone_number}
                    />
                    {(selectedOrderData.data.status != 'pending' && selectedOrderData.data.status != 'rejected') && selectedOrderData.data.driver_details?.first_name &&
                      <ParcelOptionsData
                        optionTitle="Driver Name"
                        optionTitleValue={selectedOrderData.data.driver_details.first_name + ' ' + selectedOrderData.data.driver_details.last_name}
                      />}
                    {(selectedOrderData.data.status != 'pending' && selectedOrderData.data.status != 'rejected') && selectedOrderData.data.driver_details?.phone_number &&
                      <ParcelOptionsData
                        optionTitle="Driver Contact Number"
                        openDialer={true}
                        optionTitleValue={selectedOrderData.data.driver_details.phone_number}
                      />}
                  </View>
                }
              </View>
              :
              <View>
                {selectedOrderData.data.transporter_details.first_name &&
                <ParcelOptionsData
                  optionTitle="Transporter Name"
                  optionTitleValue={selectedOrderData.data.transporter_details.first_name + ' ' + selectedOrderData.data.transporter_details.last_name}
                />}
                {selectedOrderData.data.transporter_details.phone_number &&
                <ParcelOptionsData
                  optionTitle="Transporter Contact Number"
                  openDialer={true}
                  optionTitleValue={selectedOrderData.data.transporter_details.phone_number}
                />}
              </View>
            }
          </View>
        )}
        {selectedIndex === 1 && selectedOrderData && (
          <View>
            <View>
              <Text style={styles.locationTitleText}>Pickup Point</Text>
              <View style={{ marginTop: 8 }}>
                <View style={styles.locationView}>
                  <Text
                    style={{ ...styles.titleText, fontSize: RFPercentage(2.2) }}>
                    {selectedOrderData.data.pickup_location.first_name +
                      ' ' +
                      selectedOrderData.data.pickup_location.last_name}
                  </Text>
                </View>
                <Text style={styles.locationText}>
                  {selectedOrderData.data.pickup_location.flat_name +
                    ', ' +
                    selectedOrderData.data.pickup_location.area +
                    ', ' +
                    selectedOrderData.data.pickup_location.city +
                    ', ' +
                    selectedOrderData.data.pickup_location.state +
                    ' - ' +
                    selectedOrderData.data.pickup_location.pincode +
                    '. ' +
                    selectedOrderData.data.pickup_location.country}
                </Text>
                <Text style={styles.locationText}>
                  {selectedOrderData.data.pickup_location.phone_number}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 16 }}>
              <Text style={styles.locationTitleText}>Drop Point</Text>
              <View style={{ marginTop: 8 }}>
                <View style={styles.locationView}>
                  <Text
                    style={{ ...styles.titleText, fontSize: RFPercentage(2.2) }}>
                    {selectedOrderData.data.drop_location.first_name +
                      ' ' +
                      selectedOrderData.data.drop_location.last_name}
                  </Text>
                </View>
                <Text style={styles.locationText}>
                  {selectedOrderData.data.drop_location.flat_name +
                    ', ' +
                    selectedOrderData.data.drop_location.area +
                    ', ' +
                    selectedOrderData.data.drop_location.city +
                    ', ' +
                    selectedOrderData.data.drop_location.state +
                    ' - ' +
                    selectedOrderData.data.drop_location.pincode +
                    '. ' +
                    selectedOrderData.data.drop_location.country}
                </Text>
                <Text style={styles.locationText}>
                  {selectedOrderData.data.drop_location.phone_number}
                </Text>
              </View>
            </View>
            {selectedOrderData.data.distance != undefined &&
              <View style={{ marginTop: 16 }}>
                <Text style={styles.locationTitleText}>Total Distance</Text>
                <Text
                  style={{ ...styles.titleText, fontSize: RFPercentage(2.2) }}>{selectedOrderData.data.distance} KM</Text>
              </View>}
          </View>
        )}
        {selectedIndex === 2 && selectedOrderData && (
          <View>
            <ParcelOptionsData
              optionTitle="Payment method"
              optionTitleValue={selectedOrderData.data.payment_mode}
            />
            <ParcelOptionsData
              optionTitle="Total paid amount"
              optionTitleValue={'₹' + selectedOrderData.data.price}
            />
          </View>
        )}
      </ScrollView>
      <Loader loading={isLoading} />
    </View>
  );
};

OrderDetailsScreen.navigationOptions = (navigationData) => {
  return {
    headerShown: true,
    headerTitle: 'Order Details',
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
    headerLeft: (
      <View style={styles.viewHeaderLeft}>
        <TouchableOpacity
          onPress={() => {
            navigationData.navigation.pop();
          }}>
          <Image
            style={styles.menuImage}
            source={require('../../../assets/assets/Authentication/back.png')}
          />
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
  optionRow: {
    margin: 16,
    // height: 40,
    // marginRight: 0,
    // backgroundColor: Colors.backgroundColor,
  },
  titleText: {
    color: Colors.titleTextColor,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-SemiBold',
  },
  subTitleText: {
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    color: Colors.subTitleTextColor,
  },
  activeDotView: {
    marginTop: 8,
    height: 3,
    width: 25,
    backgroundColor: Colors.primaryColor,
    borderRadius: 5,
  },
  unActiveDotView: {
    marginTop: 8,
    height: 3,
    width: 25,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 5,
  },
  locationTitleText: {
    color: Colors.primaryColor,
    fontSize: RFPercentage(2.2),
    fontFamily: 'SofiaPro-SemiBold',
  },
  locationView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationText: {
    marginTop: 4,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.8),
    color: Colors.otherTextColor,
  },
});

export default OrderDetailsScreen;
