"use client";
import { CustomerService } from "@/api/services/v2/customer";
import Title from "@/components/shared/Title";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { selectCurrentCustomerTicket } from "@/redux/slices_v2/customerticket";
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
import { Textarea } from "@/components/ui/textarea";
import DisplayImageModal from "./modals/DisplayImageModal";
import { useMutation } from "react-query";
import toast from "react-hot-toast";
import { selectCurrentUser } from "@/redux/slices/auth";
import { CustomerTicketService } from "@/api/services/v2/customerticket";
import {
	BsFillHandThumbsDownFill,
	BsFillHandThumbsUpFill,
} from "react-icons/bs";
import { MdClose } from "react-icons/md";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import { removeAllSpaces } from "@/utils/utils";
import { NotificationService } from "@/api/services/v2/notification";

declare global {
	interface Window {
		FileList: typeof FileList;
	}
}

const MAX_FILE_SIZE = 1024 * 1024 * 2; // 5MB in bytes
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];

export const customerTicketSchema = z.object({
	title: z.string(),
	content: z.string().optional(),
	user_phone: z.string().optional(),
	user_email: z.string().optional(),
	user_infos: z.string().optional(),
	transaction_infos: z.string().optional(),
	card_infos: z.string().optional(),
	user_id: z.string().optional(),
	transaction_id: z.string().optional(),
	card_id: z.string().optional(),
	status: z.string().optional(),
	// is_solved: z.string().optional(),
	priority: z.string().optional(),
	category_name: z.string().optional(),
	category_id: z.string().optional(),
	customer_support_name: z.string().optional(),
	customer_support_id: z.string().optional(),
	technical_support_name: z.string().optional(),
	technical_support_id: z.string().optional(),
	notes: z.array(z.string()).optional(),
	country: z.string().optional(),
	country_iso_code: z.string().optional(),
	main_image: z.instanceof(FileList).refine(
		(file) => {
			console.log("photo - file : ", file?.[0].size, file?.[0].type);
			const fileSizeOk = file?.[0].size <= MAX_FILE_SIZE;
			// const fileTypeOk = ACCEPTED_IMAGE_TYPES.includes(file?.[0].type);
			return file?.length == 1 && fileSizeOk;
			// return file.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file.type);
		},
		{
			message: "File must be under 5MB and of type jpg, png, or gif",
		}
	),
	images: z
		.array(
			z.instanceof(FileList).refine(
				(file) => {
					console.log(
						"photo - file : ",
						file?.[0].size,
						file?.[0].type
					);
					const fileSizeOk = file?.[0].size <= MAX_FILE_SIZE;
					// const fileTypeOk = ACCEPTED_IMAGE_TYPES.includes(file?.[0].type);
					return file?.length == 1 && fileSizeOk;
					// return file.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file.type);
				},
				{
					message:
						"File must be under 5MB and of type jpg, png, or gif",
				}
			)
		)
		.optional(),
});

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

const sendNotification = async (queryData: any) => {
	const { adminUserId, body } = queryData;

	if (!body?.target && (!body?.users || body?.users?.length <= 0)) {
		throw new Error("Veuillez selectionner une cible");
	}

	const response = await NotificationService.send_notifcation({
		adminUserId: adminUserId,
		body: body,
	});

	if (!response.ok) {
		const responseBody = await response.json();
		throw new Error(responseBody.message);
	}

	const responseJson = await response.json();
	return responseJson;
};

