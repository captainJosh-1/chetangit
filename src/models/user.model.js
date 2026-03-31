import mongoose ,{ Schema } from "mongoose";


import { JsonWebTokenError } from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username:{
        type:String,
        require:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,//searching kisi pe anable karna ho to 
    },
    email:{
        type:String,
        require:true,
        unique:true,
        lowercase:true,
        trim:true
    },
     fullName:{
        type:String,
        require:true,
        index:true,
        trim:true
    },
    avatar:{
        typr:String,// cloudinary url 
        require:true,
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
    if(!this.ismodified("password")) return next();

    this.password = bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.genrateAccessToken = function(){
    jwt.sign(
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
    jwt.sign(
        {
            _id: this.id,
        },
        process.env.REFESH_TOKEN_SCREAT,
        {
            expiresIn:process.env.REFESH_TOKEN_EXPIRY
        }
    )
}


//custom methods
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password , this.password)
}

export const User = mongoose.model("User",userSchema)