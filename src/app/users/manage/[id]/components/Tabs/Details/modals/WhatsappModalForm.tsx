import CButton from "@/components/shared/CButton";
import Title from "@/components/shared/Title";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FaX } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/validation/FormValidation";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "react-query";
import { HashLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, setCredentials } from "@/redux/slices/auth";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import { Textarea } from "@/components/ui/textarea";
import {
	Autocomplete,
	Box,
	Chip,
	MenuItem,
	OutlinedInput,
	TextField,
} from "@mui/material";
import _ from "lodash";
import { TransactionService } from "@/api/services/transaction";
import {
	selectCurrentCustomerDetails,
	setCurrentCustomerDetails,
} from "@/redux/slices/customer";
import { useEffect, useRef, useState } from "react";
import { User } from "lucide-react";
import { UserService } from "@/api/services/user";
import DialogWrapper from "@/components/shared/DialogWrapper";
import { Switch } from "@/components/ui/switch";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import { MdCheck, MdClose } from "react-icons/md";
import { CustomerService } from "@/api/services/v2/customer";
import { FaCircle, FaRegSmile } from "react-icons/fa";
import { TagField } from "@/components/shared/TagField";
import { TagFieldSelect } from "@/components/shared/TagFieldSelect";
import { selectKYCWarningsList } from "@/redux/slices_v2/kyc";
import { NotificationService } from "@/api/services/v2/notification";
import EmojiPicker from "emoji-picker-react";
import { IoIosSend } from "react-icons/io";
import { useClickAway } from "react-use";

export const formSchema = z
	.object({
		title: z.string({ message: "Entrez un titre" }),
		content: z.string({ message: "Entrez un contenu" }),
		target: z.string({ message: "Selectionnez une cible" }),
		users: z.array(z.string()).optional(),
	})
	.refine(
		(data) => {
			// console.log("data.target :: ", data.target);
			console.log("data.users :: ", data.users);
			console.log("data.users?.length :: ", data.users?.length);
			return data.users && data.users?.length > 0;
		},
		{
			message: `Veuillez selectionner des utilisateurs`,
			path: ["users"], // Specify the path to show error on
		}
	);

