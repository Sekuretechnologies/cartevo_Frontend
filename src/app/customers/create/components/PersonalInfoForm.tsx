import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { personalInfoSchema } from "@/validation/FormValidation";
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
	getIso2ByKey,
	getLabelByKey,
	getPhonePrefixByKey,
} from "@/utils/utils";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { getCountryCallingCode } from "libphonenumber-js";
import { CustomerService } from "@/api/services/cartevo-api/customer";
import { DatePicker } from "@nextui-org/date-picker";
import { getNextUIDatePickerValueStr, parseDateStr } from "@/utils/DateFormat";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
// declare global {
// 	interface Window {
// 		FileList: typeof FileList;
// 	}
// }

const MAX_FILE_SIZE = 1024 * 1024 * 1; // 1MB in bytes

export const customerInfoSchema = z.object({
	first_name: z.string().min(2, {
		message: "First name must be at least 2 characters long",
	}),
	last_name: z.string().min(2, {
		message: "Last name must be at least 2 characters long",
	}),
	date_of_birth: z.string().min(2, { message: "Date of birth is required" }),
	country: z.string().min(2, { message: "Country is required" }),
	email: z
		.string({ message: "Please enter a valid email" })
		.email({ message: "Please enter a valid email" }),
	street: z.string().min(2, { message: "Street address is required" }),
	state: z.string().min(2, { message: "State/Region is required" }),
	city: z.string().min(2, { message: "City is required" }),
	postal_code: z.string().min(2, { message: "Postal code is required" }),
	country_iso_code: z
		.string()
		.min(2, { message: "Country ISO code is required" }),
	country_phone_code: z
		.string()
		.min(2, { message: "Country phone code is required" }),
	phone_number: z
		.string()
		.min(7, { message: "Invalid phone number" })
		.regex(/^[\d+\-\s]+$/, { message: "Invalid phone number" }),

	id_document_type: z.string().min(2, {
		message: "Document type is required",
	}),
	identification_number: z
		.string()
		.min(3, { message: "Document number is required" }),
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
});

const handlePersonalInfo = async (
	token: string,
	data: z.infer<typeof customerInfoSchema>
) => {
	console.log("handlePersonalInfo accessToken :: ", token);
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

	//-------------------------------------------------------
	const response = await CustomerService.create_customer({
		token: token || "",
		data: formData,
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
// Register English locale for country names
countries.registerLocale(enLocale);
// Generate list of country codes and names
const countryNames = countries.getNames("en", { select: "official" });
// const countryOptions = Object.entries(countryNames).map(([code, name]) => ({
// 	key: code,
// 	label: name,
// }));

interface CountryOption {
	key: string; // e.g. "US"
	label: string; // e.g. "United States of America"
	iso2: string; // same as key
	phonePrefix: string; // e.g. "+1"
}
const countryOptions: CountryOption[] = Object.entries(countryNames).map(
	([alpha2, label]) => {
		let phonePrefix: string;
		try {
			phonePrefix = `${getCountryCallingCode(alpha2 as any)}`;
		} catch {
			phonePrefix = "";
		}
		return {
			key: alpha2,
			label,
			iso2: alpha2,
			phonePrefix,
		};
	}
);

export default function PersonalInfoForm() {
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
	const form = useForm<z.infer<typeof customerInfoSchema>>({
		resolver: zodResolver(customerInfoSchema),
		defaultValues: {
			first_name: "",
			last_name: "",
			phone_number: "",
			country: "",
			country_iso_code: "",
			country_phone_code: "",
			id_document_type: "",
			identification_number: "",
			id_document_front: undefined,
			id_document_back: undefined,
			state: "",
			city: "",
			street: "",
			postal_code: "",
			email: "",
			date_of_birth: "",
		},
	});

	const mutation = useMutation({
		mutationFn: (data: z.infer<typeof customerInfoSchema>) =>
			handlePersonalInfo(currentToken, data),
		onError: (err: any) => {
			console.error("Personal info submission error:", err.message);
			toast.error(err.message);
		},
		onSuccess: (data: any) => {
			console.log("Personal info submitted successfully:", data);
			router.push("/customers");
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
		fieldName: "country",
		itemList: any[],
		data: any
	) => {
		const value: string = data.target.value;
		console.log(fieldName, value, getLabelByKey(value, itemList));
		form.setValue(fieldName, String(getLabelByKey(value, itemList) || ""));
		form.setValue(
			"country_iso_code",
			String(getIso2ByKey(value, itemList) || "")
		);
		form.setValue(
			"country_phone_code",
			String(getPhonePrefixByKey(value, itemList) || "")
		);
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
							<FormField
								control={form.control}
								name="date_of_birth"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											Date of birth{" "}
											<span className="text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<DatePicker
												className={`text-gray-900 font-normal`}
												defaultValue={
													field.value
														? parseDate(
																parseDateStr(
																	field.value
																)
														  )
														: null
												}
												onChange={(date) => {
													const newDateStr =
														getNextUIDatePickerValueStr(
															date.year,
															date.month,
															date.day
														);
													form.setValue(
														"date_of_birth",
														newDateStr
													);
												}}
												showMonthAndYearPickers
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
								name="country"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											Country
											<span className="text-red-500">
												*
											</span>
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
														"country",
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
											{/* <Input
												className="px-6 w-full bg-app-lightgray"
												placeholder="Enter your nationality"
												{...field}
											/> */}
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
											<span className="text-red-500">
												*
											</span>
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
											<span className="text-red-500">
												*
											</span>
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
											<span className="text-red-500">
												*
											</span>
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
										<span className="text-red-500">*</span>
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
											<span className="text-red-500">
												*
											</span>
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
								name="identification_number"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											National ID Number
											<span className="text-red-500">
												*
											</span>
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
											<span className="text-red-500">
												*
											</span>
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
											<span className="text-red-500">
												*
											</span>
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
