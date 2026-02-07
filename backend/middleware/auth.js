import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret"
const COOKIE_NAME = process.env.COOKIE_NAME || "token"

function auth(req, res, next) {
  const cookieToken = req.cookies?.[COOKIE_NAME]
  const header = req.headers.authorization || ""
  const headerToken = header.startsWith("Bearer ") ? header.slice(7) : null
  const token = cookieToken || headerToken

  if (!token) {
    return res.status(401).json({ error: "Missing auth token" })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    return next()
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" })
  }
}

export default auth
