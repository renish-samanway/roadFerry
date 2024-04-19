import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Linking
} from 'react-native';

// Import the Plugins and Thirdparty library.
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

// Import the JS file.
import Colors from '../../../helper/extensions/Colors';

const ParcelOptionsData = (props) => {
  const {openDialer=false} = props;

  const onNumberPress=(value)=>{
    if(openDialer){
      Linking.openURL(`tel:+91${value}`)
    }
  }
  return (
    <View>
      <Text style={styles.subTitleText}>{props.optionTitle}</Text>
      <TouchableOpacity disabled={!openDialer} onPress={()=>onNumberPress(props.optionTitleValue)}>
      <Text style={openDialer?styles.boldText:styles.titleText}>{props.optionTitleValue}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  titleText: {
    color: Colors.titleTextColor,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Regular',
  },
  subTitleText: {
    marginTop: 16,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    color: Colors.otherTextColor,
  },
  boldText:{
    color: Colors.titleTextColor,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Regular',
    fontWeight:'bold',
    textDecorationLine:'underline'
  }
});

export default ParcelOptionsData;
