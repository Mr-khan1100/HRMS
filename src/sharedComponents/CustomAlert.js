import { generalConst } from '@constants/appConstant';
import { COLORS } from '@styles/theme';
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomAlert = ({ visible, title, message, onCancel, onConfirm }) => {
  return (
    <Modal visible={visible} animationType={generalConst.FADE} transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.alertContainer}>
          {title && <Text style={styles.alertTitle}>{title}</Text>}
          <Text style={styles.alertMessage}>{message}</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onCancel}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.okButton]} 
              onPress={onConfirm}
            >
              <Text style={styles.buttonText}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: '80%',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 5,
    width:'30%'
  },
  cancelButton: {
    backgroundColor: COLORS.grey,
  },
  okButton: {
    backgroundColor: COLORS.blue,
  },
  buttonText: {
    alignSelf:'center',
    color: COLORS.background,
    fontSize: 16,
  },
});

export default CustomAlert;
