import { z } from "zod";

export const loginSchema = z.object({
	email: z
		.string({ message: "Entrez un email valide" })
		.email({ message: "Entrez un email valide" }),
	password: z.string({ message: "Entrez un mot de passe" }),
});

export const verifyTokenSchema = z.object({
	code: z.string({ message: "Ce champ est reuis" }),
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
