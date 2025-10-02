"use client";

import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";
import { ChevronRight } from "lucide-react";
import React from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

const Section5 = () => {
	const { createLocalizedLink } = useLocalizedNavigation();
	const { t } = useTranslation();
	const section5Translate = t.home.section5;
	const btnTranslate = t.btn;
	return (
		<section className="text-[#222222] pt-12">
			<div className="customContainer  flex flex-col gap-8 lg:flex-row-reverse lg:w-full ">
				<div className="flex flex-col  items-center  lg:items-start   font-poppins">
					<div>
						<div>
							<p className=" border-1 border-[#222222] mb-4 font-semibold text-[13px] px-8 py-2 w-fit rounded-full hover:bg-[#222222] duration-300 hover:text-white">
								{section5Translate.title}
							</p>
							<h1 className="text-[40px] tracking-tight font-bold leading-10 mb-6 text-center lg:text-left  leading-12 ">
								{section5Translate.mainTitle}
							</h1>
							<p className="text-center text-[12px] text-[#222222] lg:text-left lg:w-[80%] mb-6">
								{section5Translate.description}
							</p>
						</div>

						<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 ">
							<div className="flex items-start gap-4">
								<div>
									<p className="w-6 h-6  bg-[#1F66FF]  flex justify-center items-center  rounded-full">
										<ChevronRight
											color="#ffffff"
											size={20}
										/>
									</p>
								</div>
								<div className="-mt-2">
									<h2 className="text-[24px] font-semibold ">
										{section5Translate.simplicity.title}
									</h2>
									<p className="text-[#7B7B7B] text-[12px]">
										{
											section5Translate.simplicity
												.description
										}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div>
									<p className="w-6 h-6  bg-[#1F66FF]  flex justify-center items-center  rounded-full">
										<ChevronRight
											color="#ffffff"
											size={20}
										/>
									</p>
								</div>
								<div className="-mt-2">
									<h2 className="text-[24px] font-semibold ">
										{section5Translate.fiability.title}
									</h2>
									<p className="text-[#7B7B7B] text-[12px]">
										{
											section5Translate.fiability
												.description
										}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div>
									<p className="w-6 h-6  bg-[#1F66FF]  flex justify-center items-center  rounded-full">
										<ChevronRight
											color="#ffffff"
											size={20}
										/>
									</p>
								</div>
								<div className="-mt-2">
									<h2 className="text-[24px] font-semibold ">
										{section5Translate.scalability.title}
									</h2>
									<p className="text-[#7B7B7B] text-[12px]">
										{
											section5Translate.scalability
												.description
										}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div>
									<p className="w-6 h-6  bg-[#1F66FF]  flex justify-center items-center  rounded-full">
										<ChevronRight
											color="#ffffff"
											size={20}
										/>
									</p>
								</div>
								<div className="-mt-2">
									<h2 className="text-[24px] font-semibold ">
										{section5Translate.process.title}
									</h2>
									<p className="text-[#7B7B7B] text-[12px]">
										{section5Translate.process.description}
									</p>
								</div>
							</div>
						</div>
					</div>
					<a
						href={createLocalizedLink("/signup")}
						className="text-white text-[13px] font-semibold lg:mb-20 cursor-pointer mt-4 flex items-center justify-between pl-16 pr-5 bg-[#222222] w-[251px] h-[59px] rounded-[20px] "
					>
						{btnTranslate.buttonText} <ChevronRight />
					</a>
				</div>

				<div
					className="relative w-[350px]  mx-auto md:w-[600px]  lg:w-[2800px]  flex justify-center  items-end mt-96 md:mt-[700px] lg:mt-0 xl:mt-[600px]"
					// style={{
					// 	backgroundImage: "url('/website/home/girl2.png')",
					// 	backgroundSize: "auto 88%",
					// 	backgroundPosition: "50% 110%",
					// 	backgroundRepeat: "no-repeat",
					// }}
				>
					<Image
						src="/website/home/girl2.png"
						alt="Woman using fintech services illustration showing digital payment solutions"
						width={1300}
						height={1000}
						loading="lazy"
						className="absolute left-1/2 -translate-x-1/2  bottom-[-5px] w-full object-contain h-auto"
					/>
					{/* <Image
						src="/website/home/section5-2.png"
						alt="Additional fintech interface elements and tools illustration"
						width={200}
						height={150}
						loading="lazy"
						className="absolute top-10 right-10"
						// w-auto h-auto
					/> */}
				</div>
			</div>
		</section>
	);
};

export default Section5;
