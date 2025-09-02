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
	transaction_type: string;
	fee_type: string;
	fee_value: number;
	currency: string;
	created_at: string;
	updated_at: string;
}

interface SettingsState {
	exchangeRates: ExchangeRate[];
	transactionFees: TransactionFee[];
	loading: boolean;
	error: string | null;
}

const initialState: SettingsState = {
	exchangeRates: [],
	transactionFees: [],
	loading: false,
	error: null,
};

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
	initialState,
	reducers: {
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

export const { clearError } = settingsSlice.actions;
export default settingsSlice.reducer;
