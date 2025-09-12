import React from "react";
import Image from "next/image";

const Section6 = () => {
	return (
		<section className="relative">
			<div
				className="customContainer h-[750px] md:h-[630px] -mt-2 "
				style={{
					backgroundImage: "url('/website/home/noise.png')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
			>
				<div
					className="h-full w-full pt-24"
					style={{
						backgroundImage: "url('/website/home/grid.png')",
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
					}}
				>
					<Image
						src="/website/home/carres.png"
						alt="Geometric design elements representing fintech architecture"
						width={400}
						height={300}
						loading="lazy"
						className="w-full h-auto"
					/>
				</div>
				<div
					className=" absolute bottom-0 left-0 w-full h-[150px] md:h-[200px]"
					style={{
						backgroundImage: "url('/website/home/Ellipse.png')",
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
					}}
				>
					{/* <img
						src="/website/home/Ellipse.png"
						alt=""
						className="absolute bottom-0"
					/> */}
					<div className="relative ">
						<div className="relative top-0 sm:top-10 lg:top-20 w-full ">
							<Image
								src="/website/home/afrik.png"
								alt="Africa map illustration showing Cartevo's coverage across the continent"
								width={600}
								height={400}
								loading="lazy"
								className="absolute left-1/2 -translate-x-1/2 -top-5 md:-top-16 lg:-top-28 md:w-[90%] lg:w-[70%] h-auto"
							/>
						</div>
					</div>
				</div>

				<div className="flex flex-col items-center font-poppins text-white pt-12 gap-4 text-center absolute z-30 top-0 left-1/2 -translate-x-1/2">
					<h3 className="w-[250px] h-[35px] border-1 border-white text-[13px] font-semibold font-poppins flex items-center justify-center rounded-full">
						For Developers & Businesses
					</h3>
					<h1 className="text-[50px] font-semibold text-center leading-[45px]">
						Commencez à construire avec{" "}
						<span className="text-[#00CFD9] ">Cartevo</span>
					</h1>
					<p className="text-[14px] max-w-[800px]">
						Que vous automatisiez vos finances ou offriez des
						services de paiement, bancaires ou de cartes, nos APIs
						vous donnent les outils pour construire, évoluer et
						réussir.
					</p>
					<div className="flex flex-col gap-2  md:flex-row">
						<a
							href="/login"
							className="w-[263px] h-[54px] flex justify-center items-center rounded-[20px] text-[#0D5053] text-[13px] font-semibold bg-[#00CFD9]"
						>
							Commencer Maintenant
						</a>
						<a
							href="/website/contact"
							className="w-[263px] h-[54px] flex justify-center  items-center rounded-[20px] text-[#0D5053] text-[13px] font-semibold bg-white"
						>
							Contacter le support
						</a>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Section6;
