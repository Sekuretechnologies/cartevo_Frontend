import { HashLoader } from "react-spinners";

const Loading = () => {
	return (
		<div
			className={
				"h-screen w-screen fixed z-[99999] flex items-center justify-center"
			}
		>
			<HashLoader size={40} color="#1F66FF" />
		</div>
	);
};

export default Loading;
