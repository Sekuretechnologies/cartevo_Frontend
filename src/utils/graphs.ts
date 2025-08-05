import { ScriptableContext } from "chart.js";
import { getFormattedDate, getFormattedDateTime } from "./DateFormat";

interface CategoryModeItemProps {
	[key: string]: string | undefined; // Index signature
}
interface CategoryModeProps {
	[key: string]: CategoryModeItemProps;
}

export const categoryMode: CategoryModeProps = {
	carte: {
		CREDIT: "Crédit carte",
		DEBIT: "Débit carte",
	},
	solde: {
		CREDIT: "Crédit compte",
		DEBIT: "Débit compte",
	},
	parrain: {
		CREDIT: "Crédit parrain",
		DEBIT: "Débit parrain",
	},
};

export const getCategoryMode = (
	category: string,
	type: string,
	mode: string
) => {
	if (category === "carte") {
		if (type === "recharge" && mode === "DEBIT") {
			return { mode: "CREDIT", text: "Crédit carte" };
		} else if (type === "retrait" && mode === "CREDIT") {
			return { mode: "DEBIT", text: "Débit carte" };
		} else {
			return { mode: mode, text: categoryMode?.[category]?.[mode] };
		}
	} else {
		return { mode: mode, text: categoryMode?.[category]?.[mode] };
	}
};

export const getCategoryModeV2 = (
	category: string,
	type: string,
	mode: string
) => {
	if (category === "card") {
		if (type === "topup" && mode === "DEBIT") {
			return { mode: "CREDIT", text: "Crédit carte" };
		} else if (type === "withdrawal" && mode === "CREDIT") {
			return { mode: "DEBIT", text: "Débit carte" };
		} else {
			return { mode: mode, text: categoryMode?.[category]?.[mode] };
		}
	} else {
		return { mode: mode, text: categoryMode?.[category]?.[mode] };
	}
};

interface CategoryTypeItemProps {
	retrait?: string;
	recharge?: string;
	transfert?: string;
	parrainage?: string;
	achat?: string;
	authorization?: string;
	decline?: string;
	reversal?: string;
	refund?: string;
	termination?: string;
	debitechec?: string;
	bank?: string;
	[key: string]: string | undefined; // Index signature
}
interface CategoryTypeProps {
	carte: CategoryTypeItemProps;
	solde: CategoryTypeItemProps;
	transfert: CategoryTypeItemProps;
	[key: string]: CategoryTypeItemProps;
}

export const categoryType: CategoryTypeProps = {
	carte: {
		retrait: "Retrait de carte",
		recharge: "Recharge de carte",
		achat: "Achat de carte",
		authorization: "Paiement accepté",
		decline: "Paiement refusé",
		reversal: "Remboursement dans la carte",
		refund: "Demande de remboursement",
		termination: "Carte terminée/ désactivée",
		debitechec: "Frais d’échec de paiement",
	},
	solde: {
		retrait: "Retrait de compte",
		recharge: "Recharge de compte",
		parrainage: "Reversement dans le solde parrainage",
	},
	transfert: {
		transfert: "Transfert vers compte sekure",
		bank: "Transfert vers compte bancaire",
	},
	parrain: {
		retrait: "Retrait de compte de parrainage",
		recharge: "Recharge de compte  de parrainage",
		parrainage: "Reversement dans le solde parrainage",
	},
};

