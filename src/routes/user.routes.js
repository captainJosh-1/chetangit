import { Router } from "express";
import { loginUser  ,logoutUser , registerUser , refreshAccessToken, changeCurrentPassword,
     getCurrentUser, updateAccountDetails, updateUserAvatar, updateUsercoverImage, getUserChannelProfile,
      getWatchHistory } from "../controllers/user.controller.js";

import { verifyJWT } from "../middelwares/auth.middleware.js";

import { upload } from "../middelwares/multer.middelware.js";

const router = Router();


router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name:"coverImage",
            maxCount: 1
        }
    ]),
    registerUser)
    // upload.fielf it is an middelware which is injected just before the registeruser method  

router.route("/login").post(loginUser)


//secured routes
router.route("/logout").post(verifyJWT , logoutUser) 
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT , changeCurrentPassword)
router.route("/current-user").get(verifyJWT , getCurrentUser)
router.route("/update-account").patch(verifyJWT , updateAccountDetails)
router.route("/avatar").patch(verifyJWT , upload.single("avatar") , updateUserAvatar)
router.route("/cover-image").patch(verifyJWT , upload.single("coverImage"),updateUsercoverImage)

//from params
router.route("/c/:username").get(verifyJWT , getUserChannelProfile)
router.route("/history").get(verifyJWT , getWatchHistory)


export default router