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
		<section className="relative flex flex-col h-screen mt-0 ">
			<nav className="absolute z-10 top-0 left-[150px]  h-[80px] px-[50px] flex items-center">
				<div className=" ">{cartevoIconName}</div>
			</nav>
			<div className="w-full pl-48 pr-40 h-screen grid grid-cols-2 font-poppins ">
				<div className=" font-poppins h-screen pr-28  flex flex-col gap-4 items-center pt-44 text-center lg:text-left ">
					<div
						style={{
							backgroundImage:
								"url('/website/home/heroBackground.png')",
							backgroundSize: "cover",
							backgroundPosition: "center",
							backgroundRepeat: "no-repeat",
						}}
						className="w-1/2 hidden lg:block h-screen rounded-br-[50px] absolute top-0 left-0 bg-primary/10"
					></div>
					<h1 className="font-bold text-[35px] leading-10 ">
						Faciliter des{" "}
						<span className="text-primary">paiements simples</span>{" "}
						et accessibles depuis l’Afrique
					</h1>
					<div className="flex items-center  text-left gap-4">
						<div className="  w-24 h-24">
							<img src="/website/contact/chevron.png" alt="" />
						</div>
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

				<div className=" flex justify-center items-center px-[50px]">
					<div className="w-full ">
						<LoginForm />

						{/* <div className="mt-6 text-app-secondary text-sm">
							{`Don't have an account?`}{" "}
							<a
								href="/signup"
								className="text-app-primary underline hover:text-app-secondary"
							>
								Sign up here
							</a>
						</div> */}
					</div>
				</div>
			</div>
			<WebsiteFooter />
		</section>
	);
};

export default LoginPage;
