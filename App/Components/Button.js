import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {Button as PaperButton} from 'react-native-paper';
import Colors from '../helper/Color';
import {RFPercentage} from 'react-native-responsive-fontsize';

const Button = ({mode, style, children, ...props}) => (
  <PaperButton
    style={[
      styles.button,
      mode === 'outlined' && {backgroundColor: Colors.surfaceColor},
      style,
    ]}
    labelStyle={styles.text}
    mode={mode}
    {...props}>
    {children}
  </PaperButton>
);

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
  },
  text: {
    fontSize: RFPercentage(3),
    lineHeight: 60,
  },
});

export default memo(Button);
