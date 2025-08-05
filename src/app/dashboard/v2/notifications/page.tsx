"use client";
import Notification from "./components/tabs/notification";
import NotificationWhatsapp from "./components/tabs/whatsapp";
import Layout from "@/components/shared/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTitle } from "@/hooks/useTitle";

const notificationData = ["Notifications", "Emails", "Message Sekure"];

export default function NOtificationPage() {
	useTitle("Sekure | Notifications", true);

	return (
		<Layout title={"Notifications"}>
			<section className="">
				<Tabs defaultValue="01" className="w-full">
					<div className="border-b-1">
						<TabsList className="TabsList">
							<TabsTrigger className="TabsTrigger" value="01">
								Notifications
							</TabsTrigger>
							<TabsTrigger className="TabsTrigger" value="03">
								Whatsapp
							</TabsTrigger>
							<TabsTrigger className="TabsTrigger" value="02">
								Email
							</TabsTrigger>
						</TabsList>
					</div>
					<div className={`mt-5`}>
						<TabsContent value="01">
							<Notification />
						</TabsContent>
						<TabsContent value="03">
							<NotificationWhatsapp />
						</TabsContent>
						<TabsContent value="02">
							<div>Email</div>
						</TabsContent>
					</div>
				</Tabs>
				{/* 				
				<Tabs defaultValue="Notifications">
					<TabsComponent data={notificationData} />
					<TabsContent value="Notifications">
						<Notification />
					</TabsContent>
					<TabsContent value="Emails">
						<Notification />
					</TabsContent>
					<TabsContent value="Message Sekure">
						<Notification />
					</TabsContent>
				</Tabs> */}
			</section>
		</Layout>
	);
}
