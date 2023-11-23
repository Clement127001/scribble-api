require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

const connectDB = require("./db/connect");

const userRoute = require("./routes/user");
const projectRoute = require("./routes/projects");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlingMiddleware = require("./middleware/errorhandling");

// for the pre-route middlewares
app.use(express.json());

// for the routes
app.use("/api/v1/user", userRoute);

app.use("/api/v1/project", projectRoute);
//for the post-route-middlewares

app.use(notFoundMiddleware);
app.use(errorHandlingMiddleware);
//for handling the error and not found js

const start = async () => {
  try {
    const port = process.env.port || 8000;
    await connectDB(process.env.MONGO_URI);
    app.listen(
      port,
      console.log(
        `The database is connected and  server is listening on the port ${port}`
      )
    );
  } catch (err) {
    console.log(err);
  }
};

start();
