import { asyncHandler } from 'express-async-handler';
import { ApiResponse } from '../utils/ApiResponse';

const healthCheck = asyncHandler(async(req , res)=>{
return res.status(200).json(new ApiResponse({
    status :"ok",
    message: "Server is running fine"
   },
   "Health check passed"
)
  );
})

export{healthCheck}