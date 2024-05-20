import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
// import VerificationScreen from '../../authentication/VerificationScreen';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { id } from 'date-fns/locale';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import {
  Alert, Image, Keyboard,
  KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { TextInput as Input } from 'react-native-paper';
// Import the Plugins and Thirdparty library.
import { RFPercentage } from 'react-native-responsive-fontsize';
import StepIndicator from 'react-native-step-indicator';
import { useSelector } from 'react-redux';
import Loader from '../../../components/design/Loader';
import TextInput from '../../../components/design/TextInput';
import UploadImage from '../../../components/transpoter/Drivers/UploadImage';
import AppConstants from '../../../helper/constants/AppConstants';
import { customStyles, seconds } from '../../../helper/Data';
// Import the JS file.
import Colors from '../../../helper/extensions/Colors';
import {
  emailValidator, lastNameValidator, nameValidator, phoneValidator
} from '../../../helper/extensions/Validator';

// Load the main class.

let stepLabels = []
/* const customStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize:30,
  separatorStrokeWidth: 4,
  stepStrokeWidth: 0,
  currentStepStrokeWidth: 0,

  stepIndicatorFinishedColor: Colors.primaryColor,
  stepIndicatorCurrentColor: Colors.primaryColor,
  separatorFinishedColor: Colors.primaryColor,

  separatorUnFinishedColor: Colors.inActiveLineColor,
  stepIndicatorUnFinishedColor: Colors.inActiveLineColor,
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: "#ffffff",
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#ffffff",
  labelSize: 16,
  currentStepLabelColor: '#fe7013'
} */

