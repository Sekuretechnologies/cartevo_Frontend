import { createSlice, current } from "@reduxjs/toolkit";

const trxSlice = createSlice({
  name: 'nairapay',
  initialState: {
    trxAll: [],
    trxSuccess: [],
    trxPending: [],
    trxFailed: [],
    currentNairaPayment:null
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
      setCurrentNairaPayment: (state, action) => {
        state.currentNairaPayment = action.payload;
      },
  },
})

export const { 
  setTrxAll, 
  setTrxSuccess,
  setTrxPending,
  setTrxFailed,
  setCurrentNairaPayment
 } = trxSlice.actions

export default trxSlice.reducer

export const selectTrxAll = (state:any) => state.nairapay.trxAll;
export const selectTrxSuccess = (state:any) => state.nairapay.trxSuccess;
export const selectTrxPending = (state:any) => state.nairapay.trxPending;
export const selectTrxFailed = (state:any) => state.nairapay.trxFailed;
export const selectCurrentNairaPayment = (state:any) => state.nairapay.currentNairaPayment;

