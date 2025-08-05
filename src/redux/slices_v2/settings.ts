import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
	name: "settings",
	initialState: {
		version: 2,
		startDate: "2024-03-01",
		limitDate: "",
	},
	reducers: {
		setVersion: (state, action) => {
			console.log("STATE VERSION :: ", action.payload);
			state.version = action.payload;
		},
		setStartDate: (state, action) => {
			const day = new Date("2024-03-01");
			const selectedDate = new Date(action.payload);
			if (selectedDate != day) {
				const startDate = action.payload;
				state.startDate = startDate;
			}
		},
		setLimitDate: (state, action) => {
			const today = new Date();
			const selectedDate = new Date(action.payload);
			if (selectedDate != today) {
				const limitDate = action.payload;
				state.limitDate = limitDate;
			}
		},
	},
});

export const { setVersion, setStartDate, setLimitDate } = settingsSlice.actions;

export default settingsSlice.reducer;

export const selectCurrentVersion = (state: any) => state.settings.version;
export const selectStartDate = (state: any) => state.settings.startDate;
export const selectLimitDate = (state: any) => state.settings.limitDate;
