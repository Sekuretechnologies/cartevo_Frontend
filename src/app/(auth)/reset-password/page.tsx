"use client";

import { authUrls } from "@/api/urls";
import Footer from "@/components/shared/Footer/Footer";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cartevoIconName } from "@/constants/icons";
import { data } from "@/constants/Index";
import { resetPsswordSchema } from "@/validation/FormValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { z } from "zod";
import SuccessModal from "./components/page";
import { PuffLoader } from "react-spinners";

const ResetPassword = () => {
	const [passwordVisible, setPasswordVisible] = useState<boolean>();
	const [confirmPasswordVisible, setConfirmPasswordVisible] =
		useState<boolean>();
	const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	// Verification de l'existance du token dans l'url

	const form = useForm<z.infer<typeof resetPsswordSchema>>({
		resolver: zodResolver(resetPsswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: {
		password: string;
		confirmPassword: string;
	}) => {
		try {
			setLoading(true);
			const res = await fetch(authUrls.RESET_PASSWORD, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					token: token,
					newPassword: data.password,
				}),
			});

			if (!res.ok) {
				throw new Error(
					"erreur survenue lors le réinitialisation du mot de passe"
				);
			}

			setShowSuccessModal(true);
		} catch (error) {
			toast.error(
				"Erreur survenue lors le réinitialisation du mot de passe"
			);
		} finally {
			setLoading(false);
		}
	};

	if (!token) {
		return (
			<div>
				<p className="text-center text-4xl font-bold mt-96">
					404 Not found
				</p>
			</div>
		);
	}

	return (
		<section className="relative flex flex-col h-screen mt-0 w-full">
			<nav className="absolute z-10 top-0 left-0 w-full h-[80px] px-[50px] flex items-center">
				<a href="/">{cartevoIconName}</a>
			</nav>
			<div className="w-full min-h-[70vh] grid grid-cols-12">
				<div className="relative col-span-5 pl-[60px] pt-[200px] bg-app-lightblue rounded-br-[50px] overflow-hidden">
					<div className="absolute bottom-[100px] left-0 w-full h-[90px]">
						<img
							src="/images/white-cartevo-logo-001.svg"
							alt="white-cartevo-logo"
						/>
					</div>
					<h1 className="font-bold text-4xl text-app-secondary">
						Create a New Password
					</h1>
					<span className="text-lg text-app-secondary">
						Enter your new password to secure your account.
					</span>
				</div>
				<div className="col-span-7 flex justify-center items-center px-[50px]">
					<div className="w-full max-w-[400px]">
						<FormProvider {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-md tracking-tight">
												Password
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
																	setPasswordVisible(
																		true
																	)
																}
															/>
														)}
													</div>
												</div>
											</FormControl>
											<FormMessage className="text-red-500 text-sm mt-1">
												{
													form.formState.errors
														.password?.message
												}
											</FormMessage>
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-900 text-md tracking-tight">
												Confirm Password
											</FormLabel>
											<FormControl className="relative">
												<div>
													<Input
														type={`${
															confirmPasswordVisible
																? "text"
																: "password"
														}`}
														className="px-6 w-full bg-app-lightgray"
														{...field}
													/>
													<div className="absolute text-gray-500 cursor-pointer right-[10px] top-[12px]">
														{confirmPasswordVisible ? (
															<FaEyeSlash
																onClick={() =>
																	setConfirmPasswordVisible(
																		false
																	)
																}
															/>
														) : (
															<FaEye
																onClick={() =>
																	setConfirmPasswordVisible(
																		true
																	)
																}
															/>
														)}
													</div>
												</div>
											</FormControl>
											<FormMessage className="text-red-500 text-sm mt-1">
												{
													form.formState.errors
														.password?.message
												}
											</FormMessage>
										</FormItem>
									)}
								/>

								<button
									type="submit"
									className="w-full py-2 px-4 bg-app-primary text-white rounded hover:bg-app-secondary"
								>
									Reset Password
								</button>
							</form>
						</FormProvider>
					</div>
				</div>
			</div>
			<Footer />
			{showSuccessModal && <SuccessModal />}
			{loading && (
				<div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/40 backdrop-blur-sm ">
					<PuffLoader
						className="shrink-0"
						size={50}
						color="#1F66FF"
					/>
				</div>
			)}
		</section>
	);
};

export default ResetPassword;
