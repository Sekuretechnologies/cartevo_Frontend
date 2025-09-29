import { ITableHeader } from "@/components/AdminTable/Table";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import React, { useState } from "react";
import { HiPlus } from "react-icons/hi";
import AddTeamMemberModal from "./components/AddTeamMemberModal";
import { any } from "zod";
import { SettingsService } from "@/api/services/cartevo-api/settings";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "@/redux/slices/auth";
import toast from "react-hot-toast";
import { TeamMemberSettingsRequest } from "@/types/settings";
import DeleteModal from "./components/DeleteModal";
import { X } from "lucide-react";
import EditRoleModal from "./components/EditRoleModal";

const getTeamMembers = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;
	const response = await SettingsService.get_team_members({ token });
	const data = await response.json();
	console.log(data);

	if (!response.ok) {
		throw new Error(data.message || "failed to get team members");
	}
	return data;
};

const TeamMember = () => {
	const [addTeamMemberModal, setAddTeamMemberModal] =
		useState<boolean>(false);
	const [deleteModalVisible, setDeleteModalVisible] =
		useState<boolean>(false);
	const [selectedMemberId, setSelectedMemberId] = useState<string>("");
	const [editModalVIsible, setEditModalVisible] = useState<boolean>(false);
	const queryClient = useQueryClient();

	const currentToken: any = useSelector(selectCurrentToken);

	const teamMembersQuery = useQuery({
		queryKey: ["teamMembers", currentToken],
		queryFn: getTeamMembers,
		onError: (err) => {
			toast.error("Failed to get Transaction fees.s");
		},
	});

	const teamMembersTableData = teamMembersQuery.data?.map(
		(member: TeamMemberSettingsRequest, index: number) => ({
			serial: index + 1,
			firts_name: member.first_name,
			last_name: member.last_name,
			role_in_company: member.role,
			email: member.email,
			status: member.status,
			action: (
				<div className="flex gap-2">
					<CButton
						text="Edit role"
						btnStyle="yellow"
						height="30px"
						onClick={() => handleEditModal(member.id)}
					/>
					<CButton
						text="Delete"
						btnStyle="red"
						height="30px"
						onClick={() => handleDeleteModal(member.id)}
					/>
				</div>
			),
		})
	);

	// const headerData: ITableHeader = {
	// 	date: "Date",
	// 	title: "Titre",
	// 	content: "Contenu",
	// 	action: "",
	// };

	const teamMembersHeaderData = {
		serial: "#",
		firts_name: "First Name",
		last_name: "Last Name",
		role_in_company: "Role in Company",
		email: "Email",
		status: "Status",
		actions: "Actions",
	};

	const handleDeleteModal = async (memberId: string) => {
		setSelectedMemberId(memberId);

		setDeleteModalVisible(true);
	};

	const handleEditModal = async (memberId: string) => {
		setSelectedMemberId(memberId);
		setEditModalVisible(true);
	};

	const deleteMutation = useMutation({
		mutationFn: (id: string) =>
			SettingsService.delete_team_member({ token: currentToken, id }),
		onSuccess: () => {
			toast.success("Team member deleted successfully");
			setDeleteModalVisible(false);
			queryClient.invalidateQueries(["teamMembers", currentToken]);
		},
		onError: (err: any) => {
			toast.error(err.message || "Failed to delete member");
		},
	});

	const handleConfirmDelete = () => {
		console.log("tentative de suppression");
		if (selectedMemberId) {
			deleteMutation.mutate(selectedMemberId);
		}
	};
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
				headerData={teamMembersHeaderData}
				tableData={teamMembersTableData}
				isLoading={teamMembersQuery.isLoading}
				btn={
					<CButton
						text="Add New Team Member"
						btnStyle="blue"
						icon={<HiPlus />}
						height="33px"
						onClick={() => {
							setAddTeamMemberModal(true);
						}}
					/>
				}
			/>

			{addTeamMemberModal && (
				<div>
					<AddTeamMemberModal
						onClose={() => setAddTeamMemberModal(false)}
					/>
				</div>
			)}

			{deleteModalVisible && (
				<div className="h-screen w-screen bg-black/20 backdrop-blur-sm absolute z-40 left-0 top-0 flex justify-center items-center">
					<div className="p-8 w-[500px] bg-white rounded-2xl">
						<div className="flex justify-between items-center">
							<h1 className="text-2xl font-bold text-primary">
								Confirm Delete
							</h1>
							<button
								className="hover:bg-gray-200 duration-300 p-1 rounded-md"
								onClick={() => setDeleteModalVisible(false)}
							>
								<X className="text-gray-500 hover:text-black" />
							</button>
						</div>
						<p>
							Are you sure you want to delete this team member?
							This action cannot be undone.
						</p>
						<div className=" flex justify-start items-center gap-4 mt-8">
							<CButton
								text="Delete"
								btnStyle="red"
								onClick={handleConfirmDelete}
							/>
							<CButton
								text="Cancel"
								btnStyle="blue"
								onClick={() => setDeleteModalVisible(false)}
							/>
						</div>
					</div>
				</div>
			)}

			{editModalVIsible && (
				<EditRoleModal
					userId={selectedMemberId}
					onClose={() => setEditModalVisible(false)}
				/>
			)}
		</div>
	);
};

export default TeamMember;
