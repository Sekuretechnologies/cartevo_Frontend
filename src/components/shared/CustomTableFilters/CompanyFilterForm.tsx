import { selectCurrentToken } from "@/redux/slices/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import CButton from "../CButton";
import { HiFilter } from "react-icons/hi";
import { ItemFlag } from "../ItemFlag";
import { CompanyService } from "@/api/services/cartevo-api/company";
import { AdminService } from "@/api/services/cartevo-api/admin";
import { useQueries, useQuery } from "react-query";
import toast from "react-hot-toast";

interface FilterProps {
	filterContent?: any;
	setFilterContent?: (data?: any) => void;
}

const CompanyFilterSchema = z.object({
	country: z.string().optional(),
	business_type: z.string().optional(),
	is_active: z.enum(["active", "inactive", "all"]).optional(),
});

const activities = [
	{
		key: "E-Commerce",
		label: "E-Commerce",
	},
	{
		key: "Fast-Moving Consumer Goods",
		label: "Fast-Moving Consumer Goods",
	},
	{
		key: "Fintech",
		label: "Fintech",
	},
	{
		key: "Logistics and Mobility",
		label: "Logistics and Mobility",
	},
	{
		key: "Travel and Mobility",
		label: "Travel and Mobility",
	},
	{
		key: "Global Business",
		label: "Global Business",
	},
	{
		key: "Retail Outlet",
		label: "Retail Outlet",
	},
	{
		key: "Money Transfer",
		label: "Money Transfer",
	},
	{
		key: "Remittance",
		label: "Remittance",
	},
	{
		key: "High risk business (Betting, Gaming, Forex, ...)",
		label: "High risk business (Betting, Gaming, Forex, ...)",
	},
	{
		key: "Other",
		label: "Other",
	},
];

const getCountries = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;
	const response = await AdminService.getCountries({ token });

	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to fetch countries");
	}

	return responseJson;
};

const CompanyFilterForm: React.FC<FilterProps> = ({
	filterContent,
	setFilterContent,
}) => {
	const currentToken: any = useSelector(selectCurrentToken);

	const countriesQuery = useQuery({
		queryKey: ["countries", currentToken],
		queryFn: getCountries,
		onError: (err: any) => {
			toast.error("Failed to get countries");
		},
	});

	const form = useForm<z.infer<typeof CompanyFilterSchema>>({
		resolver: zodResolver(CompanyFilterSchema),
		defaultValues: filterContent || { is_active: "all" },
	});

	const onSubmit = (data: any) => {
		const transformedData = {
			...data,
			is_active:
				data.is_active === "active"
					? true
					: data.is_active === "inactive"
					? false
					: undefined,
		};

		if (setFilterContent) setFilterContent(transformedData);
	};

	return (
		<div>
			<div className="flex gap-2 items-center font-bold text-md mb-4">
				<HiFilter /> Filtres
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className=" flex items-center gap-6">
						{/* Country */}
						<Controller
							control={form.control}
							name="country"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Country</FormLabel>
									<FormControl>
										<Select
											value={field.value ?? ""}
											onValueChange={(value) =>
												field.onChange(value)
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Sélectionnez le pays" />
											</SelectTrigger>
											<SelectContent>
												{countriesQuery.isLoading && (
													<div className="px-2 py-1 text-gray-400">
														<div className="flex justify-center items-center py-4">
															<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
														</div>
													</div>
												)}
												{countriesQuery.data?.countries
													?.length > 0
													? countriesQuery.data.countries
															.filter(
																(c: string) =>
																	c.length ===
																	2
															)
															.map(
																(
																	iso: string
																) => (
																	<SelectItem
																		key={
																			iso
																		}
																		value={
																			iso
																		}
																	>
																		<div className="flex items-center gap-2">
																			<ItemFlag
																				iso2={
																					iso
																				}
																				size={
																					6
																				}
																			/>
																			<span>
																				{
																					iso
																				}
																			</span>
																		</div>
																	</SelectItem>
																)
															)
													: ""}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Business Type */}
						<Controller
							control={form.control}
							name="business_type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Business Type</FormLabel>
									<FormControl>
										<Select
											value={field.value ?? ""}
											onValueChange={(value) =>
												field.onChange(value)
											}
											// placeholder="Select Business Type"
										>
											<SelectTrigger>
												<SelectValue placeholder="Select Business Type" />
											</SelectTrigger>
											<SelectContent>
												{activities.map((act) => (
													<SelectItem
														key={act.key}
														value={act.key}
													>
														{act.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Status */}
						<Controller
							control={form.control}
							name="is_active"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Status</FormLabel>
									<FormControl>
										<Select
											value={field.value ?? "all"}
											onValueChange={(value) =>
												field.onChange(value)
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select Status" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">
													All
												</SelectItem>
												<SelectItem value="active">
													Active
												</SelectItem>
												<SelectItem value="inactive">
													Inactive
												</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Submit */}
					<div className="mt-6 flex gap-4">
						<CButton
							text="Valider"
							type="submit"
							btnStyle="blue"
							width="100px"
						/>
						<CButton
							text="Clear"
							btnStyle="red"
							onClick={() => {
								form.reset({
									country: "",
									business_type: "",
									is_active: "all",
								});
								if (setFilterContent) setFilterContent({});
							}}
						/>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default CompanyFilterForm;
