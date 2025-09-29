"use client";
import { useTitle } from "@/hooks/useTitle";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";
import { useTranslation } from "@/hooks/useTranslation";

import Layout from "@/components/shared/Layout";
import Title from "@/components/shared/Title";
import CButton from "@/components/shared/CButton";

// Removed imports for deleted components

import { FaArrowLeft, FaUser, FaBuilding } from "react-icons/fa";
import ProfileCompletionForm from "./form/ProfileCompletionForm";
import KybCompletionForm from "./form/KybCompletionForm";

const onboardingStepsFactory = (t: any) => ({
    profile_completion: {
        name: t.onboarding.steps.profileCompletion.name,
        description: t.onboarding.steps.profileCompletion.description,
        icon: <FaUser size={24} />,
        component: "PersonalInfoForm",
    },
    kyb_completion: {
        name: t.onboarding.steps.businessInfo.name,
        description: t.onboarding.steps.businessInfo.description,
        icon: <FaBuilding size={24} />,
        component: "CompanyInfoForm",
    },
});

export default function OnboardingStepPage() {
    const { t }:{t:any} = useTranslation();
	const params = useParams();
	const router = useRouter();
	const { createLocalizedLink } = useLocalizedNavigation();
	const slug = params.slug as string;

    const onboardingSteps = onboardingStepsFactory(t);
    const currentStep = onboardingSteps[slug as keyof typeof onboardingSteps];

	useTitle(currentStep?.name ? `Cartevo | ${currentStep.name}` : t.onboarding.pageTitle, true);

	const handleGoBack = () => {
		router.push(createLocalizedLink("/onboarding"));
	};

	const handleNextStep = () => {
		// This function will be called from the form components
		// For now, redirect back to onboarding overview
		router.push(createLocalizedLink("/onboarding"));
	};

	if (!currentStep) {
		return (
			<Layout title={"Onboarding"}>
				<div className="flex flex-col items-center justify-center min-h-[400px]">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						Step Not Found
					</h2>
					<p className="text-gray-600 mb-6">
						{`The onboarding step you're looking for doesn't exist.`}
					</p>
					<CButton
						text="Back to Onboarding"
						btnStyle="blue"
						onClick={handleGoBack}
						width="200px"
						height="40px"
					/>
				</div>
			</Layout>
		);
	}

	const renderStepContent = () => {
		switch (slug) {
			case "profile_completion":
				return <ProfileCompletionForm />;
			case "kyb_completion":
				return <KybCompletionForm />;
			default:
				return (
					<div className="text-center py-8">
						<p className="text-gray-600">
							This step is not yet implemented.
						</p>
					</div>
				);
		}
	};

	return (
		<Layout title={currentStep.name}>
			<section className="mt-2">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center gap-4 mb-4">
						<button
							onClick={handleGoBack}
							className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
						>
							<FaArrowLeft size={16} />
					<span>{t.onboarding.mainTitle}</span>
						</button>
					</div>

					<div className="flex items-center gap-4 mb-4">
						<div className="p-3 bg-blue-50 rounded-lg text-blue-600">
							{currentStep.icon}
						</div>
						<div>
							<Title title={currentStep.name} />
							<p className="text-gray-600 mt-1">
								{currentStep.description}
							</p>
						</div>
					</div>
				</div>

				{/* Step Content */}
				<div className="bg-white shadow-md rounded-xl p-6">
					{renderStepContent()}
				</div>
			</section>
		</Layout>
	);
}
