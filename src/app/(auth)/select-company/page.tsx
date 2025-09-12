"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import WebsiteFooter from "@/components/websiteComponents/WebsiteFooter";
import { useTitle } from "@/hooks/useTitle";
import { ItemFlag } from "@/components/shared/ItemFlag";
import CButton from "@/components/shared/CButton";
import { z } from "zod";
import { LoginWithCompany } from "@/validation/FormValidation";
import { AuthService } from "@/api/services/cartevo-api/auth";
import {
	selectCurrentPassword,
	selectCurrentUserEmail,
} from "@/redux/slices/auth";
import { useMutation } from "react-query";
import toast from "react-hot-toast";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { PuffLoader } from "react-spinners";
import classNames from "classnames";
import { useRouter } from "next/navigation";

const handleSubmit = async (data: z.infer<typeof LoginWithCompany>) => {
	const response = await AuthService.loginWithCOmpany(data);
	if (!response.ok) {
		throw new Error("Authentication Failed");
	}
	const responseJson = await response.json();
	return responseJson;
};

const SelectCompany = () => {
	const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
	const [passwordVisible, setPasswordVisible] = useState<boolean>();

	const router = useRouter();

	const companies = useSelector(
		(state: RootState) => state.company.compagnies
	);
	const email = useSelector(selectCurrentUserEmail);
	const password = useSelector(selectCurrentPassword);

	useEffect(() => {
		form.setValue("company_id", selectedCompanyId);
	}, [selectedCompanyId]);

	const form = useForm<z.infer<typeof LoginWithCompany>>({
		resolver: zodResolver(LoginWithCompany),
		defaultValues: {
			email: email,
			password: "",
			company_id: "",
		},
	});

	const mutation = useMutation({
		mutationFn: handleSubmit,
		onSuccess: (data) => {
			toast.success("Authentication Successful");
			router.push("/verify-otp");
		},
		onError: (err: any) => {
			toast.error("Login Failed");
		},
	});

	const onSubmit = (data: any) => {
		mutation.mutate(data);
	};

	const onError = (err: any) => {
		console.error("any", err);
	};

	useTitle("Cartevo | Select-Company");
	return (
		<section className="relative flex flex-col mt-0 ">
			<nav className="absolute z-10 top-0 left-[150px]  h-[80px] flex items-center">
				<a href="/website">
					<img src="/website/logos/logo_full.png" alt="logo" />
				</a>
			</nav>
			<div className="w-full  grid grid-cols-2 font-poppins ">
				<div
					style={{
						backgroundImage:
							"url('/website/home/heroBackground.png')",
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
					}}
					className="font-poppins bg-primary/10 rounded-br-[50px] h-[750px] pr-28 pl-[150px]  flex flex-col pt-44 gap-4   text-center lg:text-left"
				>
					<h1 className="font-bold text-[35px] leading-10 max-w-[500px] tracking-tight">
						Select Your{" "}
						<span className="text-primary">Company</span>
					</h1>
					<p className="text-[12px] mb-8">
						You are associated with multiple companies. Please
						select one to proceed.
					</p>
				</div>

				<div className=" flex flex-col px-20 pt-44 pr-28">
					<h2 className="text-[12px] font-semibold tracking-tight">
						Veuillez sélectionner une entreprise
						<span className="text-red-500">*</span>
					</h2>
					<div className="flex h-fit gap-4 mb-4">
						{companies.map((company) => (
							<button
								key={company.id}
								type="button"
								onClick={() => setSelectedCompanyId(company.id)}
								className={`w-[250px] h-[100px] px-8 py-4 border-1 flex gap-4 items-center rounded-md text-left ${
									selectedCompanyId === company.id
										? "border-blue-500 bg-blue-50"
										: " hover:bg-gray-100"
								}`}
							>
								{company.name}{" "}
								<span className="flex items-center overflow-hidden rounded-full h-[30px] w-[30px]">
									<ItemFlag iso2={company.country} />
								</span>
							</button>
						))}
					</div>

					<div>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit, onError)}
							>
								<FormField
									control={form.control}
									name="company_id"
									render={({ field, formState }) => (
										<>
											<input type="hidden" {...field} />
											{formState.errors.company_id && (
												<p className="text-red-400  -mt-4 text-[12px]">
													{
														formState.errors
															.company_id.message
													}
												</p>
											)}
										</>
									)}
								/>

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-[12px] font-semibold tracking-tight">
												Entrez le mot de passe associé à
												votre entreprise
												<span className="text-red-500">
													*
												</span>
											</FormLabel>
											<FormControl className="relative">
												<div>
													<Input
														type={`${
															passwordVisible
																? "text"
																: "password"
														}`}
														placeholder="ex VotreMotdePasse@11"
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
											<FormMessage className="text-red-400" />
										</FormItem>
									)}
								/>

								<div className="mt-6">
									<CButton
										text="Continue"
										btnStyle="blue"
										type="submit"
										width={"200px"}
										height={"40px"}
									/>
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
					</div>
				</div>
			</div>
			<WebsiteFooter />
		</section>
	);
};
export default SelectCompany;
