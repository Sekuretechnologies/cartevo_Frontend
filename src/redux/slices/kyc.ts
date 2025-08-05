import { createSlice, current } from "@reduxjs/toolkit";

const kycSlice = createSlice({
  name: 'kyc',
  initialState: {
    kycAll: [],
    kycAccepted: [],
    kycOngoing: [],
    kycBlocked: [],
    kycNone: [],
  },
  reducers: {
      setKYCAll: (state, action) => {
          state.kycAll = action.payload;
      },
      setKYCAccepted: (state, action) => {
        state.kycAccepted = action.payload;
      },
      setKYCOngoing: (state, action) => {
        state.kycOngoing = action.payload;
      },
      setKYCBlocked: (state, action) => {
        state.kycBlocked = action.payload;
      },
      setKYCNone: (state, action) => {
        state.kycNone = action.payload;
      },
  },
})

export const { 
  setKYCAll, 
  setKYCAccepted,
  setKYCOngoing,
  setKYCBlocked,
  setKYCNone,
 } = kycSlice.actions

export default kycSlice.reducer

export const selectKYCAll = (state:any) => state.kyc.kycAll;
export const selectKYCAccepted = (state:any) => state.kyc.kycAccepted;
export const selectKYCOngoing = (state:any) => state.kyc.kycOngoing;
export const selectKYCBlocked = (state:any) => state.kyc.kycBlocked;
export const selectKYCNone = (state:any) => state.kyc.kycNone;

