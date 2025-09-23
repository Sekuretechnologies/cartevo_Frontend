import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

import authRedux from "./slices/auth";
import signupRedux from "./slices/signup";
import transactionRedux from "./slices/transaction";
import customerRedux from "./slices/customer";
import cardRedux from "./slices/card";
import kycRedux from "./slices/kyc";
import searchRedux from "./slices/search";
/** ------------------------------------ */
import kycV2Redux from "./slices_v2/kyc";
import chinpayRedux from "./slices_v2/chinpay";
import nairapayRedux from "./slices_v2/nairapay";
import settingsRedux from "./slices_v2/settings";
import customerticketRedux from "./slices_v2/customerticket";
import companyReducer from "./slices/companySlice";
import selectedCompanyReducer from "./slices/selectedCompany";
import walletsReducer from "./slices/wallets";

const createNoopStorage = () => {
	return {
		getItem(_key: any) {
			return Promise.resolve(null);
		},
		setItem(_key: any, value: any) {
			return Promise.resolve(value);
		},
		removeItem(_key: any) {
			return Promise.resolve();
		},
	};
};

// const storage = typeof window === "undefined" ? createNoopStorage() : createWebStorage();
const storage =
	typeof window === "undefined"
		? createNoopStorage()
		: createWebStorage("session"); //"local" // "session"

const persistConfig = {
	key: "root",
	version: 1,
	storage,
	blacklist: [
		"transaction",
		"customer",
		"card",
		"kyc",
		"kyc_v2",
		"search",
		"chinpay",
		"nairapay",
		"customerticket",
	],
};

const rootReducer = combineReducers({
	auth: authRedux,
	signup: signupRedux,
	transaction: transactionRedux,
	search: searchRedux,
	customer: customerRedux,
	card: cardRedux,
	kyc: kycRedux,
	kyc_v2: kycV2Redux,
	settings: settingsRedux,
	chinpay: chinpayRedux,
	nairapay: nairapayRedux,
	customerticket: customerticketRedux,
	company: companyReducer,
	selectedCompany: selectedCompanyReducer,
	wallets: walletsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					FLUSH,
					REHYDRATE,
					PAUSE,
					PERSIST,
					PURGE,
					REGISTER,
				],
			},
		}),
});

export let persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// export function useStores(initialState) {
//   const store = initializeStore(initialState);
//   return store;
// }
