import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";

const CoursesCards = () => {
    const [programs, setPrograms] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchPrograms = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/program/list");

            console.log("Programs API response:", response.data);

            // IMPORTANT
            setPrograms(response.data.data || []);
        } catch (error) {
            console.error("Failed to load courses:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load courses."
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get("/category/list");

            console.log("Categories API response:", response.data);

            setCategories(response.data.data || []);
        } catch (error) {
            console.error("Failed to load categories:", error);
        }
    };

    useEffect(() => {
        fetchPrograms();
        fetchCategories();
    }, []);

    const filteredPrograms = programs.filter((program) => {
        const categoryMatch =
            activeCategory === "All" ||
            program.category?._id === activeCategory;

        const searchMatch =
            program.name
                ?.toLowerCase()
                .includes(search.toLowerCase());

        return categoryMatch && searchMatch;
    });

    return (
        <section
            id="courses"
            className="scroll-mt-24 bg-[#070D17] py-24"
        >
            <div className="mx-auto max-w-7xl px-6">

                {/* Heading */}
                <div className="text-center">
                    <h2 className="inline-block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-4xl font-bold text-transparent">
                        Search a Course to Assess
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
                        Pick a category, then choose a course. Pass the quiz
                        to unlock your certificate.
                    </p>
                </div>

                {/* Search */}
                <div className="mt-6 flex justify-center">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full max-w-md rounded-xl border border-slate-700 bg-transparent px-5 py-4 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                    />
                </div>

                {/* Categories */}
                <div className="mt-8 flex flex-wrap justify-center gap-6">

                    <button
                        onClick={() => setActiveCategory("All")}
                        className={`rounded-full border px-6 py-3 transition-all duration-300 ${
                            activeCategory === "All"
                                ? "border-cyan-500 bg-cyan-500 text-black"
                                : "border-slate-700 text-gray-300 hover:bg-cyan-500 hover:text-black"
                        }`}
                    >
                        All
                    </button>

                    {categories.map((category) => (
                        <button
                            key={category._id}
                            onClick={() =>
                                setActiveCategory(category._id)
                            }
                            className={`rounded-full border px-6 py-3 transition-all duration-300 ${
                                activeCategory === category._id
                                    ? "border-cyan-500 bg-cyan-500 text-black"
                                    : "border-slate-700 text-gray-300 hover:bg-cyan-500 hover:text-black"
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="mt-16 text-center text-gray-400">
                        Loading courses...
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="mt-16 text-center text-red-400">
                        {error}
                    </div>
                )}

                {/* No courses */}
                {!loading &&
                    !error &&
                    filteredPrograms.length === 0 && (
                        <div className="mt-16 text-center text-gray-400">
                            No courses found.
                        </div>
                    )}

                {/* Cards */}
                {!loading && !error && (
                    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

                        {filteredPrograms.map((program) => (
                            <div
                                key={program._id}
                                className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111827] transition duration-300 hover:-translate-y-2"
                            >

                                {/* Thumbnail */}
                                <div className="relative">

                                    {program.thumbnail ? (
                                        <img
                                            src={`${import.meta.env.VITE_API_BASE_URL_RESOURCE}${program.thumbnail}`}
                                            alt={program.name}
                                            className="h-56 w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-56 w-full items-center justify-center bg-slate-800 text-gray-500">
                                            No Image
                                        </div>
                                    )}

                                    {/* Badges */}
                                    <div className="absolute left-4 top-4 flex gap-2">

                                        <span className="rounded-full bg-black/70 px-4 py-2 text-sm font-semibold text-cyan-300">
                                            Certificate included
                                        </span>

                                        <span className="rounded-full bg-black/70 px-4 py-2 text-sm font-semibold text-green-400">
                                            Pass 50%+
                                        </span>

                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-7">

                                    <p className="mb-2 text-sm text-cyan-400">
                                        {program.category?.name}
                                    </p>

                                    <h3 className="text-2xl font-bold text-white">
                                        {program.name}
                                    </h3>

                                    <p className="mt-4 line-clamp-3 text-gray-400">
                                        {program.description ||
                                            "No description available."}
                                    </p>

                                    {/* Price */}
                                    <div className="mt-5 flex items-center gap-3">
                                        <span className="text-xl font-bold text-white">
                                            ₹{program.sellingPrice}
                                        </span>

                                        {program.originalPrice >
                                            program.sellingPrice && (
                                            <span className="text-sm text-gray-500 line-through">
                                                ₹{program.originalPrice}
                                            </span>
                                        )}
                                    </div>

                                    <Link
                                        to={`/course/${program.slug}`}
                                        className="mt-8 flex w-full items-center justify-center rounded-xl bg-cyan-500 py-4 text-lg font-semibold text-white transition hover:bg-cyan-400"
                                    >
                                        Start →
                                    </Link>

                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </section>
    );
};

export default CoursesCards;