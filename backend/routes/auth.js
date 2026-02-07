import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import User from "../models/User.js"
import auth from "../middleware/auth.js"
import { registerSchema, loginSchema } from "../lib/validation.js"

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"
const COOKIE_NAME = process.env.COOKIE_NAME || "token"
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "none",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

router.post("/register", async (req, res, next) => {
  try {
    const payload = registerSchema.parse(req.body)
    const exists = await User.findOne({ email: payload.email })
    console.log(exists)
    if (exists) {
      return res.status(409).json({ error: "Email already registered" })
    }

    const passwordHash = await bcrypt.hash(payload.password, 10)
    const user = await User.create({
      name: payload.name,
      email: payload.email,
      passwordHash,
    })

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS)
    return res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (err) {
      console.log(err)
    //   return
    if (err.name === "ZodError") {
      return res.status(400).json({ error: err.issues })
    }
    return next(err)
  }
})

router.post("/login", async (req, res, next) => {
  try {
    const payload = loginSchema.parse(req.body)
    const user = await User.findOne({ email: payload.email })

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const match = await bcrypt.compare(payload.password, user.passwordHash)
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS)
    return res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: err.issues })
    }
    return next(err)
  }
})

router.get("/me", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("name email")
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    return res.status(200).json({ id: user._id, name: user.name, email: user.email })
  } catch (err) {
    return next(err)
  }
})

router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
  return res.status(200).json({ status: "logged_out" })
})

export default router
