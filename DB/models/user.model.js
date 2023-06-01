import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      min: 3,
      max: 10,
      lowercase: true,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "not Active",
      enum: ["Active", "not Active"],
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    gender: {
      type: String,
      default: "male",
      enum: ["male", "female"],
      required: true,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    activationCode: String,
    otp: String,
    otpexp: Date,
    permanentlyDeleted: Date,
    profileURL: { type: String },
    coverURL: { type: String },
    allborrowedBooks: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);
userSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

userSchema.virtual("profilePicId").get(function()
{
  return `BookShopApp/users/${this._id}/profile/${this._id}profilePic`
})

const UserModel = mongoose.models.User || model("User", userSchema);
export default UserModel;
