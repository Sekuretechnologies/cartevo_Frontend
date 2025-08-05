import { createSlice, current } from "@reduxjs/toolkit";

const customerTicketSlice = createSlice({
  name: 'customerticket',
  initialState: {
    customerTicketAll: [],
    customerTicketSuccess: [],
    customerTicketPending: [],
    customerTicketFailed: [],
    customerTicketOngoing: [],   
    currentCustomerTicket:null,
    adminUsers:[]
  },
  reducers: {
      setCustomerTicketAll: (state, action) => {
          state.customerTicketAll = action.payload;
      },
      setCustomerTicketSuccess: (state, action) => {
        state.customerTicketSuccess = action.payload;
      },
      setCustomerTicketPending: (state, action) => {
        state.customerTicketPending = action.payload;
      },
      setCustomerTicketFailed: (state, action) => {
        state.customerTicketFailed = action.payload;
      },
      setCustomerTicketOngoing: (state, action) => {
        state.customerTicketOngoing = action.payload;
      },
      setCurrentCustomerTicket: (state, action) => {
        state.currentCustomerTicket = action.payload;
      },
      setAdminUsers: (state, action) => {
        state.adminUsers = action.payload;
      },
  },
})

export const { 
  setCustomerTicketAll, 
  setCustomerTicketSuccess,
  setCustomerTicketPending,
  setCustomerTicketFailed,
  setCustomerTicketOngoing,
  setCurrentCustomerTicket,
  setAdminUsers
 } = customerTicketSlice.actions

export default customerTicketSlice.reducer

export const selectCustomerTicketAll = (state:any) => state.customerticket.customerTicketAll;
export const selectCustomerTicketSuccess = (state:any) => state.customerticket.customerTicketSuccess;
export const selectCustomerTicketPending = (state:any) => state.customerticket.customerTicketPending;
export const selectCustomerTicketOngoing = (state:any) => state.customerticket.customerTicketOngoing;
export const selectCustomerTicketFailed = (state:any) => state.customerticket.customerTicketFailed;
export const selectCurrentCustomerTicket = (state:any) => state.customerticket.currentCustomerTicket;
export const selectAdminUsers = (state:any) => state.customerticket.adminUsers;

