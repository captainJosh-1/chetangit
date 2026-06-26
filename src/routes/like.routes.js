import { Router } from 'express';
import {
    getLikedVideos,
    toggledCommentLike,
    toggledVideoLike,
    toggleTweetLike,
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middelwares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); 

router.route("/toggle/v/:videoId").post(toggledVideoLike);
router.route("/toggle/c/:commentId").post(toggledCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);

export default router;