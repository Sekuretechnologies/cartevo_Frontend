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
import Image from "next/image";
import { generateRandomCode, getFileExtension } from "@/utils/utils";

declare global {
	interface Window {
		FileList: typeof FileList;
	}
}

const MAX_FILE_SIZE = 1024 * 1024 * 2; // 5MB in bytes
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];

export const formSchema: any = z.object({
	recto: z.instanceof(FileList).refine(
		(file) => {
			console.log("recto - file : ", file?.[0].size, file?.[0].type);
			const fileSizeOk = file?.[0].size <= MAX_FILE_SIZE;
			const fileTypeOk = ACCEPTED_IMAGE_TYPES.includes(file?.[0].type);
			return file?.length == 1 && fileSizeOk && fileTypeOk;
			// return file.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file.type);
		},
		{
			message: "File must be under 5MB and of type jpg, png, or gif",
		}
	),
	verso: z.instanceof(FileList).refine(
		(file) => {
			console.log("verso - file : ", file?.[0].size, file?.[0].type);
			const fileSizeOk = file?.[0].size <= MAX_FILE_SIZE;
			const fileTypeOk = ACCEPTED_IMAGE_TYPES.includes(file?.[0].type);
			return file?.length == 1 && fileSizeOk && fileTypeOk;
			// return file.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file.type);
		},
		{
			message: "File must be under 5MB and of type jpg, png, or gif",
		}
	),
});

const handleUpdate = async (queryData: any) => {
	const { currentUserId, customerId, body } = queryData;
	// console.log("handleTransaction : ", {currentUserId, customerId, label, body});
	// return {currentUserId, customerId, label, body}
	console.log({ bodyPhoto: body.recto[0] });
	const rectoName = body.recto[0]?.name;
	const rectoNewName = generateRandomCode(32);
	const rectoExtension = getFileExtension(rectoName);
	const versoName = body.verso[0]?.name;
	const versoNewName = generateRandomCode(32);
	const versoExtension = getFileExtension(versoName);

	const formData = new FormData();
	// const idImages = new FileList();
	// idImages.append(body.recto[0]);
	// idImages.append(body.verso[0]);

	// Assuming body.recto[0] and body.verso[0] are File objects
	const rectoFile = body.recto[0];
	const versoFile = body.verso[0];

	// Create an array of File objects
	// let filesArray = body.recto; //body.recto is a FileList object
	// filesArray[1] = body.verso[0];

	// formData.append("idImages", filesArray);
	formData.append(
		"recto",
		body.recto[0],
		`${rectoNewName}.${rectoExtension}`
	);
	formData.append(
		"verso",
		body.verso[0],
		`${versoNewName}.${versoExtension}`
	);

	const response = await UserService.update_user_paper_images({
		userId: currentUserId,
		customerId: customerId,
		body: formData,
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

export default function UpdateDocumentImagesModalForm({
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
				currentUserId: currentUser?._id,
				customerId: customer?._id,
				body: data,
			}),
		onError: (err: any) => {
			console.error("onError : ", err.message);
			toast.error(
				`Erreur mise a jour des documents d'identification : ` +
					err.message
			);
		},
		onSuccess: (data) => {
			console.log("onSuccess : ", data);
			toast.success(
				`Les documents d'identification ont été mise à jour avec succès.`
			);
			redirectRef.current.href = window.location.pathname;
			redirectRef.current.click();
			// handleClose();
		},
	});

	const onSubmit = (data: any) => {
		console.log("data : ", data);
		mutation.mutate(data);
	};
	const onError = (err: any) => {
		console.log("data : ", form.getValues("photo"));
		console.error("onError : ", err);
	};

	const rectoRef = form.register("recto");
	const versoRef = form.register("verso");

	return (
		<DialogWrapper
			open={isOpen}
			handleClose={handleClose}
			title={`Mise à jour des documents d'identification de`}
			titleLine2={`${customer?.name}`}
		>
			<div className="min-w-[350px] max-w-[700px]">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit, onError)}>
						<div className=" w-full gap-3 my-3">
							<FormField
								control={form.control}
								name="recto"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-[500] tracking-tight">
											Recto
										</FormLabel>
										<FormControl>
											<Input
												type="file"
												accept="image/jpeg,image/png,image/gif"
												className="px-2 w-full bg-[#F4EFE3]"
												{...rectoRef}
												onChange={(event) => {
													// field.onChange([...Array.from(event.target.files ?? [])])
													field.onChange(
														event.target?.files ??
															undefined
													);
												}}
											/>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
							{form.watch("recto")?.length > 0 && (
								<Image
									src={URL.createObjectURL(
										form.getValues("recto")[0]
									)}
									alt={"Selected Document recto"}
									width={70}
									height={70}
									style={{
										marginTop: "15px",
										borderRadius: "10px",
									}}
									// onError={(e) => URL.revokeObjectURL(e.target.src)}
								/>
							)}
						</div>
						<div className=" w-full space-y-[20px] my-3">
							<FormField
								control={form.control}
								name="verso"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-[500] tracking-tight">
											Verso
										</FormLabel>
										<FormControl>
											<Input
												type="file"
												accept="image/jpeg,image/png,image/gif"
												className="px-2 w-full bg-[#F4EFE3]"
												{...versoRef}
												onChange={(event) => {
													// field.onChange([...Array.from(event.target.files ?? [])])
													field.onChange(
														event.target?.files ??
															undefined
													);
												}}
											/>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
							{form.watch("verso")?.length > 0 && (
								<Image
									src={URL.createObjectURL(
										form.getValues("verso")[0]
									)}
									alt={"Selected Document verso"}
									width={70}
									height={70}
									style={{
										marginTop: "15px",
										borderRadius: "10px",
									}}
									// onError={(e) => URL.revokeObjectURL(e.target.src)}
								/>
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
