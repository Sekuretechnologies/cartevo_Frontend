import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectedCompanyState {
	company: any | null;
}

const initialState: SelectedCompanyState = {
	company: null,
};

export const selectedCompanySlice = createSlice({
	name: "selectedCompany",
	initialState,
	reducers: {
		setSelectedCompany: (state, action: PayloadAction<any>) => {
			state.company = action.payload;
		},
		clearSelecteCompany: (state) => {
			state.company = null;
		},
	},
});

export const { setSelectedCompany, clearSelecteCompany } =
	selectedCompanySlice.actions;

export default selectedCompanySlice.reducer;
