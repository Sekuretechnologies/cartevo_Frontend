"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

const Section4 = () => {
	const { t } = useTranslation();
	const section4Translate = t.home.section4;
	const btnTranslate = t.btn;
	return (
		<section className="mt-10 py-12 text-[#222222]">
			<div className="customContainer  ">
				<div className="flex flex-col items-center gap-4 text-center font-poppins">
					<h1 className="text-[37px] font-bold leading-10 text-center max-w-[800px]">
						{section4Translate.title}
					</h1>
					<p className="max-w-[750px] mb-8 text-[12px]">
						{section4Translate.description}
					</p>
				</div>
				<div className="grid grid-cols-1  gap-4 md:grid-cols-2 lg:grid-cols-3 font-poppins">
					<div className="bg-[#E7F7FF] p-12 rounded-[30px]">
						<Image
							src="/website/home/1.png"
							alt="Fintech companies illustration showing modern financial technology solutions"
							width={200}
							height={150}
							loading="lazy"
							className="mb-10 "
							//w-auto h-auto
						/>
						<h2 className="mb-4 text-[24px] font-semibold">
							{section4Translate.fintechs.fintech}
						</h2>
						<p className="text-[#222222] text-[12px]">
							{section4Translate.fintechs.description}
						</p>
					</div>

					<div className="bg-[#E7F7FF] p-12 rounded-[30px]">
						<Image
							src="/website/home/2.png"
							alt="Global enterprises illustration showing international business operations"
							width={200}
							height={150}
							loading="lazy"
							className="mb-10"
							// w-auto h-auto
						/>
						<h2 className="mb-4 text-[24px] font-semibold">
							{section4Translate.globalEnterprises.title}
						</h2>
						<p className="text-[#5F5F5F] text-[12px]">
							{section4Translate.globalEnterprises.description}
						</p>
					</div>

					<div className="bg-[#E7F7FF] p-12 rounded-[30px]">
						<Image
							src="/website/home/3.png"
							alt="Small and medium enterprises illustration showing business growth and financial tools"
							width={200}
							height={150}
							loading="lazy"
							className="mb-10"
							// w-auto h-auto
						/>
						<h2 className="mb-4 text-[24px] font-semibold">
							{section4Translate.PMEs.title}
						</h2>
						<p className="text-[#5F5F5F] text-[12px]">
							{section4Translate.PMEs.description}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Section4;
