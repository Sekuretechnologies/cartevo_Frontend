import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		token: null,
		company: null,
		user: null,
		user_email: null,
		user_password: null,
		temp_token: null,
	},
	reducers: {
		setTempToken: (state, action) => {
			state.temp_token = action.payload;
		},
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
		setCurrentPassword: (state, action) => {
			const { password } = action.payload;
			state.user_password = password;
		},
		logOut: (state) => {
			state.token = null;
			// localStorage.removeItem("sktoken");
			// window.sessionStorage.removeItem("previousUrl");
		},
	},
});

export const {
	setTempToken,
	setCredentials,
	setCurrentCompany,
	setCurrentUserEmail,
	setCurrentPassword,
	logOut,
} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: any) => state.auth.user;
export const selectCurrentCompany = (state: any) => state.auth.company;
export const selectCurrentUserEmail = (state: any) => state.auth.user_email;
export const selectCurrentToken = (state: any) => state.auth.token;
export const selectCurrentGetSekureApiToken = (state: any) =>
	state.auth.getSekureApiToken;
export const selectCurrentPassword = (state: any) => state.auth.user_password;
export const selectTempToken = (state: any) => state.auth.temp_token;
