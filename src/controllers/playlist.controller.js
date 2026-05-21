import { Playlist } from "../models/playlist.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const createPlaylist =asyncHandler(async(req , res)=>{
//get name and des from req.body 
//if any empty throw error 
//make entry in DB 
//return created Playlist

const { name , description } = req.body
if(!name?.trim()){
    throw new ApiError(400 , "Both name and description are required")
}
const videoPlaylist =await Playlist.create(
    {
        name,
        description,
        owner:req.user._id,
        videos:[]
    }
)
return res.status(201).json(new ApiResponse(videoPlaylist, "Playlist is created successfully"))
})

const getUserPlaylists = asyncHandler(async(req , res)=>{
//get user Id 
//if not then error 
//then DB find all where owner = userId
//return (even if empty)

const userId = req.user._id

if (!userId){
     throw new ApiError(400, "User ID is required")
}    
const allPlaylist = await Playlist.find( { owner :userId })

//no error throw needed here because we can return a empty []
return res.status(200).json(new ApiResponse(allPlaylist, "all playlists are fetched"))

})


//need to show full detail of the playlist so we have to use populate
 //when use open one of hs playlist 
 //he will get all his video with all deatils
 const getPlaylistById = asyncHandler(async(req , res)=>{
//get playlist Id
//check for error 
//DB find that Playlist by Id
//if not found then throw error
//use populate and handle what you want to get by populate
//return

const { playlistId } = req.params
if(!playlistId){
    throw new ApiError(400 , "PlaylistId is required")
}


const playlist = await Playlist.findById(playlistId)
.populate("videos", "title description thumbnail")


if(!playlist){
    throw new ApiError(404 , "playlist not found")
}
return res.status(200).json(new ApiResponse(playlist , "Playlist is fetched successfully"))
 })

const updatePlaylist =asyncHandler(async(req , res)=>{
//get playlistId 
//check by if 
//req.body name and description
//if not found then error
//if user is authorized
//Now DB and find and update
//return
const { playlistId } = req.params
if(!playlistId){
    throw new ApiError(400 , "PlaylistId is required ")
}
const{ name , description }= req.body

if(!name && !description){
    throw new ApiError(400 , "atleast one is required")
}

if(playlist.owner.toString() !== req.user._id.toString()){
    throw new ApiError(403 , "unauthorized user")
}
const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
    name : name,
    description : description
    },
    { new : true }
)
if(!updatedPlaylist){
     throw new ApiError(404, "Playlist not found")
    }
return res.status(200).json(new ApiResponse(updatedPlaylist , "Playlist is updated successfully "))
 })


const deletPlaylist =asyncHandler(async(req , res)=>{
//get the playlist Id
//check for authorization
//Db find and delete the playlist 
//return

const { playlistId }= req.params

if(!playlistId){
    throw new ApiError(400, "PlaylistId is required")
}
if(playlist.owner.toString() !== req.user._id.toString()){
    throw new ApiError(403 , "unauthorized user")
}
const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)

if(!deletedPlaylist){
    throw new ApiError(404 , "Playlist is not found")
}
return res.status(200).json(new ApiResponse(deletedPlaylist, "playlist is deleted successfully"))
 })





const addVideoToPlaylist =asyncHandler(async(req , res)=>{
//get the playlsit id 
//get the video id 
//if not found then error
//and find the playlist and update it ($addToSet)
//save
//return
const { playlistId } = req.params
const { videoId } = req.body

if(!videoId || !playlistId){
    throw new ApiError(400, "Video Id or playlist Id is not found")
}

const addVideoToplaylist  = await Playlist.findByIdAndUpdate(
    playlistId,
    {
        $addToSet: { videos:videoId }
    },
    { new: true }
)
if(!addVideoToplaylist){
    throw new ApiError(400, "Playlist not found")
}

return res.status(200).json(new ApiResponse(addVideoToplaylist , "Video Added successfully "))
})

const removeVideoFromPlaylist =asyncHandler(async(req , res)=>{
    //get video and playlsit id
    //if not found then error 
    //find by id and dlete it from playlist 
    //if not fount then error
    //return

    const { playlistId , videoId } = req.params
    if(!videoId || !playlistId){
         throw new ApiError(400, "Video Id or playlist Id is not found")
    }
     const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: { videos :videoId }
        },
        { new : true }
     )

     if(!updatedPlaylist){
        throw new ApiError(400, "Palylist is not found ")
     }

     return res.status(200).json(new ApiResponse(updatedPlaylist , "Video Removed successfully "))
})

export {createPlaylist ,getUserPlaylists,getPlaylistById,updatePlaylist,deletPlaylist, addVideoToPlaylist , removeVideoFromPlaylist}