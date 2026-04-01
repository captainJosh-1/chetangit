import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))


//data from any form or something
app.use(express.json({limit: "16kb"}))
// const limit = "16kb"; we can use this too like creating constant just to enhence the lv of our code 
app.use(express.urlencoded({extended:true,limit:"16kb"}))
//pdf and images 
app.use(express.static("public"))


app.use(cookieParser())




//routes
import userRouter from "./routes/user.routes.js"



//routes declaration
app.use("/api/v1/users",userRouter)
//localhost:8000/api/v1/users/register

export {app}