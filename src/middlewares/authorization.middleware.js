export const isAdmin =(req, res, next) => {
  return req.user.role !== "admin"
    ? next(
        new Error("You aren't authorized to take this action!", { cause: 403 })
      )
    : next();
};
