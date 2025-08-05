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
import { OperationService } from "@/api/services/operation";
import { getNextUIDatePickerValueStr, parseDateStr } from "@/utils/DateFormat";
import { parseDate } from "@internationalized/date";
import { DatePicker } from "@nextui-org/date-picker";
// import { useNavigate } from 'react-router-dom';
export const formSchema = z.object({
	date: z.string({ message: "Entrez une date" }),
	time: z.string({ message: "Entrez une heure" }),
	amount: z.string({ message: "Entrez un montant" }),
	remaining_balance: z.string({ message: "Entrez un numero de telephone" }),
	action: z.string(),
	provider: z.string(),
	country: z.string(),
});

const handleBalanceOperation = async (queryData: any) => {
	const { data } = queryData;
	// console.log("handleTransaction : ", {currentUserId, customerId, label, body});
	// return {currentUserId, customerId, label, body}
	console.log("handleBalanceOperation :", {
		date: data?.date?.split("T")?.[0],
		time: String(data?.time) + ":00",
		action: data?.action,
		amount: data?.amount,
		remaining_balance: data?.remaining_balance,
		provider: data?.provider,
		country: data?.country,
	});

	const response = await OperationService.add_balance_operations({
		date: data?.date,
		time: data?.time,
		action: data?.action,
		amount: data?.amount,
		remaining_balance: data?.remaining_balance,
		provider: data?.provider,
		country: data?.country,
	});
	if (!response.ok) {
		const responseBody = await response.json();
		throw new Error(responseBody.message);
	}
	const responseJson = await response.json();
	return responseJson;
};

export default function AddOperationModalForm({
	action,
	provider,
	country,
}: {
	action: string;
	provider: string;
	country: string;
}) {
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
			date: new Date().toISOString(),
			time: new Date().toISOString().split("T")[1],
			// amount: 0,
			// remaining_balance: 0,
			action,
			provider,
			country,
		},
	});

	const getSekureApiToken = useSelector(selectCurrentGetSekureApiToken);
	const currentUser = useSelector(selectCurrentUser);
	const customerDetails: any = useSelector(selectCurrentCustomerDetails);

	const mutation = useMutation({
		mutationFn: (data) => handleBalanceOperation({ data }),
		onError: (err: any) => {
			console.error("onError : ", err.message);
			toast.error(`Une erreur est survenue : ${err.message}`);
		},
		onSuccess: (data) => {
			console.log("onSuccess : ", data);
			toast.success(`Operation effectuée avec SUCCES !`);
			router.push(pathname);
		},
	});

	const onSubmit = (data: any) => {
		console.log("pathname : ", pathname);
		mutation.mutate(data);
	};
	const onError = (err: any) => {
		console.error("any", err);
	};

	const getTitle = (action: string, provider: string, country: string) => {
		const titles: any = {
			withdrawal: `${country} : Retrait de flotte ${provider}`,
		};
		return titles[String(action)];
	};

	return (
		<div className="bg-white m-auto p-8 rounded-md min-w-[350px] max-w-[700px]">
			<div className="flex justify-between mb-5 gap-10">
				<Title title={getTitle(action, provider, country)} />
				<Link href={pathname}>
					<FaX size={16} color={"#444"} />
				</Link>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit, onError)}>
					<div className="space-y-[20px]">
						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-[500] tracking-tight">
										Date
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
											onChange={(date: any) => {
												const newDateStr =
													getNextUIDatePickerValueStr(
														date.year,
														date.month,
														date.day
													);
												// console.log("date : ", date);
												// console.log("newDateStr : ", newDateStr);
												form.setValue(
													"date",
													newDateStr
												);
											}}
											showMonthAndYearPickers
										/>
										{/* <Input
											type="date"
											className="px-2 w-full bg-[#F4EFE3]"
											value={field.value}
											// {...field}
										/> */}
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="time"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-[500] tracking-tight">
										Heure
									</FormLabel>
									<FormControl>
										<Input
											type="time"
											className="px-2 w-full bg-gray-100"
											{...field}
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
									<FormLabel className="text-gray-900 text-sm mb-3">{`Montant`}</FormLabel>
									<FormControl>
										<Input
											type="number"
											className="px-2 w-full bg-gray-100"
											{...field}
										/>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="remaining_balance"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm mb-3">{`Reste en caisse`}</FormLabel>
									<FormControl>
										<Input
											type="number"
											className="px-2 w-full bg-gray-100"
											{...field}
										/>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
					</div>

					<div className={`mt-[10vh]`}>
						<CButton
							text={`Enregistrer`}
							btnStyle={`green`}
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

			<a ref={redirectRef} hidden href="#"></a>
		</div>
	);
}
