"use client";

import { AdminService } from "@/api/services/cartevo-api/admin";
import BadgeLabel from "@/components/shared/BadgeLabel";
import CustomTable from "@/components/shared/CustomTable";
import Layout from "@/components/shared/Layout";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import Title from "@/components/shared/Title";
import { headerUserData } from "@/constants/UserData";
import { selectCurrentToken } from "@/redux/slices/auth";
import { setSelectedUser } from "@/redux/slices/userSlices";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";

const getUsers = async ({ queryKey }: any) => {
	const [_key, token, companyId, page, perPage] = queryKey;

	if (!token) throw new Error("Token not provided");
	// Appel du service pour récupérer les users
	const response = await AdminService.get_users({
		token: token,
		companyId: companyId || "",
		page: page || 1,
		perPage: perPage || 10,
	});

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get users");
	}

	const users = responseJson.data;

	return responseJson;
};
const Users = () => {
	const currentToken = useSelector(selectCurrentToken);
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPerPage, setCurrentPerPage] = useState(100);
	const [filterContent, setFilterContent] = useState<any>({});
	const [data, setData] = useState<any[]>([]);
	let rearrangedTableData: any[] = [];
	const dispatch = useDispatch();
	const router = useRouter();
	const queryClient = useQueryClient();

	const usersQueryRes = useQuery({
		queryKey: [
			"users",
			currentToken,
			filterContent?.companyId,
			currentPage,
			currentPerPage,
		],
		queryFn: getUsers,
		onError: (err: any) => {
			toast.error(err?.message || "Failed to get Users.");
		},
	});

	useEffect(() => {
		console.log("filtre content", filterContent);
		if (usersQueryRes.data?.data) {
			setData(usersQueryRes.data.data); // mettre à jour les users
		}
	}, [usersQueryRes.data]);

	// filtrage
	const filteredUsers = data.filter(
		(user) =>
			!filterContent?.selectedCompany ||
			user.companyId === filterContent.selectedCompany
	);

	// mapping pour table
	rearrangedTableData = filteredUsers.map((user: any, index: number) => ({
		Serial: index + 1,
		first_name: user.first_name ?? "-",
		last_name: user.last_name ?? "-",
		email: user.email ?? "-",
		phone_number: user.phone_number ?? "-",
		gender: user.gender ?? "-",
		country: user.nationality ?? "-",
		city: user.city ?? "-",
		kyc_status: (() => {
			const status = user.kyc_status?.toUpperCase();
			switch (status) {
				case "APPROVED":
					return (
						<BadgeLabel
							className="text-xs"
							label="Approved"
							badgeColor="#1F66FF"
							textColor="#444"
						/>
					);
				case "REJECTED":
					return (
						<BadgeLabel
							className="text-xs"
							label="Rejected"
							badgeColor="#F85D4B"
							textColor="#444"
						/>
					);
				default:
					return (
						<BadgeLabel
							className="text-xs"
							label="Pending"
							badgeColor="#FFAC1C"
							textColor="#444"
						/>
					);
			}
		})(),
		action: (
			<button
				className="px-2 py-1 bg-primary text-white text-sm rounded hover:bg-blue-600"
				onClick={() => goToDetails(user)}
			>
				See more
			</button>
		),
	}));

	const goToDetails = (user: any) => {
		console.log("user selectionne", user);
		dispatch(setSelectedUser(user));
		router.push("/users-admin/user-infos");
	};
	return (
		<ProtectedRoute allowedClearances={["admin"]}>
			<Layout title="Users">
				<section>
					<div className="my-[50px] bg-white shadow-md rounded-xl p-5">
						<Title title={"Users List"} />
						<CustomTable
							headerData={headerUserData}
							tableData={rearrangedTableData}
							isLoading={usersQueryRes.isLoading}
							filter
							filterType={"user"}
							filterContent={filterContent}
							setFilterContent={setFilterContent}
						/>
					</div>
				</section>
			</Layout>
		</ProtectedRoute>
	);
};

export default Users;
