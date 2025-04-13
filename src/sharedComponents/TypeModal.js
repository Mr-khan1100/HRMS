import { generalConst, placeholder } from '@constants/appConstant';
import { COLORS } from '@styles/theme';
import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const TypeModal = ({ modalVisible, setModalVisible, handleSelect, handleCancel, options}) => {
  return (
    <Modal
      transparent
      animationType={generalConst.FADE}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{placeholder.SELECT_LEAVE_TYPE}</Text>
            {
                options.map((status, index) => (
                    <TouchableOpacity 
                    key={index} 
                    style={styles.option} 
                    onPress={() => handleSelect(status)}
                    >
                    <Text style={styles.optionText}>{status}</Text>
                    </TouchableOpacity>
                ))
            }

          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={handleCancel}
          >
            <Text style={styles.closeText}>{generalConst.CANCEL}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.headerLabel,
  },
  option: {
    paddingVertical: 12,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bottomBorder,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: COLORS.value,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: COLORS.maroon,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  closeText: {
    color: COLORS.background,
    fontWeight: 'bold',
  },
});

export default TypeModal;
