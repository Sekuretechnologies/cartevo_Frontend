"use client";

//---------------------------------------
import { useTitle } from "@/hooks/useTitle";
import Image from "next/image";
import VerifyOTPForm from "./components/form/Form";
import Footer from "@/components/shared/Footer/Footer";
import WebsiteFooter from "@/components/websiteComponents/WebsiteFooter";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";

//---------------------------------------

const VerifyOtpPage = () => {
	useTitle("Cartevo | Verify OTP");
	const { createLocalizedLink } = useLocalizedNavigation();
	
	return (
		<section className="relative flex flex-col h-screen mt-0  w-full">
			<nav className="absolute z-10 top-0 lg:left-[150px]  h-[80px] flex items-center">
				<a href={createLocalizedLink("/")}>
					<img src="/website/logos/logo_full.png" alt="logo" />
				</a>
			</nav>
			<div className="w-full   grid grid-cols-1  lg:grid-cols-2 font-poppins ">
				<div
					style={{
						backgroundImage:
							"url('/website/home/heroBackground.png')",
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
					}}
					className="font-poppins hidden bg-primary/10 rounded-br-[50px] h-[750px] pr-28 pl-[150px]  lg:flex flex-col justify-center gap-4   text-center lg:text-left"
				>
					<h1 className="font-bold text-[35px] leading-10 max-w-[500px] tracking-tight text-app-secondary">
						Verify OTP
					</h1>
					<p className="text-app-secondary max-w-[500px] font-poppins">
						{`Veuillez entrer le code OTP (One-Time Password) que nous
						venons d'envoyer par e-mail`}
					</p>
				</div>
				<div className=" flex justify-center items-center px-[50px]">
					<div className="w-full max-w-[400px] mt-28 lg:mt-0">
						<VerifyOTPForm />
					</div>
				</div>
			</div>
			{/* <Footer /> */}
			<WebsiteFooter />
		</section>
	);
};

export default VerifyOtpPage;
