import React from "react";
import TeamMemberForm from "./TeamMemberForm";
import { X } from "lucide-react";

type ModalProps = {
	onClose: () => void;
};

const AddTeamMemberModal = ({ onClose }: ModalProps) => {
	return (
		<div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-[1000]">
			<div className="relative flex flex-col px-8 py-8 bg-white rounded-lg w-[600px]">
				<div className="flex justify-between items-center mb-8">
					<h1 className=" text-xl font-semibold">
						Add new team member
					</h1>
					<button
						className="text-gray-500 hover:text-black duration-300"
						onClick={() => onClose()}
					>
						<X size={24} />
					</button>
				</div>

				<TeamMemberForm onClose={onClose} />
			</div>
		</div>
	);
};

export default AddTeamMemberModal;
