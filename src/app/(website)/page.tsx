import React from "react";
import WebsiteHeader from "../../components/websiteComponents/WebsiteHeader";
import Footer from "@/components/shared/Footer/Footer";
import Section1 from "./components/Section1";
import Section2 from "./components/Section2";
import Section3 from "./components/Section3";
import Section4 from "./components/Section4";
import Section5 from "./components/Section5";
import Section6 from "./components/Section6";

const page = () => {
	return (
		<>
			{/* <WebsiteHeader /> */}
			<Section1 />
			<Section2 />
			<Section3 />
			<Section4 />
			<Section5 />
			<Section6 />
			{/* <Footer /> */}
		</>
	);
};

export default page;
