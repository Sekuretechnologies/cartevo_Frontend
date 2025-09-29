// Traductions pour la page d'onboarding
export const onboardingTranslations = {
	// Titres et en-têtes
	pageTitle: "Cartevo | Onboarding",
	mainTitle: "Complete Your Onboarding",
	overallProgress: "Overall Progress",
	
	// Descriptions
	mainDescription: "Follow these steps to complete your account setup and start using Cartevo.",
	progressDescription: "Complete all steps to unlock full access to your Cartevo dashboard.",
	
	// Étapes d'onboarding
	steps: {
		profileCompletion: {
			name: "Profile Completion",
			description: "Complete your personal profile information"
		},
		businessInfo: {
			name: "Business Information", 
			description: "Complete your business details and KYB verification"
		}
	},

	// KYB Form
	kybForm: {
		sections: {
			businessInfoTitle: "Business Informations",
			businessDetailsTitle: "Business Details",
			requiredDocumentsTitle: "Required Documents",
		},
		labels: {
			business_phone_number: "Business Phone Number",
			business_address: "Business Address",
			tax_id_number: "Tax ID Number",
			business_website: "Business Website",
			business_description: "Business Description",
			source_of_funds: "Source of Funds",
			incorporation_certificate: "Incorporation Certificate",
			share_holding_document: "Share Holding Document",
			business_proof_of_address: "Business Proof of Address",
		},
		placeholders: {
			business_phone_number: "Enter business phone number",
			business_address: "Enter your business address",
			tax_id_number: "Enter tax ID number",
			business_website: "https://www.example.com",
			business_description:
				"Describe your business activities and services",
			select_source_of_funds: "Select Source of Funds",
		},
		buttons: {
			save: "Save",
		},
		toasts: {
			successCompanyInfoSaved:
				"Company information saved! Registration completed.",
			genericError:
				"An error occurred while saving company information.",
		},
	},
	
	// Statuts
	status: {
		completed: "Completed",
		inProgress: "In Progress", 
		pending: "Pending"
	},
	
	// Boutons d'action
	buttons: {
		review: "Review",
		continue: "Continue",
		start: "Start"
	},
	
	// Messages de vérification
	verification: {
		kyc: {
			pending: "Your KYC has been submitted and is under review. Please wait 24-72 hours for validation.",
			approved: "Your KYC is approved.",
			rejected: "Your KYC has been rejected.",
			none: "You haven't submitted your KYC yet.",
			unknown: "Your KYC status is unknown."
		},
		kyb: {
			pending: "Your KYB has been submitted and is under review. Please wait 24-72 hours for validation.",
			approved: "Your KYB is approved.",
			rejected: "Your KYB has been rejected.",
			none: "You haven't submitted your KYB yet.",
			unknown: "Your KYB status is unknown."
		},
		global: {
			allApproved: "All your verifications are approved.",
			oneOrMoreRejected: "One or more of your verifications have been rejected.",
			noneSubmitted: "You haven't submitted any verification yet.",
			stillPending: "Your verifications are still pending."
		}
	},
	
	// Liens d'action
	actionLinks: {
		resubmitInfo: "Click here to resubmit your information",
		startVerification: "Click here to start"
	},
	
	// Compteurs
	counters: {
		completed: "Completed",
		step: "Step"
	},
	
	// Messages d'erreur
	errors: {
		failedToGetSteps: "Failed to get onboarding steps.",
		failedToGetVerification: "Failed to get verification status."
	}
} as const;
