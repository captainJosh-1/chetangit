import { Router } from "express";
import { loginUser  ,logoutUser , registerUser , refreshAccessToken } from "../controllers/user.controller.js";

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


export default router