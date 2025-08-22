import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema, verifyTokenSchema } from "@/validation/FormValidation";
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
import { HashLoader, PuffLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/slices/auth";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import urls from "@/config/urls";
import urlsV2 from "@/config/urls_v2";
import { useRef, useState } from "react";

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

export default function LoginForm() {
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

	//----------------------------------------------------------

	const maskedEmail = "aib_____@gmail.com";
	const [otp, setOtp] = useState(Array(6).fill(""));
	const inputRefs: any = [
		useRef(null),
		useRef(null),
		useRef(null),
		useRef(null),
		useRef(null),
		useRef(null),
	];

	const handleChange = (e: any, idx: any) => {
		const val = e.target.value.replace(/\D/, "");
		if (!val) return;
		const newOtp = [...otp];
		newOtp[idx] = val.charAt(val.length - 1);
		setOtp(newOtp);
		if (idx < inputRefs.length - 1) {
			inputRefs[idx + 1].current.focus();
		}
	};

	const handleKeyDown = (e: any, idx: any) => {
		if (e.key === "Backspace") {
			if (otp[idx]) {
				// clear this field
				const newOtp = [...otp];
				newOtp[idx] = "";
				setOtp(newOtp);
			} else if (idx > 0) {
				// move back
				inputRefs[idx - 1].current.focus();
				const newOtp = [...otp];
				newOtp[idx - 1] = "";
				setOtp(newOtp);
			}
		}
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		const code = otp.join("");
		console.log("Submitting OTP:", code);
		mutation.mutate({ code });
	};

	const handleResend = () => {
		console.log("Resend code requested");
		mutationGenerateToken.mutate();
	};

	const handleClearAll = () => {
		setOtp(Array(6).fill(""));
		inputRefs[0].current.focus();
	};

	//----------------------------------------------------------

	return (
		<Form {...form}>
			<form
				onSubmit={handleSubmit}
				className="flex flex-col items-center"
			>
				<div className="flex space-x-2">
					{otp.map((digit, idx) => (
						<input
							key={idx}
							ref={inputRefs[idx]}
							type="text"
							inputMode="numeric"
							maxLength={1}
							value={digit}
							onChange={(e) => handleChange(e, idx)}
							onKeyDown={(e) => handleKeyDown(e, idx)}
							className="w-12 h-12 text-xl text-center border border-gray-300 dark:border-gray-600 rounded focus:border-blue-500 focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 transition"
							aria-label={`OTP digit ${idx + 1}`}
						/>
					))}
				</div>
				<div className={`mt-[30px] flex gap-5`}>
					<CButton
						text={"Continue"}
						btnStyle={"blue"}
						type={"submit"}
						width={"200px"}
						height={"40px"}
					/>
					{/* <button
						type="button"
						onClick={handleClearAll}
						className="flex-1 py-3 text-app-secondary font-medium"
					>
						Clear all
					</button> */}
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
			<p className="mt-4 text-sm text-gray-600 dark:text-gray-300 text-center">
				You didn't receive the code ?{" "}
				<button
					onClick={handleResend}
					className="text-blue-600 hover:underline dark:text-blue-400 focus:outline-none"
				>
					Resend code
				</button>
			</p>
		</Form>
	);
}
