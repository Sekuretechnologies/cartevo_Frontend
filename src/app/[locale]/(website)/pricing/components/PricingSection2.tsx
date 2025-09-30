"use client";

import { ChevronRight } from "lucide-react";
import React from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

const PricingSection2 = () => {
	const { t } = useTranslation();
	const section2Translation = t.pricing.section2;

	return (
		<section className="pb-12 ">
			<div className="customContainer py-24 flex flex-col lg:flex-row-reverse items-center lg:justify-center gap-16 lg:gap-24 w-full max-w-[1600px] mx-auto ">
				<div className="flex flex-col items-center lg:items-start  max-w-[500px] font-poppins">
					<h1 className="text-4xl font-bold text-center lg:text-start leading-10 mb-4">
						{section2Translation.title}
					</h1>
					<p className="text-black-text text-center lg:text-start mb-4 text-[13px]">
						{section2Translation.description}
					</p>

					<div className="flex flex-col  gap-4">
						<div className="flex gap-4">
							<p className="w-6 h-6 bg-primary flex justify-center items-center rounded-full">
								<ChevronRight color="#ffffff" size={20} />
							</p>
							<p className="font-semibold">
								{section2Translation.option.option1}
							</p>
						</div>

						<div className="flex items-center gap-4 font-semibold">
							<p className="w-6 h-6 bg-primary flex justify-center items-center rounded-full">
								<ChevronRight color="#ffffff" size={20} />
							</p>
							<p> {section2Translation.option.option2}</p>
						</div>

						<div className="flex items-center gap-4 font-semibold">
							<p className="w-6 h-6 bg-primary flex justify-center items-center rounded-full">
								<ChevronRight color="#ffffff" size={20} />
							</p>
							<p> {section2Translation.option.option3}</p>
						</div>
					</div>
				</div>

				<div className="px-4 sm:px-8 md:px-28 mt-12 lg:px-0 lg:w-[517px] h-[280px] sm:h-[320px] md:h-[357px] rounded-[32px] bg-[#DBEEF3] relative overflow-visible flex justify-center items-end">
					<Image
						src="/website/pricing/girl.png"
						alt="Scalable pricing illustration showing business growth and expansion capabilities"
						width={350}
						height={280}
						loading="lazy"
						className="w-[350px] h-auto"
					/>
				</div>
			</div>
		</section>
	);
};

export default PricingSection2;
