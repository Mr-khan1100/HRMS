import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Animated, Easing, TouchableOpacity, Image, } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import LeaveCard from '@sharedComponents/LeaveCard';
import { approveDeleteLeave, approveLeave, rejectDeleteLeave, rejectLeave } from '@redux/slices/userSlice';
import LeaveFilter from '@sharedComponents/LeaveFilter';
import DropDownIcon from '@assets/images/DropDownIcon.png';
import { parseISO, startOfDay } from 'date-fns';
import { COLORS } from '@styles/theme';
import { generalConst, labelConstants, screenLabel } from '@constants/appConstant';
import { useFocusEffect } from '@react-navigation/native';
import { useConfirmationModal } from '../../contexts/ConfirmationModalContext';
import CustomHeader from '@sharedComponents/CustomHeader';


const ApproveLeave = ({navigation}) => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.users.currentUser);
    const allUsers = useSelector(state => state.users.allUsers);
    const [filters, setFilters] = useState({});
    const [isFilterVisible, setIsFilterVisible] = useState(false);
     const { showConfirmation } = useConfirmationModal();

    const animation = useState(new Animated.Value(0))[0];
    const rotation = useState(new Animated.Value(0))[0];

    useFocusEffect(
        useCallback(()=>{
            return( 
                setFilters({})
            )
        },[navigation])
    )

    const allLeaves = allUsers.flatMap(user =>{
        if (user.role === generalConst.MANAGER) return []; 
        return user.leaveApplied.map(leave => ({
            ...leave,
            employeeName: user.name,
            employeeEmail: user.email,
            employeeId: user.id
        }))
    });

    const filteredLeaves = allLeaves.filter(leave => {
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
        const matchesStatus = !filters?.status || leave.status === filters?.status;
        const matchesType = !filters?.type || leave.type === filters?.type;
        
        return matchesDates && matchesStatus && matchesType;
    
    });

    const handleApprove = async(leaveId) => {
        const confirmed = await showConfirmation(
            'Confirm Approval',
            `Are you sure you want to Approve this Request?`
        );
        if(confirmed){
            dispatch(approveLeave({ leaveId, managerId: currentUser.id }));
        }
    };

    const handleReject = async(leaveId) => {
        const confirmed = await showConfirmation(
            'Confirm Rejection',
            `Are you sure you want to Reject this Request?`
        );
        if(confirmed){
            dispatch(rejectLeave({ leaveId, managerId: currentUser.id }));
        }
    };

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

    const handleApproveDelete = async(leaveId, userId) => {
        const confirmed = await showConfirmation(
            'Confirm Approval',
            `Are you sure you want to Approve this Request?`
        );
        if(confirmed){
            dispatch(approveDeleteLeave({leaveId, userId }))
        }
    }

    const handleRejectDelete = async( leaveId, userId ) => {
        const confirmed = await showConfirmation(
            'Confirm Rejection',
            `Are you sure you want to Reject this Request?`
        );
        if(confirmed){
        dispatch(rejectDeleteLeave({leaveId, userId}))
        }
    }
  return (
    <>
    <CustomHeader title={screenLabel.APPROVE_LEAVE_LABEL} />
    <View style={{ flex: 1, backgroundColor:COLORS.background }}>
        <View style={styles.header}>
            {/* <Text style={styles.title}>{screenLabel.APPROVE_LEAVE_LABEL}</Text> */}
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
            renderItem={({ item }) => <LeaveCard 
                leave={item} 
                isManager={currentUser.role === generalConst.MANAGER} 
                onApprove={handleApprove}
                onReject={handleReject} 
                onApproveDelete={handleApproveDelete}
                onRejectDelete={handleRejectDelete}
            />}
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
    //   paddingBottom: 32,
        paddingBottom: 0,

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
    },
});

export default ApproveLeave;