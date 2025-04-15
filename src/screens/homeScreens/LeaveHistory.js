import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Animated, Easing, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import LeaveCard from '@sharedComponents/LeaveCard';
import LeaveFilter from '@sharedComponents/LeaveFilter';
import DropDownIcon from '@assets/images/DropDownIcon.png';
import { parseISO, startOfDay } from 'date-fns';
import { COLORS } from '@styles/theme';
import { generalConst, screenLabel } from '@constants/appConstant';
import { approveDeleteLeave, deleteLeave, requestDeleteLeave } from '@redux/slices/userSlice';
import { Alerts } from '@appHooks/appHook';
import { useFocusEffect } from '@react-navigation/native';
import { useConfirmationModal } from '../../contexts/ConfirmationModalContext';
import CustomHeader from '@sharedComponents/CustomHeader';


const LeaveHistory = ({navigation}) => {
    const currentUser = useSelector(state => state.users.currentUser);
    const dispatch = useDispatch();
    const [filters, setFilters] = useState({});
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const animation = useState(new Animated.Value(0))[0];
    const rotation = useState(new Animated.Value(0))[0];
    const leaves = currentUser?.leaveApplied || [];
     const { showConfirmation } = useConfirmationModal();

    useFocusEffect(
        useCallback(()=>{
            return( 
                setFilters({})
            )
        },[navigation])
    )

    const filteredLeaves = leaves.filter(leave => {
        const leaveStart = parseISO(leave.startDate);
        const leaveEnd = parseISO(leave.endDate);
        const normalizedLeaveStart = startOfDay(leaveStart);
        const normalizedLeaveEnd = startOfDay(leaveEnd);
        const normalizedFrom = filters.fromDate ? startOfDay(filters.fromDate) : null;
        const normalizedTo = filters.toDate ? startOfDay(filters.toDate) : null;
        
        let matchesDates = true;

        if (normalizedFrom && normalizedTo) {
            matchesDates = normalizedLeaveStart >= normalizedFrom && 
                           normalizedLeaveEnd <= normalizedTo;
          } else if (normalizedFrom) {
            matchesDates = normalizedLeaveStart >= normalizedFrom;
          } else if (normalizedTo) {
            matchesDates = normalizedLeaveEnd <= normalizedTo;
          }
        const matchesStatus = !filters.status || leave.status === filters.status;
        const matchesType = !filters.type || leave.type === filters.type;
      
        return matchesDates && matchesStatus && matchesType;
    
    });

    const toggleFilter = () => {
        Animated.parallel([
            Animated.spring(animation, {
                toValue: isFilterVisible ? 0 : 1,
                useNativeDriver: true
            }),
            Animated.timing(rotation, {
                toValue: isFilterVisible ? 0 : 1,
                duration: 300,
                easing: Easing.linear,
                useNativeDriver: true
            })
        ]).start();
        setIsFilterVisible(!isFilterVisible);
    };

    const translateY  = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [-200, 0] 
    });

    const rotate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg']
    });

    const handleDelete = async(leave) => {
        // const confirmed = await showConfirmation(
        //     'Confirm Delete Leave',
        //     `Are you sure you want to Delete leave?`
        // );

        // if(confirmed){
            const leaveId = leave.id;
            const userId = currentUser.id
            const normalizedLeaveStart = startOfDay(parseISO(leave.startDate));
            const normalizedCurrentDate = startOfDay(new Date());
            // const currentDate = new Date().toISOString();
            if(leave.status === generalConst.PENDING){
                const confirmed = await showConfirmation(
                    'Confirm Delete Leave',
                    `Are you sure you want to Delete leave?`
                );
                if(confirmed){
                    dispatch(deleteLeave({leaveId, userId}));
                }
            }else if(leave.status === generalConst.APPROVED){
                if(normalizedLeaveStart < normalizedCurrentDate){
                    Alerts('Failed', 'Cannot make change leave already started.')
                    return;
                }
                const confirmed = await showConfirmation(
                    'Request Delete',
                    `Are you sure you want to Request Delete leave?`
                );
                if(confirmed){
                    if(currentUser.role === generalConst.MANAGER){
                        console.log('manager');
                        dispatch(approveDeleteLeave({leaveId, userId}))
                       
                    }else{
                        dispatch(requestDeleteLeave({leaveId, userId}))
                        console.log(leave, 'leave')
                    }
                }
            }
        // }
    };

  return (
    <>
    <CustomHeader title={screenLabel.LEAVE_HISTORY_LABEL}/>
    <View style={{ flex: 1, backgroundColor:COLORS.background }}>
        <View style={styles.header}>
            {/* <Text style={styles.title}>{screenLabel.LEAVE_HISTORY_LABEL}</Text> */}
            <TouchableOpacity onPress={toggleFilter}>
                <Animated.View style={{ transform: [{ rotate }] }}>
                    <Image source={DropDownIcon} style={styles.filterLogo}/>
                </Animated.View>
            </TouchableOpacity>
        </View>

        <Animated.View style={[styles.filterContainer, { 
                transform: [{ translateY }],
                opacity: animation,
                display: isFilterVisible ? 'flex' : 'none'
            }]}>
            <LeaveFilter onFilterChange={setFilters} />
        </Animated.View>

        <FlatList
        data={filteredLeaves}
        contentContainerStyle={styles.container}
        ListEmptyComponent={
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No leave applications found</Text>
        </View>
        }
        renderItem={({ item }) => <LeaveCard leave={item} isManager={false} onDelete={handleDelete} isHistory={true} />}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  </View>
  </>
  );
};


const styles = StyleSheet.create({
    container: {
    //   padding: 16,
      paddingBottom: 0,
    //   backgroundColor: COLORS.background
    },
    filterContainer: {
        position: 'absolute',
        top: '10%',
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: COLORS.offWhite,
        overflow: 'hidden',
    },
    header:{
        padding:10
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      color: COLORS.headerLabel,
      marginBottom: 20,
      textAlign: 'center',
    },
    emptyContainer: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop:'70%',
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.emptyText,
    },
    separator: {
        height: 16,
    },
    filterLogo:{
        alignSelf:'center',
        width:30, 
        height:30,
        // tintColor: COLORS.topBorder
    },
});

export default LeaveHistory;