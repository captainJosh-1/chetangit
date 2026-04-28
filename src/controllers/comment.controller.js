import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import {ApiError} from "../utils/ApiError.js"
import {Comment} from  "../models/comment.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const addComment = asyncHandler(async(req , res)=>{
//get video id from params
//get user id from req.user._id
//validation if content is there or not 
//if i got video user id's
//create comment in DB
// return respons

const owner = req.user._id

const { videoId } = req.params

const { content }=req.body

//validation 
if(!content){
    throw new ApiError(400, "content is required")
}

if(!videoId){
    throw new ApiError(400, "video is required to add a comment")
}

const comment = await Comment.create({
    content,
    video:videoId,
    owner
})

return res.status(200).json(new ApiResponse(comment ,"comment added successfully"))
})

const deleteComment = asyncHandler(async(req , res)=>{
    //get comment id 
    //find comment in Comment
    //check if owner is same 
    // thorw error 
    // delete comment 
    //return

   const{ commentId } = req.params

  const comment = await Comment.findById(commentId)

  if(!comment){
    throw new ApiError(400 , "comment is not found")
  }

  if(comment.owner.toString() !== req.user._id.toString()){
    throw new ApiError(403,"unauthorized error")
  }

  const deletedComment = await Comment.findByIdAndDelete(commentId)

  return res.status(200).json(new ApiResponse(deletedComment , "Comment has been deleted successfully"))
})

const updateComment = asyncHandler(async(req , res)=>{
    // get comment id 
    // get new content 
    //if not then error
    //find the comment
    //if not then error
    
    //check user
    //if not then unauthorized 

    //and update that content 
    //save
    //return


    const { commentId } = req.params

    const {newContent} = req.body

    if(!newContent){
        throw new ApiError(400 , "Comment content is required ")
    }

    const newComment = await Comment.findById(commentId)

    if(!newComment){
         throw new ApiError(400 , "Comment is not found ")
    }

    if(newComment.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403 , "unauthorized user")
    }

    newComment.content = newContent
    await newComment.save()

   return res.status(200).json(
    new ApiResponse(newComment, "Comment updated successfully")
)
})

const getAllComments = asyncHandler(async(req , res)=>{
//get videod 
//validate
//auth user
//get page and limit 
//find comment with videoId
//apply skip and limit 
//return


const {videoId} = req.params

if(!videoId){
    throw new ApiError(400,"video didnt exist")
}

// pageination
const page = parseInt(req.query.page) || 1
const limit = parseInt(req.query.limit) || 10

const skip =(page - 1)* limit

const comments = await Comment.find({ video: videoId })
.skip(skip)
.limit(limit)
.sort({ createdAt : -1 })

return res.status(200).json(new ApiResponse(comments , "comments are fetched successfully"))


})
export {addComment , deleteComment , updateComment}