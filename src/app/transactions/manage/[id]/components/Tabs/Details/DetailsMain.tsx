"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { detailsSchemaV2 } from "@/validation/FormValidation";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PiCirclesFourFill } from "react-icons/pi";
import { Checkbox } from "@/components/ui/checkbox";
import { FaChevronRight, FaEdit, FaLock, FaSave } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentCustomerDetails } from "@/redux/slices/customer";
import Image from "next/image";
import CButton from "@/components/shared/CButton";
import classNames from "classnames";
import { HashLoader } from "react-spinners";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { selectCurrentUser } from "@/redux/slices/auth";
import { useMutation } from "react-query";
import toast from "react-hot-toast";
import { UserService } from "@/api/services/user";
import DialogWrapper from "@/components/shared/DialogWrapper";
import CustomDropdown from "@/components/shared/CustomDropdown";
import { RxDotsHorizontal } from "react-icons/rx";
import Modal from "@/components/shared/Modal/Modal";
import ChangePasswordModalForm from "./modals/ChangePasswordModalForm";
import RechargeAccountBalanceModalForm from "./modals/RechargeAccountBalanceModalForm";
import BlockUserAccountModalForm from "./modals/BlockUserAccountModalForm";
import ConfirmSubmitModal from "./modals/ConfirmSubmitModal";
import { TbPasswordUser } from "react-icons/tb";
import { MdAddAPhoto, MdClose, MdDomainVerification } from "react-icons/md";
import { IoMdPhotos } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";
import UpdatePhotoModalForm from "./modals/UpdatePhotoModalForm";
import UpdateDocumentImagesModalForm from "./modals/UpdateDocumentImagesModalForm";
import UpdateVerificationStatusModalForm from "./modals/UpdateVerificationStatusModalForm";
import UpdateSelfieModalForm from "./modals/UpdateSelfieModalForm";
import { getFormattedDate, getTextFormattedDate } from "@/utils/DateFormat";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { DatePicker } from "@nextui-org/date-picker";
import { getNextUIDatePickerValueStr } from "@/utils/DateFormat";
import cstyles from "./styles/style.module.scss";
import { isExpired, calculateAge } from "@/utils/utils";
import { I18nProvider } from "@react-aria/i18n";
import { DateInput, NextUIProvider } from "@nextui-org/react";
import useTags from "@/hooks/useTagInput";
import { TagField } from "@/components/shared/TagField";
import { CustomerService } from "@/api/services/v2/customer";
import { hasPermission } from "@/utils/permissions";
type CountryProps = {
	[key: string]: string;
};
const countryCodes: CountryProps = {
	"+237": "Cameroun",
	"+241": "Gabon",
	"+234": "Nigeria",
};

const countryData = [
	{
		key: "+237",
		label: "Cameroun",
	},
	{
		key: "+241",
		label: "Gabon",
	},
	{
		key: "+234",
		label: "Nigeria",
	},
];

const incomeData = [
	{
		key: "0_100k",
		label: "0-100 000 Fcfa / mois",
	},
	{
		key: "100k_500k",
		label: "100 000-500 000 Fcfa / mois",
	},
	{
		key: "500k_1M",
		label: "500 000-1 000 000 Fcfa / mois",
	},
];

const genreData = [
	{
		key: "masculin",
		label: "masculin",
	},
	{
		key: "feminin",
		label: "feminin",
	},
];

const documentTypes = ["cni", "passeport", "permis de conduire", "récépissé"];

function parseDateStr(dateString: string) {
	return dateString ? dateString.replace(/T.*Z$/, "") : "";
}

function parseDateObject(dateString: string) {
	return dateString ? new Date(dateString.replace(/T.*Z$/, "")) : new Date();
}

const handleUpdateUser = async (queryData: any) => {
	const { currentUserId, customerId, body } = queryData;
	// console.log("handleTransaction : ", {currentUserId, customerId, label, body});
	// return {currentUserId, customerId, label, body}
	const response = await CustomerService.update_one_customer_infos({
		userId: currentUserId,
		customerId: customerId,
		body: body,
	});
	if (!response.ok) {
		const responseBody = await response.json();
		throw new Error(responseBody.message);
	}
	const responseJson = await response.json();
	return responseJson;
};

