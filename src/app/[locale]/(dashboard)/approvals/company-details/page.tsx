"use client";

import React from "react";
import Layout from "@/components/shared/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompanyKyb from "./company-kyb/CompanyKyb";
import UserKyc from "./user-kyc/UserKyc";
import Title from "@/components/shared/Title";



const CompanyDetails = () => {
	return (
		<Layout title="company - Details">
			<section>
				<div className="bg-white shadow-md rounded-xl py-5">
					<Tabs defaultValue="company" className="w-full">
						<div className="w-fit">
							<TabsList
								defaultValue={"company"}
								className="TabsList grid grid-cols-2 md:flex mb-[120px] md:mb-0"
							>
								<TabsTrigger
									className="TabsTrigger"
									value="company"
								>
									<span className="px-10 py-4 border-1 rounded-full">
										Company
									</span>
								</TabsTrigger>

								<TabsTrigger
									className="TabsTrigger"
									value="user"
								>
									<span className="px-10 py-4 border-1 rounded-full">
										User
									</span>
								</TabsTrigger>
							</TabsList>
						</div>

						<div>
							<TabsContent value="company">
								<CompanyKyb />
							</TabsContent>

							<TabsContent value="user">
								<UserKyc />
							</TabsContent>
						</div>
					</Tabs>
				</div>
			</section>
		</Layout>
	);
};

export default CompanyDetails;
