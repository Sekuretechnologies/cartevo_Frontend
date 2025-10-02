export const settingsTranslationsFr = {
	pageTitle: "Cartevo | Paramètres",
	mainTitle: "Paramètres",

	// Navigation des Onglets
	tabs: {
		teamMembers: "Membres de l'équipe",
		exchangeRates: "Taux de change",
		transactionFees: "Frais de transaction",
	},

	// Section Membres de l'équipe
	teamMembers: {
		title: "Membres de l'équipe",
		description: "Gérez les membres de votre équipe, attribuez des rôles et contrôlez les autorisations d'accès.",
		
		// En-têtes de tableau
		table: {
			serial: "#",
			firstName: "Prénom",
			lastName: "Nom",
			roleInCompany: "Rôle dans l'entreprise",
			email: "Email",
			status: "Statut",
			actions: "Actions",
		},

		// Actions
		actions: {
			addNewTeamMember: "Ajouter un nouveau membre",
			editRole: "Modifier le rôle",
			delete: "Supprimer",
		},

		// Messages
		messages: {
			failedToGetTeamMembers: "Échec de récupération des membres de l'équipe",
			teamMemberDeletedSuccess: "Membre de l'équipe supprimé avec succès",
			failedToDeleteMember: "Échec de suppression du membre",
		},

		// Modals
		modals: {
			// Modal Ajouter un membre d'équipe
			addTeamMember: {
				title: "Ajouter un nouveau membre d'équipe",
				emailAddress: "Adresse email",
				emailPlaceholder: "ex prenom@gmail.com",
				role: "Rôle",
				selectRole: "Sélectionner un rôle",
				saveAndContinue: "Enregistrer et continuer",
				newTeamMemberAddedSuccess: "Nouveau membre d'équipe ajouté avec succès",
			},

			// Modal Modifier le rôle
			editRole: {
				title: "Modifier le rôle utilisateur",
				selectRole: "Sélectionner un rôle",
				editRole: "Modifier le rôle",
				failedToUpdateUserRole: "Échec de mise à jour du rôle utilisateur.",
				userRoleUpdatedSuccess: "Rôle utilisateur mis à jour avec succès.",
			},

			// Modal de confirmation de suppression
			deleteConfirmation: {
				title: "Confirmer la suppression",
				message: "Êtes-vous sûr de vouloir supprimer ce membre d'équipe ? Cette action ne peut pas être annulée.",
				delete: "Supprimer",
				cancel: "Annuler",
			},

			// Rôles utilisateur
			userRoles: {
				member: "Membre",
				admin: "Administrateur",
			},
		},
	},

	// Section Taux de change
	exchangeRates: {
		title: "Taux de change",
		description: "Gérez les taux de change de devises pour votre plateforme",

		// En-têtes de tableau
		table: {
			serial: "#",
			from: "De",
			to: "À",
			rate: "Taux",
			description: "Description",
		},

		// Actions
		actions: {
			addExchangeRate: "Ajouter un taux de change",
		},

		// Messages
		messages: {
			failedToGetExchangeRates: "Échec de récupération des taux de change.",
			exchangeRateDeletedSuccess: "Taux de change supprimé avec succès !",
			failedToDeleteExchangeRate: "Échec de suppression du taux de change",
		},

		// Modal
		modal: {
			addTitle: "Ajouter un taux de change",
			editTitle: "Modifier le taux de change",
			fromCurrency: "Devise source",
			toCurrency: "Devise cible",
			rate: "Taux",
			source: "Source",
			description: "Description",
			active: "Actif",
			cancel: "Annuler",
			save: "Enregistrer",
			saving: "Enregistrement...",
			
			// Placeholders
			fromCurrencyPlaceholder: "USD",
			toCurrencyPlaceholder: "XAF",
			ratePlaceholder: "650",
			descriptionPlaceholder: "Description du taux de change",

			// Options de source
			sourceOptions: {
				default: "Par défaut",
				manual: "Manuel",
				api: "API",
			},

			// Messages
			exchangeRateCreatedSuccess: "Taux de change créé avec succès !",
			exchangeRateUpdatedSuccess: "Taux de change mis à jour avec succès !",
			failedToSaveExchangeRate: "Échec d'enregistrement du taux de change",
		},
	},

	// Section Frais de transaction
	transactionFees: {
		title: "Frais de transaction",
		description: "Configurez les frais de transaction pour différents types de paiement et pays",

		// En-têtes de tableau
		table: {
			serial: "#",
			description: "Description",
			value: "Valeur",
		},

		// Actions
		actions: {
			addTransactionFee: "Ajouter des frais de transaction",
		},

		// Messages
		messages: {
			failedToGetTransactionFees: "Échec de récupération des frais de transaction.",
			transactionFeeDeletedSuccess: "Frais de transaction supprimés avec succès !",
			failedToDeleteTransactionFee: "Échec de suppression des frais de transaction",
			areYouSureDeleteTransactionFee: "Êtes-vous sûr de vouloir supprimer ces frais de transaction ?",
		},

		// Modal
		modal: {
			addTitle: "Ajouter des frais de transaction",
			editTitle: "Modifier les frais de transaction",
			transactionType: "Type de transaction",
			transactionCategory: "Catégorie de transaction",
			countryIsoCode: "Code ISO du pays",
			currency: "Devise",
			feeType: "Type de frais",
			value: "Valeur",
			description: "Description",
			cancel: "Annuler",
			save: "Enregistrer",
			saving: "Enregistrement...",

			// Placeholders
			countryIsoCodePlaceholder: "US",
			currencyPlaceholder: "USD",
			valuePlaceholder: "1.00",
			descriptionPlaceholder: "Description des frais de transaction",

			// Options de type de transaction
			transactionTypeOptions: {
				card: "Carte",
				transfer: "Transfert",
				withdrawal: "Retrait",
				deposit: "Dépôt",
			},

			// Options de catégorie de transaction
			transactionCategoryOptions: {
				purchase: "Achat",
				atm: "DAB",
				online: "En ligne",
				international: "International",
			},

			// Options de type de frais
			feeTypeOptions: {
				fixed: "Fixe",
				percentage: "Pourcentage",
			},

			// Messages
			transactionFeeCreatedSuccess: "Frais de transaction créés avec succès !",
			transactionFeeUpdatedSuccess: "Frais de transaction mis à jour avec succès !",
			failedToSaveTransactionFee: "Échec d'enregistrement des frais de transaction",
		},
	},

	// Messages généraux
	messages: {
		areYouSureDeleteExchangeRate: "Êtes-vous sûr de vouloir supprimer ce taux de change ?",
	},
} as const;
