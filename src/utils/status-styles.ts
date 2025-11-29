import { TransactionStatus } from "@prisma/client";

export function StatusVariant(status: TransactionStatus) {
	switch (status) {
		case "PAID":
			return "success";
		case "RECEIVED":
			return "warning";
		case "PENDING":
			return "destructive";
		default:
			return "secondary";
	}
}