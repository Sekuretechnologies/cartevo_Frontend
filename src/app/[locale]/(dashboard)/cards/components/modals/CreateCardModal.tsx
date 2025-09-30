"use client";
import { CardService } from "@/api/services/cartevo-api/card";
import { CustomerService } from "@/api/services/cartevo-api/customer";
import CButton from "@/components/shared/CButton";
import Modal from "@/components/shared/Modal/Modal";
import Title from "@/components/shared/Title";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { selectCurrentToken } from "@/redux/slices/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaCreditCard, FaTimes } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";
import { z } from "zod";
import Image from "next/image";

interface CreateCardModalProps {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}

const createCardSchema = z.object({
	customer_id: z.string().min(1),
	brand: z.string(),
	amount: z.number(),
	name_on_card: z.string().min(1),
});

export default function CreateCardModal({
	isOpen,
	setIsOpen,
}: CreateCardModalProps) {
	const token: any = useSelector(selectCurrentToken);
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = useForm<z.infer<typeof createCardSchema>>({
		resolver: zodResolver(createCardSchema),
		defaultValues: {
			brand: "VISA",
			amount: 2,
			name_on_card: "",
		},
	});

	const customersQuery = useQuery({
		queryKey: ["allCustomersForCard", isOpen, !!token],
		queryFn: async () => {
			const res = await CustomerService.get_customers({ token });
			const json = await res.json();
			if (!res.ok)
				throw new Error(json?.message || "Failed to load customers");
			return json?.data || [];
		},
		enabled: isOpen && !!token,
		staleTime: 60_000,
		retry: false,
	});

	const createMutation = useMutation({
		mutationFn: async (payload: any) => {
			const res = await CardService.create_card({ token, data: payload });
			if (res.status === 504) throw new Error("504");
			const json = await res.json();
			if (!res.ok)
				throw new Error(json?.message || "Failed to create card");
			return json;
		},
		onSuccess: () => {
			toast.success("Card created successfully");
			reset();
			setIsOpen(false);
			queryClient.invalidateQueries(["allCards"]);
		},
		onError: (err: any) => {
			if (err?.message === "504") {
				toast.success("Card creation initiated");
				reset();
				setIsOpen(false);
				queryClient.invalidateQueries(["allCards"]);
			} else {
				toast.error(err?.message || "Failed to create card");
			}
		},
	});

	const onSubmit = (data: any) => {
		const payload = {
			customer_id: data.customer_id,
			brand: data.brand,
			amount: parseFloat(data.amount),
			name_on_card: data.name_on_card.trim(),
		};
		createMutation.mutate(payload);
	};

	const customers = customersQuery.data as any[];

	return (
		<Modal
			name="createCard"
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			modalContent={
				<div className="bg-white m-auto  md:w-[480px] p-12 rounded-md w-md max-h-[90vh] overflow-y-auto max-w-[580px]">
					<div className="flex justify-between mb-6">
						<div className="flex items-center gap-3">
							<FaCreditCard
								className="text-blue-600 -mt-1"
								size={24}
							/>
							<Title title={"Add New Card"} />
						</div>
						<div
							className="cursor-pointer hover:bg-gray-100 p-2 rounded-full"
							onClick={() => setIsOpen && setIsOpen(false)}
						>
							<FaTimes size={16} color={"#444"} />
						</div>
					</div>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-6"
					>
						{/* Customer typeahead input (filter by name or email) */}
						<div className="relative">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Customer
							</label>
							{/* Hidden field to keep form validation and submission */}
							<input
								type="hidden"
								{...register("customer_id", {
									required: "Please select a customer" as any,
								})}
							/>

							{/* Local state via React.useState without extra imports */}
							{(() => {
								const [query, setQuery] = React.useState("");
								const [open, setOpen] = React.useState(false);
								const [highlightedIndex, setHighlightedIndex] =
									React.useState(-1);

								React.useEffect(() => {
									// Reset on modal open
									if (!isOpen) {
										setQuery("");
										setOpen(false);
										setHighlightedIndex(-1);
									}
								}, [isOpen]);

								const normalized = (val: string) =>
									(val || "").toLowerCase();
								const filtered = React.useMemo(() => {
									const q = normalized(query);
									if (!q) return customers || [];
									return (customers || []).filter(
										(c: any) => {
											const name = `${
												c.first_name ||
												c.full_name ||
												""
											} ${c.last_name || ""}`.trim();
											return (
												normalized(name).includes(q) ||
												normalized(
													c.email || ""
												).includes(q)
											);
										}
									);
								}, [customers, query]);

								const selectCustomer = (c: any) => {
									setValue("customer_id", c.id, {
										shouldValidate: true,
									});
									const name = `${
										c.first_name || c.full_name || ""
									} ${c.last_name || ""}`.trim();
									setValue("name_on_card", name);
									setQuery(
										`${name} - ${c.email || ""}`.trim()
									);
									setOpen(false);
									setHighlightedIndex(-1);
								};

								const onKeyDown = (
									e: React.KeyboardEvent<HTMLInputElement>
								) => {
									if (
										!open &&
										(e.key === "ArrowDown" ||
											e.key === "ArrowUp")
									) {
										setOpen(true);
										return;
									}
									if (!open) return;
									if (e.key === "ArrowDown") {
										e.preventDefault();
										setHighlightedIndex((prev) => {
											const next = prev + 1;
											return next >= filtered.length
												? filtered.length - 1
												: next;
										});
									} else if (e.key === "ArrowUp") {
										e.preventDefault();
										setHighlightedIndex((prev) => {
											const next = prev - 1;
											return next < 0 ? 0 : next;
										});
									} else if (e.key === "Enter") {
										if (
											highlightedIndex >= 0 &&
											highlightedIndex < filtered.length
										) {
											e.preventDefault();
											selectCustomer(
												filtered[highlightedIndex]
											);
										}
									} else if (e.key === "Escape") {
										setOpen(false);
									}
								};

								return (
									<div>
										<input
											type="text"
											value={query}
											onChange={(e) => {
												setQuery(e.target.value);
												setOpen(true);
											}}
											onFocus={() => setOpen(true)}
											onKeyDown={onKeyDown}
											placeholder={
												customersQuery.isLoading
													? "Loading customers..."
													: "Type to search by name or email"
											}
											disabled={customersQuery.isLoading}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
										{open &&
											filtered &&
											filtered.length > 0 && (
												<ul className="absolute z-[12000] mt-1 max-h-56 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
													{filtered.map(
														(
															c: any,
															idx: number
														) => {
															const name = `${
																c.first_name ||
																c.full_name ||
																""
															} ${
																c.last_name ||
																""
															}`.trim();
															const label = `${name}${
																c.email
																	? ` - ${c.email}`
																	: ""
															}`;
															const highlighted =
																idx ===
																highlightedIndex;
															return (
																<li
																	key={c.id}
																	className={classNames(
																		"cursor-pointer px-3 py-2 hover:bg-blue-50",
																		{
																			"bg-blue-50":
																				highlighted,
																		}
																	)}
																	onMouseEnter={() =>
																		setHighlightedIndex(
																			idx
																		)
																	}
																	onMouseDown={(
																		e
																	) => {
																		e.preventDefault();
																		selectCustomer(
																			c
																		);
																	}}
																>
																	{label}
																</li>
															);
														}
													)}
												</ul>
											)}
										{open &&
											filtered &&
											filtered.length === 0 && (
												<div className="absolute z-[12000] mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 shadow-lg">
													No customers found
												</div>
											)}
										{errors.customer_id && (
											<p className="text-red-500 text-sm mt-1">
												{
													errors.customer_id
														.message as any
												}
											</p>
										)}
									</div>
								);
							})()}
						</div>

						{/* Cardholder Name (disabled, mirrors AddCardModal) */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Cardholder Name
							</label>
							<input
								type="text"
								{...register("name_on_card", {
									required:
										"Cardholder name is required" as any,
								})}
								disabled
								placeholder="Enter cardholder name"
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
							{errors.name_on_card && (
								<p className="text-red-500 text-sm mt-1">
									{errors.name_on_card.message as any}
								</p>
							)}
						</div>

						{/* Card Brand (same as AddCardModal) */}
						<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
								Card Brand
							</label>
					<Select
								onValueChange={(val) =>
									setValue("brand", val as any, {
										shouldValidate: true,
									})
								}
							>
						<SelectTrigger>
							{(() => {
								const brand = (watch("brand") as string) || "";
								const src =
									brand === "VISA"
										? "/images/visa-logo.png"
										: brand === "MASTERCARD"
										? "/images/mastercard-logo.jpg"
										: null;
								return (
									<div className="flex items-center gap-2">
										{src ? (
											<Image
												src={src}
												alt={`${brand} logo`}
												width={20}
												height={20}
												className="object-contain"
											/>
										) : null}
										<span className="text-sm text-gray-700">
											{brand || "Select brand"}
										</span>
									</div>
								);
							})()}
						</SelectTrigger>
								<SelectContent className="z-[10001]">
							<SelectItem value="VISA">
								<div className="flex items-center gap-2">
									<Image
										src="/images/visa-logo.png"
										alt="VISA logo"
										width={20}
										height={20}
										className="object-contain"
									/>
									<span>VISA</span>
								</div>
							</SelectItem>
							<SelectItem value="MASTERCARD">
								<div className="flex items-center gap-2">
									<Image
										src="/images/mastercard-logo.jpg"
										alt="MasterCard logo"
										width={20}
										height={20}
										className="object-contain"
									/>
									<span>MASTERCARD</span>
								</div>
							</SelectItem>
								</SelectContent>
							</Select>
							{errors.brand && (
								<p className="text-red-500 text-sm mt-1">
									{errors.brand.message as any}
								</p>
							)}
						</div>

						{/* Initial Amount (same as AddCardModal) */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Initial Balance (USD)
							</label>
							<input
								type="number"
								{...register("amount", {
									required:
										"Please enter a valid amount" as any,
									min: {
										value: 1,
										message: "Amount must be at least 1",
									} as any,
									valueAsNumber: true,
								})}
								placeholder="0.00"
								min={2}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
							{errors.amount && (
								<p className="text-red-500 text-sm mt-1">
									{errors.amount.message as any}
								</p>
							)}
						</div>

						<div className="flex flex-col gap-3 pt-4">
							<CButton
								text={
									createMutation.isLoading
										? "Creating..."
										: "Create Card"
								}
								btnStyle={"blue"}
								type={"submit"}
								disabled={createMutation.isLoading}
								height={"40px"}
							/>
							<CButton
								text={"Cancel"}
								btnStyle={"outlineDark"}
								onClick={() => setIsOpen && setIsOpen(false)}
								disabled={createMutation.isLoading}
								height={"40px"}
							/>
						</div>
					</form>
					<div
						className={classNames(
							"transition-all invisible z-[1000] bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center",
							{
								"!opacity-100 !visible z-[1000]":
									createMutation.isLoading,
							}
						)}
					>
						<PuffLoader color="#fff" size={40} />
					</div>
				</div>
			}
		/>
	);
}
