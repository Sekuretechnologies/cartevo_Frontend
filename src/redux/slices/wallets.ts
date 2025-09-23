import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CompanyWallet = {
  id: string;
  balance: number;
  currency: string;
  country?: string;
  country_iso_code?: string;
  created_at?: string;
};

interface WalletsState {
  companyWallets: CompanyWallet[];
}

const initialState: WalletsState = {
  companyWallets: [],
};

const walletsSlice = createSlice({
  name: "wallets",
  initialState,
  reducers: {
    setCompanyWallets: (state, action: PayloadAction<CompanyWallet[]>) => {
      state.companyWallets = action.payload || [];
    },
    clearCompanyWallets: (state) => {
      state.companyWallets = [];
    },
  },
});

export const { setCompanyWallets, clearCompanyWallets } = walletsSlice.actions;
export const selectCompanyWallets = (state: any) => state.wallets?.companyWallets || [];
export default walletsSlice.reducer;


