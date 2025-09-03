import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CButton from "@/components/shared/CButton";
import Checkbox from "@/components/shared/Checkbox";
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
import { useDispatch } from "react-redux";
import { PuffLoader } from "react-spinners";
import { AuthService } from "@/api/services/cartevo-api/auth";
import { setCredentials } from "@/redux/slices/auth";
import {
	generateRandomCode,
	getCountryPhonePrefix,
	getCurrenciesByKey,
	getFileExtension,
	getLabelByKey,
} from "@/utils/utils";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
// import { getCountryCallingCode } from "libphonenumber-js";
import { countries as countryDataList } from "country-data";
import { countryCurrencies } from "@/constants/countryCurrenciesData";
import { ItemFlag } from "@/components/shared/ItemFlag";

// declare global {
// 	interface Window {
// 		FileList: typeof FileList;
// 	}
// }

const MAX_FILE_SIZE = 1024 * 1024 * 1; // 1MB in bytes

export const createAccountSchema = z
	.object({
		business_name: z.string().min(3, {
			message: "Business name must be at least 3 characters long",
		}),
		first_name: z.string().min(2, {
			message: "First name must be at least 2 characters long",
		}),
		last_name: z.string().min(2, {
			message: "Last name must be at least 2 characters long",
		}),
		business_email: z
			.string({ message: "Please enter a valid email" })
			.email({ message: "Please enter a valid email" }),
		phone_number: z
			.string()
			.min(7, { message: "Invalid phone number" })
			.regex(/^[\d+\-\s]+$/, { message: "Invalid phone number" }),

		business_type: z.string().min(2, {
			message: "Business type is required",
		}),
		business_country: z.string().min(2, { message: "Country is required" }),
		business_country_iso_code: z
			.string()
			.min(2, { message: "Country ISO code is required" }),
		business_country_phone_code: z
			.string()
			.min(2, { message: "Country phone code is required" }),
		business_country_currency: z
			.string()
			.min(2, { message: "Country currency is required" }),
		password: z.string({ message: "Please enter a password" }).min(8, {
			message: "Password must be at least 8 characters long",
		}),
		confirm_password: z.string({ message: "Please confirm the password" }),
	})
	.refine((data) => data.password === data.confirm_password, {
		message: "Passwords do not match",
		path: ["confirm_password"],
	});

const handleCreateAccount = async (
	data: z.infer<typeof createAccountSchema>
) => {
	const response = await AuthService.createAccount(data);
	if (!response.ok) {
		const responseBody = await response.json();
		if (response.status === 401) {
			throw new Error(responseBody.message);
		} else {
			throw new Error("Error. Couldn't create account.");
		}
	}
	const responseJson = await response.json();
	return responseJson;
};

const businessTypeData = [
	{
		key: "ecommerce",
		label: "E-Commerce",
	},
	{
		key: "fcmg",
		label: "Fast-Moving Consumer Goods",
	},
	{
		key: "fintech",
		label: "Fintech",
	},
	{
		key: "logistics",
		label: "Logistics and Mobility",
	},
	{
		key: "travel",
		label: "Travel and Mobility",
	},
	{
		key: "global_business",
		label: "Global Business",
	},
	{
		key: "retail",
		label: "Retail Outlet",
	},
	{
		key: "money_transfer",
		label: "Money Transfer",
	},
	{
		key: "remittance",
		label: "Remittance",
	},
	{
		key: "high_risk_business",
		label: "High risk business (Betting, Gaming, Forex, ...)",
	},
	{
		key: "other",
		label: "Other",
	},
];
// 1) Register English locale for country names
countries.registerLocale(enLocale);
// 2) get all 2-letter names
const countryNames = countries.getNames("en", { select: "official" });
interface CountryOption {
	key: string; // "US"
	label: string; // "United States of America"
}
const countryOptions: CountryOption[] = Object.entries(countryNames).map(
	([alpha2, label]) => {
		return {
			key: alpha2,
			label,
		};
	}
);

