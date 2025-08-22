import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { businessInfoSchema } from "@/validation/FormValidation";
import CButton from "@/components/shared/CButton";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaFileAlt } from "react-icons/fa";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { PuffLoader } from "react-spinners";

declare global {
	interface Window {
		File: typeof File;
	}
}

export const businessInfoSchema = z.object({
	business_name: z.string().min(3, {
		message: "Le nom de l'entreprise doit contenir au moins 3 caractères",
	}),
	business_phone_number: z
		.string()
		.min(7, { message: "Numéro de téléphone invalide" })
		.regex(/^[\d+\-\s]+$/, { message: "Numéro de téléphone invalide" }),
	business_address: z
		.string()
		.min(5, { message: "L'adresse de l'entreprise est requise" }),
	business_type: z
		.string()
		.min(2, { message: "Le type d'entreprise est requis" }),
	country_of_operation: z
		.string()
		.min(2, { message: "Le pays d'opération est requis" }),
	tax_id_number: z
		.string()
		.min(3, { message: "Le numéro d'identification fiscale est requis" }),
	business_website: z
		.string()
		.url({ message: "Entrez une URL valide pour le site web" })
		.optional()
		.or(z.literal("")),
	business_description: z.string().min(10, {
		message: "La description doit contenir au moins 10 caractères",
	}),
	source_of_funds: z
		.string()
		.min(2, { message: "La source de fonds est requise" }),
	share_holding_document: z.instanceof(File).refine((file) => file.size > 0, {
		message: "Le document d'actionnariat est requis",
	}),
	incorporation_certificate: z
		.instanceof(File)
		.refine((file) => file.size > 0, {
			message: "Le certificat d'incorporation est requis",
		}),
	proof_of_address: z.instanceof(File).refine((file) => file.size > 0, {
		message: "Le justificatif de domicile est requis",
	}),
	// memart: z.instanceof(File).refine((file) => file.size > 0, {
	// 	message: "Le MEMART est requis",
	// }),
});

const handleCompanyInfo = async (data: z.infer<typeof businessInfoSchema>) => {
	// This will be updated to handle company info submission for company signup
	console.log("Company info submitted:", data);
	// TODO: Replace with actual API call for signup
	return { success: true, data };
};

