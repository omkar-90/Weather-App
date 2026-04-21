const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(process.cwd(), ".env") });

const env = {
  port: Number(process.env.PORT) || 3000,
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY || "",
};

module.exports = { env };
