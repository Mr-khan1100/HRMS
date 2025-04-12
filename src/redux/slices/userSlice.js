

import { createSlice } from '@reduxjs/toolkit';
import { isWeekend, parseISO, eachDayOfInterval,} from 'date-fns';

const nonDeductibleTypes = ['WFH', 'On Site'];
const initialState = {
  currentUser: null,
  allUsers: []
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    signInUser: (state, action) => {
      const { email, password } = action.payload;
      const existingUser = state.allUsers.find(user => user.email === email);
      
      if (!existingUser) {
        const role = email.startsWith('Manager_') ? 'manager' : 'employee';
        const newUser = {
          id: Date.now().toString(),
          name: email.split('@')[0].replace('Manager_', '').replace('User_', ''),
          email,
          password,
          age: 25,
          totalLeaves: role === 'manager' ? 15 : 12,
          remainingLeaves: role === 'manager' ? 15 : 12,
          gender: 'Male',
          joinDate: new Date().toISOString(),
          role,
          logedIn: true,
          leaveApplied: []
        };
        state.allUsers.push(newUser);
        state.currentUser = newUser;
      } else {
        state.currentUser = existingUser;
      }
    },
    signOutUser: (state) => {
      state.currentUser = null;
    },
    applyForLeave: (state, action) => {
        const { leaveDetails } = action.payload;
        
        if (state.currentUser) {
          const newLeave = {
            id: Date.now().toString(),
            ...leaveDetails,
            ...(state.currentUser.role === 'manager' && {
              approvedBy: state.currentUser.id,
              approvalDate: new Date().toISOString()
            })
          };
          if (!nonDeductibleTypes.includes(newLeave.type)) {
            const start = parseISO(newLeave.startDate);
            const end = parseISO(newLeave.endDate);
            const allDays = eachDayOfInterval({ start, end });
            const weekdays = allDays.filter(d => !isWeekend(d)).length;
            
            state.currentUser.remainingLeaves = Math.max(
              0, 
              state.currentUser.remainingLeaves - weekdays
            );
        }
      
          state.currentUser.leaveApplied.push(newLeave);
        
          const userIndex = state.allUsers.findIndex(
            user => user.id === state.currentUser.id
          );
          if (userIndex !== -1) {
            state.allUsers[userIndex].leaveApplied.push(newLeave);
            state.allUsers[userIndex].remainingLeaves = state.currentUser.remainingLeaves;
          }
        }
    },
    approveLeave: (state, action) => {
        const { leaveId, managerId } = action.payload;
        
        state.allUsers.forEach(user => {
          if (user.role !== 'manager') {
            const leaveIndex = user.leaveApplied.findIndex(leave => leave.id === leaveId);
            if (leaveIndex !== -1) {
              const leave = user.leaveApplied[leaveIndex];
              leave.status = 'approved';
              leave.approvedBy = managerId;
              leave.approvalDate = new Date().toISOString();
            }
          }
        });
    },
    rejectLeave: (state, action) => {
        const { leaveId, managerId } = action.payload;
        state.allUsers.forEach(user => {
          if (user.role !== 'manager') {
            const leaveIndex = user.leaveApplied.findIndex(leave => leave.id === leaveId);
            if (leaveIndex !== -1) {
                const leave = user.leaveApplied[leaveIndex];

                if (!nonDeductibleTypes.includes(leave.type)) {
                    const start = parseISO(leave.startDate);
                    const end = parseISO(leave.endDate);
                    const allDays = eachDayOfInterval({ start, end });
                    const weekdays = allDays.filter(d => !isWeekend(d)).length;
                
                    user.remainingLeaves = Math.min(
                    user.totalLeaves, 
                    user.remainingLeaves + weekdays
                    );
                }
                leave.status = 'rejected';
                leave.rejectedBy = managerId;
                leave.rejectionDate = new Date().toISOString();
            }
        }
        });
    },
  }
});

export const { signInUser, signOutUser, applyForLeave, approveLeave, rejectLeave } = userSlice.actions;
export const selectCurrentUser = (state) => state.users.currentUser;
export const selectAllUsers = (state) => state.users.allUsers;
export default userSlice.reducer;