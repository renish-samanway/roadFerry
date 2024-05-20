import {Modal, TouchableOpacity, StyleSheet, View, Image} from 'react-native';
import React from 'react';
import CViewWithOrangTop from '../../common/CViewWithOrangTop';
import CText from '../../common/CText';
import {Dimens, colors, images, stringValues} from '../../helper/Utils';
import {Shadow} from 'react-native-neomorph-shadows';
import moment from 'moment';

const TransactionDetailModal = ({
  navigation,
  children,
  show,
  close,
  transactionData = {},
  handleReportBtnClick,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onRequestClose={() => close()}
    >
      <TouchableOpacity activeOpacity={1} style={styles.modalView}>
        <CViewWithOrangTop isModal={true}>
          <View style={{padding: 18}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {transactionData?.type === 'addition' ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <CText font_Size={18} font_Weight={'bold'}>
                    {transactionData?.sender}
                  </CText>
                  <Image
                    style={{width: 18, height: 18, marginHorizontal: 8}}
                    source={images.longArrow}
                    resizeMode="contain"
                  />
                  <CText font_Size={18} font_Weight={'bold'}>
                    {transactionData?.receiver}
                  </CText>
                </View>
              ) : (
                <CText font_Size={18} font_Weight={'bold'}>
                  Withdraw
                </CText>
              )}
              <TouchableOpacity activeOpacity={0.7} onPress={() => close()}>
                <CText
                  font_Size={14}
                  fontColor={colors.primary}
                  font_Weight={'bold'}
                >
                  Close
                </CText>
              </TouchableOpacity>
            </View>
            <CText font_Size={12} extraStyle={{opacity: 0.4}}>
              KM: 18
            </CText>

            <View
              style={{
                marginVertical: 18,
                marginHorizontal: 38,
              }}
            >
              {/* <View style={{...styles.amountContainer }}>
                <CText
                  font_Size={22}
                  fontColor={
                    transactionData?.type === 'addition'
                      ? colors.green
                      : colors.red
                  }
                  font_Weight={'bold'}
                  extraStyle={{backgroundColor: colors.transparent}}>
                  {`${transactionData?.type === 'addition' ? '+ ' : '- '}${
                    stringValues.rupeeSign
                  }${transactionData?.amount}`}
                </CText>
              </View> */}

              <Shadow
                inner // <- enable inner shadow
                useArt // <- set this prop to use non-native shadow on ios
                style={{
                  shadowOffset: {width: 0, height: 4},
                  shadowOpacity: 1,
                  shadowColor:
                    transactionData?.type === 'addition'
                      ? colors.lightGreenShadow
                      : colors.grey,
                  shadowRadius: 2,
                  width: Dimens.width - 110,
                  height: 60,
                  ...styles.amountContainer,
                  backgroundColor:
                    transactionData?.type === 'addition'
                      ? colors.lightgreen
                      : colors.lightgrey,
                  flexDirection: 'row',
                }}
              >
                <CText
                  font_Size={22}
                  fontColor={
                    transactionData?.type === 'addition'
                      ? colors.green
                      : colors.black
                  }
                  font_Weight={'bold'}
                  extraStyle={{backgroundColor: colors.transparent}}
                >
                  {`${transactionData?.type === 'addition' ? '+ ' : '- '}${
                    stringValues.rupeeSign
                  }${
                    transactionData?.amount /*.toFixed(2).toLocaleString() */
                  }`}
                </CText>
                {transactionData?.type !== 'addition' ? (
                  <Image
                    source={images.greenTickImg}
                    style={{width: 24, height: 24, marginStart: 4}}
                    resizeMode="contain"
                  />
                ) : null}
              </Shadow>

              <View style={styles.greyBorderContainer}>
                <CText font_Size={12} extraStyle={{opacity: 0.6}}>
                  Date and Time
                </CText>
                <CText
                  font_Size={12}
                  font_Weight={'bold'}
                  extraStyle={{opacity: 0.7}}
                >
                  {moment(transactionData?.date?.toDate()).format(
                    'MMMM DD, YYYY - hh:mm A',
                  )}
                </CText>
              </View>
              <View style={styles.greyBorderContainer}>
                <CText font_Size={12} extraStyle={{opacity: 0.6}}>
                  Trip ID
                </CText>
                <CText
                  font_Size={12}
                  font_Weight={'bold'}
                  extraStyle={{opacity: 0.7}}
                >
                  01234
                </CText>
              </View>
              {transactionData?.type !== 'addition' ? (
                <View style={styles.greyBorderContainer}>
                  <CText font_Size={12} extraStyle={{opacity: 0.6}}>
                    Transfer to
                  </CText>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: colors.lightpurple,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Image
                        source={images.phonpeImg}
                        style={{width: 16, height: 16}}
                        resizeMode={'contain'}
                      />
                    </View>
                    <View style={{marginStart: 18}}>
                      <CText font_Size={10}>HDFC Bank</CText>
                      <CText font_Size={10} extraStyle={{opacity: 0.4}}>
                        **** **** **** 1234
                      </CText>
                    </View>
                  </View>
                </View>
              ) : null}
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
          </View>
        </CViewWithOrangTop>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    width: Dimens.width,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  amountContainer: {
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  greyBorderContainer: {
    flexDirection: 'row',
    marginTop: 12,
    borderColor: colors.grey,
    borderWidth: 0.7,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 8,
  },
});

export default TransactionDetailModal;
