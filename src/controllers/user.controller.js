import { asyncHandler } from "../utils/asyncHandler.js";


import { ApiError } from "../utils/ApiError.js";

import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


import { ApiResponse } from "../utils/ApiResponse.js";

import jwt from "jsonwebtoken";
import { json } from "express";


// just create one methode after registering the user while working on login 

//saving the token (context while you hit the endpoint to comapre refreshtoken)

const genrateAccessAndRefreshTokens = async(userId)=>
    {
    try{ 
        const user = await User.findById(userId)
        const accessToken =user.genrateAccessToken()
        const refreshToken = user.genrateRefreshToken()

        //to add in obj and save it in obj 
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        // return accesstoken and refreshtoken 
        return { accessToken , refreshToken }
        //now this method just need userID and it will genrate both th tokens and save it to the db and return the tokens which are genrated ,just by this method


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
        //     (meaning allowing user to login)
        //send cookies 
        //      (means saving login data)
        //send res
        

        const {email, username , password } = req.body

        if(!username && !email){
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


        // method is returning both the token so we collect them by { - , -}
        const { accessToken , refreshToken } =await genrateAccessAndRefreshTokens(user._id)

// optional step 
       const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
       

       // only modified by server 
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
        //like User.findById ,we cant do it because how we will get email or username ? 
        // so thats the problem like we cant give a form to user fill for logout
        
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

    //if your access token get expired then you can hit an endpoint and beckend will 
    // compare your refreshtoken with saved refreshtoken and if they matched it will give you 
    // a new access token     
    //so we are about to create a new endpoint 

    const refreshAccessToken = asyncHandler(async(req , res)=>{
        // from where we will get the refreshtoken oh ok we can get from cookies 
       const incomigRefreshToken =  req.cookie.refreshToken || req.body.refreshToken

       if(!incomigRefreshToken){
        throw new ApiError(401,"unauthorized request")
       }
       
    //    jwt.verify(
    //     incomigRefreshToken , process.env.REFESH_TOKEN_SCREAT
    //    )
     
    const decodeToken = jwt.verify(
        incomigRefreshToken , process.env.REFESH_TOKEN_SCREAT
       )

       const user = await User.findById(decodeToken?._id)

       if(!user){
        throw new ApiError(401,"Invalid refresh token")
       }
       // now compare both the refresh token i mean the decoded one and
       //  the one which is save in user"s cookie from user side by if 

       if(incomigRefreshToken !== user?.refreshToken ){
        throw new ApiError("Refresh Token is exipired is expired or used ")
       }

       //if both the match then ok you can have new access token 
       //to genrate new access token , we will send in cookies 
       //always like this 
       const options = {
        httpOnly: true,
        secure: true
       }
      const {accessToken , newRefreshToken} = await genrateAccessAndRefreshTokens(user._id)

       return res.status(200)
       .cookie("accessToken" , accessToken , options)
       .cookie("refreshToken" , newRefreshToken , options)
       .json(
        new ApiResponse(
            200,
            {accessToken , refreshToken: newRefreshToken},
            "Access token refreshed"
        )
       )


    })


    //while changing password we dont have to care about if user is logged in
    //or not we will use verifyjwt middleware 
    const changeCurrentPassword = asyncHandler(async(req , res )=>{

        const {oldPassword , newPassword} = req.body

        const user = await User.findById(req.user?._id) // req.user?._id by a middleware (req.user = user )(auth.middleware)

        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
        if(!isPasswordCorrect){
            throw new ApiError(400 ,"Invalid oldPassword")
        }

        //go to user and update it as newpassword but it will hit one pre 
        //go check in user model 
        user.password= newPassword

        await user.save({validateBeforeSave: false}) // we dont want to run other fields so validate = false
        return res.status(200)
        .json(new ApiResponse(200 ,{} , "Password changed successfully"))



    })



    //we use middelware so we passed thr complete user(hint) 
    const getCurrentUser = asyncHandler(async(req , res)=>{
        return res.status(200)
        .json(200 , req.user, "Current user fetched successfully")
    })

    const updateAccountDetails = asyncHandler(async(req , res)=>{
        const {fullName , email} = req.body

        if(!funnName || !email){
            throw new ApiError(40 , "All fields are required")
        }

       const user =  User.findByIdAndUpdate(req.user?._id ,
            {
                $set:{
                    fullName: fullName,
                    email : email
                }
            },
            {new :true}
        ).select("-password")

        return res.status(200).json(new ApiResponse(200, user , "Account details uploaded successfully"))
    })




    const updateUserAvatar = asyncHandler(async(req , res)=>{
        const avatarLocalPath = req.file?.path

        if(!avatarLocalPath){
            throw new ApiError(400 , "Avatar file is missing")
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath)

        if(!avatar.url){
            throw new ApiError("Error while uploading on avatar")
        }

        const user = await User.findByIdAndUpdate(req.user?._id,
            {
                $set :{
                    avatar:avatar.url
                }
            },
            {new: true}
        ).select("-password")

        return res.status(200,json(
            new ApiResponse(200,user , "avatarImage is uploaded successfully")
        ))
    })

    const updateUsercoverImage = asyncHandler(async(req , res)=>{
        const coverImagelocalpath = req.file?.path

        if(!coverImagelocalpath){
            throw new ApiError(400 , "coverImage file is missing")
        }

        const coverImage = await uploadOnCloudinary(coverImagelocalpath)

        if(!coverImage.url){
            throw new ApiError(400 , "Error while uploading on coverImage")
        }

        const user = await User.findByIdAndUpdate(req.user?._id,
            {
                $set :{
                    coverImage:coverImage.url
                }
            },
            {new :true}
        ).select("-password")

        return res.status(200,json(
            new ApiResponse(200,user , "coverImage is uploaded successfully")
        ))
    })

export {registerUser , loginUser , logoutUser , refreshAccessToken , changeCurrentPassword , updateAccountDetails, getCurrentUser,updateUserAvatar , updateUsercoverImage}