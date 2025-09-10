"use client";

import React, { useState } from "react";
import cm from "@/assets/flags/cm.svg";
import { ChevronDown } from "lucide-react";

type activity = {
	name: string;
	value: string;
};

const activities: activity[] = [
	{ name: "E-Commerce", value: "e-commerce" },
	{ name: "Finance", value: "+finance" },
];

interface PhoneInputProps {
	value?: string;
	onChange: (number: string, code: string) => void;
}

const ActivityInput: React.FC<PhoneInputProps> = ({ value = "", onChange }) => {
	const [selectedActivity, setSelectedActivity] = useState<activity>(
		activities[0]
	);
	const [isOpen, setIsOpen] = useState(false);

	const handleSelect = (activity: activity) => {
		setSelectedActivity(activity);
		setIsOpen(false);
		// Met à jour uniquement le numéro existant avec le nouveau code
		const numberWithoutCode = value.replace(/^\+\d+/, "");
		onChange(numberWithoutCode, activity.value);
	};

	return (
		<div className="relative w-fit">
			<div>
				{/* Sélecteur pays */}
				<button
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					className="flex items-center gap-2 px-3 py-3 border-1 border-[#E6E6E6] rounded-[7px] "
				>
					<span className="text-sm text-gray-700 font-poppins">
						{selectedActivity.name}
					</span>

					<ChevronDown />
				</button>
			</div>

			{/* Dropdown pays */}
			{isOpen && (
				<div className="absolute top-full left-0 mt-2 w-56 bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
					{activities.map((activity) => (
						<button
							key={activity.name}
							type="button"
							onClick={() => handleSelect(activity)}
							className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-left"
						>
							<span className="text-sm text-gray-700 font-poppins">
								{activity.name}
							</span>
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default ActivityInput;
