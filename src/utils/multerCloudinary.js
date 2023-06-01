import multer from "multer";
const fileValidation = () => {
  return (req, file, cb) => {
    if (
      (file.fieldname === "pdf" && file.mimetype === "application/pdf") ||
      (file.fieldname === "thumbnail" && file.mimetype === "image/png")
    ) {
      return cb(null, true);
    } else {
      return cb(new Error("In-Valid format", { cause: 400 }), false);
    }
  };
};

export function fileUpload(size) {
  const storage = multer.diskStorage({});
  const limits = { fileSize: size * 1000 * 1000 };
  const fileFilter = fileValidation();
  const upload = multer({ fileFilter, storage, limits });
  return upload;
}
