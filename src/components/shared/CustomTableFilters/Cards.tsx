import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { HiFilter } from "react-icons/hi";
import { z } from "zod";
import {
	Form,
	FormControl,
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
import { useQueryClient } from "react-query";

interface FilterProps {
	filterContent?: any;
	setFilterContent?: (data?: any) => void;
}

const CardsFilterSchema = z.object({
	status: z.enum(["ACTIVE", "FROZEN", "TERMINATED"]).optional(),
	brand: z.enum(["VISA", "MASTERCARD"]).optional(),
});

const Cards: React.FC<FilterProps> = ({ filterContent, setFilterContent }) => {
	const form = useForm<z.infer<typeof CardsFilterSchema>>({
		resolver: zodResolver(CardsFilterSchema),
		defaultValues: filterContent || {},
	});

	const onSubmit = (data: any) => {
		if (setFilterContent) setFilterContent({ ...data });
	};

	return (
		<div>
			<div className="flex gap-2 items-center font-bold text-md mb-4">
				<HiFilter /> Filters
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="flex items-center gap-6">
						{/* Status */}
						<Controller
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Status</FormLabel>
									<FormControl>
										<Select
											value={field.value ?? ""}
											onValueChange={(value) =>
												field.onChange(value)
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select status" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="ACTIVE">
													Active
												</SelectItem>
												<SelectItem value="FROZEN">
													Frozen
												</SelectItem>
												<SelectItem value="TERMINATED">
													Terminated
												</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Brand */}
						<Controller
							control={form.control}
							name="brand"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Brand</FormLabel>
									<FormControl>
										<Select
											value={field.value ?? ""}
											onValueChange={(value) =>
												field.onChange(value)
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select brand" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="VISA">
													VISA
												</SelectItem>
												<SelectItem value="MASTERCARD">
													Mastercard
												</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Submit + Reset */}
					<div className="mt-6 flex gap-4">
						<CButton
							text="Apply"
							type="submit"
							btnStyle="blue"
							width="100px"
						/>
						<CButton
							text="Clear"
							btnStyle="red"
							onClick={() => {
								form.reset({
									status: undefined,
									brand: undefined,
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

export default Cards;
