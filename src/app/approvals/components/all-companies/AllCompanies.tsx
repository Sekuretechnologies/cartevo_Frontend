import { AdminService } from "@/api/services/cartevo-api/admin";
import CustomTable from "@/components/shared/CustomTable";
import { selectCurrentToken } from "@/redux/slices/auth";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";

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
			kybStatus: company.kyb_status,
			kycStatus: company.owner.kyc_status,
			action: (
				<button className="border-1 border-primary hover:bg-primary/10 px-4 py-2 rounded-full">
					View Details
				</button>
			),
		})
	);

	const allCompaniesData = {};
	return (
		<div className="p-4">
			<h2 className="text-xl font-semibold text-gray-800">
				Team Members
			</h2>
			<p className="text-gray-600 text-sm mt-1 mb-4">
				Manage your team members, assign roles, and control access
				permissions.
			</p>

			<CustomTable
				headerData={allCompaniesHeaderData}
				tableData={allCompaniesTableData}
				// isLoading={teamMembersQuery.isLoading}
				// btn={
				// 	<CButton
				// 		text="Add New Team Member"
				// 		btnStyle="blue"
				// 		icon={<HiPlus />}
				// 		height="33px"
				// 		onClick={() => {
				// 			setAddTeamMemberModal(true);
				// 		}}
				// 	/>
				// }
			/>
		</div>
	);
};

export default AllCompanies;
