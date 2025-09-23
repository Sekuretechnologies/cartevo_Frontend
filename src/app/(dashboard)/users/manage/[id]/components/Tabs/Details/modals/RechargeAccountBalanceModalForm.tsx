import CButton from "@/components/shared/CButton";
import Title from "@/components/shared/Title";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FaX } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/validation/FormValidation";
import { FaChevronRight } from "react-icons/fa";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "react-query";
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
import { TransactionService } from "@/api/services/v2/transaction";
import {
	selectCurrentCustomerDetails,
	setCurrentCustomerDetails,
} from "@/redux/slices/customer";
import { useRef, useState } from "react";
// import { useNavigate } from 'react-router-dom';
export const formSchema = z.object({
	author: z.object(
		{
			name: z.string({ message: "Choisir une personne" }),
			email: z.string().email(),
			phone: z.string(),
		},
		{ message: "Choisir une personne" }
	),
	amount: z.string({ message: "Entrez un montant" }),
	reason: z.string({ message: "Entrez un motif" }),
	description: z.string().optional(),
});

const handleTransaction = async (queryData: any) => {
	const { currentUserId, customerId, label, body } = queryData;
	// console.log("handleTransaction : ", {currentUserId, customerId, label, body});
	// return {currentUserId, customerId, label, body}
	const reason = body.description
		? `${body.reason} : ${body.description}`
		: body.reason;
	const response = await TransactionService.manage_user_account_transactions({
		userId: currentUserId,
		customerId: customerId,
		label: label,
		body: {
			author: body.author,
			amount: body.amount,
			reason: reason,
		},
	});
	if (!response.ok) {
		const responseBody = await response.json();
		// console.error(response);
		throw new Error(responseBody.message);
		// if (response.status === 403) {
		// throw new Error(responseBody.message);
		// } else {
		// throw new Error("Echec authentification. Veuillez indiquer votre email et votre mot de passe !");
		// }
	}
	const responseJson = await response.json();
	return responseJson;
};

interface TransferModalProps {
	customer?: any;
	action?: string;
	setIsOpen?: (data?: any) => void;
}
export type Person = {
	id?: number;
	name: string;
	email: string;
	phone?: string;
};

const persons: Person[] = [
	{
		name: "Kono Angoula Jean Christian",
		email: "sekuretechnologies@gmail.com",
		phone: "657954776",
	},
	{
		name: "KENOUYA Kevin",
		email: "kenouyakevin@gmail.com",
		phone: "680400475",
	},
	{
		name: "Ngongang Angoula Paul Alain",
		email: "paulangoula3@hotmail.com",
		phone: "683775643",
	},
	{
		name: "WAKAM Hermann",
		email: "wakam.hermann@gmail.com",
		phone: "697809127",
	},
	{
		name: "KAMGAING Steve",
		email: "kaamsteve@gmail.com",
		phone: " 697585416",
	},
];
const motifsCourant: string[] = [
	"Correction solde courant",
	"Reversement solde v1",
	"Reversement solde carte terminée v1",
	"Reversement solde carte terminée v2",
	"Recharge de compte recue par le partenaire mais non enregistrée en BD",
	"Recharge de carte echouée",
	"Mise a Zero solde courant",
	"Recharge solde courant",
	"Retrait solde courant",
];
const motifsParrainage: string[] = [
	"Correction solde parrainage",
	"Mise a Zero solde parrainage",
	"Depot solde parrainage",
	"Reversement dans le solde parrainage",
	"Retrait solde parrainage",
];

