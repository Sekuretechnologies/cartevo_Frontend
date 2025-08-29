import React from "react";

export interface CheckboxProps {
	id?: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
	label?: string | React.ReactNode;
	disabled?: boolean;
	className?: string;
	labelClassName?: string;
	checkboxClassName?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
	id,
	checked,
	onChange,
	label,
	disabled = false,
	className = "",
	labelClassName = "",
	checkboxClassName = "",
}) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.checked);
	};

	return (
		<div className={`inline-flex items-center ${className}`}>
			<label
				className={`flex items-center cursor-pointer relative ${labelClassName}`}
			>
				<div className="h-5 w-5">
					<input
						type="checkbox"
						id={id}
						checked={checked}
						onChange={handleChange}
						disabled={disabled}
						className={`peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow border border-slate-300 checked:bg-primary checked:border-primary ${checkboxClassName}`}
					/>
					<span className="absolute text-white opacity-0 peer-checked:opacity-100 top-[50%] left-[3px] transform -translate-y-1/2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-3.5 w-3.5"
							viewBox="0 0 20 20"
							fill="currentColor"
							stroke="currentColor"
							strokeWidth="1"
						>
							<path
								fillRule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clipRule="evenodd"
							/>
						</svg>
					</span>
				</div>

				{label && (
					<span className="ml-2 text-sm text-gray-700">{label}</span>
				)}
			</label>
		</div>
	);
};

export default Checkbox;
