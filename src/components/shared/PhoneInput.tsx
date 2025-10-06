import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { allCountries } from "country-telephone-data";
import { useTranslation } from "@/hooks/useTranslation";

type Country = {
	name: string;
	iso2: string;
	dialCode: string;
	flag: string;
};

interface CountryPhoneInputProps {
	value?: string;
	defaultCountryIso2?: string;
	onChange: (fullNumber: string, country: Country) => void;
	placeholder?: string;
	className?: string;
}

const CountryPhoneInput: React.FC<CountryPhoneInputProps> = ({
	value = "",
	defaultCountryIso2 = "bj", // Bénin par défaut
	onChange,
	placeholder = "Numéro de téléphone",
	className = "",
}) => {
	const { t } = useTranslation();
	const inputTranslate = t.contact.input;

	const countries: Country[] = allCountries.map((c) => ({
		name: c.name,
		iso2: c.iso2.toLowerCase(),
		dialCode: `+${c.dialCode}`,
		flag: `https://flagcdn.com/${c.iso2.toLowerCase()}.svg`,
	}));

	const defaultCountry =
		countries.find((c) => c.iso2 === defaultCountryIso2.toLowerCase()) ||
		countries[0];

	const [selectedCountry, setSelectedCountry] =
		useState<Country>(defaultCountry);
	const [phoneNumber, setPhoneNumber] = useState<string>(value); // <-- vide par défaut
	const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState<string>("");

	const wrapperRef = useRef<HTMLDivElement>(null);

	useOnClickOutside(wrapperRef, () => {
		setDropdownOpen(false);
	});

	const filteredCountries = countries.filter((c) => {
		const term = searchTerm.trim().toLowerCase();
		if (term === "") return true;
		return (
			c.name.toLowerCase().includes(term) ||
			c.dialCode.startsWith(term) ||
			c.iso2.toLowerCase().startsWith(term)
		);
	});

	useEffect(() => {
		const full = `${selectedCountry.dialCode}${phoneNumber.replace(
			/\D/g,
			""
		)}`;
		onChange(full, selectedCountry);
	}, [selectedCountry, phoneNumber, onChange]);

	const handleCountrySelect = (country: Country) => {
		setSelectedCountry(country);
		setDropdownOpen(false);
	};

	const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPhoneNumber(e.target.value);
	};

	return (
		<div className={`relative ${className}`} ref={wrapperRef}>
			<div className="flex items-center border rounded-md overflow-hidden">
				<button
					type="button"
					className="flex items-center px-3 py-2 bg-white hover:bg-gray-100 border-r"
					onClick={() => setDropdownOpen((open) => !open)}
				>
					<img
						src={selectedCountry.flag}
						alt={selectedCountry.iso2}
						className="w-5 h-5 mr-2"
					/>
					<span className="mr-1">{selectedCountry.dialCode}</span>
					<svg
						className="w-4 h-4 ml-auto"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.35a.75.75 0 011.14.98l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
							fillRule="evenodd"
							clipRule="evenodd"
						/>
					</svg>
				</button>
				<input
					type="tel"
					value={phoneNumber}
					onChange={handlePhoneChange}
					placeholder={inputTranslate.phone}
					inputMode="tel"
					className="flex-1 px-3 text-[14px] py-3 outline-none rounded-[7px]"
				/>
			</div>

			{dropdownOpen && (
				<div className="absolute mt-1 left-0 w-full max-h-60 bg-white border rounded-md shadow-lg overflow-y-auto z-50">
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder={inputTranslate.code}
						className="w-full px-3 py-2 border-b outline-none"
					/>
					{filteredCountries.length === 0 && (
						<div className="px-3 py-2 text-gray-500">
							{inputTranslate.result}
						</div>
					)}
					{filteredCountries.map((c) => (
						<button
							key={c.iso2 + c.dialCode}
							type="button"
							onClick={() => handleCountrySelect(c)}
							className="flex items-center w-full px-3 py-2 hover:bg-gray-100"
						>
							<img
								src={c.flag}
								alt={c.name}
								className="w-5 h-5 mr-2"
							/>
							<span className="flex-1 text-left">{c.name}</span>
							<span className="text-sm text-gray-500 ml-auto">
								{c.dialCode}
							</span>
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default CountryPhoneInput;

function useOnClickOutside(
	ref: React.RefObject<HTMLElement>,
	handler: (event: MouseEvent | TouchEvent) => void
) {
	useEffect(() => {
		const listener = (event: MouseEvent | TouchEvent) => {
			if (!ref.current || ref.current.contains(event.target as Node))
				return;
			handler(event);
		};
		document.addEventListener("mousedown", listener);
		document.addEventListener("touchstart", listener);
		return () => {
			document.removeEventListener("mousedown", listener);
			document.removeEventListener("touchstart", listener);
		};
	}, [ref, handler]);
}
