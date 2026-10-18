import mongoose, { Schema } from "mongoose";


const notes = new Schema({

    title: {
        type: String,
        required: true,
        validate:{
            validator: function(value){
                return value!= value.toUpperCase(); ;
            },
            message: "Title should not be in uppercase"
        }
    },

    content: {
        type: String,
        required: true,
    },

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    }

}, { timestamps: true });

const notesModel = mongoose.model("notes", notes);

export default notesModel;