interface ICategoryType {
	[key: string]: any;
}
export const categoryTypeV2: ICategoryType = {
	card: {
		withdrawal: "Retrait de carte",
		topup: "Recharge de carte",
		purchase: "Achat de carte",
		authorization: "Paiement accepté",
		decline: "Paiement refusé",
		reversal: "Remboursement dans la carte",
		refund: "Demande de remboursement ",
		termination: "Carte terminée/ désactivée",
		faildebit: "Frais d’échec de paiement",
		//   settlement: 'settlement',
	},
	wallet: {
		withdrawal: "Retrait de compte",
		topup: "Recharge de compte",
		sponsorship: "Reversement dans le solde parrainage",
		send: "Envoi de paiement",
		receive: "Reception de paiement",
	},
	reward: {
		sponsorship_withdrawal: "Retrait solde parrainage",
		sponsorship_bonus: "Depot solde parrainage",
		payment_reward: "Depot solde récompense",
		reward_withdrawal: "Retrait solde récompense",
	},
	transfer: {
		transfer: "Transfert vers compte sekure",
		bank: "Transfert vers compte bancaire Nigeria", // "Transfert vers compte bancaire"
		send: "Envoi d'argent",
		receive: "Reception d'argent",
		chn: "Paiement en chine",
	},
	service: {
		"cashin-cashin": "Retrait d'argent",
		"cashout-cashout": "Depot d'argent",
		"topup-airtime": "Recharge de credit de communication",
		"topup-data": "Recharge de data internet",
		"topup-electricity": "Recharge de forfait d'electricité",
		"topup-water": "Recharge de forfait d'eau",
		"topup-electricity_water_bills":
			"Recharge de forfait d'eau / d'electricité",
		"subscription-electricity": "Souscription forfait d'electricité",
		"subscription-water": "Souscription forfait d'eau",
		"subscription-electricity_water_bills":
			"Souscription forfait d'eau / d'electricité",
		"subscription-cnps": "Paiement souscription CNPS",
		"subscription-sabc": "Paiement SABC",
		"subscription-guinness": "Paiement GUINNESS",
		"subscription-corporate": "Paiement entreprise",
		"product-canal": "Paiement CANAL",
		"product-easytv": "Paiement EASYTV",
		"product-dstv": "Paiement DSTV",
		"product-startimes": "Paiement Startimes",
		"product-cable_tv": "Paiement cable TV",
		"product-ticket": "Paiement ticket",
		"product-shirt": "Paiement maillot",
		"product-products_services": "Paiement produit / service",
		"bill-electricity": "Paiement facture d'electricité",
		"bill-water": "Paiement facture d'eau",
		"bill-electricity_water_bills":
			"Paiement facture d'eau / d'electricité",
		"bill-cnps": "Paiement facture CNPS",
		"bill-customs": "Paiement douane",
		"bill-kribiterminal": "Paiement douane",
		"bill-taxes": "Paiement impot",
		"bill-tax_government": "Paiement facture à l'Etat",
	},
};

/** =========================================================== */
export function getCategoryTypeV2(inputCategory: string, inputType: string) {
	if (categoryTypeV2?.[inputCategory]?.[inputType]) {
		return categoryTypeV2?.[inputCategory]?.[inputType];
	}

	return `${inputCategory}-${inputType}`; // Return null if no match is found
}

