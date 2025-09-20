"use client";

import { SettingsService } from "@/api/services/cartevo-api/settings";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@nextui-org/select";
import { selectCurrentToken, selectCurrentUser } from "@/redux/slices/auth";
import { teamMemberSchema } from "@/validation/FormValidation";
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { z } from "zod";
import CButton from "@/components/shared/CButton";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { PuffLoader } from "react-spinners";
import classNames from "classnames";

type TeamMemberFormProps = {
	onClose: () => void;
};

const handleMemberInfo = async (
	token: string,
	data: z.infer<typeof teamMemberSchema>
) => {
	const response = await SettingsService.add_team_member({
		token: token,
		data,
	});

	if (!response.ok) {
		const responseBody = await response.json();
		if (response.status === 401) {
			throw new Error(responseBody.message);
		} else {
			throw new Error(responseBody.message);
		}
	}
	const responseJson = await response.json();
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

const TeamMemberForm = ({ onClose }: TeamMemberFormProps) => {
	const currentToken: any = useSelector(selectCurrentToken);
	const currentUser = useSelector(selectCurrentUser);
	// const userId =
	const form = useForm<z.infer<typeof teamMemberSchema>>({
		resolver: zodResolver(teamMemberSchema),
		defaultValues: {
			email: "",
			role: "",
			// ownerUserId: currentUser.id,
		},
	});

	const mutation = useMutation({
		mutationFn: (data: z.infer<typeof teamMemberSchema>) =>
			handleMemberInfo(currentToken, data),
		onError: (err: any) => {
			console.error("add new team member error", err.message);
			toast.error(err.message);
		},
		onSuccess: (data: any) => {
			toast.success("New team member added successfully");
			onClose();
		},
	});

	const onSubmit = (data: any) => {
		mutation.mutate(data);
	};

	const onError = (err: any) => {
		console.error("error", err);
	};
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit, onError)}>
				<div>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem className="mb-2">
								<FormLabel className="text-gray-900 text-md tracking-tight">
									Email Adress
									<span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Input
										className="px-6 w-full bg-app-lightgray"
										placeholder="ex prenom@gmail.com"
										{...field}
									/>
								</FormControl>
								<FormMessage className="text-red-400" />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="role"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-gray-900 text-md tracking-tight">
									Role
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
							text="Save & Continue"
							btnStyle="blue"
							type="submit"
						/>
					</div>
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
	);
};

export default TeamMemberForm;
