import React from "react";

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
	key?: string;
	visible?: boolean;
	label: TText;
	value: TText;
};
export type TDataList = TDataItem[][];

interface InfoCardProps {
	data: TDataList;
}
// interface IDataLine {
//   items: IDataItem[];
// };

// export type TDataList = {
//   lines: IDataLine[];
// };

const WalletCard: React.FC<InfoCardProps> = ({ data }) => {
	return (
		<div className="px-2 py-4 bg-white rounded-lg shadow-md grid grid-cols-2">
			{data.map((line, index1) => (
				<div
					key={index1}
					className={`gap-10 justify-between items-center mx-1 `}
					style={{
						// display: 'flex',
						// gridTemplateColumns: `repeat(${line.length}, 1fr)` ,
						gap: `${line.length * 5}px`,
					}}
				>
					{line.map((item, index2) => (
						<div
							key={index2}
							className={`my-1 ${
								index2 == 0 ? "mb-4" : ""
							} flex ${
								index1 == 0 && index2 == 0 && line.length > 1
									? "gap-1"
									: ""
							}  
              ${index2 == 0 ? "items-center" : ""} 
              ${index2 == 1 ? "flex-col justify-center" : ""}`}
						>
							<span
								title={item.label.tooltip ?? ""}
								style={{
									fontSize: item.label.fs ?? "14px",
									color: item.label.color ?? "#444",
								}}
								className={`font-${item.label.fw ?? "normal"}`}
							>
								{item.label.text}
							</span>
							<span
								title={item.value.tooltip ?? ""}
								style={{
									fontSize: item.value.fs ?? "14px",
									color: item.value.color ?? "#444",
								}}
								className={`w-full font-${
									item.value.fw ?? "normal"
								}`}
							>
								{item.value.text}
							</span>
						</div>
					))}
				</div>
			))}
		</div>
	);
};

export default WalletCard;
