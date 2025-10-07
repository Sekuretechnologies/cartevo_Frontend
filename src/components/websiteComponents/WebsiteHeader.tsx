"use client";

import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";
import CustomDropdown2 from "../shared/CustomDropdown2";
import { ItemFlag } from "../shared/ItemFlag";
import { useTranslation } from "@/hooks/useTranslation";

const languages = [
	{ iso2: "FR", code: "FR", name: "Français" },
	{ iso2: "GB", code: "EN", name: "English" },
];
const WebsiteHeader = () => {
	const { createLocalizedLink, changeLocale } = useLocalizedNavigation();
	const { t } = useTranslation();
	const headerTranslate = t.websiteNavBar;
	const btnTranslate = t.btn;
	const [isLangOpen, setIsLangOpen] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const [currentLanguage, setCurrentLanguage] = useState(languages[0]);

	const handleLanguageChange = (newLocale: string) => {
		const lang = languages.find((l) => l.code === newLocale);
		if (lang) {
			setCurrentLanguage(lang);
			// Utiliser le hook pour changer de locale
			changeLocale(newLocale.toLowerCase());
		}
		setIsLangOpen(false);
	};

	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	return (
		<div className="text-black-custom font-poppins absolute z-50 w-full">
			<div className="customContainer flex items-center gap-1 justify-between">
				<div className="flex items-center gap-20">
					<a href={createLocalizedLink("/")}>
						<img src="/website/logos/logo_full.png" alt="logo" />
					</a>

					{/**Navigation desktop */}
					<nav className="hidden lg:block font-poppins">
						<ul className="flex items-center gap-8 mt-2">
							<li className="h-[30px]">
								<a
									href={createLocalizedLink("/")}
									className="navItem font-poppins text-lg hover:text-app-primary"
								>
									{headerTranslate.home}
								</a>
							</li>
							<li className="h-[30px]">
								<a
									href={createLocalizedLink("/pricing")}
									className="navItem font-poppins text-lg hover:text-app-primary"
								>
									{headerTranslate.tarifs}
								</a>
							</li>

							<li className="flex items-center h-[30px]">
								<a
									href={createLocalizedLink("/contact")}
									className="navItem font-poppins text-lg hover:text-app-primary"
								>
									{headerTranslate.contact}
								</a>
								<ChevronRight size={18} color="#1f66ff" />
							</li>
						</ul>
					</nav>
				</div>

				<div className="flex items-center gap-0 font-poppins">
					<div className="hidden lg:flex  items-center gap-4">
						<p className="navItem font-poppins text-lg ">
							{headerTranslate.login}
						</p>
						<a
							href={createLocalizedLink("/signup")}
							className="h-[38px] w-[134px] hover:bg-[#00CFD9] hover:text-black duration-300 text-white text-[13px] font-[600] flex justify-center items-center bg-primary rounded-[8px]"
						>
							{btnTranslate.buttonText}
						</a>
					</div>

					{/* Sélecteur de langue Desktop */}
					<CustomDropdown2
						btnChild={
							<div className="flex items-center gap-1 border-1 font-poppins border-black px-5 justify-center py-[8px] rounded-lg">
								<ItemFlag
									iso2={currentLanguage?.iso2 || "US"}
									size={3}
								/>
								<span className="flex items-center mt-1/2">
									<span className="text-[var(--green-dark)] font-medium font-satoshi text-sm">
										{currentLanguage.code.toUpperCase()}
									</span>
									<ChevronDown
										className={`h-5 w-5 ml-1 -mt-1 text-[var(--green-dark)] transition-transform duration-200 ${
											isLangOpen ? "rotate-180" : ""
										}`}
									/>
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
								{languages.map((lang) => (
									<button
										key={lang.code}
										onClick={() =>
											handleLanguageChange(lang.code)
										}
										className={`hover:bg-gray-200  w-full px-2 py-1 text-left hover:bg-green-secondary text-green-black  transition-all flex items-center space-x-3 duration-200 `}
									>
										<ItemFlag
											iso2={lang?.iso2 || "US"}
											size={3}
										/>
										<span className="font-medium font-satoshi text-sm">
											{lang.name}
										</span>
									</button>
								))}
							</div>,
						]}
					/>

					{/**button de navigation */}
					<button className="lg:hidden" onClick={toggleMenu}>
						{!menuOpen && <Menu size={24} color="#1f66ff" />}
						{menuOpen && <X size={24} color="#1f66ff" />}
					</button>
				</div>
			</div>

			{/* navigation mobile*/}
			{menuOpen && (
				<div className="lg:hidden mt-4absolute customContainer shadow-lg rounded-3xl left-0 top-8 w-full">
					<nav className=" px-5 py-5 bg-white ">
						<ul className=" flex flex-col gap-4 font-poppins text-lg">
							<li>
								<a
									href={createLocalizedLink("/")}
									className="navItem "
								>
									{headerTranslate.home}
								</a>
							</li>
							<li>
								<a
									href={createLocalizedLink("/pricing")}
									className="navItem"
								>
									{headerTranslate.tarifs}
								</a>
							</li>

							<li className="flex items-center">
								<a
									href={createLocalizedLink("/contact")}
									className="navItem"
								>
									{headerTranslate.contact}
								</a>
								<ChevronRight size={18} color="#1f66ff" />
							</li>
							<li>
								<a
									href={createLocalizedLink("/signup")}
									className="h-[38px] w-[134px] hover:bg-[#00CFD9] duration-300 text-white text-[13px] font-[600] flex justify-center items-center bg-primary rounded-[8px]"
								>
									{btnTranslate.buttonText}
								</a>
							</li>
						</ul>
					</nav>
				</div>
			)}
		</div>
	);
};

export default WebsiteHeader;
