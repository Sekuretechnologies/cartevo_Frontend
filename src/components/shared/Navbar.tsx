"use client";

import { AuthService } from "@/api/services/cartevo-api/auth";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";
import {
	logOut,
	selectAnotherCompanies,
	selectCurrentCompany,
	selectCurrentToken,
	selectCurrentUser,
	setCredentials,
} from "@/redux/slices/auth";
import {
	selectAvailableLanguages,
	selectCurrentLanguage,
	setLanguageByCode,
} from "@/redux/slices/languageSlice";
import {
	selectCurrentMode,
	selectLimitDate,
	selectStartDate,
	setMode,
	setProdMode,
} from "@/redux/slices_v2/settings";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import { MdCheck, MdLogout } from "react-icons/md";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useScrollYPosition } from "react-use-scroll-position";
import { Switch } from "../ui/switch";
import CButton from "./CButton";
import CustomDropdown2 from "./CustomDropdown2";
import { ItemFlag } from "./ItemFlag";
import SearchUserInput from "./search/UserSearchInput";

import cstyle from "./styles/navbar-style.module.scss";
import { useTranslation } from "@/hooks/useTranslation";
import { error } from "console";
import Loading from "@/app/[locale]/loading";
import { PuffLoader } from "react-spinners";
type Props = {
	title: string | undefined;
	backLink?: string;
	goBack?: (data?: any) => void;
	isExpanded: boolean;
};

let scrollPositionY = 0;

const handleLogout = async (token: string) => {
	const response = await AuthService.logout(token);
	if (!response.ok) {
		const responseBody = await response.json();
		throw new Error(responseBody.message);
	}
};
const envModes: any = {
	live: "Live",
	pre_production: "Pre-production",
};

const handleSwitchCompany = async ({
	token,
	companyId,
}: {
	token: string;
	companyId: string;
}) => {
	console.log("token envoye", token);
	const response = await AuthService.switchCompany({
		token: token,
		company_id: companyId,
	});

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message);
	}

	return responseJson;
};

