// ApplyLeaveScreen.js
import React, { useCallback, useState } from 'react';
import { View, Text, Button, TextInput, Alert } from 'react-native';
// import DatePicker from 'react-native-date-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useDispatch, useSelector } from 'react-redux';
import { applyForLeave } from '../../redux/slices/userSlice';
import { isWeekend, parseISO, differenceInDays, eachDayOfInterval, isBefore,isAfter , getDay} from 'date-fns';
import Calender from '../../assets/images/date_input.png';
import DropDownIcon from '../../assets/images/DropDownIcon.png'
import InputFields from '../../sharedComponents/InputFields';
import { useFocusEffect } from '@react-navigation/native';
import TypeModal from '../../sharedComponents/TypeModal';

const ApplyLeave = ({navigation}) => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.users.currentUser);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [type, setType] = useState(null);
    const [reason, setReason] = useState(null);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [typeVisible, setTypeVisible] = useState(false);
    const [error, setError] = useState({startDate:null, endDate:null, reason:null, type:null});
    const today = new Date();
    const endOfYear = new Date(today.getFullYear(), 11, 31);

    const totalLeaves = currentUser?.totalLeaves || 12;

    const remainingLeaves = currentUser?.remainingLeaves || 12;

    useFocusEffect(
        useCallback(()=>{
            return setError(null);
        },[navigation])
    )

    const formatDate = date => {
        if (!date) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const validateStartDate = (date) => {
        let errorMessage = null;
        
        console.log(isWeekend(date), 'date')
        if (isWeekend(date)) {
            
          errorMessage = 'Start date cannot be on a weekend';
        }
        
        if (endDate && isAfter(date, endDate)) {
          errorMessage = 'Start date must be before end date';
        }
      
        setError(prev => ({ ...prev, startDate: errorMessage }));
        return !errorMessage;
    };
    
    const validateEndDate = (date) => {
        let errorMessage = null;
        
        if (!date) {
          errorMessage = 'End date is required';
        }
        else if (isWeekend(date)) {
            errorMessage = 'End date cannot be on a weekend';
        } else if (startDate) {
            console.log('6');
          if (isBefore(date, startDate)) {
            console.log('1');
            
            errorMessage = 'End date cannot be before start date';
          }
          
          else if (
            getDay(startDate) === 5 && 
            getDay(date) === 1 && 
            differenceInDays(date, startDate) === 3
          ) {
            console.log('2');
            errorMessage = 'Cannot bridge weekend (Friday to Monday)';
          }
  
          else {
            const allDays = eachDayOfInterval({ 
              start: startDate, 
              end: date 
            });
            const workingDays = allDays.filter(d => !isWeekend(d)).length;
            console.log('3');
            if (workingDays > remainingLeaves) {
                console.log('4');
              errorMessage = `Exceeds remaining ${remainingLeaves} ${
                remainingLeaves === 1 ? 'day' : 'days'
              }`;
            }
          }
        }
        console.log('5');
        setError(prev => ({ ...prev, endDate: errorMessage }));
        return !errorMessage;
      };

    const validateReason = () => {
        const errorMessage = !reason.trim() ? 'Reason is required' : null;
        setError(prev => ({ ...prev, reason: errorMessage }));
        return !errorMessage;
    };

    const handleTypeSelect = (status) => {
        setType(status);
        setTypeVisible(false);
    }

    const handleTypeCancel = () => {
        const errorMessage = !type.trim() ? 'Leave type is required' : null;
        setError(prev => ({ ...prev, type: errorMessage }));
        setTypeVisible(false);
        return !errorMessage;

    }
    
    const handleDateConfirm = (type, date) => {
        if (type === 'start') {
            setEndDate(null);
            setStartDate(date);
            validateStartDate(date);
            setShowStartPicker(false)
        } else {
            setEndDate(date);
            validateEndDate(date);
            setShowEndPicker(false);
        }
    };

    const handleCancel = (type) => {
        if (type === 'start') {
            if(!startDate){
                setError(prev => ({...prev, startDate: 'Start Date is required'}));
            }
            setShowStartPicker(false)
        } else {
            if(!endDate){
                setError(prev => ({...prev, endDate: 'End Date is required'}));
            }
            setShowEndPicker(false);
        }
    };

    const validateForm = () => {
        const validations = [
          validateStartDate(startDate),
          validateEndDate(endDate),
          handleTypeCancel(),
          validateReason(),
        ];
        return validations.every(v => v);
    };

    
    const handleApply = () => {
        if (validateForm()) {
            const isManager = currentUser?.role === 'manager';
            const leaveDetails = {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                reason,
                type,
                status: isManager ? 'approved' : 'pending',
                appliedDate: new Date().toISOString()
            };
            if (isManager) {
            leaveDetails.approvedBy = currentUser.id;
            leaveDetails.approvalDate = new Date().toISOString();
            }
          dispatch(applyForLeave({leaveDetails}));
          setStartDate(null);
          setEndDate(null);
          setReason(null);
          setType(null)
          Alert.alert('Success', `Leave ${isManager ? 'Approved' : 'Applied'} Successfully`);
        }else{
            Alert.alert('Failed', 'Fill all fields correctly to apply leave');
        }
    };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Remaining Leaves: {remainingLeaves}/{totalLeaves}
      </Text>

      <InputFields 
            label={'From'} 
            value={startDate ? formatDate(startDate) : null}
            onIconPress={() => {
                setError(prev => ({...prev, startDate: null}));
                setShowStartPicker(true);
              }}
            iconSource={Calender}
            editable={false}
            placeholder={'select start date'}
            error={error?.startDate}
        />

        <InputFields 
            label={'To'} 
            value={endDate ? formatDate(endDate) : null} 
            onIconPress={() => {
                setError(prev => ({...prev, endDate: null}));
                setShowEndPicker(true);
              }}
            iconSource={Calender}
            editable={false}
            placeholder={'select end date'}
            error={error?.endDate}
        />

        <InputFields 
            label={'Type'} 
            value={type} 
            keyboardType={'default'}
            onIconPress={() =>{
                setError(prev => ({...prev, type: null})); 
                setTypeVisible(true)
            }}
            iconSource={DropDownIcon}
            editable={false}
            placeholder={'Select Leave Type'}
            error={error?.type}
        />

        <InputFields 
            label={'Reason'} 
            value={reason} 
            keyboardType={'default'}
            onFocus={() => {setError(prev => ({...prev, reason: null}));}} 
            onBlur={validateReason}
            onChangeText={(text) => {setReason(text)}}
            editable={true}
            maxLength={150}
            placeholder={'state your reason'}
            error={error?.address}
        />
        <DateTimePickerModal
            isVisible={showStartPicker}
            mode={'date'}
            minimumDate={today}
            maximumDate={endOfYear}
            onConfirm={date => handleDateConfirm('start', date)}
            onCancel={() => handleCancel('start')}
        />

        <DateTimePickerModal
            isVisible={showEndPicker}
            mode={'date'}
            minimumDate={today}
            maximumDate={endOfYear}
            onConfirm={date => handleDateConfirm('end', date)}
            onCancel={() => handleCancel('end')}
        />

        <TypeModal
            modalVisible = {typeVisible}
            setModalVisible = {setTypeVisible} 
            setType = {setType}
            handleSelect = {handleTypeSelect}
            handleCancel = {handleTypeCancel}
        />

        <Button
            title="Apply Leave"
            onPress={handleApply}
            disabled={!startDate || !endDate || !reason || !type}
        />
    </View>
  );
};

export default ApplyLeave;