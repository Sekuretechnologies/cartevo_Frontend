"use client";

import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";
import { useTranslation } from "@/hooks/useTranslation";

import React from "react";

const WebsiteFooter = () => {
	const { createLocalizedLink } = useLocalizedNavigation();
	const { t } = useTranslation();
	const footerTranslate = t.websiteFooter;

	return (
		<footer className=" py-12">
			<div className="customContainer">
				<div className="grid grid-cols-1  sm:grid-cols-2 gap-8 lg:grid-cols-4  border-b-1 pb-8 mb-8 border-[#CBCBCB]">
					<div className="flex flex-col justify-between  items-start">
						<img
							src="/website/logos/logo_full.png"
							alt="logo"
							className="-ml-[6px]"
						/>
						<p className="uppercase max-w-64  font-syne font-bold text-[12px]">
							{footerTranslate.title}
						</p>
					</div>
					<ul className="flex flex-col gap-2 font-semibold text-[12px] font-poppins">
						<li>
							<a href={createLocalizedLink("/privacy_policy")}>
								{" "}
								{footerTranslate.politique}
							</a>
						</li>
						<li>
							<a href="#"> {footerTranslate.termes}</a>
						</li>
						<li>
							<a href="docs.cartevo.co"> {footerTranslate.api}</a>
						</li>
						<li>
							<a href={createLocalizedLink("/contact")}>
								{footerTranslate.contact}
							</a>
						</li>
					</ul>

					<ul className="*:flex  *:gap-4 flex flex-col gap-4 lg:gap-0 lg:justify-between font-semibold font-poppins text-[12px]">
						<li>
							<div>
								<img src="/website/logos/phone.png" alt="" />
							</div>
							<span>+44 55 88 77 99</span>
						</li>
						<li className="lg:mt-1">
							<div>
								<img src="/website/logos/mail.png" alt="" />
							</div>
							<span>contact@cartevo.co</span>
						</li>
						<li className="lg:mt-1">
							<div>
								<img
									src="/website/logos/loc.png"
									alt=""
									className=""
								/>
							</div>
							<span>
								71-75 Shelton Street, London, United Kingdom
							</span>
						</li>
					</ul>

					<ul className="flex gap-2 items-end">
						<li>
							<a href="#">
								<img src="/website/logos/facebook.png" alt="" />
							</a>
						</li>
						<li>
							<a href="#">
								<img src="/website/logos/x.png" alt="" />
							</a>
						</li>
						<li>
							<a href="#">
								<img src="/website/logos/in.png" alt="" />
							</a>
						</li>
					</ul>
				</div>
				<p className="text-[12px] text-black-text">
					{footerTranslate.allRights}
				</p>
				<p className="text-[12px] text-black-text">
					{footerTranslate.description2}
				</p>
			</div>
		</footer>
	);
};

export default WebsiteFooter;
