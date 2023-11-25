const mongoose = require("mongoose");
const User = require("./user");
const { uploadMutlitpleImage } = require("../utils/uploadImage");

const imageSchema = new mongoose.Schema({
  imageUrl: String,
});

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name for the scib"],
      trim: true,
      minlength: 5,
      maxlength: 50,
    },
    description: {
      type: String,
      trim: true,
      minlength: [20, "Please provide description with alteast 20 characters"],
      maxlength: [100, "Description should be within 100 characters"],
    },
    images: [imageSchema],
    like: Number,
    views: Number,
    category: {
      type: String,
      enum: {
        values: [
          "Frontend",
          "Backend",
          "Full-Stack",
          "Mobile",
          "UI/UX",
          "Game Dev",
          "Design",
          "Blockchain",
          "E-commerce",
          "Chatbots",
        ],
        message: "{VALUE} is not supported",
      },
    },
    githubUrl: {
      type: String,
    },
    livesiteUrl: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

//have to save the images link after saving in the cloudinary.

projectSchema.pre("save", async function () {
  const urls = await uploadMutlitpleImage(this.images);

  const imageUrls = urls.map((image) => {
    return { imageUrl: image };
  });

  this.images = imageUrls;
});

module.exports = mongoose.model("Project", projectSchema);
