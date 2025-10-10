"use client";

import { ContactService } from "@/api/services/cartevo-api/contact";
import CButton from "@/components/shared/CButton";
import Layout from "@/components/shared/Layout";
import { useTranslation } from "@/hooks/useTranslation";
import { RootState } from "@/redux/store";
import { Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";

const handleGetMessageDetails = async ({ queryKey }: any) => {
	const [_key, token, id] = queryKey;
	if (!token) {
		throw new Error("No authentication token found");
	}
	const response = await ContactService.get_message_details({ token, id });
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "Failed to fetch message details");
	}

	return data;
};

const handleReplyMessage = async ({
	token,
	id,
	response,
}: {
	token: string;
	id: string;
	response: string;
}) => {
	const res = await ContactService.replyToMessage({
		token,
		id,
		body: { response },
	});
	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.message || "Failed to reply message");
	}

	return data;
};
const MessageDetails = () => {
	const { t } = useTranslation();
	const help = t.contact.help;
	const { id } = useParams();
	const queryClient = useQueryClient();
	const [response, setResponse] = useState("");
	const responseWrapperRef = useRef(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				responseWrapperRef.current &&
				!(responseWrapperRef.current as any).contains(event.target)
			) {
				setIsReplying(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [responseWrapperRef]);

	const currentToken: any = useSelector<RootState>(
		(state) => state.auth.token
	);
	const messageDetailsQueryRes = useQuery({
		queryKey: ["messageDetails", currentToken, id],
		queryFn: handleGetMessageDetails,
		onSuccess: (data) => {
			if (data?.output?.response) {
				setResponse(data.output.response);
			}
		},
		onError: (error) => {
			toast.error(help.detailsPage.loadError);
		},
	});

	const replyToMessageMutation = useMutation(handleReplyMessage, {
		onSuccess: () => {
			toast.success(help.detailsPage.replySuccess);
			queryClient.invalidateQueries(["messageDetails", currentToken, id]);
		},
		onError: (error: any) => {
			toast.error(error.message || help.detailsPage.replyError);
		},
	});

	const message = messageDetailsQueryRes.data?.output;

	const [isReplying, setIsReplying] = useState(false);

	const handleSendReply = () => {
		if (response.trim()) {
			replyToMessageMutation.mutate({
				token: currentToken,
				id: id as string,
				response,
			});
		} else {
			toast.error(help.detailsPage.emptyReplyError);
		}
	};

	return (
		<Layout title={help.detailsPage.title}>
			{messageDetailsQueryRes.isLoading ? (
				<div className="flex justify-center items-center h-64">
					<div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
				</div>
			) : messageDetailsQueryRes.isError ? (
				<div className="text-red-500 text-center">
					{help.detailsPage.loadError}
				</div>
			) : (
				<div className="px-5 py-8 relative bg-white">
					<div>
						{/* Message Information */}
						<div>
							<div className="flex flex-col gap-2 md:flex-row md:justify-between">
								<h3 className="text-lg font-semibold text-app-secondary">
									{help.detailsPage.messageInfo}
								</h3>
								<div className="">
									<div
										className={`px-8 py-3 w-fit rounded-full font-semibold ${
											message?.status === "RESOLVED"
												? "bg-green-100 text-green-800"
												: "bg-yellow-100 text-yellow-800"
										}`}
									>
										<p>{message?.status || "PENDING"}</p>
									</div>
								</div>
							</div>

							<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm mb-1">
										{help.detailsPage.subject}
									</label>
									<input
										className="w-full bg-app-lightgray p-3 rounded-lg"
										value={
											message?.subject || help.detailsPage.notProvided
										}
										readOnly
									/>
								</div>
								<div>
									<label className="block text-sm mb-1">
										{help.detailsPage.date}
									</label>
									<input
										className="w-full bg-app-lightgray p-3 rounded-lg"
										value={
											message?.createAt
												? new Date(
														message.createAt
											  ).toLocaleString()
												: help.detailsPage.notProvided
										}
										readOnly
									/>
								</div>
								<div>
									<label className="block text-sm mb-1">
										{help.detailsPage.service}
									</label>
									<input
										className="w-full bg-app-lightgray p-3 rounded-lg"
										value={
											message?.service || help.detailsPage.notProvided
										}
										readOnly
									/>
								</div>
								<div>
									<label className="block text-sm mb-1">
										{help.detailsPage.activity}
									</label>
									<input
										className="w-full bg-app-lightgray p-3 rounded-lg"
										value={
											message?.activity || help.detailsPage.notProvided
										}
										readOnly
									/>
								</div>
								<div className="md:col-span-2">
									<label className="block text-sm mb-1">
										{help.detailsPage.message}
									</label>
									<textarea
										className="w-full bg-app-lightgray p-3 rounded-lg"
										value={
											message?.message || help.detailsPage.notProvided
										}
										readOnly
										rows={5}
									/>
								</div>
								<div
									className="md:col-span-2"
									ref={responseWrapperRef}
								>
									<label className="block text-sm mb-1">
										{help.detailsPage.response}
									</label>
									{isReplying ? (
										<div className="relative">
											<textarea
												className={`w-full bg-app-lightgray p-3 rounded-lg pr-12`}
												value={response}
												onChange={(e) =>
													setResponse(e.target.value)
												}
												placeholder={
													!message?.response
														? help.detailsPage.addResponsePlaceholder
														: ""
												}
												rows={5}
												disabled={
													replyToMessageMutation.isLoading
												}
											/>
											<div className="absolute top-1/2 right-2 -translate-y-1/2">
												{replyToMessageMutation.isLoading ? (
													<div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
												) : (
													<CButton
														onClick={
															handleSendReply
														}
														btnStyle="blue"
														icon={
															<Send size={20} />
														}
														width="40px"
														height="40px"
														text={help.detailsPage.send}
													/>
												)}
											</div>
										</div>
									) : (
										<div
											className="w-full bg-app-lightgray p-3 rounded-lg cursor-pointer min-h-[120px]"
											onClick={() => setIsReplying(true)}
										>
											{message?.response ? (
												<p className="text-sm text-gray-800">
													{message.response}
												</p>
											) : (
												<p className="text-sm text-gray-500">
													{help.detailsPage.clickToAddResponse}
												</p>
											)}
										</div>
									)}
								</div>
							</div>
						</div>

						{/* Sender Information */}
						<div className="mt-8">
							<h3 className="text-lg font-semibold text-app-secondary">
								{help.detailsPage.senderInfo}
							</h3>
							<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm mb-1">
										{help.detailsPage.fullName}
									</label>
									<input
										className="w-full bg-app-lightgray p-3 rounded-lg"
										value={message?.name || help.detailsPage.notProvided}
										readOnly
									/>
								</div>
								<div>
									<label className="block text-sm mb-1">
										{help.detailsPage.email}
									</label>
									<input
										className="w-full bg-app-lightgray p-3 rounded-lg"
										value={message?.email || help.detailsPage.notProvided}
										readOnly
									/>
								</div>
								<div>
									<label className="block text-sm mb-1">
										{help.detailsPage.phone}
									</label>
									<input
										className="w-full bg-app-lightgray p-3 rounded-lg"
										value={message?.phone || help.detailsPage.notProvided}
										readOnly
									/>
								</div>
								<div>
									<label className="block text-sm mb-1">
										{help.detailsPage.companyName}
									</label>
									<input
										className="w-full bg-app-lightgray p-3 rounded-lg"
										value={
											message?.companyName ||
											help.detailsPage.notProvided
										}
										readOnly
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</Layout>
	);
};

export default MessageDetails;

