import React from "react";

const Section3 = () => {
	return (
		<section>
			<div
				className="custonContainer pt-12  text-white font-poppins relative h-[820px] md:h-[700px] xl:h-[750px]"
				style={{
					backgroundImage: "url('/website/home/rectangle-back.png')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
			>
				<div className="absolute left-1/2 -translate-x-1/2 w-full flex justify-center bottom-10 z-10">
					<img
						src="/website/home/group.png"
						alt=""
						className="w-[80%]"
					/>
				</div>
				<div className="flex absolute top-10 left-1/2 w-full   -translate-x-1/2 flex-col items-center gap-4 z-50 ">
					<h3 className="w-[250px] h-[35px] border-1 border-white text-[13px] font-semibold flex items-center justify-center rounded-full">
						For Developers & Businesses
					</h3>
					<h1 className="text-[43px] font-semibold text-center max-w-[900px] leading-10 tracking-tight">
						Intégrez nos API et développez, vos propres solutions de{" "}
						<span className="text-[#5BC9E5]">
							paiement et produits financiers
						</span>{" "}
						directement intégrés aux applications de vos clients.
					</h1>
					<p className="text-[14px] text-center  max-w-[900px]">
						Accédez à une documentation complète, des SDKs et un
						environnement sandbox pour déployer et scaler vos
						produits financiers directement dans vos produits.
					</p>

					<div className="flex flex-col gap-2 md:flex-row mt-4">
						<a
							href="/login"
							className="bg-[#1F66FF] hover:bg-[#00CFD9] hover:text-black  text-[13px] font-[600] w-[238px] h-[49px] rounded-[10px] flex justify-center items-center"
						>
							Commencer
						</a>
						<a
							href="/website/contact"
							className="bg-white cursor-pointer w-[238px] text-[13px] font-[600] text-[#3A3D44] h-[49px] rounded-[10px] flex justify-center items-center"
						>
							Contacter le support
						</a>
					</div>
				</div>

				<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full flex justify-center">
					<img src="website/home/section3.png" alt="" />
				</div>
			</div>
		</section>
	);
};

export default Section3;
