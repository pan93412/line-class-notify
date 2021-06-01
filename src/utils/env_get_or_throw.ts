import dotenv from "dotenv";

dotenv.config();

export default function GetEnv(key: string): string | never {
  const val = process.env[key];

  if (val) return val;
  throw new Error(`No such a environment variable key: ${key}`);
}
