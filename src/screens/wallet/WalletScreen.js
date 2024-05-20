import React, {useCallback, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  Dimens,
  images,
  colors,
  stringValues,
  formatWithCommas,
} from '../../helper/Utils';
import CText from '../../common/CText';
import {useState} from 'react';
import TransactionDetailModal from './TransactionDetailModal';
import {
  getUserDataById,
  getWalletDataByUserId,
} from '../../helper/Utils/firestoreUtils';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import Loader from '../../components/design/Loader';
import {map} from 'lodash';
import { fetchWalletData } from '../../store/actions/wallet/walletAction';
// import Animated from 'react-native-reanimated';
// import BottomSheet from 'reanimated-bottom-sheet';
// import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

/* let arr = [
  {
    id: 1,
    type: 'deposit',
    sender: 'Atladara',
    receiver: 'Harni',
    tripId: '012345',
    date: 'April 14, 10:24 AM',
    amount: 1250,
  },
  {
    id: 2,
    type: 'deposit',
    sender: 'Waghodia',
    receiver: 'Sama road',
    tripId: '012345',
    date: 'April 14, 10:24 AM',
    amount: 850,
  },
  {
    id: 3,
    type: 'deposit',
    sender: 'Susen',
    receiver: 'Por',
    tripId: '012345',
    date: 'April 14, 10:24 AM',
    amount: 2250,
  },
  {
    id: 4,
    type: 'withdraw',
    sender: 'Waghodia',
    receiver: 'Sama road',
    tripId: '012345',
    date: 'April 14, 10:24 AM',
    amount: 1850,
  },
  {
    id: 5,
    type: 'deposit',
    sender: 'Atladara',
    receiver: 'Harni',
    tripId: '012345',
    date: 'April 14, 10:24 AM',
    amount: 1250,
  },
  {
    id: 6,
    type: 'deposit',
    sender: 'Waghodia',
    receiver: 'Sama road',
    tripId: '012345',
    date: 'April 14, 10:24 AM',
    amount: 850,
  },
  {
    id: 7,
    type: 'deposit',
    sender: 'Susen',
    receiver: 'Por',
    tripId: '012345',
    date: 'April 14, 10:24 AM',
    amount: 2250,
  },
  {
    id: 8,
    type: 'withdraw',
    sender: 'Waghodia',
    receiver: 'Sama road',
    tripId: '012345',
    date: 'April 14, 10:24 AM',
    amount: 1850,
  },
  {
    id: 9,
    type: 'deposit',
    sender: 'Atladara',
    receiver: 'Harni',
    tripId: '012345',
    date: 'April 14, 10:24 AM',
    amount: 1250,
  },
  {
    id: 10,
    type: 'deposit',
    sender: 'Waghodia',
    receiver: 'Sama road',
    tripId: '012345',
    date: 'April 14, 10:24 AM',
    amount: 850,
  },
  {
    id: 11,
    type: 'deposit',
    sender: 'Susen',
    receiver: 'Por',
    tripId: '012345',
    date: 'April 14, 10:24 AM',
    amount: 2250,
  },
  {
    id: 12,
    type: 'withdraw',
    sender: 'Waghodia',
    receiver: 'Sama road',
    tripId: '012345',
    date: 'April 14, 10:24 AM',
    amount: 1850,
  },
]; */
const WalletScreen = ({navigation}) => {

  const [isLoading, setIsLoading] = useState(false);
  const [walletBal, setWalletBal] = useState(0);
  const [transactionsArr, setTransactionsArr] = useState([]);
  const [showTransDetailModal, setShowTransDetailModal] = useState(false);
  const [transDetailData, setTransDetailData] = useState({});
  
  const dispatch = useDispatch();

  let userUID = useSelector((state) => state.fetchProfileData.userUID);
  let uProfilData = useSelector((state) => state.fetchProfileData.fetchProfileData);

  useEffect(() => {
    setIsLoading(true);
    getWalletData();
    return () => {};
  }, [navigation?.state?.params]);

  const getWalletData = async() => {
    setIsLoading(true);
    getWalletDataByUserId(userUID).then((walletData) => {
      setIsLoading(false);
      if (walletData) {
        if (walletData?.wallet) {
          let bal = parseFloat(walletData?.wallet?.balance);
          setWalletBal(bal);
        }
        if (walletData?.transactions) {
          let _sort = walletData?.transactions.sort((a, b) => b.date - a.date);
          setTransactionsArr(_sort);
        }
      }
    });
    // dispatch(fetchWalletData(userUID));
  };

  // const bottomSheetRenderHeader = () => (
  //   <View
  //     style={{
  //       // flex: 1,
  //       // height: Dimens.height,
  //       // alignItems: 'center',
  //       // zIndex: 999,
  //       backgroundColor: colors.white,
  //       padding: 16,
  //       // borderTopRightRadius: 30,
  //       // borderTopLeftRadius: 30
  //     }}
  //   >
  //     <Text style={{ fontSize: 16 , fontWeight: '500'}}>Recent Transactions</Text>
  //   </View>
  // );

  // const bottomSheetRenderContent = () => (
  //   <View
  //     style={{
  //       // flex: 1,
  //       height: Dimens.height,
  //       // alignItems: 'center',
  //       backgroundColor: colors.green,
  //       padding: 16,
  //     }}
  //   >
  //     {/* <Text style={{ fontSize: 16 , fontWeight: '500'}}>Recent Transactions</Text> */}
  //   </View>
  // );

  const handleTransactionClick = (data) => {
    setTransDetailData(data);
    setShowTransDetailModal(!showTransDetailModal);
  };

  const renderFlatList = ({item, index}) => {
    return (
      <TouchableOpacity
        key={item?.id}
        activeOpacity={0.7}
        style={styles.itemContainer}
        onPress={() => handleTransactionClick(item)}
      >
        {item?.type === 'addition' && item?.tripId ? (
          <View style={{flexDirection: 'row'}}>
            <CText font_Size={12} font_Weight={'600'}>
              {item?.sender}
            </CText>
            <Image
              style={{width: 14, height: 14, marginHorizontal: 8}}
              source={images.longArrow}
              resizeMode="contain"
            />
            <CText font_Size={12} font_Weight={'600'}>
              {item?.receiver}
            </CText>
          </View>
        ) : item?.type === 'addition' ? (
          <CText font_Size={12} font_Weight={'600'}>
            Deposit
          </CText>
        ) : (
          <CText font_Size={12} font_Weight={'600'}>
            Withdraw
          </CText>
        )}

        <View
          style={{
            flex: 3,
            flexDirection: 'row',
            // justifyContent: 'space-between',
            marginTop: 8,
          }}
        >
          <View style={{flex: 1.5}}>
            <CText
              font_Size={12}
              font_Weight={'bold'}
              extraStyle={{opacity: 0.4}}
            >
              {moment(item?.date?.toDate()).format('MMM DD, YYYY hh:mm A')}
            </CText>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            {item?.tripId ? (
              <CText
                font_Size={12}
                font_Weight={'bold'}
                extraStyle={{opacity: 0.4}}
              >
                {`T ID: ${item?.tripId}`}
              </CText>
            ) : null}
          </View>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <CText
              font_Size={12}
              font_Weight={'bold'}
              fontColor={item.type === 'addition' ? colors.green : colors.red}
            >
              {`${item?.type === 'addition' ? '+ ' : '- '}${
                stringValues.rupeeSign
              }${formatWithCommas(item?.amount)}`}
            </CText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = ({item, index}) => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          // marginTop: 40,
        }}
      >
        <CText font_Size={14} font_Weight={'bold'}>
          No Data available.
        </CText>
      </View>
    );
  };

  const handleSeeAllClick = () => {
    navigation.navigate({
      routeName: 'TransactionsScreen',
      params: {transactionsArr: transactionsArr},
    });
  };

  const handleAddMoneyBtnClick = () => {
    navigation.navigate({routeName: 'AddMoneyScreen'});
  };

  const handleWithdrawMoneyBtnClick = () => {
    navigation.navigate({routeName: 'WithdrawMoneyScreen'});
  };

  return (
    <View style={styles.container}>
      <Loader loading={isLoading} />
      <Image
        style={{...styles.walletHeaderImg, zIndex: 9}}
        source={images.walletHeader}
        resizeMode="cover"
      />

      <View style={styles.headerContainer}>
        <View style={styles.userInfoContainer}>
          <View style={styles.userImgContainer}>
            {/* {uProfilData?.identity_proof === '' ?
              <CText
                font_Size={14}
                font_Weight={'bold'}
                fontColor={colors.primary}
              >
                {`${uProfilData?.first_name.split('')[0]}${uProfilData?.last_name.split('')[0]}`}
              </CText> :
              <Image source={{ uri: uProfilData?.identity_proof }} style={styles.userProfileImg} />
            } */}
            <CText
              font_Size={14}
              font_Weight={'bold'}
              fontColor={colors.primary}
            >
              {`${uProfilData?.first_name.split('')[0]}${
                uProfilData?.last_name.split('')[0]
              }`}
            </CText>
          </View>
          <View style={{paddingStart: 12}}>
            <CText font_Size={14} font_Weight={'bold'} fontColor={colors.white}>
              Hello,
            </CText>
            <CText font_Size={14} font_Weight={'bold'} fontColor={colors.white}>
              {`${uProfilData?.first_name} ${uProfilData?.last_name}`}
            </CText>
          </View>
          <TouchableOpacity
            style={{position: 'absolute', right: 18}}
            activeOpacity={0.7}
            onPress={() => navigation.goBack(null)}
          >
            <Image
              style={{
                ...styles.backBtnImg /* position: 'absolute', right: 18 */,
              }}
              source={images.backWhiteBtn}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.walletInfoContainer}>
          <View>
            <CText font_Size={14} font_Weight={'500'} fontColor={colors.white}>
              Wallet Balance
            </CText>
            <View style={{flexDirection: 'row'}}>
              <CText
                font_Size={36}
                font_Weight={'bold'}
                fontColor={colors.white}
                extraStyle={{...styles.txtShadow}}
              >
                {`${stringValues.rupeeSign}${formatWithCommas(
                  walletBal?.toFixed(2).toLocaleString('en-US').split('.')[0],
                )}`}
              </CText>
              <CText
                font_Size={18}
                fontColor={colors.white}
                extraStyle={{
                  ...styles.txtShadow,
                  marginBottom: 4,
                  alignSelf: 'flex-end',
                }}
              >
                {`.${walletBal?.toFixed(2).toLocaleString().split('.')[1]}`}
              </CText>
            </View>
          </View>

          <View style={styles.btnsContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginEnd: 22,
              }}
              onPress={() => handleAddMoneyBtnClick()}
            >
              <Image
                style={{width: 18, height: 18}}
                source={images.depositMoneyIcon}
                resizeMode="contain"
              />
              <CText
                font_Size={13}
                font_Weight={'bold'}
                fontColor={colors.white}
                extraStyle={{marginTop: 8}}
              >
                Add Money
              </CText>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{justifyContent: 'center', alignItems: 'center'}}
              onPress={() => handleWithdrawMoneyBtnClick()}
            >
              <Image
                style={{width: 18, height: 18}}
                source={images.withdrawMoneyIcon}
                resizeMode="contain"
              />
              <CText
                font_Size={13}
                font_Weight={'bold'}
                fontColor={colors.white}
                extraStyle={{marginTop: 8}}
              >
                Withdraw
              </CText>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.subContainer}>
        {/* <BottomSheet
          // ref={sheetRef}
          index={1}
          snapPoints={['75%', '97%', '75%']}
          borderRadius={30}
          renderContent={bottomSheetRenderContent}
          renderHeader={bottomSheetRenderHeader}
        /> */}
        <View style={styles.greyBar} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 16,
          }}
        >
          <CText font_Size={16} font_Weight={'700'}>
            Recent Transactions
          </CText>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() => handleSeeAllClick()}
          >
            <CText
              font_Size={12}
              font_Weight={'500'}
              fontColor={colors.primary}
              extraStyle={{marginEnd: 8}}
            >
              See All
            </CText>
            <Image
              style={{width: 8, height: 8}}
              source={images.rightArrow}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={transactionsArr}
          renderItem={renderFlatList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingVertical: 18, flexGrow: 1}}
          ListEmptyComponent={renderEmptyList}
        />

        <TransactionDetailModal
          show={showTransDetailModal}
          close={() => setShowTransDetailModal(!showTransDetailModal)}
          transactionData={transDetailData}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    width: Dimens.width,
    zIndex: 99,
    position: 'absolute',
    top: 6,
    padding: 18,
  },
  subContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 18,
    zIndex: 999,
    marginTop: -22,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  greyBar: {
    width: 36,
    height: 5,
    marginTop: 16,
    alignSelf: 'center',
    backgroundColor: colors.grey,
    borderRadius: 12,
  },
  font14SizeBold: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  font13SizeBold: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.white,
  },
  backBtnImg: {
    width: 18,
    height: 18,
  },
  walletHeaderImg: {
    width: Dimens.width,
    height: 210,
    backgroundColor: 'red',
    zIndex: 9,
  },
  userImgContainer: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    // for shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  userProfileImg: {
    width: 45,
    height: 45,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 26,
  },
  btnsContainer: {
    flexDirection: 'row',
  },
  txtShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 12,
  },
  itemContainer: {
    borderColor: colors.grey,
    borderBottomWidth: 0.6,
    paddingVertical: 10,
  },
});

export default WalletScreen;
