require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const Question = require("../models/question.model");
const Category = require("../models/category.model");
const Program = require("../models/program.model");

const MONGO_URI = process.env.MONGO_URI;

const questionsPath = path.join(
  __dirname,
  "../../data/questions.json"
);

// -----------------------------------------
// Fisher-Yates Shuffle
// -----------------------------------------

const shuffle = (array) => {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
};

// -----------------------------------------
// Main Import Function
// -----------------------------------------

const importQuestions = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");

    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB Connected");
    console.log(`📂 Database: ${mongoose.connection.name}`);

    // -----------------------------------------
    // 1. Read JSON
    // -----------------------------------------

    const fileData = fs.readFileSync(
      questionsPath,
      "utf-8"
    );

    const questions = JSON.parse(fileData);

    if (!Array.isArray(questions)) {
      throw new Error(
        "questions.json must contain an array."
      );
    }

    console.log(
      `📄 Questions found in JSON: ${questions.length}`
    );

    // -----------------------------------------
    // 2. Check Category
    // -----------------------------------------

    const categories = [
      ...new Set(
        questions.map((item) =>
          item.category?.trim()
        )
      ),
    ];

    if (categories.length !== 1) {
      throw new Error(
        "questions.json must contain questions from exactly ONE category at a time."
      );
    }

    const categoryName = categories[0];

    console.log(
      `\n📚 Category being imported: ${categoryName}`
    );

    // -----------------------------------------
    // 3. Basic Question Count
    // -----------------------------------------

    if (questions.length !== 270) {
      throw new Error(
        `Expected exactly 270 questions, but found ${questions.length}.`
      );
    }

    // -----------------------------------------
    // 4. Program Distribution
    // -----------------------------------------

    const programCounts = {};

    questions.forEach((item) => {
      if (!item.program) {
        throw new Error(
          "A question is missing program name."
        );
      }

      programCounts[item.program] =
        (programCounts[item.program] || 0) + 1;
    });

    console.log(
      "\n📊 Program distribution:"
    );

    Object.entries(programCounts).forEach(
      ([program, count]) => {
        console.log(
          `   ${program}: ${count}`
        );
      }
    );

    // -----------------------------------------
    // Must have exactly 9 programs
    // -----------------------------------------

    if (
      Object.keys(programCounts).length !== 9
    ) {
      throw new Error(
        `Expected exactly 9 programs, but found ${Object.keys(programCounts).length}.`
      );
    }

    // -----------------------------------------
    // Each program must have 30 questions
    // -----------------------------------------

    const invalidPrograms = Object.entries(
      programCounts
    ).filter(
      ([, count]) => count !== 30
    );

    if (invalidPrograms.length > 0) {
      throw new Error(
        "Every program must contain exactly 30 questions."
      );
    }

    console.log(
      "\n✅ All 9 programs contain exactly 30 questions."
    );

    // -----------------------------------------
    // 5. Find Category in MongoDB
    // -----------------------------------------

    const category = await Category.findOne({
      name: categoryName,
      isActive: true,
    });

    if (!category) {
      throw new Error(
        `Category not found in MongoDB: ${categoryName}`
      );
    }

    console.log(
      `✅ Category found: ${category.name}`
    );

    // -----------------------------------------
    // 6. Delete ONLY this category's questions
    // -----------------------------------------

    console.log(
      `\n🗑️ Deleting old questions from "${categoryName}" only...`
    );

    const deleteResult =
      await Question.deleteMany({
        category: category._id,
      });

    console.log(
      `✅ Deleted ${deleteResult.deletedCount} old questions from ${categoryName}.`
    );

    // -----------------------------------------
    // 7. Prepare Questions
    // -----------------------------------------

    const questionsToInsert = [];

    for (
      let i = 0;
      i < questions.length;
      i++
    ) {
      const item = questions[i];

      console.log(
        `\n🔎 Processing ${i + 1}/${questions.length}`
      );

      // -----------------------------------------
      // Validation
      // -----------------------------------------

      if (!item.category) {
        throw new Error(
          `Question ${i + 1}: category missing`
        );
      }

      if (!item.program) {
        throw new Error(
          `Question ${i + 1}: program missing`
        );
      }

      if (!item.question) {
        throw new Error(
          `Question ${i + 1}: question missing`
        );
      }

      if (
        !Array.isArray(item.options) ||
        item.options.length !== 4
      ) {
        throw new Error(
          `Question ${i + 1}: exactly 4 options required`
        );
      }

      if (
        typeof item.correctAnswer !==
          "number" ||
        item.correctAnswer < 0 ||
        item.correctAnswer > 3
      ) {
        throw new Error(
          `Question ${i + 1}: invalid correctAnswer`
        );
      }

      // -----------------------------------------
      // Find Program
      // -----------------------------------------

      const program =
        await Program.findOne({
          name: item.program.trim(),
          category: category._id,
          isActive: true,
          isDeleted: false,
        });

      if (!program) {
        throw new Error(
          `Program not found: ${item.program}`
        );
      }

      // -----------------------------------------
      // Original Options
      // -----------------------------------------

      const originalOptions =
        item.options.map((option) =>
          option.trim()
        );

      // -----------------------------------------
      // Original Correct Answer
      // -----------------------------------------

      const originalCorrectOption =
        originalOptions[item.correctAnswer];

      // -----------------------------------------
      // Shuffle Options
      // -----------------------------------------

      const shuffledOptions =
        shuffle(originalOptions);

      // -----------------------------------------
      // Find New Correct Answer Position
      // -----------------------------------------

      const newCorrectAnswer =
        shuffledOptions.indexOf(
          originalCorrectOption
        );

      if (newCorrectAnswer === -1) {
        throw new Error(
          `Question ${i + 1}: correct answer could not be mapped.`
        );
      }

      // -----------------------------------------
      // Prepare Question
      // -----------------------------------------

      questionsToInsert.push({
        question: item.question.trim(),

        options: shuffledOptions,

        correctAnswer: newCorrectAnswer,

        category: category._id,

        program: program._id,

        marks:
          typeof item.marks === "number"
            ? item.marks
            : 1,

        isActive:
          typeof item.isActive === "boolean"
            ? item.isActive
            : true,
      });

      console.log(
        `✅ ${item.program} → Answer position: ${newCorrectAnswer}`
      );
    }

    // -----------------------------------------
    // 8. Insert Questions
    // -----------------------------------------

    console.log(
      "\n💾 Inserting fresh questions..."
    );

    const insertedQuestions =
      await Question.insertMany(
        questionsToInsert
      );

    console.log(
      `\n🎉 Successfully inserted ${insertedQuestions.length} questions!`
    );

    // -----------------------------------------
    // 9. Verify Answer Distribution
    // -----------------------------------------

    const distribution = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
    };

    insertedQuestions.forEach(
      (question) => {
        distribution[
          question.correctAnswer
        ]++;
      }
    );

    console.log(
      "\n📊 Correct answer position distribution:"
    );

    console.log(
      `   Option 0: ${distribution[0]}`
    );

    console.log(
      `   Option 1: ${distribution[1]}`
    );

    console.log(
      `   Option 2: ${distribution[2]}`
    );

    console.log(
      `   Option 3: ${distribution[3]}`
    );

    // -----------------------------------------
    // 10. Final Verification
    // -----------------------------------------

    const finalCount =
      await Question.countDocuments({
        category: category._id,
      });

    console.log(
      `\n📦 Total questions in ${categoryName}: ${finalCount}`
    );

    if (finalCount !== 270) {
      throw new Error(
        `Verification failed. Expected 270 questions, found ${finalCount}.`
      );
    }

    console.log(
      "\n✅ Category imported successfully."
    );

    console.log(
      "✅ Existing questions from other categories were NOT deleted."
    );

    console.log(
      "✅ Options randomized and correctAnswer updated."
    );

  } catch (error) {
    console.error(
      "\n❌ Import failed:"
    );

    console.error(error.message);

    process.exitCode = 1;

  } finally {
    await mongoose.connection.close();

    console.log(
      "\n🔌 MongoDB connection closed."
    );
  }
};

importQuestions();