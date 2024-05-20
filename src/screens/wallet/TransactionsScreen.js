import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  SectionList,
  Modal,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CHeader from '../../common/CHeader';
import {
  Dimens,
  colors,
  months,
  images,
  stringValues,
  formatWithCommas,
} from '../../helper/Utils';
import CText from '../../common/CText';
import _ from 'lodash';
import moment from 'moment';
import CModal from '../../common/CModal';
import {RadioButton} from 'react-native-paper';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import CViewWithOrangTop from '../../common/CViewWithOrangTop';
import LinearGradient from 'react-native-linear-gradient';
import {Shadow} from 'react-native-neomorph-shadows';
import TransactionDetailModal from './TransactionDetailModal';
import DateTimePicker from '@react-native-community/datetimepicker';

let radioLists = [
  {
    id: 1,
    name: 'This Week',
    value: 'thisWeek',
  },
  {
    id: 2,
    name: 'This Month',
    value: 'thisMonth',
  },
  {
    id: 3,
    name: 'Past 3 Months',
    value: '3Months',
  },
  {
    id: 4,
    name: 'This Year',
    value: 'thisYear',
  },
  {
    id: 5,
    name: 'Custom Date',
    value: 'custom',
  },
];
export default function TransactionsScreen({route, navigation}) {
  const [transArr, setTransArr] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showTransDetailModal, setShowTransDetailModal] = useState(false);
  const [radioChecked, setRadioChecked] = useState('thisWeek');
  // const [showCalendarView, setShowCalendarView] = useState(false);
  const [showCalendarView, setShowCalendarView] = useState('');
  const [customFromDate, setCustomFromDate] = useState(new Date());
  const [customToDate, setCustomToDate] = useState(new Date());
  const [transDetailData, setTransDetailData] = useState({});

  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  useEffect(() => {
    sortAndGroupByDate(navigation?.state?.params?.transactionsArr);
    return () => {};
  }, [radioChecked]);

  const sortAndGroupByDate = (arr) => {
    let sortArr = _.orderBy(arr, ['date'], ['asc']);
    // let sortArr = arr.sort((a, b) => a.date - b.date);
    let _obj = _.groupBy(sortArr, (item) =>
      // moment(item?.date?.toDate()).format('M, YYYY'),
      moment(item?.date?.toDate()).format('YYYY-MM'),
    );
    const _res = Object.entries(_obj).map((val) => ({
      date: val[0],
      data: [...val[1]],
    }));
    let _sortArr = _.orderBy(_res, ['date'], ['desc']);
    _sortArr.map((item, index) => {
      let _date = item?.date.split(',');
      return {
        // date: months.indexOf(_date[0]) + _date[1],
        ...item,
      };
    });
    setTransArr(_sortArr);
  };

  const handleTransactionClick = (item) => {
    setTransDetailData(item);
    setShowTransDetailModal(!showTransDetailModal);
  };

  const renderSectionList = ({item, index}) => {
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
            // justifyContent: 'space-around',
            marginTop: 8,
          }}
        >
          <View style={{flex: 1.5}}>
            <CText
              font_Size={12}
              font_Weight={'bold'}
              extraStyle={{opacity: 0.4}}
            >
              {moment(item?.date.toDate()).format('MMMM DD, hh:mm A')}
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
          // width: Dimens.width - 38,
          height: Dimens.height - 112,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CText font_Size={14} font_Weight={'bold'}>
          No Data available.
        </CText>
      </View>
    );
  };

  const handleFilterClick = () => {
    console.log('filter clicked');
    setShowFilterModal(!showFilterModal);
  };

  const handleSaveBtnClicked = () => {
    setShowCalendarView(!showCalendarView);
  };

  const FromDateCalendarView = (
    <View style={{}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <CText font_Size={16} font_Weight={'bold'}>
          Choose Date
        </CText>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowCalendarView(!showCalendarView)}
        >
          <CText font_Size={14} font_Weight={'bold'} fontColor={colors.primary}>
            Close
          </CText>
        </TouchableOpacity>
      </View>
      <Calendar
        // current={moment(new Date().toDateString()).format('yyyy-dd-mm')}
        onDayPress={(day) => {
          console.log('from date: ', day.dateString);
          setCustomFromDate(day.dateString);
        }}
        markedDates={{
          [customFromDate]: {
            selected: true,
            disableTouchEvent: true,
            selectedDotColor: colors.primary,
          },
        }}
        theme={{
          textMonthFontWeight: 'bold',
        }}
        style={{
          marginTop: 12,
        }}
      />
      <TouchableOpacity
        style={styles.saveBtn}
        onPress={() => handleSaveBtnClicked()}
      >
        <CText font_Size={14} fontColor={colors.white}>
          SAVE
        </CText>
      </TouchableOpacity>
    </View>
  );

  const ToDateCalendarView = (
    <View style={{}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <CText font_Size={16} font_Weight={'bold'}>
          Choose Date
        </CText>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowCalendarView(!showCalendarView)}
        >
          <CText font_Size={14} font_Weight={'bold'} fontColor={colors.primary}>
            Close
          </CText>
        </TouchableOpacity>
      </View>
      <Calendar
        onDayPress={(day) => {
          console.log('to date: ', day.dateString);
          setCustomToDate(day.dateString);
        }}
        markedDates={{
          [customToDate]: {
            selected: true,
            disableTouchEvent: true,
            selectedDotColor: colors.primary,
          },
        }}
        theme={{
          textMonthFontWeight: 'bold',
        }}
        style={{
          marginTop: 12,
        }}
      />
      <TouchableOpacity
        style={styles.saveBtn}
        onPress={() => handleSaveBtnClicked()}
      >
        <CText font_Size={14} fontColor={colors.white}>
          SAVE
        </CText>
      </TouchableOpacity>
    </View>
  );

  const handleReportBtnClick = () => {
    Linking.openURL('mailto:support@roadferry.in');
  };

  const handleFromDateClick = (type) => {
    // if (item?.value === 'custom') {
    // setShowCalendarView(!showCalendarView);
    // setShowCalendarView(type);
    setShowFromDatePicker(!showFromDatePicker);
    // }
  };

  const handleToDateClick = (type) => {
    // if (item?.value === 'custom') {
    // setShowCalendarView(!showCalendarView);
    // setShowCalendarView(type);
    setShowToDatePicker(!showToDatePicker);
    // }
  };

  return (
    <View style={{flex: 1}}>
      <CHeader
        title={'All Transactions'}
        showRightIcon={true}
        rightIcon={images.filterIcon}
        handleLeftIconClick={() => navigation.goBack()}
        handleRightIconClick={() => handleFilterClick()}
      />

      <CViewWithOrangTop>
        <SectionList
          sections={transArr}
          keyExtractor={(item, index) => index}
          renderItem={renderSectionList}
          contentContainerStyle={{paddingHorizontal: 18, paddingBottom: 18}}
          renderSectionHeader={({section: {date}}, index) => (
            <CText
              extraStyle={{marginTop: 20}}
              font_Size={14}
              font_Weight={'bold'}
            >
              {/* {`${months[date.split(',')[0] - 1]}, ${date.split(',')[1]}`} */}
              {moment(date).format('MMMM, YYYY')}
            </CText>
          )}
          ListEmptyComponent={renderEmptyList}
        />
      </CViewWithOrangTop>

      {/* filter Modal */}
      <CModal
        show={showFilterModal}
        close={() => setShowFilterModal(!showFilterModal)}
      >
        <CViewWithOrangTop isModal={true}>
          <View style={{padding: 18}}>
            {showCalendarView === 'fromDate' ? (
              FromDateCalendarView
            ) : showCalendarView === 'toDate' ? (
              ToDateCalendarView
            ) : (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <CText font_Size={16} font_Weight={'bold'}>
                    Show Transactions
                  </CText>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setShowFilterModal(!showFilterModal)}
                  >
                    <CText
                      font_Size={14}
                      font_Weight={'bold'}
                      fontColor={colors.primary}
                    >
                      Close
                    </CText>
                  </TouchableOpacity>
                </View>
                <View style={{marginTop: 22}}>
                  {radioLists &&
                    radioLists.map((item, index) => {
                      return (
                        <View
                          key={item?.id}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 12,
                          }}
                        >
                          <RadioButton
                            color={colors.primary}
                            value={item.value}
                            status={
                              radioChecked === item.value
                                ? 'checked'
                                : 'unchecked'
                            }
                            onPress={() => {
                              setRadioChecked(item.value);
                            }}
                          />
                          <CText font_Size={16} font_Weight={'600'}>
                            {item.name}
                          </CText>
                        </View>
                      );
                    })}
                  {radioChecked === 'custom' ? (
                    <View
                      style={{justifyContent: 'center', alignItems: 'center'}}
                    >
                      <View
                        style={{
                          width: Dimens.width - 58,
                          height: 96,
                          backgroundColor: '#F9F9F9',
                          borderRadius: 8,
                          zIndex: 9,
                        }}
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          zIndex: 99,
                          position: 'absolute',
                        }}
                      >
                        <TouchableOpacity
                          activeOpacity={0.7}
                          style={{
                            flex: 1,
                            borderColor: colors.grey,
                            borderWidth: 1,
                            padding: 12,
                            borderRadius: 8,
                            marginEnd: 18,
                          }}
                          onPress={() => handleFromDateClick('fromDate')}
                        >
                          <CText font_Size={12} extraStyle={{opacity: 0.5}}>
                            From
                          </CText>
                          <CText
                            font_Size={16}
                            font_Weight={'bold'}
                            extraStyle={{marginVertical: 4}}
                          >
                            {customFromDate
                              ? moment(customFromDate).format('DD MMMM YYYY')
                              : `-`}
                          </CText>
                        </TouchableOpacity>
                        {showFromDatePicker ? (
                          <DateTimePicker
                            value={customFromDate}
                            display={'default'}
                            mode={'date'}
                            onChange={(event, value) => {
                              setShowFromDatePicker(!showFromDatePicker);
                              // on cancel set date value to previous date
                              if (event?.type === 'dismissed') {
                                setCustomFromDate(customFromDate);
                                return;
                              }
                              setCustomFromDate(value);
                            }}
                          />
                        ) : null}

                        <TouchableOpacity
                          activeOpacity={0.7}
                          style={{
                            flex: 1,
                            borderColor: colors.grey,
                            borderWidth: 1,
                            padding: 12,
                            borderRadius: 8,
                          }}
                          onPress={() => handleToDateClick('toDate')}
                        >
                          <CText font_Size={12} extraStyle={{opacity: 0.5}}>
                            To
                          </CText>
                          <CText
                            font_Size={16}
                            font_Weight={'bold'}
                            extraStyle={{marginVertical: 4}}
                          >
                            {customToDate
                              ? moment(customToDate).format('DD MMMM YYYY')
                              : `-`}
                          </CText>
                        </TouchableOpacity>
                        {showToDatePicker ? (
                          <DateTimePicker
                            value={customToDate}
                            display={'default'}
                            mode={'date'}
                            onChange={(event, value) => {
                              setShowToDatePicker(!showToDatePicker);
                              // on cancel set date value to previous date
                              if (event?.type === 'dismissed') {
                                setCustomToDate(customToDate);
                                return;
                              }
                              setCustomToDate(value);
                            }}
                            minimumDate={customFromDate}
                          />
                        ) : null}
                      </View>
                    </View>
                  ) : null}
                </View>
              </View>
            )}
          </View>
        </CViewWithOrangTop>
      </CModal>

      {/* transactionHistory Modal */}
      <TransactionDetailModal
        show={showTransDetailModal}
        close={() => setShowTransDetailModal(!showTransDetailModal)}
        transactionData={transDetailData}
        handleReportBtnClick={() => handleReportBtnClick()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    borderColor: colors.grey,
    borderBottomWidth: 0.6,
    paddingVertical: 10,
  },
  // modalContentContainer: {
  //   width: Dimens.width,
  //   justifyContent: 'flex-end',
  //   padding: 18,
  //   borderTopRightRadius: 16,
  //   borderTopLeftRadius: 16,
  //   backgroundColor: colors.white,
  // },
  saveBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 24,
  },
  modalView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  amountContainer: {
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.lightgreen,
  },
  greyBorderContainer: {
    flexDirection: 'row',
    marginTop: 18,
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
