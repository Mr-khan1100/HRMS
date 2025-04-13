import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet, Keyboard } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useDispatch, useSelector } from 'react-redux';
import { applyForLeave } from '@redux/slices/userSlice';
import { isWeekend, parseISO, differenceInDays, eachDayOfInterval, isBefore,isAfter , getDay, isSameDay, startOfDay} from 'date-fns';
import Calender from '@assets/images/date_input.png';
import DropDownIcon from '@assets/images/DropDownIcon.png'
import InputFields from '@sharedComponents/InputFields';
import { useFocusEffect } from '@react-navigation/native';
import TypeModal from '@sharedComponents/TypeModal';
import { Alerts, formatDate, hasExistingWFHThisMonth, typeOptions } from '@appHooks/appHook';
import { COLORS } from '@styles/theme';
import { generalConst, keyboardType, labelConstants, placeholder, screenLabel, validationMessage } from '@constants/appConstant';
import { BlueButton } from '@sharedComponents/BlueButton';

const ApplyLeave = ({navigation}) => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.users.currentUser);
    const [value, setValue] = useState({startDate:null, endDate:null, type:null, reason:null})
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
            return( 
                setError(null),
                setValue({startDate:null, endDate:null, type:null, reason:null})
            )
        },[navigation])
    )


    useEffect(() => {
        if(value.type){
            if (value.type === generalConst.WFH && value.startDate && value.endDate) {
                if (!isSameDay(value.startDate, value.endDate)) {
                  setValue(prev => ({...prev, endDate:value.startDate}))
                }
                
            }
            validateEndDate(value.startDate);
        }
      }, [value.type]);

    const validateNoOverlap = (start, end) => {
    const existingLeaves = currentUser?.leaveApplied?.filter(leave => 
        leave.status !== 'rejected'
    ) || [];
    
    return !existingLeaves.some(leave => {
        const existingStart = parseISO(leave.startDate);
        const existingEnd = parseISO(leave.endDate);

        const normalizedLeaveStart = startOfDay(existingStart);
        const normalizedLeaveEnd = startOfDay(existingEnd);
        const normalizedFrom = startOfDay(start);
        const normalizedTo = startOfDay(end);

        return normalizedFrom <= normalizedLeaveEnd && normalizedTo >= normalizedLeaveStart;
    });
    };


    const validateStartDate = (date) => {
        let errorMessage = null;
        
        console.log(isWeekend(date), generalConst.DATE)
        if (isWeekend(date)) {
            
          errorMessage = validationMessage.START_DATE_CANNOT_WEEKEND;
        }
        
        if (value.endDate && isAfter(date, value.endDate)) {
          errorMessage = validationMessage.START_DATE_BEFORE_END_DATE;
        }
      
        setError(prev => ({ ...prev, startDate: errorMessage }));
        return !errorMessage;
    };
    
    const validateEndDate = (date) => {
        let errorMessage = null;
        
        if (isWeekend(date)) {
            errorMessage = validationMessage.END_DATE_CANNOT_WEEKEND;
        } else if (value.startDate) {
          if (isBefore(date, value.startDate)) {
            
            errorMessage = validationMessage.END_DATE_AFTER_START_DATE;
          }
          else if (value.type === generalConst.WFH) {
            if (differenceInDays(date, value.startDate) !== 0) {
              errorMessage = validationMessage.ONLY_ONE_WFH;
            }
            if (hasExistingWFHThisMonth(currentUser)) {
              errorMessage = validationMessage.WFH_APPLIED_THIS_MONTH;
            }
          }
          
          else if (
            getDay(value.startDate) === 5 && 
            getDay(date) === 1 && 
            differenceInDays(date, value.startDate) === 3
          ) {
            errorMessage = validationMessage.SANDWHICH_RULE;
          }
  
          else {
            const allDays = eachDayOfInterval({ 
              start: value.startDate, 
              end: date 
            });
            const workingDays = allDays.filter(d => !isWeekend(d)).length;
            if (workingDays > remainingLeaves) {
              errorMessage = `Exceeds remaining ${remainingLeaves} ${
                remainingLeaves === 1 ? 'day' : 'days'
              }`;
            }
          }
        }
        setError(prev => ({ ...prev, endDate: errorMessage }));
        return !errorMessage;
      };

    const validateReason = () => {
        const errorMessage = !value?.reason?.trim() ? validationMessage.REASON_IS_REQUIRED : null;
        setError(prev => ({ ...prev, reason: errorMessage }));
        return !errorMessage;
    };

    const handleTypeSelect = (status) => {
        setValue(prev => ({...prev, type:status}))
        setTypeVisible(false);
    }

    const handleTypeCancel = () => {
        const errorMessage = !value.type?.trim() ? validationMessage.LEAVE_TYPE_REQUIRED : null;
        setError(prev => ({ ...prev, type: errorMessage }));
        setTypeVisible(false);
        return !errorMessage;

    }
    
    const handleDateConfirm = (Datetype, date) => {
        if (Datetype === generalConst.START) {
            setValue(prev => ({...prev, startDate:date, endDate:null}))
            if (value.type === generalConst.WFH) {
            
                setValue(prev => ({...prev, endDate:date}))

              }
            validateStartDate(date);
            setShowStartPicker(false)
        } else {
            const finalDate = value.type === generalConst.WFH ? value.startDate : date;
          
            setValue(prev => ({...prev, endDate:finalDate}))
            validateEndDate(finalDate);
            setShowEndPicker(false);
        }
    };

    const handleCancel = (Datetype) => {
        if (Datetype === generalConst.START) {
            if(!value.startDate){
                setError(prev => ({...prev, startDate: validationMessage.START_DATE_REQUIRED}));
            }
            setShowStartPicker(false)
        } else {
            if(!value.endDate){
                setError(prev => ({...prev, endDate: validationMessage.END_DATE_REQUIRED}));
            }
            setShowEndPicker(false);
        }
    };

    const validateForm = () => {
        const validations = [
          validateStartDate(value.startDate),
          validateEndDate(value.endDate),
          handleTypeCancel(),
          validateReason(),
        ];
        return validations.every(v => v);
    };

    
    const handleApply = () => {
        Keyboard.dismiss();
        if (validateForm()) {
            
            if (!validateNoOverlap(value?.startDate, value?.endDate)) {
            Alerts(validationMessage.ERROR, validationMessage.LEAVE_OVERLAP)
            return;
            }

            const isManager = currentUser?.role === generalConst.MANAGER;
            const leaveDetails = {
                startDate: value.startDate.toISOString(),
                endDate: value.endDate.toISOString(),
                reason : value.reason,
                type : value.type,
                status: isManager ? generalConst.APPROVED : generalConst.PENDING,
                appliedDate: new Date().toISOString()
            };
            if (isManager) {
            leaveDetails.approvedBy = currentUser.id;
            leaveDetails.approvalDate = new Date().toISOString();
            }
            dispatch(applyForLeave({leaveDetails}));
            setValue({startDate:null, endDate:null, type:null, reason:null})
            Alerts(generalConst.SUCCESS,  `Leave ${isManager ? 'Approved' : 'Applied'} Successfully`)
        }else{
            Alerts(generalConst.FAILED, validationMessage.ENTER_ALL_FIELDS)
        }
    };

  return (
    <View style={styles.container}>
        <Text style={styles.title}>{screenLabel.APPLY_LEAVE_LABEL}</Text>
        <Text style={styles.remainingTexr}>
            Remaining Leaves: {remainingLeaves}/{totalLeaves}
        </Text>

      <InputFields 
            label={labelConstants.FROM} 
            value={value.startDate ? formatDate(value.startDate) : null}
            onIconPress={() => {
                setError(prev => ({...prev, startDate: null}));
                setShowStartPicker(true);
              }}
            iconSource={Calender}
            editable={false}
            placeholder={placeholder.SELECT_START_DATE}
            error={error?.startDate}
        />

        <InputFields 
            label={labelConstants.TO} 
            value={value.endDate ? formatDate(value.endDate) : null} 
            onIconPress={() => {
                setError(prev => ({...prev, endDate: null}));
                setShowEndPicker(true);
              }}
            iconSource={Calender}
            editable={false}
            placeholder={placeholder.SELECT_END_DATE}
            error={error?.endDate}
        />

        <InputFields 
            label={labelConstants.TYPE} 
            value={value.type} 
            keyboardType={keyboardType.DEFAULT}
            onIconPress={() =>{
                setError(prev => ({...prev, type: null})); 
                setTypeVisible(true)
            }}
            iconSource={DropDownIcon}
            editable={false}
            placeholder={placeholder.SELECT_LEAVE_TYPE}
            error={error?.type}
        />

        <InputFields 
            label={labelConstants.REASON} 
            value={value.reason} 
            keyboardType={keyboardType.DEFAULT}
            onFocus={() => {setError(prev => ({...prev, reason: null}));}} 
            onBlur={validateReason}
            onChangeText={(text) => {setValue(prev => ({...prev, reason:text}))}}
            editable={true}
            maxLength={150}
            placeholder={placeholder.ENTER_REASON}
            error={error?.address}
        />
        <DateTimePickerModal
            isVisible={showStartPicker}
            mode={generalConst.DATE}
            minimumDate={today}
            maximumDate={endOfYear}
            onConfirm={date => handleDateConfirm(generalConst.START, date)}
            onCancel={() => handleCancel(generalConst.START)}
        />

        <DateTimePickerModal
            isVisible={showEndPicker}
            mode={generalConst.DATE}
            minimumDate={today}
            maximumDate={endOfYear}
            onConfirm={date => handleDateConfirm(generalConst.END, date)}
            onCancel={() => handleCancel(generalConst.END)}
        />

        <TypeModal
            modalVisible = {typeVisible}
            setModalVisible = {setTypeVisible}
            handleSelect = {handleTypeSelect}
            handleCancel = {handleTypeCancel}
            options = {typeOptions}
        />

        <BlueButton
            label={screenLabel.APPLY_LEAVE_LABEL}
            onPress={handleApply}
            disabled={!value.startDate || !value.endDate || !value.reason || !value.type}
        />
    </View>
  );
};

export default ApplyLeave;

const styles = StyleSheet.create({
    container:{
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: COLORS.headerLabel,
        marginBottom: 20,
        textAlign: 'center',
    },
    remainingTexr:{ 
        fontSize: 18,
        marginBottom: 20 
    },
});