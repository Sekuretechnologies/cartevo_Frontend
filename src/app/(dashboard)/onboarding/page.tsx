"use client";
import { useTitle } from "@/hooks/useTitle";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CButton from "@/components/shared/CButton";
import Layout from "@/components/shared/Layout";
import Title from "@/components/shared/Title";
import BadgeLabel from "@/components/shared/BadgeLabel";

import { FaUser, FaBuilding, FaCheck, FaClock } from "react-icons/fa";
import { CompanyService } from "@/api/services/cartevo-api/company";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "@/redux/slices/auth";
import { RootState } from "@/redux/store";

const PENDING = "PENDING";
const COMPLETED = "COMPLETED";
const IN_PROGRESS = "IN_PROGRESS";

let onboardingSteps = [
	{
		name: "Profile Completion",
		slug: "profile_completion",
		order: 1,
		status: PENDING,
		description: "Complete user profile",
		icon: <FaUser size={24} />,
	},
	{
		name: "Business Information",
		slug: "business_info",
		order: 2,
		status: PENDING,
		description: "Complete business details and KYB",
		icon: <FaBuilding size={24} />,
	},
];

const getOnboardingSteps = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;
	let params: any = {};
	const response = await CompanyService.get_onboarding_steps({
		token: token || "",
	});
	const responseJson = await response.json();
	console.log("response", responseJson);
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to get onboarding steps"
		);
	}
	return responseJson.data;
};

const getVerificationStatus = async ({ queryKey }: any) => {
	const [_key, token, companyId] = queryKey;
	const response = await CompanyService.get_verification_status({
		token: token,
		companyId,
	});

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to get verification status"
		);
	}

	return responseJson;
};

