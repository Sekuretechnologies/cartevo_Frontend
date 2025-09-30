import urls from "@/config/urls";
import { selectCurrentVersion } from "@/redux/slices_v2/settings";
import { RootState } from "@/redux/store";
import { Wallet as Wallets } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
	FaChevronLeft,
	FaChevronRight,
	FaCreditCard,
	FaUsers,
} from "react-icons/fa";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { LuSettings2 } from "react-icons/lu";
import { useSelector } from "react-redux";
import Logo from "../shared/Logo";
import {
	Accueil,
	Cards,
	Company,
	Developers,
	Identity,
	Parameters,
	Transaction,
	Users,
	Wallet,
} from "./icons";
import cstyle from "./styles/sidebar-style.module.scss";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";

type Props = {
	isExpanded: boolean;
	setIsExpanded: (value: boolean) => void;
	user: any;
};

const SideBar = ({ isExpanded, setIsExpanded, user }: Props) => {
	const pathname = usePathname();
    const { createLocalizedLink} = useLocalizedNavigation();
	const clearance = useSelector(
		(state: RootState) => (state.auth.company as any)?.clearance
	);
	const isAdmin = clearance === "admin";
	const currentVersion = useSelector(selectCurrentVersion);

	const [isAdminView, setIsAdminView] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [isClient, setIsClient] = useState(false);

	// Init côté client et récupération de la valeur persistée
	useEffect(() => {
		setIsClient(true);
		const saved = localStorage.getItem("isAdminView");
		if (saved) {
			setIsAdminView(JSON.parse(saved));
		}
	}, []);

	// Persistance dans localStorage
	const toggleAdminView = () => {
		setIsAdminView((prev: boolean) => {
			localStorage.setItem("isAdminView", JSON.stringify(!prev));
			return !prev;
		});
	};

	const SideBarLinksAdmin = [
		{
			title: "Approvals",
			slug: "Approvals",
			canSee: true,
			path: urls.Approvals.root,
			count: null,
			icon: <Identity />,
		},
		{
			title: "Users",
			slug: "Users",
			canSee: true,
			path: urls.user.root,
			count: null,
			icon: <FaUsers size={20} />,
		},
		{
			title: "Companies",
			slug: "Companies",
			canSee: true,
			path: urls.company.root,
			count: null,
			icon: <Company />,
		},
		{
			title: "Cards",
			slug: "Cards",
			canSee: true,
			path: urls.cardsAdmin.root,
			count: null,
			icon: <FaCreditCard size={20} />,
		},
		{
			title: "Transactions",
			slug: "Transactions",
			canSee: true,
			path: urls.adminTransaction.root,
			count: null,
			icon: <FaArrowRightArrowLeft size={20} />,
		},
		{
			title: "Settings",
			slug: "Settings",
			canSee: true,
			path: urls.adminSettings.root,
			count: null,
			icon: <LuSettings2 size={20} />,
		},
		{
			title: "Wallets",
			slug: "wallets1",
			canSee: true,
			path: urls.adminWallets.root,
			count: null,
			icon: <Wallets size={20} />,
		},
	];

	const SideBarLinksV2 = [
		{
			title: "Onboarding",
			slug: "onboarding",
			canSee: true,
			path: urls.onboarding.root,
			count: null,
			icon: <Accueil />,
		},
		{
			title: "Wallets",
			slug: "wallets",
			canSee: true,
			path: urls.wallets.root,
			count: null,
			icon: <Wallet />,
		},
		{
			title: "Customers",
			slug: "customers",
			canSee: true,
			path: urls.customers.root,
			count: null,
			icon: <Users />,
		},
		{
			title: "Cards",
			slug: "cards",
			canSee: true,
			path: urls.cards.root,
			count: null,
			icon: <Cards />,
		},
		{
			title: "Transactions",
			slug: "transactions",
			canSee: true,
			path: urls.transactions.root,
			count: null,
			icon: <Transaction />,
		},
		{
			title: "Developers",
			slug: "developers",
			canSee: true,
			path: urls.developers.root,
			count: null,
			icon: <Developers />,
		},
		{
			title: "Settings",
			slug: "settings",
			canSee: true,
			path: urls.settings.root,
			count: null,
			icon: <Parameters />,
		},
	];

	return (
		<div className="relative bg-white">
			{/* Hamburger menu */}
			<div className="absolute z-[2000] w-[50px] h-[30px] top-[15px] right-[0px] text-[34px] ml-[15px] mt-[30px] mb-[20px]">
				<div
					className={`pb-[30px] md:hidden block ${cstyle["hamburger-menu"]}`}
				>
					<input
						id="menuToggle"
						className={`${cstyle["menu__toggle"]}`}
						type="checkbox"
						checked={isOpen}
						onChange={(e) => setIsOpen(e.target.checked)}
					/>
					<label
						className={`${cstyle["menu__btn"]}`}
						htmlFor="menuToggle"
					>
						<span></span>
					</label>
				</div>
			</div>

			{/* Sidebar */}
			{isClient && (isOpen || window.innerWidth > 760) && (
				<div
					style={{ zIndex: 10, width: isExpanded ? "250px" : "80px" }}
					className={cstyle["sidebar-container"]}
				>
					<div
						style={{ width: isExpanded ? "250px" : "80px" }}
						className="fixed bg-white pt-[22px] pb-[20px] h-full flex flex-col gap-0 border-t-4 border-r-4 border-gray-200"
					>
						{/* Toggle chevrons */}
						<div>
							<input
								type="checkbox"
								hidden
								checked={isExpanded}
								onChange={(e) =>
									setIsExpanded(e.target.checked)
								}
								id="sidebarToggleInput"
								className={`${cstyle["sidebar-toggle-input"]}`}
							/>
							<label
								className={`${cstyle["sidebar-toggle"]}`}
								htmlFor="sidebarToggleInput"
							>
								<span className={`${cstyle["chevronLeft"]}`}>
									<FaChevronLeft color="#444" />
								</span>
								<span className={`${cstyle["chevronRight"]}`}>
									<FaChevronRight color="#444" />
								</span>
							</label>
						</div>

						{/* Logo */}
						<div className="pl-[20px] mb-[27px] flex flex-col items-center gap-4">
							<Logo isExpanded={isExpanded} />
						</div>

						{/* Links */}
                        {(isAdminView ? SideBarLinksAdmin : SideBarLinksV2).map(
							(link) => {
                                const currentSegment = pathname?.split("/")[2] || ""; // after [locale]
                                const linkSegment = link.path.split("/")[1] || ""; // path without locale
                                const isActive = currentSegment === linkSegment;
								const iconColor = isActive
									? "fill-[#1F66FF] stroke-[#1F66FF]"
									: "fill-[#000]";
								const iconStrokeColor = isActive
									? "#1F66FF"
									: "#000";

								if (!link.canSee) return null;

								return (
									<li key={link.title} className="relative">
                                        <Link
                                            href={createLocalizedLink(link.path)}
											style={{
												color: isActive
													? "#1F66FF"
													: "#000",
											}}
											className={`relative pl-[22px] pr-3 py-3 flex items-center justify-between gap-[15px] group text-gray-700 hover:bg-app-lightgray hover:pl-7 transition-all ${
												isActive
													? "bg-app-lightgray pl-7 text-app-primary font-bold"
													: ""
											}`}
										>
											<div className="flex items-center gap-[15px]">
												<div
													style={{
														transform: "scale(1.2)",
													}}
												>
													{React.cloneElement(
														link.icon,
														{
															className:
																iconColor,
															strokeColor:
																iconStrokeColor,
															isActive,
														}
													)}
												</div>
												{isExpanded ? (
													<div className="text-[16px]">
														{link.title}
													</div>
												) : (
													<div className="absolute top-0 left-[80px] shadow-lg rounded-md bg-white px-3 py-3 hidden group-hover:block">
														{link.title}
													</div>
												)}
											</div>
										</Link>
									</li>
								);
							}
						)}

						{/* Admin toggle */}
						{isAdmin && (
							<div className="absolute bottom-16 pl-4 mb-5">
								<div className="flex items-center gap-2 mt-3 relative group">
									<button
										onClick={toggleAdminView}
										className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none ${
											isAdminView
												? "bg-blue-500"
												: "bg-gray-300"
										}`}
									>
										<span
											className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
												isAdminView
													? "translate-x-6"
													: "translate-x-1"
											}`}
										></span>
									</button>
									{isExpanded ? (
										<span className="text-sm text-gray-700">
											{isAdminView
												? "Admin View"
												: "User View"}
										</span>
									) : (
										<span className="absolute left-full ml-2 px-2 py-1 bg-white rounded shadow text-gray-700 text-sm whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 z-50">
											{isAdminView
												? "Admin View"
												: "User View"}
										</span>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default SideBar;
