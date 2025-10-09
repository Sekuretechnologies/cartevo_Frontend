import { layoutTranslationsEn } from "@/locales/translation/layout/layout-en";
import { onboardingTranslations } from "@/locales/translation/onboarding/onboarding";
import { buttonsTranslationsEn } from "./translation/buttons/buttons-en";
import { cardsTranslations } from "./translation/cards/cards";
import { contactEn } from "./translation/contact/contact-en";
import { customersEn } from "./translation/dashboard/customer/customer-En";
import { developerEn } from "./translation/dashboard/developers/developer-En";
import { transactionEn } from "./translation/dashboard/transactions/transaction-En";
import { forgotPasswordEn } from "./translation/forgot-password/forgotPassword-en";
import { homeTranslationsEn } from "./translation/home/home-en";
import { loginEn } from "./translation/login/login-en";
import { navBarEn } from "./translation/navBar/navBar-En";
import { pricingEn } from "./translation/pricing/pricing-en";
import { privacyEn } from "./translation/privacy_policy/privacy_policy-en";
import { registerEn } from "./translation/register/register-en";
import { resetPasswordEn } from "./translation/reset-password/resetPassword-en";
import { settingsTranslations } from "./translation/settings/settings";
import { sideBarEn } from "./translation/sideBar/sideBar-En";
import { signUpEn } from "./translation/sign-up/signUp-en";
import { statusEn } from "./translation/status/status-En";
import { termen } from "./translation/term/term-en";
import { verifyOtpTranslationsEn } from "./translation/verifyOtp/verifyOtp-en";
import { walletsTranslations } from "./translation/wallets/wallets";
import { websiteFooterEn } from "./translation/websiteFooter/websiteFooter-en";
import { websiteNavBarEn } from "./translation/websiteNavBar/websiteNavBar-en";
import { websiteScriptEn } from "./translation/websiteScript/websiteScript-en";

export default {
	hello: "Hello",
	onboarding: onboardingTranslations,
	layout: layoutTranslationsEn,
	verifyOtp: verifyOtpTranslationsEn,
	wallets: walletsTranslations,
	cards: cardsTranslations,
	settings: settingsTranslations,
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
	sideBar: sideBarEn,
	customers: customersEn,
	transaction: transactionEn,
	status: statusEn,
	developer: developerEn,
	navBar: navBarEn,
	websiteScript: websiteScriptEn,
	term: termen,
} as const;
