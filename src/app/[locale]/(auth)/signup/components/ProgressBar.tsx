// Progress bar component
export default function ProgressBar({
	step,
	total,
}: {
	step: number;
	total: number;
}) {
	const percent = (step / total) * 100;
	const labels = ["Personal Informations", "Company Informations"];
	return (
		<div className="mb-8">
			<div className="flex justify-between mb-1">
				<span className="text-lg font-medium text-app-secondary">
					{labels[step - 1]}
				</span>
				<span className="text-sm text-app-secondary">{`${step}/${total}`}</span>
			</div>
			<div className="w-full bg-gray-200 rounded-full h-2.5">
				<div
					className="bg-app-secondary h-2.5 rounded-full transition-all duration-300"
					style={{ width: `${percent}%` }}
				></div>
			</div>
		</div>
	);
}
