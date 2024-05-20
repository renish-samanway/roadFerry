import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

// Import the Plugins and Thirdparty library.
import Modal from 'react-native-modal';
import auth, {firebase} from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
// import SelectPayButton from '../../../components/Customer/PlaceOrder/SelectPayButton';
import AppPreference from '../../../helper/preference/AppPreference';

// Load the main class.
const windowWidth = Dimensions.get('window').width;

const CheckoutScreen = (props) => {
  const pickupLocationData = props.navigation.getParam('pickupLocationData');
  const dropLocationData = props.navigation.getParam('dropLocationData');
  const transporterSelectedData = props.navigation.getParam(
    'transporterSelectedData',
  );
  console.log('pickupLocationData', pickupLocationData);
  console.log('dropLocationData', dropLocationData);
  const [selectionCOD, setSelectionCOD] = useState(false);
  const [selectionRazorpay, setSelectionRazorpay] = useState(false);
  const [popup, setPopup] = useState(false);

  const onPressSelectPayment = (value) => {
    if (value === 'cod') {
      setSelectionCOD(true);
      setSelectionRazorpay(false);
    } else {
      setSelectionCOD(false);
      setSelectionRazorpay(true);
    }
  };

  const onPressCheckout = () => {
    const min = 1;
    const max = 10000;
    const random_no = min + Math.random() * (max - min);
    AsyncStorage.getItem(AppPreference.LOGIN_UID).then((valueUID) => {
      console.log('UID IS : ', valueUID);
      firebase.firestore().collection('order_details').doc().set({
        requested_uid: valueUID,
        transporter_uid: transporterSelectedData.id,
        payment_mode: 'COD',
        order_id: random_no,
        status: 'pending',
        pickup_location: pickupLocationData,
        drop_location: dropLocationData,
        transporter_details: transporterSelectedData.data,
        price: 23000,
        created_at: new Date()
      });
      setPopup(true);
    });
    // firebase
    //   .firestore()
    //   .collection('users')
    //   .doc('uid')
    //   .collection('order_details')
    //   .doc()
    //   .set({
    //     order_id: random_no,
    //     status: 'pending',
    //     pickup_location: pickupLocationData,
    //     drop_location: dropLocationData,
    //   });
  };
  return (
    <View style={styles.container}>
      <View style={{flexGrow: 1}}>
        <Text style={styles.totalAmountText}>Payment Method</Text>
        {/* <View style={styles.amountView}>
          <Text style={styles.totalAmountText}>Total Amount</Text>
          <Text style={styles.totalAmountSubText}>₹ 3200.00</Text>
        </View> */}
        <View style={{margin: 16, marginTop: 0}}>
          <TouchableOpacity
            style={selectionCOD ? styles.selectedOptionView : styles.optionView}
            onPress={() => {
              onPressSelectPayment('cod');
            }}>
            <View style={styles.row}>
              <Image
                style={styles.paymentImage}
                source={require('../../../assets/assets/PlaceOrder/ic_cod.png')}
              />
              <Text style={styles.titleText}>Cash on Delivery</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              selectionRazorpay ? styles.selectedOptionView : styles.optionView
            }
            onPress={() => {
              onPressSelectPayment('razor');
            }}>
            <View style={styles.row}>
              <Image
                style={styles.paymentImage}
                source={require('../../../assets/assets/PlaceOrder/razorpay.png')}
              />
              <Text style={styles.titleText}>Razorpay</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.seperateLine} />
      <View style={styles.amountView}>
        <Text style={styles.totalAmountText}>Total Estimated Price</Text>
        <Text style={styles.totalAmountSubText}>₹ 2000.00</Text>
      </View>
      <TouchableOpacity
        style={styles.buttonPlaceOrder}
        onPress={() => onPressCheckout()}>
        <Text style={styles.placeOrderText}>CHECKOUT</Text>
      </TouchableOpacity>
      <Modal isVisible={popup}>
        <View style={{flex: 1}}>
          <View style={styles.centeredView}>
            <View style={styles.popupView}>
              <Image
                style={styles.clickImage}
                source={require('../../../assets/assets/PlaceOrder/checkout_click.png')}
              />
              <Text style={{...styles.totalAmountText, textAlign: 'center'}}>
                Your order has been successfully placed. Thank you for choosing
                us
              </Text>
              <TouchableOpacity
                style={styles.homeButtonView}
                onPress={() =>
                  props.navigation.navigate({
                    routeName: 'DashboardTraking',
                  })
                }>
                <Text style={styles.placeOrderText}>HOME</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

CheckoutScreen.navigationOptions = (navigationData) => {
  return {
    headerShown: true,
    headerTitle: 'Checkout',
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
  amountView: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalAmountText: {
    margin: 16,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
  },
  totalAmountSubText: {
    margin: 16,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
  },
  buttonPlaceOrder: {
    margin: 64,
    fontSize: RFPercentage(2),
    backgroundColor: Colors.buttonColor,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  placeOrderText: {
    color: Colors.backgroundColor,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    // color: Colors.backgroundColor,
  },
  seperateLine: {
    backgroundColor: Colors.subViewBGColor,
    height: 1,
  },
  optionView: {
    // flex: 1,
    margin: 16,
    marginBottom: 8,
    borderColor: Colors.subTitleTextColor,
    borderWidth: 0.5,
    borderRadius: 10,
    height: 50,
  },
  selectedOptionView: {
    // flex: 1,
    margin: 16,
    marginBottom: 8,
    borderColor: Colors.primaryColor,
    borderWidth: 0.5,
    borderRadius: 10,
    height: 50,
  },
  row: {
    flex: 1,
    marginLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  titleText: {
    marginLeft: 16,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-SemiBold',
    color: Colors.textColor,
  },
  paymentImage: {
    height: 35,
    width: 35,
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
});

export default CheckoutScreen;
