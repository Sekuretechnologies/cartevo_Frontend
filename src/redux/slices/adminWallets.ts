import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AdminWalletItem {
  id: string;
  is_active?: boolean;
  active?: boolean;
  balance?: number | string;
  payin_balance?: number | string;
  payout_balance?: number | string;
  [key: string]: any;
}

interface AdminWalletsState {
  items: AdminWalletItem[];
  filters: { companyId?: string; currency?: string; countryIsoCode?: string };
  isLoading: boolean;
  isSaving: boolean;
  isToggling: boolean;
}

const initialState: AdminWalletsState = {
  items: [],
  filters: {},
  isLoading: false,
  isSaving: false,
  isToggling: false,
};

const adminWalletsSlice = createSlice({
  name: "adminWallets",
  initialState,
  reducers: {
    setWallets(state, action: PayloadAction<AdminWalletItem[]>) {
      state.items = action.payload || [];
    },
    setFilters(state, action: PayloadAction<AdminWalletsState["filters"]>) {
      state.filters = action.payload || {};
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setSaving(state, action: PayloadAction<boolean>) {
      state.isSaving = action.payload;
    },
    setToggling(state, action: PayloadAction<boolean>) {
      state.isToggling = action.payload;
    },
    updateWalletLocally(state, action: PayloadAction<AdminWalletItem>) {
      const idx = state.items.findIndex((w) => w.id === action.payload.id);
      if (idx >= 0) {
        state.items[idx] = { ...state.items[idx], ...action.payload };
      }
    },
    reset(state) {
      state.items = [];
      state.filters = {};
      state.isLoading = false;
      state.isSaving = false;
      state.isToggling = false;
    },
  },
});

export const {
  setWallets,
  setFilters,
  setLoading,
  setSaving,
  setToggling,
  updateWalletLocally,
  reset,
} = adminWalletsSlice.actions;

export default adminWalletsSlice.reducer;