export default function OnboardingPage() {
	useTitle("Cartevo | Onboarding", true);
	const currentToken: any = useSelector(selectCurrentToken);
	const router = useRouter();
	// const [steps, setSteps] = useState(onboardingSteps);
	const company = useSelector((state: RootState) => state.auth.company) as {
		id: string;
	} | null;

	//------------------------------------------------
	onboardingSteps = [];
	const onboardingStepsQueryRes: any = useQuery({
		queryKey: ["onboardingSteps", currentToken],
		queryFn: getOnboardingSteps,
		onError: (err) => {
			toast.error("Failed to get onboarding steps.");
		},
		refetchInterval: 60000, // Fetches data every 30 seconds
	});

	const { data: verificationStatusRes, isLoading } = useQuery({
		queryKey: ["verificationStatus", currentToken, company?.id],
		queryFn: getVerificationStatus,
		onError: (err: any) => {
			console.log("erreur");
			toast.error(err.message);
		},
		onSuccess: (data) => {
			console.log(data);
		},
	});

	const kycStatus = verificationStatusRes?.kycStatus || "NONE";
	const kybStatus = verificationStatusRes?.kybStatus || "NONE";

	if (onboardingStepsQueryRes?.data) {
		onboardingStepsQueryRes?.data?.steps.map((step: any) => {
			const oneStep = {
				id: step.id,
				name: step.name,
				slug: step.slug,
				status: step.status,
				order: step.order,
				description: step.description,
				icon:
					step.slug === "profile_completion" ? (
						<FaUser size={24} />
					) : step.slug === "kyb_completion" ? (
						<FaBuilding size={24} />
					) : (
						<></>
					),
			};
			onboardingSteps.push(oneStep);
		});
	}

	//------------------------------------------------

	const getStatusBadge = (status: string) => {
		switch (status) {
			case COMPLETED:
				return (
					<BadgeLabel
						className="text-xs"
						label="Completed"
						badgeColor="#1F66FF"
						textColor="#fff"
					/>
				);
			case IN_PROGRESS:
				return (
					<BadgeLabel
						className="text-xs"
						label="In Progress"
						badgeColor="#FFAC1C"
						textColor="#444"
					/>
				);
			case PENDING:
			default:
				return (
					<BadgeLabel
						className="text-xs"
						label="Pending"
						badgeColor="#F85D4B"
						textColor="#fff"
					/>
				);
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case COMPLETED:
				return <FaCheck className="text-green-500" size={20} />;
			case IN_PROGRESS:
				return <FaClock className="text-yellow-500" size={20} />;
			case PENDING:
			default:
				return <FaClock className="text-gray-400" size={20} />;
		}
	};

	const handleStepClick = (slug: string) => {
		router.push(`/onboarding/${slug}`);
	};

	const getVerificationMessage = (status: string, type: "KYC" | "KYB") => {
		switch (status) {
			case "PENDING":
				return {
					message: `Your ${type} has been submitted and is under review. Please wait 24-72 hours for validation.`,
					className: "text-yellow-600",
				};

			case "APPROVED":
				return {
					message: `Your ${type} is approved.`,
					className: "text-green-600 font-semibold",
				};

			case "REJECTED":
				return {
					message: (
						<>
							Your {type} has been rejected.{" "}
							<span
								className="underline cursor-pointer text-blue-600"
								onClick={() =>
									handleStepClick(
										type === "KYC"
											? "profile_completion"
											: "kyb_completion"
									)
								}
							>
								Click here to resubmit your information
							</span>
							.
						</>
					),
					className: "text-red-600 font-semibold",
				};

			case "NONE":
				return {
					message: (
						<>
							You haven’t submitted your {type} yet.{" "}
							<span
								className="underline cursor-pointer text-blue-600"
								onClick={() =>
									handleStepClick(
										type === "KYC"
											? "profile_completion"
											: "kyb_completion"
									)
								}
							>
								Click here to start
							</span>
							.
						</>
					),
					className: "text-gray-600",
				};

			default:
				return {
					message: `Your ${type} status is unknown.`,
					className: "text-gray-500",
				};
		}
	};

	const isLoadingVerification = verificationStatusRes?.isLoading;

	const getGlobalVerificationStatus = (
		kycStatus: string,
		kybStatus: string
	): "APPROVED" | "REJECTED" | "NONE" | "PENDING" => {
		if (kycStatus === "APPROVED" && kybStatus === "APPROVED")
			return "APPROVED";
		if (kycStatus === "REJECTED" && kybStatus === "REJECTED")
			return "REJECTED";
		if (kycStatus === "NONE" && kybStatus === "NONE") return "NONE";
		if (
			(kycStatus === "REJECTED" && kybStatus === "NONE") ||
			(kycStatus === "NONE" && kybStatus === "REJECTED")
		)
			return "REJECTED";
		return "PENDING";
	};

	const getGlobalVerificationMessage = (
		status: "APPROVED" | "REJECTED" | "NONE" | "PENDING"
	) => {
		switch (status) {
			case "APPROVED":
				return (
					<p className="text-green-600 font-semibold mt-3">
						All your verifications are approved.
					</p>
				);
			case "REJECTED":
				return (
					<p className="text-red-600 font-semibold mt-3">
						One or more of your verifications have been rejected.
					</p>
				);
			case "NONE":
				return (
					<p className="text-gray-600 mt-3">
						You haven’t submitted any verification yet.
					</p>
				);
			case "PENDING":
			default:
				return (
					<p className="text-yellow-600 mt-3">
						Your verifications are still pending.
					</p>
				);
		}
	};

	return (
		<Layout title={"Onboarding"}>
			{onboardingStepsQueryRes?.status === "loading" ? (
				<div className="flex justify-center w-full py-10">
					<div className={"loadingSpinner"}></div>
				</div>
			) : (
				<section className="mt-2">
					<div className="mb-8">
						<Title title={"Complete Your Onboarding"} />
						<p className="text-gray-600 mt-2">
							Follow these steps to complete your account setup
							and start using Cartevo.
						</p>
					</div>

					{/* Onboarding Steps Grid */}
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
						{onboardingSteps.map((step) => (
							<div
								key={step.slug}
								className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
								onClick={() => handleStepClick(step.slug)}
							>
								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center gap-3">
										<div className="p-2 bg-blue-50 rounded-lg text-blue-600">
											{step.icon}
										</div>
										<div>
											<h3 className="font-semibold text-lg text-gray-900">
												{step.name}
											</h3>
											<p className="text-sm text-gray-500">
												Step {step.order}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-2">
										{getStatusIcon(step.status)}
										{getStatusBadge(step.status)}
									</div>
								</div>

								<p className="text-gray-600 mb-2">
									{step.description}
								</p>

								{/* texte basé sur kycStatus / kybStatus */}
								{step.slug === "profile_completion" && (
									<>
										{isLoading ? (
											<div className="loadingSpinner"></div>
										) : (
											<p
												className={`text-sm mb-2 ${
													getVerificationMessage(
														kycStatus,
														"KYC"
													).className
												}`}
											>
												{
													getVerificationMessage(
														kycStatus,
														"KYC"
													).message
												}
											</p>
										)}
									</>
								)}

								{step.slug === "kyb_completion" && (
									<>
										{isLoading ? (
											<div className="loadingSpinner"></div>
										) : (
											<p
												className={`text-sm mb-2 ${
													getVerificationMessage(
														kybStatus,
														"KYB"
													).className
												}`}
											>
												{
													getVerificationMessage(
														kybStatus,
														"KYB"
													).message
												}
											</p>
										)}
									</>
								)}

								<div className="flex justify-between items-center">
									<div className="flex-1 pr-3">
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div
												className={`h-2 rounded-full transition-all duration-300 ${
													step.status === COMPLETED
														? "bg-app-primary w-full"
														: step.status ===
														  IN_PROGRESS
														? "bg-yellow-500 w-1/2"
														: "bg-gray-300 w-0"
												}`}
											></div>
										</div>
									</div>
									{step.status !== COMPLETED && (
										<CButton
											text={
												step.status === COMPLETED
													? "Review"
													: step.status ===
													  IN_PROGRESS
													? "Continue"
													: "Start"
											}
											btnStyle={
												step.status === COMPLETED
													? "outlineDark"
													: "blue"
											}
											onClick={() =>
												handleStepClick(step.slug)
											}
											width="100px"
											height="35px"
										/>
									)}
								</div>
							</div>
						))}
					</div>

					{/* Overall Progress */}
					<div className="mt-8 bg-white shadow-md rounded-xl p-6">
						<div className="flex items-center justify-between mb-4">
							<Title title={"Overall Progress"} />
							<span className="text-lg font-semibold text-gray-700">
								{
									onboardingSteps.filter(
										(s) => s.status === COMPLETED
									).length
								}{" "}
								/ {onboardingSteps.length} Completed
							</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-3">
							<div
								className="bg-blue-500 h-3 rounded-full transition-all duration-500"
								style={{
									width: `${
										(onboardingSteps.filter(
											(s) => s.status === COMPLETED
										).length /
											onboardingSteps.length) *
										100
									}%`,
								}}
							></div>
						</div>
						<p className="text-sm text-gray-600 mt-2">
							Complete all steps to unlock full access to your
							Cartevo dashboard.
						</p>

						{getGlobalVerificationMessage(
							getGlobalVerificationStatus(kycStatus, kybStatus)
						)}
					</div>
				</section>
			)}
		</Layout>
	);
}
