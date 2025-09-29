"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import WebsiteFooter from "@/components/websiteComponents/WebsiteFooter";
import { useTitle } from "@/hooks/useTitle";
import { ItemFlag } from "@/components/shared/ItemFlag";
import CButton from "@/components/shared/CButton";
import { z } from "zod";
import { LoginWithCompany } from "@/validation/FormValidation";
import { AuthService } from "@/api/services/cartevo-api/auth";
import { setCredentials } from "@/redux/slices/auth";
import { useMutation } from "react-query";
import toast from "react-hot-toast";
import { Form, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PuffLoader } from "react-spinners";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { setCompagnies } from "@/redux/slices/companySlice";
import urls from "@/config/urls";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";
/**
 * API call for selecting company after OTP
 */
const loginWithCompany = async (data: z.infer<typeof LoginWithCompany>) => {
	console.log("Sending data to API:", data);
	const response = await AuthService.loginWithCOmpany(data);
	console.log("API Response status:", response.status);
	
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		console.error("API Error:", errorData);
		throw new Error(errorData.message || "Authentication Failed");
	}
	return response.json();
};

const SelectCompany = () => {
	const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
	const dispatch = useDispatch();
	const router = useRouter();
	const { navigateTo, createLocalizedLink } = useLocalizedNavigation();
	useTitle("Cartevo | Select-Company");

	// Redux state
	const companies = useSelector(
		(state: RootState) => state.company.compagnies
	);
	const tempToken = useSelector((state: RootState) => state.auth.temp_token);
	const company = useSelector((state: RootState) => state.auth.company);
	// Form setup
	const form = useForm<z.infer<typeof LoginWithCompany>>({
		resolver: zodResolver(LoginWithCompany),
		defaultValues: {
			company_id: "",
			temp_token: tempToken ?? undefined,
		},
	});

	// Mutation for company login
	const mutation = useMutation({
		mutationFn: loginWithCompany,
		onSuccess: (data) => {
			console.log("Verification OTP onSuccess : ", data);

			const token = data.access_token;
			const user = data.user;
			const company = data.company;

			dispatch(setCredentials({ token, company, user }));

			toast.success("Authentication Successful");

			if (!company?.onboarding_is_completed) {
				navigateTo(urls.onboarding.root);
			} else {
				navigateTo(urls.wallets.root);
			}
			// router.push(urls.onboarding.root);
		},
		onError: (error: any) => {
			console.error("Mutation error:", error);
			toast.error(error.message || "Login Failed");
		},
	});

	const handleSubmit = (data: z.infer<typeof LoginWithCompany>) => {
		console.log("Form data before submission:", data);
		console.log("Selected company ID:", selectedCompanyId);
		console.log("Temp token:", tempToken);
		mutation.mutate(data);
	};

	useEffect(() => {
		// Dès que l'utilisateur sélectionne une entreprise, on l'injecte dans le formulaire
		form.setValue("company_id", selectedCompanyId);
	}, [selectedCompanyId, companies, tempToken, form]);

	return (
		<section className="relative flex flex-col mt-0">
			{/* Navbar */}
			<nav className="absolute z-10 top-0 lg:left-[150px] h-[80px] flex items-center">
				<a href={createLocalizedLink("/")}>
					<img src="/website/logos/logo_full.png" alt="logo" />
				</a>
			</nav>

			<div className="w-full grid grid-cols-1  lg:grid-cols-2 font-poppins">
				{/* Left panel */}
				<div
					style={{
						backgroundImage:
							"url('/website/home/heroBackground.png')",
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
					}}
					className="bg-primary/10 rounded-br-[50px] h-[750px] pr-28 pl-[150px] hidden lg:flex flex-col justify-center gap-4  text-center lg:text-left"
				>
					<h1 className="font-bold text-[35px] leading-10 max-w-[500px] tracking-tight">
						Sélectionnez une{" "}
						<span className="text-primary">{`entreprise`}</span>
					</h1>
					<p className="text-[12px] mb-8">
						Vous êtes associé(e) à plusieurs entreprises. Veuillez
						en sélectionner une pour continuer.
					</p>
				</div>

				{/* Right panel */}
				<div className="flex flex-col px-4 lg:px-20 mt-32 lg:mt-0 justify-center lg:pr-28 pr-0 ">
					<h2 className="text-[30px] mb-8 font-semibold tracking-tight  w-full">
						Veuillez sélectionner une entreprise
						<span className="text-red-500">*</span>
					</h2>

					{/* List of companies */}
					<div className="flex flex-wrap h-fit gap-4 mb-4">
						{companies.map((company) => (
							<button
								key={company.id}
								type="button"
								onClick={() => setSelectedCompanyId(company.id)}
								className={`w-[250px] h-[100px] px-8 py-4 border-1 flex gap-4 items-center rounded-md text-left ${
									selectedCompanyId === company.id
										? "border-blue-500 bg-blue-50"
										: "hover:bg-gray-100"
								}`}
							>
								{company.name}
								<span className="flex items-center overflow-hidden rounded-full h-[30px] w-[30px]">
									<ItemFlag iso2={company.country} />
								</span>
							</button>
						))}
					</div>

					{/* Form */}
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleSubmit)}>
							<FormField
								control={form.control}
								name="company_id"
								render={({ field, formState }) => (
									<>
										<input type="hidden" {...field} />
										{formState.errors.company_id && (
											<p className="text-red-400 -mt-4 text-[12px]">
												{
													formState.errors.company_id
														.message
												}
											</p>
										)}
									</>
								)}
							/>

							<div className="mt-6">
								<CButton
									text="Continue"
									btnStyle="blue"
									type="submit"
									width="175px"
									height="49px"
								/>
							</div>

							{/* Loader overlay */}
							<div
								className={classNames(
									"transition-all invisible z-[1000] bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center",
									{
										"!opacity-100 !visible z-[1000]":
											mutation.isLoading,
									}
								)}
							>
								<PuffLoader size={50} color="#1F66FF" />
							</div>
						</form>
					</Form>
				</div>
			</div>

			<WebsiteFooter />
		</section>
	);
};

export default SelectCompany;
