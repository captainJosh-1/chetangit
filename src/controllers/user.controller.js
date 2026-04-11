import { asyncHandler } from "../utils/asyncHandler.js";


import { ApiError } from "../utils/ApiError.js";

import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


import { ApiResponse } from "../utils/ApiResponse.js";


// just create one methode after registering the user while working on login 

const genrateAccessAndRefreshTokens = async(userId)=>
    {
    try{ 
        const user = await User.findById(userId)
        const accessToken =user.genrateAccessToken()
        const refreshToken = user.genrateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken , refreshToken }


    } catch (error) {
        throw new ApiError(500,"something went wrong while genrating refresh and access token")
    }
}

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


    const loginUser = asyncHandler(async(req , res )=>{

        //req body = > data
        //username or email
        //find the user 
        //password check 
        //access and refresh token 
        //send cookies
        //send res
        

        const {email, username , password } = req.body

        if(!username || !email){
            throw new ApiError(400, "username or email is required")
        }

        // checking if user is registered 
     const user = await User.findOne({
            $or : [{ username } , { email }]
        })

        if(!user){
            throw new ApiError(404, "user does not exist")
        }
 
        const isPasswordvalid = await user.isPasswordCorrect(password) 
            
        if(!isPasswordvalid){
            throw new ApiError(401,"invalid user credentials")
        }


        const { accessToken , refreshToken } =await genrateAccessAndRefreshTokens(user._id)

// optional step 
       const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
       
       const options ={
        httpOnly: true,
        secure: true
       }

       return res
       .status(200)
       .cookie("accessToken",accessToken, options)
       .cookie("refreshToken", refreshToken,options)
       .json(
        new ApiResponse(200,{
            user:loggedInUser, accessToken , refreshToken
        },
        "User loggedIn successfully"
         )
       )



        
      
    })

    
     const logoutUser = asyncHandler(async(req , res ) =>{
        
         //logout so remove refrestoken and cookies 
       //by creating our own middelware 
       //designing our own middeleware

      await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new : true
        }
       )
       const options = {
        httpOnly: true,
        secure: true
       }
       return res
       .status(200)
       .clearCookie("accessToken" , options)
       .clearCookie("refreshToken" , options)
       .json(new ApiResponse(200,{}, "User Logged Out "))
    })

export {registerUser , loginUser , logoutUser }