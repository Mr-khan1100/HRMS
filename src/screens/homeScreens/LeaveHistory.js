import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import LeaveCard from '../../sharedComponents/LeaveCard';
import LeaveFilter from '../../sharedComponents/LeaveFilter';
import { parseISO } from 'date-fns';

const LeaveHistory = () => {
    const currentUser = useSelector(state => state.users.currentUser);
    const [filters, setFilters] = useState({});
    const leaves = currentUser?.leaveApplied || [];

    const filteredLeaves = leaves.filter(leave => {
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

  return (
    <View style={{ flex: 1 }}>
        <LeaveFilter onFilterChange={setFilters} />
        <FlatList
        data={filteredLeaves}
        contentContainerStyle={styles.container}
        ListHeaderComponent={<Text style={styles.title}>Leave History</Text>}
        ListEmptyComponent={
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No leave applications found</Text>
        </View>
        }
        renderItem={({ item }) => <LeaveCard leave={item} isManager={false} />}
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

export default LeaveHistory;