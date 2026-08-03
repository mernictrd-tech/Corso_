const mongoose = require("mongoose");
const slugify = require("slugify");

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Program name is required"],
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    totalQuestions: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      default: null,
    },

    thumbnail: {
      type: String,
      default: "",
    },

    originalPrice: {
      type: Number,
      required: [true, "Original price is required"],
      min: 0,
    },

    sellingPrice: {
      type: Number,
      required: [true, "Selling price is required"],
      min: 0,
      validate: {
        validator: function (value) {
          return value <= this.originalPrice;
        },
        message: "Selling price cannot be greater than original price.",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

programSchema.pre("save", function () {
  if (!this.isModified("name")) {
    return;
  }

  this.slug = slugify(this.name, {
    lower: true,
    strict: true,
    trim: true,
  });
});

module.exports = mongoose.model("Program", programSchema);
