import React from "react";
import Image from "next/image";

const Section4 = () => {
	return (
		<section className="mt-10 py-12 text-[#222222]">
			<div className="customContainer  ">
				<div className="flex flex-col items-center gap-4 text-center font-poppins">
					<h1 className="text-[37px] font-bold leading-10 text-center max-w-[800px]">
						Construire l’avenir des services financiers
					</h1>
					<p className="max-w-[750px] mb-8 text-[12px]">
						Nous offrons aux entreprises les outils pour créer des
						services financiers modernes, accessibles et sécurisés,
						adaptés aux besoins du marché africain.
					</p>
				</div>
				<div className="grid grid-cols-1  gap-4 md:grid-cols-2 lg:grid-cols-3 font-poppins">
					<div className="bg-[#E7F7FF] p-12 rounded-[30px]">
						<Image
							src="/website/home/1.png"
							alt="Fintech companies illustration showing modern financial technology solutions"
							width={200}
							height={150}
							loading="lazy"
							className="mb-10 "
							//w-auto h-auto
						/>
						<h2 className="mb-4 text-[24px] font-semibold">
							Fintechs
						</h2>
						<p className="text-[#222222] text-[12px]">
							Boostez vos services avec des paiements rapides,
							wallets multi-devises et cartes virtuelles. Nous
							apportons la fiabilité et la scalabilité nécessaires
							pour soutenir vos ambitions financières modernes.
						</p>
					</div>

					<div className="bg-[#E7F7FF] p-12 rounded-[30px]">
						<Image
							src="/website/home/2.png"
							alt="Global enterprises illustration showing international business operations"
							width={200}
							height={150}
							loading="lazy"
							className="mb-10"
							// w-auto h-auto
						/>
						<h2 className="mb-4 text-[24px] font-semibold">
							Entreprises Globales
						</h2>
						<p className="text-[#5F5F5F] text-[12px]">
							Connectez vos opérations globales avec des paiements
							fluides, une collecte internationale simplifiée et
							des outils multi-devises. Restez compétitif et
							optimisez vos flux financiers sans frontières.
						</p>
					</div>

					<div className="bg-[#E7F7FF] p-12 rounded-[30px]">
						<Image
							src="/website/home/3.png"
							alt="Small and medium enterprises illustration showing business growth and financial tools"
							width={200}
							height={150}
							loading="lazy"
							className="mb-10"
							// w-auto h-auto
						/>
						<h2 className="mb-4 text-[24px] font-semibold">PMEs</h2>
						<p className="text-[#5F5F5F] text-[12px]">
							Accédez à des paiements internationaux, des wallets
							polyvalents et des outils sécurisés. Concentrez-vous
							sur la croissance de votre entreprise pendant que
							nous simplifions vos transactions.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Section4;