export default function Details() {
	const [isEditMode, setIsEditMode] = useState(false);
	const [isConfirmSubmitModalOpen, setIsConfirmSubmitModalOpen] =
		useState(false);
	const [isChangePasswordModalFormOpen, setIsChangePasswordModalFormOpen] =
		useState(false);
	const [isUpdatePhotoModalFormOpen, setIsUpdatePhotoModalFormOpen] =
		useState(false);
	const [isUpdateSelfieModalFormOpen, setIsUpdateSelfieModalFormOpen] =
		useState(false);
	const [
		isUpdateDocumentImagesModalFormOpen,
		setIsUpdateDocumentImagesModalFormOpen,
	] = useState(false);
	const [
		isUpdateVerificationStatusModalFormOpen,
		setIsUpdateVerificationStatusModalFormOpen,
	] = useState(false);

	const pathname = usePathname();
	const redirectRef: any = useRef();
	const currentUser = useSelector(selectCurrentUser);
	const customerDetails: any = useSelector(selectCurrentCustomerDetails);

	const MAX_TAGS = 5;
	//Retrieve all the returned items from the hook
	// const { tags, handleAddTag, handleRemoveTag } = useTags(MAX_TAGS); // pass the maximum tags

	const form = useForm<z.infer<typeof detailsSchemaV2>>({
		resolver: zodResolver(detailsSchemaV2),
		defaultValues: {
			// name: customerDetails?.customer?.first_name ? `${customerDetails?.customer?.first_name} ${customerDetails?.customer?.last_name}` : "",
			first_name: customerDetails?.customer?.first_name
				? `${customerDetails?.customer?.first_name}`
				: "",
			last_name: customerDetails?.customer?.last_name
				? `${customerDetails?.customer?.last_name}`
				: "",
			email: customerDetails?.customer?.email ?? "",
			phone: `${customerDetails?.customer?.phone}`,
			niu: customerDetails?.customer?.niu ?? "",
			country_code: customerDetails?.customer?.country_phone_code ?? "",
			country: customerDetails?.customer?.country ?? "",
			city: customerDetails?.customer?.city ?? "",
			address: customerDetails?.customer?.address ?? "",
			birthday: customerDetails?.customer?.birthdate ?? "",
			age: calculateAge(
				parseDateStr(customerDetails?.customer?.birthdate ?? "")
			), //String(customerDetails?.customer?.age ?? ""),
			job: customerDetails?.customer?.job ?? "",
			sex: customerDetails?.customer?.sex ?? "",
			income: customerDetails?.customer?.income ?? "",
			idExpDate: customerDetails?.customer?.id_expiry_date ?? "",
			codeParrain: customerDetails?.customer?.sponsor_code ?? "",
			codeParrainage: customerDetails?.customer?.sponsorship_code ?? "",
			deviceModel: customerDetails?.customer?.device_model ?? "",
			deviceID: customerDetails?.customer?.device_id ?? "",
			idNumber: customerDetails?.customer?.id_document_number ?? "",
			idPaper: customerDetails?.customer?.id_document_type ?? "",
			tags: customerDetails?.customer?.tags ?? [],
			additionalPhoneNumbers:
				customerDetails?.customer?.additional_phone_numbers ?? [],
		},
	});

	const mutation = useMutation({
		mutationFn: (data) =>
			handleUpdateUser({
				currentUserId: currentUser?.id,
				customerId: customerDetails?.customer?.id,
				body: data,
			}),
		onError: (err: any) => {
			console.error("onError : ", err.message);
			toast.error(
				`Erreur lors de la modification des informations du compte : ${err.message}`
			);
		},
		onSuccess: (data) => {
			console.log("onSuccess : ", data);
			toast.success(
				`Modification des informations du compte effectué avec succès`
			);
			redirectRef.current.href = window.location.pathname;
			redirectRef.current.click();
		},
	});

	const onSubmit = (data: any) => {
		console.log(form.getValues("tags"));
		setIsConfirmSubmitModalOpen(true);
		console.log("onSubmit data : ", data, { formValues: form.getValues() });
		// mutation.mutate(data);
	};
	const onError = (err: any) => {
		console.error("onError", err);
	};
	const handleEditMode = (value: any) => {
		setIsEditMode(value);

		if (value) {
			form.setFocus("first_name");
		} else {
			form.setValue(
				"first_name",
				customerDetails?.customer?.first_name ?? ""
			);
			form.setValue(
				"last_name",
				customerDetails?.customer?.last_name ?? ""
			);
			form.setValue("email", customerDetails?.customer?.email ?? "");
			form.setValue("phone", `${customerDetails?.customer?.phone}`);
			form.setValue(
				"country_code",
				customerDetails?.customer?.country_code ?? ""
			);
			form.setValue("country", customerDetails?.customer?.country ?? "");
			form.setValue("city", customerDetails?.customer?.city ?? "");
			form.setValue("address", customerDetails?.customer?.address ?? "");
			form.setValue(
				"codeParrain",
				customerDetails?.customer?.sponsor_code ?? ""
			);
			form.setValue(
				"codeParrainage",
				customerDetails?.customer?.sponsorship_code ?? ""
			);
			form.setValue(
				"deviceModel",
				customerDetails?.customer?.device_model ??
					customerDetails?.customer?.deviceModeled ??
					""
			);
			form.setValue(
				"deviceID",
				customerDetails?.customer?.device_id ?? ""
			);
			form.setValue(
				"idNumber",
				customerDetails?.customer?.id_document_umber ?? ""
			);
			form.setValue(
				"idPaper",
				customerDetails?.customer?.id_document_type ?? ""
			);
			form.setValue(
				"age",
				calculateAge(
					parseDateStr(customerDetails?.customer?.birthdate ?? "")
				)
			);
			form.setValue(
				"idExpDate",
				String(customerDetails?.customer?.id_expiry_date ?? "")
			);
			form.setValue(
				"birthday",
				customerDetails?.customer?.birthdate ?? ""
			);
			form.setValue("job", customerDetails?.customer?.job ?? "");
			form.setValue("income", customerDetails?.customer?.income ?? "");
			form.setValue("sex", customerDetails?.customer?.sex ?? "");
			form.setValue("tags", customerDetails?.customer?.tags ?? []);
			form.setValue(
				"additionalPhoneNumbers",
				customerDetails?.customer?.additional_phone_numbers ?? []
			);
		}
	};
	const handleCountryChange = (data: any) => {
		const value = data.target.value;
		console.log("country_code", value, countryCodes[value]);
		form.setValue("country", countryCodes[value]);
		form.setValue("country_code", value);
	};

	const handleIncomeChange = (data: any) => {
		const value = data.target.value;
		console.log("income", value);
		form.setValue("income", value);
	};
	const handleSexChange = (data: any) => {
		const value = data.target.value;
		console.log("sex", value);
		form.setValue("sex", value);
	};

	return (
		<div className="flex-1">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit, onError)}
					className="space-y-3"
				>
					<div className="mb-7 w-full flex flex-col md:flex-row gap-10 justify-between items-center">
						<div className="w-full">
							<h1 className="text-lg text-gray-700 font-bold">
								{!isEditMode
									? `Informations personnelles de l'utilisateur`
									: `Modification des informations personnelles de l'utilisateur`}
							</h1>
							{/* <p className="text-xs text-gray-500">liste en temps réel des dernieres transactions effectuées avec les cartes</p> */}
						</div>

						{hasPermission(
							currentUser,
							"user_account_details:details",
							"edit_infos"
						) ? (
							<div className="">
								{!isEditMode ? (
									<div className={`flex gap-3`}>
										<CButton
											text={`Modifier les informations`}
											btnStyle={"lightGreen"}
											onClick={() => handleEditMode(true)}
											icon={<FaEdit />}
											width={"100%"}
											height={"35px"}
										/>
										<CustomDropdown
											cstyle={"outline"}
											iconSize={20}
											hasDropdownIcon={false}
											icon={<RxDotsHorizontal />}
											items={[
												<div
													key={"1"}
													className="flex justify-between gap-2"
												>
													<TbPasswordUser />
													{/* <RiLockPasswordFill /> */}
													<span
														onClick={() =>
															setIsChangePasswordModalFormOpen(
																true
															)
														}
														style={{
															whiteSpace:
																"nowrap",
														}}
														className="text-sm"
													>
														{
															"Modifier le mot de passe"
														}
													</span>
												</div>,
												// <div key={'2'} className='flex justify-between gap-2 py-1'>
												//   <MdAddAPhoto />
												//   <span
												//   onClick={()=>setIsUpdatePhotoModalFormOpen(true)}
												//   style={{whiteSpace:'nowrap'}} className='text-sm h-fit'>
												//     {'Modifier la photo de profil'}
												//   </span>
												// </div>,
												// <div key={'2'} className='flex justify-between gap-2 py-1'>
												// <MdAddAPhoto />
												// <span
												//   onClick={()=>setIsUpdateSelfieModalFormOpen(true)}
												//   style={{whiteSpace:'nowrap'}} className='text-sm h-fit'>
												//     {"Modifier le selfie d'identification"}
												//   </span>
												// </div>,
												// <div key={'3'} className='flex justify-between gap-2 py-1'>
												//   <IoMdPhotos />
												//   <span
												//   onClick={()=>setIsUpdateDocumentImagesModalFormOpen(true)}
												//   style={{whiteSpace:'nowrap'}} className='text-sm'>
												//   {'Modifier les images de documents'}
												//   </span>
												// </div>,
												// <div key={'3'} className='flex justify-between gap-2 py-1'>
												//   <MdDomainVerification />
												//   <span
												//   onClick={()=>setIsUpdateVerificationStatusModalFormOpen(true)}
												//   style={{whiteSpace:'nowrap'}} className='text-sm'>
												//   {'Modifier le statut de vérification'}
												//   </span>
												// </div>
											]}
										/>
									</div>
								) : (
									<div
										className={`flex gap-3 items-center w-fit`}
									>
										<CButton
											text={`Annuler`}
											btnStyle={"outlineDark"}
											onClick={() =>
												handleEditMode(false)
											}
											width={"100%"}
											height={"35px"}
										/>
										<CButton
											text={`Enregistrer les informations`}
											btnStyle={"green"}
											type={"submit"}
											icon={<FaSave />}
											width={"100%"}
											height={"35px"}
										/>
										<ConfirmSubmitModal
											isOpen={isConfirmSubmitModalOpen}
											setIsOpen={
												setIsConfirmSubmitModalOpen
											}
											onSubmit={() =>
												mutation.mutate(
													form.getValues() as any
												)
											}
										/>
									</div>
								)}
								{/* <Modal name={'updatePassword'} modalContent={<BlockUserAccountModalForm customer={customerDetails?.customer}/>}/>         */}
							</div>
						) : (
							<></>
						)}
					</div>
					<div className="w-full flex flex-col gap-7">
						<FormField
							control={form.control}
							name="last_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Nom(s)`}</FormLabel>
									<FormControl>
										<Input
											className={`px-6 text-gray-900 font-normal ${
												isEditMode
													? "bg-[#F4EFE3]"
													: "bg-gray-200"
											}`}
											{...field}
											readOnly={!isEditMode}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="first_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Prenom(s)`}</FormLabel>
									<FormControl>
										<Input
											className={`px-6 text-gray-900 font-normal ${
												isEditMode
													? "bg-[#F4EFE3]"
													: "bg-gray-200"
											}`}
											{...field}
											readOnly={!isEditMode}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-7">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
											Email
										</FormLabel>
										<FormControl>
											<Input
												placeholder="abc@sekure.xyz"
												className={`px-6 text-gray-900 font-normal ${
													isEditMode
														? "bg-[#F4EFE3]"
														: "bg-gray-200"
												}`}
												{...field}
												readOnly={!isEditMode}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Téléphone`}</FormLabel>
										<FormControl>
											<Input
												className={`px-6 text-gray-900 font-normal ${
													isEditMode
														? "bg-[#F4EFE3]"
														: "bg-gray-200"
												}`}
												{...field}
												readOnly={!isEditMode}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-7">
							<FormField
								control={form.control}
								name="birthday"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
											Date de naissance
										</FormLabel>
										<FormControl>
											<Input
												className={`px-6 text-gray-900 font-normal bg-gray-200`}
												value={
													field?.value
														? getTextFormattedDate(
																parseDateObject(
																	field.value
																)
														  )
														: ""
												}
												readOnly
											/>
											{/* {isEditMode?
                        
                          <DatePicker
                            className={`text-gray-900 font-normal ${cstyles['datepicker_yellow_bg']}`} 
                            defaultValue={field.value ? parseDate(parseDateStr(field.value)) : null}
                            onChange={(date) => { 
                              const newDateStr = getNextUIDatePickerValueStr(date.year, date.month, date.day); 
                              // console.log("date : ", date);
                              // console.log("newDateStr : ", newDateStr);
                              form.setValue('birthday',newDateStr);
                              form.setValue('age', calculateAge(newDateStr));
                            }}
                            showMonthAndYearPickers
                          />
                        :
                        
                        <Input 
                        className={`px-6 text-gray-900 font-normal ${isEditMode? 'bg-[#F4EFE3]': 'bg-gray-200'}`} 
                        value={field?.value ? getTextFormattedDate(parseDateObject(field.value)) :''}
                        readOnly={!isEditMode} />
                      } */}
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="additionalPhoneNumbers"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
											Numéros de téléphone additionnels
										</FormLabel>
										<FormControl>
											{/* <Input className={`px-6 text-gray-900 font-normal ${isEditMode? 'bg-[#F4EFE3]': 'bg-gray-200'}`} {...field} readOnly={!isEditMode}/> */}
											{isEditMode ? (
												<TagField
													field={field}
													tags={field?.value}
													onChange={(data) => {
														form.setValue(
															"additionalPhoneNumbers",
															data
														);
													}}
													max={2}
												/>
											) : (
												<div className="flex flex-row flex-wrap gap-3 mt-4 bg-gray-100 rounded-md min-w-[250px] min-h-[43px] py-2 px-3">
													{field?.value?.map(
														(
															tag: string,
															index: number
														) => (
															<span
																key={`${index}-${tag}`}
																className="flex items-center justify-center px-3 py-2 rounded-[32px] text-sm shadow-sm font-medium bg-gray-200 text-gray-900 h-fit"
															>
																{tag}
															</span>
														)
													)}
												</div>
											)}
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-7">
							<FormField
								control={form.control}
								name="age"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
											Age
										</FormLabel>
										<FormControl>
											<Input
												className={`px-6 text-gray-900 font-normal bg-gray-200`}
												{...field}
												readOnly
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="sex"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
											Sexe
										</FormLabel>
										<FormControl>
											<Input
												className={`px-6 text-gray-900 font-normal bg-gray-200`}
												value={form.watch("sex")}
											/>

											{/* {isEditMode?
                        <Select 
                          {...field}
                          placeholder="Sélectionner la plage de revenus" 
                          style={{width:'100%', background: '#F4EFE3'}}
                          className={`rounded-xs text-gray-900 font-normal`}
                          defaultSelectedKeys={[field.value]}
                          onChange={(data) => handleSexChange(data)}
                        >
                          {genreData.map((item,idx) => (
                          <SelectItem key={item.label} value={item.label}>
                            {item.label}
                          </SelectItem>
                          ))}
                        </Select>
                        :
                        <Input className={`px-6 text-gray-900 font-normal bg-gray-200`} value={form.watch('sex')} />
                        } */}
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="country_code"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
											Pays de résidence
										</FormLabel>
										<FormControl>
											<Input
												className={`px-6 text-gray-900 font-normal bg-gray-200`}
												value={form.watch("country")}
											/>

											{/* {isEditMode?
                        <Select 
                          {...field}
                          placeholder="Sélectionner le pays" 
                          style={{width:'100%', background: '#F4EFE3'}}
                          className={`rounded-xs text-gray-900 font-normal`}
                          defaultSelectedKeys={[field.value]}
                          onChange={(data) => handleCountryChange(data)}
                        >
                          {countryData.map((item,idx) => (
                          <SelectItem key={item.key} value={item.key}>
                            {item.label}
                          </SelectItem>
                          ))}
                        </Select>
                        :
                        <Input className={`px-6 text-gray-900 font-normal bg-gray-200`} value={form.watch('country')} />
                        } */}
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="country_code"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
											Code pays
										</FormLabel>
										<FormControl>
											<Input
												className={`px-6 text-gray-900 font-normal bg-gray-200`}
												{...field}
												readOnly
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-7">
							<FormField
								control={form.control}
								name="city"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
											Ville de résidence
										</FormLabel>
										<FormControl>
											<Input
												className={`px-6 text-gray-900 font-normal bg-gray-200`}
												{...field}
												readOnly
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="address"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
											Adresse
										</FormLabel>
										<FormControl>
											<Input
												className={`px-6 text-gray-900 font-normal bg-gray-200`}
												{...field}
												readOnly
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-7">
							<FormField
								control={form.control}
								name="job"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
											Profession
										</FormLabel>
										<FormControl>
											<Input
												className={`px-6 text-gray-900 font-normal bg-gray-200`}
												{...field}
												readOnly
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="income"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
											Plage de revenu
										</FormLabel>
										<FormControl>
											<Input
												className={`px-6 text-gray-900 font-normal bg-gray-200`}
												value={form.watch("income")}
											/>

											{/* {isEditMode?
                        <Select 
                          {...field}
                          placeholder="Sélectionner la plage de revenus" 
                          style={{width:'100%', background: '#F4EFE3'}}
                          className={`rounded-xs text-gray-900 font-normal`}
                          defaultSelectedKeys={[field.value]}
                          onChange={(data) => handleIncomeChange(data)}
                        >
                          {incomeData.map((item,idx) => (
                          <SelectItem key={item.label} value={item.label}>
                            {item.label}
                          </SelectItem>
                          ))}
                        </Select>
                        :
                        <Input className={`px-6 text-gray-900 font-normal bg-gray-200`} value={form.watch('income')} />
                        } */}
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="idNumber"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Numéro d'identification`}</FormLabel>
									<FormControl>
										<Input
											className={`px-6 text-gray-900 font-normal bg-gray-200`}
											{...field}
											readOnly
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-7">
							<FormField
								control={form.control}
								name="idPaper"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Document d'identification`}</FormLabel>
										<FormControl>
											<Input
												className={`px-6 text-gray-900 font-normal bg-gray-200`}
												{...field}
												readOnly
											/>
											{/* {isEditMode?
                        <Select 
                          {...field}
                          placeholder="Sélectionner le type de document" 
                          style={{width:'100%', background: '#F4EFE3'}}
                          className={`rounded-xs text-gray-900 font-normal`}
                          defaultSelectedKeys={[field.value]}
                          onChange={(data) => field.onChange(data)}
                        >
                          {documentTypes.map((item,idx) => (
                          <SelectItem key={item}>
                            {item}
                          </SelectItem>
                          ))}
                        </Select>
                        :
                        <Input className={`px-6 text-gray-900 font-normal bg-gray-200`} {...field} readOnly/>
                        } */}
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="idExpDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
											{`Date expiration document d'identification`}
											{isExpired(
												parseDateStr(field.value)
											) ? (
												<span
													style={{ color: "red" }}
												>{` (expiré)`}</span>
											) : (
												<></>
											)}
										</FormLabel>
										<FormControl>
											<Input
												className={`px-6 text-gray-900 font-normal bg-gray-200`}
												value={
													field.value
														? getTextFormattedDate(
																parseDateObject(
																	field.value
																)
														  )
														: ""
												}
												readOnly
											/>
											{/* {isEditMode?
                        <DatePicker
                          className={`text-gray-900 font-normal ${cstyles['datepicker_yellow_bg']}`} 
                          defaultValue={field.value ? parseDate(parseDateStr(field.value)) : null}
                          onChange={(date) => {                         
                            form.setValue('idExpDate',getNextUIDatePickerValueStr(date.year, date.month, date.day))
                          }}
                          showMonthAndYearPickers
                        />
                        :
                        <Input 
                        className={`px-6 text-gray-900 font-normal ${isEditMode? 'bg-[#F4EFE3]': 'bg-gray-200'}`} 
                        value={field.value ? getTextFormattedDate(parseDateObject(field.value)) :''}
                        readOnly={!isEditMode} />
                      } */}
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="niu"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
										{`Numero d'Identifiant Unique (NIU)`}
									</FormLabel>
									<FormControl>
										<Input
											className={`px-6 text-gray-900 font-normal bg-gray-200`}
											{...field}
											readOnly
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-7">
							<FormField
								control={form.control}
								name="codeParrainage"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
											Code Parrainage
										</FormLabel>
										<FormControl>
											<Input
												className={`px-6 text-gray-900 font-normal bg-gray-200`}
												{...field}
												readOnly
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="codeParrain"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
											Code Parrain
										</FormLabel>
										<FormControl>
											<Input
												className={`px-6 text-gray-900 font-normal bg-gray-200`}
												{...field}
												readOnly
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="deviceID"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
											ID Appareil
										</FormLabel>
										<FormControl>
											<Input
												className={`px-6 text-gray-900 font-normal bg-gray-200`}
												{...field}
												readOnly
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="deviceModel"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Modèle de l'appareil`}</FormLabel>
										<FormControl>
											<Input
												className={`px-6 text-gray-900 font-normal bg-gray-200`}
												{...field}
												readOnly
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="tags"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
										Tags
									</FormLabel>
									<FormControl>
										{/* <Input className={`px-6 text-gray-900 font-normal ${isEditMode? 'bg-[#F4EFE3]': 'bg-gray-200'}`} {...field} readOnly={!isEditMode}/> */}
										{isEditMode ? (
											<TagField
												field={field}
												tags={field?.value}
												onChange={(data) => {
													form.setValue("tags", data);
												}}
												max={1000}
											/>
										) : (
											<div className="flex flex-row flex-wrap gap-3 mt-4 bg-gray-100 rounded-md min-w-[250px] min-h-[43px] py-2 px-3">
												{field?.value?.map(
													(
														tag: string,
														index: number
													) => (
														<span
															key={`${index}-${tag}`}
															className="flex items-center justify-center px-3 py-2 rounded-[32px] text-sm shadow-sm font-medium bg-gray-200 text-gray-900 h-fit"
														>
															{tag}
														</span>
													)
												)}
											</div>
										)}
									</FormControl>
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-7">
							<FormItem>
								<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`RECTO Document d'identification`}</FormLabel>
								<div
									style={{
										width: "100%",
										height: 400,
										borderRadius: "20px",
										position: "relative",
										overflow: "hidden",
									}}
								>
									{customerDetails?.customer?.id_document_front?.startsWith(
										"http"
									) ? (
										<Image
											alt="vector background"
											src={
												customerDetails?.customer
													?.id_document_front
											}
											layout="fill"
											objectFit="contain"
										/>
									) : (
										<span className="pl-5 pt-5">
											Pas de recto
										</span>
									)}
								</div>
							</FormItem>
							<FormItem>
								<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`VERSO Document d'identification`}</FormLabel>
								<div
									style={{
										width: "100%",
										height: 400,
										borderRadius: "20px",
										position: "relative",
									}}
								>
									{customerDetails?.customer?.id_document_back?.startsWith(
										"http"
									) ? (
										<Image
											alt="vector background"
											src={
												customerDetails?.customer
													?.id_document_back
											}
											layout="fill"
											objectFit="contain"
										/>
									) : (
										<span className="pl-5 pt-5">
											Pas de verso
										</span>
									)}
								</div>
							</FormItem>
							<FormItem>
								<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Selfie d'identification`}</FormLabel>
								<div
									style={{
										width: "100%",
										height: 400,
										borderRadius: "20px",
										position: "relative",
										overflow: "hidden",
									}}
								>
									{customerDetails?.customer?.id_selfie?.startsWith(
										"http"
									) ? (
										<Image
											alt="vector background"
											src={
												customerDetails?.customer
													?.id_selfie
											}
											layout="fill"
											objectFit="contain"
										/>
									) : (
										<span className="pl-5 pt-5">
											Pas de selfie
										</span>
									)}
								</div>
							</FormItem>
						</div>
					</div>
				</form>
			</Form>
			<ChangePasswordModalForm
				isOpen={isChangePasswordModalFormOpen}
				setIsOpen={setIsChangePasswordModalFormOpen}
				customer={customerDetails?.customer}
			/>
			<UpdatePhotoModalForm
				isOpen={isUpdatePhotoModalFormOpen}
				setIsOpen={setIsUpdatePhotoModalFormOpen}
				customer={customerDetails?.customer}
			/>
			<UpdateSelfieModalForm
				isOpen={isUpdateSelfieModalFormOpen}
				setIsOpen={setIsUpdateSelfieModalFormOpen}
				customer={customerDetails?.customer}
			/>
			<UpdateDocumentImagesModalForm
				isOpen={isUpdateDocumentImagesModalFormOpen}
				setIsOpen={setIsUpdateDocumentImagesModalFormOpen}
				customer={customerDetails?.customer}
			/>
			<UpdateVerificationStatusModalForm
				isOpen={isUpdateVerificationStatusModalFormOpen}
				setIsOpen={setIsUpdateVerificationStatusModalFormOpen}
				customer={customerDetails?.customer}
			/>
			<div
				style={{ zIndex: 9000 }}
				className={classNames(
					"transition-all invisible z-20 bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center",
					{
						"!opacity-100 !visible z-20": mutation.isLoading,
					}
				)}
			>
				<HashLoader className="shrink-0" size={50} color="#1F66FF" />
			</div>
			<a ref={redirectRef} hidden href="#"></a>
		</div>
	);
}
