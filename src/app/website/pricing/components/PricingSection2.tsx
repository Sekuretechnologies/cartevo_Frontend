import { ChevronRight } from "lucide-react";
import React from "react";

const PricingSection2 = () => {
	return (
		<section className="py-12 ">
			<div className="customContainer py-24 flex flex-col lg:flex-row-reverse items-center lg:justify-center gap-16 lg:gap-24 w-full max-w-[1600px] mx-auto ">
				<div className="flex flex-col items-center lg:items-start  max-w-[500px] font-poppins">
					<h1 className="text-4xl font-bold text-center lg:text-start leading-10 mb-4">
						Une tarification claire sans coûts cachés
					</h1>
					<p className="text-black-text text-center lg:text-start mb-4 text-[13px]">
						révolutionnons les paiements en offrant une expérience
						fluide, rapide et sécurisée, connectant les individus et
						les entreprises
					</p>

					<div className="flex flex-col  gap-4">
						<div className="flex gap-4">
							<p className="w-6 h-6 bg-primary flex justify-center items-center rounded-full">
								<ChevronRight color="#ffffff" size={20} />
							</p>
							<p className="font-semibold">
								Facile à installer et commencer à recevoir les
								paiements
							</p>
						</div>

						<div className="flex items-center gap-4 font-semibold">
							<p className="w-6 h-6 bg-primary flex justify-center items-center rounded-full">
								<ChevronRight color="#ffffff" size={20} />
							</p>
							<p>
								Configuration simple et statistiques en temps
								réel
							</p>
						</div>

						<div className="flex items-center gap-4 font-semibold">
							<p className="w-6 h-6 bg-primary flex justify-center items-center rounded-full">
								<ChevronRight color="#ffffff" size={20} />
							</p>
							<p>
								Accès à toutes les fonctionnalités du
								back-office marchand
							</p>
						</div>
					</div>
				</div>

				<div className="px-4 sm:px-8 md:px-28 mt-12 lg:px-0 lg:w-[517px] h-[280px] sm:h-[320px] md:h-[357px] rounded-[32px] bg-[#DBEEF3] relative overflow-visible flex justify-center items-end">
					<img
						src="/website/pricing/girl.png"
						alt="picture"
						className=" w-[350px] "
					/>
				</div>
			</div>
		</section>
	);
};

export default PricingSection2;
