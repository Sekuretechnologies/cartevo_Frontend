"use client";

import { AdminService } from "@/api/services/cartevo-api/admin";
import CustomTable from "@/components/shared/CustomTable";
import Title from "@/components/shared/Title";
import { selectCurrentToken } from "@/redux/slices/auth";
import { RootState } from "@/redux/store";
import { user } from "@nextui-org/theme";
import { useParams } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";

const getUsersByCompany = async ({
	companyId,
	token,
}: {
	companyId: string;
	token: string;
}) => {
	const response = await AdminService.getUsersByCompany({
		token,
		companyId,
	});

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to fetch users");
	}

	return responseJson;
};

const Users = () => {
	const currentToken: any = useSelector(selectCurrentToken);
	const { companySlug } = useParams();
	const slugString = Array.isArray(companySlug)
		? companySlug[0]
		: companySlug;
	const companyId = slugString?.match(/^[0-9a-fA-F-]+/)?.[0];
	const selectedCompany = useSelector(
		(state: RootState) => state.selectedCompany.company
	);

	const usersQuery = useQuery({
		queryKey: ["users", selectedCompany.id, currentToken],
		queryFn: () =>
			getUsersByCompany({
				companyId: selectedCompany.id as string,
				token: currentToken as string,
			}),

		onError: (err: any) => {
			toast.error("Failed to get users");
		},
	});

	const usersHeaderData = {
		serial: "#",
		name: "Name",
		email: "Email",
		role: "Role",
		country: "Country",
		city: "City",
		nationality: "Nationality",
		phone_number: "Phone Number",
	};

	const usersTableData = usersQuery.data?.users?.map(
		(user: any, index: number) => ({
			serial: index + 1,
			name:
				`${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() ||
				"-",
			email: user.email ?? "-",
			role: user.role?.name ?? "-",
			country: user.country_of_residence ?? "-",
			city: user.city ?? "-",
			nationality: user.nationality ?? "-",
			phone_number: user.phone_number ?? "-",
		})
	);

	return (
		<div className="my-[50px] bg-white shadow-md rounded-xl p-5">
			<Title title={"Users List"} />

			<CustomTable
				headerData={usersHeaderData}
				tableData={usersTableData}
				isLoading={usersQuery.isLoading}
			/>
		</div>
	);
};

export default Users;
