// import { FaBorderAll } from "react-icons/fa6";

import { cartevoIcon, cartevoIconName } from "@/constants/icons";

type Props = {
	isExpanded?: boolean;
};
const Logo = (props: Props) => {
	const { isExpanded } = props;
	return (
		<>
			{isExpanded ? (
				<div className="flex justify-start items-start w-[180px] h-[24px]">
					{cartevoIconName}
					{/* <img
						src="/images/cartevo-logo.svg"
						alt="logo"
						className={"w-full"}
						style={{ width: "150px" }}
					/> */}
				</div>
			) : (
				<div style={{ paddingLeft: "10px", transform: "scale(1.7)" }}>
					{cartevoIcon}
				</div>
			)}
		</>
	);
};

export default Logo;
