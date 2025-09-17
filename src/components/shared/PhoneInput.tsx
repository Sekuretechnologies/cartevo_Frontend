"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { allCountries } from "country-telephone-data";

type Country = {
	name: string;
	dialCode: string;
	flag: string;
};

const countries: Country[] = allCountries.map((c) => ({
	name: c.name,
	dialCode: `+${c.dialCode}`,
	flag: `https://flagcdn.com/${c.iso2.toLowerCase()}.svg`,
}));

interface PhoneInputProps {
	value?: string;
	onChange: (number: string, code: string) => void;
}

const normalize = (str: string) => str.toLowerCase();

const PhoneInput: React.FC<PhoneInputProps> = ({ value = "", onChange }) => {
	const [selectedCountry, setSelectedCountry] = useState<Country>(
		countries[0]
	);
	const [isOpen, setIsOpen] = useState(false);
	const [inputValue, setInputValue] = useState(value);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleSelect = (country: Country) => {
		setSelectedCountry(country);
		const numberWithoutCode = inputValue.replace(/^\+\d+/, "");
		onChange(numberWithoutCode, country.dialCode);
		setIsOpen(false);
	};

	// Filtrer les pays en temps réel selon la saisie
	const filteredCountries = countries.filter(
		(c) =>
			normalize(c.name).includes(normalize(inputValue)) ||
			c.dialCode.startsWith(inputValue)
	);

	// Fermer le dropdown si clic à l'extérieur
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="relative w-fit" ref={dropdownRef}>
			{/* Sélecteur pays */}
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 px-3 py-3 border border-[#E6E6E6] rounded-[7px]"
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

			{/* Dropdown pays */}
			{isOpen && (
				<div className="absolute top-full left-0 mt-2 w-56 bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
					{/* Input recherche */}
					<input
						type="text"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						placeholder="Rechercher un pays ou code"
						className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none"
					/>
					{/* Liste filtrée en temps réel */}
					{filteredCountries.map((country) => (
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
