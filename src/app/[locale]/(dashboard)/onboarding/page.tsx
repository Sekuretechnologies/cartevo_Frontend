"use client";
import { useTitle } from "@/hooks/useTitle";
import { useParams, useRouter } from "next/navigation";

import BadgeLabel from "@/components/shared/BadgeLabel";
import CButton from "@/components/shared/CButton";
import Layout from "@/components/shared/Layout";
import Title from "@/components/shared/Title";

import { CompanyService } from "@/api/services/cartevo-api/company";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";
import { useTranslation } from "@/hooks/useTranslation";
import { selectCurrentToken } from "@/redux/slices/auth";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";
import { FaBuilding, FaCheck, FaClock, FaUser } from "react-icons/fa";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";
import { getGlobalVerificationStatus } from "@/utils/kyb-kyc";

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
		slug: "kyb_completion",
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
	const { t }: { t: any } = useTranslation();
	useTitle(t.onboarding.pageTitle, true);
	const currentToken: any = useSelector(selectCurrentToken);
	const router = useRouter();
	const params = useParams();
	const { createLocalizedLink } = useLocalizedNavigation();
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
			toast.error(t.onboarding.errors.failedToGetSteps);
		},
		refetchInterval: 60000, // Fetches data every 30 seconds
	});

	const { data: verificationStatusRes, isLoading } = useQuery({
		queryKey: ["verificationStatus", currentToken, company?.id],
		queryFn: getVerificationStatus,
		onError: (err: any) => {
			console.log("erreur");
			toast.error(t.onboarding.errors.failedToGetVerification);
		},
		onSuccess: (data) => {
			console.log("verification status data", data);
		},
	});

	const kycStatus = verificationStatusRes?.kycStatus || "NONE";
	const kybStatus = verificationStatusRes?.kybStatus || "NONE";

	if (onboardingStepsQueryRes?.data) {
		onboardingStepsQueryRes?.data?.steps.map((step: any) => {
			const translated =
				step.slug === "profile_completion"
					? t.onboarding.steps.profileCompletion
					: step.slug === "kyb_completion"
					? t.onboarding.steps.businessInfo
					: { name: step.name, description: step.description };
			const oneStep = {
				id: step.id,
				name: translated.name || step.name,
				slug: step.slug,
				status: step.status,
				order: step.order,
				description: translated.description || step.description,
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
						label={t.onboarding.status.completed}
						badgeColor="#1F66FF"
						textColor="#fff"
					/>
				);
			case IN_PROGRESS:
				return (
					<BadgeLabel
						className="text-xs"
						label={t.onboarding.status.inProgress}
						badgeColor="#FFAC1C"
						textColor="#444"
					/>
				);
			case PENDING:
			default:
				return (
					<BadgeLabel
						className="text-xs"
						label={t.onboarding.status.pending}
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

	const canNavigate = (slug: string) => {
		if (slug === "profile_completion") {
			return kycStatus === "NONE" || kycStatus === "REJECTED";
		}
		if (slug === "kyb_completion") {
			return kybStatus === "NONE" || kybStatus === "REJECTED";
		}

		return true;
	};

	const handleStepClick = (slug: string) => {
		if (!canNavigate(slug)) {
			return;
		}
		router.push(createLocalizedLink(`/onboarding/${slug}`));
	};

	const getVerificationMessage = (status: string, type: "KYC" | "KYB") => {
		switch (status) {
			case "PENDING":
				return {
					message:
						type === "KYC"
							? t.onboarding.verification.kyc.pending
							: t.onboarding.verification.kyb.pending,
					className: "text-yellow-600",
				};

			case "APPROVED":
				return {
					message:
						type === "KYC"
							? t.onboarding.verification.kyc.approved
							: t.onboarding.verification.kyb.approved,
					className: "text-green-600 font-semibold",
				};

			case "REJECTED":
				return {
					message: (
						<>
							{type === "KYC"
								? t.onboarding.verification.kyc.rejected
								: t.onboarding.verification.kyb.rejected}{" "}
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
								{t.onboarding.actionLinks.resubmitInfo}
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
							{type === "KYC"
								? t.onboarding.verification.kyc.none
								: t.onboarding.verification.kyb.none}{" "}
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
								{t.onboarding.actionLinks.startVerification}
							</span>
							.
						</>
					),
					className: "text-gray-600",
				};

			default:
				return {
					message:
						type === "KYC"
							? t.onboarding.verification.kyc.unknown
							: t.onboarding.verification.kyb.unknown,
					className: "text-gray-500",
				};
		}
	};

	const isLoadingVerification = verificationStatusRes?.isLoading;

	const getGlobalVerificationMessage = (
		status: "APPROVED" | "REJECTED" | "NONE" | "PENDING"
	) => {
		switch (status) {
			case "APPROVED":
				return (
					<p className="text-green-600 font-semibold mt-3">
						{t.onboarding.verification.global.allApproved}
					</p>
				);
			case "REJECTED":
				return (
					<p className="text-red-600 font-semibold mt-3">
						{t.onboarding.verification.global.oneOrMoreRejected}
					</p>
				);
			case "NONE":
				return (
					<p className="text-gray-600 mt-3">
						{t.onboarding.verification.global.noneSubmitted}
					</p>
				);
			case "PENDING":
			default:
				return (
					<p className="text-yellow-600 mt-3">
						{t.onboarding.verification.global.stillPending}
					</p>
				);
		}
	};

	return (
		<Layout title={"Onboarding"}>
			{onboardingStepsQueryRes?.status === "loading" ? (
				<div className="flex justify-center w-full py-10">
					<div className="w-full h-screen flex justify-center items-center">
						<PuffLoader size={40} color="#1F66FF" />
					</div>
				</div>
			) : (
				<section className="mt-1">
					<div className="mb-8">
						<Title title={t.onboarding.mainTitle} />
						<p className="text-gray-600 mt-2 ">
							{t.onboarding.mainDescription}
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
												{t.onboarding.counters.step}{" "}
												{step.order}
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
													? t.onboarding.buttons
															.review
													: step.status ===
													  IN_PROGRESS
													? t.onboarding.buttons
															.continue
													: t.onboarding.buttons.start
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
							<Title title={t.onboarding.overallProgress} />
							<span className="text-lg font-semibold text-gray-700">
								{
									onboardingSteps.filter(
										(s) => s.status === COMPLETED
									).length
								}{" "}
								/ {onboardingSteps.length}{" "}
								{t.onboarding.counters.completed}
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
							{t.onboarding.progressDescription}
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