const handleUpdateCustomerTicket = async (queryData: any) => {
	const { ticketId, body, currentUserId, action } = queryData;

	const formData = new FormData();

	Object.entries(body || {})?.map(([key, value]: any[]) => {
		console.log({ key }, { value });
		if (key === "user_phone") {
			formData.append(`${key}`, value ? removeAllSpaces(value) : "");
		} else {
			formData.append(`${key}`, value || "");
		}
	});

	const response = await CustomerTicketService.update_customer_ticket({
		userId: currentUserId,
		action,
		ticketId,
		body: formData,
	});

	if (!response.ok) {
		const responseBody = await response.json();
		throw new Error(responseBody.message);
	}

	const responseJson = await response.json();

	// if(responseJson) {
	//   const cTicket = responseJson.data
	//   let notifTitle:string = '';
	//   let notifMsg:string = '';

	//   console.log({cTicket});

	//   if(cTicket.status==='SUCCESS') {
	//     notifTitle = `✅ La requête ${cTicket.reference} est résolue.`;
	//     notifMsg = `La requête ${cTicket.reference}: "${cTicket.title}" pour le client ${cTicket.user_name ? `${cTicket.user_name} ${cTicket.user_phone ? `(${cTicket.user_phone})` : cTicket.user_email ? `(${cTicket.user_email})` : ''}` : cTicket.user_phone ? cTicket.user_phone : cTicket.user_email ? cTicket.user_email : ''} est résolue.`;
	//     // if(){notifMsg+=``;}
	//     if(cTicket.notes && cTicket.notes?.length>0) {notifMsg+=`Veuillez lire les ${cTicket.notes?.length} notes qui l'accompagnent pour plus de details.`}
	//   }

	//   if(cTicket.status==='FAILED') {
	//     notifTitle = `❌ La requête ${cTicket.reference} n'a pas pu être résolue.`;
	//     notifMsg = `La requête ${cTicket.reference}: "${cTicket.title}" pour le client ${cTicket.user_name ? `${cTicket.user_name} ${cTicket.user_phone ? `(${cTicket.user_phone})` : cTicket.user_email ? `(${cTicket.user_email})` : ''}` : cTicket.user_phone ? cTicket.user_phone : cTicket.user_email ? cTicket.user_email : ''} n'a pas pu être résolue.`;
	//     // if(){notifMsg+=``;}
	//     if(cTicket.notes && cTicket.notes?.length>0) {notifMsg+=`Veuillez lire les ${cTicket.notes?.length} notes qui l'accompagnent pour plus de details.`}
	//   }
	//   if(cTicket.status==='SUCCESS' || cTicket.status==='FAILED') {
	//     const resNotif = await sendNotification({adminUserId:currentUserId, body:{
	//       title: notifTitle,
	//       content: notifMsg,
	//       target: "customer-support", // "custom",
	//       // users: ["676633724"]
	//       // users: ["e852f3aa-79bf-4fcc-bc51-7e0eb50b93ef"]
	//     }});
	//   }
	// }

	return responseJson;
};

