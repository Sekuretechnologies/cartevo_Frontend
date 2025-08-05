import React from "react";
import InfoCard from "./InfoCard";
import cstyle from "./styles/style.module.scss";
import WalletCard from "./walletCard";

type TText = {
	text: string | number | React.ReactNode;
	fw?: string;
	color?: string;
	fs?: string;
	tooltip?: string;
	whiteSpace?: string;
	maxWidth?: string;
};
type TDataItem = {
	label: TText;
	value: TText;
};
export type TDataList = TDataItem[][];

interface WalletCardProps {
	walletData: TDataList[];
}
// interface IDataLine {
//   items: IDataItem[];
// };

// export type TDataList = {
//   lines: IDataLine[];
// };

const WalletCardGrid: React.FC<WalletCardProps> = ({ walletData }) => {
	return (
		<div className={`mb-10 ${cstyle["infoCardGrid"]}`}>
			{walletData.map((data, index) => (
				<WalletCard key={index} data={data} />
			))}
		</div>
	);
};

export default WalletCardGrid;
