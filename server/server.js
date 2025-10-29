import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import { swaggerUi, swaggerSpec } from "./config/Swagger.js";
import vendorRoutes from './routes/Vendor.js'
import customerRoutes from './routes/Customer.js';
import bookingRoutes from "./routes/Booking.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// connect DB
connectDB();


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
  res.send("Event-Oh API running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