/** =========================================================== */
export const getTransactionTrendGraphData = ({
	trxData,
	dual,
}: {
	trxData: any;
	dual?: boolean;
}) => {
	let labels: string[] = [];
	let data: number[] = [];
	let data1: number[] = [];
	let data2: number[] = [];
	const trxs = trxData?.transactions ?? [];
	trxs?.map((item: any, index: any) => {
		labels.push(`${getFormattedDateTime(item.created_at, "", "fr")}`);
		data.push(item.amount_xaf);
		if (dual) {
			if (item.type === "decline") {
				data1.push(0);
				data2.push(item.amount_xaf);
			} else {
				data1.push(item.amount_xaf);
				data2.push(0);
			}
		}
	});
	const chartOptions = {
		tooltip: {
			callbacks: {
				label: (context: any) => {
					const dataPoint = context.dataset.data[context.dataIndex];
					console.log();

					// ${context.dataset.label}
					return `(${
						categoryType[trxs[context.dataIndex]?.category]?.[
							trxs[context.dataIndex]?.type
						] ??
						trxs[context.dataIndex]?.type +
							", " +
							trxs[context.dataIndex]?.category
					}) : ${dataPoint}`;
				},
			},
		},
		animation: {
			duration: 0, // Disables animation
		},
	};
	let transactionTrendsGraphData = {
		labels: labels,
		datasets: [
			{
				label: "Montant",
				data: dual ? data1 : data,
				// backgroundColor: '#18BC7Ac3',
				borderColor: "rgba(75, 192, 192, 1)",
				borderWidth: 1,
				fill: true,
				pointStyle: false,
				backgroundColor: (context: ScriptableContext<"line">) => {
					const ctx = context.chart.ctx;
					const gradient = ctx.createLinearGradient(0, 0, 500, 200);
					gradient.addColorStop(0, "#1F66FF");
					gradient.addColorStop(1, "#FFDB5A");
					return gradient;
				},
			},
		],
	};

	if (dual) {
		const dataset2 = {
			label: "Montant",
			data: data2,
			borderColor: "#D80F0Faa",
			backgroundColor: (context: ScriptableContext<"line">) => {
				const ctx = context.chart.ctx;
				const gradient = ctx.createLinearGradient(0, 0, 500, 200);
				gradient.addColorStop(0, "#D80F0Faa");
				gradient.addColorStop(1, "#D80F0Faa");
				return gradient;
			},
			borderWidth: 1,
			fill: true,
			pointStyle: false,
		};
		transactionTrendsGraphData.datasets.push(dataset2);
	}

	return { transactionTrendsGraphData, chartOptions };
};

const backgroundColor = [
	"#FFDB5A",
	"#F85D4B",
	"#6200EE",
	"#FD8A49",
	"#33E89C",
	"#5BCEFF",
];

function generateRandomHSLColor() {
	const randomHue = Math.floor(Math.random() * 361); // Random hue between 0 and 360
	const randomSaturation = Math.floor(Math.random() * 101); // Random saturation between 0 and 100
	const randomLightness = Math.floor(Math.random() * 101); // Random lightness between 0 and 100

	return `hsl(${randomHue}, ${randomSaturation}%, ${randomLightness}%)`;
}

export const getTransactionPerCountryGraphData = (
	trxData: any,
	title: string
) => {
	let labels: string[] = [];
	let data: number[] = [];
	let newData: any = {};
	Object.entries(trxData).map(([key, value]: any[], index: any) => {
		const newKey =
			key.includes("Congo") && key.includes("Democratic")
				? "Congo RDC"
				: key;
		labels.push(newKey);
		data.push(value?.count);
		newData[newKey] = {
			...value,
			color:
				index < backgroundColor.length
					? backgroundColor[index]
					: generateRandomHSLColor(),
		};
	});
	const doughnutData = {
		labels: labels, // ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
		datasets: [
			{
				label: title ?? "",
				data: data, //Array.from({length: 6}, () => Math.floor(Math.random() * 301) + 100),
				backgroundColor: backgroundColor.slice(
					0,
					Object.keys(trxData)?.length || 0
				),
				// [
				//   '#FFDB5A',
				//   '#F85D4B',
				//   // '#6200EE',
				//   // '#FD8A49',
				//   // '#33E89C',
				//   // '#5BCEFF',
				// ],
				hoverOffset: 4,
			},
		],
	};

	return {
		transactionPerCountryGraphData: doughnutData,
		transactionPerCountryData: newData,
	};
};

