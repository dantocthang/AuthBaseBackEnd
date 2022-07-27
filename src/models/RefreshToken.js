import mongoose from "mongoose";
import moment from "moment";

const RefreshTokenSchema = mongoose.Schema({
    token: { type: String, required: true },
    expireIn: { type: Date, required: true, default: moment().add(8, 'h') }
})

export default mongoose.model("RefreshToken", RefreshTokenSchema)