import BaseMethods from "@/api/baseMethods";
import { contactUrls } from "@/api/urls";

export class ContactService {
	static send_message = ({ body }: { body: any }) =>
		BaseMethods.postRequest(contactUrls.SEND_MESSAGE, body, false, {}, "");
}
