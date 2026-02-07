import dotenv from "dotenv"

import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import cors from "cors"

import authRoutes from "./routes/auth.js"
import profileRoutes from "./routes/profile.js"
import queryRoutes from "./routes/query.js"

dotenv.config();

const app = express()

const PORT = process.env.PORT || 4000
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/profile_playground"
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173"

app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}))
app.use(express.json({ limit: "1mb" }))
app.use(cookieParser())

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" })
})

app.use("/auth", authRoutes)
app.use("/profile", profileRoutes)
app.use("/query", queryRoutes)

app.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({ error: err.message || "Server error" })
})

mongoose
  .connect(MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error("Mongo connection failed:", err.message)
    process.exit(1)
  })
