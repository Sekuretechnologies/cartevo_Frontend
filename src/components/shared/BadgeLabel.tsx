import React from "react";
import { Button } from "../ui/button";

const BadgeLabel = ({
	label,
	badgeColor,
	textColor,
	className,
	icon,
}: {
	label: string;
	badgeColor?: string;
	textColor?: string;
	className?: string;
	icon?: React.ReactNode;
}) => {
	return (
		<div className="relative flex items-center gap-2">
			<span
				className={`${className}
        rounded-full text-center py-1 px-3 flex justify-center items-center text-md font-bold`}
				style={{
					color: badgeColor ?? "#444",
					background: `${badgeColor}33`,
				}}
			>
				{label}
			</span>
		</div>
	);
};

export default BadgeLabel;
