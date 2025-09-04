import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { completeKycSchema } from "@/validation/FormValidation";
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
import { Select, SelectItem } from "@nextui-org/select";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaFileAlt } from "react-icons/fa";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";
import { AuthService } from "@/api/services/cartevo-api/auth";
import { selectCurrentToken, setCredentials } from "@/redux/slices/auth";
import {
	generateRandomCode,
	getFileExtension,
	getLabelByKey,
} from "@/utils/utils";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { CompanyService } from "@/api/services/cartevo-api/company";

// declare global {
// 	interface Window {
// 		FileList: typeof FileList;
// 	}
// }

//* role_in_company: kycData.role_in_company,
//* phone_number: kycData.phone_number,
//* gender: kycData.gender,
//* nationality: kycData.nationality,
// address: kycData.address,

//* id_document_type: kycData.id_document_type,
//* id_number: kycData.id_number,
//* id_document_front: idDocumentFrontUrl,
//* id_document_back: idDocumentBackUrl,
//* proof_of_address: proofOfAddressUrl,
//* country_of_residence: kycData.country_of_residence,
//* state: kycData.state,
//* city: kycData.city,
//* street: kycData.street,
//* postal_code: kycData.postal_code,

const MAX_FILE_SIZE = 1024 * 1024 * 1; // 1MB in bytes

export const completeKycSchema = z.object({
	role_in_company: z.string().min(2, { message: "Role is required" }),
	phone_number: z
		.string()
		.min(7, { message: "Invalid phone number" })
		.regex(/^[\d+\-\s]+$/, { message: "Invalid phone number" }),
	gender: z.string().min(1, { message: "Gender is required" }),
	nationality: z.string().min(2, { message: "Nationality is required" }),
	id_document_type: z.string().min(2, {
		message: "Document type is required",
	}),
	id_number: z.string().min(3, { message: "Document number is required" }),
	id_document_front: z
		.instanceof(File)
		.refine((file) => file?.size > 0 && file?.name !== "", {
			message: "Front side of the document is required",
		})
		.refine((file) => file?.size <= MAX_FILE_SIZE, {
			message: "Document must not exceed 1MB",
		}),
	id_document_back: z
		.instanceof(File)
		.refine((file) => file?.size > 0 && file?.name !== "", {
			message: "Back side of the document is required",
		})
		.refine((file) => file?.size <= MAX_FILE_SIZE, {
			message: "Document must not exceed 1MB",
		}),
	country_of_residence: z
		.string()
		.min(2, { message: "Country of residence is required" }),
	state: z.string().min(2, { message: "State/Region is required" }),
	city: z.string().min(2, { message: "City is required" }),
	street: z.string().min(2, { message: "Street address is required" }),
	postal_code: z.string().min(2, { message: "Postal code is required" }),
	proof_of_address: z
		.instanceof(File)
		.refine((file) => file?.size > 0 && file?.name !== "", {
			message: "Proof of address is required",
		})
		.refine((file) => file?.size <= MAX_FILE_SIZE, {
			message: "Document must not exceed 1MB",
		}),
	email: z
		.string({ message: "Please enter a valid email" })
		.email({ message: "Please enter a valid email" }),
});

// const handlePersonalInfo = async (data: z.infer<typeof completeKycSchema>) => {
// 	// This will be updated to handle personal info submission for company signup
// 	console.log("Personal info submitted:", data);
// 	// TODO: Replace with actual API call for signup
// 	return { success: true, data };
// };
const handleCompleteKyc = async (
	token: string,
	data: z.infer<typeof completeKycSchema>
) => {
	//-------------------------------------------------------
	const formData = new FormData();
	Object.entries(data || {})?.map(([key, value]: any[]) => {
		// console.log({ key }, { value });
		if (
			![
				"id_document_front",
				"id_document_back",
				"proof_of_address",
			]?.includes(key)
		) {
			formData.append(`${key}`, value || "");
		}
	});

	const id_document_front = {
		file: data.id_document_front,
		name: generateRandomCode(32),
		extension: getFileExtension(data.id_document_front?.name),
	};
	const id_document_back = {
		file: data.id_document_back,
		name: generateRandomCode(32),
		extension: getFileExtension(data.id_document_back?.name),
	};
	const proof_of_address = {
		file: data.proof_of_address,
		name: generateRandomCode(32),
		extension: getFileExtension(data.proof_of_address?.name),
	};

	formData.append(
		"id_document_front",
		id_document_front.file,
		`${id_document_front.name}.${id_document_front.extension}`
	);
	formData.append(
		"id_document_back",
		id_document_back.file,
		`${id_document_back.name}.${id_document_back.extension}`
	);
	formData.append(
		"proof_of_address",
		proof_of_address.file,
		`${proof_of_address.name}.${proof_of_address.extension}`
	);
	//-------------------------------------------------------
	const response = await CompanyService.completeKyc({
		token,
		body: formData,
	});
	if (!response.ok) {
		const responseBody = await response.json();
		if (response.status === 401) {
			throw new Error(responseBody.message);
		} else {
			throw new Error("Error. Couldn't Register Personal Informations.");
		}
	}
	const responseJson = await response.json();
	return responseJson;
};

