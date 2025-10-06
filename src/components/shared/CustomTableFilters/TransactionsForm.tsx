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

interface FilterProps {
	filterContent?: any;
	setFilterContent?: (data?: any) => void;
}

const transactionsFilterSchema = z.object({
	status: z.enum(["SUCCESS", "FAILED", "PENDING", "CANCELED"]).optional(),
	operator: z.enum(["orange", "mtn", "OTHER"]).optional(),
	order: z.enum(["RECENT", "OLD"]).optional(),
});

const TransactionsForm: React.FC<FilterProps> = ({
	filterContent,
	setFilterContent,
}) => {
	const form = useForm<z.infer<typeof transactionsFilterSchema>>({
		resolver: zodResolver(transactionsFilterSchema),
		defaultValues: filterContent || {},
	});

	const onSubmit = (data: any) => {
		if (setFilterContent) setFilterContent(data);
	};

	const onClear = () => {
		form.reset({
			status: undefined,
			operator: undefined,
			order: undefined,
		});
		if (setFilterContent) setFilterContent({});
	};

	return (
		<div>
			<div className="flex gap-2 items-center font-bold text-md mb-4">
				<HiFilter /> Filters
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
				>
					<div className="flex gap-6">
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
											onValueChange={field.onChange}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select status" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="SUCCESS">
													Success
												</SelectItem>
												<SelectItem value="FAILED">
													Failed
												</SelectItem>
												<SelectItem value="PENDING">
													Pending
												</SelectItem>
												<SelectItem value="CANCELED">
													Canceled
												</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Operator */}
						<Controller
							control={form.control}
							name="operator"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Operator</FormLabel>
									<FormControl>
										<Select
											value={field.value ?? ""}
											onValueChange={field.onChange}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select operator" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="orange">
													Orange
												</SelectItem>
												<SelectItem value="mtn">
													MTN
												</SelectItem>
												<SelectItem value="OTHER">
													Other
												</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Order */}
						<Controller
							control={form.control}
							name="order"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Order by date</FormLabel>
									<FormControl>
										<Select
											value={field.value ?? ""}
											onValueChange={field.onChange}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select order" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="RECENT">
													Most Recent
												</SelectItem>
												<SelectItem value="OLD">
													Oldest
												</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="flex gap-4 mt-4">
						<CButton text="Apply" type="submit" btnStyle="blue" />
						<CButton
							text="Clear"
							btnStyle="red"
							onClick={onClear}
						/>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default TransactionsForm;
