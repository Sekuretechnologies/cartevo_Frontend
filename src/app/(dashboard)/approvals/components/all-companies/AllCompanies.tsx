import { AdminService } from "@/api/services/cartevo-api/admin";
import BadgeLabel from "@/components/shared/BadgeLabel";
import CustomTable from "@/components/shared/CustomTable";
import { selectCurrentToken } from "@/redux/slices/auth";
import { setSelectedCompany } from "@/redux/slices/selectedCompany";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import StatusBadge from "../StatusBadge";

const getCompanies = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;
	const response = await AdminService.get_Companies({ token });
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "failed to get companies");
	}

	return data;
};
const AllCompanies = () => {
	const currentToken: any = useSelector(selectCurrentToken);

	const queryClient = useQueryClient();

	const dispatch = useDispatch();
	const router = useRouter();

	const handleViewDetails = (company: any) => {
		dispatch(setSelectedCompany(company));
		router.push("/approvals/company-details");
	};

	const companiesQuery = useQuery({
		queryKey: ["companies", currentToken],
		queryFn: getCompanies,
		onError: (err: any) => {
			toast.error("Failed to get companies");
		},
	});

	const allCompaniesHeaderData = {
		serial: "#",
		companyName: "Company name",
		owner: "Owner",
		companyEmail: "Company email",
		kybStatus: "KYB status",
		kycStatus: "KYC status",
		action: "Action",
	};

	const allCompaniesTableData = companiesQuery.data?.data?.map(
		(company: any, index: number) => ({
			serial: index + 1,
			companyName: company.name,
			owner: `${company.owner.first_name} ${company.owner.last_name}`,
			companyEmail: company.email,
			kybStatus: <StatusBadge status={company.kyb_status} />,
			kycStatus: <StatusBadge status={company.owner.kyc_status} />,
			action: (
				<button
					className="border-1 border-primary hover:bg-primary/10 px-4 py-2 rounded-full"
					onClick={() => handleViewDetails(company)}
				>
					View Details
				</button>
			),
		})
	);

	const allCompaniesData = {};
	return (
		<div className="p-4">
			<h2 className="text-xl font-semibold text-gray-800">
				All Companies
			</h2>
			<p className="text-gray-600 text-sm mt-1 mb-4">
				View all registered companies, check their status, and manage
				approvals.
			</p>

			<CustomTable
				headerData={allCompaniesHeaderData}
				tableData={allCompaniesTableData}
				isLoading={companiesQuery.isLoading}
			/>
		</div>
	);
};

export default AllCompanies;
