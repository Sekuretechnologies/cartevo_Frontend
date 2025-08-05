import { createSlice, current } from "@reduxjs/toolkit";
import { kycRejectReasons } from '@/constants/Index';
const kycSlice = createSlice({
  name: 'kyc_v2',
  initialState: {
    kycAll: [],
    kycAccepted: [],
    kycPending: [],
    kycDeclined: [],
    kycNone: [],
    kycWarningsList: kycRejectReasons,
  },
  reducers: {
      setKYCAll: (state, action) => {
          state.kycAll = action.payload;
      },
      setKYCAccepted: (state, action) => {
        state.kycAccepted = action.payload;
      },
      setKYCPending: (state, action) => {
        state.kycPending = action.payload;
      },
      setKYCDeclined: (state, action) => {
        state.kycDeclined = action.payload;
      },
      setKYCNone: (state, action) => {
        state.kycNone = action.payload;
      },
      setKYCWarningsList: (state, action) => {
        state.kycWarningsList = action.payload;
      },
  },
})

export const { 
  setKYCAll, 
  setKYCAccepted,
  setKYCPending,
  setKYCDeclined,
  setKYCNone,
  setKYCWarningsList
 } = kycSlice.actions

export default kycSlice.reducer

export const selectKYCAll = (state:any) => state.kyc_v2.kycAll;
export const selectKYCAccepted = (state:any) => state.kyc_v2.kycAccepted;
export const selectKYCPending = (state:any) => state.kyc_v2.kycPending;
export const selectKYCDeclined = (state:any) => state.kyc_v2.kycDeclined;
export const selectKYCNone = (state:any) => state.kyc_v2.kycNone;
export const selectKYCWarningsList = (state:any) => state.kyc_v2.kycWarningsList;

