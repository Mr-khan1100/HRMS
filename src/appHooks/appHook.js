import { generalConst } from '@constants/appConstant';
import { differenceInDays, eachDayOfInterval, getDay, isWeekend, parseISO} from 'date-fns';
import { Alert } from 'react-native';

const isSameMonth = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() && 
           date1.getMonth() === date2.getMonth();
};
  
export const hasExistingWFHThisMonth = (currentUser) => {
    if (!currentUser) return false;
    const currentDate = new Date();
    return currentUser.leaveApplied.some(leave => 
      leave.type === generalConst.WFH && 
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
  
export const statusOptions = [generalConst.PENDING, generalConst.APPROVED, generalConst.REJECTED];
export const typeOptions = [generalConst.WFH, generalConst.PL, generalConst.SL, generalConst.ON_SITE];
export const nonDeductibleTypes = [generalConst.WFH, generalConst.ON_SITE];


export const Alerts = (header, message) =>{
    Alert.alert(
        header,  
        message,
        [
            { 
            text: generalConst.OK, 
            onPress: () => console.log(generalConst.OK_PRESSED),
            style: generalConst.CANCEL ,
            },
        ],
        { cancelable: true }
    );
};

export const calculateDays = (start, end) => {
    const isFridayToMonday = (
      getDay(start) === 5 &&
      getDay(end) === 1 &&
      differenceInDays(end, start) === 3
    );
    return isFridayToMonday ? 4 : eachDayOfInterval({ start, end }).filter(d => !isWeekend(d)).length;
};
