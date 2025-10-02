import { layoutTranslationsEn } from "@/locales/translation/layout/layout-en";
import { onboardingTranslations } from "@/locales/translation/onboarding/onboarding";
import { buttonsTranslationsEn } from "./translation/buttons/buttons-en";
import { contactEn } from "./translation/contact/contact-en";
import { forgotPasswordEn } from "./translation/forgot-password/forgotPassword-en";
import { homeTranslationsEn } from "./translation/home/home-en";
import { loginEn } from "./translation/login/login-en";
import { pricingEn } from "./translation/pricing/pricing-en";
import { registerEn } from "./translation/register/register-en";
import { resetPasswordEn } from "./translation/reset-password/resetPassword-en";
import { signUpEn } from "./translation/sign-up/signUp-en";
import { verifyOtpTranslationsEn } from "./translation/verifyOtp/verifyOtp-en";
import { walletsTranslations } from "./translation/wallets/wallets";
import { websiteFooterEn } from "./translation/websiteFooter/websiteFooter-en";
import { websiteNavBarEn } from "./translation/websiteNavBar/websiteNavBar-en";

export default {
	hello: "Hello",
	onboarding: onboardingTranslations,
	layout: layoutTranslationsEn,
	verifyOtp: verifyOtpTranslationsEn,
	wallets: walletsTranslations,
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
} as const;
