import React from "react";

const Section3 = () => {
	return (
		<section>
			<div
				className="custonContainer pt-12  text-white font-poppins relative"
				style={{
					backgroundImage: "url('/website/home/rectangle-back.png')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
			>
				<div className="absolute left-1/2 -translate-x-1/2 w-full flex justify-center bottom-10">
					<img
						src="/website/home/group.png"
						alt=""
						className="w-[80%]"
					/>
				</div>
				<div className="flex flex-col items-center gap-4 mb-8">
					<h3 className="w-[250px] h-[35px] border-1 border-white text-[13px] font-semibold flex items-center justify-center rounded-full">
						For Developers & Businesses
					</h3>
					<h1 className="text-[43px] font-semibold text-center max-w-[900px] leading-10">
						Integrate our APIs to create{" "}
						<span className="text-[#5BC9E5]">
							your own payments and financial products
						</span>{" "}
						into your customers’ apps
					</h1>
					<p className="text-[14px] text-center  max-w-[900px]">
						envoie 50 k à maman », « envoie 120 k à Myriam et David
						chaque fait. Pilotée par l’assistant Say, SayPay est
						l’appli mobile qui vous permet de gérer votre argent par
					</p>

					<div className="flex flex-col gap-2 md:flex-row mt-4">
						<a
							href="#"
							className="bg-[#1F66FF] hover:bg-[#2a6eff] text-[13px] font-[600] w-[238px] h-[49px] rounded-[10px] flex justify-center items-center"
						>
							Commencer
						</a>
						<a
							href="#"
							className="bg-white w-[238px] text-[13px] font-[600] text-[#3A3D44] h-[49px] rounded-[10px] flex justify-center items-center"
						>
							Contacter le support
						</a>
					</div>
				</div>

				<div className="flex justify-center">
					<img src="website/home/section3.png" alt="" />
				</div>
			</div>
		</section>
	);
};

export default Section3;
