"use client";

import Layout from "@/components/shared/Layout";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PendingCompanies from "./components/pending-companies/PendingCompanies";
import ApprovedCompanies from "./components/approved-companies/ApprovedCompanies";
import RejectedCompanies from "./components/rejected-companies/RejectedCompanies";
import NoneCompanies from "./components/none-companies/NoneCompanies";
import AllCompanies from "./components/all-companies/AllCompanies";

const Approvals = () => {
	return (
		<Layout title="Approvals">
			<section>
				<div className="bg-white shadow-md rounded-xl py-5">
					<Tabs defaultValue="pending" className="w-full">
						<div className="w-fit">
							<TabsList
								defaultValue={"pending"}
								className="TabsList grid grid-cols-2 md:flex mb-[120px] md:mb-0"
							>
								<TabsTrigger
									className="TabsTrigger"
									value="pending"
								>
									<span className="px-10 py-4 border-1 rounded-full">
										Pending
									</span>
								</TabsTrigger>

								<TabsTrigger
									className="TabsTrigger"
									value="approved"
								>
									<span className="px-10 py-4 border-1 rounded-full">
										Approved
									</span>
								</TabsTrigger>

								<TabsTrigger
									className="TabsTrigger"
									value="rejected"
								>
									<span className="px-10 py-4 border-1 rounded-full">
										Rejected
									</span>
								</TabsTrigger>

								<TabsTrigger
									className="TabsTrigger"
									value="none"
								>
									<span className="px-10 py-4 border-1 rounded-full">
										None
									</span>
								</TabsTrigger>

								<TabsTrigger
									className="TabsTrigger"
									value="all"
								>
									<span className="px-10 py-4 border-1 rounded-full">
										All
									</span>
								</TabsTrigger>
							</TabsList>
						</div>

						<div>
							<TabsContent value="pending">
								<PendingCompanies />
							</TabsContent>

							<TabsContent value="approved">
								<ApprovedCompanies />
							</TabsContent>

							<TabsContent value="rejected">
								<RejectedCompanies />
							</TabsContent>

							<TabsContent value="none">
								<NoneCompanies />
							</TabsContent>

							<TabsContent value="all">
								<AllCompanies />
							</TabsContent>
						</div>
					</Tabs>
				</div>
			</section>
		</Layout>
	);
};

export default Approvals;
