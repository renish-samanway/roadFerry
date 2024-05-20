import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import CText from '../../common/CText';
import CHeader from '../../common/CHeader';
import CViewWithOrangTop from '../../common/CViewWithOrangTop';
import {
  Dimens,
  colors,
  formatWithCommas,
  images,
  stringValues,
} from '../../helper/Utils';
import {useState} from 'react';
import {addTransaction} from '../../helper/Utils/firestoreUtils';
import {useSelector} from 'react-redux';

const AddMoneyScreen = ({navigation}) => {
  const [amount, setAmount] = useState('');
  const [isDisable, setIsDisable] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  let userUID = useSelector((state) => state.fetchProfileData.userUID);

  const isInputValid = () => {
    let isValid;
    if (!amount || amount <= 0) {
      isValid = false;
      setErrorMsg('Please enter amount and should be greater than zero.');
    } else {
      isValid = true;
      setErrorMsg(null);
    }
    return isValid;
  };

  const handleAddMoneyBtn = () => {
    setIsDisable(true);
    if (isInputValid()) {
      let obj = {
        amount: amount.toString(),
        type: 'addition',
        tripId: '',
        date: new Date(),
        paymentGatewayId: '',
        details: {},
        status: true
      };
      navigation.navigate({
        routeName: 'TransactionStatusScreen',
        params: {
          data: obj
        },
      });
      // return
      addTransaction(userUID, obj).then(() => {
        navigation.navigate({
          routeName: 'TransactionStatusScreen',
          params: {
            data: obj
          },
        });
      });
    }

    setTimeout(() => {
      setIsDisable(false);
    }, 1500);
  };

  return (
    <View style={{flex: 1}}>
      <CHeader
        title={'Add Money'}
        handleLeftIconClick={() => navigation.goBack()}
      />
      <CViewWithOrangTop isModal={false}>
        <View style={styles.mainContainer}>
          <CText font_Size={14} extraStyle={{opacity: 0.4}}>
            Enter your amount
          </CText>
          {errorMsg ? (
            <CText
              font_Size={12}
              fontColor={colors.red}
            >
              {errorMsg}
            </CText>
          ) : null}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <CText font_Size={20} extraStyle={{opacity: 0.4}}>
              {stringValues.rupeeSign}
            </CText>
            <TextInput
              style={styles.input}
              onChangeText={(txt) => {
                if (isNaN(txt) ||txt.toString().length === 0) {
                  console.log("nan: ", txt);
                  txt = '0';
                }
                setAmount(parseInt(txt));
                setErrorMsg(null);
              }}
              // value={formatWithCommas(amount)}
              value={Number(amount).toLocaleString()}
              autoFocus={true}
              // placeholder="useless placeholder"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={{paddingHorizontal: 18, marginTop: 62}}>
          <CText font_Size={12} extraStyle={{opacity: 0.4}}>
            Account
          </CText>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 12,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: colors.lightpurple,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                source={images.phonpeImg}
                style={{width: 29, height: 29}}
                resizeMode={'contain'}
              />
            </View>
            <View style={{marginStart: 18}}>
              <CText font_Size={14}>HDFC Bank</CText>
              <CText font_Size={12} extraStyle={{opacity: 0.4}}>
                **** **** **** 1234
              </CText>
            </View>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            width: Dimens.width - 40,
            marginTop: 22,
            marginHorizontal: 18,
            paddingVertical: 18,
            backgroundColor: colors.primary,
            borderRadius: 28,
            alignItems: 'center',
            position: 'absolute',
            bottom: 20,
          }}
          disabled={isDisable}
          onPress={() => handleAddMoneyBtn()}
        >
          <CText font_Size={14} fontColor={colors.white}>
            ADD MONEY
          </CText>
        </TouchableOpacity>
      </CViewWithOrangTop>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    marginTop: 42,
    paddingHorizontal: 18,
  },
  input: {
    width: 210,
    height: 80,
    // margin: 12,
    fontSize: 34,
    color: colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
});

export default AddMoneyScreen;
