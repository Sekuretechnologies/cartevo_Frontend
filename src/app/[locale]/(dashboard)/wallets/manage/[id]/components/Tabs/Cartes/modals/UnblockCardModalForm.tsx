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
import { UserService } from "@/api/services/user";
import { CardService } from "@/api/services/card";

export const formSchema = z.object({
	// author: z.object({
	//     name: z.string({message:'Choisir une personne'}),
	//     email: z.string().email(),
	//     phone: z.string(),
	// },{message:'Choisir une personne'}),
	// reason: z.string(
	//     {message:'Choisir un motif'}
	// ),
	// description: z.string().optional(),
});

const handleUnblock = async (queryData: any) => {
	const { currentUserId, customerId, cardId } = queryData;
	// console.log("handleTransaction : ", {currentUserId, customerId, label, body});
	// return {currentUserId, customerId, label, body}
	const response = await CardService.unfreeze_card({
		userId: customerId,
		cardId,
		body: { currentUserId },
	});

	if (!response.ok) {
		const responseBody = await response.json();
		throw new Error(responseBody.message);
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

export default function UnblockCardModalForm({
	index,
	card,
	customer,
}: ModalProps) {
	const pathname = usePathname();
	const redirectRef: any = useRef();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	const currentUser = useSelector(selectCurrentUser);
	// const customerDetails:any = useSelector(selectCurrentCustomerDetails);

	const mutation = useMutation({
		mutationFn: () =>
			handleUnblock({
				currentUserId: currentUser?._id,
				cardId: card?.mapId,
				customerId: customer?._id,
			}),
		onError: (err: any) => {
			console.error("onError : ", err.message);
			toast.error(
				`Erreur lors du deblocage de la carte : ${err.message}`
			);
		},
		onSuccess: (data) => {
			console.log("onSuccess : ", data);
			toast.success(`Deblocage de la carte effectué avec succès`);
			redirectRef.current.href = window.location.pathname;
			redirectRef.current.click();
		},
	});

	const onSubmit = (data: any) => {
		// console.log("pathname : ", pathname);
		mutation.mutate(data);
	};
	const onError = (err: any) => {
		console.error("any", err);
	};

	return (
		<div className="bg-white m-auto p-8 rounded-md min-w-[350px] max-w-[500px]">
			<div className="flex justify-between mb-5 gap-10">
				<Title
					title={`Débloquer la carte`}
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
						<div className="flex gap-5">
							<strong className="font-bold">Bloqué par :</strong>
							<span>{customer?.blockedData?.author?.name}</span>
						</div>
						<div className="flex gap-5">
							<strong className="font-bold">Motif :</strong>
							<span>{customer?.blockedData?.reason}</span>
						</div>
						<div className="flex gap-5">
							<span>{customer?.blockedData?.description}</span>
						</div>
					</div>

					<div className={`mt-[10vh]`}>
						<CButton
							text={`Débloquer`}
							btnStyle={"green"}
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
				</form>
			</Form>
			<a ref={redirectRef} hidden href="#"></a>
		</div>
	);
}
