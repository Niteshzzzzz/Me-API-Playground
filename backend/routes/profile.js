import express from "express"

import Profile from "../models/Profile.js"
import auth from "../middleware/auth.js"
import { profileSchema, profileUpdateSchema } from "../lib/validation.js"

const router = express.Router()

router.get("/", auth, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ owner: req.user.userId })
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" })
    }
    return res.status(200).json(profile)
  } catch (err) {
    return next(err)
  }
})

router.get("/export", auth, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ owner: req.user.userId })
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" })
    }

    res.setHeader("Content-Type", "application/json")
    res.setHeader("Content-Disposition", "attachment; filename=profile.json")
    return res.status(200).send(JSON.stringify(profile, null, 2))
  } catch (err) {
    return next(err)
  }
})

router.post("/", auth, async (req, res, next) => {
  try {
    const existing = await Profile.findOne({ owner: req.user.userId })
    if (existing) {
      return res.status(409).json({ error: "Profile already exists" })
    }

    const payload = profileSchema.parse(req.body)
    const profile = await Profile.create({ ...payload, owner: req.user.userId })
    return res.status(201).json(profile)
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: err.issues })
    }
    return next(err)
  }
})

router.put("/", auth, async (req, res, next) => {
  try {
    const payload = profileUpdateSchema.parse(req.body)
    const profile = await Profile.findOneAndUpdate(
      { owner: req.user.userId },
      { $set: payload },
      { new: true }
    )

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" })
    }

    return res.status(200).json(profile)
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: err.issues })
    }
    return next(err)
  }
})

router.delete("/", auth, async (req, res, next) => {
  try {
    const result = await Profile.findOneAndDelete({ owner: req.user.userId })
    if (!result) {
      return res.status(404).json({ error: "Profile not found" })
    }
    return res.status(200).json({ status: "deleted" })
  } catch (err) {
    return next(err)
  }
})

export default router
