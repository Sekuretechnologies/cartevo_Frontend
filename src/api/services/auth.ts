import BaseMethods from "../baseMethods";
import { authUrls, userUrls } from "../urls";

export class AuthService {
	static login = (info: any) =>
		BaseMethods.postRequest(authUrls.LOGIN, info, false);
	static logout = (info: any) =>
		BaseMethods.postRequest(authUrls.LOGOUT, info, true);
	// static resendOtp = () =>
	// 	BaseMethods.postRequest(authUrls.RESEND_OTP, {}, true);
	static verifyOtp = (info: any) =>
		BaseMethods.postRequest(authUrls.VERIFY_OTP, info, true);
	// static register = (info:any) =>
	//     BaseMethods.postRequest(authUrls.REGISTER_USER, info, false);
	// static current_user = () =>
	//     BaseMethods.getRequest(userUrls.CURRENT_USER, true);
}
