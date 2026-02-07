import express from "express"

import Profile from "../models/Profile.js"
import auth from "../middleware/auth.js"

const router = express.Router()

function normalize(value) {
  return (value || "").toLowerCase()
}

router.get("/projects", auth, async (req, res, next) => {
  try {
    const skill = normalize(req.query.skill)
    const profile = await Profile.findOne({ owner: req.user.userId })
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" })
    }

    if (!skill) {
      return res.status(200).json({ projects: profile.projects })
    }

    const skillMatch = new Set(profile.skills.map(normalize))
    const projects = profile.projects.filter((project) => {
      const text = normalize(`${project.title} ${project.description}`)
      return skillMatch.has(skill) || text.includes(skill)
    })

    return res.status(200).json({ projects })
  } catch (err) {
    return next(err)
  }
})

router.get("/skills/top", auth, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ owner: req.user.userId })
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" })
    }

    const counts = profile.skills.reduce((acc, skill) => {
      const key = normalize(skill)
      if (!key) {
        return acc
      }
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    const skills = Object.entries(counts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)

    return res.status(200).json({ skills })
  } catch (err) {
    return next(err)
  }
})

router.get("/search", auth, async (req, res, next) => {
  try {
    const q = normalize(req.query.q)
    const profile = await Profile.findOne({ owner: req.user.userId })
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" })
    }

    if (!q) {
      return res.status(200).json({ matches: { skills: [], projects: [], work: [], education: [] } })
    }

    const skills = profile.skills.filter((skill) => normalize(skill).includes(q))
    const education = profile.education.filter((item) => normalize(item).includes(q))

    const projects = profile.projects.filter((project) => {
      const text = normalize(`${project.title} ${project.description}`)
      return text.includes(q)
    })

    const work = profile.work.filter((job) => {
      const text = normalize(`${job.company} ${job.role} ${job.description}`)
      return text.includes(q)
    })

    return res.status(200).json({ matches: { skills, projects, work, education } })
  } catch (err) {
    return next(err)
  }
})

export default router
