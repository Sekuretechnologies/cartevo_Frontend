"use client";

import Modal from "@/components/shared/Modal/Modal";
import { useTranslation } from "@/hooks/useTranslation";
import { X } from "lucide-react";

interface HelpModalProps {
	isOpen: boolean;
	onClose: () => void;
	helpRequest: {
		id: string;
		name: string;
		email: string;
		subject: string;
		message: string;
		status: string;
		response?: string;
		createAt: Date; // Changed from createdAt
		updatedAt: Date;
	};
}

const HelpModal = ({ isOpen, onClose, helpRequest }: HelpModalProps) => {
	const { t } = useTranslation();
	const help = t.contact.help;

	const DetailItem = ({
		label,
		value,
	}: {
		label: string;
		value: string | undefined;
	}) => (
		<div>
			<label className="block text-sm font-medium text-gray-500">
				{label}
			</label>
			<p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded-md min-h-[40px]">
				{value || help.modal.notProvided}
			</p>
		</div>
	);

	const modalContent = (
		<div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-semibold text-gray-800">
					{help.modal.title}
				</h2>
				<button
					className="p-2 rounded-full hover:bg-gray-100 transition-colors"
					onClick={onClose}
				>
					<X size={20} />
				</button>
			</div>
			<div className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<DetailItem label={help.modal.subject} value={helpRequest.subject} />
					<div>
						<label className="block text-sm font-medium text-gray-500">
							{help.modal.status}
						</label>
						<span
							className={`px-3 py-1 mt-1 inline-block text-xs font-semibold rounded-full ${
								helpRequest.status === "RESOLVED"
									? "bg-green-100 text-green-800"
									: "bg-yellow-100 text-yellow-800"
							}`}
						>
							{helpRequest.status === "RESOLVED"
								? help.modal.resolved
								: help.modal.pending}
						</span>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<DetailItem
						label={help.modal.from}
						value={`${helpRequest.name} <${helpRequest.email}>`}
					/>
					<DetailItem
						label={help.modal.sendAt} // Changed from Received
						value={new Date(helpRequest.createAt).toLocaleString()} // Changed from createdAt
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-500">
						{help.modal.message}
					</label>
					<div className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md whitespace-pre-wrap min-h-[100px] max-h-[60vh] overflow-y-auto">
						{helpRequest.message}
					</div>
				</div>

				{helpRequest.response && (
					<div>
						<label className="block text-sm font-medium text-gray-500">
							{help.modal.response}
						</label>
						<div className="mt-1 text-sm text-gray-900 bg-blue-50 p-3 rounded-md whitespace-pre-wrap min-h-[100px] max-h-48 overflow-y-auto">
							{helpRequest.response}
						</div>
					</div>
				)}
			</div>
		</div>
	);

	return (
		<Modal
			name="Help Request Details"
			isOpen={isOpen}
			setIsOpen={onClose}
			modalContent={modalContent}
		/>
	);
};

export default HelpModal;
