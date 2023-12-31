import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectToDb from "./config/connectToDb.js";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import cors from "cors";
import helmet from "helmet";
import path from "path";

dotenv.config();

const port = process.env.PORT || 5000;

connectToDb();
const app = express();

app.use(helmet());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/users", userRoutes);

if (process.env.NODE_ENV === "production") {
  let __dirname = path.resolve();
  __dirname = __dirname.replace("\\backend", "");
  app.use(express.static(path.join(__dirname, "frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("server is ready");
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
