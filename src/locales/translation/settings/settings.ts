export const settingsTranslations = {
	pageTitle: "Cartevo | Settings",
	mainTitle: "Settings",

	// Tab Navigation
	tabs: {
		teamMembers: "Team Members",
		exchangeRates: "Exchange Rates",
		transactionFees: "Transaction Fees",
	},

	// Team Members Section
	teamMembers: {
		title: "Team Members",
		description: "Manage your team members, assign roles, and control access permissions.",
		
		// Table Headers
		table: {
			serial: "#",
			firstName: "First Name",
			lastName: "Last Name",
			roleInCompany: "Role in Company",
			email: "Email",
			status: "Status",
			actions: "Actions",
		},

		// Actions
		actions: {
			addNewTeamMember: "Add New Team Member",
			editRole: "Edit role",
			delete: "Delete",
		},

		// Messages
		messages: {
			failedToGetTeamMembers: "Failed to get team members",
			teamMemberDeletedSuccess: "Team member deleted successfully",
			failedToDeleteMember: "Failed to delete member",
		},

		// Modals
		modals: {
			// Add Team Member Modal
			addTeamMember: {
				title: "Add new team member",
				emailAddress: "Email Adress",
				emailPlaceholder: "ex prenom@gmail.com",
				role: "Role",
				selectRole: "Select Role",
				saveAndContinue: "Save & Continue",
				newTeamMemberAddedSuccess: "New team member added successfully",
			},

			// Edit Role Modal
			editRole: {
				title: "Edit user role",
				selectRole: "Select Role",
				editRole: "Edit Role",
				failedToUpdateUserRole: "Failed to update user role.",
				userRoleUpdatedSuccess: "User role updated successfully.",
			},

			// Delete Confirmation Modal
			deleteConfirmation: {
				title: "Confirm Delete",
				message: "Are you sure you want to delete this team member? This action cannot be undone.",
				delete: "Delete",
				cancel: "Cancel",
			},

			// User Roles
			userRoles: {
				member: "Member",
				admin: "Admin",
			},
		},
	},

	// Exchange Rates Section
	exchangeRates: {
		title: "Exchange Rates",
		description: "Manage currency exchange rates for your platform",

		// Table Headers
		table: {
			serial: "#",
			from: "From",
			to: "To",
			rate: "Rate",
			description: "Description",
		},

		// Actions
		actions: {
			addExchangeRate: "Add Exchange Rate",
		},

		// Messages
		messages: {
			failedToGetExchangeRates: "Failed to get exchange rates.",
			exchangeRateDeletedSuccess: "Exchange rate deleted successfully!",
			failedToDeleteExchangeRate: "Failed to delete exchange rate",
		},

		// Modal
		modal: {
			addTitle: "Add Exchange Rate",
			editTitle: "Edit Exchange Rate",
			fromCurrency: "From Currency",
			toCurrency: "To Currency",
			rate: "Rate",
			source: "Source",
			description: "Description",
			active: "Active",
			cancel: "Cancel",
			save: "Save",
			saving: "Saving...",
			
			// Placeholders
			fromCurrencyPlaceholder: "USD",
			toCurrencyPlaceholder: "XAF",
			ratePlaceholder: "650",
			descriptionPlaceholder: "Exchange rate description",

			// Source Options
			sourceOptions: {
				default: "Default",
				manual: "Manual",
				api: "API",
			},

			// Messages
			exchangeRateCreatedSuccess: "Exchange rate created successfully!",
			exchangeRateUpdatedSuccess: "Exchange rate updated successfully!",
			failedToSaveExchangeRate: "Failed to save exchange rate",
		},
	},

	// Transaction Fees Section
	transactionFees: {
		title: "Transaction Fees",
		description: "Configure transaction fees for different payment types and countries",

		// Table Headers
		table: {
			serial: "#",
			description: "Description",
			value: "Value",
		},

		// Actions
		actions: {
			addTransactionFee: "Add Transaction Fee",
		},

		// Messages
		messages: {
			failedToGetTransactionFees: "Failed to get transaction fees.",
			transactionFeeDeletedSuccess: "Transaction fee deleted successfully!",
			failedToDeleteTransactionFee: "Failed to delete transaction fee",
			areYouSureDeleteTransactionFee: "Are you sure you want to delete this transaction fee?",
		},

		// Modal
		modal: {
			addTitle: "Add Transaction Fee",
			editTitle: "Edit Transaction Fee",
			transactionType: "Transaction Type",
			transactionCategory: "Transaction Category",
			countryIsoCode: "Country ISO Code",
			currency: "Currency",
			feeType: "Fee Type",
			value: "Value",
			description: "Description",
			cancel: "Cancel",
			save: "Save",
			saving: "Saving...",

			// Placeholders
			countryIsoCodePlaceholder: "US",
			currencyPlaceholder: "USD",
			valuePlaceholder: "1.00",
			descriptionPlaceholder: "Transaction fee description",

			// Transaction Type Options
			transactionTypeOptions: {
				card: "Card",
				transfer: "Transfer",
				withdrawal: "Withdrawal",
				deposit: "Deposit",
			},

			// Transaction Category Options
			transactionCategoryOptions: {
				purchase: "Purchase",
				atm: "ATM",
				online: "Online",
				international: "International",
			},

			// Fee Type Options
			feeTypeOptions: {
				fixed: "Fixed",
				percentage: "Percentage",
			},

			// Messages
			transactionFeeCreatedSuccess: "Transaction fee created successfully!",
			transactionFeeUpdatedSuccess: "Transaction fee updated successfully!",
			failedToSaveTransactionFee: "Failed to save transaction fee",
		},
	},

	// General Messages
	messages: {
		areYouSureDeleteExchangeRate: "Are you sure you want to delete this exchange rate?",
	},
} as const;

