export const screenLabel = {
    HOME : 'Home',
    AUTH : 'Auth',
    SIGNINSCREEN : 'SignInScreen',
    PROFILE_SCREEN: 'ProfileScreen',
    LEAVE_HISTORY : 'LeaveHistory',
    APPLY_LEAVE : 'ApplyLeave',
    APPROVE_LEAVE : 'ApproveLeave',
    PROFILE: 'Profile',
    PROFILE_SCREEN_LABEL : 'User Profile',
    APPROVE_LEAVE_LABEL : 'Approve Leave',
    LEAVE_HISTORY_LABEL : 'Leave History',
    APPLY_LEAVE_LABEL: 'Apply Leave', 
};

export const labelConstants = {
    EMAIL : 'Email',
    PASSWORD : 'Password',
    SIGNIN :  'Sign In',
    LOGOUT : 'Logout',
    REASON : 'Reason',
    TYPE : 'Type',
    TO : 'To',
    FROM : 'From',
    STATUS : 'Status',
};

export const validationMessage = {
    INCORRECT_PASSWORD : 'Incorrect password',
    IVALID_EMAIL_FORMAT : 'Invalid email format',
    EMAIL_IS_REQUIRED : 'Email is required',
    EMAIL_START_WITH : 'Email must start with either User_ or Manager_',
    PASSWORD_IS_REQUIRED : 'Password is required',
    PASSWORD_MUST_BE : 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
    START_DATE_CANNOT_WEEKEND : 'Start date cannot be on a weekend',
    START_DATE_BEFORE_END_DATE : 'Start date must be before end date',
    END_DATE_IS_REQUIRED : 'End date is required',
    END_DATE_CANNOT_WEEKEND : 'End date cannot be on a weekend',
    END_DATE_AFTER_START_DATE : 'End date cannot be before start date',
    ONLY_ONE_WFH : 'WFH must be for a single day',
    WFH_APPLIED_THIS_MONTH : 'WFH already applied this month',
    SANDWHICH_RULE : 'Cannot bridge weekend (Friday to Monday)',
    REASON_IS_REQUIRED : 'Reason is required',
    LEAVE_TYPE_REQUIRED :  'Leave type is required',
    START_DATE_REQUIRED : 'Start Date is required',
    END_DATE_REQUIRED : 'End Date is required',
    ENTER_ALL_FIELDS : 'Fill all fields correctly to apply leave',
    INVALID_DATE : 'Invalid date',
    LEAVE_OVERLAP : 'This leave overlaps with an existing leave application',
    ERROR :'Error',
}

export const regex = {
    EMAIL : /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD : /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*["'+,.:;<>_`|~!@#?£\-$%^&*{}()\$%\^&\*\{}\()\-\]\\/[])(?=.{8,})/,
}


export const keyboardType = {
    EMAIL : 'email-address',
    DEFAULT : 'default',
}

export const placeholder = {
    ENTER_PASSWORD : 'Enter Password',
    ENTER_EMAIL : 'Enter Email',
    ENTER_REASON : 'state your reason',
    SELECT_LEAVE_TYPE : 'Select Leave Type',
    SELECT_END_DATE : 'select end date',
    SELECT_START_DATE : 'select start date',
    SELECT_STATUS : 'Select status',
}


export const generalConst = {
    MANAGER_ : 'manager_',
    USER_ : 'user_',
    WFH : 'WFH',
    PL : 'Personal Leave',
    SL : 'Sick Leave',
    ON_SITE : 'On Site',
    DATE : 'date',
    START : 'start',
    END :  'end',
    SUCCESS : 'Success',
    FAILED : 'Failed',
    MANAGER : 'manager',
    EMPLOYEE : 'employee',
    MALE : 'Male',
    APPROVED : 'approved',
    REJECTED : 'rejected',
    PENDING : 'pending',
    EMAIL : 'email',
    PASSWORD : 'password',
    FROM_DATE : 'fromDate',
    TO_DATE : 'toDate',
    STATUS : 'status',
    TYPE: 'type',
    FADE : 'fade',
    OK : 'OK',
    OK_PRESSED : 'OK Pressed',
    CANCEL : 'cancel',
}