import React from "react";
import Image from "next/image";

const PricingSection4 = () => {
	return (
		<section className="py-12">
			<div className="customContainer">
				<div
					style={{
						backgroundImage: "url('/website/home/noise.png')",
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
					}}
					className="h-[450px] sm:h-[400px] w-full rounded-[44px] relative"
				>
					<Image
						src="/website/pricing/grille.png"
						alt="Decorative grid pattern background"
						width={400}
						height={400}
						loading="lazy"
						className="absolute left-0 top-0 w-auto h-auto"
					/>
					<Image
						src="/website/pricing/carree.png"
						alt="Decorative geometric pattern overlay"
						width={200}
						height={200}
						loading="lazy"
						className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
						// w-auto h-auto
					/>
					<div className="px-10 flex flex-col text-center gap-4 items-center justify-center w-full h-full font-poppins absolute left-1/2  top-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
						<h1 className="text-[42px] font-semibold lg:w-2/3 xl:w-1/2 leading-10">
							{"Besoin d'une "}
							<span className="text-[#00CFD9]">
								tarification
							</span>{" "}
							sur mesure ?​
						</h1>
						<p className="text-[14px] lg:w-2/3">
							Nous offrons une tarification très avantageuse aux
							entreprises qui traitent un volume supérieur à 50
							000 000 FCFA par mois.
						</p>

						<div className="text-[#222222] text-[13px] font-semibold flex flex-col gap-2 sm:flex-row items-center">
							<a
								href="/signup"
								className="w-[234px] h-[54px] rounded-[20px] flex justify-center items-center bg-[#00CFD9]"
							>
								Commencer{" "}
							</a>
							<a
								href="/contact"
								className="w-[234px] h-[54px] rounded-[20px] flex justify-center items-center bg-white border-1 border-[#222222]"
							>
								Demander
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default PricingSection4;
