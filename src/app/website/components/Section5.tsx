import { ChevronRight } from "lucide-react";
import React from "react";

const Section5 = () => {
	return (
		<section className="text-[#222222] pt-12">
			<div className="customContainer  flex flex-col gap-8 lg:flex-row-reverse lg:w-full ">
				<div className="flex flex-col  items-center  lg:items-start   font-poppins">
					<div>
						<div>
							<p className=" border-1 border-[#222222] mb-4 font-semibold text-[13px] px-8 py-2 w-fit rounded-full hover:bg-[#222222] duration-300 hover:text-white">
								Payment as a service
							</p>
							<h1 className="text-[40px] font-bold leading-10 mb-6 text-center lg:text-left  leading-12 ">
								Choisissez la simplicité qui d’dapte à vous
							</h1>
							<p className="text-center text-[12px] text-[#222222] lg:text-left lg:w-[80%] mb-6">
								african woman, , looking professional, headwrap,
								phone in hands, white empty background, big
								smile,, dark skirt, colors blue, green, golden
							</p>
						</div>

						<div className="mt-4 grid grid-cols-1 gap-12 md:grid-cols-2 ">
							<div className="flex items-start gap-4">
								<div>
									<p className="w-6 h-6  bg-primary  flex justify-center items-center  rounded-full">
										<ChevronRight
											color="#ffffff"
											size={20}
										/>
									</p>
								</div>
								<div className="-mt-2">
									<h2 className="text-[24px] font-semibold ">
										Integrate
									</h2>
									<p className="text-[#7B7B7B] text-[12px]">
										Boostez vos services avec des paiements
										rapides, wallets multi-devises et cartes
										virtuelles. Nous apportons la fiabilité
										et la scalabilité nécessaires pour
										soutenir vos ambitions financières
										modernes.
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div>
									<p className="w-6 h-6  bg-primary  flex justify-center items-center  rounded-full">
										<ChevronRight
											color="#ffffff"
											size={20}
										/>
									</p>
								</div>
								<div className="-mt-2">
									<h2 className="text-[24px] font-semibold ">
										Digital Trust
									</h2>
									<p className="text-[#7B7B7B] text-[12px]">
										Boostez vos services avec des paiements
										rapides, wallets multi-devises et cartes
										virtuelles. Nous apportons la fiabilité
										et la scalabilité nécessaires pour
										soutenir vos ambitions financières
										modernes.
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div>
									<p className="w-6 h-6  bg-primary  flex justify-center items-center  rounded-full">
										<ChevronRight
											color="#ffffff"
											size={20}
										/>
									</p>
								</div>
								<div className="-mt-2">
									<h2 className="text-[24px] font-semibold ">
										Scalable
									</h2>
									<p className="text-[#7B7B7B] text-[12px]">
										Boostez vos services avec des paiements
										rapides, wallets multi-devises et cartes
										virtuelles. Nous apportons la fiabilité
										et la scalabilité nécessaires pour
										soutenir vos ambitions financières
										modernes.
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div>
									<p className="w-6 h-6  bg-primary  flex justify-center items-center  rounded-full">
										<ChevronRight
											color="#ffffff"
											size={20}
										/>
									</p>
								</div>
								<div className="-mt-2">
									<h2 className="text-[24px] font-semibold ">
										Automate
									</h2>
									<p className="text-[#7B7B7B] text-[12px]">
										Boostez vos services avec des paiements
										rapides, wallets multi-devises et cartes
										virtuelles. Nous apportons la fiabilité
										et la scalabilité nécessaires pour
										soutenir vos ambitions financières
										modernes.
									</p>
								</div>
							</div>
						</div>
					</div>
					<button className="text-white cursor-pointer mt-4 flex items-center justify-between pl-16 pr-5 bg-[#222222] w-[251px] h-[59px] rounded-[20px] ">
						Commencer <ChevronRight />
					</button>
				</div>

				<div className="relative  lg:w-[2500px]  flex justify-center  items-end">
					<img
						src="/website/home/girl.png"
						alt=" image"
						className="w-full object-contain mx-auto"
					/>
					<img
						src="/website/home/section5-2.png"
						alt=""
						className="absolute top-0 right-0"
					/>
				</div>
			</div>
		</section>
	);
};

export default Section5;
