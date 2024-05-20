import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  AsyncStorage,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';

// Import the Plugins and Thirdparty library.
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import auth, {firebase} from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import Geolocation from '@react-native-community/geolocation';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import Button from '../../../components/design/Button';
import TextInput from '../../../components/design/TextInput';
import {
  nameValidator,
  emailValidator,
  phoneValidator,
  lastNameValidator,
} from '../../../helper/extensions/Validator';
import Loader from '../../../components/design/Loader';
import AppConstants from '../../../helper/constants/AppConstants';

// Load the main class.

const AddAddressScreen = (props) => {
  const statusAddAddress = props.navigation.getParam('statusAddAddress');
  console.log('statusAddAddress', statusAddAddress);
  const [name, setName] = useState({value: '', error: ''});
  const [lastName, setLastName] = useState({value: '', error: ''});
  const [email, setEmail] = useState({value: '', error: ''});
  const [phone, setPhone] = useState({value: '', error: ''});
  const [isLoading, setIsLoading] = useState(false);

  const onPressRegister = () => {
    const nameError = nameValidator(name.value);
    const lastNameError = lastNameValidator(lastName.value);
    const emailError = emailValidator(email.value);
    const phoneError = phoneValidator(phone.value);

    if (nameError) {
      setName({...name, error: nameError});
      return;
    } else if (lastNameError) {
      setLastName({...lastName, error: lastNameError});
      return;
    } else if (emailError) {
      setEmail({...email, error: emailError});
      return;
    } else if (phoneError) {
      setPhone({...phone, error: phoneError});
      return;
    } else {
      props.navigation.navigate({
        routeName: 'AddSetAddressScreen',
        params: {
          firstName: name.value,
          lastName: lastName.value,
          email: email.value,
          phone: phone.value,
          statusAddAddress: statusAddAddress,
        },
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={30}>
        <Loader loading={isLoading} />
        <View style={styles.lineView}>
          <View style={styles.activeDotView}>
            <Text style={styles.activeNumberText}>1</Text>
          </View>
          <View style={styles.activeLineView} />
          <View style={styles.inActiveLineView} />
          <View style={styles.inActiveDotView}>
            <Text style={styles.inActiveNumberText}>2</Text>
          </View>
        </View>
        <View style={styles.lineViewText}>
          <Text style={styles.registerText}>General details</Text>
          <Text style={styles.haveAnAccountText}>Address</Text>
        </View>
        <View style={{padding: 16}}>
          <TextInput
            //   style={styles.nameInputText}
            label="First Name"
            returnKeyType="next"
            value={name.value}
            onChangeText={(text) => setName({value: text, error: ''})}
            error={!!name.error}
            errorText={name.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            ref={(ref) => {
              this._nameinput = ref;
            }}
            onSubmitEditing={() => this._lastinput && this._lastinput.focus()}
          />
          <TextInput
            //   style={styles.nameInputText}
            label="Last Name"
            returnKeyType="next"
            value={lastName.value}
            onChangeText={(text) => setLastName({value: text, error: ''})}
            error={!!lastName.error}
            errorText={lastName.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            ref={(ref) => {
              this._lastinput = ref;
            }}
            onSubmitEditing={() => this._emailinput && this._emailinput.focus()}
          />
          <TextInput
            //   style={styles.emailInputText}
            label="Email"
            returnKeyType="next"
            value={email.value}
            onChangeText={(text) => setEmail({value: text, error: ''})}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            ref={(ref) => {
              this._emailinput = ref;
            }}
            onSubmitEditing={() => this._phoneinput && this._phoneinput.focus()}
          />
          <TextInput
            //   style={styles.phoneInputText}
            label="Phone"
            returnKeyType="next"
            value={phone.value}
            onChangeText={(text) => setPhone({value: text, error: ''})}
            error={!!phone.error}
            errorText={phone.error}
            autoCapitalize="none"
            autoCompleteType="tel"
            textContentType="telephoneNumber"
            maxLength={10}
            keyboardType="phone-pad"
            ref={(ref) => {
              this._phoneinput = ref;
            }}
            onSubmitEditing={() =>
              this._addressinput && this._addressinput.focus()
            }
          />
        </View>
        <TouchableOpacity style={styles.nextView} onPress={onPressRegister}>
          <Image
            style={styles.nextImage}
            source={require('../../../assets/assets/SliderScreen/next.png')}
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

AddAddressScreen.navigationOptions = (navigationData) => {
  return {
    headerShown: true,
    headerTitle: 'Add Address',
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
      backgroundColor: Colors.mainBackgroundColor,
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
    backgroundColor: Colors.mainBackgroundColor,
  },
  headerContainer: {
    height: 200,
    backgroundColor: Colors.headerBGColor,
    // justifyContent: 'flex-end',
  },
  backImage: {
    marginLeft: 16,
    height: 40,
    width: 40,
  },
  cellHeaderFooler: {
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tilteText: {
    margin: 16,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(4),
    // fontWeight: '500',
    color: Colors.textColor,
  },
  subTitleText: {
    marginTop: 8,
    // fontFamily: 'Roboto-Regular',
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
  },
  headerImage: {
    height: 120,
    width: 70,
  },
  nameInputText: {
    margin: 32,
    backgroundColor: Colors.surfaceColor,
  },
  emailInputText: {
    margin: 32,
    marginTop: -16,
    backgroundColor: Colors.surfaceColor,
  },
  phoneInputText: {
    margin: 32,
    marginTop: -16,
    backgroundColor: Colors.surfaceColor,
  },
  passwordInputText: {
    margin: 32,
    marginTop: -16,
    backgroundColor: Colors.surfaceColor,
  },
  buttonLogin: {
    margin: 64,
    marginTop: 32,
    marginBottom: 0,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Medium',
    backgroundColor: Colors.buttonColor,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  loginText: {
    fontFamily: 'SofiaPro-Medium',
    color: Colors.backgroundColor,
    fontSize: RFPercentage(2),
  },
  registerButton: {
    marginTop: -32,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    // justifyContent: 'space-around',
  },
  registerText: {
    marginLeft: 4,
    fontFamily: 'SofiaPro-Medium',
    fontSize: RFPercentage(1.7),
    color: Colors.primaryColor,
  },
  haveAnAccountText: {
    fontFamily: 'SofiaPro-Medium',
    fontSize: RFPercentage(1.7),
    color: Colors.subTitleTextColor,
  },
  socialButtonView: {
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialImage: {
    height: 60,
    width: 60,
  },
  // loginText: {
  //   color: Colors.backgroundColor,
  //   fontSize: RFPercentage(2.5),
  // },
  lineView: {
    margin: 16,
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDotView: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeNumberText: {
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.7),
    color: Colors.backgroundColor,
  },
  activeLineView: {
    marginLeft: -1,
    width: 80,
    height: 5,
    backgroundColor: Colors.primaryColor,
  },
  inActiveDotView: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.inActiveLineColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inActiveNumberText: {
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.7),
    color: Colors.backgroundColor,
  },
  inActiveLineView: {
    marginLeft: -1,
    width: 80,
    height: 5,
    backgroundColor: Colors.inActiveLineColor,
  },
  lineViewText: {
    marginLeft: 55,
    marginRight: 85,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nextView: {
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: Colors.backgroundColor,
  },
  nextImage: {
    height: 150,
    width: 150,
    resizeMode: 'contain',
  },
});

export default AddAddressScreen;
