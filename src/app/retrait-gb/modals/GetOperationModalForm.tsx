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
import { useMutation, useQuery } from "react-query";
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
import {
	getFormattedDateTime,
	getNextUIDatePickerValueStr,
	parseDateStr,
} from "@/utils/DateFormat";
import { parseDate } from "@internationalized/date";
import { DatePicker } from "@nextui-org/date-picker";
// import { useNavigate } from 'react-router-dom';
export const formSchema = z.object({
	balance: z.string(),
	last_operation_date: z.string(),
	total_trx_amount_since_last_operation: z.string(),
	count_trx_since_last_operation: z.string(),
	balance_since_last_operation: z.string(),
	balance_remaining_of_last_operation: z.string(),
});

const getBalanceOperation = async ({ queryKey }: any) => {
	const [_key, data] = queryKey;

	console.log("handleBalanceOperation :", {
		provider: data?.provider,
		country: data?.country,
		category: data?.category,
		type: data?.type,
	});

	const response = await OperationService.get_balance_operations({
		provider: data?.provider,
		country: data?.country,
		category: data?.category,
		type: data?.type,
	});
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message);
	}
	return responseJson.data;
};

export default function GetOperationModalForm({
	category,
	type,
	provider,
	country,
	balance,
}: {
	category: string;
	type: string;
	provider: string;
	country: string;
	balance: number;
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

	const getSekureApiToken = useSelector(selectCurrentGetSekureApiToken);
	const currentUser = useSelector(selectCurrentUser);
	const customerDetails: any = useSelector(selectCurrentCustomerDetails);

	const balanceOperationQueryRes = useQuery({
		queryKey: [
			"oneUser",
			{
				provider: provider,
				country: country,
				category: category,
				type: type,
			},
		],
		queryFn: getBalanceOperation,
		onError: (err) => {
			toast.error("Error getBalanceOperation ");
		},
		// enabled: false,
		// refetchInterval: 50000, // Fetches data every 60 seconds
	});

	//------------------------------------------------

	console.log(
		"balanceOperationQueryRes.data : ",
		balanceOperationQueryRes.data
	);

	// if (balanceOperationQueryRes.data) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			balance: balance?.toFixed(2),
			last_operation_date:
				balanceOperationQueryRes?.data?.operationParam?.date,
			total_trx_amount_since_last_operation:
				balanceOperationQueryRes?.data?.trxSummary?.[0]
					?.all_transactions_total_amount_with_fee,
			count_trx_since_last_operation:
				balanceOperationQueryRes?.data?.trxSummary?.[0]
					?.all_transactions_count,
			balance_since_last_operation: (
				Number(balance) -
				Number(
					balanceOperationQueryRes?.data?.operationParam
						?.remaining_balance
				)
			).toFixed(2),
			balance_remaining_of_last_operation: Number(
				balanceOperationQueryRes?.data?.operationParam
					?.remaining_balance
			).toFixed(2),
		},
	});

	return (
		<div className="bg-white m-auto p-8 rounded-md min-w-[350px] max-w-[700px]">
			<div className="flex justify-between mb-5 gap-10">
				<Title title={`${country} : Etat de flotte ${provider}`} />
				<Link href={pathname}>
					<FaX size={16} color={"#444"} />
				</Link>
			</div>

			<Form {...form}>
				<form>
					<div className="space-y-[20px]">
						<FormField
							control={form.control}
							name="balance"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-[500] tracking-tight">
										Montant en caisse
									</FormLabel>
									<FormControl>
										<Input
											type="text"
											className="px-2 w-full bg-gray-100"
											value={Number(
												field.value
											)?.toLocaleString("fr-FR")}
										/>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="last_operation_date"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-[500] tracking-tight">
										Date de la derniere operation
									</FormLabel>
									<FormControl>
										<Input
											type="text"
											className="px-2 w-full bg-gray-100"
											value={
												field.value &&
												getFormattedDateTime(
													new Date(field.value)
												)
											}
										/>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="total_trx_amount_since_last_operation"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-[500] tracking-tight">
										Total transactions depuis la derniere
										operation
									</FormLabel>
									<FormControl>
										<Input
											type="text"
											className="px-2 w-full bg-gray-100"
											value={field.value}
										/>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="count_trx_since_last_operation"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm mb-3">{`Nbre transactions depuis la derniere operation`}</FormLabel>
									<FormControl>
										<Input
											type="number"
											className="px-2 w-full bg-gray-100"
											value={field.value}
										/>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="balance_since_last_operation"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm mb-3">{`Montant ajouté en caisse depuis la derniere
										operation`}</FormLabel>
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
							name="balance_remaining_of_last_operation"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm mb-3">{`Montant resté en caisse lors de la derniere
										operation`}</FormLabel>
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

					{/* <div className={`mt-[10vh]`}>
						<CButton
							text={`Enregistrer`}
							btnStyle={`green`}
							type={"submit"}
							width={"100%"}
							height={"35px"}
						/>
					</div> */}
				</form>
			</Form>

			<a ref={redirectRef} hidden href="#"></a>
		</div>
	);
	// } else {
	// 	return (
	// 		<div className="bg-white m-auto p-8 rounded-md min-w-[350px] max-w-[700px]">
	// 			<div className={"loadingSpinner"}></div>
	// 		</div>
	// 	);
	// }
}
