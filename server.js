const express = require("express");
const dotenv = require("dotenv");
const ConnectDB = require("./config/DB");
const cron = require("node-cron");
const cors = require("cors");
console.log(cors);
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const User = require("./models/User");

const app = express();

// Implement CORS
app.use(cors());

app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

app.use(express.json());

dotenv.config({ path: ".env" });

const userRouter = require("./routes/userRoutes");

app.use("/api/user", userRouter);

const port = process.env.PORT || 4000;

ConnectDB();

// run the cron job 00:00:00 every day
cron.schedule("00 00 00 * * *", async () => {
  const users = await User.find();
  users.forEach(async (user) => {
    //TODO
    //give everyday new Set with tasks
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
