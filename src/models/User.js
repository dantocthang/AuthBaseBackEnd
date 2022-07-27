import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    // isAdmin: { type: Boolean, default: false },
    // photo: { type: String },
    // email: { type: String, required: true }
})

export default mongoose.model("User", UserSchema)