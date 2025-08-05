import BaseMethods from "@/api/baseMethods";
import { notificationUrlsV2 } from "../../urls";

export class NotificationService {
	static get_all_notifcations = ({
		filter,
		searchTerm,
	}: {
		filter?: string;
		searchTerm?: string;
	}) => {
		let query_params: any = {};
		if (filter) query_params.filter = filter;
		if (searchTerm) query_params.searchTerm = searchTerm;
		return BaseMethods.getRequest(
			notificationUrlsV2.GET_NOTIFICATIONS,
			true,
			query_params
		);
	};

	static get_user_notifcations = ({
		customerId,
		filter,
		searchTerm,
	}: {
		customerId: string;
		filter?: string;
		searchTerm?: string;
	}) => {
		let query_params: any = {};
		if (filter) query_params.filter = filter;
		if (searchTerm) query_params.searchTerm = searchTerm;
		return BaseMethods.getRequest(
			notificationUrlsV2.GET_USER_NOTIFICATIONS(customerId),
			true,
			query_params
		);
	};

	static send_notifcation = ({
		adminUserId,
		body,
	}: {
		adminUserId: string;
		body: any;
	}) => {
		let query_params: any = {};
		if (adminUserId) query_params.adminUserId = adminUserId;
		return BaseMethods.postRequest(
			notificationUrlsV2.SEND_NOTIFICATION,
			body,
			true,
			query_params
		);
	};

	static send_whatsapp_notifcation = ({
		adminUserId,
		body,
	}: {
		adminUserId: string;
		body: any;
	}) => {
		let query_params: any = {};
		if (adminUserId) query_params.adminUserId = adminUserId;
		return BaseMethods.postRequest(
			notificationUrlsV2.SEND_WHATSAPP_NOTIFICATION,
			body,
			true,
			query_params
		);
	};
}
