import React from "react";

const WebsiteFooter = () => {
	return (
		<footer className=" py-12">
			<div className="customContainer">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:grid-cols-4  border-b-1 pb-8 mb-8 border-[#CBCBCB]">
					<div>
						<img src="/website/logos/logo_full.png" alt="logo" />
						<p className="uppercase max-w-64  font-syne font-bold">
							Nous redéfinissons le paiement en ligne en Afrique
						</p>
					</div>
					<ul className="flex flex-col gap-2 font-semibold">
						<li>
							<a href="#">Politique de confidentialité</a>
						</li>
						<li>
							<a href="#">Termes et conditions</a>
						</li>
						<li>
							<a href="#">Contactez-nous</a>
						</li>
					</ul>

					<ul className="*:flex  *:gap-4 flex flex-col gap-4 font-semibold">
						<li>
							<img src="/website/logos/phone.png" alt="" />
							<span>+44 55 88 77 99</span>
						</li>
						<li>
							<img src="/website/logos/mail.png" alt="" />
							<span>hello@saypay.ai</span>
						</li>
						<li>
							<img src="/website/logos/loc.png" alt="" />
							<span>123 Scheduler St, Tech City, USA</span>
						</li>
					</ul>

					<ul className="flex gap-2 items-center">
						<li>
							<a href="#">
								<img src="/website/logos/facebook.png" alt="" />
							</a>
						</li>
                        <li>
							<a href="#">
								<img src="/website/logos/x.png" alt="" />
							</a>
						</li>
                        <li>
							<a href="#">
								<img src="/website/logos/in.png" alt="" />
							</a>
						</li>
					</ul>
				</div>
				<p className="text-[12px] text-black-text">
					SayPay LLC est une société immatriculée en Angleterre et au
					Pays de Galles sous le numéro 15512483 et dont le siège
					social est situé au Monomark House 27 Old Gloucester Street
					LONDON - WC1N 3AX United Kingdom (GB) et au Cameroun sur le
					N•RCCM/autorisation : CM-DLA-01-2024-B12-00558. Sekure
					Technologies Limited est une société de technologie
					financière , pas une banque. Les services bancaires et de
					transferts via notre application ou site web sont fournis
					par nos banques partenaires dûment agréées dans leurs
					juridictions respectives .
				</p>
			</div>
		</footer>
	);
};

export default WebsiteFooter;
