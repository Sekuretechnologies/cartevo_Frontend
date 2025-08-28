import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { blue } from "@mui/material/colors";
export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	text: string;
	toolTip?: string;
	btnStyle:
		| "blue"
		| "outlineDark"
		| "outlineGreen"
		| "dark"
		| "darkBlue"
		| "grey"
		| "green"
		| "red"
		| "yellow"
		| "lightGreen"
		| "lightBlue"
		| "lightYellow"
		| "white_darkRed";
	color?: string;
	height?: string;
	width?: string;
	href?: string;
	target?: "_blank" | "_self" | "_parent" | "_top";
	openInNewTab?: boolean;
	px?: string;
	py?: string;
	type?: "button" | "submit" | "reset";
	hoverBgColor?: string;
	textColor?: string;
	hoverTextColor?: string;
	textWrap?: boolean;
	iconSize?: number;
	iconPosition?: string;
	mode?: string;
	fontWeight?: "normal" | "semibold" | "bold";
	icon?: React.ReactNode;
	iconLeft?: React.ReactNode;
}

const CButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({
		text,
		toolTip,
		color,
		height,
		width,
		icon,
		iconLeft,
		href,
		target,
		openInNewTab,
		px,
		py,
		hoverBgColor,
		iconSize,
		fontWeight,
		type,
		textColor,
		hoverTextColor,
		textWrap,
		mode,
		btnStyle,
		iconPosition,
		...props
	}) => {
		const iconColor =
			btnStyle === "lightGreen" ||
			btnStyle === "lightBlue" ||
			btnStyle === "outlineGreen"
				? "#1F66FF"
				: btnStyle === "green" ||
				  btnStyle === "red" ||
				  btnStyle === "dark" ||
				  btnStyle === "darkBlue" ||
				  btnStyle === "grey" ||
				  btnStyle === "blue"
				? "#fff"
				: btnStyle === "lightYellow"
				? "#FFDB5A"
				: btnStyle === "white_darkRed"
				? "#994617"
				: "#444";
		const iconElement = icon
			? React.cloneElement(icon as React.ReactElement<any>, {
					size: iconSize ?? 15,
					color: iconColor,
			  })
			: null;
		// const iconLeftElement = iconLeft ? React.cloneElement(iconLeft as React.ReactElement<any>, { size: iconSize ?? 15, color: iconColor }) : null;

		// Determine if link should open in new tab
		const shouldOpenInNewTab = target === "_blank" || openInNewTab === true;
		const linkTarget = target || (shouldOpenInNewTab ? "_blank" : "_self");

		const btnStyles = {
			blue: `
	  border-[#1F66FF] hover:border-[#1F66FF]/80   bg-[#1F66FF] hover:bg-[#1F66FF]/80
	  text-white`,
			outlineDark: `border-[#444]
      bg-transparent hover:bg-[#444]/20`,
			outlineGreen: `border-[#18BC7A]
      bg-transparent hover:bg-[#18BC7A]/20 text-[#18BC7A]`,
			dark: `
			    border-[#202020] hover:border-[#202020]/80   bg-[#202020] hover:bg-[#202020]/80
			    text-white`,
			darkBlue: `
			    border-[#063292] hover:border-[#063292]/80   bg-[#063292] hover:bg-[#063292]/80
			    text-white`,
			grey: `
      border-gray-300  bg-gray-300
      text-white`,
			green: `
      border-[#18BC7A] hover:border-[#18BC7A]/80   bg-[#18BC7A] hover:bg-[#18BC7A]/80
      text-white`,
			red: `
      border-[#F85D4B] hover:border-[#F85D4B]/80   bg-[#F85D4B] hover:bg-[#F85D4B]/80
      text-white`,
			yellow: `
      border-[#FFDB5A] hover:border-[#FFDB5A]/80   bg-[#FFDB5A] hover:bg-[#FFDB5A]/80
      text-black`,
			lightGreen: `
			    border-[#18BC7A]/20 hover:border-[#18BC7A]/30   bg-[#18BC7A]/20 hover:bg-[#18BC7A]/30
			    text-[#18BC7A]`,
			lightBlue: `
			    border-[#1F66FF]/20 hover:border-[#1F66FF]/30   bg-[#1F66FF]/20 hover:bg-[#1F66FF]/30
			    text-[#1F66FF]`,
			lightYellow: `
    border-[#FFDB5A]/20 hover:border-[#FFDB5A]/30   bg-[#FFDB5A]/20 hover:bg-[#FFDB5A]/30
    text-[#FFDB5A]`,
			white_darkRed: `border-[#994617]/20 hover:border-[#994617]/50   bg-white
    text-[#994617]`,
		};
		const btnClassZero = `flex justify-center items-center gap-2 outline-none font-semibold border border-solid border-1 rounded-lg text-md text-nowrap 
      ${px ? "px-[" + px + "]" : "px-4"} ${py ? "py-[" + py + "]" : "py-1"}
      ${width ? `w-[${width}]` : ""} ${height ? `h-[${height}]` : ""}`;

		return (
			<>
				{href ? (
					shouldOpenInNewTab ? (
						// Use regular anchor tag for external links or new tab
						<a
							title={toolTip}
							href={href}
							target={linkTarget}
							rel={
								shouldOpenInNewTab
									? "noopener noreferrer"
									: undefined
							}
							className={btnClassZero + " " + btnStyles[btnStyle]}
							style={{
								whiteSpace: `${textWrap ? "normal" : "nowrap"}`,
								height: `${height ?? ""}`,
								width: `${width ?? ""}`,
							}}
						>
							{iconPosition == "end" ? (
								<>
									{text}
									{iconElement}
								</>
							) : (
								<>
									{iconElement}
									{text}
								</>
							)}
						</a>
					) : (
						// Use Next.js Link for internal navigation
						<Link
							title={toolTip}
							href={href}
							className={btnClassZero + " " + btnStyles[btnStyle]}
							style={{
								whiteSpace: `${textWrap ? "normal" : "nowrap"}`,
								height: `${height ?? ""}`,
								width: `${width ?? ""}`,
							}}
						>
							{iconPosition == "end" ? (
								<>
									{text}
									{iconElement}
								</>
							) : (
								<>
									{iconElement}
									{text}
								</>
							)}
						</Link>
					)
				) : (
					<>
						<button
							title={toolTip}
							type={type ? type : "button"}
							className={
								btnClassZero +
								" relative " +
								btnStyles[btnStyle]
							}
							style={{
								// padding: `${px ?? '0'} ${py ?? '0'}`,
								whiteSpace: `${textWrap ? "normal" : "nowrap"}`,
								height: `${height ?? ""}`,
								width: `${width ?? ""}`,
							}}
							{...props}
							// onClick={(e)=>{	if(onClick){onClick()}}}
						>
							{iconPosition == "end" ? (
								<>
									{text}
									{iconElement}
								</>
							) : (
								<>
									{iconElement}
									{text}
								</>
							)}
							{/* {iconLeftElement && <span className={`absolute top-[5px] left-[5px]`}>{iconLeftElement}</span>} */}
						</button>
					</>
				)}
			</>
		);
	}
);

CButton.displayName = "CButton";
export default CButton;
