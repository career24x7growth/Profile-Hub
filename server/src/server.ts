import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import superAdminRoutes from "./routes/superAdmin";
import chatRoutes from "./routes/chatRoutes";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/chat", chatRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
