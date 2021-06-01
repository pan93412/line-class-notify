import dotenv from "dotenv";
import logger from "../logger";

dotenv.config();

export default function GetEnv(key: string): string | never {
  const log = logger("utils.env_get_or_throw");
  log.debug(`Getting environment variable: ${key}`);
  const val = process.env[key];
  log.debug(`Key = ${key}, Value = ${val}`);

  if (val) return val;
  throw new Error(`No such a environment variable key: ${key}`);
}
