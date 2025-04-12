import React from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import LeaveCard from '../../sharedComponents/LeaveCard';
import { approveLeave, rejectLeave } from '../../redux/slices/userSlice';

const ApproveLeave = () => {
    const dispatch = useDispatch();
  const currentUser = useSelector(state => state.users.currentUser);
  const allUsers = useSelector(state => state.users.allUsers);

  const allLeaves = allUsers.flatMap(user =>{
    if (user.role === 'manager') return []; 
   return user.leaveApplied.map(leave => ({
      ...leave,
      employeeName: user.name,
      employeeEmail: user.email,
      employeeId: user.id
    }))
});
//   const leaves = currentUser?.leaveApplied || [];

  const handleApprove = (leaveId) => {
    dispatch(approveLeave({ leaveId, managerId: currentUser.id }));
  };

  const handleReject = (leaveId) => {
    dispatch(rejectLeave({ leaveId, managerId: currentUser.id }));
  };

  return (
    <FlatList
    data={allLeaves}
    contentContainerStyle={styles.container}
    ListHeaderComponent={<Text style={styles.title}>Leave Approval</Text>}
    ListEmptyComponent={
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No leave applications found</Text>
      </View>
    }
    renderItem={({ item }) => <LeaveCard 
        leave={item} 
        isManager={currentUser.role === 'manager'} 
        onApprove={handleApprove}
        onReject={handleReject} 
    />}
    keyExtractor={(item) => item.id}
    ItemSeparatorComponent={() => <View style={styles.separator} />}
  />
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
      color: '#2d3436',
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
        color: '#636e72',
    },
    separator: {
        height: 16,
      },
});

export default ApproveLeave;