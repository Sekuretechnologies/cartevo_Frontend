import React from "react";
import ContactForm from "./component/form";

const Contact = () => {
	return (
		<section className="pt-20">
			<div className="  customContainer grid grid-cols-1 lg:grid-cols-2 lg:gap-20">
				<div className=" font-poppins pt-20 flex flex-col gap-4 items-center text-center lg:text-left ">
					<div
						style={{
							backgroundImage:
								"url('/website/home/heroBackground.png')",
							backgroundSize: "cover",
							backgroundPosition: "center",
							backgroundRepeat: "no-repeat",
						}}
						className="w-1/2 hidden lg:block h-[610px] rounded-br-[50px] absolute top-0 left-0 bg-primary/10"
					></div>
					{/* <h1 className="font-bold text-[42px] leading-10 ">
						Faciliter des{" "}
						<span className="text-primary">paiements simples</span>{" "}
						et accessibles depuis l’Afrique
					</h1>
					<div className="flex items-center  text-left gap-4">
						<img src="/website/contact/chevron.png" alt="" />
						<div>
							<h2 className="text-[17px] leading-5 mb-2 font-semibold">
								<span className="text-primary">
									Collectez de l’argent{" "}
								</span>
								à travers les pays d’Afrique
							</h2>
							<p className="text-[11px]">
								SayPay est une solution de paiement intelligente
								pilotée par un assistant virtuel nommé
							</p>
						</div>
					</div>

					<div className="flex items-center  text-left gap-4">
						<img src="/website/contact/chevron.png" alt="" />
						<div>
							<h2 className="text-[17px] leading-5 mb-2 font-semibold">
								Emettez vos propres
								<span className="text-primary">
									Cartes bancaires{" "}
								</span>
								Virtuelles
							</h2>
							<p className="text-[11px]">
								SayPay est une solution de paiement intelligente
								pilotée par un assistant virtuel nommé
							</p>
						</div>
					</div> */}
				</div>

				<div>
					<ContactForm />
				</div>
			</div>
		</section>
	);
};

export default Contact;
