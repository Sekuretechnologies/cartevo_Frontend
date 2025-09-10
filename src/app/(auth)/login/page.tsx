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
			<nav className="absolute z-10 top-0 left-[150px]  h-[80px] px-[50px] flex items-center">
				<a className=" " href="/website">
					{cartevoIconName}
				</a>
			</nav>
			<div className="w-full  grid grid-cols-2 font-poppins ">
				<div
					style={{
						backgroundImage:
							"url('/website/home/heroBackground.png')",
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
					}}
					className=" font-poppins  bg-primary/10 border-br h-screen pr-28 pl-[150px]  flex flex-col justify-start gap-4 items-center pt-44 text-center lg:text-left "
				>
					<h1 className="font-bold text-[35px] leading-10 ">
						Faciliter des{" "}
						<span className="text-primary">paiements simples</span>{" "}
						et accessibles depuis l’Afrique
					</h1>
					<div className="flex items-center justify-start  text-left gap-4">
						<img src="/website/contact/chevron.png" alt="chevron" />

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
									{" "}
									Cartes bancaires{" "}
								</span>
								Virtuelles
							</h2>
							<p className="text-[11px]">
								SayPay est une solution de paiement intelligente
								pilotée par un assistant virtuel nommé
							</p>
						</div>
					</div>
				</div>

				<div className=" flex justify-center  px-[50px] pt-44">
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
