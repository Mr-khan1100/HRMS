const useLeaveUtils = () => {
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
  
    const getStatusStyle = (status) => {
      switch(status.toLowerCase()) {
        case 'approved': return styles.approvedStatus;
        case 'pending': return styles.pendingStatus;
        case 'rejected': return styles.rejectedStatus;
        default: return styles.pendingStatus;
      }
    };
  
    return { formatDate, calculateDuration, getStatusStyle };
  };
  