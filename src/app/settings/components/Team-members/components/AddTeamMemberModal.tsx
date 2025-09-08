import Layout from "@/components/shared/Layout";
import { useTitle } from "@/hooks/useTitle";
import React from "react";
import TeamMemberForm from "./TeamMemberForm";

const AddTeamMemberModal = () => {
	// useTitle("cartevo | New Team Member", true);
	// useTitle("Cartevo | New Customer", true);
	return (
		<div className="w-full left-0 top-0 absolute h-screen  bg-black/20 backdrop-blur-sm flex justify-center items-center">
			<div className="flex flex-col px-8 py-8 bg-white rounded-lg w-[600px]">
				<h1 className="mb-8 text-xl font-semibold">
					Add new team member
				</h1>
				<TeamMemberForm />
			</div>
		</div>
	);
};

export default AddTeamMemberModal;
