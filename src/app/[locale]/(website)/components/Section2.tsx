"use client";

import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";

import { ChevronRight } from "lucide-react";
import React from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

const Section2 = () => {
	const { createLocalizedLink } = useLocalizedNavigation();
	const { t } = useTranslation();
	const section2Translate = t.home.section2;
	const btnTranslate = t.btn;
	return (
		<section className="py-12">
			<div
				className="customContainer 
              text-[#222222]"
			>
				<div className="mb-8 lg:mb-12 font-poppins ">
					<h1 className=" text-[40px] font-[700] leading-10 text-center lg:text-left mb-4 tracking-tight">
						{section2Translate.title}
					</h1>
					<p className="text-[12px] text-center lg:text-left lg:w-[650px] font-[300] ">
						{section2Translate.description}
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 font-poppins">
					{/* Bloc 1 */}
					<div className="flex flex-col">
						{/* Images */}
						<div className="w-full h-[243px] bg-[#DBEDF3] rounded-[15px] mt-8 md:mt-0 mb-8 flex items-end justify-center">
							<Image
								src="/website/home/collect_payment.png"
								alt="Mobile payment illustration showing payment collection across African countries"
								width={300}
								height={200}
								loading="lazy"
								// className="w-auto h-auto"
							/>
						</div>

						{/* Texte + bouton */}
						<div className="flex flex-col items-center flex-1 text-center md:text-left md:items-start">
							<p className="border text-[13px] border-[#222222] px-8 py-2 w-fit rounded-full hover:bg-[#222222] duration-300 hover:text-white mb-4">
								{section2Translate.paymentAsAservice.title}
							</p>
							<h2 className="text-[30px] font-[700] leading-8 mb-4">
								<span className="text-primary">
									{
										section2Translate.paymentAsAservice
											.mainTitle.span1
									}
								</span>{" "}
								{
									section2Translate.paymentAsAservice
										.mainTitle.span2
								}
							</h2>
							<p className="text-[12px] mb-4 text-[#7B7B7B]">
								{
									section2Translate.paymentAsAservice
										.description
								}
							</p>

							{/* Bouton en bas */}
							<div className="mt-auto">
								<a
									href={createLocalizedLink("/signup")}
									className="text-white text-[13px] font-semibold bg-[#252421] px-8 py-3 w-fit flex gap-2 items-center rounded-full"
								>
									{btnTranslate.buttonText} <ChevronRight />
								</a>
							</div>
						</div>
					</div>

					{/* Bloc 2 */}
					<div className="flex flex-col mt-8 md:mt-0">
						{/* Images */}
						<div className="w-full h-[243px] bg-[#DBEDF3] rounded-[15px] mb-8 flex items-end justify-center">
							<Image
								src="/website/home/card.png"
								alt="Virtual card illustration showing card issuance and management features"
								width={300}
								height={200}
								loading="lazy"
								// className="w-auto h-auto"
							/>
						</div>

						{/* Texte + bouton */}
						<div className="flex flex-col flex-1 text-center md:text-left md:items-start">
							<p className="border px-8 text-[13px] py-2 w-fit rounded-full hover:bg-[#222222] border-[#222222] duration-300 hover:text-white mb-4">
								{section2Translate.cardAsAService.title}
							</p>
							<h2 className="text-[30px] font-[700] leading-8 mb-4">
								<span className="text-blue-primary">
									{
										section2Translate.cardAsAService
											.mainTitle.span1
									}{" "}
									<span className="text-primary">
										{
											section2Translate.cardAsAService
												.mainTitle.Span2
										}
									</span>{" "}
									{
										section2Translate.cardAsAService
											.mainTitle.span3
									}
								</span>
							</h2>
							<p className="text-[12px] mb-4 text-[#7B7B7B]">
								{section2Translate.cardAsAService.description}
							</p>

							{/* Bouton en bas */}
							<div className="mt-auto">
								<a
									href={createLocalizedLink("/signup")}
									className="text-white text-[13px] font-semibold bg-[#252421] px-8 w-fit py-3 flex gap-2 items-center rounded-full"
								>
									{btnTranslate.buttonText} <ChevronRight />
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Section2;
