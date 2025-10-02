import React from "react";
import TeamMemberForm from "./TeamMemberForm";
import { X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

type ModalProps = {
	onClose: () => void;
};

const AddTeamMemberModal = ({ onClose }: ModalProps) => {
	const { t }: { t: any } = useTranslation();
	return (
		<div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-[1000]">
			<div className="relative flex flex-col px-8 py-8 bg-white rounded-lg w-[600px]">
				<div className="flex justify-between items-center mb-8">
					<h1 className=" text-xl font-semibold">
						{t.settings.teamMembers.modals.addTeamMember.title}
					</h1>
					<button
						className="text-gray-500 hover:text-black duration-300"
						onClick={() => onClose()}
					>
						<X size={24} />
					</button>
				</div>

				<TeamMemberForm onClose={onClose} t={t} />
			</div>
		</div>
	);
};

export default AddTeamMemberModal;
