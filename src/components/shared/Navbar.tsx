"use client";

import { AuthService } from "@/api/services/cartevo-api/auth";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";
import {
	logOut,
	selectCurrentCompany,
	selectCurrentToken,
	selectCurrentUser,
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
	const currentUser = useSelector(selectCurrentUser);
	const currentMode = useSelector(selectCurrentMode);
	const currentStartDate = useSelector(selectStartDate);
	const currentLimitDate = useSelector(selectLimitDate);
	const prodMode =
		currentCompany?.kybStatus === "APPROVED" &&
		currentUser?.kycStatus === "APPROVED";

	useEffect(() => {
		dispatch(setProdMode(prodMode));
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
								{envModes[currentMode]}
							</span>

							<Switch
								checked={prodMode}
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
								// <div
								// 	key={"4"}
								// 	className="flex justify-center w-full px-3 gap-2 py-3"
								// >
								// 	<CButton
								// 		text={"Status check"}
								// 		btnStyle={"outlineDark"}
								// 		href={"/retrait-gb"}
								// 		icon={<MdCheck size={40} />}
								// 	/>
								// </div>,
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
