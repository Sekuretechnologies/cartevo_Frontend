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

const getTransactionsByCompany = async ({
	companyId,
	token,
}: {
	companyId: string;
	token: string;
}) => {
	const response = await AdminService.getTransactionsByCompany({
		token,
		companyId,
	});

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to fetch transactions");
	}

	return responseJson;
};

const Transactions = () => {
	const currentToken: any = useSelector(selectCurrentToken);

	const selectedCompany = useSelector(
		(state: RootState) => state.selectedCompany.company
	);

	const transactionsQuery = useQuery({
		queryKey: ["users", selectedCompany.id, currentToken],
		queryFn: () =>
			getTransactionsByCompany({
				companyId: selectedCompany.id as string,
				token: currentToken as string,
			}),

		onError: (err: any) => {
			toast.error("Failed to get transactions");
		},
	});

	// Headers pour le tableau des transactions
	const transactionsHeaderData = {
		serial: "#",
		reference: "Reference",
		type: "Type",
		amount: "Amount",
		fee_amount: "Fee",
		net_amount: "Net Amount",
		status: "Status",
		currency: "Currency",
		provider: "Provider",
		operator: "Operator",
		phone_number: "Phone Number",
		created_at: "Created At",
		action: "Action",
	};

	// Table data
	const transactionsTableData =
		transactionsQuery.data?.transactions?.transactions?.map(
			(txn: any, index: number) => ({
				serial: index + 1,
				reference: txn.reference ?? "-",
				type: txn.type ?? "-",
				amount: txn.amount ?? "-",
				fee_amount: txn.fee_amount ?? "-",
				net_amount: txn.net_amount ?? "-",
				status: txn.status ?? "-",
				currency: txn.currency ?? "-",
				provider: txn.provider ?? "-",
				operator: txn.operator ?? "-",
				phone_number: txn.phone_number ?? "-",
				created_at: txn.created_at
					? new Date(txn.created_at).toLocaleString()
					: "-",
			})
		);

	return (
		<div className="my-[50px] bg-white shadow-md rounded-xl p-5">
			<Title title={"Users List"} />

			<CustomTable
				headerData={transactionsHeaderData}
				tableData={transactionsTableData}
				isLoading={transactionsQuery.isLoading}
			/>
		</div>
	);
};

export default Transactions;
