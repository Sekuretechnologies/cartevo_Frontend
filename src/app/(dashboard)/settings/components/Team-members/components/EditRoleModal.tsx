import { SettingsService } from "@/api/services/cartevo-api/settings";
import { selectCurrentToken } from "@/redux/slices/auth";
import { EditRoleSchema } from "@/validation/FormValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Select, SelectItem } from "@nextui-org/select";
import CButton from "@/components/shared/CButton";
import { PuffLoader } from "react-spinners";
import classNames from "classnames";

const handleEditRole = async (
	token: string,
	data: z.infer<typeof EditRoleSchema>,
	userId: string
) => {
	const response = await SettingsService.EditUser({ userId, token, data });

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to update role");
	}

	return responseJson;
};

const userRoles = [
	{
		key: "member",
		label: "Member",
	},
	{
		key: "admin",
		label: "Admin",
	},
];

type ModalProps = {
	onClose: () => void;
	userId: string;
};

const EditRoleModal = ({ onClose, userId }: ModalProps) => {
	const currentToken: any = useSelector(selectCurrentToken);

	const form = useForm<z.infer<typeof EditRoleSchema>>({
		resolver: zodResolver(EditRoleSchema),
		defaultValues: {
			role: undefined,
		},
	});

	const mutation = useMutation({
		mutationFn: (data: z.infer<typeof EditRoleSchema>) =>
			handleEditRole(currentToken, data, userId),
		onError: (err: any) => {
			toast.error("Failed to update user role.", err.message);
		},
		onSuccess: (data: any) => {
			toast.success("User role updated successfully.");
		},
	});

	const onSubmit = (data: any) => {
		mutation.mutate(data);
	};

	const onError = (err: any) => {
		console.error("error", err);
	};
	return (
		<div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-[1000]">
			<div className="relative flex flex-col px-8 py-8 bg-white rounded-lg w-[600px]">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-xl font-semibold">Edit user role</h1>

					<button
						className="text-gray-500 hover:text-black duration-300"
						onClick={() => onClose()}
					>
						<X size={24} />
					</button>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit, onError)}>
						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-md tracking-tight">
										Select Role
										<span className="text-red-500">*</span>
									</FormLabel>

									<FormControl>
										<Select
											{...field}
											placeholder="Select Role"
											style={{
												width: "100%",
											}}
											className="bg-app-lightgray text-gray-900 font-normal"
											defaultSelectedKeys={[
												field.value ?? "",
											]}
											selectedKeys={
												field.value ? [field.value] : []
											}
										>
											{userRoles.map((item) => (
												<SelectItem
													key={item.key}
													value={item.key}
												>
													{item.label}
												</SelectItem>
											))}
										</Select>
									</FormControl>
									<FormMessage className="text-red-400 " />
								</FormItem>
							)}
						/>

						<div className="mt-8">
							<CButton
								text="Edit Role"
								btnStyle="blue"
								width="175px"
								height="49px"
								type="submit"
							/>
						</div>

						<div
							className={classNames(
								"transition-all invisible z-[1000] bg-blue-900/30 opacity-0 absolute top-1/2 -translate-y-1/2 -translate-x-1/2 -trasnlate left-1/2 h-screen w-screen flex items-center justify-center",
								{
									"!opacity-100 !visible z-[1000]":
										mutation.isLoading,
								}
							)}
						>
							<PuffLoader
								className="shrink-0"
								size={50}
								color="#1F66FF"
							/>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default EditRoleModal;
