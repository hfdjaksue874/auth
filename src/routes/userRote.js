import e from "express";
import { createUser, loginUser, resetPassword, updatePassword} from "../controller/userCntroller.js";

const userRouter = e.Router();


userRouter.post('/register',createUser)
userRouter.post('/login',loginUser)
userRouter.post('/rest-password',resetPassword)
userRouter.post('/reset-password/:token', updatePassword)

export default userRouter;