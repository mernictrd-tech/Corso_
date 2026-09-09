require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const slugify = require("slugify");

const Category = require("../models/category.model");
const Program = require("../models/program.model");

const MONGO_URI = process.env.MONGO_URI;

const categoriesPath = path.join(
  __dirname,
  "../../data/categories.json"
);

const seedCategoriesPrograms = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");

    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB Connected");
    console.log(`📂 Database: ${mongoose.connection.name}`);

    const fileData = fs.readFileSync(categoriesPath, "utf-8");
    const categories = JSON.parse(fileData);

    if (!Array.isArray(categories)) {
      throw new Error("categories.json must contain an array.");
    }

    console.log(`📄 Categories found: ${categories.length}`);

    let categoryCount = 0;
    let programCount = 0;

    for (const categoryData of categories) {
      // -----------------------------
      // CATEGORY
      // -----------------------------

      let category = await Category.findOne({
        name: categoryData.name.trim(),
      });

      if (!category) {
        category = await Category.create({
          name: categoryData.name.trim(),
          isActive: true,
        });

        categoryCount++;

        console.log(`\n✅ Category created: ${category.name}`);
      } else {
        console.log(`\n⚠️ Category already exists: ${category.name}`);
      }

      // -----------------------------
      // CATEGORY DEFAULT PRICING
      // -----------------------------

      const categoryPricing = categoryData.pricing || {};

      const categoryOriginalPrice =
        categoryPricing.originalPrice ?? 499;

      const categorySellingPrice =
        categoryPricing.sellingPrice ?? 249;

      // -----------------------------
      // COURSES / PROGRAMS
      // -----------------------------

      if (!Array.isArray(categoryData.courses)) {
        console.log(
          `⚠️ No courses found for category: ${category.name}`
        );

        continue;
      }

      for (const course of categoryData.courses) {
        const courseSlug = slugify(course.name.trim(), {
          lower: true,
          strict: true,
          trim: true,
        });

        const existingProgram = await Program.findOne({
          $or: [
            { name: course.name.trim() },
            { slug: courseSlug },
          ],
        });

        if (existingProgram) {
          console.log(
            `   ⚠️ Program already exists: ${course.name}`
          );

          continue;
        }

        // -----------------------------
        // COURSE-SPECIFIC PRICING
        // -----------------------------

        const courseOriginalPrice =
          course.pricing?.originalPrice ??
          categoryOriginalPrice;

        const courseSellingPrice =
          course.pricing?.sellingPrice ??
          categorySellingPrice;

        // Safety check
        if (courseSellingPrice > courseOriginalPrice) {
          throw new Error(
            `Selling price cannot be greater than original price for: ${course.name}`
          );
        }

        await Program.create({
          name: course.name.trim(),

          totalQuestions: 10,

          examDuration: 10,

          passingQuestions: 6,

          description: course.description || "",

          category: category._id,

          thumbnail: "",

          certificateDemo: "",

          originalPrice: courseOriginalPrice,

          sellingPrice: courseSellingPrice,

          isActive: true,

          isDeleted: false,

          deletedAt: null,
        });

        programCount++;

        console.log(
          `   ✅ Program created: ${course.name} | ₹${courseOriginalPrice} → ₹${courseSellingPrice}`
        );
      }
    }

    console.log("\n================================");
    console.log("🎉 SEEDING COMPLETED");
    console.log("================================");
    console.log(`📂 New Categories: ${categoryCount}`);
    console.log(`📚 New Programs: ${programCount}`);
    console.log("================================");
  } catch (error) {
    console.error("\n❌ Seeding failed:");
    console.error(error.message);

    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();

    console.log("🔌 MongoDB connection closed.");
  }
};

seedCategoriesPrograms();