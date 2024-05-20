import {Modal, TouchableOpacity, StyleSheet, View} from 'react-native';
import React from 'react';
import {Dimens} from '../helper/Utils';

const CModal = ({navigation, children, show, close}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onRequestClose={() => close()}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={styles.modalView}
        //   onPress={() => close()}
      >
        {children}
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    width: Dimens.width,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
});

export default CModal;
