import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import InputFields from './InputFields';
import TypeModal from './TypeModal';
import Calender from '@assets/images/date_input.png';
import DropDownIcon from '@assets/images/DropDownIcon.png';
import { formatDate, statusOptions, typeOptions } from '@appHooks/appHook';
import { COLORS } from '@styles/theme';
import { generalConst, labelConstants, placeholder } from '@constants/appConstant';

const LeaveFilter = ({ onFilterChange, style }) => {
  const [filters, setFilters] = useState({});
  const [showFromDate, setShowFromDate] = useState(false);
  const [showToDate, setShowToDate] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showType, setShowType] = useState(false);

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
    <View style={[styles.container, style]}>
      <View style={styles.filterRow}>
        <InputFields
          label={labelConstants.FROM}
          value={filters.fromDate ? formatDate(filters.fromDate) : ''}
          onIconPress={() => setShowFromDate(true)}
          iconSource={Calender}
          editable={false}
          placeholder={placeholder.SELECT_START_DATE}
          style={styles.filterInput}
        />

        <InputFields
          label={labelConstants.TO}
          value={filters.toDate ? formatDate(filters.toDate) : ''}
          onIconPress={() => setShowToDate(true)}
          iconSource={Calender}
          editable={false}
          placeholder={placeholder.SELECT_END_DATE}
          style={styles.filterInput}
        />
      </View>

      <View style={styles.filterRow}>
        <InputFields
          label={labelConstants.STATUS}
          value={filters.status || ''}
          onIconPress={() => setShowStatus(true)}
          iconSource={DropDownIcon}
          editable={false}
          placeholder={placeholder.SELECT_STATUS}
          style={styles.filterInput}
        />

        <InputFields
          label={labelConstants.TYPE}
          value={filters.type || ''}
          onIconPress={() => setShowType(true)}
          iconSource={DropDownIcon}
          editable={false}
          placeholder={placeholder.SELECT_LEAVE_TYPE}
          style={styles.filterInput}
        />
      </View>

      <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
        <Text style={styles.clearText}>Clear Filters</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={showFromDate}
        mode={generalConst.DATE}
        onConfirm={date => {
          handleDateChange(generalConst.FROM_DATE, date);
          setShowFromDate(false);
        }}
        onCancel={() => setShowFromDate(false)}
      />

      <DateTimePickerModal
        isVisible={showToDate}
        mode={generalConst.DATE}
        onConfirm={date => {
          handleDateChange(generalConst.TO_DATE, date);
          setShowToDate(false);
        }}
        onCancel={() => setShowToDate(false)}
      />


      <TypeModal
        modalVisible={showStatus}
        setModalVisible={() => setShowStatus(false)}
        handleSelect={status =>{ handleSelect(generalConst.STATUS, status); setShowStatus(false) }}
        options={statusOptions}
        handleCancel = {() => setShowStatus(false)}
      />

      <TypeModal
            modalVisible = {showType}
            setModalVisible = {setShowType}
            handleSelect = {type =>{ handleSelect(generalConst.TYPE, type); setShowType(false)}}
            handleCancel = {() => setShowType(false)}
            options = {typeOptions}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    // backgroundColor:COLORS.background,
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
    color: COLORS.blue,
    fontSize: 14,
  },
});

export default LeaveFilter;