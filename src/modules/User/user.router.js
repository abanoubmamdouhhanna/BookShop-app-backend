import Router from "express"
import auth from "../../middlewares/auth.middleware.js"
import { isValid } from "../../middlewares/validation.middleware.js"
import { userFileUpload } from "../../utils/user.multerCloudinary.js"
import * as userController from './controller/user.controller.js'
import { changePasswordSchema, updateUserSchema } from "./controller/user.validation.js"

const router =Router()

//update user
router.post("/updateUser",auth,isValid(updateUserSchema),userController.updateUser)

//update password
router.patch("/changePassword",auth,isValid(changePasswordSchema),userController.changePassword)

//delete user
router.delete("/deleteUser",auth,userController.deleteUser)

//recover account
router.get("/accountRecovery/:reactiveToken",userController.accountRecovery)

//profile pic
router.patch("/uploadProfilePic",auth,userFileUpload().single("profile"),userController.uploadProfilePic)

//cover pic
router.patch("/uploadCoverPic",auth,userFileUpload().single("cover"),userController.uploadCoverPic)
export default router