import BaseMethods from "@/api/baseMethods";
import { adminUrls } from "@/api/urls";
import { string } from "zod";

export class AdminService {
	static get_Companies = ({ token }: { token: string }) => {
		let query_params: any = {};
		return BaseMethods.getRequest(
			adminUrls.GET_COMPANIES,
			true,
			query_params,
			token
		);
	};
}
