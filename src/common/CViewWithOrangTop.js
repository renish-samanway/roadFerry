import {View, Text} from 'react-native';
import React from 'react';
import {Dimens, colors} from '../helper/Utils';

export default function CViewWithOrangTop({children, isModal}) {
  return (
    <View style={[isModal ? {} : {flex: 1}]}>
      <View
        style={{
          width: Dimens.width,
          height: 45,
          backgroundColor: colors.primary,
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          zIndex: 9,
        }}
      />
      <View
        style={[
          isModal
            ? {
                paddingTop: 2,
                backgroundColor: colors.white,
                borderTopRightRadius: 30,
                borderTopLeftRadius: 30,
                marginTop: -42,
                zIndex: 99,
              }
            : {
                flex: 1,
                paddingTop: 2,
                backgroundColor: colors.white,
                borderTopRightRadius: 30,
                borderTopLeftRadius: 30,
                marginTop: -42,
                zIndex: 99,
              },
        ]}
      >
        {children}
      </View>
    </View>
  );
}
