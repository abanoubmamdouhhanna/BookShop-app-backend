export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return next(new Error(error));
    });
  };
};

export const glopalErrHandling = async (error, req, res, next) => {
  if (error) {
    if (process.env.MOOD == "DEV") {
      return res
        .status(error.cause || 500)
        .json({ message: error.stack});
    } else {
      return res.status(error.cause || 500).json({ message: error.message });
    }
  }
};
