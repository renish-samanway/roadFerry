import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import {colors, formatWithCommas, images} from '../../helper/Utils';
import CText from '../../common/CText';

const TransactionStatusScreen = ({navigation, route}) => {
  let paymentDetail = navigation?.state?.params?.data;

  useEffect(() => {

    return () => {};
  }, []);

  const handleReportBtnClick = () => {
    Linking.openURL('mailto:support@roadferry.in');
  };

  const handleCopyBtn = () => {};

  const handleBackToWalletBtnClick = () => {
    navigation.navigate({
      routeName: 'WalletScreen',
      params: {
        from: 'addMoney'
      }
    });
  };

  return (
    <View style={styles.maincontainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{marginTop: 82, alignItems: 'center'}}>
          {paymentDetail?.status && paymentDetail?.status === true ? (
            <Image
              source={images.transactionSuccessImg}
              style={styles.transStatusImg}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={images.transactionFailedImg}
              style={styles.transStatusImg}
              resizeMode="contain"
            />
          )}
          {paymentDetail?.status && paymentDetail?.status === true ? (
            <>
              <CText
                font_Size={16}
                font_Weight={'bold'}
                extraStyle={{marginTop: 12}}
              >
                Payment Done
              </CText>
              <CText
                font_Size={12}
                font_Weight={'500'}
                extraStyle={{marginTop: 8, opacity: 0.4, textAlign: 'center'}}
              >
                {`Bill payment has been done` + '\n' + `successfully`}
              </CText>
            </>
          ) : (
            <>
              <CText
                font_Size={16}
                font_Weight={'bold'}
                extraStyle={{marginTop: 12}}
              >
                {`Transfer Failed :(`}
              </CText>
              <CText
                font_Size={12}
                font_Weight={'500'}
                extraStyle={{marginTop: 8, opacity: 0.4, textAlign: 'center'}}
              >
                {`Your transfer has been declined` + '\n' + `due to a technical issue`}
              </CText>
            </>
          )}
        </View>

        <View style={{marginTop: 82}}>
          <CText font_Size={12} font_Weight={'bold'}>
            Payment Details
          </CText>
          <View style={styles.infoContainer}>
            <CText
              font_Size={12}
              font_Weight={'bold'}
              extraStyle={{opacity: 0.4}}
            >
              Transfer to account
            </CText>
            <CText
              font_Size={12}
              font_Weight={'bold'}
              extraStyle={{marginTop: 4}}
            >
              **** **** **** 1234
            </CText>
          </View>

          <View style={styles.infoContainer}>
            <CText
              font_Size={12}
              font_Weight={'bold'}
              extraStyle={{opacity: 0.4}}
            >
              Amount
            </CText>
            <CText
              font_Size={12}
              font_Weight={'bold'}
              extraStyle={{marginTop: 4}}
            >
              {`${formatWithCommas(paymentDetail?.amount)}`}
            </CText>
          </View>

          <View style={styles.infoContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View>
                <CText
                  font_Size={12}
                  font_Weight={'bold'}
                  extraStyle={{opacity: 0.4}}
                >
                  Transaction no.
                </CText>
                <CText
                  font_Size={12}
                  font_Weight={'bold'}
                  extraStyle={{marginTop: 4}}
                >
                  23010412432431
                </CText>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleCopyBtn()}
              >
                <Image
                  source={images.copyIcon}
                  style={{width: 24, height: 24}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.reportBtnContainer}
            onPress={() => handleReportBtnClick()}
          >
            <Image
              source={images.repostFlagIcon}
              style={{width: 20, height: 20}}
              resizeMode="contain"
            />
            <CText
              font_Size={14}
              font_Weight={'bold'}
              fontColor={colors.red}
              extraStyle={{marginStart: 4}}
            >
              Report a problem
            </CText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.btnContainer}
            onPress={() => handleBackToWalletBtnClick()}
          >
            <CText
              font_Size={14}
              font_Weight={'bold'}
              fontColor={colors.white}
              extraStyle={{marginStart: 4}}
            >
              Back to wallet
            </CText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 18,
  },
  transStatusImg: {
    width: 163,
    height: 126,
  },
  infoContainer: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.grey,
    padding: 12,
    borderRadius: 10,
  },
  reportBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  btnContainer: {
    marginTop: 52,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
});

export default TransactionStatusScreen;
