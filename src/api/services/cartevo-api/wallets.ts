import BaseMethods from "../../baseMethods";
import { companyUrls, walletUrls } from "../urls";

export class WalletService {
	static get_wallets = ({ token }: { token: string }) => {
		let query_params: any = {};
		return BaseMethods.getRequest(
			walletUrls.GET_WALLETS,
			true,
			query_params,
			token
		);
	};

	static create_wallet = ({ token, body }: { token: string; body: any }) =>
		BaseMethods.postRequest(
			walletUrls.CREATE_WALLET,
			body,
			true,
			{},
			token
		);

	static fund_wallet = ({ token, body }: { token: string; body: any }) =>
		BaseMethods.postRequest(walletUrls.FUND_WALLET, body, true, {}, token);

	static deposit_to_wallet = ({
		token,
		body,
	}: {
		token: string;
		body: any;
	}) =>
		BaseMethods.postRequest(
			walletUrls.DEPOSIT_TO_WALLET,
			body,
			true,
			{},
			token
		);

	static credit_test_wallet = ({
		token,
		body,
	}: {
		token: string;
		body: any;
	}) =>
		BaseMethods.postRequest(
			walletUrls.CREDIT_TEST_WALLET,
			body,
			true,
			{},
			token
		);

	static get_transactions = ({ token }: { token: string }) => {
		let query_params: any = {};
		return BaseMethods.getRequest(
			walletUrls.GET_TRANSACTIONS,
			true,
			query_params,
			token
		);
	};

	static get_onboarding_steps = ({ token }: { token: string }) => {
		let query_params: any = {};
		return BaseMethods.getRequest(
			companyUrls.GET_ONBOARDING_STEPS,
			true,
			query_params,
			token
		);
	};

	// static get_kyc_stats = (filter?:string) =>{
	//     let query_params:any = {};
	//     if(filter) query_params.filter =filter;
	//     return BaseMethods.getRequest(userUrls.GET_KYC_STATS, true, query_params);
	// }
	// static get_all_customers = ({filter, searchTerm}: {filter?:string, searchTerm?:string}) =>{
	//     let query_params:any = {};
	//     if(filter) query_params.filter =filter;
	//     if(searchTerm) query_params.searchTerm =searchTerm;
	//     // console.log("get_all_customers : ", filter, searchTerm);

	//     return BaseMethods.getRequest(userUrls.GET_CUSTOMERS, true, query_params);
	// }
	// static get_customers_stats = (filter?:string) =>{
	//     let query_params:any = {};
	//     if(filter) query_params.filter =filter;
	//     return BaseMethods.getRequest(userUrls.GET_CUSTOMERS_STATS, true, query_params);
	// }
	// static get_one_customer= (id:string) =>{
	//     return BaseMethods.getRequest(userUrls.GET_ONE_CUSTOMER(id), true);
	// }
	// static get_one_customer_transactions= (id:string) =>{
	//     return BaseMethods.getRequest(userUrls.GET_ONE_CUSTOMER_TRANSACTIONS(id), true);
	// }
	// static get_one_customer_transfers= (id:string) =>{
	//     return BaseMethods.getRequest(userUrls.GET_ONE_CUSTOMER_TRANSFERS(id), true);
	// }
	// static block_user_account = ({ userId, customerId, body }: { userId:string, customerId:string, body:any }) => {
	//     let query_params:any = {};
	//     if(userId) query_params.adminUserId =userId;
	//     return BaseMethods.putRequest(userUrls.BLOCK_USER_ACCOUNT(customerId), body, true, query_params);
	// }
	// static unblock_user_account = ({ customerId, body }: {customerId:string, body:any}) => {
	//     // let query_params:any = {};
	//     // if(customerId) query_params.customerId =customerId;
	//     return BaseMethods.putRequest(userUrls.UNBLOCK_USER_ACCOUNT(customerId), body, true);
	// }
	// static activate_user_account = ({ userId, customerId, body }: { userId:string, customerId:string, body:any }) => {
	//     let query_params:any = {};
	//     if(userId) query_params.adminUserId =userId;
	//     return BaseMethods.putRequest(userUrls.ACTIVATE_USER_ACCOUNT(customerId), body, true, query_params);
	// }

	// static update_user_infos = ({ userId, customerId, body }: { userId:string, customerId:string, body:any }) => {
	//     let query_params:any = {};
	//     if(userId) query_params.adminUserId =userId;
	//     return BaseMethods.putRequest(userUrls.UPDATE_USER_INFOS(customerId), body, true, query_params);
	// }
	// static update_user_password = ({ userId, customerId, body }: { userId:string, customerId:string, body:any }) => {
	//     let query_params:any = {};
	//     if(userId) query_params.adminUserId =userId;
	//     return BaseMethods.putRequest(userUrls.UPDATE_USER_PASSWORD(customerId), body, true, query_params);
	// }
	// static update_user_photo = ({ userId, customerId, body }: { userId:string, customerId:string, body:any }) => {
	//     let query_params:any = {};
	//     if(userId) query_params.adminUserId =userId;
	//     return BaseMethods.putFileRequest(userUrls.UPDATE_USER_PHOTO(customerId), body, true, query_params);
	// }
	// static update_user_selfie = ({ userId, customerId, body }: { userId:string, customerId:string, body:any }) => {
	//     let query_params:any = {};
	//     if(userId) query_params.adminUserId =userId;
	//     console.log("update_user_selfie :::", body);

	//     return BaseMethods.putFileRequest(userUrls.UPDATE_USER_SELFIE(customerId), body, true, query_params);
	// }
	// static update_user_paper_images = ({ userId, customerId, body }: { userId:string, customerId:string, body:any }) => {
	//     let query_params:any = {};
	//     if(userId) query_params.adminUserId =userId;
	//     return BaseMethods.putFileRequest(userUrls.UPDATE_USER_PAPER_IMAGES(customerId), body, true, query_params);
	// }
	// static update_user_verification_status = ({ userId, customerId, body }: { userId:string, customerId:string, body:any }) => {
	//     let query_params:any = {};
	//     if(userId) query_params.adminUserId =userId;
	//     return BaseMethods.putRequest(userUrls.UPDATE_USER_VERIFICATION_STATUS(customerId), body, true, query_params);
	// }

	// static get_user_orders = () =>
	//     BaseMethods.getRequest(userUrls.GET_USER_ORDERS, true);
	// static get_current_user = () =>
	//     BaseMethods.getRequest(userUrls.CURRENT_USER, true);
	// static change_user_password = (infos:any) =>
	//     BaseMethods.postRequest(userUrls.CHANGE_USER_PASSWORD, infos, true);
	// static update_user_address = (id:any, infos:any) =>
	//     BaseMethods.postRequest(userUrls.UPDATE_USER_ADDRESS(id), infos, true);
	// static add_user_address = (infos:any) =>
	//     BaseMethods.postRequest(userUrls.ADD_USER_ADDRESS, infos, true);
}
