export const cardsTranslations = {
	pageTitle: "Cartevo | Cards",
	mainTitle: "Cards",
	
	// Labels and headers
	labels: {
		status: {
			active: "Active",
			inactive: "Inactive",
			success: "Success",
			failed: "Failed",
			pending: "Pending",
			cancelled: "Cancelled",
		},
	},
	
	// Actions
	actions: {
		createCard: "Create Card",
		details: "Details",
	},
	
	// Table headers
	table: {
		serial: "#",
		type: "Type",
		number: "Number",
		name: "Name",
		balance: "Balance (USD)",
		status: "Status",
		date: "Date",
		actions: "Actions",
	},
	
	// Messages
	messages: {
		failedToGetCards: "Failed to get cards.",
		noCardsFound: "No cards found",
	},
	
	// Loading
	loading: {
		loadingSpinner: "Loading...",
	},
	
	// Card Details Page
	details: {
		pageTitle: "Cartevo | Card details",
		mainTitle: "Card details",
		failedToGetCard: "Failed to get card",
		failedToGetCardTransactions: "Failed to get card transactions",
		
		// Card Information Labels
		labels: {
			brand: "Brand",
			cvv: "CVV",
			masked_number: "Number",
			name: "Name",
			status: "Status",
			created_at: "Issuing Date",
			balance: "Balance",
		},
		
		// Card Actions
		actions: {
			fund: "Fund",
			withdraw: "Withdraw",
			freeze: "Freeze",
			unfreeze: "Unfreeze",
			details: "Details",
		},
		
		// Card Status
		status: {
			active: "ACTIVE",
			terminated: "TERMINATED",
			frozen: "FROZEN",
			suspended: "Suspended",
		},
		
		// Transactions Section
		transactions: {
			title: "Card transactions",
			noTransactions: "No transactions found",
		},
		
		// Toast Messages
		messages: {
			authRequired: "Authentication required",
			cardFundedSuccess: "Card funded successfully",
			cardFundFailed: "Failed to fund card",
			withdrawalSuccess: "Withdrawal successful",
			withdrawalFailed: "Failed to withdraw from card",
			cardFrozenSuccess: "Card frozen successfully",
			cardFreezeFailed: "Failed to freeze card",
			cardUnfrozenSuccess: "Card unfrozen successfully",
			cardUnfreezeFailed: "Failed to unfreeze card",
		},
	},
	
	// Modals
	modals: {
		createCard: {
			title: "Add New Card",
			customer: "Customer",
			customerRequired: "Please select a customer",
			customerPlaceholder: "Type to search by name or email",
			loadingCustomers: "Loading customers...",
			noCustomersFound: "No customers found",
			cardholderName: "Cardholder Name",
			cardholderNameRequired: "Cardholder name is required",
			cardholderNamePlaceholder: "Enter cardholder name",
			cardBrand: "Card Brand",
			selectBrand: "Select brand",
			initialBalance: "Initial Balance (USD)",
			initialBalanceRequired: "Please enter a valid amount",
			initialBalanceMin: "Amount must be at least 1",
			initialBalancePlaceholder: "0.00",
			creating: "Creating...",
			createCard: "Create Card",
			cancel: "Cancel",
			cardCreatedSuccess: "Card created successfully",
			cardCreationInitiated: "Card creation initiated",
			cardCreationFailed: "Failed to create card",
		},
		
		// Transaction Details Modal
		transactionDetails: {
			title: "Transaction Details",
			
			// Field Labels
			labels: {
				type: "Type",
				date: "Date",
				time: "Time",
				status: "Status",
				name: "Name",
				maskedNumber: "Masked number",
				transactionId: "Transaction ID",
				merchantName: "Merchant (name)",
				merchantCountry: "Merchant (country)",
				merchantCity: "Merchant (city)",
				amount: "Amount (USD)",
				fee: "Fee",
				description: "Description",
			},
			
			// Status Values
			statusValues: {
				success: "Success",
				failed: "Failed",
				pending: "Pending",
				cancelled: "Cancelled",
				initiated: "Initiated",
			},
			
			// Actions
			actions: {
				diagnose: "Diagnose transaction",
				back: "Back",
				verifyStatus: "Verify status",
			},
			
			// Messages
			messages: {
				verificationError: "Error during transaction verification",
				verificationSuccess: "Transaction verification completed successfully",
			},
		},
	},
} as const;
