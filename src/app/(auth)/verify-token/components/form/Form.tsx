import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { verifyTokenSchema } from "@/validation/FormValidation";
import { FaChevronRight, FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CButton from "@/components/shared/CButton";
import { AuthService } from "@/api/services/auth";
import { useMutation } from "react-query";
import { HashLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/slices/auth";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import urls from "@/config/urls";
import urlsV2 from "@/config/urls_v2";
import { useState } from "react";

const handleVerifToken = async (data: z.infer<typeof verifyTokenSchema>) => {
	const response = await AuthService.verifToken(data);
	if (!response.ok) {
		const responseBody = await response.json();
		// console.error(response);
		if (response.status === 401) {
			throw new Error(responseBody.message);
		} else {
			throw new Error("Echec Verification OTP.");
		}
	}
	const responseJson = await response.json();
	return responseJson;
};

const handleGenerateToken = async () => {
	const response = await AuthService.generateToken();
	if (!response.ok) {
		const responseBody = await response.json();
		// console.error(response);
		if (response.status === 401) {
			throw new Error(responseBody.message);
		} else {
			throw new Error("Echec Generation OTP.");
		}
	}
	const responseJson = await response.json();
	return responseJson;
};

export default function LogiForm() {
	const previousUrl = window.sessionStorage.getItem("previousUrl");
	const router = useRouter();
	const form = useForm<z.infer<typeof verifyTokenSchema>>({
		resolver: zodResolver(verifyTokenSchema),
		defaultValues: {
			code: "",
		},
	});

	const mutation = useMutation({
		mutationFn: handleVerifToken,
		onError: (err: any) => {
			console.error("Verification Token onError : ", err.message);
			toast.error(err.message);
		},
		onSuccess: (data) => {
			console.log("Verification Token onSuccess : ", data);
			toast.success("Verification Token successful! Redirecting...");
			router.push(previousUrl || urlsV2.dashboardHome.root);
		},
	});

	const onSubmit = (data: any) => {
		mutation.mutate(data);
	};
	const onError = (err: any) => {
		console.error("any", err);
	};

	const mutationGenerateToken = useMutation({
		mutationFn: handleGenerateToken,
		onError: (err: any) => {
			console.error("Generate Token onError : ", err.message);
			toast.error(err.message);
		},
		onSuccess: (data) => {
			console.log("Generate Token onSuccess : ", data);
			toast.success("Generate Token successful");
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit, onError)}>
				<div className="space-y-[20px]">
					<FormField
						control={form.control}
						name="code"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-gray-900 text-sm tracking-tight">
									Entrez le code
								</FormLabel>
								<FormControl>
									<Input
										className="px-6 w-[272px] bg-[#F4EFE3]"
										{...field}
									/>
								</FormControl>
								<FormMessage className="text-red-400" />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex justify-end my-3">
					<div
						className="text-[#18BC7A] cursor-pointer"
						onClick={() => mutationGenerateToken.mutate()}
					>
						Renvoyer le code
					</div>
				</div>

				<div className={`mt-[10vh]`}>
					<CButton
						text={"Connexion"}
						btnStyle={"green"}
						type={"submit"}
						// href={`/`}
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
								mutation.isLoading ||
								mutationGenerateToken.isLoading,
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
	);
}
