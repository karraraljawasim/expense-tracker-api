import express from "express";
import { authRouter } from "./modules/auth/auth.routes.js";
import { globalErrorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);

app.use(globalErrorHandler);

export default app;
