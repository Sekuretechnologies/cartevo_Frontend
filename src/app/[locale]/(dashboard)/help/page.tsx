"use client";

import { ContactService } from "@/api/services/cartevo-api/contact";
import CustomTable from "@/components/shared/CustomTable";
import Layout from "@/components/shared/Layout";
import Title from "@/components/shared/Title";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";
import { selectCurrentToken } from "@/redux/slices/auth";
import Link from "next/link";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import HelpForm from "./components/HelpForm";

const handleGetMessages = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;
	const response = await ContactService.get_My_Message({ token });
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "Failed to fetch messages");
	}

	return data;
};

const Help = () => {
	const currentToken: any = useSelector(selectCurrentToken);
	const { createLocalizedLink } = useLocalizedNavigation();

	const getMessageQuery = useQuery({
		queryKey: ["message", currentToken],
		queryFn: handleGetMessages,
		onError: (err: any) => {
			toast.error("Failed to get messages");
		},
	});

	const truncateText = (text: string, length: number = 50) =>
		text.length > length ? text.substring(0, length) + "..." : text;

	const messagesHeaderData = {
		serial: "#",
		name: "Name",
		email: "Email",
		subject: "Subject",
		message: "Message",
		response: "Response",
		status: "Status",
		actions: "Actions",
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
					{msg.status === "PENDING" ? "En attente" : "Répondu"}
				</span>
			),
			actions: (
				<Link
					className="px-2 py-1 bg-primary text-white text-sm rounded hover:bg-blue-600"
					href={createLocalizedLink(`help/messages/${msg.id}`)}
				>
					Details
				</Link>
			),
		})
	);
	return (
		<Layout title="Contact">
			<section>
				<div className="bg-white shadow-sm rounded-xl p-8">
					<HelpForm />
				</div>

				<div>
					<div className="my-[50px] bg-white shadow-md rounded-xl p-5">
						<Title title={"Messages List"} />

						<CustomTable
							headerData={messagesHeaderData}
							tableData={messagesTableData}
							isLoading={
								getMessageQuery.isLoading ||
								getMessageQuery.isFetching
							}
							filter
							filterType={"messages"}
							// filterContent={filterContent}
							// setFilterContent={setFilterContent}
						/>
					</div>
				</div>
			</section>
		</Layout>
	);
};

export default Help;
