import { onboardingTranslationsFr } from "@/locales/translation/onboarding/onboarding-fr";
import { verifyOtpTranslationsFr } from "./translation/verifyOtp/verifyOtp-fr";
import { walletsTranslationsFr } from "./translation/wallets/wallets-fr";
import { homeTranslationsFr } from "./translation/home/home-fr";
import { buttonsTranslationsFr } from "./translation/buttons/buttons-fr";
import { websiteNavBarFr } from "./translation/websiteNavBar/websiteNavBar-fr";
import { websiteFooterFr } from "./translation/websiteFooter/websiteFooter-fr";
import { pricingFr } from "./translation/pricing/pricing-fr";
import { contactFr } from "./translation/contact/contact-fr";
import { loginFr } from "./translation/login/login-fr";
import { signUpFr } from "./translation/sign-up/signUp-fr";
import { forgotPasswordFr } from "./translation/forgot-password/forgotPassword-fr";
import { resetPasswordFr } from "./translation/reset-password/resetPassword-fr";
import { registerFr } from "./translation/register/register-fr";
import { privacyFr } from "./translation/privacy_policy/privacy_policy-fr";
import { sideBarFr } from "./translation/sideBar/sideBar-Fr";
import { customersFr } from "./translation/dashboard/customer/customer-Fr";
import { transactionFr } from "./translation/dashboard/transactions/transaction-Fr";
import { statusFr } from "./translation/status/status-Fr";
import { developerFr } from "./translation/dashboard/developers/developer-Fr";
import { navBarFr } from "./translation/navBar/navBar-Fr";

export default {
	onboarding: onboardingTranslationsFr,
	verifyOtp: verifyOtpTranslationsFr,
	wallets: walletsTranslationsFr,
	home: homeTranslationsFr,
	btn: buttonsTranslationsFr,
	websiteNavBar: websiteNavBarFr,
	websiteFooter: websiteFooterFr,
	pricing: pricingFr,
	contact: contactFr,
	login: loginFr,
	signUp: signUpFr,
	forgotPassword: forgotPasswordFr,
	resetPassword: resetPasswordFr,
	register: registerFr,
	privacy: privacyFr,
	sideBar: sideBarFr,
	customers: customersFr,
	transaction: transactionFr,
	status: statusFr,
	developer: developerFr,
	navBar: navBarFr,
} as const;
