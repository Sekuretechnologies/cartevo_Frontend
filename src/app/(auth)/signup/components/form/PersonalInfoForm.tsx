import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { personalInfoSchema } from "@/validation/FormValidation";
import { FaChevronRight, FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CButton from "@/components/shared/CButton";
import { AuthService } from "@/api/services/auth";
import { useMutation } from "react-query";
import { HashLoader, PuffLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/slices/auth";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import urls from "@/config/urls";
import urlsV2 from "@/config/urls_v2";
import { useState } from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { FaFileAlt } from "react-icons/fa";

const handlePersonalInfo = async (data: z.infer<typeof personalInfoSchema>) => {
	// This will be updated to handle personal info submission for company signup
	console.log("Personal info submitted:", data);
	// TODO: Replace with actual API call for signup
	return { success: true, data };
};

export default function PersonalInfoForm({
	goNextPage,
}: {
	goNextPage: () => void;
}) {
	const [passwordVisible, setPasswordVisible] = useState<boolean>();
	const [confirmPasswordVisible, setConfirmPasswordVisible] =
		useState<boolean>();
	const [frontPreview, setFrontPreview] = useState<string | null>(null);
	const [backPreview, setBackPreview] = useState<string | null>(null);
	const [proofPreview, setProofPreview] = useState<string | null>(null);

	const previousUrl = window.sessionStorage.getItem("previousUrl");
	const router = useRouter();
	const dispatch = useDispatch();
	const form = useForm<z.infer<typeof personalInfoSchema>>({
		resolver: zodResolver(personalInfoSchema),
		defaultValues: {
			company_name: "",
			first_name: "",
			last_name: "",
			role: "",
			phone_number: "",
			gender: "",
			nationality: "",
			id_document_type: "",
			id_number: "",
			id_document_front: new File([], ""),
			id_document_back: new File([], ""),
			country_of_residence: "",
			state: "",
			city: "",
			street: "",
			postal_code: "",
			proof_of_address: new File([], ""),
			email: "",
			password: "",
			confirm_password: "",
		},
	});

	const mutation = useMutation({
		mutationFn: handlePersonalInfo,
		onError: (err: any) => {
			console.error("Personal info submission error:", err.message);
			toast.error(err.message);
		},
		onSuccess: (data) => {
			console.log("Personal info submitted successfully:", data);
			toast.success(
				"Personal information saved! Proceeding to next step..."
			);
			goNextPage();
			// TODO: Navigate to company info form or next step
		},
	});

	const onSubmit = (data: any) => {
		goNextPage();
		// mutation.mutate(data);
	};
	const onError = (err: any) => {
		console.error("any", err);
	};

	// Helper for file preview
	const handleFileChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		setPreview: (url: string | null) => void,
		fieldOnChange: (value: File) => void
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
			// Create an empty File object when no file is selected
			fieldOnChange(new File([], ""));
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit, onError)}>
				<div className="space-y-[20px] w-full">
					{/* Form Title */}
					{/* <h2 className="text-2xl font-bold mb-8 text-app-secondary text-center">
						Personal Information
					</h2> */}

					{/* Company Block */}
					<div className="mb-8">
						<h3 className="text-lg font-semibold mb-4 text-app-secondary">
							Company Information
						</h3>
						<FormField
							control={form.control}
							name="company_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-md tracking-tight">
										Company Name{" "}
										<span className="text-red-500">*</span>
									</FormLabel>
									<FormControl>
										<Input
											className="px-6 w-full bg-app-lightgray"
											placeholder="Enter your company name"
											{...field}
										/>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
					</div>

					{/* Personal Block */}
					<div className="mb-8 space-y-[15px]">
						<h3 className="text-lg font-semibold mb-4 text-app-secondary">
							Personal Informations
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="first_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											First Name{" "}
											<span className="text-red-500">
												*
											</span>
											<span className="text-xs text-gray-500">
												(min. 5 characters)
											</span>
										</FormLabel>
										<FormControl>
											<Input
												className="px-6 w-full bg-app-lightgray"
												placeholder="Enter your first name"
												{...field}
											/>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="last_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											Last Name{" "}
											<span className="text-red-500">
												*
											</span>
											<span className="text-xs text-gray-500">
												(min. 5 characters)
											</span>
										</FormLabel>
										<FormControl>
											<Input
												className="px-6 w-full bg-app-lightgray"
												placeholder="Enter your last name"
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
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											Email Address{" "}
											<span className="text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<Input
												type="email"
												className="px-6 w-full bg-app-lightgray"
												placeholder="Enter your email"
												{...field}
											/>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="phone_number"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											Phone Number{" "}
											<span className="text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<Input
												type="tel"
												className="px-6 w-full bg-app-lightgray"
												placeholder="Enter your phone number"
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
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											Role in Company{" "}
											<span className="text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<Input
												className="px-6 w-full bg-app-lightgray"
												placeholder="e.g., CEO, Manager, etc."
												{...field}
											/>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="gender"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											Gender{" "}
											<span className="text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<Select
												{...field}
												placeholder="Select Gender"
												style={{
													width: "100%",
													// background: "#F4EFE3",
												}}
												className={`bg-app-lightgray text-gray-900 font-normal`}
												onChange={(value) =>
													field.onChange(value)
												}
												selectedKeys={
													field.value
														? [field.value]
														: []
												}
											>
												<SelectItem
													key="male"
													value="male"
												>
													Male
												</SelectItem>
												<SelectItem
													key="female"
													value="female"
												>
													Female
												</SelectItem>
												<SelectItem
													key="other"
													value="other"
												>
													Other
												</SelectItem>
											</Select>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="nationality"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											Nationality
										</FormLabel>
										<FormControl>
											<Input
												className="px-6 w-full bg-app-lightgray"
												placeholder="Enter your nationality"
												{...field}
											/>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="country_of_residence"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											Country of Residence
										</FormLabel>
										<FormControl>
											<Input
												className="px-6 w-full bg-app-lightgray"
												placeholder="Enter country of residence"
												{...field}
											/>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
						</div>
					</div>

					{/* Address Block */}
					<div className="mb-8 space-y-[15px]">
						<h3 className="text-lg font-semibold mb-4 text-app-secondary">
							Address Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<FormField
								control={form.control}
								name="state"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											State/Province
										</FormLabel>
										<FormControl>
											<Input
												className="px-6 w-full bg-app-lightgray"
												placeholder="Enter state/province"
												{...field}
											/>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="city"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											City
										</FormLabel>
										<FormControl>
											<Input
												className="px-6 w-full bg-app-lightgray"
												placeholder="Enter your city"
												{...field}
											/>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="postal_code"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											Postal Code
										</FormLabel>
										<FormControl>
											<Input
												className="px-6 w-full bg-app-lightgray"
												placeholder="Enter postal code"
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
							name="street"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-md tracking-tight">
										Street Address
									</FormLabel>
									<FormControl>
										<Input
											className="px-6 w-full bg-app-lightgray"
											placeholder="Enter your street address"
											{...field}
										/>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
					</div>

					{/* ID Document Block */}
					<div className="mb-8 space-y-[15px]">
						<h3 className="text-lg font-semibold mb-4 text-app-secondary">
							ID Document Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="id_document_type"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											ID Document Type
										</FormLabel>
										<FormControl>
											<Select
												{...field}
												placeholder="Select ID Type"
												style={{
													width: "100%",
													// background: "#F4EFE3",
												}}
												className={`bg-app-lightgray text-gray-900 font-normal`}
												onChange={(value) =>
													field.onChange(value)
												}
												selectedKeys={
													field.value
														? [field.value]
														: []
												}
											>
												<SelectItem
													key="passport"
													value="passport"
												>
													Passport
												</SelectItem>
												<SelectItem
													key="national_id"
													value="national_id"
												>
													National ID
												</SelectItem>
												<SelectItem
													key="driving_license"
													value="driving_license"
												>
													Driving License
												</SelectItem>
											</Select>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="id_number"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											ID Number
										</FormLabel>
										<FormControl>
											<Input
												className="px-6 w-full bg-app-lightgray"
												placeholder="Enter ID number"
												{...field}
											/>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
						</div>

						{/* File Upload Fields with Preview */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="id_document_front"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											ID Document (Front)
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
															setFrontPreview,
															field.onChange
														)
													}
												/>
											</FormControl>
											{/* Preview */}
											{frontPreview &&
												(frontPreview === "file" ? (
													<FaFileAlt className="text-3xl text-gray-400" />
												) : (
													<img
														src={frontPreview}
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
								name="id_document_back"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											ID Document (Back)
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
															setBackPreview,
															field.onChange
														)
													}
												/>
											</FormControl>
											{/* Preview */}
											{backPreview &&
												(backPreview === "file" ? (
													<FaFileAlt className="text-3xl text-gray-400" />
												) : (
													<img
														src={backPreview}
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
										Proof of Address
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

					{/* Security Block */}
					<div className="mb-8 space-y-[15px]">
						<h3 className="text-lg font-semibold mb-4 text-app-secondary">
							Security
						</h3>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-md font-[500] tracking-tight">
										Password
									</FormLabel>
									<FormControl className="relative">
										<div>
											<Input
												type={`${
													passwordVisible
														? "text"
														: "password"
												}`}
												className="px-6 w-full bg-app-lightgray"
												placeholder="Create a secure password"
												{...field}
											/>
											<div className="absolute text-gray-500 cursor-pointer right-[10px] top-[12px]">
												{passwordVisible ? (
													<FaEyeSlash
														onClick={() =>
															setPasswordVisible(
																false
															)
														}
													/>
												) : (
													<FaEye
														onClick={() =>
															setPasswordVisible(
																true
															)
														}
													/>
												)}
											</div>
										</div>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirm_password"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-md font-[500] tracking-tight">
										Confirm Password
									</FormLabel>
									<FormControl className="relative">
										<div>
											<Input
												type={
													confirmPasswordVisible
														? "text"
														: "password"
												}
												className="px-6 w-full bg-app-lightgray"
												placeholder="Re-enter your password"
												{...field}
											/>
											<div className="absolute text-gray-500 cursor-pointer right-[10px] top-[12px]">
												{confirmPasswordVisible ? (
													<FaEyeSlash
														onClick={() =>
															setConfirmPasswordVisible(
																false
															)
														}
													/>
												) : (
													<FaEye
														onClick={() =>
															setConfirmPasswordVisible(
																true
															)
														}
													/>
												)}
											</div>
										</div>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
					</div>
				</div>

				{/* <div className="text-right">
          <a href="#" className="inline-block w-[272px] text-md font-[400]">Mot de passe oublié ?</a>
        </div> */}
				{/* <Link href="#" className="text-gray-800 font-semibold text-righttext-md">Forgotten Password?</Link> */}
				<div className={`mt-[50px]`}>
					<CButton
						text={"Save & Continue"}
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
				{/* <Button type="submit" className="w-[272px] mt-[10vh] bg-[#18BC7A] hover:bg-[#FFDB5A] hover:text-[#18BC7A] rounded-full">Connexion</Button> */}
			</form>
		</Form>
	);
}
