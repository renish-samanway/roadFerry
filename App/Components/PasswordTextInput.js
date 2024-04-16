import React, {useState, memo} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {TextInput as Input} from 'react-native-paper';
import Colors from '../helper/Color';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

const PasswordTextInput = ({errorText, ...props}) => (
  <View style={styles.container}>
    <Input
      style={styles.input}
      selectionColor={Colors.primaryColor}
      underlineColor="transparent"
      mode="outlined"
      theme={{colors: {primary: Colors.primaryColor}}}
      {...props}
    />
    {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  input: {
    backgroundColor: Colors.surfaceColor,
  },
  error: {
    fontSize: RFPercentage(2),
    // fontFamily: 'Roboto-Regular',
    color: Colors.errorColor,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  icon: {
    position: 'absolute',
    top: 35,
    right: 10,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

export default memo(PasswordTextInput);
