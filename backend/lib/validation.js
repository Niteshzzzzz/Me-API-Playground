import { z } from "zod"

const linksSchema = z
  .object({
    github: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
    portfolio: z.string().url().optional().or(z.literal("")),
  })
  .partial()

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(""),
  links: z.array(z.string()).optional().default([]),
})

const workSchema = z.object({
  company: z.string().min(1),
  role: z.string().optional().default(""),
  start: z.string().optional().default(""),
  end: z.string().optional().default(""),
  description: z.string().optional().default(""),
})

const profileSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  education: z.array(z.string()).optional().default([]),
  skills: z.array(z.string()).optional().default([]),
  projects: z.array(projectSchema).optional().default([]),
  work: z.array(workSchema).optional().default([]),
  links: linksSchema.optional().default({}),
})

const profileUpdateSchema = profileSchema.partial()

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export {
  profileSchema,
  profileUpdateSchema,
  registerSchema,
  loginSchema,
}
