"use client";
import { useTitle } from "@/hooks/useTitle";
import { selectCurrentStep, setCurrentStep } from "@/redux/slices/signup";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Footer from "./components/Footer";
// import PersonalInfoForm from "./components/form/PersonalInfoForm";
import ProgressBar from "./components/ProgressBar";
// import CompanyInfoForm from "./components/form/CompanyInfoForm";

import dynamic from "next/dynamic";
const PersonalInfoForm = dynamic(
	() => import("./components/form/PersonalInfoForm"),
	{
		ssr: false,
	}
);
const CompanyInfoForm = dynamic(
	() => import("./components/form/CompanyInfoForm"),
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

	const { currentStep, isCompleted } = useSelector(selectCurrentStep);

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
			<nav className="absolute z-10 top-0 left-0 w-full h-[80px] px-[150px] flex items-center">
				<div className="max-w-[1250px]">
					<img
						src="/images/cartevo-logo.svg"
						alt="cartevo-logo"
						className=""
					/>
				</div>
			</nav>
			<div className="w-full grid grid-cols-12">
				<div className="relative col-span-5 pl-[150px] pr-[50px] pt-[200px] bg-app-lightblue rounded-br-[50px] overflow-hidden">
					<h1 className="font-bold text-4xl text-app-secondary">
						Sign up
					</h1>
					<div className="pt-10">
						<ProgressBar step={currentStep} total={2} />
					</div>
					<span className="text-lg text-app-secondary">{`Step ${currentStep}/2`}</span>
					<div className="absolute bottom-[100px] left-0 w-full h-[90px]">
						<img
							src="/images/white-cartevo-logo-001.svg"
							alt="white-cartevo-logo"
							className=""
						/>
					</div>
				</div>
				<div className="col-span-7 flex justify-center items-center px-[50px]">
					<div className="w-full max-w-[700px] my-10">
						{currentStep === 1 && (
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
						{currentStep === 2 && <CompanyInfoForm />}
					</div>
				</div>
			</div>
			<Footer />
		</section>
	);
}
