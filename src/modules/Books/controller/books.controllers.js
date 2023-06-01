import moment from "moment/moment.js";
import bookModel from "../../../../DB/models/book.model.js";
import UserModel from "../../../../DB/models/user.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

//add book
export const addBook = asyncHandler(async (req, res, next) => {
  if (!req.files.thumbnail || !req.files.pdf) {
    return next(new Error("Both thumbnail and pdf book are required"));
  }
  const { name, description } = req.body;
  const book = await bookModel.create({
    name,
    description,
    createdBy: req.user.id,
  });
  const thumbnail = await cloudinary.uploader.upload(
    req.files.thumbnail[0].path,
    {
      folder: `BookShopApp/Books/${book._id}`,
      public_id: `${book._id}thumbnail`,
    }
  );
  const pdf = await cloudinary.uploader.upload(req.files.pdf[0].path, {
    folder: `BookShopApp/Books/${book._id}`,
    public_id: `${book._id}pdf`,
  });

  book.thumbnailURL = thumbnail.secure_url;
  book.pdfURL = pdf.secure_url;

  await book.save();
  return res.status(201).json({ message: "Added successfully", result: book });
});

//====================================================================================================================//
//update book
export const updateBook = asyncHandler(async (req, res, next) => {
  const { bookid } = req.params;

  const createdBy = req.user.id;

  const book = await bookModel.findByIdAndUpdate(
    { createdBy, _id: bookid },
    req.body,
    { new: true }
  );

  return book
    ? res
        .status(200)
        .json({ message: "Book updated sucessfully", result: book })
    : next(new Error("unauthorized to update this book", { cause: 400 }));
});

//====================================================================================================================//
//update book Thumbnail
export const updateBookThumbnail = asyncHandler(async (req, res, next) => {
  const book = await bookModel.findById(req.params.bookid);

  if (book) {
    const thumbnail = await cloudinary.uploader.upload(req.file.path, {
      folder: `BookShopApp/Books/${book._id}`,
      public_id: `${book._id}thumbnail`,
    });
    book.thumbnailURL = thumbnail.secure_url;
    await book.save();
    return res
      .status(200)
      .json({ message: "Book thumbnail updated sucessfully", result: book });
  }
  return next(new Error("In-valid bood id", { cause: 400 }));
});

//====================================================================================================================//
//update book Pdf
export const updateBookPdf = asyncHandler(async (req, res, next) => {
  const book = await bookModel.findById(req.params.bookid);

  if (book) {
    const pdf = await cloudinary.uploader.upload(req.file.path, {
      folder: `BookShopApp/Books/${book._id}`,
      public_id: `${book._id}pdf`,
    });
    book.pdfURL = pdf.secure_url;
    await book.save();
    return res
      .status(200)
      .json({ message: "Book pdf updated sucessfully", result: book });
  }
  return next(new Error("In-valid bood id", { cause: 400 }));
});

//====================================================================================================================//
//delete book
export const deleteBook = asyncHandler(async (req, res, next) => {
  const { bookid } = req.params;

  const createdBy = req.user.id;

  const book = await bookModel.findOneAndDelete({ createdBy, _id: bookid });

  if (book) {
    await cloudinary.uploader.destroy(book.thumbnailPublicId);
    await cloudinary.uploader.destroy(book.pdfPublicId);
    await cloudinary.api.delete_folder(`BookShopApp/Books/${book._id}`);

    return res.status(200).json({ message: "Deleted successfully" });
  }
  return next(new Error("Invalid book or user id!", { cause: 400 }));
});

//====================================================================================================================//
//get books
export const getBooks = asyncHandler(async (req, res, next) => {
  const book = await bookModel.find();

  return book
    ? res.json({ message: "Done", result: book })
    : next(new Error("There is no books found", { cause: 400 }));
});

//====================================================================================================================//
//get book with id
export const getBookWithId = asyncHandler(async (req, res, next) => {
  const { bookid } = req.params;
  const book = await bookModel.findById(bookid);
  return book
    ? res.json({ message: "Done", result: book })
    : next(new Error("There is no books found", { cause: 400 }));
});

//====================================================================================================================//
//get admin books
export const getAdminBooks = asyncHandler(async (req, res, next) => {
  const book = await bookModel.find({ createdBy: req.user.id });
  return book
    ? res.json({ message: "Done", result: { books: book } })
    : next(new Error("There is no books found", { cause: 400 }));
});

//====================================================================================================================//
//borrow book
export const borrowBook = asyncHandler(async (req, res, next) => {
  const { bookid } = req.params;
  const book = await bookModel.findById(bookid);
  if (book.borrowed) {
    return next(
      new Error("You can't borrow this book right now ,it's already borrowed", {
        cause: 400,
      })
    );
  }
  book.borrowed = true;
  book.borrowAt = moment();
  book.returnAt = moment().add(7, "days");
  book.usedBy = req.user.id;
  await book.save();

  await UserModel.findOneAndUpdate(
    { _id: req.user._id },
    { $addToSet: { allborrowedBooks: bookid } }
  );
  console.log(moment().diff(7, "days"));
  return res.status(200).json({ message: "Book borrowed", result: { book } });
});

//====================================================================================================================//
//return book
export const returnBook = asyncHandler(async (req, res, next) => {
  const { bookid } = req.params;

  const book = await bookModel.findOneAndUpdate(
    { _id: bookid, borrowed: true },
    { borrowed: false, usedBy: null, borrowAt: null, returnAt: null }
  );

  if (book) {
    const fine = book.fine;
    return res.status(200).json({ message: "Book returned", result: { fine } });
  }
  return next(
    new Error("Can't return book because is's not borrowed", { cause: 400 })
  );
});

//====================================================================================================================//
//not returned yet books
export const notReturnedBooks = asyncHandler(async (req, res, next) => {
  const book = await bookModel.find({
    usedBy: req.user.id
  });
  return res.status(200).json({ message: "Not returned yet books", book });
});

//====================================================================================================================//
//borrowed Boooks History
export const borrowedBoooksHistory = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user.id);

  const books = [];
  for (let i = 0; i < user.allborrowedBooks.length; i++) {
    const book = await bookModel.findById(user.allborrowedBooks[i]); 
    if (book) {
      books.push(book);
    }
  }
  return res.status(200).json({ message: "Borrowed Boooks History", books });
});
