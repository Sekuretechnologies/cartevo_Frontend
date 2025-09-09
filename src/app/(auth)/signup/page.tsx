"use client";
import { useTitle } from "@/hooks/useTitle";
import { selectCurrentStep, setCurrentStep } from "@/redux/slices/signup";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../../components/shared/Footer/Footer";
// import PersonalInfoForm from "./components/form/PersonalInfoForm";
import ProgressBar from "./components/ProgressBar";
// import CompanyInfoForm from "./components/form/CompanyInfoForm";

import dynamic from "next/dynamic";
import { cartevoIconName } from "@/constants/icons";
import WebsiteHeader from "@/components/websiteComponents/WebsiteHeader";
import WebsiteFooter from "@/components/websiteComponents/WebsiteFooter";
const CreateAccountForm = dynamic(
	() => import("./components/form/CreateAccountForm"),
	{
		ssr: false,
	}
);
export default function SignupPage() {
	useTitle("Cartevo | Signup");
	const dispatch = useDispatch();

	const searchParams = useSearchParams();
	const paramStep =
		searchParams && String(searchParams).startsWith("step=2")
			? dispatch(setCurrentStep(2))
			: dispatch(setCurrentStep(1));

	const currentStep = useSelector(selectCurrentStep) || 1;

	const handleNext = () => {
		dispatch(setCurrentStep(currentStep + 1));
	};

	const handlePrevious = () => {
		dispatch(setCurrentStep(currentStep - 1));
	};

	const handleComplete = () => {
		// Handle completion logic here
	};

	return (
		<section className="relative flex flex-col mt-0 w-full">
			<nav className="absolute z-10 top-0 left-[140px] w-full h-[80px] px-[50px] flex items-center">
				<div className="max-w-[1250px]">
					{/* <img
						src="/images/cartevo-logo.svg"
						alt="cartevo-logo"
						className=""
					/> */}
					{cartevoIconName}
				</div>
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
					<div className="w-full max-w-[700px] h-[700px] my-10">
						<CreateAccountForm />

						<div className="mt-8 text-app-secondary text-sm">
							Already have an account?{" "}
							<a
								href="/login"
								className="text-app-primary underline hover:text-app-secondary"
							>
								Sign in here
							</a>
						</div>

						{/* {currentStep === 1 && (
							<>
								<PersonalInfoForm goNextPage={handleNext} />
								<div className="mt-8 text-app-secondary text-sm">
									Already have an account?{" "}
									<a
										href="/login"
										className="text-app-primary underline hover:text-app-secondary"
									>
										Sign in here
									</a>
								</div>
							</>
						)}
						{currentStep === 2 && <CompanyInfoForm />} */}
					</div>
				</div>
			</div>
			<WebsiteFooter />
		</section>
	);
}
