import { ChevronRight } from "lucide-react";
import React from "react";
import Image from "next/image";

const Section5 = () => {
	return (
		<section className="text-[#222222] pt-12">
			<div className="customContainer  flex flex-col gap-8 lg:flex-row-reverse lg:w-full ">
				<div className="flex flex-col  items-center  lg:items-start   font-poppins">
					<div>
						<div>
							<p className=" border-1 border-[#222222] mb-4 font-semibold text-[13px] px-8 py-2 w-fit rounded-full hover:bg-[#222222] duration-300 hover:text-white">
								Pourquoi nous choisir ?
							</p>
							<h1 className="text-[40px] tracking-tight font-bold leading-10 mb-6 text-center lg:text-left  leading-12 ">
								Choisissez la simplicité qui s’adapte à vous
							</h1>
							<p className="text-center text-[12px] text-[#222222] lg:text-left lg:w-[80%] mb-6">
								Une solution de paiements flexible et sécurisée,
								conçue pour s’adapter aux besoins uniques de
								votre entreprise.
							</p>
						</div>

						<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 ">
							<div className="flex items-start gap-4">
								<div>
									<p className="w-6 h-6  bg-[#1F66FF]  flex justify-center items-center  rounded-full">
										<ChevronRight
											color="#ffffff"
											size={20}
										/>
									</p>
								</div>
								<div className="-mt-2">
									<h2 className="text-[24px] font-semibold ">
										Integration simplifiée
									</h2>
									<p className="text-[#7B7B7B] text-[12px]">
										Intégrez notre API en toute simplicité
										dans vos systèmes existants grâce à une
										documentation claire, un support dédié
										et des outils conçus pour les
										développeurs. Lancez rapidement vos
										propres services financiers, sans
										contraintes techniques, et
										concentrez-vous sur l’innovation et la
										valeur ajoutée pour vos clients.
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div>
									<p className="w-6 h-6  bg-[#1F66FF]  flex justify-center items-center  rounded-full">
										<ChevronRight
											color="#ffffff"
											size={20}
										/>
									</p>
								</div>
								<div className="-mt-2">
									<h2 className="text-[24px] font-semibold ">
										Fiabilité optimale
									</h2>
									<p className="text-[#7B7B7B] text-[12px]">
										Offrez à vos clients une confiance
										digitale inégaléegrâce à une sécurité de
										niveau bancaire, une conformité stricte
										aux réglementations internationales et
										une transparence totale dans vos
										opérations. Chaque transaction est
										protégée et chaque donnée est sécurisée
										pour renforcer la crédibilité de vos
										services financiers.
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div>
									<p className="w-6 h-6  bg-[#1F66FF]  flex justify-center items-center  rounded-full">
										<ChevronRight
											color="#ffffff"
											size={20}
										/>
									</p>
								</div>
								<div className="-mt-2">
									<h2 className="text-[24px] font-semibold ">
										Scalable
									</h2>
									<p className="text-[#7B7B7B] text-[12px]">
										Développez vos activités sans limites
										avec une infrastructure robuste et
										évolutive, capable d’accompagner aussi
										bien les premiers pas d’une startup que
										l’expansion internationale d’une grande
										entreprise. Notre technologie s’adapteà
										vos besoins et supporte des volumes
										élevés de transactions, pour une
										croissance fluide et durable.
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div>
									<p className="w-6 h-6  bg-[#1F66FF]  flex justify-center items-center  rounded-full">
										<ChevronRight
											color="#ffffff"
											size={20}
										/>
									</p>
								</div>
								<div className="-mt-2">
									<h2 className="text-[24px] font-semibold ">
										Processus automatisés
									</h2>
									<p className="text-[#7B7B7B] text-[12px]">
										Automatisez vos processus financiers, de
										la gestion des paiements aux contrôles
										de conformité, pour gagner en rapidité
										et en fiabilité. Réduisez les erreurs
										humaines, améliorez l’efficacité
										opérationnelle et offrez à vos clients
										une expérience plus fluide et moderne,
										tout en libérant du temps pour vos
										équipes.
									</p>
								</div>
							</div>
						</div>
					</div>
					<button className="text-white text-[13px] font-semibold lg:mb-20 cursor-pointer mt-4 flex items-center justify-between pl-16 pr-5 bg-[#222222] w-[251px] h-[59px] rounded-[20px] ">
						Commencer <ChevronRight />
					</button>
				</div>

				<div
					className="relative md:w-[800px]  lg:w-[2800px]  flex justify-center  items-end "
					// style={{
					// 	backgroundImage: "url('/website/home/girl2.png')",
					// 	backgroundSize: "auto 88%",
					// 	backgroundPosition: "50% 110%",
					// 	backgroundRepeat: "no-repeat",
					// }}
				>
					<Image
						src="/website/home/girl2.png"
						alt="Woman using fintech services illustration showing digital payment solutions"
						width={1300}
						height={1000}
						loading="lazy"
						className="absolute bottom-[-5px] w-full object-contain h-auto"
					/>
					{/* <Image
						src="/website/home/section5-2.png"
						alt="Additional fintech interface elements and tools illustration"
						width={200}
						height={150}
						loading="lazy"
						className="absolute top-10 right-10"
						// w-auto h-auto
					/> */}
				</div>
			</div>
		</section>
	);
};

export default Section5;
