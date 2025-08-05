"use client";
import { CustomerService } from "@/api/services/v2/customer";
import Title from "@/components/shared/Title";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	selectAdminUsers,
	selectCurrentCustomerTicket,
} from "@/redux/slices_v2/customerticket";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { HashLoader } from "react-spinners";
import { z } from "zod";
import { FaCheck, FaExternalLinkAlt, FaFile } from "react-icons/fa";
import CButton from "@/components/shared/CButton";
import UpdateProofModalForm from "./modals/UpdateProofModalForm";
import { Select, SelectItem } from "@nextui-org/react";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "react-query";
import { CustomerTicketService } from "@/api/services/v2/customerticket";
import { selectCurrentUser } from "@/redux/slices/auth";
import toast from "react-hot-toast";
import DisplayImageModal from "./modals/DisplayImageModal";
import { MdClose } from "react-icons/md";
import {
	generateRandomCode,
	getFileExtension,
	removeAllSpaces,
} from "@/utils/utils";

declare global {
	interface Window {
		FileList: typeof FileList;
	}
}

const MAX_FILE_SIZE = 1024 * 1024 * 2; // 5MB in bytes
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];

export const customerTicketSchema = z.object({
	title: z.string(),
	content: z.string(),
	user_phone: z.string().optional(),
	user_email: z.string().optional(),
	user_infos: z.string().optional(),
	transaction_infos: z.string().optional(),
	card_infos: z.string().optional(),
	user_id: z.string().optional(),
	transaction_id: z.string().optional(),
	card_id: z.string().optional(),
	status: z.string(),
	// is_solved: z.string().optional(),
	priority: z.string(),
	category_name: z.string(),
	category_id: z.string(),
	customer_support_name: z.string(),
	customer_support_id: z.string(),
	technical_support_name: z.string().optional(),
	technical_support_id: z.string().optional(),
	notes: z.array(z.string()).optional(),
	country: z.string().optional(),
	country_iso_code: z.string().optional(),
	// main_image:z.instanceof(FileList).refine(file => {
	//   console.log("photo - file : ", file?.[0].size, file?.[0].type);
	//   const fileSizeOk = file?.[0].size <= MAX_FILE_SIZE;
	//   // const fileTypeOk = ACCEPTED_IMAGE_TYPES.includes(file?.[0].type);
	//   return file?.length == 1 && fileSizeOk
	//   // return file.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file.type);
	// }, {
	//   message: "File must be under 5MB and of type jpg, png, or gif",
	// }),
	// images:z.array(z.instanceof(FileList).refine(file => {
	//   console.log("photo - file : ", file?.[0].size, file?.[0].type);
	//   const fileSizeOk = file?.[0].size <= MAX_FILE_SIZE;
	//   // const fileTypeOk = ACCEPTED_IMAGE_TYPES.includes(file?.[0].type);
	//   return file?.length == 1 && fileSizeOk
	//   // return file.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file.type);
	// }, {
	//   message: "File must be under 5MB and of type jpg, png, or gif",
	// })).optional(),
});

const categoryData = [
	{
		key: "phone",
		label: "Numero Associé au Compte Sekure",
	},
	{
		key: `email`,
		label: `Addresse email`,
	},
	{
		key: "otp",
		label: "Code OTP",
	},
	{
		key: "additional_numbers",
		label: "Numeros additionnels",
	},
	{
		key: "profile_photo",
		label: "Photo de profil",
	},
	{
		key: "selfie",
		label: "Mot de passe",
	},
	{
		key: "id_document",
		label: `Document d'identification`,
	},
	{
		key: `user_infos`,
		label: `Informations de l'utilisateur`,
	},
	{
		key: "v1v2",
		label: "Transfert V1 vers V2",
	},
	{
		key: "wallet_standby",
		label: "Solde de verification",
	},
	{
		key: "wallet_topup",
		label: "Recharge de compte",
	},
	{
		key: "wallet_withdrawal",
		label: "Retrait de compte",
	},
	{
		key: "card_access",
		label: "Acces a la carte",
	},
	{
		key: "card_purchase",
		label: "Achat de carte",
	},
	{
		key: "card_topup",
		label: "Recharge de carte",
	},
	{
		key: "card_withdrawal",
		label: "Retrait de carte",
	},
	{
		key: "card_transaction",
		label: "Paiement par carte",
	},
	{
		key: "card_reimbursement",
		label: "Remboursement dans la carte",
	},
	{
		key: "chinpay",
		label: "ChinPay",
	},
	{
		key: "nairapay",
		label: "NairaPay",
	},
	{
		key: "paymentLink",
		label: "Lien de paiement",
	},
	{
		key: "payservice",
		label: "Services divers (credit communication, eneo, camwater, canal+, ...)",
	},
	{
		key: "transaction",
		label: "Autres transactions",
	},
	{
		key: "others",
		label: "Autres",
	},
];

