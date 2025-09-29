"use client";

import { AdminService } from "@/api/services/cartevo-api/admin";
import CustomTable from "@/components/shared/CustomTable";
import { selectCurrentToken } from "@/redux/slices/auth";
import { setSelectedCompany } from "@/redux/slices/selectedCompany";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import StatusBadge from "../StatusBadge";

import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";

const getPendingCompanies = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;
	const response = await AdminService.get_Companies({
		token,
		status: "pending",
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "Failed to get pending companies");
	}

	return data;
};

const PendingCompanies = () => {
	const currentToken: any = useSelector(selectCurrentToken);

	const dispatch = useDispatch();
	const router = useRouter();
	const { createLocalizedLink } = useLocalizedNavigation();

	const handleViewDetails = (company: any) => {
		dispatch(setSelectedCompany(company));
		console.log("company auvegarder avec success", company);
		router.push(createLocalizedLink("/approvals/company-details"));
	};

	const pendingCompaniesQuery = useQuery({
		queryKey: ["pendingCompanies", currentToken],
		queryFn: getPendingCompanies,
		onError: (err: any) => {
			toast.error(err.message);
		},
	});

	const pendingCompaniesHeaderData = {
		serial: "#",
		companyName: "Company name",
		owner: "Owner",
		companyEmail: "Company email",
		kybStatus: "KYB status",
		kycStatus: "KYC status",
		action: "Action",
	};

	const pendingCompaniesTableData = pendingCompaniesQuery.data?.data?.map(
		(company: any, index: number) => ({
			serial: index + 1,
			companyName: company.name,
			owner: `${company.owner.first_name} ${company.owner.last_name}`,
			companyEmail: company.email,
			kybStatus: <StatusBadge status={company.kyb_status} />,
			kycStatus: <StatusBadge status={company.owner.kyc_status} />,
			action: (
				<button
					className="border-1 text-[13px] border-primary hover:bg-primary/10 px-4 py-2 rounded-full"
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
				Pending Companies
			</h2>
			<p className="text-gray-600 text-sm mt-1 mb-4">
				Review companies awaiting approval, verify their details, and
				take action to approve or reject them.
			</p>

			<CustomTable
				headerData={pendingCompaniesHeaderData}
				tableData={pendingCompaniesTableData}
				isLoading={pendingCompaniesQuery.isLoading}
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

export default PendingCompanies;
