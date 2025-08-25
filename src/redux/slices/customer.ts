import { createSlice, current } from "@reduxjs/toolkit";

const customerSlice = createSlice({
	name: "customer",
	initialState: {
		customerSearchTerm: "",
		currentCustomerDetails: null,
		currentCustomerTransactions: null,
		currentCustomerTransfers: null,
		currentCustomerCards: null,
	},
	reducers: {
		setCustomerSearchTerm: (state, action) => {
			state.customerSearchTerm = action.payload;
		},
		setCurrentCustomerDetails: (state, action) => {
			state.currentCustomerDetails = action.payload;
		},
		setCurrentCustomerTransactions: (state, action) => {
			state.currentCustomerTransactions = action.payload;
		},
		setCurrentCustomerTransfers: (state, action) => {
			state.currentCustomerTransfers = action.payload;
		},
		setCurrentCustomerCards: (state, action) => {
			state.currentCustomerCards = action.payload;
		},
	},
});

export const {
	setCustomerSearchTerm,
	setCurrentCustomerDetails,
	setCurrentCustomerTransactions,
	setCurrentCustomerTransfers,
	setCurrentCustomerCards,
} = customerSlice.actions;

export default customerSlice.reducer;

export const selectCustomerSearchTerm = (state: any) =>
	state.customer.customerSearchTerm;
export const selectCurrentCustomerDetails = (state: any) =>
	state.customer.currentCustomerDetails;
export const selectCurrentCustomerTransactions = (state: any) =>
	state.customer.currentCustomerTransactions;
export const selectCurrentCustomerTransfers = (state: any) =>
	state.customer.currentCustomerTransfers;
export const selectCurrentCustomerCards = (state: any) =>
	state.customer.currentCustomerCards;
