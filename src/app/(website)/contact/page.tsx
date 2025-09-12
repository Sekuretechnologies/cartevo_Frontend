"use client";

import React, { useState } from "react";
import Image from "next/image";
import ContactForm from "./component/form";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";

const languages = [
	{ code: "fr", name: "Français" },
	{ code: "en", name: "English" },
];
const Contact = () => {
	const [isLangOpen, setIsLangOpen] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const [currentLanguage, setCurrentLanguage] = useState(languages[0]);

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
	//customContainer
	return (
		<section className="">
			<div className="   grid grid-cols-1 md:grid-cols-8 lg:gap-20 h-full">
				<div className="relative col-span-4 h-full font-poppins pt-20 flex flex-col gap-4 items-center text-center lg:text-left ">
					<div
						style={{
							backgroundImage:
								"url('/website/contact/call-girl.jpg')",
							backgroundSize: "auto 100%",
							backgroundPosition: "20% 0%",
							backgroundRepeat: "no-repeat",
						}}
						className=" w-full hidden lg:block h-full  absolute top-0 left-0 bg-primary/10"
					></div>
					<div className="absolute w-full h-[100px] top-0 left-0  bg-app-white-gradient"></div>
				</div>

				<div className="col-span-4 pr-10 pt-20">
					<ContactForm />
				</div>
			</div>
		</section>
	);
};

export default Contact;
