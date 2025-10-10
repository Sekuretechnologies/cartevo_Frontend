"use client";

import { ContactService } from "@/api/services/cartevo-api/contact";
import CustomTable from "@/components/shared/CustomTable";
import Layout from "@/components/shared/Layout";
import Title from "@/components/shared/Title";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";
import { useTranslation } from "@/hooks/useTranslation";
import { selectCurrentToken } from "@/redux/slices/auth";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "react-query";
import { useSelector } from "react-redux";
import HelpForm from "./components/HelpForm";
import HelpModal from "./components/HelpModal";

const handleGetMessages = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;
	const response = await ContactService.get_My_Message({ token });
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "Failed to fetch messages");
	}

	return data;
};

const handleGetMessageDetails = async ({
	token,
	id,
}: {
	token: string;
	id: string;
}) => {
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

const Help = () => {
	const { t } = useTranslation();
	const help = t.contact.help;
	const currentToken: any = useSelector(selectCurrentToken);
	const { createLocalizedLink } = useLocalizedNavigation();
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedMessage, setSelectedMessage] = useState(null);

	const getMessageQuery = useQuery({
		queryKey: ["message", currentToken],
		queryFn: handleGetMessages,
		onError: (err: any) => {
			toast.error(help.page.fetchError);
		},
	});

	const messageDetailsMutation = useMutation(handleGetMessageDetails, {
		onSuccess: (data) => {
			setSelectedMessage(data.output);
			setIsModalOpen(true);
		},
		onError: (error: any) => {
			toast.error(error.message || "Failed to get message details");
		},
	});

	const truncateText = (text: string, length: number = 50) =>
		text.length > length ? text.substring(0, length) + "..." : text;

	const isAdmin: any = useSelector<RootState>(
		(state) => (state.auth?.company as any).clearance
	);

	const handleViewDetails = (msgId: string) => {
		if (isAdmin === "admin") {
			router.push(createLocalizedLink(`help/messages/${msgId}`));
		} else {
			messageDetailsMutation.mutate({ token: currentToken, id: msgId });
		}
	};

	const messagesHeaderData = {
		serial: help.page.header.serial,
		name: help.page.header.name,
		email: help.page.header.email,
		subject: help.page.header.subject,
		message: help.page.header.message,
		response: help.page.header.response,
		status: help.page.header.status,
		actions: help.page.header.actions,
	};

	const messagesTableData = getMessageQuery.data?.messages?.map(
		(msg: any, index: number) => ({
			serial: index + 1,
			name: msg.name ?? "-",
			email: msg.email ?? "-",
			subject: msg.subject ?? "-",
			message: truncateText(msg.message ?? "-", 50),
			response: truncateText(msg.response ?? "-", 50),
			status: (
				<span
					className={
						msg.status === "PENDING"
							? "px-2 py-1 rounded-full text-yellow-700 bg-yellow-100"
							: msg.status === "RESOLVED"
							? "px-2 py-1 rounded-full text-green-700 bg-green-100"
							: "px-2 py-1 rounded-full text-gray-700 bg-gray-100"
					}
				>
					{msg.status === "PENDING" ? help.page.pending : help.page.answered}
				</span>
			),
			actions: (
				<button
					className="px-2 py-1 bg-primary text-white text-sm rounded hover:bg-blue-600"
					onClick={() => handleViewDetails(msg.id)}
				>
					{help.page.details}
				</button>
			),
		})
	);

	return (
		<Layout title={help.page.contact}>
			<section>
				<div className="bg-white shadow-sm rounded-xl p-8">
					<HelpForm />
				</div>

				<div>
					<div className="my-[50px] bg-white shadow-md rounded-xl p-5">
						<Title title={help.page.listTitle} />

						<CustomTable
							headerData={messagesHeaderData}
							tableData={messagesTableData}
							isLoading={
								getMessageQuery.isLoading ||
								getMessageQuery.isFetching
							}
							filter
							filterType={"messages"}
						/>
					</div>
				</div>
				{selectedMessage && (
					<HelpModal
						isOpen={isModalOpen}
						onClose={() => setIsModalOpen(false)}
						helpRequest={selectedMessage}
					/>
				)}
			</section>
		</Layout>
	);
};

export default Help;