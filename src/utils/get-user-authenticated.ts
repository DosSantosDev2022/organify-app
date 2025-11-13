import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function getAuthenticatedUserId() {
  const session = await getServerSession(authOptions); // Obtém a sessão do Next-Auth
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not authenticated.");
  }
  return userId;
}