const AddDriverScreen = (props) => {
  const statusAddAddress = props.navigation.getParam('statusAddAddress');
  // console.log('statusAddAddress', statusAddAddress);
  const scrollRef = useRef();
  const invalid = () => {
    Alert.alert(
      'Alert',
      'User already registered. Please try again with different number.',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: false },
    );
  }

  const profileData = useSelector(
    (state) => state.fetchProfileData.fetchProfileData,
  );

  let userUID = useSelector(
    (state) => state.fetchProfileData.userUID,
  );
  // userUID = "B4Ti8IgLgpsKZECGqOJ0"
  console.log(`AddDriverUploadScreen.userUID: ${userUID}`)

  let isEdit = props.navigation.getParam('isEdit');
  if (isEdit === undefined) {
    isEdit = false
  }
  // props.navigation.setParams({ isEdit: isEdit })

  let driverData = undefined
  // props.navigation.setOptions({ title: 'Add Driver' })
  if (isEdit) {
    driverData = props.navigation.getParam('driverData');
    console.log('edit data profile',driverData)
    // props.navigation.setOptions({ title: 'Edit Driver' })
  }
  stepLabels = ["General\ndetails", "Verification", "Upload\nDocument"];
  let isVerified = driverData != undefined && driverData.data.is_verified == AppConstants.driverStatusVerifiedKey
  if (isVerified) {
    stepLabels = ["General\ndetails", "Upload\nDocument"];
  }
  let nameValue = { value: '', error: '' }
  let lastNameValue = { value: '', error: '' }
  let emailValue = { value: '', error: '' }
  let phoneValue = { value: '', error: '' }
  let ageValue = { value: '', error: '' }

  if (driverData != undefined) {
    console.log(`driverData.id: ${driverData.id}`)
    let isVerified = driverData.data.is_verified == AppConstants.driverStatusVerifiedKey
    nameValue = { value: driverData.data.first_name, error: isVerified ? `You can not change first name, because this driver are ${AppConstants.driverStatusVerifiedKey}` : '' }
    lastNameValue = { value: driverData.data.last_name, error: isVerified ? `You can not change last name, because this driver are ${AppConstants.driverStatusVerifiedKey}` : '' }
    // emailValue = {value: driverData.data.email, error: isVerified ? `You can not change email, because this driver are ${AppConstants.driverStatusVerifiedKey}` : ''}
    emailValue = { value: driverData.data.email, error: '' }
    phoneValue = { value: driverData.data.phone_number, error: isVerified ? `You can not change phone, because this driver are ${AppConstants.driverStatusVerifiedKey}` : '' }
    ageValue = { value: driverData.data.age, error: isVerified ? `You can not change age, because this driver are ${AppConstants.driverStatusVerifiedKey}` : '' }
  }

  const [name, setName] = useState(nameValue);
  const [lastName, setLastName] = useState(lastNameValue);
  const [email, setEmail] = useState(emailValue);
  const [phone, setPhone] = useState(phoneValue);
  const [age, setAge] = useState(ageValue);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);

  const [otp, setOtp] = useState({ value: '', error: '' });
  const [isResendNow, setIsResendNow] = useState(false)
  const [timer, setTimer] = useState(0)
  // const [confirm, setConfirm] = useState(null);
  let clockCall = null
  // const [lastNameInputRef, setLastNameInputRef] = React.useState(null);
  const lastNameInputRef = useRef(null);

  const [confirm, setConfirm] = useState(null);
  const [uID, setUID] = useState(null);

  let addressProofValue = { data: '', error: '' }
  let addressProofBackValue = { data: '', error: '' }
  let identityProofValue = { data: '', error: '' }
  let driverPhotoValue = { data: '', error: '' }
  if (driverData != undefined) {
    console.log(`driverData.id: ${driverData.id}`)
    let isVerified = driverData.data.is_verified == AppConstants.driverStatusVerifiedKey
    // addressProofValue = {data: convertData(driverData.data.address_proof), error: isVerified ? `You can not change address proof, because this driver are ${AppConstants.driverStatusVerifiedKey}` : ''}
    // identityProofValue = {data: convertData(driverData.data.identity_proof), error: isVerified ? `You can not change identity proof, because this driver are ${AppConstants.driverStatusVerifiedKey}` : ''}
    // driverPhotoValue = {data: convertData(driverData.data.driver_photo), error: ''}
    addressProofValue = { data: driverData.data.address_proof, error: isVerified ? `You can not change address proof, because this driver is ${AppConstants.driverStatusVerifiedKey}` : '' }
    identityProofValue = { data: driverData.data.identity_proof, error: isVerified ? `You can not change identity proof, because this driver is ${AppConstants.driverStatusVerifiedKey}` : '' }
    driverPhotoValue = { data: driverData.data.driver_photo, error: '' }
    addressProofBackValue = {data:driverData.data.address_proof_back,error:isVerified?`You can not change address proof, because this driver is ${AppConstants.driverStatusVerifiedKey}`:''}
  }
  const [addressProof, setAddressProof] = useState(addressProofValue);
  const [identityProof, setIdentityProof] = useState(identityProofValue);
  const [driverPhoto, setDriverPhoto] = useState(driverPhotoValue);
  const [addressProofBack, setAddressProofBack] = useState(addressProofBackValue)

  async function confirmCode() {
    try {
      setIsLoading(true)
      console.log(`otp.value: ${otp.value}`)
      console.log(`confirm:`, confirm)
      await confirm.confirm(otp.value)
        .then(confirmResult => {
          // console.log(`confirmResult:`, confirmResult)
          console.log(`confirmResult: ${JSON.stringify(confirmResult)}`)
          setUID(confirmResult.user.uid)
          setIsLoading(false);
          setCurrentPosition(currentPosition + 1)
        })
        .catch(error => {
          setIsLoading(false);
          setOtp({ ...otp.value, error: "Invalid Code." })
          console.log(error)
        });;
    } catch (error) {
      setIsLoading(false);
      setOtp({ ...otp.value, error: "Invalid Code." })
      console.log('Invalid code.');
    }
  }

  async function signInWithPhoneNumber(phoneNumber, isResend = false) {
    console.log(`phoneNumber: ${phoneNumber}`)
    setIsLoading(true);
    auth()
      .signInWithPhoneNumber(phoneNumber, isResend)
      .then(confirmResult => {
        // console.log(`confirmResult: ${JSON.stringify(confirmResult)}`)
        setIsLoading(false);
        setConfirm(confirmResult)
        if (!isResend) {
          setCurrentPosition(currentPosition + 1)
        }
      })
      .catch(error => {
        setIsLoading(false);
        alert(error.message)
        console.log(error)
      });
  }


  const onPressRegister = () => {
    Keyboard.dismiss()

    // const refreshData = props.navigation.getParam('refreshData');
    const nameError = nameValidator(name.value);
    const lastNameError = lastNameValidator(lastName.value);
    const emailError = emailValidator(email.value);
    const phoneError = phoneValidator(phone.value);

    if (nameError) {
      setName({ ...name, error: nameError });
      return;
    } else if (lastNameError) {
      setLastName({ ...lastName, error: lastNameError });
      return;
    }/*  else if (emailError) {
      setEmail({...email, error: emailError});
      return;
    } */ /* else  */if (phoneError) {
      setPhone({ ...phone, error: phoneError });
      return;
    } else {
      /* if (age.value != '') {
        confirmCode()
      } else {
        let phoneNumber = `${AppConstants.country_code} ${phone.value}`
        console.log(`phoneNumber: ${phoneNumber}`)
        signInWithPhoneNumber(phoneNumber)
      }
      
      return */

      var password = '';
      if (isEdit) {
        if (driverData != undefined) {
          password = driverData.data.temp_password
        }
      } else {
        password = Math.random().toString(36).slice(-8);
      }
      console.log(`email.value: ${email.value}`)
      console.log(`password: ${password}`)
      setIsLoading(true)
      firestore()
        .collection('users')
        .where('user_type', 'in', ['transporter', 'Transporter', 'driver', 'Driver'])
        .where('phone_number', '==', phone.value)
        .where('is_deleted','==',false)
        .get()
        .then(querySnapshot => {
          console.log('Total users: ', querySnapshot.size);
          setIsLoading(false);
          if (querySnapshot.size != 0) {
            if (isEdit && driverData != undefined && driverData.data.phone_number == phone.value) {
              setCurrentPosition(3)
            } else {
              setTimeout(() => {
                invalid()
              }, 100)
            }
          } else {
            startTimer()
            let isVerified = driverData != undefined && driverData.data.is_verified == AppConstants.driverStatusVerifiedKey
            if (isVerified) {
              setCurrentPosition(currentPosition + 1)
            } else {
              let phoneNumberWithCode = `${AppConstants.country_code} ${phone.value}`
              signInWithPhoneNumber(phoneNumberWithCode, false)
            }
            /* props.navigation.navigate({
              routeName: 'AddDriverUploadScreen',
              params: {
                firstName: name.value,
                lastName: lastName.value,
                email: email.value,
                phone: phone.value,
                age: age.value,
                password: password,
                statusAddAddress: statusAddAddress,
                goBack: () => {
                  props.navigation.pop()
                  refreshData()
                },
                isEdit: isEdit,
                driverData: driverData
              },
            }); */
          }
        }).catch(error => {
          setIsLoading(false)
          console.error(error)
        });
    }
  };

  const onPressVerifyOTP = () => {
    if (otp.value.length < 6) {
      setOtp({ value: otp.value, error: "Please enter valid code." })
      return
    }
    confirmCode()
  }

  const onPressSubmit = async () => {
    const refreshData = props.navigation.getParam('refreshData');

    if (addressProof.data == '') {
      setAddressProof({ ...addressProof, error: 'Please upload Address Proof Front page' });
      return;
    }
    else if(addressProofBack.data ==''){
      setAddressProofBack({...addressProofBack,error:'Please upload Address Proof Back page'})
      return
    }  
    else if (identityProof.data == '') {
      setIdentityProof({
        ...identityProof,
        error: 'Please upload Identity Proof',
      });
      return;
    } else if (driverPhoto.data == '') {
      setDriverPhoto({ ...driverPhoto, error: 'Please upload Driver Photo' });
      return;
    }
    
    else {
      // return
      setIsLoading(true);

      let addressProofURL = ''
      if (typeof (addressProof.data) === 'string') {
        addressProofURL = addressProof.data
      } else {
        // console.log(`addressProof.data:`, addressProof.data)
        let ref = await storage().ref(addressProof.data.fileName)
        await ref.putFile(addressProof.data.uri)
        addressProofURL = await ref.getDownloadURL()
        console.log(`addressProofURL:`, addressProofURL)
      }

      let addressProofBackURL = ''
      if(typeof (addressProofBack.data) === 'string'){
        addressProofBackURL = addressProofBack.data
      }
      else{
        let ref = await storage().ref(addressProofBack.data.fileName)
        await ref.putFile(addressProofBack.data.uri)
        addressProofBackURL = await ref.getDownloadURL()
        console.log(`addressProofURL:`, addressProofBackURL)
      }

      let identityProofURL = ''
      if (typeof (identityProof.data) === 'string') {
        identityProofURL = identityProof.data
      } else {
        let ref = await storage().ref(identityProof.data.fileName)
        await ref.putFile(identityProof.data.uri)
        identityProofURL = await ref.getDownloadURL()
        console.log(`identityProofURL:`, identityProofURL)
      }

      let driverPhotoURL = ''
      if (typeof (driverPhoto.data) === 'string') {
        driverPhotoURL = driverPhoto.data
      } else {
        let ref = await storage().ref(driverPhoto.data.fileName)
        await ref.putFile(driverPhoto.data.uri)
        driverPhotoURL = await ref.getDownloadURL()
        console.log(`driverPhotoURL:`, driverPhotoURL)
      }

      // return
      if (isEdit) {
        let editDriverData = {
          first_name: name.value,
          last_name: lastName.value,
          email: email.value,
          phone_number: phone.value,
          country_code: AppConstants.country_code,
          age: age.value,
          // temp_password: driverData.data.temp_password,
          /* address_proof: {
            // base64: firestore.Blob.fromBase64String(addressProof.data.base64),
            base64: addressProof.data.base64,
            type: addressProof.data.type
          }, */
          address_proof: addressProofURL,
          address_proof_back: addressProofBackURL,
          /* identity_proof: {
            // base64: firestore.Blob.fromBase64String(identityProof.data.base64),
            base64: identityProof.data.base64,
            type: identityProof.data.type
          }, */
          identity_proof: identityProofURL,
          /* driver_photo: {
            // base64: firestore.Blob.fromBase64String(driverPhoto.data.base64),
            base64: driverPhoto.data.base64,
            type: driverPhoto.data.type
          }, */
          driver_photo: driverPhotoURL,
          is_assign: driverData.data.is_assign,
          is_verified: driverData.data.is_verified,
          status: false,
          is_deleted: false
        }
        console.log(`driverData.id:`, driverData.id)
        firestore().collection('users').doc(driverData.data.user_uid).update({ ...editDriverData, user_type: 'driver', transporter_uid: userUID, driver_uid: driverData.id })
        firestore()
          .collection('users')
          .doc(userUID)
          .collection('driver_details')
          .doc(driverData.id).update({ ...editDriverData, user_uid: driverData.data.user_uid });
        setIsLoading(false);

        props.navigation.pop()
        refreshData()
      } else {
        console.log('rootRef is : ', uID);
        let driverData = {
          first_name: name.value,
          last_name: lastName.value,
          email: email.value,
          phone_number: phone.value,
          country_code: AppConstants.country_code,
          age: age.value,
          // temp_password: password,
          // device_details: AppConstants.device_details,
          /* address_proof: {
            // base64: firestore.Blob.fromBase64String(addressProof.data.base64),
            base64: addressProof.data.base64,
            type: addressProof.data.type
          }, */
          address_proof: addressProofURL,
          address_proof_back:addressProofBackURL,
          /* identity_proof: {
            // base64: firestore.Blob.fromBase64String(identityProof.data.base64),
            base64: identityProof.data.base64,
            type: identityProof.data.type
          }, */
          identity_proof: identityProofURL,
          /* driver_photo: {
            // base64: firestore.Blob.fromBase64String(driverPhoto.data.base64),
            base64: driverPhoto.data.base64,
            type: driverPhoto.data.type
          }, */
          driver_photo: driverPhotoURL,
          is_assign: false,
          is_verified: 'pending',
          status: false,
          is_deleted: false,
          created_at: new Date()
        }
        // console.log(`driverData.fromBase64String: ${JSON.stringify(driverData.driver_photo)}`)
        // console.log(`driverData.toBase64: ${driverData.driver_photo.toBase64()}`)
        // return
        let driverCount = profileData.driver_count
        if (!driverCount) {
          driverCount = 0
        }
        firestore()
          .collection('users')
          .doc(userUID)
          .update({ driver_count: driverCount + 1 })

        firestore()
          .collection('users')
          .doc(uID)
          .set({ ...driverData, user_type: 'driver', transporter_uid: userUID })
        const ref = firestore().collection('users').doc(userUID).collection('driver_details');
        ref.add({ ...driverData, user_uid: uID });
        setIsLoading(false);

        let parameters = {
          "userId": uID,
          "transporterId": userUID,
          "type": "new_driver"
        }
        NotificationCall(parameters)

        props.navigation.pop()
        refreshData()
        /* props.navigation.navigate({
          routeName: 'Dashboard',
        }); */
      }
    }
  }

  const addDriverScreenView = () => {
    let isVerified = driverData != undefined && driverData.data.is_verified == AppConstants.driverStatusVerifiedKey
    console.log(`isVerified: ${isVerified}`)
    return (
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps={'handled'}
        automaticallyAdjustContentInsets={false}
        showsVerticalScrollIndicator={false}>
        <Loader loading={isLoading} />
        {/* <View style={styles.lineView}>
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
            <Text style={styles.haveAnAccountText}>Upload Document</Text>
          </View> */}
        <View style={{ padding: 16 }}>
          <TextInput
            //   style={styles.nameInputText}
            label="First Name"
            returnKeyType="next"
            value={name.value}
            onChangeText={(text) => setName({ value: text, error: '' })}
            editable={!isVerified}
            error={isVerified ? !name.error : !!name.error}
            errorText={name.error}
            autoCapitalize="words"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            // blurOnSubmit={false}
            ref={(ref) => {
              this._nameinput = ref;
            }}
            onSubmitEditing={() => {
              console.log(`lastNameInputRef: `, lastNameInputRef)
              /* if (lastNameInputRef != null) {
                lastNameInputRef.current._root.focus()
              } */
            }}
          />
          <TextInput
            ref={lastNameInputRef}
            label="Last Name"
            returnKeyType="next"
            value={lastName.value}
            onChangeText={(text) => setLastName({ value: text, error: '' })}
            editable={!isVerified}
            error={isVerified ? !lastName.error : !!lastName.error}
            errorText={lastName.error}
            autoCapitalize="words"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            onSubmitEditing={() => this._emailinput && this._emailinput.focus()}
          />
          <TextInput
            //   style={styles.emailInputText}
            label="Email"
            returnKeyType="next"
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: '' })}
            // editable={!isVerified}
            error={email.error}
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
            onChangeText={(text) => setPhone({ value: text, error: '' })}
            editable={!isVerified}
            error={isVerified ? !phone.error : !!phone.error}
            errorText={phone.error}
            autoCapitalize="none"
            autoCompleteType="tel"
            textContentType="telephoneNumber"
            maxLength={10}
            keyboardType="phone-pad"
            ref={(ref) => {
              this._phoneinput = ref;
            }}
            onSubmitEditing={() => this._ageinput && this._ageinput.focus()}
            left={<Input.Affix customTextStyle={{ marginRight: 12 }} text={`${AppConstants.country_code} `} />}
          />
          <TextInput
            //   style={styles.phoneInputText}
            label="Age"
            returnKeyType="next"
            value={age.value}
            onChangeText={(text) => setAge({ value: text, error: '' })}
            editable={!isVerified}
            error={isVerified ? !age.error : !!age.error}
            errorText={age.error}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={10}
            keyboardType="number-pad"
            ref={(ref) => {
              this._ageinput = ref;
            }}
            onSubmitEditing={() => Keyboard.dismiss}
          />
        </View>
        <TouchableOpacity style={styles.nextView} onPress={onPressRegister}>
          <Image
            style={styles.nextImage}
            source={require('../../../assets/assets/SliderScreen/next.png')}
          />
        </TouchableOpacity>
      </ScrollView>
    )
  }

  let onlyNumberFieldRegex = '^[0-9]+$';
  const validateOnlyNumber = text => {
    let reg = new RegExp(onlyNumberFieldRegex, 'i');
    if (reg.test(text) === false) {
      return false;
    } else {
      return true;
    }
  };

  const decrementClock = asSeconds => {
    if (asSeconds <= -seconds) {
      if (clockCall) {
        clearInterval(clockCall);
      }
      setIsResendNow(true)
    }
    setTimer(asSeconds)
  };

  const startTimer = () => {
    setIsResendNow(false)
    setTimer(0)
    let setOpenTime = moment(new Date());
    clockCall = setInterval(() => {
      let nowTime = moment(new Date());
      let asSeconds = Math.round(
        moment.duration(setOpenTime.diff(nowTime)).asSeconds(),
      );
      decrementClock(asSeconds);
    }, 1000);
  };

  const step2Verification = () => {
    return (
      <ScrollView style={styles.container}>
        <KeyboardAvoidingView behavior="position">
          <Loader loading={isLoading} />
          {/* <TouchableOpacity onPress={() => props.navigation.pop()}>
            <Image
              style={styles.backImage}
              source={require('../../assets/assets/Authentication/back.png')}
            />
          </TouchableOpacity>
          <Text style={styles.tilteText}>Verification</Text> */}
          <View style={{ padding: 16 }}>
            <Text style={styles.subTitleText}>{"An authentication code has been sent to "}
              <Text style={{ color: Colors.accentColor }}>
                {AppConstants.country_code} {phone.value}
              </Text>
            </Text>
            <View style={{ marginTop: 16 }}>
              <OTPInputView
              autoFocusOnLoad={false}
                pinCount={6}
                style={{ height: 64, alignSelf: 'center', width: '94%' }}
                codeInputFieldStyle={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: Colors.borderColor,
                  color: Colors.textColor,
                  fontSize: 20,
                  // fontFamily: getFontFamily().BOLD,
                }}
                codeInputHighlightStyle={{
                  borderColor: Colors.primaryColor,
                  borderWidth: 3,
                }}
                onCodeChanged={code => {
                  if (!validateOnlyNumber(code)) {
                    return;
                  }
                  setOtp({ value: code, error: '' })
                  /* this.setState({otp: '' + code, errorMessage: ''}, () => {
                    let tIsDisable = true;
                    if (this.state.otp.length == 4) {
                      tIsDisable = false;
                    }
                    this.setState({isDisable: tIsDisable});
                  }); */
                }}
              />
              {otp.error == '' ? null : (
                <Text style={styles.errorText}>{otp.error}</Text>
              )}
            </View>
            {/* <TouchableOpacity style={styles.buttonLogin} onPress={() => {
              // onPressLogin()
            }}>
              <Text style={styles.loginText}>SUBMIT</Text>
            </TouchableOpacity> */}

            <TouchableOpacity style={styles.nextView} onPress={onPressVerifyOTP}>
              <Image
                style={styles.nextImage}
                source={require('../../../assets/assets/SliderScreen/next.png')}
              />
            </TouchableOpacity>

            <View
              style={{
                flexDirection: 'row',
                marginTop: -24,
                justifyContent: 'center',
              }}>
              {isResendNow ? (
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: Colors.subTitleTextColor,
                      textAlign: 'center',
                      fontFamily: "SofiaPro-Regular"
                    }}>
                    {"Didn't receive OTP? "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      Keyboard.dismiss();
                      let phoneNumberWithCode = `${AppConstants.country_code} ${phone.value}`
                      startTimer()
                      signInWithPhoneNumber(phoneNumberWithCode, true)
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.primaryColor,
                        fontFamily: "SofiaPro-Regular"
                      }}>
                      {" Resend Code"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: Colors.subTitleTextColor,
                      textAlign: 'center',
                      fontFamily: "SofiaPro-Regular"
                    }}>
                    {"Code sent. Resend code in "}
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.subTitleTextColor,
                        fontFamily: "SofiaPro-Regular"
                      }}>
                      {timer + seconds}
                    </Text>
                  </Text>
                </View>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    )
  }

  const onPageChange = (position) => {
    if (scrollRef) {
      scrollRef.current?.scrollTo({
        y: 0,
        animated: false,
      });
    }
    if (currentPosition > position) {
      setCurrentPosition(position)
    }
  }

  const saveImageData = (imageType, response) => {
    //imageType => 1 for Address Proof, 2 for Identity Proof, 3 for Driver Photo
    // console.log(`imageType: ${imageType}`);
    // console.log(`response: ${JSON.stringify(response)}`);
    if (imageType == 1) {
      setAddressProof({ data: response, error: '' });
    } else if (imageType == 2) {
      setIdentityProof({ data: response, error: '' });
    } else if (imageType == 3) {
      setDriverPhoto({ data: response, error: '' });
    }
    else if (imageType == 4) {
      setAddressProofBack({ data: response, error: '' })
    }
  };

  stepUploadDocumentView = () => {
    return (
      <ScrollView style={styles.container}>
        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={30}>
          <Loader loading={isLoading} />
          <Text
            style={styles.tilteText}>
            Address Proof (Adhaar Card, Voter Id) - At Least One
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Text
                style={styles.addressFrontBackText}>
                Front
              </Text>
              <UploadImage
                isRow={true}
                imageType={1}
                errorMessage={''}
                saveImageData={saveImageData}
                data={addressProof.data}
                isEdit={isEdit}
                isVerified={driverData != undefined && driverData.data.is_verified == AppConstants.driverStatusVerifiedKey}
              />
            </View>

            <View>
              <Text
                style={styles.addressFrontBackText}>
                Back
              </Text>
              <UploadImage
                isRow={true}
                imageType={4}
                errorMessage={''}
                saveImageData={saveImageData}
                data={addressProofBack.data}
                isEdit={isEdit}
                isVerified={driverData != undefined && driverData.data.is_verified == AppConstants.driverStatusVerifiedKey}
              />
            </View>
          </View>
          {(addressProof.error!='' || addressProofBack.error!='' ) && 
        <Text style={styles.errorText}>{addressProof.error!=''?addressProof.error:addressProofBack.error}</Text>}
          <UploadImage
            titleName="Identity Proof (License)"
            imageType={2}
            errorMessage={identityProof.error}
            saveImageData={saveImageData}
            data={identityProof.data}
            isEdit={isEdit}
            isVerified={driverData != undefined && driverData.data.is_verified == AppConstants.driverStatusVerifiedKey}
          />
          <UploadImage
            titleName="Driver Photo"
            imageType={3}
            errorMessage={driverPhoto.error}
            saveImageData={saveImageData}
            data={driverPhoto.data}
            isEdit={isEdit}
            isVerified={driverData != undefined && driverData.data.is_verified == AppConstants.driverStatusVerifiedKey}
          />
          <TouchableOpacity style={styles.buttonLogin} onPress={onPressSubmit}>
            <Text style={styles.loginText}>{isEdit ? 'EDIT DRIVER' : 'ADD DRIVER'}</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    )
  }

  driverScreenView = () => {
    let isVerified = driverData != undefined && driverData.data.is_verified == AppConstants.driverStatusVerifiedKey
    console.log(`driverScreenView.isVerified: ${isVerified}`)
    return (
      <View style={{ backgroundColor: Colors.mainBackgroundColor, paddingTop: 12, paddingBottom: 12, flex: 1 }}>
        <StepIndicator
          customStyles={customStyles}
          currentPosition={currentPosition}
          labels={stepLabels}
          stepCount={stepLabels.length}
          renderLabel={({ position, stepStatus, label, currentPosition }) => {
            return (
              <Text style={[position == currentPosition ? styles.registerText : styles.haveAnAccountText, { marginTop: 8, textAlign: 'center' }]}>
                {stepLabels[position]}
              </Text>
            )
          }}
        // onPress={onPageChange}
        />
        <View style={{ flex: 1 }}>
          {currentPosition == 0 ?
            addDriverScreenView()
            : currentPosition == 1 ?
              isVerified ? stepUploadDocumentView() : step2Verification()
              : stepUploadDocumentView()}
        </View>
      </View>
    )
  }

  return AppConstants.isAndroid ? (
    <View style={{ flex: 1 }}>{driverScreenView()}</View>
  ) : (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior="padding"
      keyboardVerticalOffset={64}
      enabled>
      {driverScreenView()}
    </KeyboardAvoidingView>
  );
};

AddDriverScreen.navigationOptions = (navigationData) => {
  var isEdit = navigationData.navigation.getParam('isEdit');
  if (isEdit === undefined) {
    isEdit = false
  }
  // console.log(`isEdit: ${isEdit}`)

  return {
    headerShown: true,
    headerTitle: isEdit ? 'Edit Driver' : 'Add Driver',
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
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    color: Colors.textColor,
  },
  subTitleText: {
    margin: 16,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2.3),
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
  errorText: {
    marginLeft: 16,
    marginTop: 0,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    // fontWeight: '500',
    color: Colors.errorColor,
    marginRight: 16,
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
    marginRight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nextView: {
    alignItems: 'center',
    justifyContent: 'center'
    // backgroundColor: Colors.backgroundColor,
  },
  nextImage: {
    height: 150,
    width: 150,
    resizeMode: 'contain'
  },
  addressFrontBackText: {
    marginLeft: 16,
    marginTop: 5,
    marginBottom: 16,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    color: Colors.textColor,
  }
});

export default AddDriverScreen;
