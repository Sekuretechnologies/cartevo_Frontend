import React from "react";

interface KybcInfoProps {
	label: string;
	value: any;
}

const KybcInfo: React.FC<KybcInfoProps> = ({ label, value }) => {
	const isEmpty = value === null || value === undefined || value === "";

	// Couleur dynamique basée sur la valeur pour le status
	let dynamicStyle = "";
	if (!isEmpty) {
		switch (value?.toUpperCase()) {
			case "APPROVED":
				dynamicStyle = "bg-green-100 text-green-700";
				break;
			case "PENDING":
				dynamicStyle = "bg-yellow-100 text-yellow-700";
				break;
			case "REJECTED":
				dynamicStyle = "bg-red-100 text-red-700";
				break;
			case "NONE":
			default:
				dynamicStyle = "bg-gray-100 text-gray-700";
				break;
		}
	}

	return (
		<div>
			<p className="text-md mb-1">{label}</p>
			<h3
				className={`border-input border rounded-xl pl-4 font-semibold py-2 ${
					isEmpty ? "text-red-500 italic bg-[#f3f3f3]" : dynamicStyle
				}`}
			>
				{isEmpty ? "Not provided" : value}
			</h3>
		</div>
	);
};

export default KybcInfo;
