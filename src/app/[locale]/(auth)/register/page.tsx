"use client";

import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";

import WebsiteFooter from "@/components/websiteComponents/WebsiteFooter";
import React from "react";
import RegisterForm from "./components/RegisterForm";
import { useTranslation } from "@/hooks/useTranslation";

const Register = () => {
	const { createLocalizedLink } = useLocalizedNavigation();
	const { t } = useTranslation();
	const registerTranslation = t.register;
	const loginTranslate = t.login;
	return (
		<section className="relative flex flex-col mt-0 w-full">
			<nav className="absolute z-10 top-0 left-10 lg:left-[150px]  h-[80px] flex items-center">
				<a href={createLocalizedLink("/")}>
					<img src="/website/logos/logo_full.png" alt="logo" />
				</a>
			</nav>
			<div className="w-full   grid grid-cols-1 lg:grid-cols-2 font-poppins ">
				<div
					style={{
						backgroundImage:
							"url('/website/home/heroBackground.png')",
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
					}}
					className="font-poppins hidden  bg-primary/10 rounded-br-[50px] h-[750px] pr-28 pl-[150px]  lg:flex flex-col justify-center gap-4 items-center  text-center lg:text-left"
				>
					<h1 className="font-bold text-[35px] leading-10 max-w-[500px] tracking-tight">
						{registerTranslation.title.span1}{" "}
						<span className="text-primary">
							{registerTranslation.title.span2}
						</span>{" "}
						{registerTranslation.title.span3}
					</h1>
					<div className="flex items-center justify-start  text-left gap-4">
						<img src="/website/contact/chevron.png" alt="chevron" />

						<div>
							<h2 className="text-[17px] leading-5 mb-2 font-semibold max-w-[400px]">
								{loginTranslate.options.option1.title.span1}{" "}
								<span className="text-primary">
									{loginTranslate.options.option1.title.span2}
								</span>
							</h2>
							<p className="text-[11px] max-w-[380px]">
								{loginTranslate.options.option1.description}
							</p>
						</div>
					</div>

					<div className="flex items-center  text-left gap-4">
						<img src="/website/contact/chevron.png" alt="" />
						<div>
							<h2 className="text-[17px] leading-5 mb-2 font-semibold max-w-[400px]">
								{loginTranslate.options.option2.title.span1}
								<span className="text-primary">
									{" "}
									{
										loginTranslate.options.option2.title
											.span2
									}{" "}
								</span>
							</h2>
							<p className="text-[11px] max-w-[380px]">
								{loginTranslate.options.option2.description}
							</p>
						</div>
					</div>
				</div>
				<div className=" flex justify-center items-center px-[50px]">
					<div className="w-full max-w-[700px]  ">
						<RegisterForm />
						{/* <CreateAccountForm /> */}
					</div>
				</div>
			</div>
			<WebsiteFooter />
		</section>
	);
};

export default Register;
