import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import InputFields from './InputFields';
import TypeModal from './TypeModal';
import Calender from '../assets/images/date_input.png';
import DropDownIcon from '../assets/images/DropDownIcon.png';
import { format } from 'date-fns';
import { formatDate } from '../appHooks/appHook';

const LeaveFilter = ({ onFilterChange, initialFilters }) => {
  const [filters, setFilters] = useState(initialFilters || {});
  const [showFromDate, setShowFromDate] = useState(false);
  const [showToDate, setShowToDate] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showType, setShowType] = useState(false);

  const statusOptions = ['pending', 'approved', 'rejected'];
  const typeOptions = ['WFH', 'Personal Leave', 'Sick Leave', 'On Site'];

  const handleDateChange = (type, date) => {
    const newFilters = { ...filters, [type]: date };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSelect = (type, value) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters = {};
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <InputFields
          label="From"
          value={filters.fromDate ? formatDate(filters.fromDate) : ''}
          onIconPress={() => setShowFromDate(true)}
          iconSource={Calender}
          editable={false}
          placeholder="Select date"
          style={styles.filterInput}
        />

        <InputFields
          label="To"
          value={filters.toDate ? formatDate(filters.toDate) : ''}
          onIconPress={() => setShowToDate(true)}
          iconSource={Calender}
          editable={false}
          placeholder="Select date"
          style={styles.filterInput}
        />
      </View>

      <View style={styles.filterRow}>
        <InputFields
          label="Status"
          value={filters.status || ''}
          onIconPress={() => setShowStatus(true)}
          iconSource={DropDownIcon}
          editable={false}
          placeholder="Select status"
          style={styles.filterInput}
        />

        <InputFields
          label="Type"
          value={filters.type || ''}
          onIconPress={() => setShowType(true)}
          iconSource={DropDownIcon}
          editable={false}
          placeholder="Select type"
          style={styles.filterInput}
        />
      </View>

      <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
        <Text style={styles.clearText}>Clear Filters</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={showFromDate}
        mode="date"
        onConfirm={date => {
          handleDateChange('fromDate', date);
          setShowFromDate(false);
        }}
        onCancel={() => setShowFromDate(false)}
      />

      <DateTimePickerModal
        isVisible={showToDate}
        mode="date"
        onConfirm={date => {
          handleDateChange('toDate', date);
          setShowToDate(false);
        }}
        onCancel={() => setShowToDate(false)}
      />


      <TypeModal
        modalVisible={showStatus}
        setModalVisible={() => setShowStatus(false)}
        handleSelect={status =>{ handleSelect('status', status); setShowStatus(false) }}
        options={statusOptions}
        handleCancel = {() => setShowStatus(false)}
      />

      <TypeModal
            modalVisible = {showType}
            setModalVisible = {setShowType}
            handleSelect = {type =>{ handleSelect('type', type); setShowType(false)}}
            handleCancel = {() => setShowType(false)}
            options = {typeOptions}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    // backgroundColor: '#f5f5f5',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap:5,
  },
  filterInput: {
    width: '50%',
  },
  clearButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  clearText: {
    color: '#007AFF',
    fontSize: 14,
  },
});

export default LeaveFilter;