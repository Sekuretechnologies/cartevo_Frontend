import React from "react";

interface Company {
	id: string;
	name: string;
	roleName: string;
	status: string;
}

interface UserCompanyRole {
	company: { id: string; name: string };
	role: { id: string; name: string };
	status: string;
}

interface Props {
	companies?: Company[];
	userCompanyRoles?: UserCompanyRole[];
}

const UserCompaniesTable: React.FC<Props> = ({
	companies,
	userCompanyRoles,
}) => {
	const rows =
		userCompanyRoles?.map((ucr) => ({
			companyName: ucr.company.name,
			roleName: ucr.role.name,
			status: ucr.status,
		})) ?? [];

	return (
		<table className="table-auto border-collapse border border-gray-300 w-full text-left">
			<thead>
				<tr className="bg-gray-100">
					<th className="border border-gray-300 px-4 py-2">
						Company
					</th>
					<th className="border border-gray-300 px-4 py-2">Role</th>
					<th className="border border-gray-300 px-4 py-2">Status</th>
				</tr>
			</thead>
			<tbody>
				{rows.length === 0 ? (
					<tr>
						<td colSpan={3} className="text-center p-4">
							No companies found
						</td>
					</tr>
				) : (
					rows.map((row, idx) => (
						<tr key={idx}>
							<td className="border border-gray-300 px-4 py-2">
								{row.companyName}
							</td>
							<td className="border border-gray-300 px-4 py-2">
								{row.roleName}
							</td>
							<td className="border border-gray-300 px-4 py-2">
								{row.status}
							</td>
						</tr>
					))
				)}
			</tbody>
		</table>
	);
};

export default UserCompaniesTable;
