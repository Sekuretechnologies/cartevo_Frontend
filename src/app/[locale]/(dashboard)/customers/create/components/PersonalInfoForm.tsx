import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { personalInfoSchema } from "@/validation/FormValidation";
import { CustomerService } from "@/api/services/cartevo-api/customer";
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
import { supportedCountries } from "@/constants/supported-countries";
import { ItemFlag } from "@/components/shared/ItemFlag";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";
import { useTranslation } from "@/hooks/useTranslation";
import { selectCurrentToken } from "@/redux/slices/auth";
import { getNextUIDatePickerValueStr, parseDateStr } from "@/utils/DateFormat";
import {
	generateRandomCode,
	getFileExtension,
	getIso2ByKey,
	getLabelByKey,
	getPhonePrefixByKey,
} from "@/utils/utils";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { DatePicker } from "@nextui-org/date-picker";
import { Select, SelectItem } from "@nextui-org/select";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaFileAlt } from "react-icons/fa";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";
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

interface CountryOption {
	key: string; // e.g. "US"
	label: string; // e.g. "United States of America"
	iso2: string; // same as key
	phonePrefix: string; // e.g. "+1"
}
const countryOptions: CountryOption[] = Object.entries(
	supportedCountries.data
).map(([alpha2, countryData]) => {
	return {
		key: alpha2,
		label: countryData.country_name,
		iso2: alpha2,
		phonePrefix: countryData.prefix,
	};
});

export default function PersonalInfoForm() {
	const { t } = useTranslation();
	const customersTranslation = t.customers.createCustomer;
	const currentToken: any = useSelector(selectCurrentToken);

	const [frontPreview, setFrontPreview] = useState<string | null>(null);
	const [backPreview, setBackPreview] = useState<string | null>(null);

	const previousUrl = window.sessionStorage.getItem("previousUrl");
	const router = useRouter();
	const dispatch = useDispatch();
	const { createLocalizedLink } = useLocalizedNavigation();
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
			router.push(createLocalizedLink("/customers"));
		},
	});

	// Disable scrolling when mutation is loading
	useEffect(() => {
		if (mutation.isLoading) {
			window.scrollTo({ top: 0, behavior: "smooth" });
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		// Cleanup on unmount
		return () => {
			document.body.style.overflow = "";
		};
	}, [mutation.isLoading]);

	const onSubmit = (data: any) => {
		// Scroll to top on form submit
		window.scrollTo({ top: 0, behavior: "smooth" });
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

	const maxDate = today(getLocalTimeZone()).subtract({ years: 18 });
	const minDate = today(getLocalTimeZone()).subtract({ years: 100 });

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
							{customersTranslation.personalInfo}
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="first_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											{customersTranslation.firstName}{" "}
											<span className="text-red-500">
												*
											</span>
											<span className="text-xs text-gray-500">
												{customersTranslation.min}
											</span>
										</FormLabel>
										<FormControl>
											<Input
												className="px-6 w-full bg-app-lightgray"
												placeholder={
													customersTranslation.lirstNamePlaceholder
												}
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
											{customersTranslation.lastName}{" "}
											<span className="text-red-500">
												*
											</span>
											<span className="text-xs text-gray-500">
												{customersTranslation.min}
											</span>
										</FormLabel>
										<FormControl>
											<Input
												className="px-6 w-full bg-app-lightgray"
												placeholder={
													customersTranslation.lastNamePlaceholder
												}
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
											{customersTranslation.email}{" "}
											<span className="text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<Input
												type="email"
												className="px-6 w-full bg-app-lightgray"
												placeholder={
													customersTranslation.emailPlaceholder
												}
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
											{customersTranslation.phone}{" "}
											<span className="text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<Input
												type="tel"
												className="px-6 w-full bg-app-lightgray"
												placeholder={
													customersTranslation.phonePlaceHolder
												}
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
											{customersTranslation.dateBirth}{" "}
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
													// Vérification renforcée : on s'assure que l'objet date et ses propriétés sont valides
													if (
														date &&
														date.year &&
														date.month &&
														date.day
													) {
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
													} else {
														// Pour tous les autres cas (null, date partielle), on efface la valeur
														form.setValue(
															"date_of_birth",
															""
														);
													}
												}}
												showMonthAndYearPickers
												minValue={minDate}
												maxValue={maxDate}
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
											{customersTranslation.country}
											<span className="text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<Select
												{...field}
												placeholder={
													customersTranslation.countryplaceholder
												}
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
															startContent={<ItemFlag iso2={item.iso2} size={5} />}
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
							{customersTranslation.personalAdress.title}
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<FormField
								control={form.control}
								name="state"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											{
												customersTranslation
													.personalAdress.state
											}
											<span className="text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<Input
												className="px-6 w-full bg-app-lightgray"
												placeholder={
													customersTranslation
														.personalAdress
														.statePlaceHolder
												}
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
											{
												customersTranslation
													.personalAdress.city
											}
											<span className="text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<Input
												className="px-6 w-full bg-app-lightgray"
												placeholder={
													customersTranslation
														.personalAdress
														.cityPlaceholder
												}
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
											{
												customersTranslation
													.personalAdress.postalCode
											}
											<span className="text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<Input
												className="px-6 w-full bg-app-lightgray"
												placeholder={
													customersTranslation
														.personalAdress
														.postalCodePlaceHolder
												}
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
										{
											customersTranslation.personalAdress
												.street
										}
										<span className="text-red-500">*</span>
									</FormLabel>
									<FormControl>
										<Input
											className="px-6 w-full bg-app-lightgray"
											placeholder={
												customersTranslation
													.personalAdress
													.streetPlaceholder
											}
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
							{customersTranslation.personalId.title}
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="id_document_type"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											{
												customersTranslation.personalId
													.idType
											}
											<span className="text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<Select
												{...field}
												placeholder={
													customersTranslation
														.personalId
														.idTypePlaceholder
												}
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
													key="PASSORT"
													value="PASSORT"
												>
													{
														customersTranslation
															.personalId.idItem
															.passport
													}
												</SelectItem>
												<SelectItem
													key="NIN"
													value="NIN"
												>
													{
														customersTranslation
															.personalId.idItem
															.NIN
													}
												</SelectItem>
												<SelectItem
													key="DRIVERS_LICENSE"
													value="DRIVERS_LICENSE"
												>
													{
														customersTranslation
															.personalId.idItem
															.driver
													}
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
											{
												customersTranslation.personalId
													.idNumber
											}
											<span className="text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<Input
												className="px-6 w-full bg-app-lightgray"
												placeholder={
													customersTranslation
														.personalId
														.idNumberPlaceholder
												}
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
											{
												customersTranslation.personalId
													.idFront
											}
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
											{
												customersTranslation.personalId
													.idBack
											}
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
