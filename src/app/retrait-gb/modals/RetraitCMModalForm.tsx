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
import {
	selectCurrentGetSekureApiToken,
	selectCurrentUser,
	setCredentials,
} from "@/redux/slices/auth";
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
import { useRef, useState } from "react";
import { CameroonService } from "@/api/services/cameroon";
import { getCurrentDateTime } from "@/utils/utils";
import CheckBJPayoutStatus from "../components/CheckBJPayoutStatus";
import { BeninService } from "@/api/services/benin";
import { Select, SelectItem } from "@nextui-org/select";
// import { useNavigate } from 'react-router-dom';
export const formSchema = z.object({
	amount: z.string({ message: "Entrez un montant" }),
	phone: z.string({ message: "Entrez un numero de telephone" }),
	operator: z.string({ message: "Entrez un numero de telephone" }),
});

const handleBalanceWithdrawal = async (queryData: any) => {
	const { userId, data } = queryData;
	// console.log("handleTransaction : ", {currentUserId, customerId, label, body});
	// return {currentUserId, customerId, label, body}
	const response = await CameroonService.handle_cameroon_balance_withdrawal({
		userId,
		phone: data?.phone,
		amount: data?.amount ?? 0,
		operator: data?.operator,
	});
	if (!response.ok) {
		const responseBody = await response.json();
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

const phoneData = [
	{
		key: "653292829",
		label: "653292829",
	},
];
const operatorData = [
	{
		key: "MTN_MOMO_CMR",
		label: "MTN",
	},
	{
		key: "ORANGE_CMR",
		label: "ORANGE",
	},
];

export default function RetraitCMModalForm({ amount }: { amount: number }) {
	const pathname = usePathname();
	const redirectRef: any = useRef();
	const [trxId, setTrxId] = useState<string>("");
	const [trxStatus, setTrxStatus] = useState<string>("");

	const searchParams = useSearchParams();
	const isRechargeAccount = searchParams.get(`rechargeAccount`);
	const isWithdrawAccount = searchParams.get(`withdrawAccount`);
	const isRechargeSponsorshipAccount = searchParams.get(
		`rechargeSponsorshipAccount`
	);
	const isWithdrawSponsorshipAccount = searchParams.get(
		`withdrawSponsorshipAccount`
	);
	const router = useRouter();
	// const navigate = useNavigate();
	const dispatch = useDispatch();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			amount: undefined,
			phone: "653292829",
			operator: "MTN_MOMO_CMR",
		},
	});

	const getSekureApiToken = useSelector(selectCurrentGetSekureApiToken);
	const currentUser = useSelector(selectCurrentUser);
	const customerDetails: any = useSelector(selectCurrentCustomerDetails);

	const handlePhoneChange = (data: any) => {
		const value = data.target.value;
		console.log("phone", value);
		form.setValue("phone", value);
	};
	const handleOperatorChange = (data: any) => {
		const value = data.target.value;
		console.log("operator", value);
		form.setValue("operator", value);
	};

	const mutation = useMutation({
		mutationFn: (data) =>
			handleBalanceWithdrawal({ userId: currentUser.id, data }),
		onError: (err: any) => {
			console.error("onError : ", err.message);
			toast.error(
				`Une erreur est survenue lors du retrait du solde Cameroon : ${err.message}`
			);
		},
		onSuccess: (data) => {
			console.log("onSuccess : ", data);
			localStorage.setItem(
				`retraitCameroon[${getCurrentDateTime()}]`,
				`Retrait de ${form.getValues(
					"amount"
				)} du solde Cameroon effectué avec SUCCES !`
			);
			toast.success(
				`Retrait de ${form.getValues(
					"amount"
				)} du solde Cameroon effectué avec SUCCES !`
			);
			setTrxId(data?.transaction?.order_id);
			setTrxStatus("pending");

			// redirectRef.current.href = window.location.pathname;
			// redirectRef.current.click();
		},
	});

	const onSubmit = (data: any) => {
		console.log("pathname : ", pathname);
		mutation.mutate(data);
	};
	const onError = (err: any) => {
		console.error("any", err);
	};

	const getFormLabels = (amount?: string | number) => {
		return {
			title: "Retirer du compte courant de",
			btnText: "Retirer du compte courant",
			btnStyle: "red",
			label: "withdrawAccount",
			toastTextSuccess: "Retrait du compte courant effectué avec succès",
			toastTextError: "Erreur lors du retrait du compte courant",
			note: `(Montant maximal à retirer : ${amount})`,
			min: 0,
			max: customerDetails?.customer?.soldeCourant,
		};
	};

	return (
		<div className="bg-white m-auto p-8 rounded-md min-w-[350px] max-w-[700px]">
			<div className="flex justify-between mb-5 gap-10">
				<Title title={`Retrait Benin`} />
				<Link href={pathname}>
					<FaX size={16} color={"#444"} />
				</Link>
			</div>

			{trxId && trxStatus === "pending" ? (
				<>
					<CheckBJPayoutStatus
						trxId={trxId}
						setTrxStatus={setTrxStatus}
					/>
				</>
			) : trxStatus === "success" ? (
				<>
					<div className="flex flex-col justify-center items-center my-[30px] w-full">
						<div className="text-xl font-bold text-[#18BC7A]">
							Payout successful
						</div>
					</div>
				</>
			) : trxStatus === "failed" ? (
				<>
					<div className="flex flex-col justify-center items-center my-[30px] w-full">
						<div className="text-xl font-bold text-[##F85D4B]">
							Payout failed
						</div>
					</div>
				</>
			) : (
				<>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit, onError)}>
							<div className="space-y-[20px]">
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
												getFormLabels(
													amount?.toLocaleString(
														"fr-FR"
													)
												)?.note
											}`}</span>
											<FormControl>
												<Input
													type="number"
													min={0}
													max={
														Math.floor(amount) ??
														1000000000000000000000000
													}
													className="px-2 w-full bg-[#F4EFE3]"
													{...field}
												/>
											</FormControl>
											<FormMessage className="text-red-400" />
										</FormItem>
									)}
								/>
								{/* <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-gray-900 text-sm font-[500] tracking-tight">Numero récepteur au Cameroun</FormLabel>
                    <FormControl>
                        <Input 
                        type="text"
                        className="px-2 w-full bg-gray-100"
                        {...field}
                        // value={field.value} 
                        />
                    </FormControl>
                    <FormMessage className="text-red-400"/>
                    </FormItem>
                )}
                /> */}
								<FormField
									control={form.control}
									name="phone"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-sm mb-3">{`Numero récepteur au Cameroun`}</FormLabel>
											<FormControl>
												<Select
													{...field}
													placeholder="Sélectionner le telephone"
													style={{
														width: "100%",
														background: "#F4EFE3",
													}}
													className={`rounded-xs text-gray-900 text-md font-normal`}
													defaultSelectedKeys={[
														field.value ?? "",
													]}
													onChange={(data) =>
														handlePhoneChange(data)
													}
												>
													{phoneData.map(
														(
															item: any,
															idx: any
														) => (
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
									name="operator"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-sm mb-3">{`Operateur au Cameroun`}</FormLabel>
											<FormControl>
												<Select
													{...field}
													placeholder="Sélectionner l'operateur"
													style={{
														width: "100%",
														background: "#F4EFE3",
													}}
													className={`rounded-xs text-gray-900 text-md font-normal`}
													defaultSelectedKeys={[
														field.value ?? "",
													]}
													onChange={(data) =>
														handleOperatorChange(
															data
														)
													}
												>
													{operatorData.map(
														(
															item: any,
															idx: any
														) => (
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
							</div>

							<div
								style={{
									display:
										getFormLabels()?.max !== 0
											? "block"
											: "none",
								}}
								className={`mt-[10vh]`}
							>
								<CButton
									text={`Retirer`}
									btnStyle={`red`}
									type={"submit"}
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
						</form>
					</Form>
				</>
			)}

			<a ref={redirectRef} hidden href="#"></a>
		</div>
	);
}
