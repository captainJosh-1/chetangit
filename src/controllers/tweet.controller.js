import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";

import { Tweet } from "../models/tweet.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const createTweet = asyncHandler(async(req , res)=>{
    //get content from req.body 
    //get userid
    //validation
    //create in DB 
    //return

    const { content } =req.body
    const owner = req.user._id

    if(!content){
        throw new ApiError(400 , "Content is required ")
    }


    const tweet = await Tweet.create({
        content,
        owner
    })

    return res.ststus(201).json(new ApiResponse(tweet , "Tweet is added successfully"))
})

const deleteTweet = asyncHandler(async(req , res)=>{
    //get the tweet id 
    //find it in Tweet 
    //check owner 
    //delete it 
    // return

   const{tweetId}= req.params

  const tweet = await Tweet.findById(tweetId)

  if(!tweet){
    throw new ApiError(404 , "Tweet is not found")
  }

  if(tweet.owner.toString() !== req.user._id.toString()){
    throw new ApiError(403, "unauthorized user")
  }
  const deletedTweet = await Tweet.findByIdAndDelete(tweetId)

  return res.status(200).json(new ApiResponse(deletedTweet,"Tweet is deleted successfully "))
})


const upadteTweet = asyncHandler(async(req , res)=>{
//get tweet id 
//get user id 
//validation
//check user authorization
//change the content 
//save the new content 
//return


const {tweetId}= req.params

const {content} =req.body

if(!content){
    throw new ApiError(400,"content is required ")
}
const tweet = await Tweet.findById(tweetId)

if(!tweet){
    throw new ApiError(403 , "tweet is not found")
}

if(tweet.owner.toString() !== req.user._id.toString()){
    throw new ApiError(403 , "unauthorized error ")
}

tweet.content = content
await tweet.save()

return res.ststus(200).json(new ApiResponse(tweet , "Tweet is updated successfully"))
})

const getAllTweet = asyncHandler(async(req , res)=>{
//do it later 
})

export {createTweet , deleteTweet , upadteTweet}