import moment from "moment";
import mongoose, { model, Schema, Types } from "mongoose";

const bookSchema = new Schema(
  {
    name: {
      type: String,
      min: 3,
      max: 100,
      required: true,
    },
    description: {
      type: String,
      min: 20,
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    usedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    borrowAt: {
      type: Date,
    },
    returnAt: {
      type: Date,
    },
    borrowed: {
      type: Boolean,
      default: false,
    },
    thumbnailURL: { type: String },
    pdfURL: { type: String },
  },
  {
    timestamps: true,
  }
);
bookSchema.virtual("fine").get(function () {
  let daysLate;
  if (this.returnAt) {
    daysLate = moment().diff(
      moment(this.returnAt, "MM-DD-YYYY").format(),
      "days"
    );
  }
  const finePerDay = 50;
  const TotalFine = daysLate * finePerDay;

  if (daysLate > 0 && this.borrowed == true) {
    return `Days Late = ${daysLate} days, fine Per Day = ${finePerDay} EGP, Total Fine = ${TotalFine} EGP`;
  }
  return `Days Late = 0 days, fine Per Day =  ${finePerDay} EGP, Total Fine = 0 EGP`;
});

bookSchema.virtual("thumbnailPublicId").get(function () {
  return `BookShopApp/Books/${this._id}/${this._id}thumbnail`;
});

bookSchema.virtual("pdfPublicId").get(function () {
  return `BookShopApp/Books/${this._id}/${this._id}pdf`;
});

const bookModel = mongoose.models.Book || model("Book", bookSchema);
export default bookModel;
