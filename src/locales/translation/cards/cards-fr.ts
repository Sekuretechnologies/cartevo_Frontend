export const cardsTranslationsFr = {
	pageTitle: "Cartevo | Cartes",
	mainTitle: "Cartes",
	
	// Labels et en-têtes
	labels: {
		status: {
			active: "Actif",
			inactive: "Inactif",
			success: "Réussi",
			failed: "Échec",
			pending: "En cours",
			cancelled: "Annulé",
		},
	},
	
	// Actions
	actions: {
		createCard: "Créer une carte",
		details: "Détails",
	},
	
	// En-têtes de tableau
	table: {
		serial: "#",
		type: "Type",
		number: "Numéro",
		name: "Nom",
		balance: "Solde (USD)",
		status: "Statut",
		date: "Date",
		actions: "Actions",
	},
	
	// Messages
	messages: {
		failedToGetCards: "Échec de récupération des cartes.",
		noCardsFound: "Aucune carte trouvée",
	},
	
	// Chargement
	loading: {
		loadingSpinner: "Chargement...",
	},
	
	// Page Détails de Carte
	details: {
		pageTitle: "Cartevo | Détails de carte",
		mainTitle: "Détails de carte",
		failedToGetCard: "Échec de récupération de la carte",
		failedToGetCardTransactions: "Échec de récupération des transactions de carte",
		
		// Étiquettes d'Information de Carte
		labels: {
			brand: "Marque",
			cvv: "CVV",
			masked_number: "Numéro",
			name: "Nom",
			status: "Statut",
			created_at: "Date d'émission",
			balance: "Solde",
		},
		
		// Actions de Carte
		actions: {
			fund: "Recharger",
			withdraw: "Retirer",
			freeze: "Geler",
			unfreeze: "Dégeler",
			details: "Détails",
		},
		
		// Statut de Carte
		status: {
			active: "ACTIF",
			terminated: "TERMINÉ",
			frozen: "GELÉ",
			suspended: "Suspendu",
		},
		
		// Section Transactions
		transactions: {
			title: "Transactions de carte",
			noTransactions: "Aucune transaction trouvée",
		},
		
		// Messages Toast
		messages: {
			authRequired: "Authentification requise",
			cardFundedSuccess: "Carte rechargée avec succès",
			cardFundFailed: "Échec de rechargement de carte",
			withdrawalSuccess: "Retrait réussi",
			withdrawalFailed: "Échec de retrait de carte",
			cardFrozenSuccess: "Carte gelée avec succès",
			cardFreezeFailed: "Échec de gel de carte",
			cardUnfrozenSuccess: "Carte dégelée avec succès",
			cardUnfreezeFailed: "Échec de dégel de carte",
		},
	},
	
	// Modals
	modals: {
		createCard: {
			title: "Ajouter une nouvelle carte",
			customer: "Client",
			customerRequired: "Veuillez sélectionner un client",
			customerPlaceholder: "Tapez pour rechercher par nom ou email",
			loadingCustomers: "Chargement des clients...",
			noCustomersFound: "Aucun client trouvé",
			cardholderName: "Nom du porteur",
			cardholderNameRequired: "Le nom du porteur est requis",
			cardholderNamePlaceholder: "Entrez le nom du porteur",
			cardBrand: "Marque de carte",
			selectBrand: "Sélectionner une marque",
			initialBalance: "Solde initial (USD)",
			initialBalanceRequired: "Veuillez entrer un montant valide",
			initialBalanceMin: "Le montant doit être d'au moins 1",
			initialBalancePlaceholder: "0.00",
			creating: "Création...",
			createCard: "Créer une carte",
			cancel: "Annuler",
			cardCreatedSuccess: "Carte créée avec succès",
			cardCreationInitiated: "Création de carte initiée",
			cardCreationFailed: "Échec de création de carte",
		},
		
		// Modal Détails de Transaction
		transactionDetails: {
			title: "Détails de la transaction",
			
			// Étiquettes des Champs
			labels: {
				type: "Type",
				date: "Date",
				time: "Heure",
				status: "Statut",
				name: "Nom",
				maskedNumber: "Numéro masqué",
				transactionId: "ID Transaction",
				merchantName: "Marchand (nom)",
				merchantCountry: "Marchand (pays)",
				merchantCity: "Marchand (ville)",
				amount: "Montant (USD)",
				fee: "Frais",
				description: "Description",
			},
			
			// Valeurs de Statut
			statusValues: {
				success: "Réussi",
				failed: "Échec",
				pending: "En cours",
				cancelled: "Annulé",
				initiated: "Initié",
			},
			
			// Actions
			actions: {
				diagnose: "Diagnostiquer la transaction",
				back: "Retour",
				verifyStatus: "Vérifier le statut",
			},
			
			// Messages
			messages: {
				verificationError: "Erreur lors de la vérification de la transaction",
				verificationSuccess: "La vérification de la transaction a été effectuée avec succès",
			},
		},
	},
} as const;
