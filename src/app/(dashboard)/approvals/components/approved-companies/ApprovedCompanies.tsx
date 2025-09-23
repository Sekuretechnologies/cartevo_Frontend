import { AdminService } from "@/api/services/cartevo-api/admin";
import BadgeLabel from "@/components/shared/BadgeLabel";
import CustomTable from "@/components/shared/CustomTable";
import { selectCurrentToken } from "@/redux/slices/auth";
import { setSelectedCompany } from "@/redux/slices/selectedCompany";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import StatusBadge from "../StatusBadge";

const getApprovedCompanies = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;
	const response = await AdminService.get_Companies({
		token,
		status: "approved",
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "Failed to get approved companies");
	}

	return data;
};
const ApprovedCompanies = () => {
	const currentToken: any = useSelector(selectCurrentToken);
	const dispatch = useDispatch();
	const router = useRouter();

	const approvedCompaniesQuery = useQuery({
		queryKey: ["pendingCompanies", currentToken],
		queryFn: getApprovedCompanies,
		onError: (err: any) => {
			toast.error(err.message);
		},
	});

	const handleViewDetails = (company: any) => {
		dispatch(setSelectedCompany(company));
		console.log("company auvegarder avec success", company);
		router.push("/approvals/company-details");
	};

	const approvedCompaniesHeaderData = {
		serial: "#",
		companyName: "Company name",
		owner: "Owner",
		companyEmail: "Company email",
		kybStatus: "KYB status",
		kycStatus: "KYC status",
		action: "Action",
	};

	const approvedCompaniesTableData = approvedCompaniesQuery.data?.data?.map(
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

	return (
		<div className="p-4">
			<h2 className="text-xl font-semibold text-gray-800">
				Approved Companies
			</h2>
			<p className="text-gray-600 text-sm mt-1 mb-4">
				View companies that have successfully passed the verification
				process. Review their approved details or manage further actions
				if needed.
			</p>

			<CustomTable
				headerData={approvedCompaniesHeaderData}
				tableData={approvedCompaniesTableData}
				isLoading={approvedCompaniesQuery.isLoading}
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

export default ApprovedCompanies;
