import { asyncHandler } from "../utils/asyncHandler";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const publishAVideo = asyncHandler(async(req , res)=>{
    //get data from req.body
    //validate fields if any empty 
    //create video object 
    // set isPublised = true 
    //save in DB 
    // return


    //get data
    const {title , description , videoFile , thumbnail }=req.body

    if(!title || !description || !videoFile || !thumbnail) {
        throw new ApiError(400 , "All fields are required")
    }





    // need to update the code by cloudinary 





    const video =await  Video.create({
        title,
        description,
        videoFile , // temprory string 
        thumbnail, // temprory string 
        owner:req.user._id,
        isPublished: true
    })

    return res.status(201).json(new ApiResponse(video , "Video uploaded successfully"))
})

const  getAllVideo = asyncHandler(async(req , res)=>{


    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    
    const skip =(page - 1)* limit
    
    const videos  =await Video.find({ isPublished :true })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt : -1 })

    return res.status(200).json(new ApiResponse(videos  , "Video fetched successfully"))
})

// start marked getVideoByIdgetVideoByIdgetVideoByIdgetVideoById 
// look here 

const togglePublishStatus = asyncHandler(async(req , res)=>{
// get the video id 
//find video in db 
// check auth
// toggle value
//save
//return

const{ videoId} = req.params

const video = await Video.findById(videoId)

if(!video){
    throw new ApiError(404 , "video is not found ")
}

if(video.owner.toString() !== req.user._id.toString()){
    throw new ApiError(403 , "user is unauthorized")
}

video.isPublished = !video.isPublished 


await video.save()

return res.status(200).json(new ApiResponse(400 , "video is toggeled "))

})


const updateVideo =asyncHandler(async(req , res)=>{
//req.body 
//video id by params
//atleast one field to update
//find the video 
//if not found then error
//check auth (403)
//update field 
//await save 
//return

const {title , description}= req.body

const {videoId}= req.params

if( !title && !description ){
    throw new ApiError(400 , "atleast one field is required")
}

const video = await Video.findById(videoId)
if(!video){
    throw new ApiError(404 , "video didnt exist")
}

if(video.owner.toString() !== req.user._id.toString()){
    throw new ApiError(403, "unauthorized user")
}

if(title) video.title = title
if(description) video.description = description
await video.save()

return res.status(200).json(new ApiResponse(video , "video details are updated"))
})

const deleteVideo = asyncHandler(async(req , res)=>{
//get video id 
//find in db 
//if not found then error (404)
//check authorization (403)
//then delete from the db 
//return

//in this one findbyIdand Delete is best it check auth and find video by its id  
const {videoId}= req.params
const video = await Video.findOneAndDelete(
    {
        _id : videoId,
       owner : req.user._id
    }
)

if(!video){
    throw new ApiError(404, "video is not found or unauthorized user")
}

return res.status(200).json(new ApiResponse(video , "video is deleted successfully"))
})