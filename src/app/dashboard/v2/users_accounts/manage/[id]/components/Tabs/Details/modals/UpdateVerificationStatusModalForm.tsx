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
import { FaCircle } from "react-icons/fa";
import { TagField } from "@/components/shared/TagField";
import { TagFieldSelect } from "@/components/shared/TagFieldSelect";
import { selectKYCWarningsList } from "@/redux/slices_v2/kyc";

export const formSchema: any = z
	.object({
		is_number_verified: z.boolean().default(false).optional(),
		is_email_verified: z.boolean().default(false).optional(),
		kyc_result: z.string({ message: "Ce champ est requis" }),
		kyc_status: z.string({ message: "Ce champ est requis" }),
		kyc_warnings: z.array(z.string({ message: "Ce champ est requis" })),
		id_document_front: z.string().optional(),
		id_document_back: z.string().optional(),
		id_selfie: z.string().optional(),
	})
	.refine(
		(data) => {
			// console.log("data.kyc_result === 'APPROVED' || data.kyc_result === 'DECLINED' :: ",
			//     data.kyc_result === 'APPROVED' || data.kyc_result === 'DECLINED'
			// );
			return (
				data.kyc_result === "APPROVED" || data.kyc_result === "DECLINED"
			);
		},
		{
			message: `Veuillez specifier le resultat de la verification KYC`,
			path: ["kyc_result"], // Specify the path to show error on
		}
	)
	.refine(
		(data) => {
			// console.log("data.kyc_result === 'DECLINED' :: ",
			//     data.kyc_result === 'DECLINED'
			// );
			// console.log("data.kyc_warnings?.length > 0 :: ",
			//     data.kyc_warnings?.length > 0
			// );
			// console.log("data.kyc_result === 'DECLINED' && data.kyc_warnings?.length > 0 :: ",
			//     (data.kyc_result === 'APPROVED' || (data.kyc_result === 'DECLINED' && data.kyc_warnings?.length > 0))
			// );
			return (
				data.kyc_result === "APPROVED" ||
				(data.kyc_result === "DECLINED" &&
					data.kyc_warnings?.length > 0)
			);
		},
		{
			message: `Veuillez specifier au moins un motif de rejet`,
			path: ["kyc_warnings"], // Specify the path to show error on
		}
	);

const handleUpdate = async (queryData: any) => {
	const { currentUserId, customerId, body } = queryData;
	// return {currentUserId, customerId, body}
	const updates = {
		is_number_verified: body.is_number_verified,
		is_email_verified: body.is_email_verified,
		kyc_result: body.kyc_result,
		kyc_status: body.kyc_status,
		kyc_warnings: body.kyc_result === "DECLINED" ? body.kyc_warnings : null,
	};
	console.log("handleUpdate : ", { currentUserId, customerId, updates });
	const response = await CustomerService.update_one_customer({
		userId: currentUserId,
		customerId: customerId,
		body: updates,
	});
	if (!response.ok) {
		const responseBody = await response.json();
		throw new Error(responseBody.message);
	}
	const responseJson = await response.json();
	return responseJson;
};

