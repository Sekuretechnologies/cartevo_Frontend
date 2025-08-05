"use client";
import React, { useState } from "react";
import cstyle from "./styles/layout-style.module.scss";
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import Modal from "./Modal/Modal";
// import Footer from "./Footer";
import { useContext, useEffect } from "react";
import { capitalize } from "@/utils/capitalize";
import { context } from "@/context/ApplicationContext";
import { useRouter, usePathname } from "next/navigation";
import { selectCurrentToken, selectCurrentUser } from "@/redux/slices/auth";
import { useSelector } from "react-redux";
import urls from "@/config/urls";
import urlsV2 from "@/config/urls_v2";
import urlsV1V2 from "@/config/urlsv1v2";
import { hasPermission } from "@/utils/permissions";
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
	const token = useSelector(selectCurrentToken);
	const user = useSelector(selectCurrentUser);
	// console.log("token : ", token);

	/** //////////////////////////////////////////// */
	// useEffect(() => {
	// 	if (typeof window !== "undefined") {
	// 		window.document.title = capitalize(title);
	// 	}
	// }, [title]);

	// useEffect(() => {
	// 	if (!token) {
	// 		window.sessionStorage.setItem("previousUrl", pathname);
	// 		router.push("/login");
	// 	}
	// }, [router]);

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

	// 	if (
	// 		token &&
	// 		pathname !== "/login" &&
	// 		(!user?.role || user?.role !== "admin" || !user?.admin_role)
	// 	) {
	// 		router.push("/login");
	// 	}

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
				<div className="pl-5 md:pl-10 pr-5 md:pr-0   pt-10 pb-10 w-full ">
					{children}
				</div>
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
