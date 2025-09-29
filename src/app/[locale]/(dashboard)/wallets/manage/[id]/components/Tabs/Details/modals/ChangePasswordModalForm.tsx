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
import { User } from "lucide-react";
import { UserService } from "@/api/services/user";
import DialogWrapper from "@/components/shared/DialogWrapper";
import { CustomerService } from "@/api/services/v2/customer";
// import { useNavigate } from 'react-router-dom';
export const formSchema: any = z
	.object({
		password: z.string({ message: "Entrez le mot de passe" }),
		passwordConfirm: z.string({
			message: "Veuillez confirmer le mot de passe",
		}),
	})
	.refine((data) => data.passwordConfirm === data.password, {
		message: `Les mots de passe ne correspondent pas`,
		path: ["passwordConfirm"], // Specify the path to show error on
	});

const handleUpdate = async (queryData: any) => {
	const { currentUserId, customerId, body } = queryData;
	// console.log("handleTransaction : ", {currentUserId, customerId, label, body});
	// return {currentUserId, customerId, label, body}
	const response = await CustomerService.update_one_customer_password({
		userId: currentUserId,
		customerId: customerId,
		body: body,
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
	"Recharge solde courant",
	"Retrait solde courant",
	"Recharge solde parrain",
	"Retrait solde parrain",
];

export default function ChangePasswordModalForm({
	isOpen,
	setIsOpen,
	customer,
}: ModalProps) {
	const pathname = usePathname();
	const redirectRef: any = useRef();

	const handleClose = () => {
		setIsOpen(false);
	};

	const searchParams = useSearchParams();
	const router = useRouter();
	// const navigate = useNavigate();
	const dispatch = useDispatch();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	const currentUser = useSelector(selectCurrentUser);
	// const customerDetails:any = useSelector(selectCurrentCustomerDetails);

	const mutation = useMutation({
		mutationFn: (data) =>
			handleUpdate({
				currentUserId: currentUser?.id,
				customerId: customer?.id,
				body: data,
			}),
		onError: (err: any) => {
			console.error("onError : ", err.message);
			toast.error(`Erreur mise a jour du mot de passe : ` + err.message);
		},
		onSuccess: (data) => {
			console.log("onSuccess : ", data);
			toast.success(`Le mot de passe a été mis à jour avec succès.`);
			handleClose();
		},
	});

	const onSubmit = (data: any) => {
		// console.log("pathname : ", pathname);
		mutation.mutate(data);
	};
	const onError = (err: any) => {
		console.error("onError : ", err);
	};

	return (
		<DialogWrapper
			open={isOpen}
			handleClose={handleClose}
			title={`Mise à jour du mot de passe de`}
			titleLine2={`${customer?.name}`}
		>
			<div className="min-w-[350px] max-w-[700px]">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit, onError)}>
						<div className="space-y-[20px]">
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-[500] tracking-tight">
											Mot de passe
										</FormLabel>
										<FormControl>
											<Input
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
								name="passwordConfirm"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-[500] tracking-tight">
											Confirmation du mot de passe
										</FormLabel>
										<FormControl>
											<Input
												className="px-2 w-full bg-[#F4EFE3]"
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
