import React from "react";
import Section1 from "../components/Section1";
import PricingSection1 from "./components/pricingSection1";
import PricingSection2 from "./components/PricingSection2";
import PricingSection3 from "./components/PricingSection3";
import PricingSection4 from "./components/PricingSection4";

const Pricing = () => {
	return (
		<>
			{/* <WebsiteHeader /> */}
			<PricingSection1 />
			<PricingSection2 />
			<PricingSection3 />
			<PricingSection4 />
		</>
	);
};

export default Pricing;
