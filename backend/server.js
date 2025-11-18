// start server
require("dotenv").config()
const app = require("./src/app");
const connectDB = require("./src/db/db");

connectDB();

app.listen(process.env.PORT, () => {
//   Server running on port 3000
});
