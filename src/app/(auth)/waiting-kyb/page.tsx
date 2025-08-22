"use client";

//---------------------------------------
import { useTitle } from "@/hooks/useTitle";
import Image from "next/image";
import VerifyOTPForm from "./components/form/Form";
import NewsLetterForm from "./components/form/NewsLetterForm";
import Footer from "./components/Footer";
//---------------------------------------

const WaitingKybPage = () => {
	useTitle("Cartevo | Waiting");
	return (
		<section className="relative flex flex-col h-screen mt-0  w-full">
			<nav className="fixed z-10 top-0 left-0 w-full h-[80px] px-[150px] flex items-center">
				<div className="max-w-[1250px] ">
					<img
						src="/images/cartevo-logo.svg"
						alt="cartevo-logo"
						className=""
					/>
				</div>
			</nav>
			<div className="w-full h-[90vh] grid grid-cols-12">
				<div className="relative col-span-12 pl-[150px] pt-[200px] bg-app-lightblue overflow-hidden">
					<h1 className="font-bold text-5xl text-app-secondary mb-4">
						Verifying Your Company Informations
					</h1>
					<span className="text-lg text-app-secondary mb-8">
						Your documents are under verification. Please wait for
						completion. Once done, you will have access to your
						dashboard.
					</span>
					<div className="absolute bottom-[100px] left-0 w-full h-[100px]">
						<img
							src="/images/white-cartevo-logo-001.svg"
							alt="white-cartevo-logo"
							className=""
						/>
					</div>
				</div>
			</div>
			<Footer />
		</section>
	);
};

export default WaitingKybPage;
