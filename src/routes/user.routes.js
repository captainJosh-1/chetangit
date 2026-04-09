import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

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




export default router