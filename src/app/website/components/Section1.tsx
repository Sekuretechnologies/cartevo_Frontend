import React from "react";
import { FlipWords } from "@/components/ui/shadcn-io/flip-words";

const Section1 = () => {
	const words = ["Fintechs", "PMEs", "Entreprises"];
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
				<div className=" flex flex-col lg:flex-row  pt-40">
					<div className="text-center lg:text-start font-poppins lg:w-[45%]">
						<h1 className="text-[42px] font-[700] leading-[45px] mb-4">
							Faciliter des paiements simples et accessibles pour
							les{" "}
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
							Révolutionnons les paiements en offrant une
							expérience fluide, rapide et sécurisée, connectant
							les individus et les entreprises à travers le monde
							sans frontières.
						</p>

						<div className=" flex flex-col md:flex-row gap-2 md:justify-center lg:justify-start items-center">
							<button className="bg-[#1F66FF] w-[175px] font-semibold text-[13px] text-white h-[49px] rounded-[10px]">
								Commencer
							</button>
							<button className="bg-[#323232] w-[175px] font-semibold text-[13px] text-white h-[49px] rounded-[10px]">
								Contacter le support
							</button>
						</div>
					</div>

					<div className=" lg:absolute lg:bottom-0 lg:-right-0  lg:flex lg:justify-end  lg:px-0 lg:w-[60%] ">
						<img src="website/home/hero.png" alt="hero" />
					</div>
				</div>
			</div>
		</section>
	);
};

export default Section1;
