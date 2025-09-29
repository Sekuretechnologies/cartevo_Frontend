"use client";

import { AdminService } from "@/api/services/cartevo-api/admin";
import CButton from "@/components/shared/CButton";
import DocumentViewer from "@/components/shared/DocumentViewer";
import KybcInfo from "@/components/shared/KybcInfo";
import Layout from "@/components/shared/Layout";
import Modal from "@/components/shared/Modal/Modal";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import UserCompaniesTable from "@/components/shared/UserCompaniesTable";
import { selectCurrentToken } from "@/redux/slices/auth";
import { X } from "lucide-react";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";

const toggleUserStatus = async ({
	userId,
	status,
	token,
}: {
	userId: string;
	status: string;
	token: string;
}) => {
	const response = await AdminService.toggleUserStatus({
		token,
		userId,
		status,
	});

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to toggle user status");
	}

	return responseJson;
};

const Userinfos = () => {
	const selectedUser = useSelector((state: any) => state.user.selectedUser);
	const [desactivatedModal, setDesactivatedModal] = useState<boolean>(false);
	const currentToken = useSelector(selectCurrentToken);

	const toggleUserMutation = useMutation(toggleUserStatus, {
		onSuccess: (data, variables) => {
			toast.success("User desactivated successfully");
		},
		onError: (err: any) => {
			toast.error(err.message || "Failed to desactivated user");
		},
	});

	useEffect(() => {
		console.log("user", selectedUser);
	}, []);

	const toggleModal = () => {
		setDesactivatedModal(!desactivatedModal);
	};

	return (
		<ProtectedRoute allowedClearances={["admin"]}>
			<Layout title="User Informations">
				<section>
					<div className="bg-white shadow-md rounded-xl ">
						<div className="px-5 py-8 relative">
							<div>
								<h3 className="text-lg font-semibold  text-app-secondary">
									Personal Information
								</h3>
								<div className=" mt-0 md:mt-6  grid grid-cols-1 md:grid-cols-2 gap-4">
									<KybcInfo
										label="First Name"
										value={selectedUser.first_name}
									/>

									<KybcInfo
										label="Last Name"
										value={selectedUser.last_name}
									/>

									<KybcInfo
										label="Gender"
										value={selectedUser.gender}
									/>

									<KybcInfo
										label="Nationality"
										value={selectedUser.nationality}
									/>

									<KybcInfo
										label="Phone Number"
										value={selectedUser.phone_number}
									/>

									<KybcInfo
										label="E-mail"
										value={selectedUser.email}
									/>

									<KybcInfo
										label="Adress"
										value={selectedUser.Address}
									/>

									<KybcInfo
										label="Street"
										value={selectedUser.street}
									/>

									<KybcInfo
										label="state"
										value={selectedUser.state}
									/>

									<KybcInfo
										label="Postal Code"
										value={selectedUser.postal_code}
									/>

									<KybcInfo
										label="Country of Residence"
										value={
											selectedUser.country_of_residence
										}
									/>
								</div>
							</div>

							<div className="mt-8">
								<h3 className="text-lg font-semibold  text-app-secondary">
									Identity Documents
								</h3>

								<div className=" mt-0 md:mt-6  grid grid-cols-1 md:grid-cols-2 gap-4">
									<KybcInfo
										label="ID Document Type"
										value={selectedUser.id_document_type}
									/>

									<KybcInfo
										label="ID Number"
										value={selectedUser.id_number}
									/>

									<DocumentViewer
										label="ID Document Front"
										url={selectedUser.id_document_front}
									/>

									<DocumentViewer
										label="ID Document Back"
										url={selectedUser.id_document_back}
									/>

									<DocumentViewer
										label="Proof of Adress"
										url={selectedUser.proof_of_address}
									/>
								</div>

								<div className="mt-8">
									<h3 className="text-lg font-semibold mb-4 text-app-secondary">
										Company Information
									</h3>
									<UserCompaniesTable
										companies={selectedUser.companies}
										userCompanyRoles={
											selectedUser.userCompanyRoles
										}
									/>
								</div>

								<div className="mt-8">
									<h3 className="text-lg font-semibold mb-4 text-app-secondary">
										KYC and Account Status
									</h3>

									<div className=" mt-0 md:mt-6  grid grid-cols-1 md:grid-cols-2 gap-4">
										<KybcInfo
											label="KYC Status"
											value={selectedUser.kyc_status}
										/>

										<KybcInfo
											label="Status"
											value={selectedUser.status}
										/>
									</div>
								</div>

								<div className="mt-8">
									<CButton
										text="Deactivate User"
										btnStyle="blue"
										width="200px"
										height="50px"
										onClick={toggleModal}
									/>
								</div>
							</div>
						</div>
					</div>

					{desactivatedModal && (
						<div className="fixed h-full w-full left-0 top-0 z-[1000]  bg-black/20 backdrop-blur-sm flex justify-center items-center">
							<div className="w-[500px] pt-4 pb-10 px-8 rounded-lg bg-white">
								<div className="flex justify-end">
									<button
										className="text-gray-400 hover:bg-gray-200  duration-300 rounded-md p-2"
										onClick={toggleModal}
									>
										<X />
									</button>
								</div>

								<h3 className="text-lg font-semibold mb-4 text-app-secondary">
									Confirm User Deactivation
								</h3>

								<p className="mb-4">
									Are you sure you want to deactivate this
									user? Once deactivated, they will no longer
									be able to sign in or use the associated
									services. You can reactivate their account
									later if needed.
								</p>

								<div className="flex items-center gap-4 mt-8">
									<CButton
										text="Confirm Desactivation"
										btnStyle="blue"
										onClick={() => {
											toggleUserMutation.mutate({
												userId: selectedUser.id,
												status: "INACTIVE",
												token: currentToken,
											});
											setDesactivatedModal(false);
										}}
									/>

									<CButton
										text=" Cancel"
										btnStyle="red"
										onClick={toggleModal}
									/>
								</div>
							</div>
						</div>
					)}

					{toggleUserMutation.isLoading && (
						<div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/40 backdrop-blur-sm  z-[1000]">
							<PuffLoader
								className="shrink-0"
								size={50}
								color="#1F66FF"
							/>
						</div>
					)}
				</section>
			</Layout>
		</ProtectedRoute>
	);
};

export default Userinfos;
