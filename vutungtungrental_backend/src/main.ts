import express from "express";
import dotenv from "dotenv";
import { userRouter } from "./Router/userRouter";
import { loginRouter, logoutRouter } from "./Router/loginRouter";
import cookieParser from "cookie-parser";
import { vehicleRouter } from "./Router/vehicleRouter";
import { categoryRouter } from "./Router/categoryRouter";
import { bookingRouter } from "./Router/bookingRouter";
import session from "express-session";
import resetPasswordRouter from "./Router/resetPasswordRoutes";
import path from "path";
import { getVehicleById, getVehicles } from "./Modal/vehicleModal";
import cors from "cors";
// import axios from "axios";
dotenv.config();

const app = express();
const PORT = 4000;
dotenv.config();
// app.use(axios);
// ✅ CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // change if your frontend runs on 5173
    credentials: true, // allow cookies, authorization headers
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(
  session({
    secret: process.env.JWT_SECRET || "JWT_SECERETE_TOKEN#",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 15 * 60 * 1000 }, // 15 min
  })
);
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    if (req.session && typeof req.session.save === "function") {
      req.session.save((err) => {
        if (err) console.error("Session save error:", err);
        originalSend.call(this, body);
      });
    } else {
      originalSend.call(this, body);
    }
    return this;
  };
  next();
});

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads/bookingLicense"))
);
app.use("/user", userRouter);
app.use("/userlogin", loginRouter);
app.use("/userlogout", logoutRouter);
app.use("/userlogin/reset-password", resetPasswordRouter);
app.use("/vehicle/book", bookingRouter);
app.use("/api/vehicles", vehicleRouter);
app.use("/api/category", categoryRouter);

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use(express.urlencoded({ extended: true }));

// Simple route to view uploaded images
// to check if images are uploaded successfully
// Access via: http://localhost:4000/view-images

app.get("/:v_id/view-images", async (req, res) => {
  const id = Number(req.params.v_id);
  const vehicle = await getVehicleById(id);
  if (!vehicle) {
    res.status(404).json({ error: "Vehicle not found" });
    return;
  }
  let html = "<h1>Vehicle Images</h1>";
  html += `<div>
    <h3>${vehicle.name}</h3>
      <img src="/uploads/vehicles/${vehicle.image}" width="300"/><br/>
      <img src="/uploads/vehicles/${vehicle.image1}" width="300"/><br/>
      <img src="/uploads/vehicles/${vehicle.image2}" width="300"/><br/>
    </div><hr/>`;
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
