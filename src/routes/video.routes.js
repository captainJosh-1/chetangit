import { Router } from "express";
import { publishAVideo , getAllVideo, getVideoById,
    togglePublishStatus,updateVideo,deleteVideo} from "../controllers/video.controller.js";

import { verifyJWT } from "../middelwares/auth.middleware.js";

import { upload } from "../middelwares/multer.middelware.js";

const router = Router();

router.route("/")
.post(
    verifyJWT,
    upload.fields([
        {
            name:"videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishAVideo
);

router.route("/").get(getAllVideo);

router.route("/:videoId")
        .get(getVideoById)
        .patch(verifyJWT ,updateVideo)
        .delete(verifyJWT,deleteVideo);
router.route("/:videoId/toggle-publish").patch(verifyJWT,togglePublishStatus);

export default router