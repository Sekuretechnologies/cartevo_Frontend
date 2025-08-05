"use client";

//---------------------------------------
import { useTitle } from "@/hooks/useTitle";
import Image from "next/image";
import VerifyTokenForm from "./components/form/Form";
//---------------------------------------

const VerifyTokenPage = () => {
	useTitle("Sekure | Verification OTP");
	return (
		<section className="flex mt-0 h-screen w-full">
			<div className="absolute inset-0 -z-10">
				<div
					style={{
						width: "100%",
						height: "100%",
						position: "relative",
					}}
				>
					<Image
						alt="vector background"
						src="/assets/Vector.png"
						layout="fill"
						objectFit="contain"
					/>
				</div>
			</div>
			<div className="min-w-[397px] flex justify-end h-full">
				<div className="flex flex-col justify-between items-start h-screen px-10 py-20 basis-1/3">
					<div className="flex justify-start items-start w-[180px] h-[24px] mb-[10vh]">
						<img
							src="/assets/LogoSekure.png"
							alt="logo"
							className="w-[121px] h-full"
						/>
						<img
							src="/assets/Admin-logo.png"
							alt="admin logo"
							className="w-[56px] h-[19px] ml-1"
						/>
					</div>
					<div className="flex flex-col items-start">
						<Image
							src="/assets/user-icon.png"
							alt="User Logo"
							className="rounded-full mb-[10px]"
							width={34}
							height={34}
							priority
						/>
						{/* <div className="bg-[#18BC7A] rounded-full">
							<FaUserCircle color="#FFDB5A" size={70} />
						</div> */}
						<h1 className="text-[25px] font-semibold text-gray-900">
							Verification OTP
						</h1>
						{/* <p className="text-gray-600 font-thin text-sm mb-[30px]">{`Visualisez la courbe d'evolution en nom`}</p> */}
						<div className="mb-[7vh]">
							<VerifyTokenForm />
						</div>
					</div>
				</div>
			</div>

			<div className="w-full h-full hidden md:block bg-gray-100 relative">
				<div className="absolute inset-0 z-1 bg-gradient-to-b from-[#FFDB5A33] to-[#18BC7A] opacity-75"></div>
				<img
					src="/assets/Rectangle.png"
					className="object-cover w-full h-screen"
					alt="login logo"
				/>
			</div>
		</section>
	);
};

export default VerifyTokenPage;
