import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";

import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
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

    return res.status(201).json(new ApiResponse(201,tweet , "Tweet is added successfully"))
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

  return res.status(200).json(new ApiResponse(201 , deletedTweet,"Tweet is deleted successfully "))
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

return res.status(200).json(new ApiResponse(200 , tweet , "Tweet is updated successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const tweets = await Tweet.find({
        owner: userId
    }).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            tweets,
            "User tweets fetched successfully"
        )
    );
});

export {createTweet , deleteTweet , upadteTweet , getUserTweets}