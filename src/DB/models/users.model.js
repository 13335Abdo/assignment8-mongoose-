import mongoose, { Schema } from "mongoose";


const usersSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [
                /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                "give me a valid email address"
            ],
        },
        phone: {
            type: String,
            required: true,
            match: [
                /^(\+20|0020|0)?1[0125][0-9]{8}$/,
                "Please provide a valid Egyptian mobile number",
            ],
        },
        password: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true
    }
)

const usersModel = mongoose.model("users", usersSchema)

export default usersModel