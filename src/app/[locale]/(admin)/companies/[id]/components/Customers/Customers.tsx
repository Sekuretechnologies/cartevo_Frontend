"use client";

import { AdminService } from "@/api/services/cartevo-api/admin";
import CustomTable from "@/components/shared/CustomTable";
import Title from "@/components/shared/Title";
import { selectCurrentToken } from "@/redux/slices/auth";
import { RootState } from "@/redux/store";
import React from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";

const getCostumersByCompany = async ({
	companyId,
	token,
}: {
	companyId: string;
	token: string;
}) => {
	const response = await AdminService.getCustomersByCompany({
		token,
		companyId,
	});

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to fetch customers");
	}

	return responseJson;
};

const Customers = () => {
	const currentToken: any = useSelector(selectCurrentToken);

	const selectedCompany = useSelector(
		(state: RootState) => state.selectedCompany.company
	);

	const customersQuery = useQuery({
		queryKey: ["users", selectedCompany.id, currentToken],
		queryFn: () =>
			getCostumersByCompany({
				companyId: selectedCompany.id as string,
				token: currentToken as string,
			}),

		onError: (err: any) => {
			toast.error("Failed to get users");
		},
	});

	// Headers pour la table
	const customersHeaderData = {
		serial: "#",
		name: "Name",
		email: "Email",
		phone_number: "Phone Number",
		country: "Country",
		business_name: "Business Name",
		business_type: "Business Type",
	};

	// Table data
	const customersTableData =
		customersQuery.data?.users?.customers?.map(
			(customer: any, index: number) => ({
				serial: index + 1,
				name: customer.name ?? "-",
				email: customer.email ?? "-",
				phone_number: customer.business_phone_number ?? "-",
				country: customer.country ?? "-",
				business_name: customer.business_name ?? "-",
				business_type: customer.business_type ?? "-",
			})
		) ?? [];

	console.log("data reçue", customersQuery.data);
	console.log("tableData", customersTableData);

	return (
		<div className="my-[50px] bg-white shadow-md rounded-xl p-5">
			<Title title={"Customers List"} />

			<CustomTable
				headerData={customersHeaderData}
				tableData={customersTableData}
				isLoading={
					customersQuery.isLoading || customersQuery.isFetching
				}
			/>
		</div>
	);
};

export default Customers;
