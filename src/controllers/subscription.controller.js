import { asyncHandler } from "../utils/asyncHandler.js";
import{Subscription} from "../models/subscription.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";


const toggleSubscription = asyncHandler(async(req , res)=>{
//get userId 
//get channelId 

//check if already subscribed
//if yes then remove 
//no then make it subscribe 

//return res 
const {channelId} = req.params 
const userId = req.user._id


if(channelId.toString()=== userId.toString()){
    throw new ApiError(400,"you cannot subscribe to yourself")
}

const existingSubscriber =await Subscription.findOne({
    channel :channelId,
    subscriber:userId
});


let message
let isSubscribed;

if(existingSubscriber){
    await Subscription.deleteOne({
        channel:channelId,
        subscriber:userId
    })
    message = "Unsubscribed successfully ";
    isSubscribed = false;
} 
else{

    await Subscription.create({
        channel :channelId,
        subscriber:userId
    })

    message= "channel subscribed successfully"
    isSubscribed = true 
}
const totalSubscriber = await Subscription.countDocuments({
    channel:channelId
})
return res.status(200).json(new ApiResponse({totalSubscriber, isSubscribed},message))
});



const getChannelSubscribers =asyncHandler(async(req , res)=>{
const {channelId}= req.params;


if(!mongoose.isValidObjectId(channelId)){
    throw new ApiError(400,"Invalid channel ID");
}

const subscribers= await Subscription.aggregate([
    {
        $match: {
            channel: new mongoose.Types.ObjectId(channelId)
        }
    },

    {
        $lookup:{
            from:"users",
            localField:"subscriber",
            foreignField:"_id",
            as:"subscriberDetails"
        }
    },
    {
        $project:{
           _id:0,
          subscriberId: { $arrayElemAt: ["$subscriberDetails._id", 0] },
          username: { $arrayElemAt: ["$subscriberDetails.username", 0]},
          email: { $arrayElemAt: ["$subscriberDetails.email", 0]}

            
        }
    }
]);
return res.status(200).json(
    new ApiResponse({
        totalSubscriber:subscribers.length,
        subscribers
    },
    "Subscribers fetched successfully"
   )
  );
});

const getSubscribedChannels =asyncHandler(async(req , res)=>{

    const userId = req.user._id;


    const channels = await Subscription.aggregate([
        {
            $match: {
                subscriber :new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup:{
                from: "users",
                localField:"channel", // channelId
                foreignField:"_id", 
                as:"channelDetails" // store detail of channel 
            }
        },
        
        {
            $project:{
                _id:0,
                channelId:{ $arrayElemAt: ["$channelDetails._id",0] },
                username :{ $arrayElemAt:["$channelDetails.username",0] },
                email:{$arrayElemAt: ["$channelDetails.email",0] }
            }
        }
    ]);

    return res.status(200).json(new ApiResponse(
        {
            count:channels.length,
            channels
        },
        "Subscribed channels fetched successfully"
    ));
});


export {toggleSubscription ,getChannelSubscribers,getSubscribedChannels  }