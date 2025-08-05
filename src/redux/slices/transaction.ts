import { createSlice } from "@reduxjs/toolkit";

const transactionSlice = createSlice({
  name: 'transaction',
  initialState: {        
      period: 'hour',
  },
  reducers: {
      setPeriod: (state, action) => {
          const period = action.payload
          state.period = period;
      },
  },
})

export const { setPeriod } = transactionSlice.actions

export default transactionSlice.reducer

export const selectTransactionPeriod = (state:any) => state.transaction.period;

