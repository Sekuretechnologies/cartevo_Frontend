import BaseMethods from "../../baseMethods";
import { authUrls } from "../urls";

export class AuthService {
	static login = (info: any) =>
		BaseMethods.postRequest(authUrls.LOGIN, info, false);
	static logout = (token: string) =>
		BaseMethods.postRequest(authUrls.LOGOUT, {}, true, undefined, token);
	// static resendOtp = () =>
	// 	BaseMethods.postRequest(authUrls.RESEND_OTP, {}, true);
	static verifyOtp = (info: any) =>
		BaseMethods.postRequest(authUrls.VERIFY_OTP, info, false);

	static createAccount = (info: any) =>
		BaseMethods.postRequest(authUrls.CREATE_ACCOUNT, info, false);

	static registerStep1 = (info: any) =>
		BaseMethods.postFileRequest(authUrls.REGISTER_STEP1, info, false);

	static registerStep2 = (info: any) =>
		BaseMethods.postFileRequest(authUrls.REGISTER_STEP2, info, false);
}
