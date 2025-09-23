// redux/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
	selectedUser: any | null;
}

const initialState: UserState = {
	selectedUser: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setSelectedUser: (state, action: PayloadAction<any>) => {
			state.selectedUser = action.payload;
		},
	},
});

export const { setSelectedUser } = userSlice.actions;
export default userSlice.reducer;
