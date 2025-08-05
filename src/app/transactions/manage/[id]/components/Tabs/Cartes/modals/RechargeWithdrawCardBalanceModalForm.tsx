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
import { TransactionService } from "@/api/services/transaction";
import {
	selectCurrentCustomerDetails,
	setCurrentCustomerDetails,
} from "@/redux/slices/customer";
import { useRef } from "react";
import { CardService } from "@/api/services/card";
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
});

const handleTransaction = async (queryData: any) => {
	const { cardId, adminUserId, customerId, label, body } = queryData;
	// console.log("handleTransaction : ", {currentUserId, customerId, label, body});
	// return {currentUserId, customerId, label, body}
	let response: any;
	if (label === "rechargeCard") {
		response = await CardService.recharge_card({
			cardId: cardId,
			customerId: customerId,
			adminUserId: adminUserId,
			body: body,
		});
	} else if (label === "withdrawCard") {
		response = await CardService.withdraw_card({
			cardId: cardId,
			customerId: customerId,
			adminUserId: adminUserId,
			body: body,
		});
	}
	// const { adminUserId, customerId } = req.query;
	// const { amount, author, reason } = req.body;
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

interface ModalProps {
	card?: any;
	customer?: any;
	index?: string | number;
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
const motifs: string[] = [
	"Recharge solde carte",
	"Retrait solde carte",
	// 'Test admin : recharge solde parrain',
	// 'Test admin : retrait solde parrain',
];

export default function RechargeWithdrawCardBalanceModalForm({
	index,
	card,
	customer,
}: ModalProps) {
	const pathname = usePathname();
	const redirectRef: any = useRef();

	const searchParams = useSearchParams();
	const isRechargeCard = searchParams.get(`rechargeCard${index ?? ""}`);
	const isWithdrawCard = searchParams.get(`withdrawCard${index ?? ""}`);
	const router = useRouter();
	// const navigate = useNavigate();
	const dispatch = useDispatch();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	const currentUser = useSelector(selectCurrentUser);
	const customerDetails: any = useSelector(selectCurrentCustomerDetails);

	const mutation = useMutation({
		mutationFn: (data) =>
			handleTransaction({
				adminUserId: currentUser?._id,
				cardId: card?.mapId,
				customerId: customer?._id,
				label: getFormLabels()?.label,
				body: data,
			}),
		onError: (err: any) => {
			console.error("onError : ", err.message);
			toast.error(`${getFormLabels()?.toastTextError} : ${err.message}`);
		},
		onSuccess: (data) => {
			console.log("onSuccess : ", data);
			// let newCustomerDetails;
			// if(isRechargeCard || isWithdrawCard) {
			//     newCustomerDetails = {...customerDetails, customer:{...customer, soldeCourant:data?.data?.updatedUser?.soldeCourant}}
			//     dispatch(setCurrentCustomerDetails(newCustomerDetails));
			// }
			// console.log("newCustomerDetails : ", newCustomerDetails);

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
		if (isRechargeCard) {
			return {
				title: "Recharger la carte",
				btnText: "Recharger la carte",
				btnStyle: "green",
				label: "rechargeCard",
				toastTextSuccess: "Recharge de la carte effectué avec succès",
				toastTextError: "Erreur lors de la recharge de la carte",
				note: "",
				min: 0,
				max: null,
			};
		} else if (isWithdrawCard) {
			return {
				title: "Retirer de la carte",
				btnText: "Retirer de la carte",
				btnStyle: "red",
				label: "withdrawCard",
				toastTextSuccess: "Retrait de la carte effectué avec succès",
				toastTextError: "Erreur lors du retrait de la carte",
				note: `(Montant maximal à retirer : ${customerDetails?.customer?.soldeCourant})`,
				min: 0,
				max: customerDetails?.customer?.soldeCourant,
			};
		}
	};

	return (
		<div className="bg-white m-auto p-8 rounded-md min-w-[350px] max-w-[500px]">
			<div className="flex justify-between mb-5 gap-10">
				<Title
					title={`${getFormLabels()?.title}`}
					titleLine2={`**** **** **** ${card?.number
						.slice(12)
						.trim()}`}
				/>
				{/* {customer.name} */}
				<Link href={pathname}>
					<FaX size={16} color={"#444"} />
				</Link>
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
									{/* <span className='text-xs text-gray-500'>{`${getFormLabels()?.note}`}</span> */}
									<FormControl>
										<Input
											type="number"
											min={getFormLabels()?.min ?? 0}
											// max={(isWithdrawCard) ? getFormLabels()?.max ?? 0 : 1000000000000000000000000 }
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
