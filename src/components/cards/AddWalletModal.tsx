import React, { useState } from "react";
import CButton from "@/components/shared/CButton";

interface AddWalletModalProps {
	setIsOpen: (isOpen: boolean) => void;
	onSubmit: (data: { currency: string; country_iso_code: string }) => void;
}

const AddWalletModal: React.FC<AddWalletModalProps> = ({
	setIsOpen,
	onSubmit,
}) => {
	const [selectedCurrency, setSelectedCurrency] = useState("USD");
	const [selectedCountry, setSelectedCountry] = useState("US");

	const currencies = [
		{ code: "USD", name: "US Dollar", country: "US" },
		{ code: "EUR", name: "Euro", country: "EU" },
		{ code: "XAF", name: "Central African Franc", country: "CM" },
		{ code: "GBP", name: "British Pound", country: "GB" },
	];

	const handleSubmit = () => {
		onSubmit({
			currency: selectedCurrency,
			country_iso_code: selectedCountry,
		});
		setIsOpen(false);
	};

	const handleCurrencyChange = (currency: string, country: string) => {
		setSelectedCurrency(currency);
		setSelectedCountry(country);
	};

	return (
		<div className="bg-white rounded-lg p-6 w-full max-w-md">
			<h2 className="text-xl font-bold mb-4">Add New Wallet</h2>

			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Select Currency
				</label>
				<div className="grid grid-cols-2 gap-2">
					{currencies.map((currency) => (
						<button
							key={currency.code}
							onClick={() =>
								handleCurrencyChange(
									currency.code,
									currency.country
								)
							}
							className={`p-3 border rounded-lg text-center transition-colors ${
								selectedCurrency === currency.code
									? "border-blue-500 bg-blue-50 text-blue-700"
									: "border-gray-300 hover:border-gray-400"
							}`}
						>
							<div className="font-medium">{currency.code}</div>
							<div className="text-xs text-gray-500">
								{currency.name}
							</div>
						</button>
					))}
				</div>
			</div>

			<div className="flex gap-3 justify-end">
				<CButton
					text="Cancel"
					btnStyle="outlineDark"
					onClick={() => setIsOpen(false)}
				/>
				<CButton
					text="Create Wallet"
					btnStyle="blue"
					onClick={handleSubmit}
				/>
			</div>
		</div>
	);
};

export default AddWalletModal;
