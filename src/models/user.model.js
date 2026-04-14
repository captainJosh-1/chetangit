import mongoose ,{ Schema } from "mongoose";


import jwt  from "jsonwebtoken";

import bcrypt from "bcrypt"

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,//searching kisi pe anable karna ho to 
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
     fullName:{
        type:String,
        required:true,
        index:true,
        trim:true
    },
    avatar:{
        type:String,// cloudinary url 
        required:true,
    },
    coverImage:{
        type:String, // cloudinary url
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,"password is required"]
    },
    refreshToken:{
        type:String
    }

},{timestamps:true})


userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    // next()
    //because of oe error i comment it 
});


//custom methods
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.genrateAccessToken = function(){
 return jwt.sign(
        {
            _id: this.id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SCREAT,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.genrateRefreshToken = function(){
     return jwt.sign(
        {
            _id: this.id,
        },
        process.env.REFESH_TOKEN_SCREAT,
        {
            expiresIn:process.env.REFESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User",userSchema)