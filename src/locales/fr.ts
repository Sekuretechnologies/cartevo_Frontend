import { layoutTranslationsFr } from "@/locales/translation/layout/layout-fr";
import { onboardingTranslationsFr } from "@/locales/translation/onboarding/onboarding-fr";
import { buttonsTranslationsFr } from "./translation/buttons/buttons-fr";
import { cardsTranslationsFr } from "./translation/cards/cards-fr";
import { contactFr } from "./translation/contact/contact-fr";
import { customersFr } from "./translation/dashboard/customer/customer-Fr";
import { developerFr } from "./translation/dashboard/developers/developer-Fr";
import { transactionFr } from "./translation/dashboard/transactions/transaction-Fr";
import { forgotPasswordFr } from "./translation/forgot-password/forgotPassword-fr";
import { homeTranslationsFr } from "./translation/home/home-fr";
import { loginFr } from "./translation/login/login-fr";
import { navBarFr } from "./translation/navBar/navBar-Fr";
import { pricingFr } from "./translation/pricing/pricing-fr";
import { privacyFr } from "./translation/privacy_policy/privacy_policy-fr";
import { registerFr } from "./translation/register/register-fr";
import { resetPasswordFr } from "./translation/reset-password/resetPassword-fr";
import { settingsTranslationsFr } from "./translation/settings/settings-fr";
import { sideBarFr } from "./translation/sideBar/sideBar-Fr";
import { signUpFr } from "./translation/sign-up/signUp-fr";
import { statusFr } from "./translation/status/status-Fr";
import { termfr } from "./translation/term/term-fr";
import { verifyOtpTranslationsFr } from "./translation/verifyOtp/verifyOtp-fr";
import { walletsTranslationsFr } from "./translation/wallets/wallets-fr";
import { websiteFooterFr } from "./translation/websiteFooter/websiteFooter-fr";
import { websiteNavBarFr } from "./translation/websiteNavBar/websiteNavBar-fr";
import { websiteScriptFr } from "./translation/websiteScript/websiteScript-fr";

export default {
	onboarding: onboardingTranslationsFr,
	layout: layoutTranslationsFr,
	verifyOtp: verifyOtpTranslationsFr,
	wallets: walletsTranslationsFr,
	cards: cardsTranslationsFr,
	settings: settingsTranslationsFr,
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
	websiteScript: websiteScriptFr,
	term: termfr,
} as const;
