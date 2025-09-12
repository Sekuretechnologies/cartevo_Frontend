"use client";

//---------------------------------------
import { useTitle } from "@/hooks/useTitle";
import Image from "next/image";
import LoginForm from "./components/form/Form";
import NewsLetterForm from "../../../components/shared/Footer/NewsLetterForm";
import Footer from "@/components/shared/Footer/Footer";
import Link from "next/link";
import { cartevoIconName } from "@/constants/icons";
import WebsiteFooter from "@/components/websiteComponents/WebsiteFooter";
//---------------------------------------

const LoginPage = () => {
	useTitle("Cartevo | Login");
	return (
		<section className="relative flex flex-col mt-0 ">
			<nav className="absolute z-10 top-0 left-0 lg:left-[150px] md:left-[120px]  h-[80px] flex items-center">
				<a href="/">
					<img src="/website/logos/logo_full.png" alt="logo" />
				</a>
			</nav>
			<div className="w-full  grid grid-cols-1  lg:grid-cols-2 font-poppins ">
				<div
					style={{
						backgroundImage:
							"url('/website/home/heroBackground.png')",
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
					}}
					className="font-poppins hidden   bg-primary/10 rounded-br-[50px] h-[750px] pr-28 pl-[150px]  lg:flex flex-col justify-center gap-4 items-center  text-center lg:text-left"
				>
					<h1 className="font-bold text-[30px] leading-8 max-w-[500px] tracking-tight">
						Créez une expérience{" "}
						<span className="text-primary">exceptionnelle</span>{" "}
						pour vos clients grâce à une fintech mondiale intégrée{" "}
					</h1>
					<div className="flex items-center justify-start  text-left gap-4">
						<img src="/website/contact/chevron.png" alt="chevron" />

						<div>
							<h2 className="text-[17px] leading-5 mb-2 font-semibold max-w-[400px]">
								Émission de cartes{" "}
								<span className="text-primary">
									Bancaires virtuelles
								</span>
							</h2>
							<p className="text-[11px] max-w-[380px]">
								Créez et distribuez instantanément des cartes
								bancaires virtuelles pour vos clients ou vos
								équipes, avec un contrôle total sur les plafonds
								et la sécurité.
							</p>
						</div>
					</div>

					<div className="flex items-center  text-left gap-4">
						<img src="/website/contact/chevron.png" alt="" />
						<div>
							<h2 className="text-[17px] leading-5 mb-2 font-semibold max-w-[400px]">
								Collecte de paiements
								<span className="text-primary">
									{" "}
									multi-pays{" "}
								</span>
							</h2>
							<p className="text-[11px] max-w-[380px]">
								Encaissez des paiements via mobile money, cartes
								bancaires et solutions locales dans 14 pays
								africains, le tout depuis une API unique.
							</p>
						</div>
					</div>

					<div className="flex items-center  text-left gap-4">
						<img src="/website/contact/chevron.png" alt="" />
						<div>
							<h2 className="text-[17px] leading-5 mb-2 font-semibold max-w-[400px]">
								<span className="text-primary">
									Tableau de bord{" "}
								</span>
								en temps réel
							</h2>
							<p className="text-[11px] max-w-[380px]">
								Suivez vos transactions, configurez vos règles
								de paiement et contrôlez vos flux financiers
								grâce à un espace intuitif et sécurisé.
							</p>
						</div>
					</div>
				</div>

				<div className=" flex justify-center   items-center">
					<div className="w-full  ">
						<LoginForm />
					</div>
				</div>
			</div>
			<WebsiteFooter />
		</section>
	);
};

export default LoginPage;
