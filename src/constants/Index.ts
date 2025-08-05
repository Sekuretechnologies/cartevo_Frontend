export {
	headerUserAccountData,
	headerUserAccountDataV2,
} from "./UserAccountData";
export { tableUserAccountData } from "./UserAccountData";
export { headerHomeUserAccountData } from "./HomeUserAccountData";
export { tableHomeUserAccountData } from "./HomeUserAccountData";
export { headerProfitData } from "./ProfitData";
export { tableProfitData } from "./ProfitData";
export { headerKYCData } from "./KYCData";
export { tableKYCData } from "./KYCData";
export {
	headerTransactionData,
	headerCardTransactionData,
	headerTransferData,
} from "./TransactionData";

export { tableTransactionData } from "./TransactionData";
export {
	dualData,
	trxData,
	doughnutData,
	pieData,
	pieData2,
	gradientData1,
} from "./graphData";

export {
	checkCircleIcon,
	ongoingCircleIcon,
	waitCircleIcon,
	haltCircleIcon,
	transferIcon,
	calendarIcon,
	transferIconToday,
	transferIconAvg,
	transferIconTotal,
	mobileMoneyIcon,
	sekureIcon,
	transferIconMomoToday,
	transferIconMomoTotal,
	transferIconSekureToday,
	transferIconSekureTotal,
	transactionIcon,
	transactionIconToday,
	transactionIconAvg,
	transactionIconTotal,
	depositIconToday,
	withdrawalIconToday,
} from "./icons";

import { Transferts } from "@/components/Tables/Column";

export const kycRejectReasons: any = {
	FACE_NOT_LIVE: "Selfie flou",
	FACE_NOT_FOUND: "Pas de visage sur le selfie",
	DOCUMENT_FACE_NOT_FOUND: "Pas de visage sur le document",
	DOCUMENT_FRONT_MISSING: "Recto du document manquant",
	DOCUMENT_BACK_MISSING: "Verso du document manquant",
	FACE_PREVIOUSLY_ONBOARDED:
		"Visage du selfie correspond à un autre utilisateur",
	MISSING_NAME: "Absence du nom sur le document",
	MISSING_DOCUMENT_NUMBER:
		"Absence du numero d'identification sur le document",
	FACE_LIVENESS_TOO_FAR_FROM_CAMERA: "Visage trop loin de la camera",
	FACE_MISMATCH:
		"Incompatibilité entre le visage du selfie et celui du document",
	NAME_MISMATCH: "Incompatibilité entre le nom fourni et celui du document",
	BIRTHDATE_MISMATCH:
		"Incompatibilité entre la date de naissance fournie et celle du document",
	DOCUMENT_NUMBER_MISMATCH:
		"Incompatibilité entre le numero d'identification fourni et celui du document",
	UNRECOGNIZED_DOCUMENT: "Document non reconnu",
	MISSING_EMAIL: "Absence d'email",
	MISSING_PHONE_NUMBER: "Absence de numero de telephone",
	WRONG_EMAIL: "Email incorrect",
	WRONG_PHONE_NUMBER: "Numero de telephone incorrect",
	EMAIL_NOT_VERIFIED: "Email non verifié",
	PHONE_NUMBER_NOT_VERIFIED: "Numero de telephone non verifié",
	WRONG_IDENTIFICATION_NUMBER: "Numero d'identité incorrect",
};

export const data: Transferts[] = [
	{
		id: 1,
		Nom: "Talla oyono Richnel",
		Pays: "Cameroun",
		Numero: "+237 655 89 74 22",
		Adresse_Mail: "oyonotalla@gmail.com",
		solde_cpt: "2 455 000 F",
		Total_trans: "44 250 000 F",
		Moy_trans: "250 000 f/sem",
		Statut: "active",
		creation: "14/04/23",
	},
	// {
	//   id: 2,
	//   Nom: "Talla oyono Richnel",
	//   Pays: "Cameroun",
	//   Numero: "+237 655 89 74 22",
	//   Adresse_Mail: "oyonotalla@gmail.com",
	//   solde_cpt: "2 455 000 F",
	//   Total_trans: "44 250 000 F",
	//   Moy_trans: "250 000 f/sem",
	//   Statut: "active",
	//   creation: "14/04/23"
	// },
	// {
	//   id: 3,
	//   Nom: "Talla oyono Richnel",
	//   Pays: "Cameroun",
	//   Numero: "+237 655 89 74 22",
	//   Adresse_Mail: "oyonotalla@gmail.com",
	//   solde_cpt: "2 455 000 F",
	//   Total_trans: "44 250 000 F",
	//   Moy_trans: "250 000 f/sem",
	//   Statut: "active",
	//   creation: "14/04/23"
	// },
	// {
	//   id: 4,
	//   Nom: "Talla oyono Richnel",
	//   Pays: "Cameroun",
	//   Numero: "+237 655 89 74 22",
	//   Adresse_Mail: "oyonotalla@gmail.com",
	//   solde_cpt: "2 455 000 F",
	//   Total_trans: "44 250 000 F",
	//   Moy_trans: "250 000 f/sem",
	//   Statut: "active",
	//   creation: "14/04/23"
	// },
	// {
	//   id: 5,
	//   Nom: "Talla oyono Richnel",
	//   Pays: "Cameroun",
	//   Numero: "+237 655 89 74 22",
	//   Adresse_Mail: "oyonotalla@gmail.com",
	//   solde_cpt: "2 455 000 F",
	//   Total_trans: "44 250 000 F",
	//   Moy_trans: "250 000 f/sem",
	//   Statut: "active",
	//   creation: "14/04/23"
	// }
];

// export const doughnutData = {
//   labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//   datasets: [
//     {
//       label: 'My First Dataset',
//       data: [300, 50, 100, 40, 120, 80],
//       backgroundColor: [
//         '#FFDB5A',
//         '#F85D4B',
//         '#FD8A49',
//         '#FD8A49',
//         '#33E89C',
//         '#5BCEFF',
//       ],
//       hoverOffset: 4,
//     },
//   ],
// };
