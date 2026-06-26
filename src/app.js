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
import videoRouter from "./routes/video.routes.js"
import subscriptionRoute from "./routes/subscription.routes.js"
import tweetsRouter from "./routes/tweet.routes.js"
import commentRouter from"./routes/comment.routes.js" 
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import healthCheck from "./routes/healthcheck.routes.js"

//routes declaration
app.use("/api/v1/users",userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/subscription", subscriptionRoute);
app.use("/api/v1/tweets", tweetsRouter);
app.use("/api/v1/comments",commentRouter);
app.use("/api/v1/likes",likeRouter);
app.use("/api/v1/playlists",playlistRouter);
app.use("/api/v1/dashboards",dashboardRouter);
app.use("/api/v1/healthcheck",healthCheck);

//localhost:8000/api/v1/users/register

export {app}