export default function CreateAccountForm() {
	const [passwordVisible, setPasswordVisible] = useState<boolean>();
	const [confirmPasswordVisible, setConfirmPasswordVisible] =
		useState<boolean>();
	const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
	const router = useRouter();
	const dispatch = useDispatch();
	const form = useForm<z.infer<typeof createAccountSchema>>({
		resolver: zodResolver(createAccountSchema),
		defaultValues: {
			business_name: "",
			first_name: "",
			last_name: "",
			business_email: "",
			phone_number: "",
			business_type: "",
			business_country: "",
			business_country_iso_code: "",
			business_country_phone_code: "",
			business_country_currency: "",
			password: "",
			confirm_password: "",
		},
	});

	const mutation = useMutation({
		mutationFn: handleCreateAccount,
		onError: (err: any) => {
			console.error("Personal info submission error:", err.message);
			toast.error(err.message);
		},
		onSuccess: (data: any) => {
			console.log("Personal info submitted successfully:", data);
			if (data.success) {
				const token = "";
				const user = {
					id: data.user_id,
					name: data.user_name,
					email: data.user_email,
				};
				const company = {
					id: data.company_id,
					name: data.company_name,
				};
				dispatch(setCredentials({ token, company, user }));
				toast.success(
					"Personal information saved! Proceeding to next step..."
				);
			} else {
				const token = "";
				const user = {};
				const company = {
					id: data.company_id,
					name: data.company_name,
				};
				dispatch(setCredentials({ token, company, user }));
				toast("User already exists! Proceeding to next step...");
			}

			// goNextPage();
			// router.push("/signup?step=2");
			router.push("/login");
		},
	});

	const onSubmit = (data: any) => {
		if (!acceptTerms) {
			toast.error("Please accept the terms and conditions to continue");
			return;
		}

		console.log("Submit data : ", data);
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
		fieldName: "business_type" | "business_country",
		itemList: any[],
		data: any
	) => {
		const value: string = data.target?.value || data;

		if (fieldName === "business_country") {
			// Find the selected country data
			const selectedCountry = itemList.find(
				(country: any) => country.iso2 === value
			);

			if (selectedCountry) {
				form.setValue(fieldName, selectedCountry.country);
				form.setValue(
					"business_country_iso_code",
					selectedCountry.iso2
				);

				// Get phone code from country-data library
				const countryPhoneCode = getCountryPhonePrefix(
					(countryDataList as any)[selectedCountry.iso2]
						?.countryCallingCodes || []
				);
				const countryCurrency = selectedCountry.currency;

				form.setValue(
					"business_country_phone_code",
					countryPhoneCode || "237"
				);
				form.setValue("business_country_currency", countryCurrency);
			}
		} else {
			form.setValue(
				fieldName,
				String(getLabelByKey(value, itemList) || "")
			);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit, onError)}>
				<div className="space-y-[20px] w-full">
					{/* Company Block */}
					<div className="mb-8">
						<FormField
							control={form.control}
							name="business_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-md tracking-tight">
										Business Name{" "}
										<span className="text-red-500">*</span>
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
					</div>

					{/* Personal Block */}
					<div className="mb-8 space-y-[15px]">
						{/* <h3 className="text-lg font-semibold mb-4 text-app-secondary">
							Personal Informations
						</h3> */}
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
								name="business_email"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											Business email{" "}
											<span className="text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<Input
												type="email"
												className="px-6 w-full bg-app-lightgray"
												placeholder="Enter your business email"
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
								name="business_type"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											Business type{" "}
											<span className="text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<Select
												{...field}
												placeholder="Select business type"
												style={{
													width: "100%",
												}}
												className={`bg-app-lightgray text-gray-900 font-normal`}
												defaultSelectedKeys={[
													field.value ?? "",
												]}
												onChange={(data) =>
													handleFieldChange(
														"business_type",
														businessTypeData,
														data
													)
												}
											>
												{businessTypeData.map(
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
								name="business_country"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-md tracking-tight">
											Business country
											<span className="text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											{/* <Select
												{...field}
												placeholder="Select business country"
												style={{
													width: "100%",
												}}
												className={`bg-app-lightgray text-gray-900 font-normal`}
												defaultSelectedKeys={[
													field.value ?? "",
												]}
												onChange={(data) =>
													handleFieldChange(
														"business_country",
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
											</Select> */}
											<Select
												{...field}
												placeholder="Select business country"
												style={{
													width: "100%",
												}}
												className={`bg-app-lightgray text-gray-900 font-normal`}
												defaultSelectedKeys={[
													field.value ?? "",
												]}
												onSelectionChange={(keys) => {
													const value =
														keys.currentKey as string;
													handleFieldChange(
														"business_country",
														countryCurrencies[0],
														{ target: { value } }
													);
												}}
												renderValue={(items) => {
													return items.map((item) => {
														const key =
															item.key as string;
														const countryData =
															countryCurrencies[0]?.find(
																(
																	country: any
																) =>
																	country.iso2 ===
																	key
															);
														return (
															<div
																className="flex items-center gap-2"
																key={key}
															>
																<ItemFlag
																	iso2={
																		countryData?.iso2 ||
																		key
																	}
																	size={3}
																/>
																<span>
																	{`${countryData?.country} (${countryData?.iso2}) - ${countryData?.currency}`}
																</span>
															</div>
														);
													});
												}}
											>
												{countryCurrencies[0]
													?.sort((a: any, b: any) =>
														a.country.localeCompare(
															b.country
														)
													)
													.map((country: any) => (
														<SelectItem
															key={country.iso2}
															value={country.iso2}
														>
															<div className="flex items-center gap-2">
																<ItemFlag
																	iso2={
																		country.iso2 ||
																		""
																	}
																	size={3}
																/>
																<span>
																	{`${country.country} (${country.iso2}) - ${country.currency}`}
																</span>
															</div>
														</SelectItem>
													))}
											</Select>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
						</div>
					</div>

					{/* Security Block */}
					<div className="mb-8 space-y-[15px]">
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-md font-[500] tracking-tight">
										Password
										<span className="text-red-500">*</span>
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
										<span className="text-red-500">*</span>
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

					{/* Terms and Conditions Checkbox */}
					<div className="mt-4">
						<Checkbox
							id="accept-terms"
							checked={acceptTerms}
							onChange={setAcceptTerms}
							label={
								<>
									{"I hereby consent to the "}
									<a
										href="/terms-of-use"
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-600 hover:text-blue-800 underline"
									>
										Terms of Use
									</a>
									{` and give consent for Cartevo to process my
									data in line with Cartevo's `}
									<a
										href="/privacy-policy"
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-600 hover:text-blue-800 underline"
									>
										Privacy Policy
									</a>
									{`. I also confirm I have the authorisation of
									the Board of Directors and the Company to
									create this account and provide their
									personal data.`}
								</>
							}
						/>
					</div>
				</div>

				{/* <div className="text-right">
          <a href="#" className="inline-block w-[272px] text-md font-[400]">Mot de passe oublié ?</a>
        </div> */}
				{/* <Link href="#" className="text-gray-800 font-semibold text-righttext-md">Forgotten Password?</Link> */}
				<div className={`mt-[50px]`}>
					<CButton
						text={"Create account"}
						btnStyle={"blue"}
						type={"submit"}
						width={"250px"}
						height={"40px"}
						disabled={!acceptTerms || mutation.isLoading}
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