const sendNotification = async (queryData: any) => {
	const { cardId, adminUserId, body } = queryData;

	if (!body?.target && (!body?.users || body?.users?.length <= 0)) {
		throw new Error("Veuillez selectionner une cible");
	}

	const response = await NotificationService.send_whatsapp_notifcation({
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

interface ModalProps {
	customer: any;
	isOpen: boolean;
	setIsOpen: (data?: any) => void;
}
export type Person = {
	id?: number;
	name: string;
	email: string;
	phone?: string;
};

const kycStatuses: any = {
	APPROVED: "Approuvé",
	DECLINED: "Rejeté",
};

export default function WhatsappModalForm({
	isOpen,
	setIsOpen,
	customer,
}: ModalProps) {
	const emojiRef1 = useRef(null);
	const emojiRef2 = useRef(null);
	useClickAway(emojiRef1, () => {
		setShowPicker(false);
	});
	useClickAway(emojiRef2, () => {
		setShowPicker2(false);
	});
	const [showPicker, setShowPicker] = useState(false);
	const [showPicker2, setShowPicker2] = useState(false);
	const [showGroupTab, setShowGroupTab] = useState(true);
	const [showPersonTab, setShowPersonTab] = useState(false);
	const [showTargetError, setShowTargetError] = useState(false);
	const [showUsersError, setShowUsersError] = useState(false);
	const pathname = usePathname();
	const redirectRef: any = useRef();
	const currentUser = useSelector(selectCurrentUser);
	const customerDetails: any = useSelector(selectCurrentCustomerDetails);

	const mutation = useMutation({
		mutationFn: (data) =>
			sendNotification({ adminUserId: currentUser?._id, body: data }),
		onError: (err: any) => {
			console.error("onError : ", err.message);
			toast.error(
				`Echec lors de l'envoi du message Whatsapp : ` + err.message
			);
		},
		onSuccess: (data) => {
			console.log("onSuccess : ", data);
			toast.success(`Whatsapp envoyé avec succes.`);
			redirectRef.current.href = window.location.pathname;
			redirectRef.current.click();
		},
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: undefined,
			content: undefined,
			target: "custom",
			users: [customer.phone],
		},
	});

	const onSubmit = (data: any) => {
		console.log("START onSubmit data : ", data);
		if (data.target === "custom" && data.users.length < 1) {
			setShowUsersError(true);
		} else if (!data.target) {
			if (showPersonTab) data.target = "custom";
			else {
				setShowTargetError(true);
				return;
			}
		} else {
			setShowTargetError(false);
			setShowUsersError(false);
		}

		console.log("END onSubmit data : ", data);
		// return
		mutation.mutate(data);
	};

	// useEffect(() => {
	//   console.log('showUsersError ::: ', showUsersError);
	// }, [showUsersError])

	const onError = (err: any) => {
		console.error("onError", err);
	};

	const handleTargetChange = (data: any) => {
		const value = data.target.value;
		console.log("target", value);
		form.setValue("target", value);
	};

	const handleUsersPhonesChange = (data: any) => {
		const newData = data?.map((item: any) => {
			return item.trim();
		});
		form.setValue("users", newData);
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	return (
		<DialogWrapper
			open={isOpen}
			handleClose={handleClose}
			title={`Envoyer un whatsapp à`}
			titleLine2={`${customer?.first_name} ${customer?.last_name}`}
		>
			<div className="min-w-[350px] max-w-[700px]">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit, onError)}>
						<div className="w-full flex flex-col gap-7">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
											Titre
										</FormLabel>
										<FormControl>
											<div className="relative bg-[#F4EFE3] pr-3 rounded-md flex gap-3 items-center justify-center">
												<Input
													className={`px-6 text-md text-gray-900 font-normal bg-[#F4EFE3]`}
													value={field.value}
													onChange={(e) =>
														form.setValue(
															"title",
															e.target.value
														)
													}
												/>
												<FaRegSmile
													size={24}
													onClick={() =>
														setShowPicker(
															(val) => !val
														)
													}
												/>

												{showPicker && (
													<div
														ref={emojiRef1}
														className={`shadow-lg`}
														style={{
															position:
																"absolute",
															top: "40px",
															right: "0",
															zIndex: "1000",
														}}
													>
														<EmojiPicker
															onEmojiClick={(
																emj: any
															) => {
																form.setValue(
																	"title",
																	(form.getValues(
																		"title"
																	) ?? "") +
																		" " +
																		emj.emoji
																);
															}}
														/>
													</div>
												)}
											</div>
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
											Contenu
										</FormLabel>
										<FormControl>
											<div className="relative bg-[#F4EFE3] pr-3 pt-3 rounded-md flex gap-3 items-start justify-center">
												<Textarea
													id="Texte"
													className={`px-6 text-md text-gray-900 font-normal bg-[#F4EFE3]`}
													rows={5}
													value={field.value}
													onChange={(e) =>
														form.setValue(
															"content",
															e.target.value
														)
													}
												/>

												<FaRegSmile
													size={24}
													onClick={() =>
														setShowPicker2(
															(val) => !val
														)
													}
												/>
												{showPicker2 && (
													<div
														ref={emojiRef2}
														className={`shadow-lg`}
														style={{
															position:
																"absolute",
															top: "40px",
															right: "0",
															zIndex: "1000",
														}}
													>
														<EmojiPicker
															onEmojiClick={(
																emj: any
															) => {
																form.setValue(
																	"content",
																	(form.getValues(
																		"content"
																	) ?? "") +
																		" " +
																		emj.emoji
																);
															}}
														/>
													</div>
												)}
											</div>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
						</div>

						<div className={`mt-[10vh]`}>
							<CButton
								text={`Envoyer`}
								btnStyle="green"
								type={"submit"}
								width={"100%"}
								icon={<IoIosSend />}
							/>
						</div>
						<div
							className={classNames(
								"transition-all invisible z-20 bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center",
								{
									"!opacity-100 !visible z-20":
										mutation.isLoading,
								}
							)}
						>
							<HashLoader
								className="shrink-0"
								size={50}
								color="#1F66FF"
							/>
						</div>
						{/* <Button type="submit" className="w-[272px] mt-[10vh] bg-[#18BC7A] hover:bg-[#FFDB5A] hover:text-[#18BC7A] rounded-full">Connexion</Button> */}
					</form>
				</Form>
				<a ref={redirectRef} hidden href="#"></a>
			</div>
		</DialogWrapper>
	);
}
