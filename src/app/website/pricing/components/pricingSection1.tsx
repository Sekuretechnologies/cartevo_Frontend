import { ChevronRight } from "lucide-react";
import React from "react";

const PricingSection1 = () => {
	return (
		<section className="pt-20 pb-12">
			<div className="customContainer  flex flex-col lg:flex-row items-center lg:justify-center gap-8 lg:gap-24 w-full max-w-[1600px] mx-auto ">
				<div className="flex flex-col items-center lg:items-start  max-w-[500px] font-poppins">
					<h1 className="text-4xl font-bold text-center lg:text-start leading-10 mb-4">
						Une tarification claire sans coûts cachés
					</h1>
					<p className="text-black-text text-center lg:text-start mb-4 text-[13px]">
						Pas de frais minimum ou de frais cachés. Avec AfribaPay
						vous ne payez que les transactions réussies
					</p>

					<div className="flex flex-col  gap-4">
						<div className="flex gap-4">
							<p className="w-6 h-6 bg-primary flex justify-center items-center rounded-full">
								<ChevronRight color="#ffffff" size={20} />
							</p>
							<p className="font-semibold">Aucun coût mensuel</p>
						</div>

						<div className="flex items-center gap-4 font-semibold ">
							<p className="w-6 h-6 bg-primary flex justify-center items-center rounded-full">
								<ChevronRight color="#ffffff" size={20} />
							</p>
							<p>Aucuns frais de configuration</p>
						</div>
					</div>
				</div>

				<div className="px-20 md:px-28  overflow-hidden rounded-[32px] bg-[#DBEEF3] flex items-start">
					<img
						src="/website/pricing/hero.png"
						alt=""
						className="object-contain mx-auto h-full"
					/>
				</div>
			</div>
		</section>
	);
};

export default PricingSection1;
