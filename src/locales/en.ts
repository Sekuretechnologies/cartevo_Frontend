import { onboardingTranslations } from "@/locales/translation/onboarding/onboarding";
import { verifyOtpTranslationsEn } from "./translation/verifyOtp/verifyOtp-en";
import { homeTranslationsEn } from "./translation/home/home-en";
import { buttonsTranslationsEn } from "./translation/buttons/buttons-en";
import { websiteNavBarEn } from "./translation/websiteNavBar/websiteNavBar-en";
import { websiteFooterEn } from "./translation/websiteFooter/websiteFooter-en";
import { pricingEn } from "./translation/pricing/pricing-en";
import { contactEn } from "./translation/contact/contact-en";
import { loginEn } from "./translation/login/login-en";
import { signUpEn } from "./translation/sign-up/signUp-en";
import { forgotPasswordEn } from "./translation/forgot-password/forgotPassword-en";
import { resetPasswordEn } from "./translation/reset-password/resetPassword-en";
import { registerEn } from "./translation/register/register-en";
import { privacyEn } from "./translation/privacy_policy/privacy_policy-en";

export default {
	hello: "Hello",
	onboarding: onboardingTranslations,
	verifyOtp: verifyOtpTranslationsEn,
	home: homeTranslationsEn,
	btn: buttonsTranslationsEn,
	websiteNavBar: websiteNavBarEn,
	websiteFooter: websiteFooterEn,
	pricing: pricingEn,
	contact: contactEn,
	login: loginEn,
	signUp: signUpEn,
	forgotPassword: forgotPasswordEn,
	resetPassword: resetPasswordEn,
	register: registerEn,
	privacy: privacyEn,
} as const;
