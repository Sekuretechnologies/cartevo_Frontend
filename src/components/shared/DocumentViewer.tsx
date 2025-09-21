import React from "react";

interface DocumentViewerProps {
	label: string;
	url: string | null;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ label, url }) => {
	if (!url) {
		return (
			<div className="mb-4">
				<p className="text-md">{label}</p>
				<p className="text-red-500 font-semibold italic">
					Not provided
				</p>
			</div>
		);
	}

	const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
	const isPdf = /\.pdf$/i.test(url);

	return (
		<div className="mb-4 relative w-60  first-letter cursor-pointer overflow-hidden">
			<p className="text-md mb-1 ">{label}</p>

			{isImage && (
				<a href={url} target="_blank" rel="noopener noreferrer">
					<img
						src={url}
						alt={label}
						className="w-full h-20 object-cover rounded-md border"
					/>
					<div className="absolute bottom-0  flex w-full justify-center items-center bg-black/60  backdrop-blur-lg">
						<p className="  text-white">Clik to view Image</p>
					</div>
				</a>
			)}

			{isPdf && (
				<a
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					className="text-primary underline"
				>
					<img
						src="/images/pdf.jpg"
						alt={label}
						className="w-full h-20 object-cover rounded-md border"
					/>
					<div className="absolute bottom-0  flex w-full justify-center items-center bg-black/60  backdrop-blur-lg">
						<p className="  text-white"> Click to view PDF</p>
					</div>
				</a>
			)}

			{!isImage && !isPdf && (
				<a
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					className="text-primary underline"
				>
					<img
						src="/images/doc.jpg"
						alt={label}
						className="w-full h-20 object-cover rounded-md border"
					/>
					<div className="absolute bottom-0  flex w-full justify-center items-center bg-black/60  backdrop-blur-lg">
						<p className="  text-white"> Click to view Document</p>
					</div>
				</a>
			)}
		</div>
	);
};

export default DocumentViewer;
