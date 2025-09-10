import React from "react";
import ContactForm from "./component/form";

const Contact = () => {
	return (
		<section className="pt-20">
			<div className="  customContainer grid grid-cols-1 lg:grid-cols-2 lg:gap-20">
				<div className=" font-poppins pt-20 flex flex-col gap-4 items-center text-center lg:text-left ">
					<div
						style={{
							backgroundImage:
								"url('/website/home/heroBackground.png')",
							backgroundSize: "cover",
							backgroundPosition: "center",
							backgroundRepeat: "no-repeat",
						}}
						className="w-1/2 hidden lg:block h-[610px] rounded-br-[50px] absolute top-0 left-0 bg-primary/10"
					></div>
				</div>

				<div>
					<ContactForm />
				</div>
			</div>
		</section>
	);
};

export default Contact;
