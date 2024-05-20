import {View, Text} from 'react-native';
import React from 'react';
import {colors} from '../helper/Utils';

export default function CText({
  children,
  font_Size,
  font_Weight,
  fontColor,
  extraStyle,
  ...props
}) {
  return (
    <Text
      style={{
        fontSize: font_Size ? font_Size : 12,
        fontWeight: font_Weight ? font_Weight : '500',
        color: fontColor ? fontColor : colors.black,
        ...extraStyle,
      }}
      {...props}
    >
      {children}
    </Text>
  );
}
