import mongoose ,{Schema} from "mongoose";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new Schema({
    videoFile:{
        typr:String, //cloudinry url
        required:true
    },
    thumbnail:{
        typr:String, //cloudinry url
        required:true
    },
    title:{
        typr:String,
        required:true
    },
    description:{
        typr:String,
        required:true
    },
    duration:{
        typr:Number,  //from cloudinary 
        required:true
    },
    view:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})


videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",videoSchema)