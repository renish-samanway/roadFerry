import React, {useState, useEffect, useCallback} from 'react';
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
import {RFPercentage} from 'react-native-responsive-fontsize';
import {useSelector, useDispatch} from 'react-redux';

// Import the Plugins and Thirdparty library.
import Modal from 'react-native-modal';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import {OrderDetailsOptions} from '../../../helper/extensions/dummyData';
import ParcelOptionsData from '../../../components/Customer/AddParcelDetails/ParcelOptionsData';

// Load the main class.
const windowWidth = Dimensions.get('window').width;

const OrderDetailsScreen = (props) => {
  const selectedOrderData = props.navigation.getParam('selectedOrderData');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const pickupAddressData = useSelector(
    (state) => state.pickupAddressData.pickupAddressData,
  );
  const dropAddressData = useSelector(
    (state) => state.dropAddressData.dropAddressData,
  );
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
      <ScrollView style={{margin: 16, marginTop: 0}}>
        {selectedIndex === 0 && (
          <View>
            <ParcelOptionsData
              optionTitle="Tracking Id"
              optionTitleValue={selectedOrderData.order_id}
            />
            <ParcelOptionsData
              optionTitle="Items"
              optionTitleValue={selectedOrderData.pickup_location.sending}
            />
            <ParcelOptionsData
              optionTitle="Parcel Value"
              optionTitleValue={selectedOrderData.pickup_location.parcel_value}
            />
            <ParcelOptionsData
              optionTitle="Parcel Weight"
              optionTitleValue={selectedOrderData.pickup_location.weight + ' Tons'}
            />
            <ParcelOptionsData
              optionTitle="Parcel LWH"
              optionTitleValue={
                selectedOrderData.pickup_location.dimensions +
                ' feet * ' +
                selectedOrderData.pickup_location.width +
                ' feet * ' +
                selectedOrderData.pickup_location.height +
                ' feet '
              }
              cm
            />
            <ParcelOptionsData
              optionTitle="Vehicle"
              optionTitleValue={
                selectedOrderData.vehicle_type
              }
            />
            <ParcelOptionsData
              optionTitle="Pickup Date and Time"
              optionTitleValue={
                selectedOrderData.pickup_location.pickup_date_time
              }
            />
            <ParcelOptionsData
              optionTitle="Comment"
              optionTitleValue={selectedOrderData.pickup_location.comment}
            />
            
            {selectedOrderData.data.driver_details?.user_uid != selectedOrderData.data.transporter_uid ?
              <View>
            <ParcelOptionsData
              optionTitle="Transporter/Driver Name"
              optionTitleValue={selectedOrderData.data.transporter_details.first_name + ' ' +selectedOrderData.data.transporter_details.last_name } 
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
              optionTitleValue={selectedOrderData.data.transporter_details.first_name +' '+ selectedOrderData.data.transporter_details.last_name}
            />
            <ParcelOptionsData
              optionTitle="Transporter Contact Number"
              openDialer={true}
              optionTitleValue={selectedOrderData.data.transporter_details.phone_number}
            />
            {selectedOrderData.data.driver_details?.first_name && 
            <ParcelOptionsData
              optionTitle="Driver Name"
              optionTitleValue={selectedOrderData.data.driver_details.first_name + ' ' + selectedOrderData.data.driver_details.last_name}
            />}
            {selectedOrderData.data.driver_details?.phone_number && 
            <ParcelOptionsData
              optionTitle="Driver Contact Number"
              openDialer={true}
              optionTitleValue={selectedOrderData.data.driver_details.phone_number}
            />}
            </View>
             }
             {selectedOrderData.data.vehicle_details?.vehicle_number && 
             <ParcelOptionsData
              optionTitle="Vehicle Number"
              optionTitleValue={selectedOrderData.data.vehicle_details.vehicle_number}
            />}
          </View>
        )}
        {selectedIndex === 1 && (
          <View>
            <View>
              <Text style={styles.locationTitleText}>Pickup Point</Text>
              <View style={{marginTop: 8}}>
                <View style={styles.locationView}>
                  <Text
                    style={{...styles.titleText, fontSize: RFPercentage(2.2)}}>
                    {selectedOrderData.pickup_location.first_name +
                      ' ' +
                      selectedOrderData.pickup_location.last_name}
                  </Text>
                </View>
                <Text style={styles.locationText}>
                  {selectedOrderData.pickup_location.flat_name +
                    ', ' +
                    selectedOrderData.pickup_location.area +
                    ', ' +
                    selectedOrderData.pickup_location.city +
                    ', ' +
                    selectedOrderData.pickup_location.state +
                    ' - ' +
                    selectedOrderData.pickup_location.pincode +
                    '. ' +
                    selectedOrderData.pickup_location.country}
                </Text>
                <Text style={styles.locationText}>
                  {selectedOrderData.pickup_location.phone_number}
                </Text>
              </View>
            </View>
            <View style={{marginTop: 16}}>
              <Text style={styles.locationTitleText}>Drop Point</Text>
              <View style={{marginTop: 8}}>
                <View style={styles.locationView}>
                  <Text
                    style={{...styles.titleText, fontSize: RFPercentage(2.2)}}>
                    {selectedOrderData.drop_location.first_name +
                      ' ' +
                      selectedOrderData.drop_location.last_name}
                  </Text>
                </View>
                <Text style={styles.locationText}>
                  {selectedOrderData.drop_location.flat_name +
                    ', ' +
                    selectedOrderData.drop_location.area +
                    ', ' +
                    selectedOrderData.drop_location.city +
                    ', ' +
                    selectedOrderData.drop_location.state +
                    ' - ' +
                    selectedOrderData.drop_location.pincode +
                    '. ' +
                    selectedOrderData.drop_location.country}
                </Text>
                <Text style={styles.locationText}>
                  {selectedOrderData.drop_location.phone_number}
                </Text>
              </View>
            </View>
          </View>
        )}
        {selectedIndex === 2 && (
          <View>
            <ParcelOptionsData
              optionTitle="Payment method"
              optionTitleValue={selectedOrderData.payment_mode}
            />
            <ParcelOptionsData
              optionTitle="Total paid amount"
              optionTitleValue={'₹' + selectedOrderData.price}
            />
          </View>
        )}
      </ScrollView>
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
