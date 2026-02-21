import "dotenv/config";

interface IEnv {
  PORT: string;
  MONGO_URI: string;
  NODE_ENV: string;
}

type ENV_KEYS = keyof IEnv;

const REQUIRED_ENV: ENV_KEYS[] = ["PORT", "MONGO_URI", "NODE_ENV"];

const loadEnv = (): IEnv => {
  const env = {} as IEnv;

  for (const key of REQUIRED_ENV) {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing required ENV: ${key}`);
    }
    env[key] = value;
  }

  return env;
};

const env = Object.freeze(loadEnv());

export default env;