// Function to get a label by key
function getLabelByKey(key: string, data: any): string | undefined {
	const item = data.find((item: any) => item.key === key);
	return item ? item.label : undefined;
}

interface KeyLabel {
	key: number; // or string, based on the User ID type
	label: string;
}
function convertUsersToKeyLabel(users: any[]): KeyLabel[] {
	return users.map((user) => ({
		key: user.id, // Use user.id as key
		label: `${user.last_name} ${user.first_name}`, // Use user.name as label
	}));
}

const statusData = [
	{
		key: "PENDING",
		label: "En attente",
	},
	{
		key: "ONGOING",
		label: "En cours de traitement",
	},
	{
		key: "SUCCESS",
		label: "Résolu",
	},
	{
		key: "FAILED",
		label: "Fermé",
	},
];

const priorityData = [
	{
		key: "1",
		label: "Faible",
	},
	{
		key: "2",
		label: "Moyen",
	},
	{
		key: "3",
		label: "Elevé",
	},
	{
		key: "4",
		label: "Urgent",
	},
];

type CountryProps = {
	[key: string]: string;
};
const countryCodes: CountryProps = {
	"+237": "Cameroun",
	"+241": "Gabon",
	"+229": "Benin",
	// '+234': "Nigeria",
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
		key: "+229",
		label: "Benin",
	},
	// {
	// 	key:'+234',
	// 	label:'Nigeria',
	// },
];

const handleCreateTicket = async (queryData: any) => {
	const { adminUserId, body, images } = queryData;

	const formData = new FormData();

	Object.entries(body || {})?.map(([key, value]: any[]) => {
		console.log({ key }, { value });
		if (key === "user_phone") {
			formData.append(`${key}`, value ? removeAllSpaces(value) : "");
		} else {
			formData.append(`${key}`, value || "");
		}
	});

	images?.map((img: any, index: any) => {
		console.log("img ::::", { img });
		const fileName = img.name;
		const fileNewName = generateRandomCode(32);
		const fileExtension = getFileExtension(fileName);
		formData.append(`images`, img, `${fileNewName}.${fileExtension}`);
	});

	// if(images.length>0) {
	//   const fileName = images?.[0]?.name;
	//   const fileNewName = generateRandomCode(32);
	//   const fileExtension = getFileExtension(fileName);
	//   formData.append(`main_image`, images?.[0], `${fileNewName}.${fileExtension}`);
	// }

	const response = await CustomerTicketService.create_customer_ticket({
		userId: adminUserId,
		body: formData,
	});
	if (!response.ok) {
		const responseBody = await response.json();
		throw new Error(responseBody.message);
	}
	const responseJson = await response.json();
	return responseJson;
};

