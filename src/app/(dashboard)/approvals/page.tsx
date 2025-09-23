"use client";

import Layout from "@/components/shared/Layout";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PendingCompanies from "./components/pending-companies/PendingCompanies";
import ApprovedCompanies from "./components/approved-companies/ApprovedCompanies";
import RejectedCompanies from "./components/rejected-companies/RejectedCompanies";
import NoneCompanies from "./components/none-companies/NoneCompanies";
import AllCompanies from "./components/all-companies/AllCompanies";
import Title from "@/components/shared/Title";
import CustomTable from "@/components/shared/CustomTable";
import { headerUserData } from "@/constants/UserData";
import { AdminService } from "@/api/services/cartevo-api/admin";
import {
	QueryClient,
	useMutation,
	useQuery,
	useQueryClient,
} from "react-query";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentToken } from "@/redux/slices/auth";
import { RootState } from "@/redux/store";
import BadgeLabel from "@/components/shared/BadgeLabel";
import { useRouter } from "next/navigation";
import { setSelectedUser } from "@/redux/slices/userSlices";

const getUsers = async ({ queryKey }: any) => {
	const [_key, token, companyId, page, perPage] = queryKey;

	// Appel du service pour récupérer les users
	const response = await AdminService.get_users({
		token: token || "",
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

const Approvals = () => {
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
		onError: () => toast.error("Failed to get Users."),
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
		router.push("/approvals/user-infos");
	};

	return (
		<Layout title="Approvals">
			<section>
				<div className="bg-white shadow-md rounded-xl py-5">
					<Tabs defaultValue="pending" className="w-full">
						<div className="w-fit">
							<TabsList
								defaultValue={"pending"}
								className="TabsList grid grid-cols-2 md:flex mb-[120px] md:mb-0"
							>
								<TabsTrigger
									className="TabsTrigger"
									value="pending"
								>
									<span className="px-10 py-4 border-1 rounded-full">
										Pending
									</span>
								</TabsTrigger>
								<TabsTrigger
									className="TabsTrigger"
									value="approved"
								>
									<span className="px-10 py-4 border-1 rounded-full">
										Approved
									</span>
								</TabsTrigger>
								<TabsTrigger
									className="TabsTrigger"
									value="rejected"
								>
									<span className="px-10 py-4 border-1 rounded-full">
										Rejected
									</span>
								</TabsTrigger>
								<TabsTrigger
									className="TabsTrigger"
									value="none"
								>
									<span className="px-10 py-4 border-1 rounded-full">
										None
									</span>
								</TabsTrigger>
								<TabsTrigger
									className="TabsTrigger"
									value="all"
								>
									<span className="px-10 py-4 border-1 rounded-full">
										All
									</span>
								</TabsTrigger>
							</TabsList>
						</div>

						<div>
							<TabsContent value="pending">
								<PendingCompanies />
							</TabsContent>
							<TabsContent value="approved">
								<ApprovedCompanies />
							</TabsContent>
							<TabsContent value="rejected">
								<RejectedCompanies />
							</TabsContent>
							<TabsContent value="none">
								<NoneCompanies />
							</TabsContent>
							<TabsContent value="all">
								<AllCompanies />
							</TabsContent>
						</div>
					</Tabs>
				</div>

				<div className="my-[50px] bg-white shadow-md rounded-xl p-5">
					<Title title={"User List"} />

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
	);
};

export default Approvals;
