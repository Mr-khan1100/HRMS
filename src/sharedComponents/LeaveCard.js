import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { format, parseISO, differenceInDays, eachDayOfInterval, isWeekend } from 'date-fns';


const LeaveCard = ({leave = [], onApprove, onReject, isManager }) => {
    const getStatusStyle = (status) => {
        switch(status.toLowerCase()) {
          case 'approved': return styles.approvedStatus;
          case 'pending': return styles.pendingStatus;
          case 'rejected': return styles.rejectedStatus;
          default: return styles.pendingStatus;
        }
    };

    const formatDate = (dateString) => {
        try {
          return format(parseISO(dateString), 'dd MMM, yyyy');
        } catch {
          return 'Invalid date';
        }
    };

    const calculateDuration = (start, end) => {
        const startDate = parseISO(start);
        const endDate = parseISO(end);
        const totalDays = differenceInDays(endDate, startDate) + 1;
        const weekdays = eachDayOfInterval({ start: startDate, end: endDate })
                          .filter(d => !isWeekend(d)).length;
        return { totalDays, weekdays };
    };

    const duration = calculateDuration(leave.startDate, leave.endDate);
  return (
    <View style={styles.card}>
        {isManager && (
        <View style={styles.employeeInfo}>
          <Text style={styles.employeeName}>{leave.employeeName}</Text>
          <Text style={styles.employeeEmail}>{leave.employeeEmail}</Text>
        </View>
      )}

        <View style={styles.header}>
        <Text style={styles.dates}>
            {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
        </Text>
        <View style={[styles.statusBadge, getStatusStyle(leave.status)]}>
            <Text style={styles.statusText}>{leave.status}</Text>
        </View>
        </View>

        <View style={styles.detailsRow}>
        <Text style={styles.detailLabel}>Duration:</Text>
        <Text style={styles.detailValue}>
            {duration.totalDays} days ({duration.weekdays} weekdays)
        </Text>
        </View>

        <View style={styles.detailsRow}>
        <Text style={styles.detailLabel}>Type:</Text>
        <Text style={styles.detailValue}>{leave.type}</Text>
        </View>

        <View style={styles.detailsRow}>
        <Text style={styles.detailLabel}>Reason:</Text>
        <Text style={styles.detailValue}>{leave.reason}</Text>
        </View>

        <View style={styles.footer}>
        <Text style={styles.appliedDate}>
            Applied on {formatDate(leave.appliedDate)}
        </Text>
        {isManager && leave.status === 'pending' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.button, styles.approveButton]}
              onPress={() => onApprove(leave.id)}
            >
              <Text style={styles.buttonText}>Approve</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.rejectButton]}
              onPress={() => onReject(leave.id)}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
        </View>
    </View>
  )
}

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
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  employeeInfo: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
  },
  employeeEmail: {
    fontSize: 12,
    color: '#636e72',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#dfe6e9',
    paddingBottom: 8,
  },
  dates: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2d3436',
  },
  statusBadge: {
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  approvedStatus: {
    backgroundColor: '#00b894',
  },
  pendingStatus: {
    backgroundColor: '#fdcb6e',
  },
  rejectedStatus: {
    backgroundColor: '#d63031',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#636e72',
    width: '30%',
  },
  detailValue: {
    fontSize: 14,
    color: '#2d3436',
    width: '70%',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#dfe6e9',
    paddingTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  approveButton: {
    backgroundColor: '#00b894',
  },
  rejectButton: {
    backgroundColor: '#d63031',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LeaveCard
