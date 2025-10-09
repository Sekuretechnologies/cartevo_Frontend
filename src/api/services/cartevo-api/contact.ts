import BaseMethods from "@/api/baseMethods";
import { contactUrls } from "@/api/urls";

export class ContactService {
	static send_message = ({ body }: { body: any }) =>
		BaseMethods.postRequest(contactUrls.SEND_MESSAGE, body, false, {}, "");
	static get_My_Message = ({ token }: { token: string }) =>
		BaseMethods.getRequest(contactUrls.GET_MY_MESSAGE, true, {}, token);
	static send_auth_message = ({
		body,
		token,
	}: {
		body: any;
		token: string;
	}) =>
		BaseMethods.postRequest(
			contactUrls.SEND_AUTH_URL,
			body,
			true,
			{},
			token
		);
}
