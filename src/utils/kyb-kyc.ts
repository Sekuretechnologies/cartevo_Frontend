export const getGlobalVerificationStatus = (
	kycStatus: string,
	kybStatus: string
): "APPROVED" | "REJECTED" | "NONE" | "PENDING" => {
	if (kycStatus === "APPROVED" && kybStatus === "APPROVED") return "APPROVED";
	if (kycStatus === "REJECTED" && kybStatus === "REJECTED") return "REJECTED";
	if (kycStatus === "NONE" && kybStatus === "NONE") return "NONE";
	if (
		(kycStatus === "REJECTED" && kybStatus === "NONE") ||
		(kycStatus === "NONE" && kybStatus === "REJECTED")
	)
		return "REJECTED";
	return "PENDING";
};
