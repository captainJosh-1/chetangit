import { asyncHandler } from "../utils/asyncHandler.js";


import { ApiError } from "../utils/ApiError.js";

import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


import { ApiResponse } from "../utils/ApiResponse.js";




// const registerUser = asyncHandler(async (req , res )=>{
//     res.status(200).json({
//         message:"jai sawariya"
//     })
// })


const registerUser = asyncHandler(async(req , res )=>{
    //get user details from frontend 
    //validation - not empty
    //check if user already exists: username, email
    //check for images
    //check for avtar because it is compulsory
    //upload them to cloudinary , need to check for avatar 
    //create user object  - create entry in db
    //remove password and refreshtoken field
    //check for user creation 
    //return res 



console.log("BODY:", req.body);
         if (!req.body) {
  throw new ApiError(400, "Body not received properly"); 
         }
// i put it above 
 

    const{fullName, email,username,password}= req.body;
    console.log("fullName : ",fullName,);

    // re.body can be undefined if multiple handling isnt properly aligned 
//     if (!req.body) {
//   throw new ApiError(400, "Body not received properly");


    //validations


    // if(fullName === ""){
    //     throw new ApiError(400,"fullname is required")
    // }


    if(
        [fullName,email,username,password].some((field) =>
        field?.trim() === "")
    ){
     throw new ApiError(400,"All field are required")   
    }



// alredy exist?

    const existedUser = await User.findOne({
        $or : [{ username }, { email }]
    })

    if(existedUser){
        throw new ApiError(409,"User with email or username alredy exist")
    }

    //file handling 
    const avatarLocalPath = req.files?.avatar?.[0]?.path; 
   const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

   if(!avatarLocalPath){
    throw new ApiError(400, "avatar file is required")
   }
   
   //to upload on cloudinary 
   const avatar = await uploadOnCloudinary(avatarLocalPath)

//    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
   //i need to replace this forcefully 
   
   let coverImage;

if (coverImageLocalPath) {
  coverImage = await uploadOnCloudinary(coverImageLocalPath);
}

   
   if (!avatar) {
     throw new ApiError(400, "Failed to upload avatar");
   }


   //now entry in DB
   
  const user =  await User.create({
    fullName,
    avatar:avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
   })

   //check it is created or not 
   //user.email._id 
   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )

   if(!createdUser){
    throw new ApiError (500,"something went wrong while registring the user")
   }

    return res.status(201).json(
        new ApiResponse(200, createdUser , "User registered successfully")
    )
})
export {registerUser}