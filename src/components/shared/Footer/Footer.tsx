"use client";

import { cartevoIconName } from "@/constants/icons";
//---------------------------------------
import NewsLetterForm from "./NewsLetterForm";
//---------------------------------------

const Footer = () => {
	return (
		<div className="relative w-full flex gap-10 py-10 px-[50px]">
			<div className="relative flex flex-col gap-5 pr-10">
				<div className="">
					{/* <img
						src="/images/cartevo-logo.svg"
						alt="cartevo-logo"
						className=""
					/> */}
					{cartevoIconName}
				</div>
				<div className="flex flex-col justify-center items-center w-full gap-5">
					<div className="text-app-primary font-bold">
						contact@cartevo.co
					</div>
					<div className="flex gap-5">
						<img
							src="/images/facebook.svg"
							alt="facebook-logo"
							className=""
						/>
						<img src="/images/x.svg" alt="x-logo" className="" />
					</div>
				</div>
			</div>
			<div className="relative flex flex-col gap-3 w-full">
				<div className="text-app-primary font-bold">Entreprise</div>
				<ul className="gap-3 w-full">
					<li>
						<a href="" className="text-app-secondary">
							Qui sommes nous ?
						</a>
					</li>
					<li>
						<a href="" className="text-app-secondary">
							Notre vision
						</a>
					</li>
					<li>
						<a href="" className="text-app-secondary">
							Notre mission
						</a>
					</li>
					<li>
						<a href="" className="text-app-secondary">
							Termes
						</a>
					</li>
				</ul>
			</div>
			<div className="relative flex flex-col gap-3 w-full">
				<div className="text-app-primary font-bold">Produits</div>
				<ul className="gap-3 w-full">
					<li>
						<a href="" className="text-app-secondary">
							Cartes bancaires
						</a>
					</li>
					<li>
						<a href="" className="text-app-secondary">
							Collecte de paiements
						</a>
					</li>
					<li>
						<a href="" className="text-app-secondary">
							Paiements internationaux
						</a>
					</li>
					<li>
						<a href="" className="text-app-secondary">
							Wallet Multi devises
						</a>
					</li>
				</ul>
			</div>
			<div className="relative flex flex-col gap-3 w-full">
				<div className="text-app-primary font-bold">Utilisateurs</div>
				<ul className="gap-3 w-full">
					<li>
						<a href="" className="text-app-secondary">
							Fintechs
						</a>
					</li>
					<li>
						<a href="" className="text-app-secondary">
							PMEs
						</a>
					</li>
					<li>
						<a href="" className="text-app-secondary">
							Entreprises globales
						</a>
					</li>
				</ul>
			</div>
			<div className="relative flex flex-col gap-3 w-full">
				<div className="text-app-primary font-bold">Legal</div>
				<ul className="gap-3 w-full">
					<li>
						<a href="" className="text-app-secondary">
							Terms of services
						</a>
					</li>
					<li>
						<a href="" className="text-app-secondary">
							Confidentialité
						</a>
					</li>
					<li>
						<a href="" className="text-app-secondary">
							Sécurité
						</a>
					</li>
				</ul>
			</div>
			<div className="relative flex flex-col gap-3 w-full">
				<div className="text-app-primary font-bold">Newsletter</div>
				<NewsLetterForm />
			</div>
		</div>
	);
};

export default Footer;
