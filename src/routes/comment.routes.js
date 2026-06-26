import { Router } from 'express';
import {
    addComment,
    deleteComment,
    updateComment,
    getAllComments,
} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middelwares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); 

router.route("/:videoId").post(addComment)
.get(getAllComments);

router.route("/c/:commentId").patch(updateComment)
.delete(deleteComment);

export default router;