// Static array of company roles
const roles = [
	// { key: "Owner", label: "Owner" },
	{ key: "Administrator", label: "Administrator" },
	{ key: "Developer", label: "Developer" },
	{ key: "Manager", label: "Manager" },
	{ key: "Officer", label: "Officer" },
];
const genderData = [
	{
		key: "male",
		label: "Male",
	},
	{
		key: "female",
		label: "Female",
	},
	{
		key: "other",
		label: "Other",
	},
];
const documentTypeData = [
	{
		key: "NIN",
		label: "National ID",
	},
	{
		key: "PASSPORT",
		label: "Passport",
	},
	{
		key: "DRIVERS_LICENSE",
		label: "Drivers License",
	},
];
// Register English locale for country names
countries.registerLocale(enLocale);
// Generate list of country codes and names
const countryNames = countries.getNames("en", { select: "official" });
const countryOptions = Object.entries(countryNames).map(([code, name]) => ({
	key: code,
	label: name,
}));

export default function ProfileCompletionForm() {
	const currentToken: any = useSelector(selectCurrentToken);
	const [passwordVisible, setPasswordVisible] = useState<boolean>();
	const [confirmPasswordVisible, setConfirmPasswordVisible] =
		useState<boolean>();
	const [frontPreview, setFrontPreview] = useState<string | null>(null);
	const [backPreview, setBackPreview] = useState<string | null>(null);
	const [proofPreview, setProofPreview] = useState<string | null>(null);

	const previousUrl = window.sessionStorage.getItem("previousUrl");
	const router = useRouter();
	const dispatch = useDispatch();
	const form = useForm<z.infer<typeof completeKycSchema>>({
		resolver: zodResolver(completeKycSchema),
		defaultValues: {
			role_in_company: "",
			phone_number: "",
			gender: "",
			nationality: "",
			id_document_type: "",
			id_number: "",
			id_document_front: undefined,
			id_document_back: undefined,
			country_of_residence: "",
			state: "",
			city: "",
			street: "",
			postal_code: "",
			proof_of_address: undefined,
			email: "",
		},
	});

	const mutation = useMutation({
		mutationFn: (data: z.infer<typeof completeKycSchema>) =>
			handleCompleteKyc(currentToken, data),
		onError: (err: any) => {
			console.error("Personal info submission error:", err.message);
			toast.error(err.message);
		},
		onSuccess: (data: any) => {
			console.log("Personal info submitted successfully:", data);
			toast.success(
				"Personal information saved! Proceeding to next step..."
			);
			router.push("/onboarding");
		},
	});

	const onSubmit = (data: any) => {
		mutation.mutate(data);
	};
	const onError = (err: any) => {
		console.error("any", err);
	};

	// const handleRoleChange = (data: any) => {
	// 	const value: string = data.target.value;
	// 	console.log("role", value, getLabelByKey(value, roles));
	// 	form.setValue("role", String(getLabelByKey(value, roles) || ""));
	// };
	const handleFieldChange = (
		fieldName:
			| "id_document_type"
			| "role_in_company"
			| "gender"
			| "nationality"
			| "country_of_residence",
		itemList: any[],
		data: any
	) => {
		const value: string = data.target.value;
		console.log(fieldName, value, getLabelByKey(value, itemList));
		form.setValue(fieldName, String(getLabelByKey(value, itemList) || ""));
	};

	// Helper for file preview
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
			// Create an empty File object when no file is selected
			fieldOnChange(undefined);
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

					{/* Personal Block */}
					<div className="mb-8 space-y-[15px]">
						<h3 className="text-lg font-semibold mb-4 text-app-secondary">
							Personal Informations
						</h3>
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
								name="role_in_company"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											Role in Company{" "}
											<span className="text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<Select
												{...field}
												placeholder="Select Role"
												style={{
													width: "100%",
												}}
												className={`bg-app-lightgray text-gray-900 font-normal`}
												defaultSelectedKeys={[
													field.value ?? "",
												]}
												onChange={(data) =>
													handleFieldChange(
														"role_in_company",
														roles,
														data
													)
												}
											>
												{roles.map((item, idx) => (
													<SelectItem
														key={item.key}
														value={item.key}
													>
														{item.label}
													</SelectItem>
												))}
											</Select>
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
												}}
												className={`bg-app-lightgray text-gray-900 font-normal`}
												defaultSelectedKeys={[
													field.value ?? "",
												]}
												onChange={(data) =>
													handleFieldChange(
														"gender",
														genderData,
														data
													)
												}
											>
												{genderData.map((item, idx) => (
													<SelectItem
														key={item.key}
														value={item.key}
													>
														{item.label}
													</SelectItem>
												))}
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
											<Select
												{...field}
												placeholder="Select Nationality"
												style={{
													width: "100%",
												}}
												className={`bg-app-lightgray text-gray-900 font-normal`}
												defaultSelectedKeys={[
													field.value ?? "",
												]}
												onChange={(data) =>
													handleFieldChange(
														"nationality",
														countryOptions,
														data
													)
												}
											>
												{countryOptions.map(
													(item, idx) => (
														<SelectItem
															key={item.key}
															value={item.key}
														>
															{item.label}
														</SelectItem>
													)
												)}
											</Select>
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
											<Select
												{...field}
												placeholder="Select Country of Residence"
												style={{
													width: "100%",
												}}
												className={`bg-app-lightgray text-gray-900 font-normal`}
												defaultSelectedKeys={[
													field.value ?? "",
												]}
												onChange={(data) =>
													handleFieldChange(
														"country_of_residence",
														countryOptions,
														data
													)
												}
											>
												{countryOptions.map(
													(item, idx) => (
														<SelectItem
															key={item.key}
															value={item.key}
														>
															{item.label}
														</SelectItem>
													)
												)}
											</Select>
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
							Personal Address Informations
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
							Personal ID Document Informations
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
												placeholder="Select Gender"
												style={{
													width: "100%",
												}}
												className={`bg-app-lightgray text-gray-900 font-normal`}
												defaultSelectedKeys={[
													field.value ?? "",
												]}
												onChange={(data) =>
													handleFieldChange(
														"id_document_type",
														documentTypeData,
														data
													)
												}
											>
												{documentTypeData.map(
													(item, idx) => (
														<SelectItem
															key={item.key}
															value={item.key}
														>
															{item.label}
														</SelectItem>
													)
												)}
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
													accept="image/jpeg, image/jpg, image/png, .pdf"
													onChange={(e) =>
														handleFileChange(
															e,
															setFrontPreview,
															field.onChange
														)
													}
												/>
											</FormControl>

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
													accept="image/jpeg, image/jpg, image/png, .pdf"
													onChange={(e) =>
														handleFileChange(
															e,
															setBackPreview,
															field.onChange
														)
													}
												/>
											</FormControl>

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
												accept="image/jpeg, image/jpg, image/png, .pdf"
												onChange={(e) =>
													handleFileChange(
														e,
														setProofPreview,
														field.onChange
													)
												}
											/>
										</FormControl>
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

				{/* <div className="text-right">
          <a href="#" className="inline-block w-[272px] text-md font-[400]">Mot de passe oublié ?</a>
        </div> */}
				{/* <Link href="#" className="text-gray-800 font-semibold text-righttext-md">Forgotten Password?</Link> */}
				<div className={`mt-[50px]`}>
					<CButton
						text={"Save"}
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
