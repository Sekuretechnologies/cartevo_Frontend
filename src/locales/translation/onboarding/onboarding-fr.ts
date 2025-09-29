// Traductions françaises pour la page d'onboarding
export const onboardingTranslationsFr = {
	// Titres et en-têtes
	pageTitle: "Cartevo | Intégration",
	mainTitle: "Complétez votre Onboarding",
	overallProgress: "Progression globale",

	// Descriptions
	mainDescription:
		"Suivez ces étapes pour finaliser la configuration de votre compte et commencer à utiliser Cartevo.",
	progressDescription:
		"Complétez toutes les étapes pour débloquer l'accès complet à votre tableau de bord Cartevo.",

	// Étapes d'onboarding
	steps: {
		profileCompletion: {
			name: "Complétion du profil",
			description: "Complétez les informations de votre profil personnel",
		},
		businessInfo: {
			name: "Informations commerciales",
			description: "Complétez les détails de votre entreprise et la vérification KYB",
		},
	},

	// Formulaire KYB
	kybForm: {
		sections: {
			businessInfoTitle: "Informations de l'entreprise",
			businessDetailsTitle: "Détails de l'entreprise",
			requiredDocumentsTitle: "Documents requis",
		},
		labels: {
			business_phone_number: "Numéro de téléphone de l'entreprise",
			business_address: "Adresse de l'entreprise",
			tax_id_number: "Numéro d'identification fiscale",
			business_website: "Site web de l'entreprise",
			business_description: "Description de l'entreprise",
			source_of_funds: "Source des fonds",
			incorporation_certificate: "Certificat d'incorporation",
			share_holding_document: "Document d'actionnariat",
			business_proof_of_address: "Justificatif d'adresse de l'entreprise",
		},
		placeholders: {
			business_phone_number: "Entrez le numéro de téléphone de l'entreprise",
			business_address: "Entrez l'adresse de votre entreprise",
			business_website: "https://www.example.com",
			business_description:
				"Décrivez les activités et services de votre entreprise",
			select_source_of_funds: "Sélectionnez la source des fonds",
		},
		buttons: {
			save: "Enregistrer",
		},
		toasts: {
			successCompanyInfoSaved:
				"Informations de l'entreprise enregistrées ! Inscription terminée.",
			genericError:
				"Une erreur est survenue lors de l'enregistrement des informations.",
		},
	},

	// Statuts
	status: {
		completed: "Terminé",
		inProgress: "En cours",
		pending: "En attente",
	},

	// Boutons d'action
	buttons: {
		review: "Examiner",
		continue: "Continuer",
		start: "Commencer",
	},

	// Messages de vérification
	verification: {
		kyc: {
			pending:
				"Votre KYC a été soumis et est en cours d'examen. Veuillez patienter 24-72 heures pour la validation.",
			approved: "Votre KYC est approuvé.",
			rejected: "Votre KYC a été rejeté.",
			none: "Vous n'avez pas encore soumis votre KYC.",
			unknown: "Le statut de votre KYC est inconnu.",
		},
		kyb: {
			pending:
				"Votre KYB a été soumis et est en cours d'examen. Veuillez patienter 24-72 heures pour la validation.",
			approved: "Votre KYB est approuvé.",
			rejected: "Votre KYB a été rejeté.",
			none: "Vous n'avez pas encore soumis votre KYB.",
			unknown: "Le statut de votre KYB est inconnu.",
		},
		global: {
			allApproved: "Toutes vos vérifications sont approuvées.",
			oneOrMoreRejected:
				"Une ou plusieurs de vos vérifications ont été rejetées.",
			noneSubmitted:
				"Vous n'avez soumis aucune vérification pour le moment.",
			stillPending: "Vos vérifications sont toujours en attente.",
		},
	},

	// Liens d'action
	actionLinks: {
		resubmitInfo: "Cliquez ici pour soumettre à nouveau vos informations",
		startVerification: "Cliquez ici pour commencer",
	},

	// Compteurs
	counters: {
		completed: "Terminé",
		step: "Étape",
	},

	// Messages d'erreur
	errors: {
		failedToGetSteps: "Échec de la récupération des étapes d'intégration.",
		failedToGetVerification:
			"Échec de la récupération du statut de vérification.",
	},
} as const;
