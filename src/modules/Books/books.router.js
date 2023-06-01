import { Router } from "express";
import auth from "../../middlewares/auth.middleware.js";
import { isAdmin } from "../../middlewares/authorization.middleware.js";
import { isUser } from "../../middlewares/isUser.middleware.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import { fileUpload } from "../../utils/multerCloudinary.js";
import {
  addBookSchema,
  updateBookSchema,
} from "./controller/book.validation.js";
import * as bookController from "./controller/books.controllers.js";
const router = Router();

// add book
router.post(
  "/addbook",
  auth,
  isAdmin,
  fileUpload(1).fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  isValid(addBookSchema),
  bookController.addBook
);

//update book name || description
router.patch(
  "/updateBook/:bookid",
  auth,
  isAdmin,
  isValid(updateBookSchema),
  bookController.updateBook
);

//update book thumbnail
router.patch(
  "/updateBookThumbnail/:bookid",
  auth,
  isAdmin,
  fileUpload(1).single("thumbnail"),
  bookController.updateBookThumbnail
);

//update book pdf
router.patch(
  "/updateBookPdf/:bookid",
  auth,
  isAdmin,
  fileUpload(3).single("pdf"),
  bookController.updateBookPdf
);

//delete book
router.delete("/deleteBook/:bookid", auth, isAdmin, bookController.deleteBook);

//get all books 
router.get("/getBooks",auth ,bookController.getBooks)

//get book with id
router.get("/getBooks/:bookid",auth ,bookController.getBookWithId)

//get all admin books
router.get("/getAdminBooks",auth,isAdmin,bookController.getAdminBooks)

//borrow book
router.post("/borrow/:bookid" ,auth ,isUser,bookController.borrowBook)

//return book
router.post("/returnBook/:bookid",auth,isUser,bookController.returnBook)

//get all not returned yet books 
router.get("/notreturnedbooks",auth,bookController.notReturnedBooks)

//all borrowed books history
router.get("/borrowedBoooksHistory",auth,bookController.borrowedBoooksHistory)

export default router;
