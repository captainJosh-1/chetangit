import { Router } from "express";
import {toggleSubscription ,getChannelSubscribers,getSubscribedChannels} from "../controllers/subscription.controller.js"

import { verifyJWT } from "../middelwares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/c/:channelId")
.get(getChannelSubscribers)
.post(toggleSubscription);

router.route("/u").get(getSubscribedChannels)
export default router