import classNames from "classnames";
import { PuffLoader } from "react-spinners";

interface LoadingOverlayProps {
	isLoading: boolean;
}

const LoadingOverlay = ({ isLoading }: LoadingOverlayProps) => {
	return (
		<div
			className={classNames(
				"transition-all invisible z-[1000] bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center",
				{
					"!opacity-100 !visible z-[1000]": isLoading,
				}
			)}
		>
			<PuffLoader className="shrink-0" size={50} color="#1F66FF" />
		</div>
	);
};

export default LoadingOverlay;
