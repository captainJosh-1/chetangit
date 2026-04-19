import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
    video: {  // if you like the video 
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    comment: {       // if you like the comment 
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    tweet: {      // if you like the tweet 
        type: Schema.Types.ObjectId,
        ref: "Tweet"
    },
    likedBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
}, { timestamps: true })

export const Like = mongoose.model("Like",likeSchema)