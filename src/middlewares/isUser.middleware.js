export const isUser = (req, res, next) => {
  return req.user.role !== "user"
    ? next(
        new Error(
          "You aren't authorized to take this action! ,user only can do it",
          { cause: 403 }
        )
      )
    : next();
};
