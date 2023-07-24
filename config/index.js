import dotenv from "dotenv";

dotenv.config();

export const { PORT, DBURL, SECRET_KEY, SECRET_ACCESS_KEY, FRONTEND_URL } =
  process.env;
