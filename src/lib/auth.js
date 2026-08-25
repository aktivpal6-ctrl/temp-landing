import crypto from "crypto";

const SECRET = process.env.ADMIN_SECRET || "aktivpal-admin-secret";

export function createToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function signToken(token) {
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(token)
    .digest("hex");
  return `${token}.${signature}`;
}

export function verifyToken(signed) {
  if (!signed || !signed.includes(".")) return null;
  const [token, signature] = signed.split(".");
  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(token)
    .digest("hex");
  if (signature !== expected) return null;
  return token;
}
