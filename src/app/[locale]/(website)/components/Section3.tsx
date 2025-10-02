"use client";

import React from "react";
import Image from "next/image";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";
import { useTranslation } from "@/hooks/useTranslation";

const Section3 = () => {
	const { createLocalizedLink } = useLocalizedNavigation();
	const { t } = useTranslation();
	const section3Translate = t.home.section3;
	const btnTranslate = t.btn;
	return (
		<section>
			<div
				className="custonContainer pt-12  text-white font-poppins relative h-[820px] md:h-[700px] xl:h-[750px]"
				style={{
					backgroundImage: "url('/website/home/Rectangle-back.png')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
			>
				{/* <div className="absolute left-1/2 -translate-x-1/2 w-full flex justify-center bottom-10 z-10">
					<Image
						src="/website/home/group.png"
						alt="Group of people collaborating on fintech solutions"
						width={600}
						height={400}
						loading="lazy"
						className="w-[80%] h-auto"
					/>
				</div> */}
				<div className="flex absolute top-10 left-1/2 w-full   -translate-x-1/2 flex-col items-center gap-4 z-50 ">
					<h3 className="w-[350px] h-[35px] border-1 text-center  whitespace-nowrap  border-white text-[13px] font-semibold flex items-center justify-center rounded-full">
						{section3Translate.title}
					</h3>
					<h1 className="text-[37px] text-white font-semibold text-center max-w-[900px] leading-[45px]">
						{section3Translate.mainTitle.span1}{" "}
						<span className="text-[#5BC9E5]">
							{section3Translate.mainTitle.span2}
						</span>{" "}
						{/* directement intégrés aux applications de vos clients. */}
					</h1>
					<p className="text-[14px] text-white text-center  max-w-[900px]">
						{section3Translate.description}
					</p>

					<div className="flex flex-col gap-3 md:flex-row mt-4">
						<a
							href={createLocalizedLink("/signup")}
							className="bg-[#1F66FF] hover:bg-[#00CFD9] hover:text-black  text-[13px] font-[600] w-[238px] h-[49px] rounded-[10px] flex justify-center items-center"
						>
							{btnTranslate.buttonText}
						</a>
						<a
							href={createLocalizedLink("/contact")}
							className="bg-gray-800 hover:bg-gray-700 dark:bg-white cursor-pointer w-[238px] text-[13px] font-[600] text-white dark:text-[#3A3D44]  dark:text-[#3A3D44] h-[49px] rounded-[10px] flex justify-center items-center"
						>
							{btnTranslate.btnTextContact}
						</a>
					</div>
				</div>

				<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full flex justify-center">
					<Image
						src="/website/home/section3-img.svg"
						alt="API integration and development tools illustration"
						width={800}
						height={400}
						loading="lazy"
						className="w-full h-auto"
					/>
				</div>
			</div>
		</section>
	);
};

export default Section3;
