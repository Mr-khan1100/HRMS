import { parseISO} from 'date-fns';


const isSameMonth = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() && 
           date1.getMonth() === date2.getMonth();
};
  
export const hasExistingWFHThisMonth = (currentUser) => {
    if (!currentUser) return false;
    const currentDate = new Date();
    return currentUser.leaveApplied.some(leave => 
      leave.type === 'WFH' && 
      isSameMonth(parseISO(leave.startDate), currentDate)
    );
};

export const formatDate = date => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};
  