"use client";

import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";

import React from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

const PricingSection4 = () => {
	const { createLocalizedLink } = useLocalizedNavigation();
	const { t } = useTranslation();
	const section4Translation = t.pricing.section4;
	const btnTranslate = t.btn;
	return (
		<section className="py-12">
			<div className="customContainer">
				<div
					style={{
						backgroundImage: "url('/website/home/noise.png')",
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
					}}
					className="h-[450px] sm:h-[400px] w-full rounded-[44px] relative"
				>
					<Image
						src="/website/pricing/grille.png"
						alt="Decorative grid pattern background"
						width={400}
						height={400}
						loading="lazy"
						className="absolute left-0 top-0 w-auto h-auto"
					/>
					<Image
						src="/website/pricing/carree.png"
						alt="Decorative geometric pattern overlay"
						width={200}
						height={200}
						loading="lazy"
						className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
						// w-auto h-auto
					/>
					<div className="px-10 flex flex-col text-center gap-4 items-center justify-center w-full h-full font-poppins absolute left-1/2  top-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
						<h1 className="text-[42px] font-semibold lg:w-2/3 xl:w-1/2 leading-10">
							{section4Translation.mainTitle.span1}{" "}
							<span className="text-[#00CFD9]">
								{section4Translation.mainTitle.span2}
							</span>{" "}
							{section4Translation.mainTitle.span3}
						</h1>
						<p className="text-[14px] lg:w-2/3">
							{section4Translation.description}
						</p>

						<div className="text-[#222222] text-[13px] font-semibold flex flex-col gap-2 sm:flex-row items-center">
							<a
								href={createLocalizedLink("/signup")}
								className="w-[234px] h-[54px] rounded-[20px] flex justify-center items-center bg-[#00CFD9]"
							>
								{btnTranslate.buttonText}{" "}
							</a>
							<a
								href={createLocalizedLink("/contact")}
								className="w-[234px] h-[54px] rounded-[20px] flex justify-center items-center bg-white border-1 border-[#222222]"
							>
								{section4Translation.ask}
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default PricingSection4;
