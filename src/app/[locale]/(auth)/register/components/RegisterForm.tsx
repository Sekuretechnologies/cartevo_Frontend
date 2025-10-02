"use client";

import { AuthService } from "@/api/services/cartevo-api/auth";
import CButton from "@/components/shared/CButton";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerUserSchema } from "@/validation/FormValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useMutation } from "react-query";
import { PuffLoader } from "react-spinners";
import { z } from "zod";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";
import { useTranslation } from "@/hooks/useTranslation";

const handleRegisterForm = async (data: z.infer<typeof registerUserSchema>) => {
	const response = await AuthService.registerUser(data);

	if (!response.ok) {
		const responseBody = await response.json();
		throw new Error(responseBody.message);
	}
	const responseJson = await response.json();
	return responseJson;
};

const RegisterForm = () => {
	const { t } = useTranslation();
	const registertranslation = t.register;
	const signUpTranslation = t.signUp;
	const btnTransalation = t.btn;
	const router = useRouter();
	const { createLocalizedLink } = useLocalizedNavigation();
	const [passwordVisible, setPasswordVisible] = useState<boolean>();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const form = useForm<z.infer<typeof registerUserSchema>>({
		resolver: zodResolver(registerUserSchema),
		defaultValues: {
			email: "",
			token: token ?? undefined,
			password: "",
			first_name: "",
			last_name: "",
		},
	});

	const mutation = useMutation({
		mutationFn: (data: z.infer<typeof registerUserSchema>) =>
			handleRegisterForm(data),
		onError: (err: any) => {
			toast.error(err.message);
		},
		onSuccess: (data: any) => {
			toast.success("Registration successful. Redirecting…");
			router.push(createLocalizedLink("/login"));
		},
	});

	const onSubmit = (data: any) => {
		mutation.mutate(data);
	};

	const onError = (err: any) => {
		console.log("error", err);
	};
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit, onError)}>
				<div className=" mt-20 lg:mt-0">
					<div>
						<h1 className="text-[30px] font-poppins tracking-tight font-bold mb-8">
							{registertranslation.form.title}
						</h1>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
						<FormField
							control={form.control}
							name="first_name"
							render={({ field }) => (
								<FormItem className="mb-2">
									<FormLabel className=" text-[12px] font-semibold tracking-tight">
										{signUpTranslation.prenom}
										<span className="text-red-500">*</span>
									</FormLabel>
									<FormControl>
										<Input
											className="px-6 w-full bg-app-lightgray"
											placeholder={
												signUpTranslation.prenomPlaceholder
											}
											{...field}
										/>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="last_name"
							render={({ field }) => (
								<FormItem className="mb-2">
									<FormLabel className=" text-[12px] font-semibold tracking-tight">
										{signUpTranslation.name}
										<span className="text-red-500">*</span>
									</FormLabel>
									<FormControl>
										<Input
											className="px-6 w-full bg-app-lightgray"
											placeholder={
												signUpTranslation.namePlaceholder
											}
											{...field}
										/>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem className="mb-2">
								<FormLabel className=" text-[12px] font-semibold tracking-tight">
									Email
									<span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Input
										className="px-6 w-full bg-app-lightgray"
										placeholder="exemple@domaine.com"
										{...field}
									/>
								</FormControl>
								<FormMessage className="text-red-400" />
							</FormItem>
						)}
					/>

					{/* <FormField
						control={form.control}
						name="invitation_code"
						render={({ field }) => (
							<FormItem className="mb-2">
								<FormLabel className=" text-[12px] font-semibold tracking-tight">
									Invitation code
									<span className="text-red-500">*</span>
								</FormLabel>
								<FormControl>
									<Input
										className="px-6 w-full bg-app-lightgray"
										placeholder="Ex : ABCD1234"
										{...field}
									/>
								</FormControl>
								<FormMessage className="text-red-400" />
							</FormItem>
						)}
					/> */}

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem className="mb-2">
								<FormLabel className=" text-[12px] font-semibold tracking-tight">
									Password
									<span className="text-red-500">*</span>
								</FormLabel>
								<FormControl className="relative">
									<div>
										<Input
											type={`${
												passwordVisible
													? "text"
													: "password"
											}`}
											className="px-6 w-full bg-app-lightgray"
											{...field}
											placeholder={
												signUpTranslation.passwordPlaceHolder
											}
										/>
										<div className="absolute text-gray-500 cursor-pointer right-[10px] top-[12px]">
											{passwordVisible ? (
												<FaEyeSlash
													onClick={() =>
														setPasswordVisible(
															false
														)
													}
												/>
											) : (
												<FaEye
													onClick={() =>
														setPasswordVisible(true)
													}
												/>
											)}
										</div>
									</div>
								</FormControl>
								<FormMessage className="text-red-400" />
							</FormItem>
						)}
					/>

					<div className="mt-8">
						<CButton
							text={btnTransalation.continue}
							btnStyle="blue"
							type="submit"
						/>
					</div>
				</div>

				<div
					className={classNames(
						"transition-all invisible z-[1000] bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center",
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

export default RegisterForm;
