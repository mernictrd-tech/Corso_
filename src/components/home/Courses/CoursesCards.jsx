import { useState } from "react";
import courses from "./data.js";

const categories = [
    "All",
    "Data & Analytics",
    "Programming",
    "Marketing",
];

const CoursesCards = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [search, setSearch] = useState("");

    const filteredCourses = courses.filter((course) => {
        const categoryMatch =
            activeCategory === "All" ||
            course.category === activeCategory;

        const searchMatch = course.title
            .toLowerCase()
            .includes(search.toLowerCase());

        return categoryMatch && searchMatch;
    });

    return (
        <section  id="courses" className="scroll-mt-24 bg-[#070D17] py-24">
            <div className="max-w-7xl mx-auto px-6">

                {/* Heading */}

                <div className="text-center">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent inline-block">
                        Search a Course to Assess
                    </h2>

                    <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-lg">
                        Pick a category, then choose a course. Pass the quiz to unlock
                        your certificate.
                    </p>
                </div>

                {/* Search */}

                <div className="flex justify-center mt-6">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full max-w-md bg-transparent border border-slate-700 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    />
                </div>

                {/* Category Buttons */}

                <div className="flex justify-center flex-wrap gap-6 mt-8">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-3 rounded-4xl border transition-all duration-300 ${activeCategory === category
                                    ? "bg-cyan-500 text-black border-cyan-500"
                                    : "border-slate-700 text-gray-300 hover:bg-cyan-500 hover:text-black"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Cards */}

                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mt-16">
                    {filteredCourses.map((course) => (
                        <div
                            key={course.id}
                            className="bg-[#111827] rounded-2xl overflow-hidden border border-slate-800 hover:-translate-y-2 transition duration-300"
                        >
                            <div className="relative">

                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="w-full h-56 object-cover"
                                />

                                <div className="absolute top-4 left-4 flex gap-2">

                                    <span className="bg-black/70 text-cyan-300 px-4 py-2 rounded-full text-sm font-semibold">
                                        Certificate included
                                    </span>

                                    <span className="bg-black/70 text-green-400 px-4 py-2 rounded-full text-sm font-semibold">
                                        Pass 50%+
                                    </span>

                                </div>
                            </div>

                            <div className="p-7">

                                <h3 className="text-2xl font-bold text-white">
                                    {course.title}
                                </h3>

                                <p className="text-gray-400 mt-4">
                                    {course.description}
                                </p>

                                <button className="mt-8 w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-lg transition">
                                    Start →
                                </button>

                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default CoursesCards;