import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions
} from 'react-native';

// Import the Plugins and Thirdparty library.
import {RFPercentage} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import the JS file.
import Colors from '../../../helper/extensions/Colors';
import AppPreference from '../../../helper/preference/AppPreference';
import { NavigationActions, StackActions } from 'react-navigation';

const {height, width} = Dimensions.get('window');
const imageWidth = 963
const imageHeight = 864
const imageRatio = imageWidth / imageHeight
// Load the main class.

const resetLoginAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "auth" })]
});

const SliderScreen3 = (props) => {
  const onPressNext = () => {
    AsyncStorage.setItem(AppPreference.IS_SLIDER, '1');
    props.navigation.dispatch(resetLoginAction);
    /* props.navigation.navigate({
      routeName: 'LoginScreen',
    }); */
  };
  return (
    <View style={{flexGrow: 1, justifyContent: 'space-between'}}>
      <ScrollView style={styles.container}>
        <Image
          style={styles.sliderImage}
          source={require('../../../assets/assets/SliderScreen/slide3.png')}
        />
        <View style={styles.dotView}>
          <View style={styles.inActiveDotView} />
          <View style={styles.inActiveDotView} />
          <View style={styles.activeDotView} />
        </View>
        <Text style={styles.titleTextLabel}>Pickup delivery at your door</Text>
        <Text style={styles.subTitleTextLabel}>
          Our app can send you everywhere, even space. For only $2.99 per month
        </Text>
      </ScrollView>
      <TouchableOpacity style={styles.nextView} onPress={() => onPressNext()}>
        <Image
          style={styles.nextImage}
          source={require('../../../assets/assets/SliderScreen/next.png')}
        />
      </TouchableOpacity>
    </View>
  );
};

// Set the components styles.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  sliderImage: {
    margin: 16,
    marginTop: 64,
    marginLeft: 24,
    marginRight: 24,
    height: 'auto',
    width: width - 24 - 24,
    aspectRatio: imageRatio,
    resizeMode: 'contain',
  },
  dotView: {
    margin: 16,
    marginTop: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDotView: {
    marginLeft: 4,
    height: 5,
    width: 20,
    backgroundColor: Colors.activeDotColor,
    borderRadius: 5,
  },
  inActiveDotView: {
    margin: 4,
    marginRight: 0,
    height: 5,
    width: 5,
    backgroundColor: Colors.inActiveDotColor,
    borderRadius: 2.5,
  },
  titleTextLabel: {
    margin: 16,
    textAlign: 'center',
    color: Colors.titleTextColor,
    fontFamily: 'SofiaPro-Medium',
    fontSize: RFPercentage(4),
    // fontWeight: '500',
  },
  subTitleTextLabel: {
    margin: 16,
    marginTop: 0,
    textAlign: 'center',
    color: Colors.subTitleTextColor,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
  },
  nextView: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  nextImage: {
    height: 150,
    width: 150,
    resizeMode: 'contain',
  },
});

export default SliderScreen3;
