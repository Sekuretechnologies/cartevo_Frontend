import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { SettingsService } from "@/api/services/cartevo-api/settings";

interface ExchangeRate {
	id: string;
	from_currency: string;
	to_currency: string;
	rate: number;
	created_at: string;
	updated_at: string;
}

interface TransactionFee {
	id: string;
	transaction_category: string;
	transaction_type: string;
	type: string;
	value: number;
	currency: string;
	created_at: string;
	updated_at: string;
}

// Async thunks
export const fetchExchangeRates = createAsyncThunk(
	"settings/fetchExchangeRates",
	async (token: string, { rejectWithValue }) => {
		try {
			const response = await SettingsService.get_exchange_rates({
				token,
			});
			const data = await response.json();
			if (!response.ok) {
				throw new Error(
					data.message || "Failed to fetch exchange rates"
				);
			}
			return data.data;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	}
);

export const fetchTransactionFees = createAsyncThunk(
	"settings/fetchTransactionFees",
	async (token: string, { rejectWithValue }) => {
		try {
			const response = await SettingsService.get_transaction_fees({
				token,
			});
			const data = await response.json();
			if (!response.ok) {
				throw new Error(
					data.message || "Failed to fetch transaction fees"
				);
			}
			return data.data;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	}
);

const settingsSlice = createSlice({
	name: "settings",
	initialState: {
		version: 2,
		mode: "live",
		startDate: "2024-03-01",
		limitDate: "",
		exchangeRates: [] as ExchangeRate[],
		transactionFees: [] as TransactionFee[],
		loading: false,
		error: null as string | null,
	},
	reducers: {
		setMode: (state, action) => {
			console.log("STATE VERSION :: ", action.payload);
			state.mode = action.payload;
		},
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
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Exchange Rates
			.addCase(fetchExchangeRates.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchExchangeRates.fulfilled,
				(state, action: PayloadAction<ExchangeRate[]>) => {
					console.log("exchangeRates :: ", action.payload);
					state.loading = false;
					state.exchangeRates = action.payload;
				}
			)
			.addCase(fetchExchangeRates.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			// Transaction Fees
			.addCase(fetchTransactionFees.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchTransactionFees.fulfilled,
				(state, action: PayloadAction<TransactionFee[]>) => {
					console.log("transactionFees :: ", action.payload);
					state.loading = false;
					state.transactionFees = action.payload;
				}
			)
			.addCase(fetchTransactionFees.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export const { setMode, setVersion, setStartDate, setLimitDate, clearError } =
	settingsSlice.actions;

export default settingsSlice.reducer;

export const selectCurrentMode = (state: any) => state.settings.mode;
export const selectCurrentVersion = (state: any) => state.settings.version;
export const selectStartDate = (state: any) => state.settings.startDate;
export const selectLimitDate = (state: any) => state.settings.limitDate;
export const selectExchangeRates = (state: any) => state.settings.exchangeRates;
export const selectTransactionFees = (state: any) =>
	state.settings.transactionFees;
export const selectSettingsLoading = (state: any) => state.settings.loading;
export const selectSettingsError = (state: any) => state.settings.error;
