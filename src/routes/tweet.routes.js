import { Router } from "express";
import {
    createTweet,
    deleteTweet,
    upadteTweet,
    getAllTweet
    } from"../controllers/tweet.controller.js"

    import { verifyJWT } from "../middelwares/auth.middleware.js";

    const router = Router();
    router.use(verifyJWT);

    router.route("/").post(createTweet);
    router.route("/user/:userId").get(getAllTweet);
    router.route("/tweetId").patch(upadteTweet).delete(deleteTweet);

    export default router