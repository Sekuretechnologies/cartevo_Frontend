import { ITableHeader } from "@/components/AdminTable/Table";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import React, { useState } from "react";
import { HiPlus } from "react-icons/hi";
import AddTeamMemberModal from "./components/AddTeamMemberModal";

const TeamMember = () => {
	const [addTeamMemberModal, setAddTeamMemberModal] =
		useState<boolean>(false);

	const headerData: ITableHeader = {
		date: "Date",
		title: "Titre",
		content: "Contenu",
		action: "",
	};
	return (
		<div className="p-4">
			<CustomTable
				headerData={headerData}
				tableData={[]}
				// isLoading={exchangeRatesQuery.isLoading}
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
					<AddTeamMemberModal />
				</div>
			)}
		</div>
	);
};

export default TeamMember;
