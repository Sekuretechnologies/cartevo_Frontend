import { usePathname } from "next/navigation";
import React, { useState } from "react";
// import { Link, NavLink } from 'next-link';
import Link from "next/link";
import {
	FaChevronLeft,
	FaChevronRight,
	FaHandHoldingUsd,
	FaTicketAlt,
	FaUserCheck,
} from "react-icons/fa";
import Logo from "../shared/Logo";
import {
	Accueil,
	Cards,
	Developers,
	Parameters,
	Transaction,
	Users,
	Wallet,
} from "./icons";

import urls from "@/config/urls";
import urlsV1V2 from "@/config/urlsv1v2";
import { selectCurrentVersion } from "@/redux/slices_v2/settings";
import { hasPermission } from "@/utils/permissions";
import { BsBank2 } from "react-icons/bs";
import { FaFilterCircleDollar } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import { useSelector } from "react-redux";
import cstyle from "./styles/sidebar-style.module.scss";

interface ISideBarLinks {
	title: string;
	icon: string;
	path: string;
}

type Props = {
	isExpanded: boolean;
	setIsExpanded: (value: boolean) => void;
	user: any;
};

const SideBar = (props: Props) => {
	const { isExpanded, setIsExpanded, user } = props;
	const pathname = usePathname();

	const currentVersion = useSelector(selectCurrentVersion);

	const [isOpen, setIsOpen] = useState(false);

	console.log("window.innerWidth :: ", window.innerWidth);

	const SideBarLinksV2 = [
		// {
		// 	title: "Home",
		// 	slug: "home",
		// 	canSee: true, // hasPermission(user, "home", "view"),
		// 	path: urls.home.root,
		// 	count: null,
		// 	icon: <Accueil />,
		// },
		{
			title: "Wallets",
			slug: "wallets",
			canSee: true, // hasPermission(user, "user_accounts", "view"),
			path: urls.wallets.root,
			count: null,
			icon: <Wallet />,
		},
		{
			title: "Customers",
			slug: "customers",
			canSee: true, // hasPermission(user, "user_accounts", "view"),
			path: urls.customers.root,
			count: null,
			icon: <Users />,
		},
		{
			title: "Cards",
			slug: "cards",
			canSee: true, // hasPermission(user, "kyc_v2", "view"),
			path: urls.cards.root,
			count: null,
			icon: <Cards />,
		},
		{
			title: "Transactions",
			slug: "transactions",
			canSee: true, // hasPermission(user, "payment_services", "view"),
			path: urls.transactions.root,
			count: null,
			icon: <Transaction />,
		},
		{
			title: "Developers",
			slug: "developers",
			canSee: true, // hasPermission(user, "earnings", "view"),
			path: urls.developers.root,
			count: null,
			icon: <Developers />,
		},
		{
			title: "Settings",
			slug: "settings",
			canSee: true, // hasPermission(user, "notifications", "view"),
			path: urls.settings.root,
			count: null,
			icon: <Parameters />,
		},
	];

	const SideBarLinksV1V2 = [
		{
			title: "Accueil",
			slug: "home",
			canSee: hasPermission(user, "homev1v2", "view"),
			path: urlsV1V2.dashboardHome.root,
			count: null,
			icon: <Accueil />,
		},
	];

	return (
		<div className="relative bg-white">
			<div
				className={`${"absolute z-[2000] w-[50px] h-[30px] top-[15px] right-[0px]"} text-[34px] ml-[15px] mt-[30px] mb-[20px]`}
			>
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

			{isOpen || window.innerWidth > 760 ? (
				<div
					style={{ zIndex: 10, width: isExpanded ? "250px" : "80px" }}
					className={`${cstyle["sidebar-container"]}`}
				>
					<div
						style={{ width: isExpanded ? "250px" : "80px" }}
						className="fixed bg-white pt-[22px] pb-[20px] h-full flex flex-col gap-0 border-t-4 border-r-4 border-gray-200"
					>
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
									<FaChevronLeft color={"#444"} />
								</span>
								<span className={`${cstyle["chevronRight"]}`}>
									<FaChevronRight color={"#444"} />
								</span>
							</label>
						</div>
						<div
							className={`pl-[20px] mb-[27px] ${cstyle["sidebar-logo"]}`}
						>
							<Logo isExpanded={isExpanded} />
						</div>
						<div className="relative">
							<ul
								className="list-image-none w-full my-0 py-0"
								style={{
									marginBlockStart: 0,
									marginBlockEnd: 0,
									paddingInlineStart: 0,
								}}
							>
								<>
									{SideBarLinksV2.map((link, index) => {
										// const isActive = index === 6;
										const isActive =
											pathname?.split("/")[1] ===
											link.path.split("/")[1];

										const iconColor = isActive
											? "fill-[#1F66FF] stroke-[#1F66FF]"
											: "fill-[#000]";
										const iconStrokeColor = isActive
											? "#1F66FF"
											: "#000";

										if (link.canSee) {
											return (
												<li
													key={link.title}
													className={`relative`}
													style={{
														margin: !isExpanded
															? "5px 0"
															: "",
													}}
												>
													<Link
														href={link.path}
														style={{
															color: isActive
																? "#1F66FF"
																: "#000",
														}}
														className={`relative pl-[22px] pr-3 py-3 flex items-center justify-between gap-[15px] group 
                      text-gray-700 group hover:bg-app-lightgray 
                    hover:pl-7 transition-all ${
						isActive ? "bg-app-lightgray pl-7" : ""
					}
                      text-sm group-hover:text-black transition-all ${
							isActive ? "text-app-primary font-bold" : ""
						}`}
													>
														<div className="flex items-center gap-[15px]">
															<div
																className=""
																style={{
																	transform:
																		"scale(1.2)",
																}}
															>
																{/* {link.icon} */}
																{React.cloneElement(
																	link.icon,
																	{
																		className:
																			iconColor,
																		strokeColor:
																			iconStrokeColor,
																		isActive:
																			isActive,
																	}
																)}
															</div>
															{/* <div className={`group-hover:text-gray-100`} style={{display: !isExpanded ? 'none':''}}>
                          {link.title}
                        </div> */}
															{isExpanded ? (
																<div
																	className={`text-[16px]`}
																	style={{
																		display:
																			!isExpanded
																				? "none"
																				: "",
																	}}
																>
																	{link.title}
																</div>
															) : (
																<div
																	className={`absolute top-0 left-[80px] shadow-lg rounded-md bg-white px-3 py-3 hidden group-hover:block`}
																	style={{
																		zIndex: "1000",
																		color: "#444",
																		whiteSpace:
																			"nowrap",
																	}}
																>
																	{link.title}
																</div>
															)}
														</div>
														{link.count ? (
															<div className="">
																<div
																	className="absolute w-[20px] h-[20px] top-[10px] right-[10px] rounded-full bg-[#444] group-hover:bg-[#fff] text-center flex justify-center items-center 
                        text-xs font-bold text-white group-hover:text-[#18BC7A]"
																>
																	<span>
																		14
																	</span>
																</div>
															</div>
														) : (
															<></>
														)}
													</Link>
												</li>
											);
										}
									})}
								</>
							</ul>
						</div>
					</div>
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

export default SideBar;
