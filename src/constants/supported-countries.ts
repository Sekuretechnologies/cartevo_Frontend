export const supportedCountries = {
	data: {
		BF: {
			country_code: "BF",
			country_name: "Burkina Faso",
			country_flag: "🇧🇫",
			prefix: "226",
			taxes: 18,
			currencies: {
				XOF: {
					currency: "XOF",
					operators: [
						{
							operator_code: "moov",
							operator_name: "Moov Money",
							otp_required: 0,
							ussd_code: "",
							wallet: 0,
						},
						{
							operator_code: "orange",
							operator_name: "Orange Money",
							otp_required: 1,
							ussd_code: "*144*4*6*montant#",
							wallet: 0,
						},
						{
							operator_code: "wligdicash",
							operator_name: "Wallet LigdiCash",
							otp_required: 1,
							ussd_code: "Get OTP from endpoint .../pay/otp",
							wallet: 1,
						},
					],
				},
			},
		},
		CD: {
			country_code: "CD",
			country_name: "R.D.C",
			country_flag: "🇨🇩",
			prefix: "243",
			taxes: 16,
			currencies: {
				CDF: {
					currency: "CDF",
					operators: [
						{
							operator_code: "airtel",
							operator_name: "Airtel Money",
							otp_required: 0,
							ussd_code: "",
							wallet: 0,
						},
						{
							operator_code: "mpesa",
							operator_name: "Mpesa Money",
							otp_required: 0,
							ussd_code: "",
							wallet: 0,
						},
						{
							operator_code: "orange",
							operator_name: "Orange Money",
							otp_required: 0,
							ussd_code: "",
							wallet: 0,
						},
						{
							operator_code: "afrimoney",
							operator_name: "Afri Money",
							otp_required: 0,
							ussd_code: "",
							wallet: 0,
						},
						{
							operator_code: "vodacom",
							operator_name: "Vodacom",
							otp_required: 0,
							ussd_code: "",
							wallet: 0,
						},
					],
				},
			},
		},
		CG: {
			country_code: "CG",
			country_name: "Congo",
			country_flag: "🇨🇬",
			prefix: "242",
			taxes: 18.9,
			currencies: {
				XAF: {
					currency: "XAF",
					operators: [
						{
							operator_code: "airtel",
							operator_name: "Airtel Money",
							otp_required: 0,
							ussd_code: "",
							wallet: 0,
						},
						{
							operator_code: "mtn",
							operator_name: "MTN Money",
							otp_required: 0,
							ussd_code: "",
							wallet: 0,
						},
					],
				},
			},
		},
		CI: {
			country_code: "CI",
			country_name: "Côte d'Ivoire",
			country_flag: "🇨🇮",
			prefix: "225",
			taxes: 18,
			currencies: {
				XOF: {
					currency: "XOF",
					operators: [
						{
							operator_code: "moov",
							operator_name: "Moov Money",
							otp_required: 0,
							ussd_code: "*155#",
							wallet: 0,
						},
						{
							operator_code: "mtn",
							operator_name: "MTN Money",
							otp_required: 0,
							ussd_code: "*133#",
							wallet: 0,
						},
						{
							operator_code: "orange",
							operator_name: "Orange Money",
							otp_required: 1,
							ussd_code: "#144*82#",
							wallet: 0,
						},
						{
							operator_code: "wave",
							operator_name: "Wave Money",
							otp_required: 0,
							ussd_code: "",
							wallet: 0,
						},
					],
				},
			},
		},
		CM: {
			country_code: "CM",
			country_name: "Cameroon",
			country_flag: "🇨🇲",
			prefix: "237",
			taxes: 19.25,
			currencies: {
				XAF: {
					currency: "XAF",
					operators: [
						{
							operator_code: "mtn",
							operator_name: "MTN Money",
							otp_required: 0,
							ussd_code: "*126#",
							wallet: 0,
						},
						{
							operator_code: "orange",
							operator_name: "Orange Money",
							otp_required: 0,
							ussd_code: "#150*50#",
							wallet: 0,
						},
					],
				},
			},
		},
		GA: {
			country_code: "GA",
			country_name: "Gabon",
			country_flag: "🇬🇦",
			prefix: "241",
			taxes: 18,
			currencies: {
				XAF: {
					currency: "XAF",
					operators: [
						{
							operator_code: "airtel",
							operator_name: "Airtel Money",
							otp_required: 0,
							ussd_code: "",
							wallet: 0,
						},
						{
							operator_code: "moov",
							operator_name: "Moov Money",
							otp_required: 0,
							ussd_code: "",
							wallet: 0,
						},
					],
				},
			},
		},
		GN: {
			country_code: "GN",
			country_name: "Guinea Conakry",
			country_flag: "🇬🇳",
			prefix: "224",
			taxes: 18,
			currencies: {
				GNF: {
					currency: "GNF",
					operators: [
						{
							operator_code: "mtn",
							operator_name: "MTN Money",
							otp_required: 0,
							ussd_code: "",
							wallet: 0,
						},
						{
							operator_code: "orange",
							operator_name: "Orange Money",
							otp_required: 1,
							ussd_code: "*144*4*2*1#",
							wallet: 0,
						},
					],
				},
			},
		},
		GW: {
			country_code: "GW",
			country_name: "Guinea-Bissau",
			country_flag: "🇬🇼",
			prefix: "245",
			taxes: 19,
			currencies: {
				XOF: {
					currency: "XOF",
					operators: [
						{
							operator_code: "orange",
							operator_name: "Orange Money",
							otp_required: 0,
							ussd_code: "",
							wallet: 0,
						},
					],
				},
			},
		},
		ML: {
			country_code: "ML",
			country_name: "Mali",
			country_flag: "🇲🇱",
			prefix: "223",
			taxes: 18,
			currencies: {
				XOF: {
					currency: "XOF",
					operators: [
						{
							operator_code: "moov",
							operator_name: "Moov Money",
							otp_required: 0,
							ussd_code: "",
							wallet: 0,
						},
						{
							operator_code: "orange",
							operator_name: "Orange Money",
							otp_required: 0,
							ussd_code: "#144#77#",
							wallet: 0,
						},
					],
				},
			},
		},
		NE: {
			country_code: "NE",
			country_name: "Niger",
			country_flag: "🇳🇪",
			prefix: "227",
			taxes: 18,
			currencies: {
				XOF: {
					currency: "XOF",
					operators: [
						{
							operator_code: "orange",
							operator_name: "Orange Money",
							otp_required: 0,
							ussd_code: "#144*43#",
							wallet: 0,
						},
						{
							operator_code: "airtel",
							operator_name: "Airtel Money",
							otp_required: 0,
							ussd_code: "",
							wallet: 0,
						},
						{
							operator_code: "moov",
							operator_name: "Moov Money",
							otp_required: 0,
							ussd_code: "*157#",
							wallet: 0,
						},
					],
				},
			},
		},
		SN: {
			country_code: "SN",
			country_name: "Senegal",
			country_flag: "🇸🇳",
			prefix: "221",
			taxes: 18,
			currencies: {
				XOF: {
					currency: "XOF",
					operators: [
						{
							operator_code: "emoney",
							operator_name: "E-money",
							otp_required: 0,
							ussd_code: "",
							wallet: 0,
						},
						{
							operator_code: "free",
							operator_name: "Free Money",
							otp_required: 0,
							ussd_code: "",
							wallet: 0,
						},
						{
							operator_code: "orange",
							operator_name: "Orange Money",
							otp_required: 1,
							ussd_code: "#144*391#",
							wallet: 0,
						},
						{
							operator_code: "wave",
							operator_name: "Wave Money",
							otp_required: 0,
							ussd_code: "",
							wallet: 0,
						},
					],
				},
			},
		},
		TG: {
			country_code: "TG",
			country_name: "Togo",
			country_flag: "🇹🇬",
			prefix: "228",
			taxes: 18,
			currencies: {
				XOF: {
					currency: "XOF",
					operators: [
						{
							operator_code: "moov",
							operator_name: "Moov Money",
							otp_required: 0,
							ussd_code: "",
							wallet: 0,
						},
						{
							operator_code: "tmoney",
							operator_name: "T-Money",
							otp_required: 0,
							ussd_code: "",
							wallet: 0,
						},
					],
				},
			},
		},
		BJ: {
			country_code: "BJ",
			country_name: "Benin",
			country_flag: "🇧🇯",
			prefix: "229",
			taxes: 18,
			currencies: {
				XOF: {
					currency: "XOF",
					operators: [
						{
							operator_code: "moov",
							operator_name: "Moov Money",
							otp_required: 0,
							ussd_code: "",
							wallet: 0,
						},
						{
							operator_code: "mtn",
							operator_name: "MTN Money",
							otp_required: 0,
							ussd_code: "",
							wallet: 0,
						},
						{
							operator_code: "celtiis",
							operator_name: "Celtiis Money",
							otp_required: 0,
							ussd_code: "",
							wallet: 0,
						},
						{
							operator_code: "coris",
							operator_name: "Coris Money",
							otp_required: 0,
							ussd_code: "",
							wallet: 1,
						},
					],
				},
			},
		},
		TD: {
			country_code: "TD",
			country_name: "Tchad",
			country_flag: "🇹🇩",
			prefix: "235",
			taxes: 18,
			currencies: {
				XAF: {
					currency: "XAF",
					operators: [
						{
							operator_code: "airtel",
							operator_name: "Airtel Money",
							otp_required: 0,
							ussd_code: "",
							wallet: 0,
						},
						{
							operator_code: "moov",
							operator_name: "Moov Money",
							otp_required: 0,
							ussd_code: "",
							wallet: 0,
						},
					],
				},
			},
		},
		GM: {
			country_code: "GM",
			country_name: "Gambia",
			country_flag: "🇬🇲",
			prefix: "220",
			taxes: 0,
			currencies: {
				GMD: {
					currency: "GMD",
					operators: [
						{
							operator_code: "afrimoney",
							operator_name: "Afri Money",
							otp_required: 0,
							ussd_code: "",
							wallet: 0,
						},
					],
				},
			},
		},
	},
};
