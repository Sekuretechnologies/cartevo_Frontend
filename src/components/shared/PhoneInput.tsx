"use client";

import React, { useState } from "react";
import cm from "@/assets/flags/cm.svg";
import { ChevronDown } from "lucide-react";

type Country = {
	name: string;
	dialCode: string;
	flag: string;
};

const countries: Country[] = [
	{ name: "Côte d’Ivoire", dialCode: "+225", flag: "/flags/ci.svg" },
	{ name: "Cameroun", dialCode: "+237", flag: "/flags/cm.svg" },
	{ name: "Gabon", dialCode: "+241", flag: "/flags/gb.svg" },
	{ name: "Nigéria", dialCode: "+234", flag: "/flags/ng.svg" },
	// { name: "Ghana", dialCode: "+233", flag: "🇬🇭" },
	// ajouter d’autres pays si nécessaire
];

interface PhoneInputProps {
	value?: string;
	onChange: (number: string, code: string) => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ value = "", onChange }) => {
	const [selectedCountry, setSelectedCountry] = useState<Country>(
		countries[0]
	);
	const [isOpen, setIsOpen] = useState(false);

	const handleSelect = (country: Country) => {
		setSelectedCountry(country);
		setIsOpen(false);
		// Met à jour uniquement le numéro existant avec le nouveau code
		const numberWithoutCode = value.replace(/^\+\d+/, "");
		onChange(numberWithoutCode, country.dialCode);
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
					<img
						src={selectedCountry.flag}
						alt={selectedCountry.dialCode}
						className="w-6 h-6"
					/>

					<span className="text-sm text-gray-700 font-poppins">
						{selectedCountry.dialCode}
					</span>

					<ChevronDown />
				</button>
			</div>

			{/* Dropdown pays */}
			{isOpen && (
				<div className="absolute top-full left-0 mt-2 w-56 bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
					{countries.map((country) => (
						<button
							key={country.dialCode}
							type="button"
							onClick={() => handleSelect(country)}
							className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-left"
						>
							<img
								src={country.flag}
								alt={country.name}
								className="w-6 h-6"
							/>

							<span className="text-sm text-gray-700 font-poppins">
								{country.name}
							</span>
							<span className="ml-auto text-sm text-gray-500 font-poppins">
								{country.dialCode}
							</span>
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default PhoneInput;
