import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		token: null,
		company: null,
		user: null,
		user_email: null,
	},
	reducers: {
		setCredentials: (state, action) => {
			const { token, company, user } = action.payload;
			state.token = token;
			state.company = company;
			state.user = user;
		},
		setCurrentCompany: (state, action) => {
			const { company } = action.payload;
			state.company = company;
		},
		setCurrentUserEmail: (state, action) => {
			const { email } = action.payload;
			state.user_email = email;
		},
		logOut: (state) => {
			state.token = null;
			// localStorage.removeItem("sktoken");
			// window.sessionStorage.removeItem("previousUrl");
		},
	},
});

export const {
	setCredentials,
	setCurrentCompany,
	setCurrentUserEmail,
	logOut,
} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: any) => state.auth.user;
export const selectCurrentCompany = (state: any) => state.auth.company;
export const selectCurrentUserEmail = (state: any) => state.auth.user_email;
export const selectCurrentToken = (state: any) => state.auth.token;
export const selectCurrentGetSekureApiToken = (state: any) =>
	state.auth.getSekureApiToken;
