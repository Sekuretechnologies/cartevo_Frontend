import CButton from "@/components/shared/CButton";
import DialogWrapper from "@/components/shared/DialogWrapper";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { selectStartDate, setStartDate } from "@/redux/slices_v2/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@nextui-org/date-picker";
import { getNextUIDatePickerValueStr, parseDateStr } from "@/utils/DateFormat";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import cstyles from "./styles/style.module.scss";
import classNames from "classnames";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { HashLoader } from "react-spinners";
import { z } from "zod";
// import { useNavigate } from 'react-router-dom';

export const formSchema: any = z.object({
	startDate: z.string({ message: "Entrez une date" }),
});

interface ModalProps {
	customer?: any;
	isOpen: boolean;
	setIsOpen: (data?: any) => void;
}

export default function ChangeStartDateModalForm({
	isOpen,
	setIsOpen,
	customer,
}: ModalProps) {
	const pathname = usePathname();
	const redirectRef: any = useRef();

	const currentStartDate = useSelector(selectStartDate);

	const handleClose = () => {
		setIsOpen(false);
	};

	const router = useRouter();

	// const navigate = useNavigate();
	const dispatch = useDispatch();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			startDate: currentStartDate ? currentStartDate : "2024-03-01",
		},
	});

	const onSubmit = (data: any) => {
		// console.log("pathname : ", pathname);
		dispatch(setStartDate(String(data.startDate || "")));
		handleClose();
		// redirectRef.current.href = window.location.pathname;
		// redirectRef.current.click();
	};
	const onError = (err: any) => {
		console.error("onError : ", err);
	};

	return (
		<DialogWrapper
			open={isOpen}
			handleClose={handleClose}
			title={`Changer la date de debut`}
			// titleLine2={`pour obtenir des statistiques`}
		>
			<div className="min-w-[350px] max-w-[700px]">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit, onError)}>
						<div className="space-y-[20px]">
							<FormField
								control={form.control}
								name="startDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-[500] tracking-tight">{`Date - ${form.getValues(
											"startDate"
										)}`}</FormLabel>
										<FormControl>
											<DatePicker
												className={`text-gray-900 font-normal ${cstyles["datepicker_yellow_bg"]}`}
												defaultValue={
													field.value
														? parseDate(
																parseDateStr(
																	field.value
																)
														  )
														: null
												}
												onChange={(date) => {
													const newDateStr =
														getNextUIDatePickerValueStr(
															date.year,
															date.month,
															date.day
														);
													// console.log("date : ", date);
													// console.log("newDateStr : ", newDateStr);
													form.setValue(
														"startDate",
														newDateStr
													);
												}}
												showMonthAndYearPickers
											/>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>
						</div>

						<div className={`mt-[10vh]`}>
							<CButton
								text={`Valider`}
								btnStyle="green"
								type={"submit"}
								width={"100%"}
							/>
						</div>
						{/* <div
                        className={classNames(
                            "transition-all invisible z-20 bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center",
                            {
                                "!opacity-100 !visible z-20": mutation.isLoading,
                            }
                        )}
                    >
                        <HashLoader
                            className="shrink-0"
                            size={50}
                            color="#1F66FF"
                        />
                    </div> */}
						{/* <Button type="submit" className="w-[272px] mt-[10vh] bg-[#18BC7A] hover:bg-[#FFDB5A] hover:text-[#18BC7A] rounded-full">Connexion</Button> */}
					</form>
				</Form>
				<a ref={redirectRef} hidden href="#"></a>
			</div>
		</DialogWrapper>
	);
}