export const getUserPaymentsGraphData = (trxData: any, title?: string) => {
	let labels: string[] = [];
	let data: number[] = [];
	let trx = trxData;
	trx = trx.map((item: any, index: any) => {
		const newItem = { ...item };
		labels.push(newItem.merchant?.name);
		data.push(newItem?.totalAmount);
		newItem.color =
			index < backgroundColor.length
				? backgroundColor[index]
				: generateRandomHSLColor();
		return newItem;
	});
	const doughnutData = {
		labels: labels, // ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
		datasets: [
			{
				label: title ?? "",
				data: data, //Array.from({length: 6}, () => Math.floor(Math.random() * 301) + 100),
				backgroundColor: backgroundColor.slice(0, trx.length),
				// [
				//   '#FFDB5A',
				//   '#F85D4B',
				//   // '#6200EE',
				//   // '#FD8A49',
				//   // '#33E89C',
				//   // '#5BCEFF',
				// ],
				hoverOffset: 4,
			},
		],
	};
	console.log("userPaymentsData TRX: ", trx);
	console.log("userPaymentsData TRXDATA: ", trxData);

	return { userPaymentsGraphData: doughnutData, userPaymentsData: trx };
};

export const getTransactionPerCategoryTypeGraphData = (
	trxData: any,
	index: number
) => {
	let labels: string[] = [];
	let data: number[] = [];
	trxData.map((item: any, index: any) => {
		labels.push(getFormattedDateTime(item.created_at, "", "fr"));
		data.push(item.amount_xaf);
	});
	console.log(`::: getTransactionPerCategoryTypeGraphData :::`);
	console.log(`labels :::`, labels);
	console.log(`data :::`, data);

	const dataData = {
		labels: labels, //['Mon1', 'Mon2', 'Mon3', 'Mon4', 'Mon5', 'Mon6', 'Mon7', 'Mon8', 'Mon9', 'Mon10', 'Mon11', 'Mon12'],
		datasets: [
			{
				label: "",
				// data: [20, 32, 11, 29, 10, 25, 30, 27, 100, 320, 28, 100],
				data: data, //Array.from({length: 12}, () => Math.floor(Math.random() * 100)),
				borderColor: index % 2 == 0 ? "#FFDB5A" : "#1F66FF",
				borderWidth: 2,
				pointStyle: false,
			},
		],
	};
	return dataData;
};

export const getTransactionDailyPerCategoryTypeGraphData = (
	trxData: any,
	index: number
) => {
	let labels: string[] = [];
	let data: number[] = [];
	trxData.map((item: any, index: any) => {
		labels.push(getFormattedDate(item.transaction_date, "fr"));
		data.push(item.total_amount);
	});
	const dataData = {
		labels: labels, //['Mon1', 'Mon2', 'Mon3', 'Mon4', 'Mon5', 'Mon6', 'Mon7', 'Mon8', 'Mon9', 'Mon10', 'Mon11', 'Mon12'],
		datasets: [
			{
				label: "",
				// data: [20, 32, 11, 29, 10, 25, 30, 27, 100, 320, 28, 100],
				data: data, //Array.from({length: 12}, () => Math.floor(Math.random() * 100)),
				borderColor: index % 2 == 0 ? "#FFDB5A" : "#1F66FF",
				borderWidth: 2,
				pointStyle: false,
			},
		],
	};
	return dataData;
};

export const getGraphData = (trxData: any, index: number) => {
	let labels: string[] = [];
	let data: number[] = [];
	// trxData?.result?.map((item:any, index:any) => {
	trxData?.result &&
		Object.entries(trxData?.result)?.map(
			([key, value]: any[], index: any) => {
				labels.push(key);
				data.push(value.count);
				// labels.push(getFormattedDateTime(item.created_at, 'date', 'fr'));
				// data.push(item.count);
			}
		);
	const dataData = {
		labels: labels, //['Mon1', 'Mon2', 'Mon3', 'Mon4', 'Mon5', 'Mon6', 'Mon7', 'Mon8', 'Mon9', 'Mon10', 'Mon11', 'Mon12'],
		datasets: [
			{
				label: "",
				// data: [20, 32, 11, 29, 10, 25, 30, 27, 100, 320, 28, 100],
				data: data, //Array.from({length: 12}, () => Math.floor(Math.random() * 100)),
				borderColor: index % 2 == 0 ? "#FFDB5A" : "#1F66FF",
				borderWidth: 2,
				pointStyle: false,
			},
		],
	};

	return { dataData, trxData };
};
