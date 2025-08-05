import React from "react";
import CButton from "@/components/shared/CButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@radix-ui/react-label";
import { DropdownMenu } from "@nextui-org/react";
import CustomDropdown from "@/components/shared/CustomDropdown";
import { Select, SelectItem } from "@nextui-org/select";
import { FaCircle } from "react-icons/fa";
import "../styles/style.css";
const accountStatus = [
	{
		key: "inactive",
		label: "Inactif depuis plus d'un mois",
	},
];
const verifsData = [
	{
		key: "valid",
		label: "Validée",
	},
	{
		key: "invalid",
		label: "Non validée",
	},
	{
		key: "pending",
		label: "En attente",
	},
];
const cardsData = [
	{
		key: "0",
		label: "Aucune carte créée",
	},
	{
		key: "1",
		label: "Carte 1",
	},
	{
		key: "2",
		label: "Carte 2",
	},
];
const transferData = [
	{
		key: "0",
		label: "Pas de préférences",
	},
];
const NotificationsDropdown = () => {
	return (
		<div className="w-full">
			<div className="flex justify-between items-center mb-5">
				<h1 className="text-base font-bold leading-6">Cible</h1>
				<CButton text="importer un csv" btnStyle="green" />
			</div>
			<p className="text-xs w-full tracking-tight leading-3 ">
				cibler un comportement precis des utilisateurs
			</p>
			<div className="flex items-center">
				<label
					htmlFor={`customCheckboxUsers`}
					className="flex items-center cursor-pointer"
				>
					<div className="relative">
						<input
							type="checkbox"
							id={`customCheckboxUsers`}
							name={`customCheckboxUsers`}
							className="customCheckbox sr-only"
						/>
						<div className="checkboxContainer block p-[3px] border border-solid border-1 border-gray-300 bg-[#f2f2f2] rounded-full flex items-center text-xs">
							<FaCircle
								className="checkboxContentTransparent"
								color="transparent"
								size={12}
							/>
							<FaCircle
								className="checkboxContentGreen"
								color="#1F66FF"
								size={12}
							/>
						</div>
					</div>
					<div className="pl-3 py-4 text-sm">
						Cibler Tous les utilisateurs
					</div>
				</label>
				{/* <div className="rounded-lg p-1 flex justify-center items-center bg-gray-100 border-none outline-none">
					<Checkbox
						id="Cibler Tous les utilisateurs"
						className="bg-[#33E89C] rounded-full border-none outline-none"
					/>
				</div>
				<Label
					htmlFor="Cibler Tous les utilisateurs"
					className="text-[10px] text-gray-700 leading-[34.5px] ml-3"
				>
					Cibler Tous les utilisateurs
				</Label> */}
			</div>
			<div className="w-full my-5 flex flex-col gap-3">
				<Label
					htmlFor="compte sekure"
					className="text-xs leading-3 tracking-wide"
				>
					compte sekure
				</Label>
				<Select
					placeholder="Sélectionner"
					className="max-w-xs"
					defaultSelectedKeys={["inactive"]}
				>
					{accountStatus.map((item) => (
						<SelectItem key={item.key}>{item.label}</SelectItem>
					))}
				</Select>
			</div>
			<div className="w-full my-5 flex flex-col gap-3">
				<Label
					htmlFor="compte sekure"
					className="text-xs leading-3 tracking-wide"
				>
					Verification
				</Label>
				<Select placeholder="Sélectionner" className="max-w-xs">
					{verifsData.map((item) => (
						<SelectItem key={item.key}>{item.label}</SelectItem>
					))}
				</Select>
			</div>
			<div className="w-full my-5 flex flex-col gap-3">
				<Label
					htmlFor="compte sekure"
					className="text-xs leading-3 tracking-wide"
				>
					Carte
				</Label>
				<Select placeholder="Sélectionner" className="max-w-xs">
					{cardsData.map((item) => (
						<SelectItem key={item.key}>{item.label}</SelectItem>
					))}
				</Select>
			</div>
			<div className="w-full my-5 flex flex-col gap-3">
				<Label
					htmlFor="compte sekure"
					className="text-xs leading-3 tracking-wide"
				>
					Transferts
				</Label>
				<Select placeholder="Sélectionner" className="max-w-xs">
					{transferData.map((item) => (
						<SelectItem key={item.key}>{item.label}</SelectItem>
					))}
				</Select>
			</div>
		</div>
	);
};

export default NotificationsDropdown;
