import { string, z } from "zod";

// declare global {
// 	interface Window {
// 		FileList: typeof FileList;
// 	}
// }

// export const personalInfoSchema = z
// 	.object({
// 		company_name: z.string().min(3, {
// 			message:
// 				"Le nom de l'entreprise doit contenir au moins 3 caractères",
// 		}),
// 		first_name: z.string().min(2, {
// 			message: "Le prénom doit contenir au moins 2 caractères",
// 		}),
// 		last_name: z
// 			.string()
// 			.min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
// 		role: z.string().min(2, { message: "Le rôle est requis" }),
// 		phone_number: z
// 			.string()
// 			.min(7, { message: "Numéro de téléphone invalide" })
// 			.regex(/^[\d+\-\s]+$/, { message: "Numéro de téléphone invalide" }),
// 		gender: z.string().min(1, { message: "Le genre est requis" }),
// 		nationality: z
// 			.string()
// 			.min(2, { message: "La nationalité est requise" }),
// 		id_document_type: z
// 			.string()
// 			.min(2, { message: "Type de pièce requis" }),
// 		id_number: z.string().min(3, { message: "Numéro de pièce requis" }),
// 		id_document_front: z
// 			.instanceof(FileList)
// 			.refine((file) => file?.[0].size > 0 && file?.[0].name !== "", {
// 				message: "Recto de la pièce requis",
// 			}),
// 		id_document_back: z
// 			.instanceof(FileList)
// 			.refine((file) => file?.[0].size > 0 && file?.[0].name !== "", {
// 				message: "Verso de la pièce requis",
// 			}),
// 		country_of_residence: z
// 			.string()
// 			.min(2, { message: "Pays de résidence requis" }),
// 		state: z.string().min(2, { message: "Région/État requis" }),
// 		city: z.string().min(2, { message: "Ville requise" }),
// 		street: z.string().min(2, { message: "Adresse requise" }),
// 		postal_code: z.string().min(2, { message: "Code postal requis" }),
// 		proof_of_address: z
// 			.instanceof(FileList)
// 			.refine((file) => file?.[0].size > 0 && file?.[0].name !== "", {
// 				message: "Justificatif de domicile requis",
// 			}),
// 		email: z
// 			.string({ message: "Entrez un email valide" })
// 			.email({ message: "Entrez un email valide" }),
// 		password: z.string({ message: "Entrez un mot de passe" }).min(8, {
// 			message: "Le mot de passe doit contenir au moins 8 caractères",
// 		}),
// 		confirm_password: z.string({ message: "Confirmez le mot de passe" }),
// 	})
// 	.refine((data) => data.password === data.confirm_password, {
// 		message: "Les mots de passe ne correspondent pas",
// 		path: ["confirm_password"],
// 	});

// export const businessInfoSchema = z.object({
// 	business_name: z.string().min(3, {
// 		message: "Le nom de l'entreprise doit contenir au moins 3 caractères",
// 	}),
// 	business_phone_number: z
// 		.string()
// 		.min(7, { message: "Numéro de téléphone invalide" })
// 		.regex(/^[\d+\-\s]+$/, { message: "Numéro de téléphone invalide" }),
// 	business_address: z
// 		.string()
// 		.min(5, { message: "L'adresse de l'entreprise est requise" }),
// 	business_type: z
// 		.string()
// 		.min(2, { message: "Le type d'entreprise est requis" }),
// 	country_of_operation: z
// 		.string()
// 		.min(2, { message: "Le pays d'opération est requis" }),
// 	tax_id_number: z
// 		.string()
// 		.min(3, { message: "Le numéro d'identification fiscale est requis" }),
// 	business_website: z
// 		.string()
// 		.url({ message: "Entrez une URL valide pour le site web" })
// 		.optional()
// 		.or(z.literal("")),
// 	business_description: z.string().min(10, {
// 		message: "La description doit contenir au moins 10 caractères",
// 	}),
// 	source_of_funds: z
// 		.string()
// 		.min(2, { message: "La source de fonds est requise" }),
// 	share_holding_document: z
// 		.instanceof(FileList)
// 		.refine((file) => file?.[0].size > 0, {
// 			message: "Le document d'actionnariat est requis",
// 		}),
// 	incorporation_certificate: z
// 		.instanceof(FileList)
// 		.refine((file) => file?.[0].size > 0, {
// 			message: "Le certificat d'incorporation est requis",
// 		}),
// 	proof_of_address: z
// 		.instanceof(FileList)
// 		.refine((file) => file?.[0].size > 0, {
// 			message: "Le justificatif de domicile est requis",
// 		}),
// 	memart: z.instanceof(FileList).refine((file) => file?.[0].size > 0, {
// 		message: "Le MEMART est requis",
// 	}),
// });

export const loginSchema = z.object({
	email: z
		.string({ message: "Entrez un email valide" })
		.email({ message: "Entrez un email valide" }),
	password: z.string({ message: "Entrez un mot de passe" }),
});

export const verifyOtpSchema = z.object({
	email: z.string(),
	otp: z.string(),
});

export const adminSchema = z.object({
	fullname: z.string().min(10),
	email: z.string().min(8),
	date: z.string(),
});

