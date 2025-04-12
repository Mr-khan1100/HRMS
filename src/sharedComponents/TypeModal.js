import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';


// const LeaveTypes = ['WFH', 'Personal Leave', 'Sick Leave', 'On Site'];

const TypeModal = ({ modalVisible, setModalVisible, handleSelect, handleCancel, options}) => {


  return (
    <Modal
      transparent
      animationType={'fade'}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{'Select Leave Type'}</Text>
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
            <Text style={styles.closeText}>Cancel</Text>
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
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  option: {
    paddingVertical: 12,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#ff4757',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TypeModal;
