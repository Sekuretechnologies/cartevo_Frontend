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
					className="font-poppins hidden   bg-primary/10 rounded-br-[50px] h-[850px] pr-28 pl-[150px]  lg:flex flex-col justify-center gap-4 items-center  text-center lg:text-left"
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
				<div className=" flex justify-center items-center px-3 lg:px-[50px]">
					<div className="w-full max-w-[700px] mt-20 ">
						<CreateAccountForm />

						<div className="mt-4 text-app-secondary text-sm text-right text-[13px]">
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
