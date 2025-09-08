import { ChevronRight } from "lucide-react";
import React from "react";

const Section2 = () => {
	return (
		<section className="py-12">
			<div
				className="customContainer 
              text-[#222222]"
			>
				<div className="mb-8 font-poppins ">
					<h1 className=" text-[40px] font-[700] leading-10 text-center lg:text-left mb-4">
						Des services complets fournis
					</h1>
					<p className="text-[12px] text-center lg:text-left lg:w-2/3 font-[300] ">
						Dis à SayPay : « crée-moi une carte », « envoie 50 k à
						maman », « envoie 120 k à Myriam et David chaque 28 »…
						et il le fait. Pilotée par l’assistant Say, SayPay est
						l’appli mobile qui vous permet de gérer votre argent par
						simple discussion
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 font-poppins">
					<div>
						{/** Images */}
						<div className="w-full h-[243px] bg-[#DBEDF3]  rounded-[15px] mb-8 flex items-end justify-center">
							<img
								src="/website/home/mobile.png"
								alt="cards"
								className=""
							/>
						</div>

						<div className="flex flex-col items-center text-center md:text-left md:items-start ">
							<p className="border-1 border-[#222222] px-8 py-2 w-fit rounded-full hover:bg-[#222222] duration-300 hover:text-white mb-4">
								Payment as a service
							</p>
							<h2 className="text-[30px] font-[700] leading-8 mb-4">
								<span className="text-primary">Collectez</span>{" "}
								de l’argent à travers les pays d’Afrique
							</h2>
							<p className="text-[12px] mb-4 text-[#7B7B7B]">
								SayPay est une solution de paiement intelligente
								pilotée par un assistant virtuel nommé Say, qui
								vous permet de gérer votre argent simplement
								SayPay est une solution de paiement intelligente
								pilotée par un assistant virtuel nommé Say, qui
								vous permet de gérer votre argent simplement
							</p>

							<a
								href="#"
								className="text-white bg-[#252421] px-8 py-3 flex gap-2 items-center rounded-full"
							>
								Commencer <ChevronRight />
							</a>
						</div>
					</div>

					{/**Div 2 */}
					<div>
						{/** Images */}
						<div className="w-full h-[243px] bg-[#DBEDF3] rounded-[15px] mb-8 flex items-end justify-center">
							<img
								src="/website/home/card.png"
								alt="cards"
								className=""
							/>
						</div>

						<div className="flex flex-col  items-center text-center md:text-left md:items-start ">
							<p className="border-1 px-8 py-2 w-fit rounded-full hover:bg-[#222222] border-[#222222] duration-300 hover:text-white mb-4">
								Card as a service
							</p>

							<h2 className="text-[30px] font-[700] leading-8 mb-4">
								<span className="text-blue-primary">
									Emettez vos propres{" "}
									<span className="text-primary">
										Cartes bancaires
									</span>
									Virtuelles
								</span>{" "}
							</h2>

							<p className="text-[12px] mb-4 text-[#7B7B7B]">
								SayPay est une solution de paiement intelligente
								pilotée par un assistant virtuel nommé Say, qui
								vous permet de gérer votre argent simplement
								SayPay est une solution de paiement intelligente
								pilotée par un assistant virtuel nommé Say, qui
								vous permet de gérer votre argent simplement{" "}
							</p>

							<a
								href="#"
								className="text-white bg-[#252421] px-8 py-3 flex gap-2 items-center rounded-full"
							>
								Commencer <ChevronRight />
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Section2;
