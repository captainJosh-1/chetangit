import {asyncHandler, asynchandler} from "../utils/asyncHandler.js"
import Subscription from '../models/subscription.model.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";


const getChannelStats=  asynchandler(async(req , res)=>{

const userId = req.user._id
if(userId){
    throw new ApiError(401 , "Unauthorized request");
}

const totalsubscriber =await Subscription.countDocuments({
    channel:userId
});


const videos= await Video.find({
    owner:userId
});

const toatalVideo = videos.length;

const totalViews = videos.reduce((acc, video)=>acc + video.view, 0)

const totalLikeAgg = await Like.aggregate([
    {
        $match: {
            video:{ $in: videos.map( v => v._id ) }
        }
    },
    {
        $count: "totalLikes"
    }
])

const totalLikes = totalLikeAgg[0]?.totalLikes || 0;

return res.status(200).json(
    new ApiResponse(200 , { 
        totalsubscriber,
        toatalVideo, 
        totalViews, totalLikes},
    "Channel stats fetched successfully")
)
})

const getChannelVideos = asyncHandler(async(req, res)=>{
const userId =req.user._id;

const videos = await Video.find({owner :userId})


return res.ststus(200).json( new ApiResponse(200,
    videos,
    "Channel videos fetched successfully"));
});

export {
    getChannelStats,
    getChannelVideos
}