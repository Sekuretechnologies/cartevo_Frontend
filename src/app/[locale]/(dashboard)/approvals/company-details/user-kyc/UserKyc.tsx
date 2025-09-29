import { AdminService } from "@/api/services/cartevo-api/admin";
import CButton from "@/components/shared/CButton";
import DocumentViewer from "@/components/shared/DocumentViewer";
import KybcInfo from "@/components/shared/KybcInfo";
import { selectCurrentToken } from "@/redux/slices/auth";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { RejectKycSchema } from "@/validation/FormValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type HandleKycParams = {
	userId: string;
	value: "APPROVED" | "REJECTED";
	message?: string;
};

const handleKyc = async (token: string, data: HandleKycParams) => {
	const response = await AdminService.handle_kyc({
		token: token,
		userId: data.userId,
		value: data.value,
		message: data.message ?? "",
	});

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message);
	}

	return responseJson;
};

const UserKyc = () => {
	const selectedCompany = useSelector(
		(state: RootState) => state.selectedCompany.company
	);

	const [rejectionModal, setRejectionModal] = useState<boolean>(false);

	const currentToken: any = useSelector(selectCurrentToken);
	const router = useRouter();
	const { createLocalizedLink } = useLocalizedNavigation();

	let dynamicStyle = "";

	switch (selectedCompany.owner.kyc_status?.toUpperCase()) {
		case "APPROVED":
			dynamicStyle = "bg-green-100 text-green-700";
			break;
		case "PENDING":
			dynamicStyle = "bg-yellow-100 text-yellow-700";
			break;
		case "REJECTED":
			dynamicStyle = "bg-red-100 text-red-700";
			break;
		case "NONE":
		default:
			dynamicStyle = "bg-gray-100 text-gray-700";
			break;
	}

	const mutation = useMutation({
		mutationFn: (data: HandleKycParams) => handleKyc(currentToken, data),
		onSuccess: () => {
			toast.success("KYC successfully approved");
			router.push(createLocalizedLink("/approvals"));
		},
		onError: (err: any) => {
			toast.error(err.message);
		},
	});

	const approverKyc = () => {
		mutation.mutate({
			userId: selectedCompany.owner.id,
			value: "APPROVED",
		});
	};

	/**
	 * Formulaire de rejet
	 */
	const rejectForm = useForm<z.infer<typeof RejectKycSchema>>({
		resolver: zodResolver(RejectKycSchema),
		defaultValues: {
			userId: selectedCompany.owner.id,
			value: "REJECTED",
			message: "",
		},
	});

	const rejectMutation = useMutation({
		mutationFn: (data: HandleKycParams) => handleKyc(currentToken, data),
		onSuccess: () => {
			toast.success("KYC rejected successfully");
			setRejectionModal(false);
			router.push(createLocalizedLink("/approvals"));
		},
		onError: (err: any) => {
			toast.error(err.message);
		},
	});

	const onSubmit = (data: any) => {
		rejectMutation.mutate(data);
	};

	const onError = (err: any) => {
		console.error("error", err);
	};

	return (
		<div className="px-5 py-8 relative">
			{/**Status */}
			<div
				className={`flex justify-end absolute font-semibold text-[15px] right-5 px-4 py-2
					rounded-full -top-12 ${dynamicStyle}`}
			>
				<p>{selectedCompany.owner.kyc_status}</p>
			</div>

			<div>
				<h3 className="text-lg font-semibold  text-app-secondary">
					Personal Information
				</h3>
				<div className=" mt-0 md:mt-6  grid grid-cols-1 md:grid-cols-2 gap-4">
					<KybcInfo
						label="Full name"
						value={`${selectedCompany.owner.first_name}  ${selectedCompany.owner.last_name}`}
					/>
					<KybcInfo
						label="E-mail"
						value={selectedCompany.owner.email}
					/>

					<KybcInfo
						label="Phone Number"
						value={selectedCompany.owner.phone_number}
					/>

					<KybcInfo
						label="Nationality"
						value={selectedCompany.owner.nationality}
					/>
				</div>
			</div>

			{/** Adresse */}

			<div className="mt-8">
				<h3 className="text-lg font-semibold  text-app-secondary">
					Address
				</h3>
				<div className=" mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
					<KybcInfo
						label="Country of Residence"
						value={selectedCompany.owner.country_of_residence}
					/>

					<KybcInfo
						label="State"
						value={selectedCompany.owner.state}
					/>

					<KybcInfo label="City" value={selectedCompany.owner.City} />

					<KybcInfo
						label="Street"
						value={selectedCompany.owner.street}
					/>

					<KybcInfo
						label="Postal Code"
						value={selectedCompany.owner.postal_code}
					/>

					<DocumentViewer
						label="Share Holding Document"
						url={selectedCompany.owner.proof_of_address}
					/>
				</div>
			</div>

			{/**Identity Document */}

			<div className="mt-8">
				<h3 className="text-lg font-semibold  text-app-secondary">
					Identity Document
				</h3>
				<div className=" mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
					<KybcInfo
						label="ID Document Type"
						value={selectedCompany.owner.id_document_type}
					/>

					<KybcInfo
						label="ID Number"
						value={selectedCompany.owner.id_number}
					/>

					<DocumentViewer
						label="ID Document Front"
						url={selectedCompany.owner.id_document_front}
					/>

					<DocumentViewer
						label="ID Document Back"
						url={selectedCompany.owner.id_document_back}
					/>
				</div>
			</div>

			<div className="mt-10 flex gap-4">
				{selectedCompany.owner.kyc_status !== "APPROVED" && (
					<CButton
						text="Approve Kyc"
						btnStyle="blue"
						width="200px"
						height="40px"
						onClick={approverKyc}
					/>
				)}

				{selectedCompany.owner.kyc_status !== "REJECTED" && (
					<CButton
						text="Reject Kyc"
						btnStyle="red"
						width="200px"
						height="40px"
						onClick={() => setRejectionModal(true)}
					/>
				)}
			</div>

			{rejectionModal && (
				<div className="fixed z-[1000] bg-primary/10 backdrop-blur-sm h-screen w-screen flex justify-center items-center top-0 left-0">
					<div className="bg-white p-8 rounded-xl">
						<Form {...rejectForm}>
							<form
								onSubmit={rejectForm.handleSubmit(
									onSubmit,
									onError
								)}
							>
								<div>
									<div>
										<h3 className="text-lg font-semibold  text-app-secondary">
											Reject KYC
										</h3>
										<p className="mb-8">
											Please provide a reason for
											rejecting this KYC request. This
											reason will be sent to the user.
										</p>
									</div>
									<FormField
										control={rejectForm.control}
										name="message"
										render={({ field }) => (
											<FormItem className="flex flex-col">
												<FormLabel className="text-[#101010] font-poppins text-[12px] ">
													Laissez un message
												</FormLabel>
												<FormControl>
													<textarea
														{...field}
														id="subject"
														rows={7}
														placeholder="votre message ici "
														className="px-6 font-poppins border-1 focus:outline-primary text-[14px] py-3 rounded-[7px] "
													/>
												</FormControl>
												<FormMessage className="text-red-400 font-poppins" />
											</FormItem>
										)}
									/>

									<div className="mt-6 flex items-center gap-4">
										<CButton
											text="Reject KYB"
											btnStyle="blue"
											type="submit"
											width="150px"
										/>
										<CButton
											text="Cancel"
											btnStyle="red"
											width="150px"
											onClick={() =>
												setRejectionModal(false)
											}
										/>
									</div>
								</div>
							</form>
						</Form>
					</div>
				</div>
			)}

			{mutation.isLoading && (
				<div className="fixed z-[1000] bg-primary/10 backdrop-blur-sm h-screen w-screen flex justify-center items-center top-0 left-0">
					<PuffLoader
						className="shrink-0"
						size={50}
						color="#1F66FF"
					/>
				</div>
			)}

			{rejectMutation.isLoading && (
				<div className="fixed z-[1000] bg-primary/10 backdrop-blur-sm h-screen w-screen flex justify-center items-center top-0 left-0">
					<PuffLoader
						className="shrink-0"
						size={50}
						color="#1F66FF"
					/>
				</div>
			)}
		</div>
	);
};

export default UserKyc;
