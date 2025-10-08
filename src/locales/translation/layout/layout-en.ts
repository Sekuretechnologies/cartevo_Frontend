// English translations for layout
export const layoutTranslationsEn = {
	preProductionBanner: {
		title: "Welcome to Cartevo – Pre-production Mode",
		description:
			"You are testing the platform in a near-real environment, with security limits:",
		transactions: "Transactions",
		transactionsLimit: "restricted volume",
		cards: "Cards",
		cardsLimit: "reduced quota",
		currencies: "Currencies",
		currenciesLimit: "FCFA ⇄ USD conversion available 50000 FCFA.",
		unlockProduction: "To unlock full Production, verify your account.",
		goToProduction: "Go to production",
	},
	submittedInfoBanner: {
		title: "Information Submitted for Verification",
		description:
			"Your information has been successfully submitted for verification. It is currently being reviewed by our team.",
		patienceNote:
			"Thank you for your patience during this important step. Once your account is approved, you will gain full access to Production mode, enjoy all Cartevo features without limitation, and carry out your operations with full independence and security.",
	},
} as const;
