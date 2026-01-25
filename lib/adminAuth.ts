import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function verifyAdminToken(req: Request) {
  const auth = req.headers.get("authorization");

  if (!auth || !auth.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED");
  }

  const token = auth.split(" ")[1];

  const decoded = jwt.verify(token, JWT_SECRET) as {
    role?: string;
    adminId?: string;
  };

  if (decoded.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }

  return decoded; // ✅ THIS WAS MISSING
}
