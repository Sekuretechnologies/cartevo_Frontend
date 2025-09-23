import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { HiFilter } from "react-icons/hi";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { AdminService } from "@/api/services/cartevo-api/admin";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "@/redux/slices/auth";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import CButton from "../CButton";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";

// schéma : companyId est string optionnel
export const userFilterSchema = z.object({
	companyId: z.string().optional(),
});

interface FilterProps {
	filterContent?: any;
	setFilterContent?: (data?: any) => void;
}

const getCompanies = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;
	const response = await AdminService.get_Companies({ token });
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "failed to get companies");
	}

	return data; // contient data.data[]
};

const UserFilterForm: React.FC<FilterProps> = ({
	filterContent,
	setFilterContent,
}) => {
	const currentToken: any = useSelector(selectCurrentToken);

	const companiesQuery = useQuery({
		queryKey: ["companies", currentToken],
		queryFn: getCompanies,
		onError: (err: any) => {
			toast.error("Failed to get companies");
		},
	});

	const form = useForm<z.infer<typeof userFilterSchema>>({
		resolver: zodResolver(userFilterSchema),
		defaultValues: {},
	});

	const onSubmit = (data: any) => {
		// data.companyId = l'id choisi
		if (setFilterContent) {
			setFilterContent(data);
		}
	};

	const onError = (err: any) => {
		console.error("error submitting user filter", err);
	};

	return (
		<div>
			<div className={`flex gap-2 items-center font-bold text-md`}>
				<HiFilter /> Filtres
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit, onError)}
					className="w-52 flex flex-col gap-7"
				>
					{/* si loading */}
					{companiesQuery.isLoading && (
						<div className="flex justify-center items-center py-4">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
						</div>
					)}

					{!companiesQuery.isLoading && (
						<FormField
							control={form.control}
							name="companyId"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Select
											value={field.value || undefined} // undefined pour afficher le placeholder
											onValueChange={field.onChange}
										>
											<SelectTrigger className="border rounded  py-1 w-full">
												<SelectValue placeholder="Sélectionner une compagnie" />
											</SelectTrigger>

											<SelectContent>
												{companiesQuery.data?.data?.map(
													(company: any) => (
														<SelectItem
															key={company.id}
															value={company.id}
														>
															{company.name}
														</SelectItem>
													)
												)}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}

					<div className="flex justify-center ">
						<CButton
							text="Valider"
							type="submit"
							btnStyle="blue"
							width="100px"
						/>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default UserFilterForm;
