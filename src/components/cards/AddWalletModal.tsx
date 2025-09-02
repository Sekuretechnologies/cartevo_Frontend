import React, { useState } from "react";
import CButton from "@/components/shared/CButton";
import { ItemFlag } from "@/app/wallets/page";
import { Select, SelectItem } from "@nextui-org/select";
import { countryCurrencies } from "@/constants/countryCurrenciesData";

interface AddWalletModalProps {
	setIsOpen: (isOpen: boolean) => void;
	onSubmit: (data: { currency: string; country_iso_code: string }) => void;
	existingWallets?: any[];
}

const AddWalletModal: React.FC<AddWalletModalProps> = ({
	setIsOpen,
	onSubmit,
	existingWallets = [],
}) => {
	const [selectedCurrency, setSelectedCurrency] = useState("XAF");
	const [selectedCountry, setSelectedCountry] = useState("CM");

	const handleSubmit = () => {
		onSubmit({
			currency: selectedCurrency,
			country_iso_code: selectedCountry,
		});
		setIsOpen(false);
	};

	// Filter out countries that already have wallets
	const availableCountries = countryCurrencies[0].filter((country: any) => {
		return !existingWallets.some(
			(wallet: any) => wallet.country_iso_code === country.iso2
		);
	});

	const handleCurrencyChange = (currency: string, country: string) => {
		setSelectedCurrency(currency);
		setSelectedCountry(country);
	};

	return (
		<div className="bg-white rounded-lg p-6 w-[400px]">
			<h2 className="text-xl font-bold mb-4">Add New Wallet</h2>

			<div className="my-4">
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Select Currency
				</label>
				<div className="grid grid-cols-1 gap-2">
					<Select
						placeholder="Select Country and Currency"
						selectedKeys={
							availableCountries.length > 0
								? [`${selectedCurrency}-${selectedCountry}`]
								: []
						}
						onSelectionChange={(keys) => {
							const value = keys.currentKey as string;
							const [currency, iso2] = value.split("-");
							setSelectedCurrency(currency);
							setSelectedCountry(iso2);
						}}
						renderValue={(items) => {
							return items.map((item) => {
								const key = item.key as string;
								const [currency, iso2] = key.split("-");
								const countryData = availableCountries.find(
									(country: any) =>
										country.iso2 === iso2 &&
										country.currency === currency
								);
								return (
									<div
										className="flex items-center gap-2"
										key={key}
									>
										<ItemFlag iso2={iso2} size={3} />
										<span>
											{`${countryData?.country} (${iso2}) - ${currency}`}
										</span>
									</div>
								);
							});
						}}
					>
						{availableCountries
							.sort((a: any, b: any) =>
								a.country.localeCompare(b.country)
							)
							.map((country: any) => (
								<SelectItem
									key={`${country.currency}-${country.iso2}`}
									value={`${country.currency}-${country.iso2}`}
								>
									<div className="flex items-center gap-2">
										<ItemFlag
											iso2={country.iso2}
											size={3}
										/>
										<span>
											{`${country.country} (${country.iso2}) - ${country.currency}`}
										</span>
									</div>
								</SelectItem>
							))}
					</Select>
					{/* {currencies.map((currency) => (
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
					))} */}
				</div>
			</div>

			<div className="flex mt-5 gap-3 justify-end">
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
