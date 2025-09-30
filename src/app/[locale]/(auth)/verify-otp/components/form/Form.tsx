import { AuthService } from "@/api/services/cartevo-api/auth";
import CButton from "@/components/shared/CButton";
import { Form } from "@/components/ui/form";
import urls from "@/config/urls";
import { setCredentials, setTempToken } from "@/redux/slices/auth";
import { verifyOtpSchema } from "@/validation/FormValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";
import { z } from "zod";
import { selectCurrentUserEmail } from "@/redux/slices/auth";
import { setCompagnies } from "@/redux/slices/companySlice";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";
import { useTranslation } from "@/hooks/useTranslation";

const handleVerifyOtp = async (data: z.infer<typeof verifyOtpSchema>) => {
	const response = await AuthService.verifyOtp(data);
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

const handleResendOtp = async ({ email }: { email: string }) => {
	const response = await AuthService.resendOtp({ email });
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Echec renvoi OTP.");
	}

	return responseJson;
};

// const handleGenerateToken = async () => {
// 	const response = await AuthService.generateToken();
// 	if (!response.ok) {
// 		const responseBody = await response.json();
// 		// console.error(response);
// 		if (response.status === 401) {
// 			throw new Error(responseBody.message);
// 		} else {
// 			throw new Error("Echec Generation OTP.");
// 		}
// 	}
// 	const responseJson = await response.json();
// 	return responseJson;
// };

export default function VerifyOtpForm() {
	const { t } = useTranslation();
	// const previousUrl = window.sessionStorage.getItem("previousUrl");
	const currentUserEmail: any = useSelector(selectCurrentUserEmail);
	const [timeLeft, setTimeLeft] = useState(180);
	const router = useRouter();
	const dispatch = useDispatch();
	const { navigateTo } = useLocalizedNavigation();
	const form = useForm<z.infer<typeof verifyOtpSchema>>({
		resolver: zodResolver(verifyOtpSchema),
		defaultValues: {
			email: currentUserEmail,
			otp: "",
		},
	});

	useEffect(() => {
		if (timeLeft <= 0) return;
		const interval = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [timeLeft]);

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60)
			.toString()
			.padStart(2, "0");
		const s = (seconds % 60).toString().padStart(2, "0");
		return `${m}:${s}`;
	};

	const resendOtpMutation = useMutation({
		mutationFn: handleResendOtp,
		onError: (err: any) => {
			toast.error(err.message);
			console.error("Resend OTP onError : ", err.message);
		},
		onSuccess: () => {
			toast.success("OTP renvoyé avec succès!");
			setTimeLeft(180);
		},
	});

	const mutation = useMutation({
		mutationFn: handleVerifyOtp,
		onError: (err: any) => {
			console.error("Verification OTP onError : ", err.message);
			toast.error(err.message);
		},
		onSuccess: (data) => {
			console.log("Verification OTP onSuccess : ", data);
			const token = data.access_token;
			const user = data.user;
			const company = data.company;
			// localStorage.setItem("access_token", token);
			toast.success("OTP Verified successfully! Redirecting...");
			dispatch(setCredentials({ token, company, user }));

			if (data.requires_company_selection) {
				dispatch(setCompagnies(data.companies));
				dispatch(setTempToken(data.temp_token));
				navigateTo("/select-company");
			} else {
				if (!company?.onboarding_is_completed) {
					navigateTo(urls.onboarding.root);
				} else {
					navigateTo(urls.wallets.root);
				}
			}
		},
	});

	const onSubmit = (data: any) => {
		mutation.mutate(data);
	};
	const onError = (err: any) => {
		console.error("any", err);
	};

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
		form.setValue("otp", newOtp.join(""));
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
				form.setValue("otp", newOtp.join(""));
			} else if (idx > 0) {
				// move back
				inputRefs[idx - 1].current.focus();
				const newOtp = [...otp];
				newOtp[idx - 1] = "";
				setOtp(newOtp);
				form.setValue("otp", newOtp.join(""));
			}
		}
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		const code = otp.join("");
		console.log("Submitting OTP:", code);
		mutation.mutate({ email: form.getValues("email"), otp: code });
	};

	const handleResend = () => {
		console.log("Resend code requested");
		resendOtpMutation.mutate({ email: currentUserEmail });
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
				<div className="mt-8 flex justify-end w-full ">
					<p
						className={`${
							timeLeft > 0
								? "flex flex-col items-end"
								: "flex flex-row items-center gap-2"
						}`}
					>
						{t.verifyOtp.didnt_receive_code}{" "}
						<button
							type="button"
							className={`text-primary font-semibold cursor-pointer ${
								timeLeft > 0
									? "opacity-50 cursor-not-allowed"
									: ""
							}`}
							onClick={handleResend}
							disabled={timeLeft > 0}
						>
							{timeLeft > 0
								? `${t.verifyOtp.resend_in} ${formatTime(
										timeLeft
								  )}`
								: `${t.verifyOtp.resend}`}
						</button>
					</p>
				</div>
				<div className={`mt-[30px] flex gap-5`}>
					<CButton
						text={t.verifyOtp.constinue}
						btnStyle={"blue"}
						type={"submit"}
						width={"175px"}
						height={"49px"}
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
								mutation.isLoading ||
								resendOtpMutation.isLoading,
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
			{/* <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 text-center">
				{`You didn't receive the code ?`}{" "}
				<button
					onClick={handleResend}
					className="text-blue-600 hover:underline dark:text-blue-400 focus:outline-none"
				>
					Resend OTP
				</button>
			</p> */}
		</Form>
	);
}
