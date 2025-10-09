"use client";
import { useTranslation } from "@/hooks/useTranslation";
import React from "react";
import { MdEmail } from "react-icons/md";

const Terms = () => {
	const { t } = useTranslation();
	const privacyTranslation = t.term;
	return (
		<section className="scroll-smooth ">
			<div className="customContainer">
				<div className="pt-28">
					<h1 className="font-bold text-4xl mb-8 font-poppins tracking-tight">
						{privacyTranslation.title}
					</h1>

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
							<a
								href="#content13"
								onClick={(e) => {
									e.preventDefault();
									document
										.getElementById("content13")
										?.scrollIntoView({
											behavior: "smooth",
										});
								}}
							>
								{privacyTranslation.table.option13}
							</a>
							<a
								href="#content14"
								onClick={(e) => {
									e.preventDefault();
									document
										.getElementById("content14")
										?.scrollIntoView({
											behavior: "smooth",
										});
								}}
							>
								{privacyTranslation.table.option14}
							</a>
							<a
								href="#content15"
								onClick={(e) => {
									e.preventDefault();
									document
										.getElementById("content15")
										?.scrollIntoView({
											behavior: "smooth",
										});
								}}
							>
								{privacyTranslation.table.option15}
							</a>
							<a
								href="#content16"
								onClick={(e) => {
									e.preventDefault();
									document
										.getElementById("content16")
										?.scrollIntoView({
											behavior: "smooth",
										});
								}}
							>
								{privacyTranslation.table.option16}
							</a>
							<a
								href="#content17"
								onClick={(e) => {
									e.preventDefault();
									document
										.getElementById("content17")
										?.scrollIntoView({
											behavior: "smooth",
										});
								}}
							>
								{privacyTranslation.table.option17}
							</a>
							<a
								href="#content18"
								onClick={(e) => {
									e.preventDefault();
									document
										.getElementById("content18")
										?.scrollIntoView({
											behavior: "smooth",
										});
								}}
							>
								{privacyTranslation.table.option18}
							</a>
							<a
								href="#content19"
								onClick={(e) => {
									e.preventDefault();
									document
										.getElementById("content19")
										?.scrollIntoView({
											behavior: "smooth",
										});
								}}
							>
								{privacyTranslation.table.option19}
							</a>
							<a
								href="#content20"
								onClick={(e) => {
									e.preventDefault();
									document
										.getElementById("content20")
										?.scrollIntoView({
											behavior: "smooth",
										});
								}}
							>
								{privacyTranslation.table.option20}
							</a>
							<a
								href="#content121"
								onClick={(e) => {
									e.preventDefault();
									document
										.getElementById("content21")
										?.scrollIntoView({
											behavior: "smooth",
										});
								}}
							>
								{privacyTranslation.table.option21}
							</a>
						</div>
					</div>
				</div>

				{/**Contenu */}
				<div className="max-w-[900px] mx-auto scroll-smooth">
					{/**Content1 */}
					<div
						className="font-poppins mb-8 border-b-4 pb-8"
						id="content1"
					>
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option1}
						</h2>
						<p className="mb-2">
							{" "}
							{privacyTranslation.constent1.description}
						</p>
						<div className="flex flex-col gap-2 ">
							<p>
								<span className="font-bold">
									{privacyTranslation.constent1.option1.span1}
								</span>{" "}
								<span>
									{privacyTranslation.constent1.option1.span2}
								</span>
							</p>
							<p>
								<span className="font-bold">
									{privacyTranslation.constent1.option2.span1}
								</span>{" "}
								<span>
									{privacyTranslation.constent1.option2.span2}
								</span>
							</p>

							<p>
								<span className="font-bold">
									{privacyTranslation.constent1.option3.span1}
								</span>{" "}
								<span>
									{privacyTranslation.constent1.option3.span2}
								</span>
							</p>

							<p>
								<span className="font-bold">
									{privacyTranslation.constent1.option4.span1}
								</span>{" "}
								<span>
									{privacyTranslation.constent1.option4.span2}
								</span>
							</p>

							<p>
								<span className="font-bold">
									{privacyTranslation.constent1.option5.span1}
								</span>{" "}
								<span>
									{privacyTranslation.constent1.option5.span2}
								</span>
							</p>
							<p>
								<span className="font-bold">
									{privacyTranslation.constent1.option6.span1}
								</span>{" "}
								<span>
									{privacyTranslation.constent1.option6.span2}
								</span>
							</p>
							<p>
								<span className="font-bold">
									{privacyTranslation.constent1.option7.span1}
								</span>{" "}
								<span>
									{privacyTranslation.constent1.option7.span2}
								</span>
							</p>
							<p>
								<span className="font-bold">
									{privacyTranslation.constent1.option8.span1}
								</span>{" "}
								<span>
									{privacyTranslation.constent1.option8.span2}
								</span>
							</p>
							<p>
								<span className="font-bold">
									{privacyTranslation.constent1.option9.span1}
								</span>{" "}
								<span>
									{privacyTranslation.constent1.option9.span2}
								</span>
							</p>
							<p>
								<span className="font-bold">
									{
										privacyTranslation.constent1.option10
											.span1
									}
								</span>{" "}
								<span>
									{
										privacyTranslation.constent1.option10
											.span2
									}
								</span>
							</p>
						</div>
					</div>

					{/**content 2 */}
					<div
						className="font-poppins mb-8 border-b-4 pb-8"
						id="content2"
					>
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option2}
						</h2>
						<ol className="flex flex-col gap-2">
							<li> {privacyTranslation.constent2.option1}</li>
							<li> {privacyTranslation.constent2.option2}</li>
							<li> {privacyTranslation.constent2.option3}</li>
							<li> {privacyTranslation.constent2.option4}</li>
						</ol>
					</div>

					{/**Content 3 */}
					<div
						className="font-poppins mb-8 border-b-4 pb-8"
						id="content3"
					>
						<div className="flex flex-col gap-2">
							<h2 className="font-bold text-2xl mb-4">
								{privacyTranslation.table.option3}
							</h2>
							<ol className="list-decimal list-inside space-y-2">
								<li>{privacyTranslation.constent3.option1}</li>
								<li>{privacyTranslation.constent3.option2}</li>
								<li>{privacyTranslation.constent3.option3}</li>
								<li>{privacyTranslation.constent3.option4}</li>
								<li>{privacyTranslation.constent3.option5}</li>
								<li>{privacyTranslation.constent3.option6}</li>
							</ol>
						</div>
					</div>

					{/**content 4 */}

					<div
						className="font-poppins mb-8 border-b-4 pb-8"
						id="content4"
					>
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option4}
						</h2>
						<div className="flex flex-col gap-2">
							<p>{privacyTranslation.content4.title}</p>
							<ol className="list-decimal list-inside space-y-2">
								<li>{privacyTranslation.content4[1]}</li>
								<li>{privacyTranslation.content4[2]}</li>
								<li>{privacyTranslation.content4[3]}</li>
								<li>{privacyTranslation.content4[4]}</li>
								<li>{privacyTranslation.content4[5]}</li>
								<li>{privacyTranslation.content4[6]}</li>
								<li>{privacyTranslation.content4[7]}</li>
								<li>{privacyTranslation.content4[8]}</li>
								<li>{privacyTranslation.content4[9]}</li>
							</ol>
							<p>{privacyTranslation.content4.description}</p>
						</div>
					</div>

					{/**content 5*/}

					<div
						className="font-poppins mb-8 border-b-4 pb-8"
						id="content5"
					>
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option5}
						</h2>
						<div className="flex flex-col gap-2">
							<ol className="list-decimal list-inside space-y-2">
								<li>
									<span>
										{privacyTranslation.content5[1].span1}{" "}
									</span>
									<span className="font-bold">
										{privacyTranslation.content5[1].span2}
									</span>{" "}
									<span>
										{privacyTranslation.content5[1].span3}
									</span>
								</li>
								<li>{privacyTranslation.content5[2]}</li>
								<li>{privacyTranslation.content5[3]}</li>
								<li>{privacyTranslation.content5[4]}</li>
								<li>{privacyTranslation.content5[5]}</li>
							</ol>
						</div>
					</div>

					{/**content 6*/}

					<div
						className="font-poppins mb-8 border-b-4 pb-8"
						id="content6"
					>
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option6}
						</h2>
						<div>
							<ol className="list-decimal list-inside space-y-2">
								<li>{privacyTranslation.content6[1]}</li>
								<li>{privacyTranslation.content6[2]}</li>
								<li>{privacyTranslation.content6[2]}</li>
								<li>{privacyTranslation.content6[2]}</li>
								<li>{privacyTranslation.content6[2]}</li>
								<li>{privacyTranslation.content6[2]}</li>
							</ol>
						</div>
					</div>

					{/**content 7*/}

					<div
						className="font-poppins mb-8 border-b-4 pb-8"
						id="content7"
					>
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option7}
						</h2>
						<div className="flex flex-col gap-2">
							<ol className="list-decimal list-inside space-y-2">
								<li>{privacyTranslation.content7[1]}</li>
								<li>{privacyTranslation.content7[2]}</li>
								<li>{privacyTranslation.content7[3]}</li>
								<li>{privacyTranslation.content7[4]}</li>
								<li>{privacyTranslation.content7[5]}</li>
							</ol>
						</div>
					</div>

					{/**content 8*/}

					<div
						className="font-poppins mb-8 border-b-4 pb-8"
						id="content8"
					>
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option8}
						</h2>
						<div className="flex flex-col gap-2">
							<ol className="list-decimal list-inside space-y-2">
								<li>{privacyTranslation.content8[1]}</li>
								<li>{privacyTranslation.content8[2]}</li>
								<li>{privacyTranslation.content8[3]}</li>
								<li>{privacyTranslation.content8[4]}</li>
								<li>{privacyTranslation.content8[5]}</li>
							</ol>
						</div>
					</div>

					{/**content 9*/}

					<div
						className="font-poppins mb-8 border-b-4 pb-8"
						id="content9"
					>
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option9}
						</h2>
						<div className="flex flex-col gap-2">
							<ol className="list-decimal list-inside space-y-2">
								<li>{privacyTranslation.content9[1]}</li>
								<li>{privacyTranslation.content9[2]}</li>
								<li>{privacyTranslation.content9[3]}</li>
								<li>{privacyTranslation.content9[4]}</li>
								<li>{privacyTranslation.content9[5]}</li>
								<li>{privacyTranslation.content9[6]}</li>
							</ol>
						</div>
					</div>

					{/**content 10*/}

					<div
						className="font-poppins mb-8 border-b-4 pb-8"
						id="content10"
					>
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option10}
						</h2>
						<div className="flex flex-col gap-2">
							<ol className="list-decimal list-inside space-y-2">
								<li>
									{privacyTranslation.content10[1]}{" "}
									<a
										href="https://www.mincommerce.gov.cm/sites/default/files/documents/loi-n-2010-021-du-21-decembre-2010-regissant-le-commerce-electronique-au-cameroun.pdf"
										className="text-primary underline"
									>
										gmincommerce.gov.cm+2Pr Yvette Rachel
										KALIEU ELONGO+2
									</a>
								</li>
								<li>{privacyTranslation.content9[2]}</li>
								<li>{privacyTranslation.content10[3]}</li>
								<li>{privacyTranslation.content10[4]}</li>
							</ol>
						</div>
					</div>

					{/**content 11*/}

					<div
						className="font-poppins mb-8 border-b-4 py-8"
						id="content11"
					>
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option11}
						</h2>
						<div className="flex flex-col gap-2">
							<ol className="list-decimal list-inside space-y-2">
								<li> {privacyTranslation.content11[1]}</li>

								<li>{privacyTranslation.content11[2]}</li>
								<li>{privacyTranslation.content11[3]}</li>
								<li>{privacyTranslation.content11[4]}</li>
								<li>{privacyTranslation.content11[5]}</li>
							</ol>
						</div>
					</div>

					{/**content 12*/}

					<div
						className="font-poppins mb-8 border-b-4 pb-8"
						id="content12"
					>
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option12}
						</h2>
						<div>
							<ol className="list-decimal list-inside space-y-2">
								<li> {privacyTranslation.content12[1]}</li>
								<li> {privacyTranslation.content12[2]}</li>
								<li> {privacyTranslation.content12[3]}</li>
								<li> {privacyTranslation.content12[4]}</li>
							</ol>
						</div>
					</div>

					{/**constent 13 */}

					<div
						className="font-poppins mb-8 border-b-4 pb-8"
						id="content13"
					>
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option13}
						</h2>
						<div className="flex flex-col gap-2">
							<ol className="list-decimal list-inside space-y-2">
								<li> {privacyTranslation.content13[1]}</li>
								<li> {privacyTranslation.content13[2]}</li>
								<li> {privacyTranslation.content13[3]}</li>
								<li> {privacyTranslation.content13[4]}</li>
								<li> {privacyTranslation.content13[5]}</li>
								<li> {privacyTranslation.content13[6]}</li>
							</ol>
						</div>
					</div>

					{/**content 42*/}

					<div
						className="font-poppins mb-8 border-b-4 pb-8"
						id="content14"
					>
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option14}
						</h2>
						<div>
							<p>{privacyTranslation.content14.title}</p>

							<ol className="list-decimal list-inside space-y-2">
								<li> {privacyTranslation.content14[1]}</li>
								<li> {privacyTranslation.content14[2]}</li>
								<li> {privacyTranslation.content14[3]}</li>
								<li> {privacyTranslation.content14[4]}</li>
								<li> {privacyTranslation.content14[5]}</li>
								<li> {privacyTranslation.content14[6]}</li>
								<li> {privacyTranslation.content14[7]}</li>
								<li> {privacyTranslation.content14[8]}</li>
							</ol>
						</div>
					</div>

					{/**content 15*/}

					<div
						className="font-poppins mb-8 border-b-4 pb-8"
						id="content15"
					>
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option15}
						</h2>
						<div>
							<ol className="list-decimal list-inside space-y-2">
								<li> {privacyTranslation.content15[1]}</li>
								<li> {privacyTranslation.content15[2]}</li>
								<li> {privacyTranslation.content15[3]}</li>
								<li> {privacyTranslation.content15[4]}</li>
								<li> {privacyTranslation.content15[5]}</li>
							</ol>
						</div>
					</div>

					{/**constent 16 */}

					<div
						className="font-poppins mb-8 border-b-4 pb-8"
						id="content16"
					>
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option16}
						</h2>
						<div className="flex flex-col gap-2">
							<ol className="list-decimal list-inside space-y-2">
								<li> {privacyTranslation.content16[1]}</li>
								<li> {privacyTranslation.content16[2]}</li>
								<li> {privacyTranslation.content16[3]}</li>
								<li> {privacyTranslation.content16[4]}</li>
							</ol>
						</div>
					</div>

					{/**constent 17 */}

					<div
						className="font-poppins mb-8 border-b-4 pb-8"
						id="content17"
					>
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option17}
						</h2>
						<div className="flex flex-col gap-2">
							<p>{privacyTranslation.content17.title}</p>
						</div>
					</div>

					{/**constent 19 */}

					<div
						className="font-poppins mb-8 border-b-4 pb-8"
						id="content18"
					>
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option18}
						</h2>
						<div className="flex flex-col gap-2">
							<ol className="list-decimal list-inside space-y-2">
								<li> {privacyTranslation.content18[1]}</li>
								<li> {privacyTranslation.content18[2]}</li>
								<li> {privacyTranslation.content18[3]}</li>
							</ol>
						</div>
					</div>

					<div
						className="font-poppins mb-8 border-b-4 pb-8"
						id="content19"
					>
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option19}
						</h2>
						<div className="flex flex-col gap-2">
							<p>{privacyTranslation.content19.title}</p>
						</div>
					</div>

					{/**constent 20 */}

					<div
						className="font-poppins mb-8 border-b-4 pb-8"
						id="content20"
					>
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option20}
						</h2>
						<div className="flex flex-col gap-2">
							<ol className="list-decimal list-inside space-y-2">
								<li> {privacyTranslation.content20[1]}</li>
								<li> {privacyTranslation.content20[2]}</li>
								<li> {privacyTranslation.content20[3]}</li>
							</ol>
						</div>
					</div>

					{/**constent 21 */}

					<div
						className="font-poppins mb-8 border-b-4 pb-8"
						id="content21"
					>
						<h2 className="font-bold text-2xl mb-4">
							{privacyTranslation.table.option21}
						</h2>
						<div className="flex flex-col gap-2">
							<ol className="list-decimal list-inside space-y-2">
								<li>
									<span>
										{privacyTranslation.content21.title}
									</span>
									<ul>
										<li>
											<span className="font-bold">
												{" "}
												{
													privacyTranslation
														.content21[1]
												}
											</span>{" "}
											<span>
												{" "}
												{
													privacyTranslation
														.content21[2]
												}
											</span>
										</li>
										<li>
											<span className="font-bold">
												{
													privacyTranslation
														.content21[3]
												}
											</span>{" "}
											<a href="/">
												{
													privacyTranslation
														.content21[4]
												}
											</a>
										</li>
									</ul>
								</li>
								<li>{privacyTranslation.content21[5]}</li>
							</ol>
							<p></p>

							<p></p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Terms;
