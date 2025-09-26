"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Input } from "@/components/ui/input";
import DocumentViewer from "@/components/shared/DocumentViewer";
import CButton from "@/components/shared/CButton";
import { X, XCircle } from "lucide-react";
import { FaEdit } from "react-icons/fa";
import { CompanyService } from "@/api/services/cartevo-api/company";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { selectCurrentToken } from "@/redux/slices/auth";
import { PuffLoader } from "react-spinners";
import { Select, SelectItem } from "@nextui-org/react";
import { countryCurrencies } from "@/constants/countryCurrenciesData";
import { ItemFlag } from "@/components/shared/ItemFlag";

const handleEditCompany = async ({
	token,
	companyId,
	body,
}: {
	token: string;
	companyId: string;
	body: any;
}) => {
	const response = await CompanyService.update_company_info({
		token: token,
		companyId,
		body,
	});
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to update company");
	}

	return responseJson;
};

const getCompanyById = async ({
	token,
	companyId,
}: {
	token: string;
	companyId: string;
}) => {
	const response = await CompanyService.get_company_by_id({
		token,
		companyId,
	});

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get company");
	}

	return responseJson;
};

const CompanyDetails = () => {
	const selectedCompany = useSelector(
		(state: RootState) => state.selectedCompany.company
	);
	const currentToken: any = useSelector(selectCurrentToken);

	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState(selectedCompany);

	// useEffect(() => {
	// 	setFormData(selectedCompany);
	// }, [selectedCompany]);

	const { data, isLoading, isError } = useQuery({
		queryKey: ["company", selectedCompany.id],
		queryFn: () =>
			getCompanyById({
				token: currentToken,
				companyId: selectedCompany.id,
			}),
		onSuccess: (data: any) => {
			console.log("donnees de la companie", data);
			setFormData(data.company);
		},
		enabled: !!selectedCompany?.id,
		onError: (err: any) => {
			toast.error(err.message || "Failed to get company details");
		},
	});

	const mutation = useMutation({
		mutationFn: handleEditCompany,
		onSuccess: (data: any) => {
			toast.success("Company updated successsfuly");
		},
		onError: (err: any) => {
			toast.error(err.message || "Failed to update company");
		},
	});

	const handleChange = (field: string, value: string) => {
		setFormData((prev: any) => ({
			...prev,
			[field]: value,
		}));
	};

	const getModifiedFields = (original: any, modified: any) => {
		const updated: any = {};

		Object.keys(modified).forEach((key) => {
			// Comparaison simple, tu peux adapter pour les objets ou tableaux
			if (modified[key] !== original[key]) {
				updated[key] = modified[key];
			}
		});

		return updated;
	};

	const handleSave = () => {
		const modifiedFields = getModifiedFields(selectedCompany, formData);

		if (Object.keys(modifiedFields).length === 0) {
			console.log("Aucun changement à sauvegarder");
			setIsEditing(false);
			return;
		}

		// Appel au service ou mutation
		mutation.mutate({
			token: currentToken,
			companyId: selectedCompany.id,
			body: modifiedFields,
		});

		console.log("champs modifiees", modifiedFields);
		setIsEditing(false);
	};

	// Rendu conditionnel de la valeur et des classes
	const inputProps = (val: any) => {
		const displayVal = !isEditing ? val || "Not provided" : val || "";
		const classes = !isEditing && !val ? "text-red-500 italic" : "";
		return { displayVal, classes };
	};

	return (
		<div className="px-5 py-8 relative">
			{/* Boutons */}

			<div>
				{/* General Information */}
				<div>
					<h3 className="text-lg font-semibold text-app-secondary">
						General Information
					</h3>
					<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm mb-1">
								Company Name
							</label>
							<Input
								className={inputProps(formData.name).classes}
								value={inputProps(formData.name).displayVal}
								onChange={(e) =>
									handleChange("name", e.target.value)
								}
								readOnly={!isEditing}
							/>
						</div>
						<div>
							<label className="block text-sm mb-1">
								Country
							</label>
							<Select
								// on affiche le pays actuel
								selectedKeys={
									formData.country ? [formData.country] : []
								}
								// on met à jour formData quand l’utilisateur choisit
								onSelectionChange={(keys) => {
									const value = Array.from(keys)[0] as string;
									handleChange("country", value);
								}}
								placeholder="Sélectionnez le pays"
								isDisabled={!isEditing} // pour garder le même comportement lecture/édition
								className={`bg-app-lightgray text-gray-900 font-normal ${
									inputProps(formData.country).classes
								}`}
								renderValue={(items) =>
									items.map((item) => {
										const key = item.key as string;
										const countryData =
											countryCurrencies[0]?.find(
												(c: any) => c.iso2 === key
											);
										return (
											<div
												className="flex items-center gap-2"
												key={key}
											>
												<ItemFlag
													iso2={
														countryData?.iso2 || key
													}
													size={3}
												/>
												<span>
													{`${countryData?.country} (${countryData?.iso2}) - ${countryData?.currency}`}
												</span>
											</div>
										);
									})
								}
							>
								{countryCurrencies[0]
									?.sort((a: any, b: any) =>
										a.country.localeCompare(b.country)
									)
									.map((country: any) => (
										<SelectItem
											key={country.iso2}
											value={country.iso2}
										>
											<div className="flex items-center gap-2">
												<ItemFlag
													iso2={country.iso2}
													size={3}
												/>
												<span>
													{`${country.country} (${country.iso2}) - ${country.currency}`}
												</span>
											</div>
										</SelectItem>
									))}
							</Select>
						</div>
						<div>
							<label className="block text-sm mb-1">
								Company E-mail
							</label>
							<Input
								className={inputProps(formData.email).classes}
								value={inputProps(formData.email).displayVal}
								onChange={(e) =>
									handleChange("email", e.target.value)
								}
								readOnly={!isEditing}
							/>
						</div>
						<div>
							<label className="block text-sm mb-1">
								Business Phone Number
							</label>
							<Input
								className={
									inputProps(formData.business_phone_number)
										.classes
								}
								value={
									inputProps(formData.business_phone_number)
										.displayVal
								}
								onChange={(e) =>
									handleChange(
										"business_phone_number",
										e.target.value
									)
								}
								readOnly={!isEditing}
							/>
						</div>
					</div>
				</div>

				{/* Company */}
				<div className="mt-8">
					<h3 className="text-lg font-semibold text-app-secondary">
						Company
					</h3>
					<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm mb-1">
								Business Name
							</label>
							<Input
								className={
									inputProps(formData.business_name).classes
								}
								value={
									inputProps(formData.business_name)
										.displayVal
								}
								onChange={(e) =>
									handleChange(
										"business_name",
										e.target.value
									)
								}
								readOnly={!isEditing}
							/>
						</div>
						<div>
							<label className="block text-sm mb-1">
								Business Type
							</label>
							<Input
								className={
									inputProps(formData.business_type).classes
								}
								value={
									inputProps(formData.business_type)
										.displayVal
								}
								onChange={(e) =>
									handleChange(
										"business_type",
										e.target.value
									)
								}
								readOnly={!isEditing}
							/>
						</div>
						<div>
							<label className="block text-sm mb-1">
								Business Address
							</label>
							<Input
								className={
									inputProps(formData.business_address)
										.classes
								}
								value={
									inputProps(formData.business_address)
										.displayVal
								}
								onChange={(e) =>
									handleChange(
										"business_address",
										e.target.value
									)
								}
								readOnly={!isEditing}
							/>
						</div>
						<div>
							<label className="block text-sm mb-1">
								Business Website
							</label>
							<Input
								className={
									inputProps(formData.business_website)
										.classes
								}
								value={
									inputProps(formData.business_website)
										.displayVal
								}
								onChange={(e) =>
									handleChange(
										"business_website",
										e.target.value
									)
								}
								readOnly={!isEditing}
							/>
						</div>
						<div>
							<label className="block text-sm mb-1">
								Business Description
							</label>
							<Input
								className={
									inputProps(formData.business_description)
										.classes
								}
								value={
									inputProps(formData.business_description)
										.displayVal
								}
								onChange={(e) =>
									handleChange(
										"business_description",
										e.target.value
									)
								}
								readOnly={!isEditing}
							/>
						</div>
					</div>
				</div>

				{/* Legal Documents */}
				<div className="mt-8">
					<h3 className="text-lg font-semibold text-app-secondary">
						Legal Documents
					</h3>
					<div className="mt-8 gap-4">
						<div>
							<label className="block text-sm mb-1">
								Tax ID Number
							</label>
							<Input
								className={
									inputProps(formData.tax_id_number).classes
								}
								value={
									inputProps(formData.tax_id_number)
										.displayVal
								}
								onChange={(e) =>
									handleChange(
										"tax_id_number",
										e.target.value
									)
								}
								readOnly={!isEditing}
							/>
						</div>
						<div className="flex flex-wrap gap-4 mt-4">
							<DocumentViewer
								label="Share Holding Document"
								url={formData.share_holding_document}
							/>
							<DocumentViewer
								label="Incorporation Certificate"
								url={formData.incorporation_certificate}
							/>
							<DocumentViewer
								label="Business Proof of Address"
								url={formData.business_proof_of_address}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-start gap-2 my-4">
				{!isEditing ? (
					<div className="flex items-center gap-4">
						<CButton
							onClick={() => setIsEditing(true)}
							text="Edit Company"
							btnStyle="yellow"
							width="175px"
							height="49px"
							icon={<FaEdit />}
							iconSize={24}
						/>
						<CButton
							onClick={() => setIsEditing(true)}
							text="Deactivated Company"
							btnStyle="blue"
							width="230px"
							height="49px"
							icon={<XCircle />}
							iconSize={24}
						/>
					</div>
				) : (
					<div className="flex items-center gap-4">
						<CButton
							onClick={handleSave}
							text="Save Changes"
							btnStyle="green"
							width="175px"
							height="49px"
						/>

						<CButton
							onClick={() => {
								setFormData(selectedCompany);
								setIsEditing(false);
							}}
							text="Cancel"
							btnStyle="red"
							width="150px"
							height="49px"
						/>
					</div>
				)}
			</div>

			{isLoading && (
				<div className="w-full h-full bg-white absolute top-0 left-0 z-[1000] flex items-center justify-center">
					<div className="w-full h-screen bg-white absolute top-0 left-0 z-[1000] flex items-center justify-center">
						<div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
					</div>
				</div>
			)}

			{mutation.isLoading && (
				<div className="fixed top-0 left-0 w-full h-full  bg-black/20 backdrop-blur-sm z-[1000] flex items-center justify-center">
					<PuffLoader size={50} color="#1F66FF" />
				</div>
			)}
		</div>
	);
};

export default CompanyDetails;