export default function RechargeAccountBalanceModalForm({
	customer,
	setIsOpen,
	action,
}: TransferModalProps) {
	const pathname = usePathname();
	const redirectRef: any = useRef();

	// const searchParams = useSearchParams();
	const isRechargeAccount = action === `rechargeAccount`;
	const isWithdrawAccount = action === `withdrawAccount`;
	const isRechargeSponsorshipAccount =
		action === `rechargeSponsorshipAccount`;
	const isWithdrawSponsorshipAccount =
		action === `withdrawSponsorshipAccount`;
	const router = useRouter();
	// const navigate = useNavigate();
	const dispatch = useDispatch();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	const currentUser = useSelector(selectCurrentUser);
	const customerDetails: any = useSelector(selectCurrentCustomerDetails);

	const [accountBalanceTo0, setAccountBalanceTo0] = useState(false);

	const motifs: string[] =
		isRechargeAccount || isWithdrawAccount
			? motifsCourant
			: motifsParrainage;

	const mutation = useMutation({
		mutationFn: (data) =>
			handleTransaction({
				currentUserId: "2f72f475-e166-403f-bb8c-1add80ec1748",
				customerId: customer?.id,
				label: getFormLabels()?.label,
				body: data,
			}),
		onError: (err: any) => {
			console.error("onError : ", err.message);
			toast.error(`${getFormLabels()?.toastTextError} : ${err.message}`);
		},
		onSuccess: (data) => {
			console.log("onSuccess : ", data);
			let newCustomerDetails;
			if (isRechargeAccount || isWithdrawAccount) {
				newCustomerDetails = {
					...customerDetails,
					customer: {
						...customer,
						balance_xaf: data?.data?.updatedUser?.balance_xaf,
					},
				};
				dispatch(setCurrentCustomerDetails(newCustomerDetails));
			} else if (
				isRechargeSponsorshipAccount ||
				isWithdrawSponsorshipAccount
			) {
				newCustomerDetails = {
					...customerDetails,
					customer: {
						...customer,
						balance_sponsorship_xaf:
							data?.data?.updatedUser?.balance_sponsorship_xaf,
					},
				};
				dispatch(setCurrentCustomerDetails(newCustomerDetails));
			}
			console.log("newCustomerDetails : ", newCustomerDetails);

			toast.success(`${getFormLabels()?.toastTextSuccess}`);
			redirectRef.current.href = window.location.pathname;
			redirectRef.current.click();
			// navigate(window.location.pathname);
			// router.push(window.location.pathname)
			// router.push(pathname);
		},
	});

	const onSubmit = (data: any) => {
		// console.log("pathname : ", pathname);
		mutation.mutate(data);
	};
	const onError = (err: any) => {
		console.error("any", err);
	};

	const getFormLabels = (amount?: string | number) => {
		if (isRechargeAccount) {
			return {
				title: "Recharger le compte courant de",
				btnText: "Recharger le compte courant",
				btnStyle: "green",
				label: "rechargeAccount",
				toastTextSuccess:
					"Recharge du compte courant effectué avec succès",
				toastTextError: "Erreur lors de la recharge du compte courant",
				note: "",
				min: 0,
				max: null,
			};
		} else if (isWithdrawAccount) {
			return {
				title: "Retirer du compte courant de",
				btnText: "Retirer du compte courant",
				btnStyle: "red",
				label: "withdrawAccount",
				toastTextSuccess:
					"Retrait du compte courant effectué avec succès",
				toastTextError: "Erreur lors du retrait du compte courant",
				note: `(Montant maximal à retirer : ${customerDetails?.customer?.balance_xaf})`,
				min: 0,
				max: customerDetails?.customer?.balance_xaf,
			};
		}
		if (isRechargeSponsorshipAccount) {
			return {
				title: "Recharger le compte parrainage de",
				btnText: "Recharger le compte parrainage",
				btnStyle: "green",
				label: "rechargeSponsorshipAccount",
				toastTextSuccess:
					"Recharge du compte parrainage effectué avec succès",
				toastTextError:
					"Erreur lors de la recharge du compte parrainage",
				note: "",
				min: 0,
				max: null,
			};
		} else if (isWithdrawSponsorshipAccount) {
			return {
				title: "Retirer du compte parrainage de",
				btnText: "Retirer du compte parrainage",
				btnStyle: "red",
				label: "withdrawSponsorshipAccount",
				toastTextSuccess:
					"Retrait du compte parrainage effectué avec succès",
				toastTextError: "Erreur lors du retrait du compte parrainage",
				note: `(Montant maximal à retirer : ${customerDetails?.customer?.balance_sponsorship_xaf})`,
				min: 0,
				max: customerDetails?.customer?.balance_sponsorship_xaf,
			};
		}
	};

	return (
		<div className="bg-white m-auto p-8 rounded-md min-w-[350px] max-w-[700px]">
			<div className="flex justify-between mb-5 gap-10">
				<Title
					title={`${getFormLabels()?.title}`}
					titleLine2={`${customer?.last_name} ${customer?.first_name}`}
				/>
				{/* {customer.name} */}
				{/* <Link href={pathname}>
                                <FaX size={16} color={"#444"} />
                            </Link> */}
				<div
					className="cursor-pointer"
					onClick={() => setIsOpen && setIsOpen(false)}
				>
					<FaX size={16} color={"#444"} />
				</div>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit, onError)}>
					<div className="space-y-[20px]">
						<FormField
							control={form.control}
							name="author"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm tracking-tight">
										Fait par
									</FormLabel>
									<FormControl>
										<Autocomplete
											{...field}
											disablePortal
											id="person-select"
											options={persons}
											getOptionLabel={(option: any) =>
												option.name
											}
											isOptionEqualToValue={(
												option: Person,
												value: Person
											) => _.isEqual(option, value)}
											className={`w-full bg-[#F4EFE3]`}
											sx={{ width: "100%" }}
											defaultValue={{
												id: 0,
												name: "",
												email: "",
												phone: "",
											}}
											value={
												field.value as unknown as Person
											}
											onChange={(_, data) =>
												field.onChange(data)
											}
											renderInput={(params) => (
												<TextField {...params} />
											)}
										/>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="amount"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-[500] tracking-tight">
										Montant
									</FormLabel>
									&nbsp;&nbsp;&nbsp;
									<span className="text-xs text-gray-500">{`${
										getFormLabels()?.note
									} `}</span>
									{isWithdrawAccount ||
									isWithdrawSponsorshipAccount ? (
										<>
											<span
												className="cursor-pointer text-gray-900 hover:text-red-500 text-sm font-[700] tracking-tight"
												onClick={() => {
													form.setValue(
														"amount",
														String(
															customerDetails
																?.customer
																?.balance_xaf
														)
													);
													// setAccountBalanceTo0(!accountBalanceTo0)
												}}
											>
												{` Vider`}
											</span>
										</>
									) : (
										<></>
									)}
									<FormControl>
										<Input
											type="number"
											step={0.01}
											min={getFormLabels()?.min ?? 0}
											max={
												isWithdrawAccount ||
												isWithdrawSponsorshipAccount
													? getFormLabels()?.max ?? 0
													: 1000000000000000000000000
											}
											className="px-2 w-full bg-[#F4EFE3]"
											{...field}
										/>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="reason"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-[500] tracking-tight">
										Motif
									</FormLabel>
									<FormControl>
										{/* <Textarea className="px-2 w-full bg-[#F4EFE3]" {...field} /> */}
										<Autocomplete
											{...field}
											disablePortal
											id="person-select"
											options={motifs}
											getOptionLabel={(option: string) =>
												option
											}
											isOptionEqualToValue={(
												option: string,
												value: string
											) => _.isEqual(option, value)}
											className={`w-full bg-[#F4EFE3]`}
											sx={{ width: "100%" }}
											defaultValue={""}
											value={
												field.value as unknown as string
											}
											onChange={(_, data) =>
												field.onChange(data)
											}
											renderInput={(params) => (
												<TextField {...params} />
											)}
										/>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-[500] tracking-tight">
										Details du motif
									</FormLabel>
									<FormControl>
										<Textarea
											className="px-2 w-full bg-[#F4EFE3]"
											{...field}
										/>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
					</div>

					<div
						style={{
							display:
								getFormLabels()?.max !== 0 ? "block" : "none",
						}}
						className={`mt-[10vh]`}
					>
						<CButton
							text={`${getFormLabels()?.btnText}`}
							btnStyle={`${
								getFormLabels()?.btnStyle as "green" | "red"
							}`}
							type={"submit"}
							iconLeft={<FaChevronRight />}
							width={"100%"}
							height={"35px"}
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

			{/* <div className='flex gap-5 mt-8'>
                <CButton
                text={'Voir utilisateur'}
                href={``}
                btnStyle={'dark'}
                icon={<FourDots />}  
                height={'32px'}            
                width={'100%'}
                />
                <CButton
                text={'Copier'}
                icon={<IoCopyOutline/>}
                btnStyle={'lightGreen'}
                height={'32px'}
                width={'100%'}
                />
        </div> */}
		</div>
	);
}
