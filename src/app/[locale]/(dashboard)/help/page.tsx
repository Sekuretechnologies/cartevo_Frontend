import Layout from "@/components/shared/Layout";
import React from "react";
import ContactForm from "../../(website)/contact/component/form";

const Help = () => {
	return (
		<Layout title="Contact">
			<section>
				<div className="bg-white shadow-sm rounded-xl p-8">
					<ContactForm />
				</div>
			</section>
		</Layout>
	);
};

export default Help;
