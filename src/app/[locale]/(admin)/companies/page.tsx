"use client";

import { AdminService } from "@/api/services/cartevo-api/admin";

import CustomTable from "@/components/shared/CustomTable";
import Layout from "@/components/shared/Layout";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import Title from "@/components/shared/Title";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";
import { selectCurrentToken } from "@/redux/slices/auth";
import { setSelectedCompany } from "@/redux/slices/selectedCompany";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import StatusBadge from "../../(dashboard)/approvals/components/StatusBadge";

const getCompanies = async ({ queryKey }: any) => {
	const [_key, token, filterContent] = queryKey;
	const response = await AdminService.get_Companies({
		token,
		filters: filterContent,
	});
	const data = await response.json();
	console.log("reponse de l'api", data);

	if (!response.ok) {
		throw new Error(data.message || "failed to get companies");
	}

	return data;
};

const Companies = () => {
	const currentToken: any = useSelector(selectCurrentToken);
	const router = useRouter();
	const dispatch = useDispatch();
	const [filterContent, setFilterContent] = useState<any>({});
	const [data, setData] = useState<any[]>([]);
	let rearrangedTableData: any[] = [];
	const { createLocalizedLink, navigateTo } = useLocalizedNavigation();

	const companiesQuery = useQuery({
		queryKey: ["companies", currentToken, filterContent],
		queryFn: getCompanies,
		onError: (err: any) => {
			toast.error("Failed to get companies");
		},
	});

	useEffect(() => {
		console.log("filter content sur company", filterContent);
		if (companiesQuery.data) {
			setData(companiesQuery.data);
		}
	}, [companiesQuery.data]);

	// const filteredCompany = data?.filter(
	// 	(company) => !filterContent?.select
	// )

	const allCompaniesHeaderData = {
		serial: "#",
		companyName: "Company name",
		owner: "Owner",
		companyEmail: "Company email",
		business_type: "Business type",
		country: "Country",
		business_phone_number: "Business Phone Number",
		comapny_status: "Company status",
		kycStatus: "KYC status",
		action: "Action",
	};

	const allCompaniesTableData = companiesQuery.data?.data?.map(
		(company: any, index: number) => ({
			serial: index + 1,
			companyName: company.name ?? "-",
			owner: `${company.owner.first_name} ${company.owner.last_name}`,
			companyEmail: company.email ?? "-",
			business_type: company.business_type ?? "-",
			country: company.country ?? "-",
			business_phone_number: company.business_phone_number ?? "-",
			comapny_status: (
				<span
					className={`px-3 py-1 rounded-full text-sm font-semibold ${
						company.is_active
							? "bg-green-100 text-green-800"
							: "bg-red-100 text-red-800"
					}`}
				>
					{company.is_active ? "Active" : "Inactive"}
				</span>
			),
			kycStatus: <StatusBadge status={company.owner.kyc_status} />,
			action: (
				<button
					className="px-2 py-1 bg-primary text-white text-sm rounded hover:bg-blue-600"
					onClick={() => handleViewDetails(company)}
				>
					See more
				</button>
			),
		})
	);

	const toSlug = (name: string) =>
		name
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^\w-]+/g, "");

	const handleViewDetails = (company: { id: string; name: string }) => {
		const slug = toSlug(company.name);
		dispatch(setSelectedCompany(company));
		// router.push(`/companies/${company.id}-${slug}`);
		navigateTo(`/companies/${company.id}-${slug}`);
	};
	return (
		<ProtectedRoute allowedClearances={["admin"]}>
			<Layout title="Companies">
				<section>
					<div className="my-[50px] bg-white shadow-md rounded-xl p-5">
						<Title title={"Companies List"} />

						<CustomTable
							headerData={allCompaniesHeaderData}
							tableData={allCompaniesTableData}
							isLoading={companiesQuery.isLoading}
							filter
							filterType={"company"}
							filterContent={filterContent}
							setFilterContent={setFilterContent}
						/>
					</div>
				</section>
			</Layout>
		</ProtectedRoute>
	);
};

export default Companies;
