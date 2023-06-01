import authRouter from "./modules/Auth/auth.router.js";
import userRouter from "./modules/User/user.router.js";
import booksRouter from "./modules/Books/books.router.js";
import connectDB from "../DB/connection.js";
import { glopalErrHandling } from "./utils/errorHandling.js";

const initApp = (app, express) => {
  app.use(express.json({}));

  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/books", booksRouter);

  app.all("*", (req, res, next) => {
    return res.status(404).json({ message: "error 404 in-valid routing" });
  });

  app.use(glopalErrHandling);

  //connect DataBase
  connectDB();
};

export default initApp;
