import { ChevronRight } from "lucide-react";
import React from "react";
import Image from "next/image";

const Section2 = () => {
	return (
		<section className="py-12">
			<div
				className="customContainer 
              text-[#222222]"
			>
				<div className="mb-8 lg:mb-12 font-poppins ">
					<h1 className=" text-[40px] font-[700] leading-10 text-center lg:text-left mb-4 tracking-tight">
						Des services complets fournis
					</h1>
					<p className="text-[12px] text-center lg:text-left lg:w-[650px] font-[300] ">
						Offrez à vos clients une expérience unique avec des
						fonctionnalités adaptées à leurs besoins. Utilisez l’API
						Cartevo et personnalisez-la à votre image.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 font-poppins">
					{/* Bloc 1 */}
					<div className="flex flex-col">
						{/* Images */}
						<div className="w-full h-[243px] bg-[#DBEDF3] rounded-[15px] mb-8 flex items-end justify-center">
							<Image
								src="/website/home/mobile.png"
								alt="Mobile payment illustration showing payment collection across African countries"
								width={490}
								height={390}
								loading="lazy"
								// className="w-auto h-auto"
							/>
						</div>

						{/* Texte + bouton */}
						<div className="flex flex-col items-center flex-1 text-center md:text-left md:items-start">
							<p className="border text-[13px] border-[#222222] px-8 py-2 w-fit rounded-full hover:bg-[#222222] duration-300 hover:text-white mb-4">
								Paiement en tant que service
							</p>
							<h2 className="text-[30px] font-[700] leading-8 mb-4">
								<span className="text-primary">
									Une seule API
								</span>{" "}
								pour collecter de l’argent dans 14 pays
								africains
							</h2>
							<p className="text-[12px] mb-4 text-[#7B7B7B]">
								Avec une seule API, simplifiez vos encaissements
								dans 14 pays africains et unifiez vos flux
								financiers sur une plateforme unique. Offrez à
								vos clients la possibilité de payer via mobile
								money, cartes bancaires et solutions locales,
								tout en garantissant rapidité, sécurité et
								conformité.
							</p>

							{/* Bouton en bas */}
							<div className="mt-auto">
								<a
									href="/login"
									className="text-white text-[13px] font-semibold bg-[#252421] px-8 py-3 w-fit flex gap-2 items-center rounded-full"
								>
									Commencer <ChevronRight />
								</a>
							</div>
						</div>
					</div>

					{/* Bloc 2 */}
					<div className="flex flex-col mt-8 md:mt-0" >
						{/* Images */}
						<div className="w-full h-[243px] bg-[#DBEDF3] rounded-[15px] mb-8 flex items-end justify-center">
							<Image
								src="/website/home/card.png"
								alt="Virtual card illustration showing card issuance and management features"
								width={300}
								height={200}
								loading="lazy"
								// className="w-auto h-auto"
							/>
						</div>

						{/* Texte + bouton */}
						<div className="flex flex-col flex-1 text-center md:text-left md:items-start">
							<p className="border px-8 text-[13px] py-2 w-fit rounded-full hover:bg-[#222222] border-[#222222] duration-300 hover:text-white mb-4">
								Carte en tant que service
							</p>
							<h2 className="text-[30px] font-[700] leading-8 mb-4">
								<span className="text-blue-primary">
									Emettez des{" "}
									<span className="text-primary">
										Cartes bancaires
									</span>{" "}
									Virtuelles à vos clients et équipes
								</span>
							</h2>
							<p className="text-[12px] mb-4 text-[#7B7B7B]">
								Créez, personnalisez et distribuez des cartes
								virtuelles en quelques secondes. Gardez le
								contrôle total sur les plafonds, les dépenses et
								la sécurité, tout en offrant flexibilité et
								transparence. Une solution idéale pour les
								fintechs, PME et marketplaces qui souhaitent
								moderniser leurs paiements et optimiser la
								gestion financière
							</p>

							{/* Bouton en bas */}
							<div className="mt-auto">
								<a
									href="/login"
									className="text-white text-[13px] font-semibold bg-[#252421] px-8 w-fit py-3 flex gap-2 items-center rounded-full"
								>
									Commencer <ChevronRight />
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Section2;
