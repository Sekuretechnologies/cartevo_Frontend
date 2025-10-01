"use client";

import React from "react";
import Image from "next/image";
import { FlipWords } from "@/components/ui/shadcn-io/flip-words";
import { mastercardIcon, visaIcon } from "@/constants/icons";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";
import { useTranslation } from "@/hooks/useTranslation";

const Section1 = () => {
	const { t } = useTranslation();
	const section1Translate = t.home.section1;
	const btnTranslate = t.btn;
	const words = ["Fintechs", "PMEs"];
	const { createLocalizedLink } = useLocalizedNavigation();
	return (
		<section className="">
			<div
				className="customContainer relative text-[#323232]   lg:h-[600px] bg-[#1F66FF]/10"
				style={{
					backgroundImage: "url('/website/home/heroBackground.png')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
			>
				{/* <div className="w-full h-full bg-primary/5 top-0 left-0 z-20 absolute "></div> */}
				<div className=" flex flex-col lg:flex-row  pt-[140px]">
					<div
						className=" lg:absolute lg:bottom-0 lg:-right-0  lg:flex lg:justify-end  lg:px-0 lg:w-[65%] h-full  overflow-y-hidden"
						style={{
							backgroundImage: "url('/website/home/hero.png')",
							backgroundSize: "100% 80%",
							backgroundPosition: "0% 100%",
							backgroundRepeat: "no-repeat",
						}}
					>
						{/* <Image
							src="/website/home/hero.png"
							alt="Cartevo hero illustration showing fintech solutions"
							width={800}
							height={600}
							priority
							className="w-full h-auto"
						/> */}
					</div>
					<div className="z-10 text-center lg:text-start font-poppins lg:w-[45%]">
						<h1 className="text-[42px] font-[700] leading-[45px] mb-4 tracking-tight">
							{section1Translate.title}
							<span className="text-primary">
								<FlipWords
									words={words}
									duration={3000}
									letterDelay={0.05}
									wordDelay={0.3}
									className="text-[#1F66FF]"
								/>
							</span>
						</h1>
						<p className="text-[12px] mb-4">
							{section1Translate.description}
						</p>

						<div className=" flex flex-col md:flex-row gap-2 md:justify-center lg:justify-start items-center">
							<a
								href={createLocalizedLink("/signup")}
								className="bg-[#1F66FF] hover:bg-[#00CFD9] hover:text-black  flex justify-center items-center w-[175px] font-semibold text-[13px] text-white h-[49px] rounded-[10px]"
							>
								{btnTranslate.buttonText}
							</a>
							<a
								href={createLocalizedLink("/contact")}
								className="bg-[#323232] w-[175px] font-semibold text-[13px] text-white h-[49px] flex justify-center items-center rounded-[10px]"
							>
								{btnTranslate.btnTextContact}
							</a>
						</div>
						<div className="flex justify-center md:justify-start items-center my-8 gap-5">
							<div>{visaIcon}</div>
							<div>{mastercardIcon}</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Section1;
