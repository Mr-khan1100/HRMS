import React from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import LeaveCard from '../../sharedComponents/LeaveCard';

const LeaveHistory = () => {
  const currentUser = useSelector(state => state.users.currentUser);
  const leaves = currentUser?.leaveApplied || [];

  return (
    <FlatList
    data={leaves}
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