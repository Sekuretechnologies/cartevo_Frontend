import { UserService } from "@/api/services/user";
import CButton from "@/components/shared/CButton";
import DialogWrapper from "@/components/shared/DialogWrapper";
import { selectCurrentUser } from "@/redux/slices/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { HashLoader } from "react-spinners";

const handleActivate = async (queryData: any) => {
	const { currentUserId, customerId, activate } = queryData;
	// console.log("handleTransaction : ", {currentUserId, customerId, label, body});
	// return {currentUserId, customerId, label, body}
	const response = await UserService.activate_user_account({
		userId: currentUserId,
		customerId: customerId,
		body: { is_active: activate },
	});
	if (!response.ok) {
		const responseBody = await response.json();
		throw new Error(responseBody.message);
	}
	const responseJson = await response.json();
	return responseJson;
};

type ModalProps = {
	isOpen: boolean;
	setIsOpen: (data?: any) => void;
	customer?: any;
	activate?: boolean;
};
export default function ActivateUserAccountModal({
	isOpen,
	setIsOpen,
	activate,
	customer,
}: ModalProps) {
	const pathname = usePathname();
	const redirectRef: any = useRef();

	// const form = useForm<z.infer<typeof formSchema>>({
	//     resolver: zodResolver(formSchema),
	// });

	const currentUser = useSelector(selectCurrentUser);
	// const customerDetails:any = useSelector(selectCurrentCustomerDetails);

	const mutation = useMutation({
		mutationFn: (data) =>
			handleActivate({
				currentUserId: currentUser?._id,
				customerId: customer?._id,
				activate: activate,
			}),
		onError: (err: any) => {
			console.error("onError : ", err.message);
			toast.error(
				`Erreur lors ${
					activate ? "de l'activation" : "de la désactivation"
				} du compte : ${err.message}`
			);
		},
		onSuccess: (data) => {
			console.log("onSuccess : ", data);
			toast.success(
				`${
					activate ? "Activation" : "Désactivation"
				} du compte effectuée avec succès`
			);
			redirectRef.current.href = window.location.pathname;
			redirectRef.current.click();
		},
	});

	const onSubmit = (value: boolean) => {
		const data: any = { activate: value };
		mutation.mutate(data);
	};
	const onError = (err: any) => {
		console.error("any", err);
	};

	const handleCloseDialog = () => {
		setIsOpen(false);
	};

	return (
		<DialogWrapper open={isOpen} handleClose={handleCloseDialog}>
			<div>
				{`${activate ? "Activer" : "Désactiver"} le compte de `}
				{customer?.name}
				<div className="flex gap-5 mt-3">
					<CButton
						text={`Annuler`}
						btnStyle={"outlineDark"}
						onClick={() => {
							handleCloseDialog();
						}}
						width={"100%"}
						height={"35px"}
					/>
					{activate ? (
						<CButton
							text={`Activer`}
							btnStyle={"green"}
							onClick={() => onSubmit(true)}
							width={"100%"}
							height={"35px"}
						/>
					) : (
						<CButton
							text={`Désactiver`}
							btnStyle={"red"}
							onClick={() => onSubmit(false)}
							width={"100%"}
							height={"35px"}
						/>
					)}
				</div>
			</div>
			<div
				className={classNames(
					"transition-all invisible z-20 bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center",
					{
						"!opacity-100 !visible z-20": mutation.isLoading,
					}
				)}
			>
				<HashLoader className="shrink-0" size={50} color="#1F66FF" />
			</div>
			<a ref={redirectRef} hidden href="#"></a>
		</DialogWrapper>
	);
}
