import dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoute";
import userRoutes from "./routes/userRoute";
import initializeDatabase from "./ignition/db";

const app: Application = express();
const port: number = 3500;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://reactjs-nine-vert.vercel.app",
      "https://example-cms.inadayapp.com",
      "http://localhost",
    ], //["http://localhost:3000","http://localhost:3001"]
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization,x-auth-token",
    exposedHeaders: "x-auth-token",
    credentials: true,
  })
);

initializeDatabase();

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express with TypeScript!");
});

app.use("/api/account", authRoutes);
app.use("/api/user/", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
