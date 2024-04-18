import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
} from 'react-native';

// Import the Plugins and Thirdparty library.
import {RFPercentage} from 'react-native-responsive-fontsize';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import AppPreference from '../../../helper/preference/AppPreference';
import firestore from '@react-native-firebase/firestore';
import Loader from '../../../components/design/Loader';
import moment from 'moment';

// Load the main class.

const NotificationScreen = (props) => {
  const [notificationList, setNotificationList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  let isUpdate = props.navigation.getParam('isUpdate');
  if (isUpdate == undefined || isUpdate == null) {
    isUpdate = false
  }
  console.log(`isUpdate:`, isUpdate)

  useEffect(() => {
    getNotificationList()
  }, [isUpdate]);

  const getNotificationList = () => {
    console.log(`getNotificationList`)
    setIsLoading(true)
    AsyncStorage.getItem(AppPreference.LOGIN_UID).then((userID) => {
      if (userID != null) {
        const tNotificationList = [];
        let unreadListCount = 0
        firestore()
        .collection('notification')
        .orderBy('created_at', 'desc')
        // .where('is_read', '==', false)
        .get()
        .then(querySnapshot => {
          setIsLoading(false)
          console.log('Total Notification:', querySnapshot.size);
          querySnapshot.forEach((documentSnapshot) => {
            if (documentSnapshot.data()['user_id'] == userID) {
              tNotificationList.push({id: documentSnapshot.id, data: documentSnapshot.data()})
              if (documentSnapshot.data()['is_read'] == false) {
                unreadListCount += 1
              }
            }
          })
          props.navigation.setParams({ notificationCount: unreadListCount, userID: userID })
          setNotificationList(tNotificationList)
        }).catch(error => {
          // setIsLoginUser(true)
          setIsLoading(false)
          console.error(error)
        });
      } else {
        setIsLoading(false)
      }
    });
  }

  const unreadNotification = (notificationData) => {
    console.log(`unreadNotification`)
    setIsLoading(true)
    firestore()
      .collection('notification')
      .doc(notificationData.id)
      .update({is_read: true})
      .then(() => {
        // setIsLoading(false)
        getNotificationList()
        openViewOnClickOfNotification(notificationData)
      })
      .catch(err => {
        console.log(`priority.Error:`, err)
        setIsLoading(false)
      })
  }

  const openViewOnClickOfNotification = (notificationData) => {
    console.log(`notificationData.data.type:`,notificationData.data)
    if(notificationData.data.orderId!=undefined && notificationData.data.orderId!='' && notificationData.data.orderId!=null){
    if (notificationData.data.type == "accept") {
      openOrderDetailsScreen(notificationData.data.orderId)
    } else if (notificationData.data.type == "unloaded") {
      openOrderDetailsScreen(notificationData.data.orderId)
    } else if (notificationData.data.type == "assign") {
      openOrderDetailsScreen(notificationData.data.orderId)
    } else if (notificationData.data.type == "transporter_reject") {
      openOrderDetailsScreen(notificationData.data.orderId)
    } else if (notificationData.data.type == "no_transporter_reject") {
      openOrderDetailsScreen(notificationData.data.orderId)
    }
    else if(notificationData.data.type == "started"){
      openOrderDetailsScreen(notificationData.data.orderId)
    }
    else if(notificationData.data.type == "on-way"){
      openOrderDetailsScreen(notificationData.data.orderId)
    }
    else if(notificationData.data.type == "unloading"){
      openOrderDetailsScreen(notificationData.data.orderId)
    }
    else if(notificationData.data.type == "dispute"){
      openOrderDetailsScreen(notificationData.data.orderId)
    }
  }
  }

  const openOrderDetailsScreen = (orderId) => {
    props.navigation.navigate({
      routeName: 'OrderDetailsScreen',
      params: {
        orderID: orderId
      }
    })
  }

  const renderNotificationData = (itemData) => {
    //console.log(`itemData.item.data.created_at.toDate():`, itemData.item.data.created_at.toDate())
    let a = moment(itemData.item.data.created_at.toDate())
    //console.log(`a:`, a)
    //console.log(`new Date():`, new Date())
    let b = moment(new Date())
    //console.log(`b:`, b)
    let seconds = b.diff(a, 'seconds')
    let minutes = b.diff(a, 'minutes')
    let hours = b.diff(a, 'hours')
    let days = b.diff(a, 'days')
    let years = b.diff(a, 'years')
    // console.log(`\nseconds:${seconds}\nminutes:${minutes}\nhours:${hours}\ndays:${days}\nyears:${years}`)
    let getTime = ''
    if (years > 0) {
      getTime = `${years} ${years <= 1 ? 'year' : 'years'}`
    } else if (days > 0) {
      getTime = `${days} ${days <= 1 ? 'day' : 'days'}`
    } else if (hours > 0) {
      getTime = `${hours} ${hours <= 1 ? 'hour' : 'hours'}`
    } else if (minutes > 0) {
      getTime = `${minutes} ${minutes <= 1 ? 'minute' : 'minutes'}`
    } else if (seconds > 0) {
      getTime = `${seconds} ${seconds <= 1 ? 'second' : 'seconds'}`
    }
    // console.log(`getTime:`, getTime)
    return (
      <TouchableOpacity 
        style={styles.notificationView}
        onPress={() => {
          if (!itemData.item.data.is_read) {
            unreadNotification(itemData.item)
          } else {
            openViewOnClickOfNotification(itemData.item)
          }
        }}>
        <View style={styles.itemRow}>
          <Text style={styles.titleText}>{itemData.item.data.title}</Text>
          {itemData.item.data.is_read == false ? <Image
            style={{ width: 16, height: 16 }}
            source={require('../../../assets/assets/dashboard/notification_unread.png')}
          /> : null}
        </View>
        <Text style={styles.subTitleText}>
          {itemData.item.data.text}
        </Text>
        <Text
          style={{
            ...styles.subTitleText,
            color: Colors.subTitleTextColor,
            marginBottom: 16,
          }}>
          {`${getTime} ago`}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={notificationList.length !== 0 ? styles.container : styles.containerCheck}>
      { notificationList.length === 0 ?
        <View style={{}}>
          <Image
            style={{width: 84, height: 84, alignSelf: 'center'}}
            source={require('../../../assets/assets/dashboard/no_notification.png')}
          />
          <Text style={{color: '#9DA4BB', marginTop: 12, fontSize: 20, fontWeight: 'bold'}}>
            No notification
          </Text>
        </View>
      : 
      <FlatList
        // style={{marginTop: 16, marginBottom: 16}}
        keyExtractor={(item, index) => item.id}
        data={notificationList}
        renderItem={renderNotificationData}
        showsVerticalScrollIndicator={false}
      /> }
      <Loader loading={isLoading} />
    </SafeAreaView>
  );
};

NotificationScreen.navigationOptions = (navigationData) => {
  let notificationCount = navigationData.navigation.getParam('notificationCount');
  let userID = navigationData.navigation.getParam('userID');
  if (notificationCount == undefined || notificationCount == null) {
    notificationCount = 0
  }

  if (userID == undefined || userID == null) {
    userID = 0
  }

  const unreadAllNotification = () => {
    console.log(`unreadAllNotification`)
    // return
    // setIsLoading(true)
    firestore()
      .collection('notification')
      .where('user_id', '==', userID)
      .get()
      .then((querySnapshot) => {
        // setIsLoading(false)
        querySnapshot.forEach((documentSnapshot) => {
          documentSnapshot.ref.update({is_read: true})
        })
        navigationData.navigation.setParams({ isUpdate: true })
      })
      .catch(err => {
        console.log(`priority.Error:`, err)
        setIsLoading(false)
      })
  }

  return {
    headerShown: true,
    headerTitle: 'Notifications',
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
            style={styles.menuImage}
            source={require('../../../assets/assets/Authentication/back.png')}
          />
        </TouchableOpacity>
      </View>
    ),
    headerRight: notificationCount == 0 ? null : (
      <View style={styles.viewHeaderLeft}>
        <TouchableOpacity
          onPress={() => {
            // console.log('Clicked');
            unreadAllNotification()
          }}>
          <Text
            style={{
              marginRight: 16,
              color: Colors.primaryColor,
              fontSize: RFPercentage(2),
              fontFamily: 'SofiaPro-Regular',
            }}>
            Read all
          </Text>
        </TouchableOpacity>
      </View>
    ),
  };
};

// Set the components styles.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: Colors.mainBackgroundColor,
  },
  containerCheck: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.mainBackgroundColor,
  },
  viewHeaderLeft: {
    paddingLeft: 16,
  },
  menuImage: {
    height: 30,
    width: 30,
  },
  notificationView: {
    margin: 16,
    marginBottom: 0,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 10,
  },
  titleText: {
    // margin: 16,
    // marginBottom: 0,
    color: Colors.titleTextColor,
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Bold',
  },
  subTitleText: {
    margin: 16,
    marginTop: 8,
    marginBottom: 0,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.6),
    color: Colors.titleTextColor,
  },
  itemRow: {
    margin: 16,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default NotificationScreen;
{
  /* <TextInput
          style={{height: 40}}
          label="Source"
          returnKeyType="next"
          value={source.value}
          onChangeText={(text) => setSource({value: text, error: ''})}
          error={!!source.error}
          errorText={source.error}
          autoCapitalize="none"
          autoCompleteType="name"
          textContentType="name"
          keyboardType="default"
          ref={(ref) => {
            this._sourceinput = ref;
          }}
          onSubmitEditing={() =>
            this._destinationinput && this._destinationinput.focus()
          }
        />
        <TextInput
          style={{height: 40}}
          label="Destination"
          returnKeyType="next"
          value={destination.value}
          onChangeText={(text) => setDestination({value: text, error: ''})}
          error={!!destination.error}
          errorText={destination.error}
          autoCapitalize="none"
          autoCompleteType="name"
          textContentType="name"
          keyboardType="default"
          ref={(ref) => {
            this._destinationinput = ref;
          }}
          onSubmitEditing={() => this._weightinput && this._weightinput.focus()}
        />
        <TextInput
          style={{height: 40}}
          label="Weight"
          returnKeyType="next"
          value={weight.value}
          onChangeText={(text) => setWeight({value: text, error: ''})}
          error={!!weight.error}
          errorText={weight.error}
          autoCapitalize="none"
          autoCompleteType="name"
          textContentType="name"
          keyboardType="default"
          ref={(ref) => {
            this._weightinput = ref;
          }}
          onSubmitEditing={() =>
            this._dimensioninput && this._dimensioninput.focus()
          }
        />
        <TextInput
          style={{height: 40}}
          label="Dimensions"
          returnKeyType="next"
          value={dimensions.value}
          onChangeText={(text) => setDimensions({value: text, error: ''})}
          error={!!dimensions.error}
          errorText={dimensions.error}
          autoCapitalize="none"
          autoCompleteType="name"
          textContentType="name"
          keyboardType="default"
          ref={(ref) => {
            this._dimensioninput = ref;
          }}
          // onSubmitEditing={() =>
          //   this._weightinput && this._weightinput.focus()
          // }
        /> */
}