interface ModalProps {
	customer?: any;
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

export default function UpdateVerificationStatusModalForm({
	isOpen,
	setIsOpen,
	customer,
}: ModalProps) {
	const pathname = usePathname();
	const redirectRef: any = useRef();

	const [isDeclined, setIsDeclined] = useState(
		customer?.kyc_result === "DECLINED"
	);

	const handleClose = () => {
		setIsOpen(false);
	};

	const searchParams = useSearchParams();
	const router = useRouter();
	// const navigate = useNavigate();
	const dispatch = useDispatch();
	const kycWarningsList: string = useSelector(selectKYCWarningsList);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			is_number_verified: customer?.is_number_verified ?? false,
			is_email_verified: customer?.is_email_verified ?? false,
			kyc_result: customer?.kyc_result ?? "",
			kyc_status: customer?.kyc_status ?? "",
			kyc_warnings: customer?.kyc_warnings ? customer?.kyc_warnings : [],
			id_document_front: customer?.id_document_front?.startsWith("http")
				? customer?.id_document_front
				: "",
			id_document_back: customer?.id_document_back?.startsWith("http")
				? customer?.id_document_back
				: "",
			id_selfie: customer?.id_selfie?.startsWith("http")
				? customer?.id_selfie
				: "",
		},
	});

	const currentUser = useSelector(selectCurrentUser);
	// const customerDetails:any = useSelector(selectCurrentCustomerDetails);

	const mutation = useMutation({
		mutationFn: (data) =>
			handleUpdate({
				currentUserId: currentUser?._id,
				customerId: customer?.id,
				body: data,
			}),
		onError: (err: any) => {
			console.error("onError : ", err.message);
			toast.error(
				`Erreur mise a jour du statut de verification : ` + err.message
			);
		},
		onSuccess: (data) => {
			console.log("onSuccess : ", data);
			toast.success(
				`Le statut de verification a été mis à jour avec succès.`
			);
			redirectRef.current.href = window.location.pathname;
			redirectRef.current.click();
		},
	});

	const onSubmit = (data: any) => {
		// console.log("pathname : ", pathname);
		console.log("form.getValues() ::", form.getValues());
		mutation.mutate(data);
	};
	const onError = (err: any) => {
		console.error("onError : ", err);
	};

	const handleKYCResult = (key: string, checked: boolean) => {
		// console.log("key - checked :: ", key, checked);

		if (checked && key == "APPROVED") {
			form.setValue("kyc_result", key);
			form.setValue("kyc_status", "COMPLETED");
			setIsDeclined(false);
		} else if (checked && key == "DECLINED") {
			form.setValue("kyc_result", key);
			form.setValue("kyc_status", "COMPLETED");
			setIsDeclined(true);
		} else {
			form.setValue("kyc_result", "UNKNOWN");
			form.setValue("kyc_status", "PENDING");
			setIsDeclined(false);
		}
	};

	return (
		<DialogWrapper
			open={isOpen}
			handleClose={handleClose}
			title={`Mise à jour du statut de verification de`}
			titleLine2={`${customer?.first_name} ${customer?.last_name}`}
		>
			<div className="min-w-[350px] max-w-[700px]">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit, onError)}>
						<div className="space-y-[20px]">
							<FormField
								control={form.control}
								name="is_number_verified"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between">
										<FormLabel className="text-sm font-semibold">
											Vérification numéro de téléphone
										</FormLabel>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
												className="data-[state=checked]:bg-[#18BC7A]"
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="is_email_verified"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between">
										<FormLabel className="text-sm font-semibold">
											Vérification email
										</FormLabel>
										<FormControl>
											<Switch
												checked={field.value}
												// onChange={(e)=>field.onChange(e.target.checked)}
												onCheckedChange={field.onChange}
												className="data-[state=checked]:bg-[#18BC7A]"
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormItem>
								<FormLabel className="text-gray-900 text-sm font-[500] tracking-tight">{`Documents d'identification`}</FormLabel>
								<div>
									{form.getValues("id_document_front") ? (
										<LabelWithBadge
											icon={<MdCheck color={"#1F66FF"} />}
											className={`text-sm`}
											label={`Recto`}
											badgeColor={"#1F66FF"}
											textColor={"#444"}
										/>
									) : (
										<LabelWithBadge
											icon={<MdClose color={"#F85D4B"} />}
											className={`text-sm`}
											label={`Recto`}
											badgeColor={"#F85D4B"}
											textColor={"#444"}
										/>
									)}
									{form.getValues("id_document_back") ? (
										<LabelWithBadge
											icon={<MdCheck color={"#1F66FF"} />}
											className={`text-sm`}
											label={`Verso`}
											badgeColor={"#1F66FF"}
											textColor={"#444"}
										/>
									) : (
										<LabelWithBadge
											icon={<MdClose color={"#F85D4B"} />}
											className={`text-sm`}
											label={`Verso`}
											badgeColor={"#F85D4B"}
											textColor={"#444"}
										/>
									)}
									{form.getValues("id_selfie") ? (
										<LabelWithBadge
											icon={<MdCheck color={"#1F66FF"} />}
											className={`text-sm`}
											label={`Selfie`}
											badgeColor={"#1F66FF"}
											textColor={"#444"}
										/>
									) : (
										<LabelWithBadge
											icon={<MdClose color={"#F85D4B"} />}
											className={`text-sm`}
											label={`Selfie`}
											badgeColor={"#F85D4B"}
											textColor={"#444"}
										/>
									)}
								</div>
							</FormItem>
							<>
								{/* <FormItem>
                        { 
                            (form.getValues('kyc_result') == 'APPROVED' || form.getValues('kyc_result') == 'DECLINED') 
                            && <FormLabel className="text-gray-900 text-sm font-[500] tracking-tight">{`Statut KYC`}</FormLabel>
                        }                        
                        </FormItem>
                        <FormItem>
                        {
                            form.getValues('kyc_result') == 'APPROVED' ?
                            <LabelWithBadge icon={<MdCheck color={'#18BC7A'} />} className={`text-sm`} label={`Approuvé`} badgeColor={'#18BC7A'} textColor={'#444'}/>
                            : form.getValues('kyc_result') == 'DECLINED' ?
                            <LabelWithBadge icon={<MdClose color={'#F85D4B'} />}className={`text-sm`} label={`Refusé`} badgeColor={'#F85D4B'} textColor={'#444'}/>
                            : <></>
                        } 
                        </FormItem> */}
							</>
							<FormField
								control={form.control}
								name="kyc_result"
								render={({ field }) => (
									<FormItem className="">
										<FormLabel className="text-sm font-semibold">
											Statut KYC
										</FormLabel>
										<FormControl>
											<div className="grid grid-cols-1 w-[100%]">
												{Object.entries(
													kycStatuses
												).map(([key, value]: any[]) => {
													const color =
														form.getValues(
															"kyc_result"
														) === key &&
														key == "APPROVED"
															? "#1F66FF"
															: form.getValues(
																	"kyc_result"
															  ) === key &&
															  key == "DECLINED"
															? "#F85D4B"
															: "#444";
													return (
														<label
															key={key}
															htmlFor={`customCheckbox${key}`}
															className="flex items-center cursor-pointer"
														>
															<div className="relative">
																<Switch
																	checked={
																		form.getValues(
																			"kyc_result"
																		) ===
																		key
																	}
																	onCheckedChange={(
																		checked: boolean
																	) =>
																		handleKYCResult(
																			key,
																			checked
																		)
																	}
																	className={
																		key ==
																		"APPROVED"
																			? `data-[state=checked]:bg-[#18BC7A]`
																			: key ==
																			  "DECLINED"
																			? `data-[state=checked]:bg-[#F85D4B]`
																			: ``
																	}
																/>
															</div>
															<div
																className={`pl-3 py-4 text-sm`}
																style={{
																	color:
																		form.getValues(
																			"kyc_result"
																		) ===
																			key &&
																		key ==
																			"APPROVED"
																			? "#1F66FF"
																			: form.getValues(
																					"kyc_result"
																			  ) ===
																					key &&
																			  key ==
																					"DECLINED"
																			? "#F85D4B"
																			: "#444",
																}}
															>
																{value}
															</div>
														</label>
													);
												})}
											</div>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>

							{isDeclined ? (
								<FormField
									control={form.control}
									name="kyc_warnings"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight">
												Motifs de rejet
											</FormLabel>
											<FormControl>
												<TagFieldSelect
													field={field}
													tags={field?.value}
													onChange={(data: any) =>
														form.setValue(
															"kyc_warnings",
															data
														)
													}
													max={1000}
													dict={kycWarningsList}
													plchldr={"Choisir un motif"}
												/>
											</FormControl>
											<FormMessage className="text-red-400" />
										</FormItem>
									)}
								/>
							) : (
								<></>
							)}
						</div>

						<div className={`mt-[10vh]`}>
							<CButton
								text={`Enregistrer`}
								btnStyle="green"
								type={"submit"}
								width={"100%"}
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
