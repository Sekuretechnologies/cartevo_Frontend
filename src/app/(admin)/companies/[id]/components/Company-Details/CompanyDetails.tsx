"use client";

import DocumentViewer from "@/components/shared/DocumentViewer";
import KybcInfo from "@/components/shared/KybcInfo";
import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";

const CompanyDetails = () => {
	const selectedCompany = useSelector(
		(state: RootState) => state.selectedCompany.company
	);
	return (
		<div className="px-5 py-8 relative">
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

			<div className="mt-8">
				<h3 className="text-lg font-semibold mb-4 text-app-secondary">
					KYB and Account Status
				</h3>

				<div className=" mt-0 md:mt-6  grid grid-cols-1 md:grid-cols-2 gap-4">
					<KybcInfo
						label="KYC Status"
						value={selectedCompany.kyb_status}
					/>

					{/* <KybcInfo label="Status" value={selectedCompany.isActive} /> */}
				</div>
			</div>
		</div>
	);
};

export default CompanyDetails;