export default function Details() {
	const pathname = usePathname();
	const redirectRef: any = useRef();
	const currentUser = useSelector(selectCurrentUser);
	const adminUsers = [
		{
			key: "e31a71c5-fb6e-4997-bc9d-90ec7c71c232",
			label: "Dupan Danielle",
		},
		{
			key: "7c4a2b71-65d0-40ff-b1a7-39e2d557cd29",
			label: "Edouke Sandra Elisa",
		},
		{
			key: "3c1bdcdc-4332-4f25-a3ef-9cb6924b3634",
			label: "MAPE TSINGUIA Ericka ESTELLA",
		},
		{
			key: "604feae4-8ccc-40e4-a964-5e829a63ae30",
			label: "Boumsong Manuella",
		},
		{
			key: "654df372-db1a-4498-adcf-931fca2c7794",
			label: "Visiteur Guest",
		},
		{
			key: "e852f3aa-79bf-4fcc-bc51-7e0eb50b93ef",
			label: "WAKAM KAMDEM Hermann Vanel",
		},
		{
			key: "b3436207-03f6-4eea-aefe-36fba7411d9c",
			label: "kenmeugne josie aurel",
		},
		{
			key: "f65b87ad-95ed-41b5-9e66-db1ecc53883d",
			label: "Moussinga Pauline Sandrine",
		},
		{
			key: "4cd5be16-9f74-4561-939d-76a73a17fa9c",
			label: "Minko Stéphane",
		},
		{
			key: "74afd873-58b4-49b4-a882-a35047239d2f",
			label: "Ngongang Angoula Paul Alain",
		},
		{
			key: "2f72f475-e166-403f-bb8c-1add80ec1748",
			label: "kono angoula Christian",
		},
		{ key: "ce3853aa-85cd-497c-996d-064214c38684", label: "KENOUYA Kevin" },
		{
			key: "c5048550-0726-4fa1-80c3-a7ab0b04c993",
			label: "Dongmo Tsague Remi Ghislain",
		},
	];
	//useSelector(selectAdminUsers);
	const [ticketImages, setTicketImages] = useState<any[]>([]);
	const [ticketImagesToSubmit, setTicketImagesToSubmit] = useState<any[]>([]);
	const [isDisplayImageModalOpen, setIsDisplayImageModalOpen] =
		useState(false);
	const MAX_TAGS = 5;

	// useEffect(() => {
	// 	console.log("adminUsers :: ", adminUsers);
	//   console.log("convertUsersToKeyLabel(adminUsers) ::: ", convertUsersToKeyLabel(adminUsers));
	// }, [adminUsers]);

	useEffect(() => {
		console.log("ticketImages :: ", ticketImages);
	}, [ticketImages]);

	useEffect(() => {
		console.log("isDisplayImageModalOpen :: ", isDisplayImageModalOpen);
	}, [isDisplayImageModalOpen]);

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files[0];
			const reader = new FileReader();

			reader.onloadend = () => {
				// setSelectedImage(reader.result as string);
				setTicketImagesToSubmit([...ticketImagesToSubmit, file]);
				setTicketImages([...ticketImages, reader.result as string]);
			};

			reader.readAsDataURL(file);
		}
	};

	//Retrieve all the returned items from the hook
	// const { tags, handleAddTag, handleRemoveTag } = useTags(MAX_TAGS); // pass the maximum tags

	const form = useForm<z.infer<typeof customerTicketSchema>>({
		resolver: zodResolver(customerTicketSchema),
		defaultValues: {
			status: "PENDING",
			priority: "2",
		},
	});

	const mutation = useMutation({
		mutationFn: (data) =>
			handleCreateTicket({
				currentUserId: currentUser?.id,
				body: data,
				images: ticketImagesToSubmit,
			}),
		onError: (err: any) => {
			console.error("onError : ", err.message);
			toast.error(
				`Erreur lors de la creation de la requete : ${err.message}`
			);
		},
		onSuccess: (data) => {
			console.log("onSuccess : ", data);
			toast.success(`Creation de la requete effectuée avec succès`);
			redirectRef.current.href = window.location.pathname?.replace(
				"/create",
				""
			);
			redirectRef.current.click();
		},
	});

	const onSubmit = (data: any) => {
		// console.log(form.getValues("tags"));
		// setIsConfirmSubmitModalOpen(true);
		console.log("onSubmit data : ", data, { formValues: form.getValues() });
		mutation.mutate(data);
	};
	const onError = (err: any) => {
		console.error("onError", err);
	};

	const handleCategoryChange = (data: any) => {
		const value: string = data.target.value;
		console.log("category_name", value, getLabelByKey(value, categoryData));
		form.setValue(
			"category_name",
			String(getLabelByKey(value, categoryData) || "")
		);
		form.setValue("category_id", value);
	};

	const handleStatusChange = (data: any) => {
		const value = data.target.value;
		form.setValue("status", value);
	};
	const handlePriorityChange = (data: any) => {
		const value = data.target.value;
		form.setValue("priority", value);
	};

	const handleCountryChange = (data: any) => {
		const value = data.target.value;
		console.log("country_iso_code", value, countryCodes[value]);
		form.setValue("country", countryCodes[value]);
		form.setValue("country_iso_code", value);
	};

	const handleCustSupChange = (data: any) => {
		const value = data.target.value;
		console.log(
			"customer_supportname",
			value,
			String(getLabelByKey(value, adminUsers) || "")
		);
		form.setValue(
			"customer_support_name",
			String(getLabelByKey(value, adminUsers) || "")
		);
		form.setValue("customer_support_id", value);
	};
	const handleTechSupChange = (data: any) => {
		const value = data.target.value;
		console.log(
			"technical_supportname",
			value,
			String(getLabelByKey(value, adminUsers) || "")
		);
		form.setValue(
			"technical_support_name",
			String(getLabelByKey(value, adminUsers) || "")
		);
		form.setValue("technical_support_id", value);
	};

	const removeTicketImage = (imgIndex: any) => {
		const newImages = ticketImages.filter(
			(_: any, index: any) => index !== imgIndex
		);
		const newImagesToSubmit = ticketImagesToSubmit.filter(
			(_: any, index: any) => index !== imgIndex
		);
		setTicketImages(newImages);
		setTicketImagesToSubmit(newImagesToSubmit);
	};

	const handleImageClick = useCallback(
		(index: any) => {
			setIsDisplayImageModalOpen(index);
		},
		[setIsDisplayImageModalOpen]
	);

	const handleRemoveImage = useCallback(
		(index: any) => {
			removeTicketImage(index);
		},
		[removeTicketImage]
	);

	return (
		<div className="flex-1">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-3 mt-5 w-full"
				>
					<div className="w-full flex justify-end">
						<CButton
							type={"submit"}
							text={"Enregistrer"}
							btnStyle={"green"}
							icon={<FaCheck />}
						/>
					</div>
					<div className="pr-6 flex-1 w-full">
						<Title title="Informations requete client" />
						<div className="w-full flex flex-col gap-7 mb-7">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
											Titre *
										</FormLabel>
										<FormControl>
											<Input
												className="px-6 font-normal bg-[#F4EFE3]"
												{...field}
											/>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="content"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
											Contenu *
										</FormLabel>
										<FormControl>
											<Textarea
												className="px-6 font-normal bg-[#F4EFE3]"
												{...field}
											/>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-2 gap-x-7 gap-y-7">
								{/* <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">Statut *</FormLabel>
                            <FormControl>
                              <Select 
                                {...field}
                                placeholder="Sélectionner la statut" 
                                style={{width:'100%', background: '#F4EFE3'}}
                                className={`rounded-xs text-gray-900 font-normal`}
                                defaultSelectedKeys={[field.value ?? ""]}                        
                                onChange={(data) => handleStatusChange(data)}
                              >
                                {statusData.map((item,idx) => (
                                <SelectItem key={item.key} value={item.key}>
                                  {item.label}
                                </SelectItem>
                                ))}
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      /> */}
								<FormField
									control={form.control}
									name="category_name"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
												Catégorie *
											</FormLabel>
											<FormControl>
												<Select
													{...field}
													placeholder="Sélectionner la categorie"
													style={{
														width: "100%",
														background: "#F4EFE3",
													}}
													className={`rounded-xs text-gray-900 font-normal`}
													onChange={(data) =>
														handleCategoryChange(
															data
														)
													}
												>
													{categoryData.map(
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
									name="priority"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
												Priorité *
											</FormLabel>
											<FormControl>
												<Select
													{...field}
													placeholder="Sélectionner la statut"
													style={{
														width: "100%",
														background: "#F4EFE3",
													}}
													className={`rounded-xs text-gray-900 font-normal`}
													defaultSelectedKeys={[
														field.value ?? "",
													]}
													onChange={(data) =>
														handlePriorityChange(
															data
														)
													}
												>
													{priorityData.map(
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
										</FormItem>
									)}
								/>
							</div>
						</div>

						<div className="pr-6 py-3 flex-1 w-full">
							<Title title="Informations utilisateur" />
							<div className="w-full flex flex-col gap-7">
								<div className="grid grid-cols-2 gap-x-7 gap-y-7 mt-5">
									<FormField
										control={form.control}
										name="user_phone"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
													Téléphone *
												</FormLabel>
												<FormControl>
													<Input
														className="px-6 bg-[#F4EFE3]"
														{...field}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="user_email"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
													Email *
												</FormLabel>
												<FormControl>
													<Input
														placeholder="abc@sekure.xyz"
														className="px-6 font-normal bg-[#F4EFE3]"
														{...field}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
									{/* <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">Pays de résidence</FormLabel>
                            <FormControl>
                              <Select 
                                {...field}
                                placeholder="Sélectionner le pays" 
                                style={{width:'100%', background: '#F4EFE3'}}
                                className={`rounded-xs text-gray-900 font-normal`}
                                // defaultSelectedKeys={[field.value]}
                                onChange={(data) => handleCountryChange(data)}
                              >
                                {countryData.map((item,idx) => (
                                <SelectItem key={item.key} value={item.key}>
                                  {item.label}
                                </SelectItem>
                                ))}
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      /> */}
								</div>
								{/* <FormField
                      control={form.control}
                      name="user_infos"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Autres infos de l'utilisateur`}</FormLabel>
                          <FormControl>
                            <Textarea className="px-6 font-normal bg-[#F4EFE3]" {...field}/>
                          </FormControl>
                        </FormItem>
                      )}
                    /> */}
							</div>
						</div>

						{/* <div className="pr-6 py-3 flex-1 w-full">           
                  <Title 
                  title="Informations carte"        
                  />
                  <div className="w-full flex flex-col gap-7">
                    <FormField
                      control={form.control}
                      name="card_infos"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea className="px-6 font-normal bg-[#F4EFE3]" {...field}/>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="pr-6 py-3 flex-1 w-full">           
                  <Title 
                  title="Informations transaction"        
                  />
                  <div className="w-full flex flex-col gap-7">
                    <FormField
                      control={form.control}
                      name="transaction_infos"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea className="px-6 font-normal bg-[#F4EFE3]" {...field}/>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div> */}
					</div>

					<div className="pr-6 py-3 flex-1 w-full">
						<Title title="Autres informations" />
						<div className="w-full flex flex-col gap-7">
							<div className="grid grid-cols-2 gap-x-7 gap-y-7">
								<FormField
									control={form.control}
									name="customer_support_name"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Support client *`}</FormLabel>
											<FormControl>
												<Select
													{...field}
													placeholder="Choisir la personne"
													style={{
														width: "100%",
														background: "#F4EFE3",
													}}
													className={`rounded-xs text-gray-900 font-normal`}
													// defaultSelectedKeys={[field.value]}
													onChange={(data) =>
														handleCustSupChange(
															data
														)
													}
												>
													{adminUsers.map(
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
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="technical_support_name"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Support technique`}</FormLabel>
											<FormControl>
												<Select
													{...field}
													placeholder="Choisir la personne"
													style={{
														width: "100%",
														background: "#F4EFE3",
													}}
													className={`rounded-xs text-gray-900 font-normal`}
													// defaultSelectedKeys={[field.value]}
													onChange={(data) =>
														handleTechSupChange(
															data
														)
													}
												>
													{adminUsers.map(
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
										</FormItem>
									)}
								/>
							</div>
						</div>
					</div>
				</form>
			</Form>

			<div className="pr-6 py-3 flex-1 w-full">
				<Title title="Images" />
				<div className="w-full flex flex-col gap-7">
					<Input
						type="file"
						// accept="image/jpeg,image/png,image/gif"
						// accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
						accept="image/jpeg,image/png"
						className="px-2 w-full bg-[#F4EFE3]"
						onChange={(event) => {
							// field.onChange([...Array.from(event.target.files ?? [])])
							// field.onChange(event.target?.files ?? undefined);
							handleImageChange(event);
							// setTicketImages([...ticketImages, event.target?.files?.[0]])
						}}
					/>
					<div className="grid grid-cols-2 gap-x-7 gap-y-7">
						{ticketImages?.map((item: any, index: any) => (
							<>
								<div
									key={index}
									className="mt-3"
									style={{
										width: 400,
										height: 400,
										borderRadius: "20px",
										position: "relative",
										overflow: "hidden",
									}}
									onClick={() => handleImageClick(index)}
								>
									<Image
										alt="vector background"
										src={item}
										layout="fill"
										objectFit="cover"
										// onClick={() => handleImageClick(index)}
										// onClick={()=>setIsDisplayImageModalOpen(index)}
									/>
									<span
										style={{
											top: 5,
											right: 5,
											width: 40,
											height: 40,
											borderRadius: "20px",
											position: "absolute",
											overflow: "hidden",
											background: "#ff000033",
											color: "white",
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											cursor: "pointer",
										}}
										// onClick={()=>removeTicketImage(index)}
										onClick={(e) => {
											e.stopPropagation(); // Prevent triggering the image click
											handleRemoveImage(index);
										}}
									>
										<MdClose size={24} />
									</span>
									<DisplayImageModal
										isOpen={
											isDisplayImageModalOpen === index
										}
										setIsOpen={setIsDisplayImageModalOpen}
										image={item}
									/>
								</div>
								{/* <div className="mt-3" style={{ display: shiftDown ? 'block' : 'none' }}>
                    <CButton
                    text={'Mettre a jour la preuve de paiement'} 
                    btnStyle={'outlineDark'}
                    onClick={()=>setIsUpdateProofModalFormOpen(true)}                          
                    />
                  </div> */}
							</>
						))}
					</div>
				</div>
			</div>

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