export default function CompanyInfoForm() {
	const router = useRouter();
	const dispatch = useDispatch();
	const form = useForm<z.infer<typeof businessInfoSchema>>({
		resolver: zodResolver(businessInfoSchema),
		defaultValues: {
			business_name: "",
			business_phone_number: "",
			business_address: "",
			business_type: "",
			country_of_operation: "",
			tax_id_number: "",
			business_website: "",
			business_description: "",
			source_of_funds: "",
			share_holding_document: undefined,
			incorporation_certificate: undefined,
			proof_of_address: undefined,
			// memart: undefined,
		},
	});

	const mutation = useMutation({
		mutationFn: handleCompanyInfo,
		onError: (err: any) => {
			console.error("Company info submission error:", err.message);
			toast.error(err.message);
		},
		onSuccess: (data) => {
			console.log("Company info submitted successfully:", data);
			toast.success("Company information saved! Registration completed.");
			// TODO: Navigate to verification or dashboard
		},
	});

	const onSubmit = (data: any) => {
		mutation.mutate(data);
	};
	const onError = (err: any) => {
		console.error("Form validation error:", err);
	};

	// State for file previews
	const [incorpPreview, setIncorpPreview] = useState<string | null>(null);
	const [shareDocPreview, setShareDocPreview] = useState<string | null>(null);
	const [proofPreview, setProofPreview] = useState<string | null>(null);

	// Helper to handle file preview
	const handleFileChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		setPreview: (url: string | null) => void,
		fieldOnChange: (value: any) => void
	) => {
		const file = e.target.files?.[0];
		if (file) {
			fieldOnChange(file);
			if (file.type.startsWith("image/")) {
				const reader = new FileReader();
				reader.onload = (ev) => setPreview(ev.target?.result as string);
				reader.readAsDataURL(file);
			} else {
				setPreview("file");
			}
		} else {
			setPreview(null);
			fieldOnChange(undefined);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit, onError)}>
				{/* Form Title */}
				{/* <h2 className="text-2xl font-bold mb-8 text-app-secondary text-center">
					Company Registration Informations
				</h2> */}
				<div className="space-y-[20px] w-full">
					{/* Block 1: Basic Business Information */}
					<div>
						<h3 className="text-lg font-semibold mb-4 text-app-secondary">
							Basic Business Informations
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="business_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											Business Name{" "}
											<span className="text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<Input
												className="px-6 w-full bg-app-lightgray"
												placeholder="Enter your business name"
												{...field}
											/>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="business_phone_number"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											Business Phone Number{" "}
											<span className="text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<Input
												type="tel"
												className="px-6 w-full bg-app-lightgray"
												placeholder="Enter business phone number"
												{...field}
											/>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="business_address"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-md tracking-tight">
										Business Address{" "}
										<span className="text-red-500">*</span>
									</FormLabel>
									<FormControl>
										<Input
											className="px-6 w-full bg-app-lightgray"
											placeholder="Enter your business address"
											{...field}
										/>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
					</div>
					{/* Block 2: Business Details */}
					<div>
						<h3 className="text-lg font-semibold mb-4 text-app-secondary">
							Business Details
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="business_type"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											Business Type
										</FormLabel>
										<FormControl>
											<select
												className="px-6 py-3 w-full bg-app-lightgray border border-gray-200 rounded-md"
												{...field}
											>
												<option value="">
													Select Business Type
												</option>
												<option value="corporation">
													Corporation
												</option>
												<option value="llc">LLC</option>
												<option value="partnership">
													Partnership
												</option>
												<option value="sole_proprietorship">
													Sole Proprietorship
												</option>
												<option value="nonprofit">
													Nonprofit
												</option>
												<option value="other">
													Other
												</option>
											</select>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="country_of_operation"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											Country of Operation
										</FormLabel>
										<FormControl>
											<Input
												className="px-6 w-full bg-app-lightgray"
												placeholder="Enter country of operation"
												{...field}
											/>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="tax_id_number"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											Tax ID Number
										</FormLabel>
										<FormControl>
											<Input
												className="px-6 w-full bg-app-lightgray"
												placeholder="Enter tax ID number"
												{...field}
											/>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="business_website"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											Business Website
										</FormLabel>
										<FormControl>
											<Input
												type="url"
												className="px-6 w-full bg-app-lightgray"
												placeholder="https://www.example.com"
												{...field}
											/>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="business_description"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-md tracking-tight">
										Business Description
									</FormLabel>
									<FormControl>
										<textarea
											className="px-6 py-3 w-full bg-app-lightgray border border-gray-200 rounded-md resize-none"
											rows={4}
											placeholder="Describe your business activities and services"
											{...field}
										/>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="source_of_funds"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-md tracking-tight">
										Source of Funds
									</FormLabel>
									<FormControl>
										<select
											className="px-6 py-3 w-full bg-app-lightgray border border-gray-200 rounded-md"
											{...field}
										>
											<option value="">
												Select Source of Funds
											</option>
											<option value="business_revenue">
												Business Revenue
											</option>
											<option value="investment">
												Investment
											</option>
											<option value="loan">
												Business Loan
											</option>
											<option value="inheritance">
												Inheritance
											</option>
											<option value="savings">
												Personal Savings
											</option>
											<option value="other">Other</option>
										</select>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>

						{/* <FormField
							control={form.control}
							name="memart"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-md tracking-tight">
										MEMART
									</FormLabel>
									<FormControl>
										<Input
											type="file"
											accept="image/*,.pdf"
											className="px-6 w-full bg-app-lightgray"
											placeholder="Upload MEMART document"
											value={field.value?.name || ""}
											readOnly
										/>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/> */}
					</div>

					{/* Block 3: Document Upload Section */}
					<div>
						<h3 className="text-lg font-semibold mb-4 text-app-secondary">
							Required Documents
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="incorporation_certificate"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											Incorporation Certificate
										</FormLabel>
										<div className="flex items-center gap-4">
											<FormControl>
												<Input
													type="file"
													className="px-6 w-full bg-app-lightgray"
													accept="image/*,.pdf"
													onChange={(e) =>
														handleFileChange(
															e,
															setIncorpPreview,
															field.onChange
														)
													}
												/>
											</FormControl>
											{/* Preview */}
											{incorpPreview &&
												(incorpPreview === "file" ? (
													<FaFileAlt className="text-3xl text-gray-400" />
												) : (
													<img
														src={incorpPreview}
														alt="preview"
														className="w-12 h-12 object-cover rounded border"
													/>
												))}
										</div>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="share_holding_document"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											Share Holding Document
										</FormLabel>
										<div className="flex items-center gap-4">
											<FormControl>
												<Input
													type="file"
													className="px-6 w-full bg-app-lightgray"
													accept="image/*,.pdf"
													onChange={(e) =>
														handleFileChange(
															e,
															setShareDocPreview,
															field.onChange
														)
													}
												/>
											</FormControl>
											{/* Preview */}
											{shareDocPreview &&
												(shareDocPreview === "file" ? (
													<FaFileAlt className="text-3xl text-gray-400" />
												) : (
													<img
														src={shareDocPreview}
														alt="preview"
														className="w-12 h-12 object-cover rounded border"
													/>
												))}
										</div>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="proof_of_address"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-md tracking-tight">
										Business Proof of Address
									</FormLabel>
									<div className="flex items-center gap-4">
										<FormControl>
											<Input
												type="file"
												className="px-6 w-full bg-app-lightgray"
												accept="image/*,.pdf"
												onChange={(e) =>
													handleFileChange(
														e,
														setProofPreview,
														field.onChange
													)
												}
											/>
										</FormControl>
										{/* Preview */}
										{proofPreview &&
											(proofPreview === "file" ? (
												<FaFileAlt className="text-3xl text-gray-400" />
											) : (
												<img
													src={proofPreview}
													alt="preview"
													className="w-12 h-12 object-cover rounded border"
												/>
											))}
									</div>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className={`mt-[50px]`}>
					<CButton
						text={"Complete Registration"}
						btnStyle={"blue"}
						type={"submit"}
						width={"250px"}
						height={"40px"}
					/>
				</div>

				<div
					className={classNames(
						"transition-all invisible z-[1000] bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center",
						{
							"!opacity-100 !visible z-[1000]":
								mutation.isLoading,
						}
					)}
				>
					<PuffLoader
						className="shrink-0"
						size={50}
						color="#1F66FF"
					/>
				</div>
			</form>
		</Form>
	);
}
