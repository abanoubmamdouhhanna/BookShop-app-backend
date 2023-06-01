import UserModel from "../../DB/models/user.model.js";
import { asyncHandler } from "../utils/errorHandling.js";
import { verifyToken } from "../utils/generateAndVerifyToken.js";
const auth = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(new Error("Authorization is required",{cause :400}));
  }
  const decoded = verifyToken({
    payload: authorization,
    signature: process.env.SIGNATURE,
  });
  if (!decoded?.id) {
    return next(new Error("In-valid token payload",{cause :401}));
  }
  const authUser = await UserModel.findById(decoded.id);
  if (!authUser) {
    return next(new Error("not register account",{cause :400}));
  }
  if (!authUser.isConfirmed) {
    return next(new Error("You must activate your email",{cause :400}))
  }
  req.user = authUser;
  return next();
});
export default auth;
