const app = require("./src/app");
const { env } = require("./src/config/env");

app.listen(env.port, () => {
  console.log(`Weather app running at http://localhost:${env.port}`);
});
