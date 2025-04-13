import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import LeaveCard from '@sharedComponents/LeaveCard';
import { approveLeave, rejectLeave } from '@redux/slices/userSlice';
import LeaveFilter from '@sharedComponents/LeaveFilter';
import { parseISO } from 'date-fns';
import { COLORS } from '@styles/theme';
import { generalConst } from '@constants/appConstant';

const ApproveLeave = () => {
    const dispatch = useDispatch();
  const currentUser = useSelector(state => state.users.currentUser);
  const allUsers = useSelector(state => state.users.allUsers);
const [filters, setFilters] = useState({});
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
    
    let matchesDates = true;
    
    if (filters.fromDate && filters.toDate) {
      matchesDates = leaveStart >= filters.fromDate && 
                     leaveEnd <= filters.toDate;
    } else if (filters.fromDate) {
      matchesDates = leaveStart >= filters.fromDate;
    } else if (filters.toDate) {
      matchesDates = leaveEnd <= filters.toDate;
    }
    const matchesStatus = !filters.status || leave.status === filters.status;
    const matchesType = !filters.type || leave.type === filters.type;
  
    return matchesDates && matchesStatus && matchesType;

  });

  const handleApprove = (leaveId) => {
    dispatch(approveLeave({ leaveId, managerId: currentUser.id }));
  };

  const handleReject = (leaveId) => {
    dispatch(rejectLeave({ leaveId, managerId: currentUser.id }));
  };

  return (
    <View style={{ flex: 1 }}>
    <LeaveFilter onFilterChange={setFilters} />
    <FlatList
    data={filteredLeaves}
    contentContainerStyle={styles.container}
    ListHeaderComponent={<Text style={styles.title}>Leave Approval</Text>}
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
    />}
    keyExtractor={(item) => item.id}
    ItemSeparatorComponent={() => <View style={styles.separator} />}
  />
  </View>
  );
};


const styles = StyleSheet.create({
    container: {
      padding: 16,
      paddingBottom: 32,
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      color: COLORS.headerLabel,
      marginBottom: 20,
      textAlign: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.emptyText,
    },
    separator: {
        height: 16,
      },
});

export default ApproveLeave;