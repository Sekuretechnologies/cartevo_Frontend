import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		token: null,
		getSekureApiToken: null,
		user: null,
		user_email: null,
	},
	reducers: {
		setCredentials: (state, action) => {
			const { token, getSekureApiToken, user } = action.payload;
			state.token = token;
			state.getSekureApiToken = getSekureApiToken;
			state.user = user;
		},
		setCurrentUserEmail: (state, action) => {
			const { email } = action.payload;
			state.user_email = email;
		},
		logOut: (state) => {
			state.token = null;
			localStorage.removeItem("sktoken");
			window.sessionStorage.removeItem("previousUrl");
		},
	},
});

export const { setCredentials, setCurrentUserEmail, logOut } =
	authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: any) => state.auth.user;
export const selectCurrentUserEmail = (state: any) => state.auth.user_email;
export const selectCurrentToken = (state: any) => state.auth.token;
export const selectCurrentGetSekureApiToken = (state: any) =>
	state.auth.getSekureApiToken;
