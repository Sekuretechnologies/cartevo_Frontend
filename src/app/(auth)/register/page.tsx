import WebsiteFooter from "@/components/websiteComponents/WebsiteFooter";
import React from "react";
import RegisterForm from "./components/RegisterForm";

const Register = () => {
	return (
		<section className="relative flex flex-col mt-0 w-full">
			<nav className="absolute z-10 top-0 left-10 lg:left-[150px]  h-[80px] flex items-center">
				<a href="/">
					<img src="/website/logos/logo_full.png" alt="logo" />
				</a>
			</nav>
			<div className="w-full   grid grid-cols-1 lg:grid-cols-2 font-poppins ">
				<div
					style={{
						backgroundImage:
							"url('/website/home/heroBackground.png')",
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
					}}
					className="font-poppins hidden  bg-primary/10 rounded-br-[50px] h-[750px] pr-28 pl-[150px]  lg:flex flex-col justify-center gap-4 items-center  text-center lg:text-left"
				>
					<h1 className="font-bold text-[35px] leading-10 max-w-[500px] tracking-tight">
						Gérez, encaissez et développez avec une suite complète
						pour <span className="text-primary">simplifier</span>{" "}
						vos finances
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
				</div>
				<div className=" flex justify-center items-center px-[50px]">
					<div className="w-full max-w-[700px]  ">
						<RegisterForm />
						{/* <CreateAccountForm /> */}
					</div>
				</div>
			</div>
			<WebsiteFooter />
		</section>
	);
};

export default Register;
