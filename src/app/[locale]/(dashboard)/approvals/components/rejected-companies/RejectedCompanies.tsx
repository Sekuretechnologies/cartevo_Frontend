import { AdminService } from "@/api/services/cartevo-api/admin";
import CustomTable from "@/components/shared/CustomTable";
import { selectCurrentToken } from "@/redux/slices/auth";
import React from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import StatusBadge from "../StatusBadge";
import { useRouter } from "next/navigation";
import { setSelectedCompany } from "@/redux/slices/selectedCompany";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";

const getRejectedCompanies = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;
	const response = await AdminService.get_Companies({
		token,
		status: "rejected",
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "Failed to get rejected companies");
	}

	return data;
};

const RejectedCompanies = () => {
	const currentToken: any = useSelector(selectCurrentToken);

	const router = useRouter();
	const dispatch = useDispatch();
	const { createLocalizedLink } = useLocalizedNavigation();

	const handleViewDetails = (company: any) => {
		dispatch(setSelectedCompany(company));

		router.push(createLocalizedLink("/approvals/company-details"));
	};

	const rejectedCompaniesQuery = useQuery({
		queryKey: ["pendingCompanies", currentToken],
		queryFn: getRejectedCompanies,
		onError: (err: any) => {
			toast.error(err.message);
		},
	});

	const rejectedCompaniesHeaderData = {
		serial: "#",
		companyName: "Company name",
		owner: "Owner",
		companyEmail: "Company email",
		kybStatus: "KYB status",
		kycStatus: "KYC status",
		action: "Action",
	};

	const rejectedCompaniesTableData = rejectedCompaniesQuery.data?.data?.map(
		(company: any, index: number) => ({
			serial: index + 1,
			companyName: company.name,
			owner: `${company.owner.first_name} ${company.owner.last_name}`,
			companyEmail: company.email,
			kybStatus: <StatusBadge status={company.kyb_status} />,
			kycStatus: <StatusBadge status={company.owner.kyc_status} />,
			action: (
				<button
					onClick={() => handleViewDetails(company)}
					className="border-1 border-primary hover:bg-primary/10 px-4 py-2 rounded-full"
				>
					View Details
				</button>
			),
		})
	);

	return (
		<div className="p-4">
			<h2 className="text-xl font-semibold text-gray-800">
				Rejected Companies
			</h2>
			<p className="text-gray-600 text-sm mt-1 mb-4">
				These companies have had their KYC documents rejected.
			</p>

			<CustomTable
				headerData={rejectedCompaniesHeaderData}
				tableData={rejectedCompaniesTableData}
				isLoading={rejectedCompaniesQuery.isLoading}
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

export default RejectedCompanies;
