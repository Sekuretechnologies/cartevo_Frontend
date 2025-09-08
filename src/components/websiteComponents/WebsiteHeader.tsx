"use client";

import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const languages = [
	{ code: "fr", name: "Français" },
	{ code: "en", name: "English" },
];
const WebsiteHeader = () => {
	// 	  const locale = useLocale();
	//   const router = useRouter();
	//   const pathname = usePathname();

	const [isLangOpen, setIsLangOpen] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const [currentLanguage, setCurrentLanguage] = useState(languages[0]);

	// Vérifier que tous les éléments d'ancrage existent
	useEffect(() => {
		const checkAnchors = () => {
			const anchors = [
				"home",
				"features",
				"how-it-works",
				"testimonials",
				"faq",
				"contact",
			];
			anchors.forEach((anchor) => {
				const element = document.getElementById(anchor);
				console.log(
					`Anchor "${anchor}":`,
					element ? "Found" : "Not found"
				);
			});
		};

		// Vérifier après un délai pour s'assurer que la page est chargée
		setTimeout(checkAnchors, 1000);
	}, []);

	//   const currentLanguage =
	//     languages.find((lang) => lang.code === locale) || languages[0];

	const handleLanguageChange = (newLocale: string) => {
		const lang = languages.find((l) => l.code === newLocale);
		if (lang) {
			setCurrentLanguage(lang);
		}
		setIsLangOpen(false);
	};

	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	return (
		<div className="text-black-custom font-poppins absolute z-50 w-full">
			<div className="customContainer flex items-center gap-1 justify-between">
				<div className="flex items-center gap-40">
					<img src="/website/logos/logo_full.png" alt="logo" />

					{/**Navigation desktop */}
					<nav className="hidden lg:block font-poppins">
						<ul className="flex items-center gap-8">
							<li>
								<a
									href="/website"
									className="navItem font-poppins"
								>
									home
								</a>
							</li>
							<li>
								<a href="/website/pricing" className="navItem ">
									Pricing
								</a>
							</li>

							<li className="flex items-center">
								<a
									href="/website/contact"
									className="navItem font-poppins "
								>
									Contacter
								</a>
								<ChevronRight size={18} color="#1f66ff" />
							</li>
						</ul>
					</nav>
				</div>

				<div className="flex items-center gap-4 font-poppins">
					<div className="hidden lg:block">
						<button className="h-[38px] w-[134px] hover:bg-[#00CFD9] duration-300 text-white text-[13px] font-[600] flex justify-center items-center bg-primary rounded-[8px]">
							Commencer
						</button>
					</div>

					{/* Sélecteur de langue Desktop */}
					<div
						className="flex -mt-1  w-[75px] h-[40px] rounded-md justify-center relative border-[1px] border-green-dark gap-x-1 items-center cursor-pointer px-1"
						onClick={() => setIsLangOpen(!isLangOpen)}
					>
						<div className="mt-1 flex items-center border-2 font-poppins border-black px-5 justify-center py-[6px] rounded-lg">
							<img src="/website/logos/union.png" alt="globle" />
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

						{isLangOpen && (
							<div className="absolute top-full right-0 mt-3.5 w-40 h-20 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 flex flex-col justify-center overflow-hidden">
								{languages.map((lang) => (
									<button
										key={lang.code}
										onClick={() =>
											handleLanguageChange(lang.code)
										}
										className={`flex-1 hover:bg-gray-200 justify-center w-full px-4 py-2 text-left hover:bg-green-secondary text-green-black  transition-all flex items-center space-x-3 duration-200 `}
									>
										<span className="font-medium font-satoshi text-sm">
											{lang.name}
										</span>
									</button>
								))}
							</div>
						)}
					</div>

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
								<a href="/website" className="navItem ">
									home
								</a>
							</li>
							<li>
								<a href="/website/pricing" className="navItem">
									Pricing
								</a>
							</li>

							<li className="flex items-center">
								<a href="/website/contact" className="navItem">
									Contacter
								</a>
								<ChevronRight size={18} color="#1f66ff" />
							</li>
							<li>
								<button className="h-[38px] w-[134px] hover:bg-[#00CFD9] duration-300 text-white text-[13px] font-[600] flex justify-center items-center bg-primary rounded-[8px]">
									Commencer
								</button>
							</li>
						</ul>
					</nav>
				</div>
			)}
		</div>
	);
};

export default WebsiteHeader;
