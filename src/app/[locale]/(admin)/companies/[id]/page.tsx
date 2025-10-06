import Layout from "@/components/shared/Layout";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import CompanyDetails from "./components/Company-Details/CompanyDetails";
import Users from "./components/Users/Users";
import Customers from "./components/Customers/Customers";
import Cards from "./components/Cards/Cards";
import Transactions from "./components/Transaction/Transactions";
import { Wallet } from "@/components/shared/icons";
import WalletComponent from "./components/wallets/Wallet";

const ManageCompany = () => {
	return (
		<ProtectedRoute allowedClearances={["admin"]}>
			<Layout title="Manage Company">
				<section>
					<div className="bg-white shadow-md rounded-xl py-5">
						<Tabs defaultValue="companyDetails" className="w-full">
							<div className="w-fit">
								<TabsList
									defaultValue={"companyDetails"}
									className="TabsList grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:flex mb-[120px] 2xl:mb-0 "
								>
									<TabsTrigger
										className="TabsTrigger"
										value="companyDetails"
									>
										<span className="px-10 py-4 border-1 rounded-full">
											Company Details
										</span>
									</TabsTrigger>

									<TabsTrigger
										className="TabsTrigger"
										value="users"
									>
										<span className="px-10 py-4 border-1 rounded-full">
											Users
										</span>
									</TabsTrigger>
									<TabsTrigger
										className="TabsTrigger"
										value="customers"
									>
										<span className="px-10 py-4 border-1 rounded-full">
											Customers
										</span>
									</TabsTrigger>

									<TabsTrigger
										className="TabsTrigger"
										value="wallets"
									>
										<span className="px-10 py-4 border-1 rounded-full">
											Wallets
										</span>
									</TabsTrigger>

									<TabsTrigger
										className="TabsTrigger"
										value="cards"
									>
										<span className="px-10 py-4 border-1 rounded-full">
											Cards
										</span>
									</TabsTrigger>

									<TabsTrigger
										className="TabsTrigger"
										value="transactions"
									>
										<span className="px-10 py-4 border-1 rounded-full">
											Transactions
										</span>
									</TabsTrigger>
								</TabsList>
							</div>

							<div>
								<TabsContent value="companyDetails">
									<CompanyDetails />
								</TabsContent>
								<TabsContent value="users">
									<Users />
								</TabsContent>
								<TabsContent value="customers">
									<Customers />
								</TabsContent>

								<TabsContent value="wallets">
									<WalletComponent />
								</TabsContent>

								<TabsContent value="cards">
									<Cards />
								</TabsContent>

								<TabsContent value="transactions">
									<Transactions />
								</TabsContent>
							</div>
						</Tabs>
					</div>
				</section>
			</Layout>
		</ProtectedRoute>
	);
};

export default ManageCompany;