export default function Navbar(props: Props) {
	const { t } = useTranslation();
	const navBarTranslate = t.navBar;
	const router = useRouter();
	const pathname = usePathname();
	const dispatch = useDispatch();
	const { title, backLink, goBack, isExpanded } = props;
	const { changeLocale, createLocalizedLink } = useLocalizedNavigation();
	const classNames = (...classes: string[]): string =>
		classes.filter(Boolean).join(" ");

	const currentToken = useSelector(selectCurrentToken);
	const currentCompany = useSelector(selectCurrentCompany);
	const anotherCompanies = useSelector(selectAnotherCompanies);
	const currentUser = useSelector(selectCurrentUser);
	const currentMode = useSelector(selectCurrentMode);
	const currentStartDate = useSelector(selectStartDate);
	const currentLimitDate = useSelector(selectLimitDate);
	const prodMode =
		currentCompany?.kybStatus === "APPROVED" &&
		currentUser?.kycStatus === "APPROVED";
	const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

	useEffect(() => {
		dispatch(setProdMode(prodMode));
		console.log("another companies", anotherCompanies);
	}, [prodMode, dispatch]);

	// Language state from Redux
	const currentLanguage = useSelector(selectCurrentLanguage);
	const availableLanguages = useSelector(selectAvailableLanguages);

	const [envMode, setEnvMode] = useState(currentMode || "sandbox");
	const [isChangeStartDateModalFormOpen, setIsChangeStartDateModalFormOpen] =
		useState(false);

	const mutation = useMutation({
		mutationFn: async () => handleLogout(currentToken),
		onSuccess: (data) => {
			toast.success("Bye. See you soon!");
			dispatch(logOut());
			router.push(createLocalizedLink("/login"));
			localStorage.removeItem("isAdminView");
		},
		onError: (err: any) => {
			console.error("Logout onError : ", err.message);
			toast.error(err.message);
		},
	});
	// ✅ Mutation for switching company
	const switchMutation = useMutation({
		mutationFn: ({
			token,
			companyId,
		}: {
			token: string;
			companyId: string;
		}) => handleSwitchCompany({ token, companyId }),

		onSuccess: (data: any) => {
			const token = data.access_token;
			const user = data.user;
			const company = data.company;
			console.log("mode", data.mode);

			// Exclure la compagnie sélectionnée de la liste des autres
			const updatedAnotherCompanies = [
				currentCompany,
				...anotherCompanies.filter(
					(c: { id: any }) => c.id !== company.id
				),
			];

			// ✅ Mettre à jour le store Redux
			dispatch(
				setCredentials({
					token,
					company,
					user,
					anotherCompanies: updatedAnotherCompanies,
				})
			);
			dispatch(setMode(data.mode));

			toast.success("Company switch successful");

			//  Redirection selon l'état d’onboarding
			// 	if (!company?.onboarding_is_completed) {
			// 		navigateTo(urls.onboarding.root);
			// 	} else {
			// 		navigateTo(urls.wallets.root);
			// 	}
		},

		onError: (error: any) => {
			console.error("Switch company error:", error);
			toast.error(error.message || "Échec du changement d'entreprise");
		},
	});

	const onLogout = () => {
		console.log("ON_LOGOUT");
		mutation.mutate();
	};

	const handleOnboardingError = (e: any) => {
		if (!currentCompany?.is_onboarding_completed) {
			toast.error(
				"You have to complete onboarding to be able to access to Live mode"
			);
		}
		// if (e.target.checked) {
		// 	dispatch(setVersion(2));
		// } else {
		// 	dispatch(setVersion(1));
		// }
	};
	// const handleMode = (e: any) => {
	// 	console.log("e :: ", e);

	// 	if (e.target.checked) {
	// 		setEnvMode("Sandbox");
	// 		dispatch(setMode("Sandbox"));
	// 	} else {
	// 		setEnvMode("Live");
	// 		dispatch(setMode("Live"));
	// 	}
	// };

	const handleMode = (checked: any) => {
		console.log("checked :: ", checked);

		if (checked) {
			setEnvMode("live");
			dispatch(setMode("live"));
		} else {
			setEnvMode("pre_production");
			dispatch(setMode("pre_production"));
		}
	};

	const handleLanguageChange = (newLocale: string) => {
		// Mettre à jour le store Redux
		dispatch(setLanguageByCode(newLocale));

		// Changer la locale de la page
		changeLocale(newLocale.toLowerCase());
	};

	// Use the useScrollPosition hook to get the current scroll position
	scrollPositionY = useScrollYPosition();

	return (
		<div className={`w-full pl-0  md:pl-0 ${cstyle["navbar-container"]}`}>
			{switchMutation.isLoading && (
				<div className="fixed top-0 left-0 w-full h-full bg-black/20 backdrop-blur-sm z-[2000] flex items-center justify-center">
					<PuffLoader size={50} color="#1F66FF" />
				</div>
			)}
			<div
				style={{
					width: isExpanded
						? "calc(100% - 250px)"
						: "calc(100% - 80px)",
					zIndex: "1000",
					boxShadow: `${
						scrollPositionY > 0
							? "0 4px 6px -1px  rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
							: ""
					}`,
					backgroundColor: `${scrollPositionY > 0 ? "white" : ""}`,
				}}
				className={`fixed w-full flex justify-between items-center h-fit pl-[60px] md:pl-0 px-5 md:px-10 py-5 ${cstyle["navbar-subcontainer"]}`}
			>
				<div className="md:pl-[25px] relative w-full flex justify-start items-center gap-3">
					{backLink ? (
						<Link
							href={backLink}
							className="absolute top-1 left-[-23px] hidden md:block"
						>
							<FaArrowLeft color="#000" size={20} />
						</Link>
					) : goBack ? (
						<div
							onClick={goBack}
							className="absolute top-1 left-[-23px] cursor-pointer hidden md:block"
						>
							<FaArrowLeft color="#000" size={20} />
						</div>
					) : (
						<></>
					)}

					<h1 className="font-semibold text-xl md:text-2xl pl-1 py-0">
						{currentCompany?.name} | {title}
					</h1>
				</div>
				<div className="flex justify-between items-center gap-3">
					<div className="flex justify-between items-center gap-[0px]">
						{/* <div className="relative w-[30px] h-[30px] flex justify-center items-center rounded-full bg-[#F4EFE3]">
							<IoIosNotificationsOutline
								color="#1F66FF"
								size={22}
							/>
							<div
								className="absolute bottom-[-8px] right-[-8px] w-[18px] h-[18px] bg-[#18BC7A] rounded-full 
                    text-center flex justify-center items-center text-[10px] font-bold text-white"
							>
								14
							</div>
						</div> */}
						<div className="relative hidden md:flex mr-10 w-[300px]">
							<SearchUserInput
								onSelected={(data) =>
									router.push(
										`/dashboard/v2/users_accounts/manage/${data.id}`
									)
								}
							/>
						</div>

						<div
							className="flex gap-2"
							onClick={(e) => handleOnboardingError(e)}
						>
							<span className="text-[15px] w-[55px] text-center text-gray-600">
								Live
							</span>

							<Switch
								checked={currentMode === "prod"}
								disabled={
									!currentCompany?.is_onboarding_completed
								}
								// onChange={(e) => handleMode(e)}
								// checked={field.value}
								onCheckedChange={(value) => handleMode(value)}
								className="data-[state=checked]:bg-app-primary"
							/>
						</div>

						{/* <label
							htmlFor="modeToggle"
							className="flex items-center cursor-pointer"
						>
							<div
								className="relative"
								onClick={(e) => handleOnboardingError(e)}
							>
								<input
									type="checkbox"
									defaultChecked={
										currentCompany?.is_onboarding_completed
									}
									disabled={
										!currentCompany?.is_onboarding_completed
									}
									// onClick={(e) => handleVersion(e)}
									// onChange={(e) => handleVersion(e)}
									id="modeToggle"
									className="sr-only"
								/>
								<div className="switchbar block bg-gray-200 w-[85px] h-[33px] rounded-full flex items-center px-2 text-xs">
									<span className="testMode font-bold text-[18px] text-gray-600">
										Live
									</span>
									<span className="proMode font-bold text-[18px] text-gray-600">
										Test
									</span>
								</div>

								<div
									className="dot absolute left-1 top-[2px] bg-[#1F66FF] w-[28px] h-[28px] 
                        rounded-full transition flex justify-center items-center"
								>
									<span className="w-[14px] h-[14px] rounded-[5px] border border-solid border-4 border-white"></span>
								</div>
							</div>
						</label> */}

						<CustomDropdown2
							btnChild={
								<div className="flex items-center gap-1 border-1 border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-50">
									<ItemFlag
										iso2={currentLanguage?.iso2 || "US"}
										size={3}
									/>
									<span className="flex items-center">
										<span className="text-gray-700 font-medium text-sm">
											{currentLanguage.code.toUpperCase()}
										</span>
										<ChevronDown className="h-4 w-4 ml-1 text-gray-600" />
									</span>
								</div>
							}
							cstyle={""}
							iconSize={20}
							items={[
								<div
									key="1"
									className="flex flex-col justify-center w-full"
								>
									{availableLanguages.map((lang) => (
										<button
											key={lang.code}
											onClick={() =>
												handleLanguageChange(lang.code)
											}
											className={`hover:bg-gray-100 w-full px-3 py-2 text-left transition-all flex items-center space-x-3 duration-200 ${
												currentLanguage.code ===
												lang.code
													? "bg-blue-50 text-blue-700"
													: ""
											}`}
										>
											<ItemFlag
												iso2={lang?.iso2 || "US"}
												size={3}
											/>
											<span className="font-medium text-sm">
												{lang.name}
											</span>
											{currentLanguage.code ===
												lang.code && (
												<MdCheck
													className="ml-auto text-blue-600"
													size={16}
												/>
											)}
										</button>
									))}
								</div>,
							]}
						/>

						<div className="ml-10 text-sm">
							{currentUser?.last_name?.split(" ")[0] || ""}
						</div>

						<CustomDropdown2
							btnChild={
								<div
									className="flex justify-center items-center"
									style={{
										width: 35,
										height: 35,
										borderRadius: "50%",
										position: "relative",
										background: "#1f66ff",
									}}
								>
									<FaUser color={"white"} />
								</div>
							}
							cstyle={""}
							iconSize={20}
							items={[
								<div
									key={"1"}
									className="flex justify-center w-full px-3 gap-2"
								>
									<span className="text-nowrap text-md ">
										<div
											className="flex justify-center items-center"
											style={{
												width: 80,
												height: 80,
												borderRadius: "50%",
												position: "relative",
												background: "#1f66ff",
											}}
										>
											<FaUser color={"white"} size={40} />
										</div>
									</span>
								</div>,
								<div
									key={"2"}
									className="flex justify-center w-full px-3 gap-2"
								>
									<span className="text-nowrap text-sm ">
										{currentUser?.last_name}
									</span>
								</div>,
								<div
									key={"3"}
									className="flex justify-center w-full px-3 gap-2"
								>
									<span className="text-nowrap text-sm ">
										{currentUser?.email}
									</span>
								</div>,

								<div
									key={"4"}
									className={` justify-center w-full px-3 gap-2 py-3`}
								>
									{(anotherCompanies &&
										anotherCompanies.length) > 0 && (
										<div
											key={"5"}
											className="flex flex-col justify-center w-full  gap-2 my-2 border-t border-gray-200 pt-2"
										>
											<button
												type="button"
												className="text-sm text-gray-600 font-medium mb-2 flex items-center whitespace-nowrap"
												onClick={(e) => {
													e.stopPropagation();
													setIsCompanyDropdownOpen(
														!isCompanyDropdownOpen
													);
												}}
											>
												Autres entreprises :
												<ChevronDown
													color={"#4b5563"}
													size={18}
													className={`ml-1 transition-transform duration-200 ${
														isCompanyDropdownOpen
															? "rotate-180"
															: ""
													}`}
												/>
											</button>

											{isCompanyDropdownOpen && (
												<div className="flex flex-col  rounded-md mt-1 bg-white shadow-sm max-h-60 overflow-y-auto">
													{anotherCompanies.map(
														(comp: any) => (
															<button
																key={comp.id}
																onClick={() =>
																	switchMutation.mutate(
																		{
																			token: currentToken, // depuis ton Redux
																			companyId:
																				comp.id, // l'id de l'entreprise sélectionnée
																		}
																	)
																}
																className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm hover:bg-gray-100 transition-all"
															>
																<ItemFlag
																	iso2={
																		comp.country
																	}
																	size={6}
																/>
																<span>
																	{comp.name}
																</span>
															</button>
														)
													)}
												</div>
											)}
										</div>
									)}
								</div>,

								<div
									key={"6"}
									className="flex justify-center w-full px-3 gap-2 my-3"
								>
									<CButton
										text={navBarTranslate.logout}
										btnStyle={"outlineDark"}
										onClick={onLogout}
										icon={<MdLogout size={40} />}
									/>
								</div>,
							]}
						/>
					</div>
				</div>
			</div>
			{/* <Modal/>  */}
		</div>
	);
}
