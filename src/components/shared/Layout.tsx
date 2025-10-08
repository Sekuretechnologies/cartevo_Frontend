"use client";
import React, { useMemo, useState } from "react";
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import cstyle from "./styles/layout-style.module.scss";
// import Footer from "./Footer";
import { useAuth } from "@/hooks/useAuth";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";
import { useTranslation } from "@/hooks/useTranslation";
import {
	logOut,
	selectCurrentCompany,
	selectCurrentUser,
} from "@/redux/slices/auth";
import { isTokenExpired } from "@/utils/auth";
import { getGlobalVerificationStatus } from "@/utils/kyb-kyc";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
interface LayoutProps {
	title: string;
	children: React.ReactNode;
	backLink?: string;
	goBack?: (data?: any) => void;
}

const Layout: React.FC<LayoutProps> = ({
	children,
	title,
	backLink,
	goBack,
}) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const router = useRouter();
	const pathname = usePathname();
	const dispatch = useDispatch();
	const { createLocalizedLink } = useLocalizedNavigation();
	// const token = useSelector(selectCurrentToken);
	const user = useSelector(selectCurrentUser);
	const company = useSelector(selectCurrentCompany);
	const { token, isAuthenticated, isChecking } = useAuth();
	const { t }: { t: any } = useTranslation();

	// Determine current section after [locale]
	const pathSegments = (pathname || "").split("/").filter(Boolean);
	const sectionAfterLocale = pathSegments[1] || ""; // e.g., /fr/onboarding -> onboarding
	const isOnboardingRoute = sectionAfterLocale === "onboarding";

	// Consider onboarding traversed if completed or if any verification submitted (kyc/kyb not NONE)
	const kycStatus = user?.kycStatus || "NONE";
	const kybStatus = company?.kybStatus || "NONE";

	const status = useMemo(() => {
		const kycStatus = user?.kycStatus || "NONE";
		const kybStatus = company?.kybStatus || "NONE";
		return getGlobalVerificationStatus(kycStatus, kybStatus);
	}, [user, company]);

	useEffect(() => {
		console.log("Layout: user", user);
		console.log("Layout: company", company);
	}, [user, company]);

	/** //////////////////////////////////////////// */
	// useEffect(() => {
	// 	if (typeof window !== "undefined") {
	// 		window.document.title = capitalize(title);
	// 	}
	// }, [title]);

	useEffect(() => {
		// Don't check auth while still validating
		if (isChecking) return;

		// Check if user is not authenticated
		if (!isAuthenticated) {
			window.sessionStorage.setItem("previousUrl", pathname);
			router.push(createLocalizedLink("/login"));
			return;
		}

		// Additional check for stored token expiration (fallback)
		// const storedToken = localStorage.getItem("sktoken");
		if (token && isTokenExpired(token)) {
			dispatch(logOut());
			window.sessionStorage.setItem("previousUrl", pathname);
			router.push(createLocalizedLink("/login"));
		}
	}, [isAuthenticated, isChecking, router, pathname, dispatch]);

	useEffect(() => {
		if (token && (pathname === "/login" || pathname === "/verify-otp")) {
			company?.onboarding_is_completed
				? router.push(createLocalizedLink("/wallets"))
				: router.push(createLocalizedLink("/onboarding"));
		}
	}, [pathname]);

	const { navigateTo } = useLocalizedNavigation();

	// useEffect(() => {
	// 	// const sktoken = localStorage.getItem('sktoken');
	// 	const previousUrl = window.sessionStorage.getItem("previousUrl");
	// 	if (token && pathname == "/login") {
	// 		// router.push(previousUrl || urls.usersAccounts.root);
	// 		if (
	// 			user.admin_role === "customer-support" ||
	// 			user.admin_role === "customer-support-chief"
	// 		) {
	// 			router.push(previousUrl || urlsV2.kyc.root);
	// 		} else if (user.admin_role === "guest") {
	// 			router.push(urlsV1V2.dashboardHome.root);
	// 		} else if (hasPermission(user, "home", "view")) {
	// 			router.push(previousUrl || urlsV2.dashboardHome.root);
	// 		}
	// 	}

	// if (
	// 	token &&
	// 	pathname !== "/login" &&
	// 	(!user?.role || user?.role !== "admin" || !user?.admin_role)
	// ) {
	// 	router.push("/login");
	// }

	// 	if (
	// 		token &&
	// 		(pathname == "/dashboard/retrait-gb" ||
	// 			pathname == "/retrait-gb") &&
	// 		!hasPermission(user, "retrait_gb", "view")
	// 	) {
	// 		router.push(previousUrl || urlsV2.dashboardHome.root);
	// 	}
	// 	// if(token && (pathname=='/dashboard/retrait-gb' || pathname=='/retrait-gb') ) {
	// 	// 	router.push(previousUrl || urls.dashboardHome.root);
	// 	// }

	// 	if (
	// 		token &&
	// 		(user.admin_role === "customer-support" ||
	// 			user.admin_role === "customer-support-chief") &&
	// 		!pathname.startsWith(urls.usersAccounts.root) &&
	// 		!pathname.startsWith(urlsV2.usersAccounts.root) &&
	// 		!pathname.startsWith(urlsV2.kyc.root) &&
	// 		!pathname.startsWith(urlsV2.notifications.root) &&
	// 		!pathname.startsWith(urlsV2.payment_services.root) &&
	// 		!pathname.startsWith(urlsV2.customer_tickets.root) &&
	// 		!pathname.startsWith(urlsV2.regularisations.root)
	// 	) {
	// 		router.push(previousUrl || urlsV2.kyc.root);
	// 	}

	// 	if (
	// 		token &&
	// 		user.admin_role === "guest" &&
	// 		!pathname.startsWith(urlsV1V2.dashboardHome.root)
	// 	) {
	// 		router.push(urlsV1V2.dashboardHome.root);
	// 	}
	// }, [pathname]);

	/** //////////////////////////////////////////// */

	return (
		<main className="flex w-full bg-[#f5f5f5]">
			<div className="relative">
				<SideBar
					user={user}
					isExpanded={isExpanded}
					setIsExpanded={setIsExpanded}
				/>
			</div>
			<div
				className={`${cstyle["layout-container"]} flex flex-col w-full `}
				style={{
					width: isExpanded
						? "calc(100vw - 300px)"
						: "calc(100vw - 120px)",
					transition: "all ease-in .3s",
				}}
			>
				<div className="relative w-full">
					<Navbar
						title={title}
						goBack={goBack}
						backLink={backLink}
						isExpanded={isExpanded}
					/>
				</div>
				{!isOnboardingRoute &&
					(status === "NONE" || status === "REJECTED") && (
						<div className="border-[1px] w-full py-2  flex flex-col gap-y-2 border-gray-300 border-dotted bg-primary-50">
							<h3 className=" text-center mt-2">
								{t.layout.preProductionBanner.title}
							</h3>
							<div className="flex justify-center items-center w-full">
								<h4
									text-center
									className="text-sm text-center max-w-[80%]"
								>
									{t.layout.preProductionBanner.description}{" "}
									<span className="font-semibold">
										{
											t.layout.preProductionBanner
												.transactions
										}
									</span>{" "}
									:{" "}
									{
										t.layout.preProductionBanner
											.transactionsLimit
									}
									<span className="font-semibold">
										{" "}
										{
											t.layout.preProductionBanner.cards
										}{" "}
									</span>{" "}
									: {t.layout.preProductionBanner.cardsLimit}{" "}
									,{" "}
									<span className="font-semibold">
										{" "}
										{
											t.layout.preProductionBanner
												.currencies
										}
									</span>{" "}
									:{" "}
									{
										t.layout.preProductionBanner
											.currenciesLimit
									}
									{
										t.layout.preProductionBanner
											.unlockProduction
									}{" "}
									<span
										className="font-semibold cursor-pointer underline"
										onClick={() =>
											navigateTo("/onboarding")
										}
									>
										{
											t.layout.preProductionBanner
												.goToProduction
										}
									</span>
								</h4>
							</div>
						</div>
					)}

				{!isOnboardingRoute && status === "PENDING" && (
					<div className="border-[1px] w-full py-2 flex flex-col gap-y-2 border-gray-300 border-dotted bg-primary-50">
						<h3 className="text-center mt-2 uppercase font-semibold">
							{t.layout.submittedInfoBanner.title}
						</h3>
						<div className="flex justify-center items-center w-full">
							<h4 className="text-sm text-center max-w-[80%]">
								{t.layout.submittedInfoBanner.description}
							</h4>
						</div>
						<div className="flex justify-center items-center w-full">
							<p className="text-sm text-center max-w-[80%]">
								{t.layout.submittedInfoBanner.patienceNote}
							</p>
						</div>
					</div>
				)}
				<div className="pl-5 md:pl-10 pr-5 md:pr-0   pt-10 pb-10 w-full ">
					{children}
				</div>

				<footer className="mt-4 mb-4 text-center text-gray-500 text-sm">
					<p>
						© {new Date().getFullYear()} Cartevo. All rights
						reserved.
					</p>
				</footer>
			</div>
			{/* <Modal/>    */}
		</main>
	);
};

export default Layout;

// export async function getServerSideProps(context) {
//   return {
//     props: {},
//   };
// }
