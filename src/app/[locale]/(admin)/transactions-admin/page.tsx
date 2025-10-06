import Layout from "@/components/shared/Layout";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import React from "react";

const TransactionAdmin = () => {
	return (
		<ProtectedRoute allowedClearances={["admin"]}>
			<Layout title="Transaction">
				<p>hello</p>
			</Layout>
		</ProtectedRoute>
	);
};

export default TransactionAdmin;
