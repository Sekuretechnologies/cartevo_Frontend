import BadgeLabel from "@/components/shared/BadgeLabel";
import React from "react";

interface StatusBadgeProps {
	status?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
	const normalized = status?.toUpperCase();

	if (normalized === "APPROVED") {
		return (
			<BadgeLabel
				className="text-xs"
				label="Approved"
				badgeColor="#1F66FF"
				textColor="#444"
			/>
		);
	} else if (normalized === "PENDING") {
		return (
			<BadgeLabel
				className="text-xs"
				label="Pending"
				badgeColor="#FFAC1C"
				textColor="#444"
			/>
		);
	} else if (normalized === "REJECTED") {
		return (
			<BadgeLabel
				className="text-xs"
				label="Rejected"
				badgeColor="#F85D4B"
				textColor="#444"
			/>
		);
	} else if (normalized === "NONE") {
		return (
			<BadgeLabel
				className="text-xs"
				label="None"
				badgeColor="#444"
				textColor="#fff"
			/>
		);
	}

	return null;
};

export default StatusBadge;
