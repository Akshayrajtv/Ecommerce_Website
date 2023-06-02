import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(join(__dirname, "./client/build")));

// routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

app.use("*", function (req, res) {
    res.sendFile(join(__dirname, "./client/build/index.html"));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(
        `Server running in ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
            .white
    );
});