export const switchSchema = z.object({
	Inscriptions: z.boolean().default(false).optional(),
	Recharges_de_solde: z.boolean().default(false).optional(),
	Retraits_de_solde: z.boolean().default(false).optional(),
	Frais_de_recharge: z.number().default(0),
	Frais_de_retraits: z.number().default(0),
	Rémunération_parrainage: z.number().default(0),
});

export const carteSchema = z.object({
	Achat_de_carte: z.boolean().default(false).optional(),
	Recharges_de_carte: z.boolean().default(false).optional(),
	Retraits_de_carte: z.boolean().default(false).optional(),
	Cout_du_dollar: z.number().default(0),
	Prix_de_la_carte: z.number().default(0),
	Recharge: z.number().default(0),
	Retraits: z.number().default(0),
	Echec_de_paiement: z.number().default(0),
});

export const transfertsSchema = z.object({
	Transferts_sekure: z.boolean().default(false).optional(),
	Transferts_Mobile_Money: z.boolean().default(false).optional(),
	Frais_de_transfert_ver_Mobile_Money: z.number().default(0),
	Frais_de_transfert_vers_sekure: z.number().default(0),
});

export const detailsSchema = z.object({
	name: z.string(),
	email: z.string(),
	country: z.string(),
	// gender: z.string(),
	phone: z.string(),
	country_code: z.string(),
	city: z.string(),
	address: z.string(),
	birthday: z.string(),
	age: z.string(),
	job: z.string(),
	sex: z.string(),
	income: z.string(),
	idExpDate: z.string(),
	codeParrain: z.string(),
	codeParrainage: z.string(),
	deviceModel: z.string(),
	deviceID: z.string(),
	idNumber: z.string(),
	idPaper: z.string(),
	tags: z.array(z.string()),
	additionalPhoneNumbers: z.array(z.string()),
});

export const detailsSchemaV2 = z.object({
	first_name: z.string(),
	last_name: z.string(),
	email: z.string(),
	country: z.string(),
	niu: z.string(),
	phone: z.string(),
	country_code: z.string(),
	city: z.string(),
	address: z.string(),
	birthday: z.string(),
	age: z.string(),
	job: z.string(),
	sex: z.string(),
	income: z.string(),
	idExpDate: z.string(),
	codeParrain: z.string(),
	codeParrainage: z.string(),
	deviceModel: z.string(),
	deviceID: z.string(),
	idNumber: z.string(),
	idPaper: z.string(),
	tags: z.array(z.string()),
	additionalPhoneNumbers: z.array(z.string()),
});

export const chnpaymentSchema = z.object({
	platform_name: z.string(),
	amount_xaf: z.number(),
	amount_with_fee_xaf: z.number(),
	amount_usd: z.number(),
	fee_xaf: z.number().optional(),
	delivery_address: z.string().optional(),
	platform_profile_id: z.string().optional(),
	provider_payment_link: z.string().optional(),
	proof: z.string().optional(),
	product_link: z.string().optional(),
	user_name: z.string().optional(),
	user_phone: z.string().optional(),
	user_email: z.string().optional(),
	user_country: z.string().optional(),
	user_city: z.string().optional(),
});

export const nairapaymentSchema = z.object({
	bank_name: z.string(),
	bank_code: z.string(),
	amount_xaf: z.number(),
	amount_with_fee_xaf: z.number(),
	amount_ngn: z.number(),
	fee_xaf: z.number().optional(),
	account_name: z.string().optional(),
	account_number: z.string().optional(),
	reason: z.string().optional(),
	user_name: z.string().optional(),
	user_phone: z.string().optional(),
	user_email: z.string().optional(),
	user_country: z.string().optional(),
	user_city: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
	email: z.string().email("Invalid email"),
});

export const resetPsswordSchema = z
	.object({
		password: z.string({ message: "Entrez un mot de passe" }),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Les mots de passe ne correspondent pas",
		path: ["confirmPassword"],
	});

export const contactSchema = z.object({
	country_code: z.string().min(1, "Le code pays est obligatoire"),
	whatsapp: z.string().min(1, "Le numéro WhatsApp est obligatoire"),
	email: z.string().email("Adresse e-mail invalide"),
	subject: z.string().min(3, "L’objet doit contenir au moins 3 caractères"),
	message: z
		.string()
		.min(5, "Le message doit contenir au moins 5 caractères"),
	name: z.string().min(1, "Le nom est obligatoire"),
	entrepriseName: z.string().min(1, "Le nom de l’entreprise est obligatoire"),
	activity: z.string().min(1, "L’activité est obligatoire"),
	service: z.string().min(1, "Le service est obligatoire"),
});

export const teamMemberSchema = z.object({
	email: z.string().email("Invalid email"),
	role: z.string().min(2, { message: "role is required" }),
	// ownerUserId: z.string(),
});

export const registerUserSchema = z.object({
	email: z.string().email("Invalid email"),
	invitation_code: z.string().min(1, "Invitation code is required"),
	full_name: z.string().min(1, "Full name is required"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(32, "Password must be at most 32 characters")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
			"Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
		),
});

export const LoginWithCompany = z.object({
	company_id: z.string().min(1, "Veuillez sélectionner une entreprise"),
	temp_token: z.string(),
});

export const AcceptInvitationSchema = z.object({
	invitationToken: z.string(),
	password: z.string().min(1, "Le mot de passe est requis"),
});
