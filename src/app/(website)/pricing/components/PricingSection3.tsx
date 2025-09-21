import { ChevronRight } from "lucide-react";
import React from "react";
import Image from "next/image";

const PricingSection3 = () => {
	return (
		<section className="pb-12 ">
			<div className="customContainer py-24 flex flex-col lg:flex-row items-center lg:justify-center gap-16 lg:gap-24 w-full max-w-[1600px] mx-auto ">
				<div className="flex flex-col items-center lg:items-start  max-w-[500px] font-poppins">
					<h1 className="text-4xl font-bold text-center lg:text-start leading-10 mb-4">
						Support dédié aux développeurs
					</h1>
					<p className="text-black-text text-center lg:text-start mb-4 text-[13px]">
						Un accompagnement technique de bout en bout pour une
						intégration rapide et fluide de nos API. Nos équipes
						vous aident à déployer et optimiser vos services
						financiers.
					</p>

					<div className="flex flex-col  gap-4">
						<div className="flex gap-4">
							<div className="w-6 h-6 aspect-square bg-primary flex justify-center items-center rounded-full">
								<ChevronRight color="#ffffff" size={20} />
							</div>
							<p className="font-semibold">
								Documentation claire et complète
							</p>
						</div>

						<div className="flex items-center gap-4 font-semibold">
							<div className="w-6 h-6 aspect-square bg-primary flex justify-center items-center rounded-full">
								<ChevronRight color="#ffffff" size={20} />
							</div>
							<p>Sandbox pour vos tests</p>
						</div>

						<div className="flex items-center gap-4 font-semibold">
							<div className="w-6 h-6 aspect-square bg-primary flex justify-center items-center rounded-full">
								<ChevronRight color="#ffffff" size={20} />
							</div>
							<p>Assistance technique réactive</p>
						</div>

						<div className="flex flex-col items-center sm:flex-row">
							<Image
								src="/website/pricing/logo1.png"
								alt="Technology partner logo 1"
								width={300}
								height={50}
								loading="lazy"
								// className="w-auto h-auto"
							/>
							<Image
								src="/website/pricing/logo2.png"
								alt="Technology partner logo 2"
								width={300}
								height={50}
								loading="lazy"
								// className="w-auto h-auto"
							/>
						</div>
					</div>
				</div>

				<div className="px-4 sm:px-8 md:px-28 mt-12 lg:px-0 lg:w-[517px] h-[280px] sm:h-[320px] md:h-[357px] rounded-[32px] bg-[#DBEEF3] relative overflow-visible flex justify-center items-end">
					<Image
						src="/website/pricing/men.png"
						alt="Developer support illustration showing technical assistance and collaboration"
						width={450}
						height={320}
						loading="lazy"
						className="w-[450px] h-auto"
					/>
				</div>
			</div>
		</section>
	);
};

export default PricingSection3;
