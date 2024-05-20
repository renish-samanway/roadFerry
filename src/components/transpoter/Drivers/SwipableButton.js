import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Text} from 'react-native';

// Import the Plugins and Thirdparty library.

// import PageControl from 'react-native-pagecontrol';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';

const SwipableButton = (props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.editViewContainer, {borderTopLeftRadius: 8, borderBottomLeftRadius: 8, borderTopRightRadius: props.isSelf ? 8 : 0, borderBottomRightRadius: props.isSelf ? 8 : 0}]}
        onPress={props.editButton}>
        <Image
          style={styles.deleteImage}
          source={require('../../../assets/assets/Transpoter/Drivers/ic_edit.png')}
        />
        <Text style={styles.titleText}>Edit</Text>
      </TouchableOpacity>
      {!props.isSelf ? <TouchableOpacity
        style={styles.deleteViewContainer}
        onPress={props.deleteButton}>
        <Image
          style={styles.deleteImage}
          source={require('../../../assets/assets/Transpoter/Drivers/ic_delete.png')}
        />
        <Text style={styles.titleText}>Delete</Text>
      </TouchableOpacity> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  editViewContainer: {
    marginLeft: 8,
    height: '100%',
    backgroundColor: Colors.editColor,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8
  },
  deleteViewContainer: {
    height: '100%',
    backgroundColor: Colors.rejectedColor,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8
  },
  deleteImage: {
    height: 30,
    width: 30,
  },
  titleText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'SofiaPro-Medium',
    color: Colors.surfaceColor,
  },
});

export default SwipableButton;
