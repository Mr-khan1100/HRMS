import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { format, parseISO, differenceInDays, eachDayOfInterval, isWeekend } from 'date-fns';
import { COLORS } from '@styles/theme';
import { generalConst, validationMessage } from '@constants/appConstant';


const LeaveCard = ({leave = [], onApprove, onReject, onDelete, isManager, onApproveDelete, onRejectDelete, isHistory=false }) => {
    
    const  [expand, setExpand] = useState(false)
    const getStatusStyle = (status) => {
        switch(status.toLowerCase()) {
          case generalConst.APPROVED: return styles.approvedStatus;
          case generalConst.PENDING: return styles.pendingStatus;
          case generalConst.REJECTED: return styles.rejectedStatus;
          default: return styles.pendingStatus;
        }
    };

    const formatDate = (dateString) => {
        try {
          return format(parseISO(dateString), 'dd MMM, yyyy');
        } catch {
          return validationMessage.INVALID_DATE;
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

    const handleExpansion = () => {
        setExpand(!expand);
    }
  return (
    <TouchableOpacity style={styles.container} activeOpacity={1}  onPress={handleExpansion}>
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
        { expand && 
        <>
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
        </>
        }

        <View style={styles.footer}>
        <Text style={styles.appliedDate}>
            Applied on {formatDate(leave.appliedDate)}
        </Text>
        {isManager && leave.status === generalConst.PENDING &&(
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

        {leave.status !== generalConst.REJECTED && isHistory &&(
            <TouchableOpacity 
            style={[
                styles.button, 
                (leave.deleteStatus === generalConst.REJECTED || leave.deleteStatus === generalConst.PENDING) 
                    ? styles.neutralButton 
                    : styles.rejectButton
            ]}
            onPress={() => onDelete(leave)}
            disabled={leave.deleteStatus === generalConst.REJECTED || leave.deleteStatus === generalConst.PENDING}
            >
            <Text style={styles.buttonText}>
                {leave.deleteStatus === generalConst.PENDING 
                ? 'Request Sent' 
                : leave.deleteStatus === generalConst.REJECTED 
                ? 'Request Rejected' 
                : 'Delete'}
            </Text>
            </TouchableOpacity>
        )}

        {leave.deleteRequested && isManager && leave.status !== generalConst.PENDING &&(
          <>
            <TouchableOpacity 
              style={[styles.button, styles.approveButton]}
              onPress={() => onApproveDelete(leave.id, leave.employeeId)}
            >
              <Text>Approve Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity 
               style={[styles.button, styles.rejectButton]}
              onPress={() => onRejectDelete(leave.id, leave.employeeId)}
            >
              <Text>Reject Delete</Text>
            </TouchableOpacity>
          </>
        )}

        </View>
    </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    // opacity:0.9,
    // paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.value,
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
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth:1,
    borderColor:COLORS.border,
  },
  employeeInfo: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bottomBorder,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.value,
  },
  employeeEmail: {
    fontSize: 12,
    color: COLORS.labelText,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bottomBorder,
    paddingBottom: 8,
  },
  dates: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.value,
  },
  statusBadge: {
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  statusText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  approvedStatus: {
    backgroundColor: COLORS.green,
  },
  pendingStatus: {
    backgroundColor: COLORS.yellow,
  },
  rejectedStatus: {
    backgroundColor: COLORS.maroon,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.labelText,
    width: '30%',
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.value,
    width: '70%',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.bottomBorder,
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
    backgroundColor: COLORS.green,
  },
  rejectButton: {
    backgroundColor: COLORS.maroon,
  },
  neutralButton: {
    backgroundColor: COLORS.grey,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LeaveCard
