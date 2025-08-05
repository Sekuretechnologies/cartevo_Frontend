import { createSlice, current } from "@reduxjs/toolkit";

const trxSlice = createSlice({
  name: 'chinpay',
  initialState: {
    trxAll: [],
    trxSuccess: [],
    trxPending: [],
    trxFailed: [],
    currentChnPayment:null
  },
  reducers: {
      setTrxAll: (state, action) => {
          state.trxAll = action.payload;
      },
      setTrxSuccess: (state, action) => {
        state.trxSuccess = action.payload;
      },
      setTrxPending: (state, action) => {
        state.trxPending = action.payload;
      },
      setTrxFailed: (state, action) => {
        state.trxFailed = action.payload;
      },
      setCurrentChnPayment: (state, action) => {
        state.currentChnPayment = action.payload;
      },
  },
})

export const { 
  setTrxAll, 
  setTrxSuccess,
  setTrxPending,
  setTrxFailed,
  setCurrentChnPayment
 } = trxSlice.actions

export default trxSlice.reducer

export const selectTrxAll = (state:any) => state.chinpay.trxAll;
export const selectTrxSuccess = (state:any) => state.chinpay.trxSuccess;
export const selectTrxPending = (state:any) => state.chinpay.trxPending;
export const selectTrxFailed = (state:any) => state.chinpay.trxFailed;
export const selectCurrentChnPayment = (state:any) => state.chinpay.currentChnPayment;