export default function Details() {
	const pathname = usePathname();
	const currentUser: any = useSelector(selectCurrentUser);
	const [isDisplayImageModalOpen, setIsDisplayImageModalOpen] =
		useState(false);
	const redirectRef: any = useRef();
	const cTicketData: any = useSelector(selectCurrentCustomerTicket);
	const [action, setAction] = useState("responsibility");
	const MAX_TAGS = 5;
	//Retrieve all the returned items from the hook
	// const { tags, handleAddTag, handleRemoveTag } = useTags(MAX_TAGS); // pass the maximum tags

	const form = useForm<z.infer<typeof customerTicketSchema>>({
		resolver: zodResolver(customerTicketSchema),
		defaultValues: {
			title: cTicketData?.title,
			content: cTicketData?.content,
			user_phone: cTicketData?.user_phone,
			user_email: cTicketData?.user_email,
			user_infos: cTicketData?.user_infos,
			transaction_infos: cTicketData?.transaction_infos,
			card_infos: cTicketData?.card_infos,
			user_id: cTicketData?.user_id,
			transaction_id: cTicketData?.transaction_id,
			card_id: cTicketData?.card_id,
			status: getLabelByKey(cTicketData?.status, statusData),
			// is_solved: cTicketData?.is_solved,
			priority: getLabelByKey(cTicketData?.priority, priorityData),
			category_name: cTicketData?.category_name,
			category_id: cTicketData?.category_id,
			customer_support_name: cTicketData?.customer_support_name,
			customer_support_id: cTicketData?.customer_support_id,
			technical_support_name: cTicketData?.technical_support_name,
			technical_support_id: cTicketData?.technical_support_id,
			notes: cTicketData?.notes,
			country: cTicketData?.country,
			country_iso_code: cTicketData?.country_iso_code,
		},
	});

	const mutation = useMutation({
		mutationFn: (data) =>
			handleUpdateCustomerTicket({
				ticketId: cTicketData?.id,
				currentUserId: currentUser?.id,
				body: data,
				action: action,
			}),
		onError: (err: any) => {
			console.error("onError : ", err.message);
			toast.error(`Erreur lors de la modification : ${err.message}`);
		},
		onSuccess: (data) => {
			console.log("onSuccess : ", data);
			toast.success(`Modification effectuée avec succès`);
			redirectRef.current.href = window.location.pathname;
			redirectRef.current.click();
		},
	});

	const handleUpdateTicket = (data: any) => {
		mutation.mutate(data);
	};

	const onSubmit = (data: any) => {
		// console.log(form.getValues("tags"));
		// setIsConfirmSubmitModalOpen(true);
		console.log("onSubmit data : ", data, { formValues: form.getValues() });
		// mutation.mutate(data);
	};
	const onError = (err: any) => {
		console.error("onError", err);
	};

	/** ------------------------------------------------- */
	const [shiftDown, setShiftDown] = useState(false);
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.shiftKey) {
				setShiftDown(true);
			}
		};
		const handleKeyUp = () => {
			setShiftDown(false);
		};
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, []);
	/** ------------------------------------------------- */

	// const removeTicketImage = (imgIndex: any) => {
	//   const newImages = ticketImages.filter((_:any, index:any) => index !== imgIndex);
	//   const newImagesToSubmit = ticketImagesToSubmit.filter((_:any, index:any) => index !== imgIndex);
	//   setTicketImages(newImages)
	//   setTicketImagesToSubmit(newImagesToSubmit)
	// };

	const handleImageClick = useCallback(
		(index: any) => {
			setIsDisplayImageModalOpen(index);
		},
		[setIsDisplayImageModalOpen]
	);

	// const handleRemoveImage = useCallback((index:any) => {
	//   removeTicketImage(index);
	// }, [removeTicketImage]);

	return (
		<div className="flex-1">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-3 mt-5 w-full"
				>
					<div className="w-full flex items-center justify-between gap-5">
						<span className="text-xl">
							{cTicketData?.reference}
						</span>

						{cTicketData?.status === "PENDING" ||
						cTicketData?.status === "FAILED" ? (
							<CButton
								text={`Je m'en charge`}
								btnStyle={"green"}
								icon={<BsFillHandThumbsUpFill />}
								onClick={() =>
									handleUpdateTicket({
										responsibility: true,
										status: "ONGOING",
									})
								}
							/>
						) : cTicketData?.status === "ONGOING" ? (
							<div className="flex gap-5 items-center">
								<CButton
									text={`J'ai résolu`}
									btnStyle={"green"}
									icon={<FaCheck />}
									onClick={() =>
										handleUpdateTicket({
											responsibility: true,
											status: "SUCCESS",
										})
									}
								/>
								<CButton
									text={`Je laisse tomber`}
									btnStyle={"yellow"}
									icon={<BsFillHandThumbsDownFill />}
									onClick={() =>
										handleUpdateTicket({
											responsibility: true,
											status: "PENDING",
										})
									}
								/>
								<CButton
									text={`Pas de solution`}
									btnStyle={"red"}
									icon={<MdClose />}
									onClick={() =>
										handleUpdateTicket({
											responsibility: true,
											status: "FAILED",
										})
									}
								/>
							</div>
						) : (
							<></>
						)}
					</div>
					<div className="pr-6 flex-1 w-full">
						<Title title="Informations requete client" />
						<div className="w-full flex flex-col gap-7 mb-7">
							<div className="grid grid-cols-2 gap-x-7 gap-y-7">
								<FormField
									control={form.control}
									name="status"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
												Statut
											</FormLabel>
											<FormControl>
												{/* <Input className="px-6 font-normal bg-gray-200" {...field}  readOnly /> */}
												{cTicketData.status ==
												"SUCCESS" ? (
													<LabelWithBadge
														className={`text-md`}
														label={"Résolu"}
														badgeColor={"#1F66FF"}
														textColor={"#444"}
													/>
												) : cTicketData.status ==
												  "FAILED" ? (
													<LabelWithBadge
														className={`text-md`}
														label={"Fermé"}
														badgeColor={"#F85D4B"}
														textColor={"#444"}
													/>
												) : cTicketData.status ==
												  "ONGOING" ? (
													<LabelWithBadge
														className={`text-md`}
														label={
															"En cours de traitement"
														}
														badgeColor={"#007FFF"}
														textColor={"#444"}
													/>
												) : cTicketData.status ==
												  "PENDING" ? (
													<LabelWithBadge
														className={`text-md`}
														label={"En attente"}
														badgeColor={"#FFDB5A"}
														textColor={"#444"}
													/>
												) : (
													<></>
												)}
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="priority"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
												Priorité
											</FormLabel>
											<FormControl>
												{/* <Input className="px-6 font-normal bg-gray-200" {...field}  readOnly /> */}
												{cTicketData.priority == "1" ? (
													<LabelWithBadge
														className={`text-md`}
														label={"Faible"}
														badgeColor={"#964B00"}
														textColor={"#444"}
													/>
												) : cTicketData.priority ==
												  "2" ? (
													<LabelWithBadge
														className={`text-md`}
														label={"Moyen"}
														badgeColor={"#007FFF"}
														textColor={"#444"}
													/>
												) : cTicketData.priority ==
												  "3" ? (
													<LabelWithBadge
														className={`text-md`}
														label={"Elevé"}
														badgeColor={"#1F66FF"}
														textColor={"#444"}
													/>
												) : cTicketData.priority ==
												  "4" ? (
													<LabelWithBadge
														className={`text-md`}
														label={"Urgent"}
														badgeColor={"#F85D4B"}
														textColor={"#444"}
													/>
												) : (
													<></>
												)}
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name="category_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
											Catégorie
										</FormLabel>
										<FormControl>
											<Input
												className="px-6 font-normal bg-gray-200"
												{...field}
												readOnly
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
											Titre
										</FormLabel>
										<FormControl>
											<Input
												className="px-6 font-normal bg-gray-200"
												{...field}
												readOnly
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="content"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
											Contenu
										</FormLabel>
										<FormControl>
											<Textarea
												className="px-6 font-normal bg-gray-200"
												{...field}
												rows={10}
												readOnly
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						<div className="pr-6 py-3 flex-1 w-full">
							<Title title="Informations utilisateur" />
							<div className="w-full flex flex-col gap-7">
								{cTicketData?.user_id ? (
									<div className="text-[#18BC7A]">
										<a
											className="flex gap-3 text-xl font-bold"
											href={`/dashboard/v2/users_accounts/manage/${cTicketData?.user_id}`}
										>
											{cTicketData?.user_name}{" "}
											<FaExternalLinkAlt color="#1F66FF" />
										</a>
									</div>
								) : (
									<></>
								)}
								<div className="grid grid-cols-3 gap-x-7 gap-y-7 mt-5">
									<FormField
										control={form.control}
										name="user_phone"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
													Téléphone
												</FormLabel>
												<FormControl>
													<Input
														className="px-6 bg-gray-200"
														{...field}
														readOnly
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
													Email
												</FormLabel>
												<FormControl>
													<Input
														placeholder="abc@sekure.xyz"
														className="px-6 font-normal bg-gray-200"
														{...field}
														readOnly
													/>
												</FormControl>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="country"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
													Pays de résidence
												</FormLabel>
												<FormControl>
													<Input
														className="px-6 bg-gray-200"
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
									name="user_infos"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
												Autres infos
											</FormLabel>
											<FormControl>
												<Textarea
													className="px-6 font-normal bg-gray-200"
													{...field}
													readOnly
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</div>

						<div className="pr-6 py-3 flex-1 w-full">
							<Title title="Informations carte" />
							<div className="w-full flex flex-col gap-7">
								<FormField
									control={form.control}
									name="card_infos"
									render={({ field }) => (
										<FormItem>
											{/* <FormLabel className="text-gray-900 text-sm font-semibold tracking-tight"></FormLabel> */}
											<FormControl>
												<Textarea
													className="px-6 font-normal bg-gray-200"
													{...field}
													readOnly
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</div>

						<div className="pr-6 py-3 flex-1 w-full">
							<Title title="Informations transaction" />
							<div className="w-full flex flex-col gap-7">
								<FormField
									control={form.control}
									name="transaction_infos"
									render={({ field }) => (
										<FormItem>
											{/* <FormLabel className="text-gray-900 text-sm font-semibold tracking-tight"></FormLabel> */}
											<FormControl>
												<Textarea
													className="px-6 font-normal bg-gray-200"
													{...field}
													readOnly
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</div>
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
											<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">{`Support client`}</FormLabel>
											<FormControl>
												<Input
													className="px-6 font-normal bg-gray-200"
													{...field}
													readOnly
												/>
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
												<Input
													className="px-6 font-normal bg-gray-200"
													{...field}
													readOnly
												/>
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
					{/* <Input 
              type="file" 
              // accept="image/jpeg,image/png,image/gif"
              // accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              accept="image/jpeg,image/png"
              className="px-2 w-full bg-[#F4EFE3]"
              onChange={(event) => {
                  // field.onChange([...Array.from(event.target.files ?? [])])
                  // field.onChange(event.target?.files ?? undefined);
                  handleImageChange(event)
                  // setTicketImages([...ticketImages, event.target?.files?.[0]])
              }}/> */}
					<div className="grid grid-cols-2 gap-x-7 gap-y-7">
						{cTicketData?.images?.map((item: any, index: any) => (
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
										// onClick={()=>setIsDisplayImageModalOpen(true)}
									/>
									{/* <span 
                    style={{top:5, right:5, width: 40, height: 40, borderRadius:'20px', position: 'absolute', overflow:'hidden', background:'#ff000033', color:'white', display:'flex', justifyContent:'center', alignItems:'center', cursor:'pointer'}}
                    onClick={()=>removeTicketImage(index)}>
                      <MdClose size={24}/>
                    </span> */}
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
