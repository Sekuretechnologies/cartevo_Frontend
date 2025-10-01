"use client";
import { useTranslation } from "@/hooks/useTranslation";
import React from "react";
import { MdEmail } from "react-icons/md";

const Privacy_Policy = () => {
	const { t } = useTranslation();
	const privacyTranslation = t.privacy;
	return (
		<section className="scroll-smooth ">
			<div className="customContainer">
				<div className="pt-28">
					<h1 className="font-bold text-4xl mb-8 font-poppins tracking-tight">
						{privacyTranslation.title}
					</h1>
					<div className="space-y-2 font-poppins">
						<p className="text-lg">
							{privacyTranslation.description}
						</p>
						<p className="text-md">
							{privacyTranslation.lastUpdate}
						</p>
					</div>

					{/**Table des matieres */}

					<div className="py-10 border-t my-10">
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.title}
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 font-semibold text-primary">
							<a
								href="#content1"
								onClick={(e) => {
									e.preventDefault();
									document
										.getElementById("content1")
										?.scrollIntoView({
											behavior: "smooth",
										});
								}}
							>
								{privacyTranslation.table.option1}
							</a>
							<a
								href="#content2"
								onClick={(e) => {
									e.preventDefault();
									document
										.getElementById("content2")
										?.scrollIntoView({
											behavior: "smooth",
										});
								}}
							>
								{privacyTranslation.table.option2}
							</a>
							<a
								href="#content3"
								onClick={(e) => {
									e.preventDefault();
									document
										.getElementById("content3")
										?.scrollIntoView({
											behavior: "smooth",
										});
								}}
							>
								{privacyTranslation.table.option3}
							</a>
							<a
								href="#content4"
								onClick={(e) => {
									e.preventDefault();
									document
										.getElementById("content4")
										?.scrollIntoView({
											behavior: "smooth",
										});
								}}
							>
								{privacyTranslation.table.option4}
							</a>
							<a
								href="#content5"
								onClick={(e) => {
									e.preventDefault();
									document
										.getElementById("content5")
										?.scrollIntoView({
											behavior: "smooth",
										});
								}}
							>
								{privacyTranslation.table.option5}
							</a>
							<a
								href="#content6"
								onClick={(e) => {
									e.preventDefault();
									document
										.getElementById("content6")
										?.scrollIntoView({
											behavior: "smooth",
										});
								}}
							>
								{privacyTranslation.table.option6}
							</a>
							<a
								href="#content7"
								onClick={(e) => {
									e.preventDefault();
									document
										.getElementById("content7")
										?.scrollIntoView({
											behavior: "smooth",
										});
								}}
							>
								{privacyTranslation.table.option7}
							</a>
							<a
								href="#content8"
								onClick={(e) => {
									e.preventDefault();
									document
										.getElementById("content8")
										?.scrollIntoView({
											behavior: "smooth",
										});
								}}
							>
								{privacyTranslation.table.option8}
							</a>
							<a
								href="#content9"
								onClick={(e) => {
									e.preventDefault();
									document
										.getElementById("content9")
										?.scrollIntoView({
											behavior: "smooth",
										});
								}}
							>
								{privacyTranslation.table.option9}
							</a>
							<a
								href="#content10"
								onClick={(e) => {
									e.preventDefault();
									document
										.getElementById("content10")
										?.scrollIntoView({
											behavior: "smooth",
										});
								}}
							>
								{privacyTranslation.table.option10}
							</a>
							<a
								href="#content11"
								onClick={(e) => {
									e.preventDefault();
									document
										.getElementById("content11")
										?.scrollIntoView({
											behavior: "smooth",
										});
								}}
							>
								{privacyTranslation.table.option11}
							</a>
							<a
								href="#content12"
								onClick={(e) => {
									e.preventDefault();
									document
										.getElementById("content12")
										?.scrollIntoView({
											behavior: "smooth",
										});
								}}
							>
								{privacyTranslation.table.option12}
							</a>
						</div>
					</div>
				</div>

				{/**Contenu */}
				<div className="max-w-[900px] mx-auto scroll-smooth">
					{/**Content1 */}
					<div className="font-poppins mb-8" id="content1">
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option1}
						</h2>
						<p> {privacyTranslation.constent1.description}</p>
						<div className="flex items-center gap-2 ">
							<MdEmail color="#1f75ff" size={24} />
							<p>{privacyTranslation.constent1.contact}</p>
						</div>
					</div>

					{/**content 2 */}
					<div className="font-poppins mb-8" id="content2">
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option2}
						</h2>
						<p>{privacyTranslation.constent2.desciption}</p>
						<div className="mb-4">
							<p>{privacyTranslation.constent2.optiona.title}</p>
							<p>{privacyTranslation.constent2.optiona.a}</p>
							<p>{privacyTranslation.constent2.optiona.b}</p>
							<p>{privacyTranslation.constent2.optiona.c}</p>
							<p>{privacyTranslation.constent2.optiona.d}</p>
							<p>{privacyTranslation.constent2.optiona.e}</p>
						</div>

						<div className="mb-4">
							<p>{privacyTranslation.constent2.optionb.title}</p>
							<p>{privacyTranslation.constent2.optionb.a}</p>
							<p>{privacyTranslation.constent2.optionb.b}</p>
							<p>{privacyTranslation.constent2.optionb.c}</p>
							<p>{privacyTranslation.constent2.optionb.d}</p>
						</div>

						<div className="mb-4">
							<p>{privacyTranslation.constent2.optionc.title}</p>
							<p>{privacyTranslation.constent2.optionc.a}</p>
							<p>{privacyTranslation.constent2.optionc.b}</p>
							<p>{privacyTranslation.constent2.optionc.c}</p>
						</div>

						<div className="mb-4">
							<p>{privacyTranslation.constent2.optiond.title}</p>
							<p>{privacyTranslation.constent2.optiond.a}</p>
						</div>
					</div>

					{/**Content 3 */}
					<div className="font-poppins mb-8" id="content3">
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option3}
						</h2>
						<div>
							<p>{privacyTranslation.constent3.title}</p>
							<p>{privacyTranslation.constent3[1]}</p>
							<p>{privacyTranslation.constent3[2]}</p>
							<p>{privacyTranslation.constent3[3]}</p>
							<p>{privacyTranslation.constent3[4]}</p>
							<p>{privacyTranslation.constent3[5]}</p>
							<p>{privacyTranslation.constent3[6]}</p>
						</div>
					</div>

					{/**content 4 */}

					<div className="font-poppins mb-8 " id="content4">
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option4}
						</h2>
						<div>
							<p>{privacyTranslation.content4.title}</p>
							<p>{privacyTranslation.content4[1]}</p>
							<p>{privacyTranslation.content4[2]}</p>
							<p>{privacyTranslation.content4[3]}</p>
							<p>{privacyTranslation.content4[4]}</p>
						</div>
					</div>

					{/**content 5*/}

					<div className="font-poppins mb-8" id="content5">
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option5}
						</h2>
						<div>
							<p>{privacyTranslation.content5.title}</p>
							<p>{privacyTranslation.content5[1]}</p>
							<p>{privacyTranslation.content5[2]}</p>
							<p>{privacyTranslation.content5[3]}</p>
							<p>{privacyTranslation.content5[4]}</p>
						</div>
					</div>

					{/**content 6*/}

					<div className="font-poppins mb-8" id="content6">
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option6}
						</h2>
						<div>
							<p>{privacyTranslation.content6.title}</p>
							<p>{privacyTranslation.content6[1]}</p>
							<p>{privacyTranslation.content6[2]}</p>
							<p>{privacyTranslation.content6[3]}</p>
						</div>
					</div>

					{/**content 7*/}

					<div className="font-poppins mb-8" id="content7">
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option7}
						</h2>
						<div>
							<p>{privacyTranslation.content7.title}</p>
							<p>{privacyTranslation.content7[1]}</p>
							<p>{privacyTranslation.content7[2]}</p>
							<p>{privacyTranslation.content7[3]}</p>
							<p>{privacyTranslation.content7[4]}</p>
							<p className="mt-4">
								{privacyTranslation.content7[5]}
							</p>
						</div>
					</div>

					{/**content 8*/}

					<div className="font-poppins mb-8" id="content8">
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option8}
						</h2>
						<div>
							<p>{privacyTranslation.content8.title}</p>
							<p>{privacyTranslation.content8[1]}</p>
							<p>{privacyTranslation.content8[2]}</p>
							<p>{privacyTranslation.content8[3]}</p>
							<p>{privacyTranslation.content8[4]}</p>
							<p>{privacyTranslation.content8[5]}</p>
							<p>{privacyTranslation.content8[6]}</p>
							<p>{privacyTranslation.content8[7]}</p>
							<p className="mt-4">
								{privacyTranslation.content8[8]}
							</p>
						</div>
					</div>

					{/**content 9*/}

					<div className="font-poppins mb-8" id="content9">
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option9}
						</h2>
						<div>
							<p>{privacyTranslation.content9.title}</p>
						</div>
					</div>

					{/**content 10*/}

					<div className="font-poppins mb-8" id="content10">
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option10}
						</h2>
						<div>
							<p>{privacyTranslation.content10.title}</p>
							<p>{privacyTranslation.content10[1]}</p>
							<p>{privacyTranslation.content10[2]}</p>
							<p>{privacyTranslation.content10[3]}</p>
							<p className="mt-4">
								{privacyTranslation.content10[4]}
							</p>
						</div>
					</div>

					{/**content 11*/}

					<div className="font-poppins mb-8" id="content11">
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option11}
						</h2>
						<div>
							<p>{privacyTranslation.content11.title}</p>
						</div>
					</div>

					{/**content 12*/}

					<div className="font-poppins mb-8" id="content12">
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option12}
						</h2>
						<div>
							<p>{privacyTranslation.content12.title}</p>
							<div className="flex  items-center gap-2">
								<MdEmail size={24} color="#1f75ff" />
								<p>{privacyTranslation.content12.email}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Privacy_Policy;
