import mongoose from "mongoose"

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    links: { type: [String], default: [] },
  },
  { _id: false }
)

const workSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, default: "", trim: true },
    start: { type: String, default: "" },
    end: { type: String, default: "" },
    description: { type: String, default: "", trim: true },
  },
  { _id: false }
)

const profileSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    education: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    projects: { type: [projectSchema], default: [] },
    work: { type: [workSchema], default: [] },
    links: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },
  },
  { timestamps: true }
)

const Profile = mongoose.model("Profile", profileSchema)

export default Profile
