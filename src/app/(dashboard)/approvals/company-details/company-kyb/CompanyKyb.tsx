import { AdminService } from "@/api/services/cartevo-api/admin";
import CButton from "@/components/shared/CButton";
import DocumentViewer from "@/components/shared/DocumentViewer";
import KybcInfo from "@/components/shared/KybcInfo";
import { selectCurrentToken } from "@/redux/slices/auth";
import { RootState } from "@/redux/store";
import { RejectKYBSchema } from "@/validation/FormValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

type HandleKybParams = {
	companyId: string;
	value: "APPROVED" | "REJECTED";
	message?: string;
};

const handleKyb = async (token: string, data: HandleKybParams) => {
	const response = await AdminService.handle_kyb({
		token: token,
		...data,
	});

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message);
	}

	return responseJson;
};

const CompanyKyb = () => {
	const selectedCompany = useSelector(
		(state: RootState) => state.selectedCompany.company
	);

	const [rejectionModal, setRejectionModal] = useState<boolean>(false);

	const router = useRouter();

	const rejectForm = useForm<z.infer<typeof RejectKYBSchema>>({
		resolver: zodResolver(RejectKYBSchema),
		defaultValues: {
			companyId: selectedCompany.id,
			value: "REJECTED",
			message: "",
		},
	});

	const currentToken: any = useSelector(selectCurrentToken);

	const mutation = useMutation({
		mutationFn: (data: HandleKybParams) => handleKyb(currentToken, data),
		onSuccess: (_data, variables) => {
			toast.success(`KYB ${variables.value} successfully`);
			router.push("/approvals");
		},
		onError: (error: any) => {
			toast.error("Error Updating KYB");
		},
	});

	const approveKYb = () => {
		mutation.mutate({
			companyId: selectedCompany.id,
			value: "APPROVED",
		});
	};

	const rejectMutation = useMutation({
		mutationFn: (data: z.infer<typeof RejectKYBSchema>) =>
			handleKyb(currentToken, data),
		onError: (err: any) => {
			toast.error(err.message);
		},
		onSuccess: () => {
			toast.success("KYB rejected successfully");
			setRejectionModal(false);
			router.push("/approvals");
		},
	});

	const onSubmit = (data: any) => {
		rejectMutation.mutate(data);
	};

	const onError = (err: any) => {
		console.error("error", err);
	};

	useEffect(() => {
		console.log("company", selectedCompany);
	}, []);

	let dynamicStyle = "";

	switch (selectedCompany.kyb_status?.toUpperCase()) {
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

	return (
		<div className="px-5 py-8 relative">
			{/**Status */}
			<div
				className={`flex justify-end absolute font-semibold text-[15px] right-5 px-4 py-2
					rounded-full -top-12 ${dynamicStyle}`}
			>
				<p>{selectedCompany.kyb_status}</p>
			</div>

			{/**General informaions */}
			<div>
				<h3 className="text-lg font-semibold  text-app-secondary">
					General Information
				</h3>
				<div className=" mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
					<KybcInfo
						label="Comapny Name"
						value={selectedCompany.name}
					/>

					<KybcInfo label="Country" value={selectedCompany.country} />

					<KybcInfo
						label="Company E-mail"
						value={selectedCompany.email}
					/>

					{/* <KybcInfo
						label="Kyb Status"
						value={selectedCompany.kyb_status}
					/> */}
				</div>
			</div>

			{/** Entreprise */}

			<div className="mt-8">
				<h3 className="text-lg font-semibold  text-app-secondary">
					Company
				</h3>
				<div className=" mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
					<KybcInfo
						label="Business Name"
						value={selectedCompany.business_name}
					/>

					<KybcInfo
						label="Business Type"
						value={selectedCompany.business_type}
					/>

					<KybcInfo
						label="Business Description"
						value={selectedCompany.business_description}
					/>

					<KybcInfo
						label="Source of Founds"
						value={selectedCompany.source_of_funds}
					/>
				</div>
			</div>

			{/**Contact */}

			<div className="mt-8">
				<h3 className="text-lg font-semibold  text-app-secondary">
					Contact
				</h3>
				<div className=" mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
					<KybcInfo
						label="Business Phone Number"
						value={selectedCompany.business_phone_number}
					/>

					<KybcInfo
						label="Business Adress"
						value={selectedCompany.business_address}
					/>

					<KybcInfo
						label="Business Website Url"
						value={selectedCompany.business_website}
					/>
				</div>
			</div>

			{/** Legal document */}

			<div className="mt-8">
				<h3 className="text-lg font-semibold  text-app-secondary">
					Legal Documents
				</h3>
				<div className=" mt-8 gap-4">
					<KybcInfo
						label="Tax_id Number"
						value={selectedCompany.tax_id_number}
					/>

					<div className="flex flex-wrap -1 gap-4 mt-4">
						<DocumentViewer
							label="Share Holding Document"
							url={selectedCompany.share_holding_document}
						/>

						<DocumentViewer
							label="Incorporation Certificate"
							url={selectedCompany.incorporation_certificate}
						/>

						<DocumentViewer
							label="Business Proof of Address"
							url={selectedCompany.business_proof_of_address}
						/>
					</div>
				</div>
			</div>

			{/** Country / Currency */}

			<div className="mt-8">
				<h3 className="text-lg font-semibold  text-app-secondary">
					Country / Currency
				</h3>
				<div className=" mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
					<KybcInfo
						label="Country Iso Code"
						value={selectedCompany.country_iso_code}
					/>

					<KybcInfo
						label="Country Phone Code"
						value={selectedCompany.country_phone_code}
					/>

					<KybcInfo
						label="Country Currency"
						value={selectedCompany.country_currency}
					/>
				</div>
			</div>

			<div className="mt-10 flex gap-4">
				{selectedCompany.kyb_status !== "APPROVED" && (
					<CButton
						text="Approve Kyb"
						btnStyle="blue"
						width="200px"
						height="40px"
						onClick={approveKYb}
					/>
				)}

				{selectedCompany.kyb_status !== "REJECTED" && (
					<CButton
						text="Reject Kyb"
						btnStyle="red"
						width="200px"
						height="40px"
						onClick={() => {
							setRejectionModal(true);
						}}
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
											Reject KYB
										</h3>
										<p className="mb-8">
											Please provide a reason for
											rejecting this KYB request. This
											reason will be sent to the company.
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

export default CompanyKyb;
