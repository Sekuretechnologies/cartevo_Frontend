import React from "react";

interface Owner {
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	kyc_status: string;
}

interface Company {
	id: string;
	name: string;
	country: string;
	email: string;
	business_type: string;
	kyb_status: string;
	owner: Owner;
}

interface CompanyCardProps {
	company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
	return (
		<button className="border rounded-lg shadow-md p-4 text-left  bg-white">
			<h2 className="text-xl font-bold">{company.name}</h2>
			<p className="text-gray-600">
				{company.business_type} - {company.country}
			</p>
			<p className="text-gray-600">Email: {company.email}</p>

			<div className="mt-2 p-2 border-t">
				<h3 className="font-semibold">Owner Info:</h3>
				<p>
					{company.owner.first_name} {company.owner.last_name}
				</p>
				<p>Email: {company.owner.email}</p>
				<p>Phone: {company.owner.phone_number}</p>
				<p>
					KYC Status:{" "}
					<span
						className={`font-bold ${
							company.owner.kyc_status === "APPROVED"
								? "text-green-600"
								: company.owner.kyc_status === "PENDING"
								? "text-yellow-600"
								: "text-red-600"
						}`}
					>
						{company.owner.kyc_status}
					</span>
				</p>
			</div>

			<div className="mt-2 p-2 border-t">
				<p>
					KYB Status:{" "}
					<span
						className={`font-bold ${
							company.kyb_status === "APPROVED"
								? "text-green-600"
								: company.kyb_status === "PENDING"
								? "text-yellow-600"
								: "text-red-600"
						}`}
					>
						{company.kyb_status}
					</span>
				</p>
			</div>
		</button>
	);
};

export default CompanyCard;
