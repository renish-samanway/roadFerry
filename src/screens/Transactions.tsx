import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Transactions = () => {
  const userName='tamesh Parmer!';
  var words = userName.split(" ");
var initialCharacter = userName.charAt(0);
var initialCharacterSubsequentWord = words[1].charAt(0);
  return (
    <View>
      <View style={{}}>
        <Text>
          {initialCharacter+initialCharacterSubsequentWord}
        </Text>
      </View>
    </View>
  )
}

export default Transactions;

const styles = StyleSheet.create({});