import { asyncHandler } from "../utils/asyncHandler.js";
import {Like} from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import{Comment} from "../models/comment.model.js"
import { Tweet } from "../models/tweet.model.js";
import { Video } from "../models/video.model.js";


const toggledVideoLike =asyncHandler(async(req , res)=>{
    //get video id
    //get user id
    //if video is exist 
    //check if like already 
    //if exist then delete like (unlike)
    //create a like 
    //return

    const {videoId}= req.params
    const userId = req.user._id

    if(!videoId){
        throw new ApiError(400, "Video ID doesnt exist ")
    }

    const video =await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "Video not found")
    }

    const existedLike = await Like.findOne({
        video:videoId,
        likedBy:userId
    })

    let message
    let isLiked

    if(existedLike){
        await Like.deleteOne({
            video:videoId,
            likedBy:userId
        })

        message = "Video unliked successfully"
        isLiked = false
    } else{
        await Like.create({
        video:videoId,
        likedBy:userId
    })
    message="Video is liked successfully"
    isLiked = true
}

//toggle
const totalLikes = await Like.countDocuments({
    video:videoId
})

return res.status(200).json(new ApiResponse({totalLikes , isLiked},message))
})

const toggledCommentLike = asyncHandler(async(req , res)=>{
    //get commentId
    //get userId
    //check comment exist
    //find comment 
    //check if liked already 
    //then delete the liked from that comment
    //return
    //if not liked already then create 
    //return

    const { commentId }= req.params
    const userId = req.user._id

    if(!commentId){
        throw new ApiError(400 , "Comment ID is required")
    }
    
    const comment =await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404 , "comment is not found")
    }

    const existedLike =await Like.findOne({
        comment:commentId,
        likedBy:userId
    })

    let message
    let isLiked 


    //toggle
    if(existedLike){
        await Like.deleteOne({
            comment:commentId,
            likedBy:userId
        })
        message = "Comment unliked successfully"
        isLiked = false
    } else{
    await Like.create({
        comment:commentId,
        likedBy:userId
    })
    message = "Comment liked successfully"
    isLiked = true
    }


    //total like count 
    const totalLikes =await Like.countDocuments({
        comment:commentId
    })

    //return 
    return res.status(200).json(new ApiResponse(
        { totalLikes, isLiked},
        message
    ))
})

const toggleTweetLike =asyncHandler(async(req , res)=>{
//get tweet id 
//get userId
//check tweet is exist
//find tweet
//if liked alredy then unlike 
//if not like then create
//toatl like count 
//return toatllikecount and isliked

const {tweetId}=req.params
const userId = req.user._id

if(!tweetId){
    throw new ApiError(400 , "Tweet ID is required")
}

const tweet = await Tweet.findById(tweetId)
if(!tweet){
    throw new ApiError(404 , "tweet not found")
}
const existedLike =await Like.findOne({
    tweet:tweetId,
    likedBy:userId
})

let message
let isLiked 

if(existedLike){
    await Like.deleteOne({
        tweet:tweetId,
        likedBy:userId
    })
    message = "Tweet unliked successfully"
    isLiked= false
} else{
    await Like.create({
        tweet:tweetId,
        likedBy:userId
    })
    message = "Tweet liked successfully"
    isLiked = true
}

const totalLikes = await Like.countDocuments({
    tweet:tweetId
})
return res.status(200).json(new ApiResponse({totalLikes , isLiked},message))

})

const getLikedVideos = asyncHandler(async(req , res)=>{
    //get userid
    //find liked video by currentuser
    //populate video field 
    //return

    const userId = req.user._id

    const likedVideos = await Like.find({
        likedBy: userId,

        video: { $exists:true }
    }).populate("video")

    return res.status(200).json(new ApiResponse(likedVideos , "All liked video are fetched successfully"))
})

export{toggledVideoLike,toggledCommentLike,toggleTweetLike,getLikedVideos}