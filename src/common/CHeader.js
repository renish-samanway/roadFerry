import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {Dimens, colors, images} from '../helper/Utils';

export default function CHeader({
  title,
  showRightIcon,
  rightIcon,
  handleLeftIconClick,
  handleRightIconClick,
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleLeftIconClick()}
      >
        <Image
          style={styles.leftIconImg}
          source={images.backIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text style={styles.titleTxt}>{title}</Text>
      </View>

      {showRightIcon ? (
        <TouchableOpacity
          activeOpacity={0.7}
          // style={{ alignSelf: 'flex-end'}}
          onPress={() => handleRightIconClick()}
        >
          <Image
            style={styles.rightIconImg}
            source={rightIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimens.width,
    height: 24,
    paddingHorizontal: 18,
    marginVertical: 18,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  leftIconImg: {
    width: 14,
    height: 14,
  },
  titleTxt: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
  },
  rightIconImg: {
    width: 24,
    height: 24,
  },
});
