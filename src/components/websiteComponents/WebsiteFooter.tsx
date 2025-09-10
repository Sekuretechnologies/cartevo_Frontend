import React from "react";

const WebsiteFooter = () => {
	return (
		<footer className=" py-12">
			<div className="customContainer">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:grid-cols-4  border-b-1 pb-8 mb-8 border-[#CBCBCB]">
					<div className="flex flex-col justify-between items-start">
						<img
							src="/website/logos/logo_full.png"
							alt="logo"
							className="-ml-[6px]"
						/>
						<p className="uppercase max-w-64  font-syne font-bold text-[12px]">
							Innovez sans attendre, encaissez sans limite.
						</p>
					</div>
					<ul className="flex flex-col gap-2 font-semibold text-[12px] font-poppins">
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

					<ul className="*:flex  *:gap-4 flex flex-col gap-4 lg:gap-0 lg:justify-between font-semibold font-poppins text-[12px]">
						<li>
							<div>
								<img src="/website/logos/phone.png" alt="" />
							</div>
							<span>+44 55 88 77 99</span>
						</li>
						<li>
							<div>
								<img src="/website/logos/mail.png" alt="" />
							</div>
							<span>contact@cartevo.co</span>
						</li>
						<li>
							<div>
								<img
									src="/website/logos/loc.png"
									alt=""
									className=""
								/>
							</div>
							<span>
								71-75 Shelton Street, London, United Kingdom
							</span>
						</li>
					</ul>

					<ul className="flex gap-2 items-end">
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
					© 2025 Cartevo. Tous droits réservés.
				</p>
				<p className="text-[12px] text-black-text">
					Cartevo est une plateforme fintech innovante spécialisée
					dans l’émission de cartes bancaires virtuelles et la
					collecte de paiements via API dans 14 pays africains. Nous
					offrons ces services en partenariat avec des opérateurs de
					paiement, des agrégateurs et des banques dûment agréés et
					conformes dans leurs juridictions respectives, afin de
					garantir la sécurité, la conformité et la fiabilité de nos
					solutions. Tous les contenus de ce site, y compris les
					textes, visuels, logos et éléments graphiques, sont protégés
					par les lois sur la propriété intellectuelle. Toute
					reproduction, diffusion ou utilisation non autorisée, totale
					ou partielle, est strictement interdite sans autorisation
					préalable.
				</p>
			</div>
		</footer>
	);
};

export default WebsiteFooter;
