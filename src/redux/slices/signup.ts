import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
	SignupFormData,
	PersonalInfo,
	CompanyInfo,
	SignupStep,
} from "@/types/signup";

const initialState: SignupFormData = {
	personalInfo: {
		fullName: "",
		email: "",
		phoneNumber: "",
		address: "",
		idDocument: null,
	},
	companyInfo: {
		companyName: "",
		legalForm: "",
		country: "",
		companyAddress: "",
		registryNumber: "",
		taxId: "",
	},
	currentStep: 1,
	isCompleted: false,
};

const signupSlice = createSlice({
	name: "signup",
	initialState,
	reducers: {
		updatePersonalInfo: (
			state,
			action: PayloadAction<Partial<PersonalInfo>>
		) => {
			state.personalInfo = { ...state.personalInfo, ...action.payload };
		},
		updateCompanyInfo: (
			state,
			action: PayloadAction<Partial<CompanyInfo>>
		) => {
			state.companyInfo = { ...state.companyInfo, ...action.payload };
		},
		setCurrentStep: (state, action: PayloadAction<number>) => {
			state.currentStep = action.payload;
		},
		nextStep: (state) => {
			if (state.currentStep < 2) {
				state.currentStep = state.currentStep + 1;
			}
		},
		previousStep: (state) => {
			if (state.currentStep > 1) {
				state.currentStep = state.currentStep - 1;
			}
		},
		completeSignup: (state) => {
			state.isCompleted = true;
		},
		resetForm: () => initialState,
	},
});

export const {
	updatePersonalInfo,
	updateCompanyInfo,
	setCurrentStep,
	nextStep,
	previousStep,
	completeSignup,
	resetForm,
} = signupSlice.actions;

export default signupSlice.reducer;

export const selectCurrentStep = (state: any) => state.signup.currentStep;
export const selectIsCompleted = (state: any) => state.signup.isCompleted;
