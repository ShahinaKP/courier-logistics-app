import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import express from "express";
import cors from "cors";
import packageRoutes from "./routes/packageRoutes";
import bagRoutes from "./routes/bagRoutes";
import truckRoutes from "./routes/truckRoutes";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use("/api/packages", packageRoutes);
app.use("/api/bags", bagRoutes);
app.use("/api/trucks", truckRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Courier Logistics API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
