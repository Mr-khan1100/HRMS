

import { calculateDays, nonDeductibleTypes } from '@appHooks/appHook';
import { generalConst } from '@constants/appConstant';
import { createSlice } from '@reduxjs/toolkit';
import { parseISO } from 'date-fns';

const updateUserInState = (state, userId, updater) => {
    const updatedAllUsers = state.allUsers.map(user => 
      user.id === userId ? updater(user) : user
    );
  
    return {
      ...state,
      allUsers: updatedAllUsers,
      currentUser: state.currentUser?.id === userId 
        ? updater(state.currentUser)
        : state.currentUser
    };
};
  
const safelyParseISO = dateString => {
    try {
      return parseISO(dateString);
    } catch {
      return new Date();
    }
};

  
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
        const role = email.startsWith(generalConst.MANAGER_) ? generalConst.MANAGER : generalConst.EMPLOYEE;
        const newUser = {
          id: Date.now().toString(),
          name: email.split('@')[0].replace(generalConst.MANAGER_, '').replace(generalConst.USER_, ''),
          email,
          password,
          age: 25,
          totalLeaves: role === generalConst.MANAGER ? 15 : 12,
          remainingLeaves: role === generalConst.MANAGER ? 15 : 12,
          gender: generalConst.MALE,
          joinDate: new Date().toISOString(),
          role,
          logedIn: true,
          leaveApplied: []
        };
        return {
            ...state,
            allUsers: [...state.allUsers, newUser],
            currentUser: newUser
          };
      } else {
        return { ...state, currentUser: existingUser };
      }
    },
    signOutUser: (state) => ({
        ...state,
        currentUser: null
    }),
    applyForLeave: (state, action) => {
        const { leaveDetails } = action.payload;
        if (!state.currentUser) return state;

        const newLeave = {
            id: Date.now().toString(),
            ...leaveDetails,
            ...(state.currentUser.role === generalConst.MANAGER && {
              approvedBy: state.currentUser.id,
              approvalDate: new Date().toISOString()
            })
        };
        return updateUserInState(state, state.currentUser.id, user => {
            const updatedUser = { ...user };
            
            if (!nonDeductibleTypes.includes(newLeave.type)) {
              const start = safelyParseISO(newLeave.startDate);
              const end = safelyParseISO(newLeave.endDate);
              updatedUser.remainingLeaves -= calculateDays(start, end);
            }
    
            return {
              ...updatedUser,
              leaveApplied: [...updatedUser.leaveApplied, newLeave]
            };
        });
    },
    approveLeave: (state, action) => {
        const { leaveId, managerId } = action.payload;
        
        return {
          ...state,
          allUsers: state.allUsers.map(user => {
            if (user.role === generalConst.MANAGER) return user;
            
            const leaveIndex = user.leaveApplied.findIndex(leave => leave.id === leaveId);
            if (leaveIndex === -1) return user;
  
            const updatedLeaves = [...user.leaveApplied];
            updatedLeaves[leaveIndex] = {
              ...updatedLeaves[leaveIndex],
              status: generalConst.APPROVED,
              approvedBy: managerId,
              approvalDate: new Date().toISOString()
            };
  
            return {
              ...user,
              leaveApplied: updatedLeaves
            };
          })
        };
    },
    rejectLeave: (state, action) => {
        const { leaveId, managerId } = action.payload;
        
        return {
          ...state,
          allUsers: state.allUsers.map(user => {
            if (user.role === generalConst.MANAGER) return user;
            
            const leaveIndex = user.leaveApplied.findIndex(leave => leave.id === leaveId);
            if (leaveIndex === -1) return user;
  
            const leave = user.leaveApplied[leaveIndex];
            const updatedUser = { ...user };
  
            if (!nonDeductibleTypes.includes(leave.type)) {
              const start = safelyParseISO(leave.startDate);
              const end = safelyParseISO(leave.endDate);
              const daysToRevert = calculateDays(start, end);
              
              updatedUser.remainingLeaves = Math.min(
                updatedUser.totalLeaves,
                updatedUser.remainingLeaves + daysToRevert
              );
            }
  
            return {
              ...updatedUser,
              leaveApplied: updatedUser.leaveApplied.map((leave, idx) => 
                idx === leaveIndex ? {
                  ...leave,
                  status: generalConst.REJECTED,
                  rejectedBy: managerId,
                  rejectionDate: new Date().toISOString()
                } : leave
              )
            };
          })
        };
    },
    deleteLeave: (state, action) => {
        const { leaveId, userId } = action.payload;
        return updateUserInState(state, userId, user => {
          const leaveIndex = user.leaveApplied.findIndex(leave => leave.id === leaveId);
          if (leaveIndex === -1) return user;
  
          const leave = user.leaveApplied[leaveIndex];
          const updatedUser = { ...user };
  
          if (!nonDeductibleTypes.includes(leave.type)) {
            const start = safelyParseISO(leave.startDate);
            const end = safelyParseISO(leave.endDate);
            const daysToRevert = calculateDays(start, end);
            
            updatedUser.remainingLeaves = Math.min(
              updatedUser.totalLeaves,
              updatedUser.remainingLeaves + daysToRevert
            );
          }
  
          return {
            ...updatedUser,
            leaveApplied: updatedUser.leaveApplied.filter(
              (_, idx) => idx !== leaveIndex
            )
          };
        });
    },
    requestDeleteLeave: (state, action) => {
        const { leaveId, userId } = action.payload;
        return updateUserInState(state, userId, user => {
          const leaveIndex = user.leaveApplied.findIndex(leave => leave.id === leaveId);
          if (leaveIndex === -1) return user;
  
          const updatedLeaves = [...user.leaveApplied];
          updatedLeaves[leaveIndex] = {
            ...updatedLeaves[leaveIndex],
            deleteRequested: true,
            deleteStatus: generalConst.PENDING
          };
  
          return {
            ...user,
            leaveApplied: updatedLeaves
          };
        });
    },
    approveDeleteLeave: (state, action) => {
        const { leaveId, userId } = action.payload;
        return updateUserInState(state, userId, user => {
          const leaveIndex = user.leaveApplied.findIndex(leave => leave.id === leaveId);
          if (leaveIndex === -1) return user;
  
          const leave = user.leaveApplied[leaveIndex];
          const updatedUser = { ...user };
  
          if (!nonDeductibleTypes.includes(leave.type) && leave.status === generalConst.APPROVED) {
            const start = safelyParseISO(leave.startDate);
            const end = safelyParseISO(leave.endDate);
            const daysToRevert = calculateDays(start, end);
            
            updatedUser.remainingLeaves = Math.min(
              updatedUser.totalLeaves,
              updatedUser.remainingLeaves + daysToRevert
            );
          }
  
          return {
            ...updatedUser,
            leaveApplied: updatedUser.leaveApplied.filter(
              (_, idx) => idx !== leaveIndex
            )
          };
        });
    },
    rejectDeleteLeave: (state, action) => {
        const { leaveId, userId } = action.payload;
        return updateUserInState(state, userId, user => {
          const leaveIndex = user.leaveApplied.findIndex(leave => leave.id === leaveId);
          if (leaveIndex === -1) return user;
  
          const updatedLeaves = [...user.leaveApplied];
          updatedLeaves[leaveIndex] = {
            ...updatedLeaves[leaveIndex],
            deleteRequested: false,
            deleteStatus: generalConst.REJECTED
          };
  
          return {
            ...user,
            leaveApplied: updatedLeaves
          };
        });
    },
  }
});

export const { signInUser, signOutUser, applyForLeave, approveLeave, rejectLeave, deleteLeave, requestDeleteLeave, approveDeleteLeave, rejectDeleteLeave} = userSlice.actions;
export const selectCurrentUser = (state) => state.users.currentUser;
export const selectAllUsers = (state) => state.users.allUsers;
export default userSlice.reducer;