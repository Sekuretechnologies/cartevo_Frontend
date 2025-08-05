import React, { forwardRef } from "react";
import { FaCircle } from "react-icons/fa";

export interface CheckboxProps
	extends React.DetailedHTMLProps<
		React.InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	> {
	label: string;
}

const RegularCheckbox = forwardRef<HTMLInputElement, CheckboxProps>(
	({ label, ...props }) => {
		return (
			// <input type="checkbox" {...props} />
			<label
				htmlFor={`customCheckboxUsers`}
				className="flex items-center cursor-pointer"
			>
				<div className="relative">
					<input
						// checked={checked}
						// onChange={(e)=>form.setValue('decreasingWalletOrder', e.target.checked)}
						type="checkbox"
						id={`customCheckboxUsers`}
						name={`customCheckboxUsers`}
						className="customCheckbox sr-only"
						{...props}
					/>
					<div className="checkboxContainer block p-[3px] border border-solid border-1 border-gray-300 bg-[#f2f2f2] rounded-full flex items-center text-xs">
						{/* <FaCircle className='checkboxContentTransparent' color="transparent" size={12} /> */}
						{props?.checked ? (
							<FaCircle
								className={""}
								color={"#1F66FF"}
								size={12}
							/>
						) : (
							<FaCircle
								className={""}
								color={"#ffffff00"}
								size={12}
							/>
						)}
					</div>
				</div>
				<div className="pl-3 py-4 text-sm">{label}</div>
			</label>
		);
	}
);

RegularCheckbox.displayName = "RegularCheckbox";
export default RegularCheckbox;
