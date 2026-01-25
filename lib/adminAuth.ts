import jwt from "jsonwebtoken";

export function verifyAdmin(token?: string) {
  if (!token) throw new Error("Unauthorized");

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

  if (decoded.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  return decoded;
}
