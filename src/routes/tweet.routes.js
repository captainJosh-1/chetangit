import { Router } from "express";
import {
    createTweet,
    deleteTweet,
    upadteTweet,
    getUserTweets
    } from"../controllers/tweet.controller.js"

    import { verifyJWT } from "../middelwares/auth.middleware.js";

    const router = Router();
    router.use(verifyJWT);

    router.route("/").post(createTweet);
    router.route("/user/:userId").get(getUserTweets);

    router.route("/:tweetId").patch(verifyJWT,upadteTweet)
    .delete(verifyJWT , deleteTweet);

    export default router