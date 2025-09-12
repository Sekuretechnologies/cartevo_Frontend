import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Company {
	id: string;
	name: string;
	country: string;
}

interface CompanyState {
	compagnies: Company[];
}

const initialState: CompanyState = {
	compagnies: [],
};

const companySlice = createSlice({
	name: "company",
	initialState,
	reducers: {
		setCompagnies(state, action: PayloadAction<Company[]>) {
			state.compagnies = action.payload;
		},
		clearCompanies(state) {
			state.compagnies = [];
		},
	},
});

export const { setCompagnies, clearCompanies } = companySlice.actions;

export default companySlice.reducer;
