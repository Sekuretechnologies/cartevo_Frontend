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
} as const;
