export interface PersonalInfo {
	fullName: string;
	email: string;
	phoneNumber: string;
	address: string;
	idDocument?: File | null;
}

export interface CompanyInfo {
	companyName: string;
	legalForm: string;
	country: string;
	companyAddress: string;
	registryNumber: string;
	taxId: string;
}

export interface SignupFormData {
	personalInfo: PersonalInfo;
	companyInfo: CompanyInfo;
	currentStep: number;
	isCompleted: boolean;
}

export type SignupStep = 1 | 2;
