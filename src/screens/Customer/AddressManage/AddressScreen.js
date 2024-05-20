import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

// Import the Plugins and Thirdparty library.
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RFPercentage} from 'react-native-responsive-fontsize';
import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import {VehicleData} from '../../../helper/extensions/dummyData';
import * as addressDataActions from '../../../store/actions/addAddress/addressData';
import * as addAddressActions from '../../../store/actions/addAddress/addAddress';
import * as dropAddAddressActions from '../../../store/actions/addAddress/dropAddAddress';
import AppPreference from '../../../helper/preference/AppPreference';

// Load the main class.

const AddressScreen = (props) => {
  const statusAddAddress = props.navigation.getParam('statusAddAddress');
  console.log('statusAddAddress', statusAddAddress);
  const addressData = useSelector(
    (state) => state.allAddressData.allAddressData,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    // firebase
    //   .firestore()
    //   .collection('users')
    //   .doc('uid')
    //   .collection('address_details')
    //   .get()
    //   .then((collections) => {
    //     collections.forEach((collection) => {
    //       // alert(JSON.stringify(collection)); //collection.id is can be read here
    //       console.log('Data is : ', collection);
    //       setAddressData(collection.data());
    //     });
    //   });
    AsyncStorage.getItem(AppPreference.LOGIN_UID).then((valueUID) => {
      try {
        dispatch(addressDataActions.fetchAddressList(valueUID));
      } catch (err) {}
    });
  }, [dispatch]);

  const onPressAddress = (selectedData) => {
    if (statusAddAddress === 'pickup') {
      dispatch(
        addAddressActions.setPickupAddressData(
          selectedData.first_name,
          selectedData.last_name,
          selectedData.email,
          selectedData.phone_number,
          selectedData.flat_name,
          selectedData.area,
          selectedData.city,
          selectedData.state,
          selectedData.country,
          selectedData.pincode,
          statusAddAddress,
          'no',
        ),
      );
      props.navigation.pop();
    } else {
      dispatch(
        dropAddAddressActions.setDropAddressData(
          selectedData.first_name,
          selectedData.last_name,
          selectedData.email,
          selectedData.phone_number,
          selectedData.flat_name,
          selectedData.area,
          selectedData.city,
          selectedData.state,
          selectedData.country,
          selectedData.pincode,
          statusAddAddress,
          'no',
        ),
      );
      props.navigation.pop();
    }
  };

  const ListEmpty = () => {
    return (
      //View to show when list is empty
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Address not availbale</Text>
      </View>
    );
  };

  const renderAddressData = (itemData) => {
    return (
      <TouchableOpacity
        style={{margin: 16, marginBottom: -16}}
        onPress={() => {
          onPressAddress(itemData.item);
        }}>
        <View style={styles.locationView}>
          <Text style={{...styles.titleText, fontSize: RFPercentage(2.2)}}>
            {itemData.item.first_name + ' ' + itemData.item.last_name}
          </Text>
          <TouchableOpacity>
            <Text style={styles.subTitleText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.locationText}>
          {itemData.item.flat_name +
            ', ' +
            itemData.item.area +
            ', ' +
            itemData.item.city +
            ', ' +
            itemData.item.state +
            ' - ' +
            itemData.item.pincode +
            '. ' +
            itemData.item.country}
        </Text>
        <Text style={styles.locationText}>{itemData.item.phone_number}</Text>
        <View style={styles.seperateLine} />
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={(item, index) => item.id}
        data={addressData}
        renderItem={renderAddressData}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={addressData.length === 0 && ListEmpty}
      />
      <TouchableOpacity
        style={styles.buttonBookNow}
        onPress={() => {
          props.navigation.navigate({
            routeName: 'AddAddressScreen',
            params: {
              statusAddAddress: statusAddAddress,
            },
          });
        }}>
        <Text style={styles.bookNowText}>ADD NEW ADDRESS</Text>
      </TouchableOpacity>
    </View>
  );
};

AddressScreen.navigationOptions = (navigationData) => {
  return {
    headerShown: true,
    headerTitle: 'Set Address',
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
            style={styles.backImage}
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
    flexGrow: 1,
    backgroundColor: Colors.backgroundColor,
    justifyContent: 'space-between',
  },
  viewHeaderLeft: {
    paddingLeft: 16,
  },
  backImage: {
    height: 40,
    width: 40,
  },
  locationView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    color: Colors.textColor,
  },
  subTitleText: {
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    color: Colors.textColor,
  },
  locationText: {
    marginTop: 4,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.8),
    color: Colors.otherTextColor,
  },
  seperateLine: {
    margin: 16,
    marginLeft: -16,
    marginRight: -16,
    backgroundColor: Colors.subViewBGColor,
    height: 1,
  },
  buttonBookNow: {
    margin: 16,
    marginLeft: 64,
    marginRight: 64,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Medium',
    backgroundColor: Colors.buttonColor,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  bookNowText: {
    fontFamily: 'SofiaPro-Medium',
    color: Colors.backgroundColor,
    fontSize: RFPercentage(2),
  },
});

export default AddressScreen;
