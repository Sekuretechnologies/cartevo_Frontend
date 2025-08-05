import BaseMethods from "../baseMethods";
import { notificationUrls, notificationUrlsV2 } from "../urls";

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
			notificationUrls.GET_NOTIFICATIONS,
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
			notificationUrls.SEND_NOTIFICATION,
			body,
			true,
			query_params
		);
	};
}
