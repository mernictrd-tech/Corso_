import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";

const CoursesCards = () => {
    const [programs, setPrograms] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ================= FETCH PROGRAMS =================
    const fetchPrograms = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/program/list");

            console.log("Programs API response:", response.data);

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

    // ================= FETCH CATEGORIES =================
    const fetchCategories = async () => {
        try {
            const response = await api.get("/category/list");

            console.log("Categories API response:", response.data);

            const categoryData = response.data.data || [];

            setCategories(categoryData);

            // Select first category by default
            if (categoryData.length > 0) {
                setActiveCategory(categoryData[0]._id);
            }
        } catch (error) {
            console.error("Failed to load categories:", error);
        }
    };

    // ================= INITIAL LOAD =================
    useEffect(() => {
        fetchPrograms();
        fetchCategories();
    }, []);

    // ================= FILTER PROGRAMS =================
    const filteredPrograms = programs.filter((program) => {
        const categoryMatch =
            !activeCategory ||
            program.category?._id === activeCategory;

        const searchMatch =
            program.name
                ?.toLowerCase()
                .includes(search.toLowerCase());

        return categoryMatch && searchMatch;
    });

    // ================= ACTIVE CATEGORY NAME =================
    const activeCategoryName =
        categories.find(
            (category) => category._id === activeCategory
        )?.name || "Courses";

    return (
        <section
            id="courses"
            className="scroll-mt-24 bg-[#070D17] py-12 sm:py-16 lg:py-24"
        >
            <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-12 xl:px-16">

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                    {/* Heading */}
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                            Search a{" "}
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                Course to Assess
                            </span>
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base sm:leading-7 lg:text-lg">
                            Pick a category, then choose a course. Pass the
                            quiz to unlock your certificate.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="w-full lg:max-w-[480px]">
                        <input
                            type="text"
                            placeholder={
                                activeCategoryName &&
                                    activeCategoryName !== "Courses"
                                    ? `Search in ${activeCategoryName}...`
                                    : "Search courses..."
                            }
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="h-12 w-full rounded-2xl border border-slate-700 bg-[#080D19] px-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400 sm:h-14 sm:px-5 sm:text-base"
                        />
                    </div>
                </div>

                {/* ================================================= */}
                {/* CATEGORY / SHOWING / BADGES HEADER */}
                {/* ================================================= */}

                <div className="mt-6 grid grid-cols-1 gap-4 lg:mt-8 lg:grid-cols-[270px_minmax(0,1fr)_auto] lg:items-center">

                    {/* Categories Title */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400">
                            Categories
                        </h3>
                    </div>

                    {/* Showing */}
                    <div>
                        <p className="text-sm text-gray-400 sm:text-base">
                            Showing:{" "}
                            <span className="font-semibold text-white">
                                {activeCategoryName}
                            </span>
                        </p>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 lg:justify-end">
                        <span className="rounded-full border border-slate-700 bg-[#171D2B] px-3 py-1.5 text-xs font-medium text-gray-300 sm:px-4 sm:py-2 sm:text-sm">
                            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-emerald-400 sm:mr-2 sm:h-2.5 sm:w-2.5" />
                            Certificate included
                        </span>

                        <span className="rounded-full border border-slate-700 bg-[#171D2B] px-3 py-1.5 text-xs font-medium text-gray-300 sm:px-4 sm:py-2 sm:text-sm">
                            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-indigo-400 sm:mr-2 sm:h-2.5 sm:w-2.5" />
                            Pass 70%
                        </span>
                    </div>
                </div>

                {/* ================================================= */}
                {/* MAIN CONTENT */}
                {/* ================================================= */}

                <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">

                    {/* ================================================= */}
                    {/* CATEGORY SIDEBAR */}
                    {/* ================================================= */}

                    <aside className="w-full shrink-0 lg:w-[270px]">

                        {/* Desktop Categories */}
                        <div
                            className="hidden max-h-[960px]  pr-2 lg:block"
                            style={{
                                scrollbarWidth: "thin",
                                scrollbarColor:
                                    "#64748b transparent",
                            }}
                        >
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <button
                                        key={category._id}
                                        onClick={() =>
                                            setActiveCategory(
                                                category._id
                                            )
                                        }
                                        className={`w-full rounded-2xl border px-4 py-4.5 text-left text-base font-semibold transition-all duration-200 ${activeCategory ===
                                            category._id
                                            ? "border-white bg-white text-[#111827]"
                                            : "border-slate-700 bg-[#1A2030] text-gray-300 hover:border-slate-500 hover:bg-[#222938]"
                                            }`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Categories */}
                        <div
                            className="flex gap-2 overflow-x-auto pb-2 lg:hidden"
                            style={{
                                scrollbarWidth: "thin",
                                scrollbarColor:
                                    "#64748b transparent",
                            }}
                        >
                            {categories.map((category) => (
                                <button
                                    key={category._id}
                                    onClick={() =>
                                        setActiveCategory(
                                            category._id
                                        )
                                    }
                                    className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-semibold transition-all duration-200 sm:px-5 sm:py-3 sm:text-sm ${activeCategory ===
                                        category._id
                                        ? "border-white bg-white text-[#111827]"
                                        : "border-slate-700 bg-[#1A2030] text-gray-300"
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* ================================================= */}
                    {/* COURSES */}
                    {/* ================================================= */}

                    <div className="min-w-0 flex-1">

                        {/* Loading */}
                        {loading && (
                            <div className="flex min-h-[300px] items-center justify-center text-gray-400">
                                Loading courses...
                            </div>
                        )}

                        {/* Error */}
                        {!loading && error && (
                            <div className="flex min-h-[300px] items-center justify-center text-center text-red-400">
                                {error}
                            </div>
                        )}

                        {/* No Courses */}
                        {!loading &&
                            !error &&
                            filteredPrograms.length === 0 && (
                                <div className="flex min-h-[300px] items-center justify-center text-center text-gray-400">
                                    No courses found.
                                </div>
                            )}

                        {/* ================================================= */}
                        {/* COURSE CARDS */}
                        {/* ================================================= */}

                        {!loading &&
                            !error &&
                            filteredPrograms.length > 0 && (
                                <div className="max-h-[1040px] overflow-y-auto pr-2 pt-1 pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700">

                                    <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-5 xl:grid-cols-3">

                                        {filteredPrograms.map((program) => (
                                            <div
                                                key={program._id}
                                                className="group flex min-w-0 h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#080D1B] transition-all duration-300 hover:-translate-y-1 hover:border-slate-600 sm:rounded-[28px]"
                                            >

                                                {/* ================= IMAGE ================= */}

                                                <div className="relative aspect-[16/9] shrink-0 overflow-hidden bg-black">

                                                    {program.thumbnail ? (
                                                        <img
                                                            src={`${import.meta.env.VITE_API_BASE_URL_RESOURCE}${program.thumbnail}`}
                                                            alt={program.name}
                                                            className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.02]"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-slate-900 text-xs text-gray-500 sm:text-sm">
                                                            No Image
                                                        </div>
                                                    )}

                                                </div>

                                                {/* ================= CONTENT ================= */}

                                                <div className="flex flex-1 flex-col p-3 sm:p-5">

                                                    {/* Category */}
                                                    <p className="mb-1 min-h-[16px] text-[10px] font-medium text-cyan-400 sm:mb-1.5 sm:min-h-[21px] sm:text-sm">
                                                        {program.category?.name}
                                                    </p>

                                                    {/* Course Name */}
                                                    <h3 className="min-h-[40px] text-sm font-bold leading-5 text-white sm:min-h-[58px] sm:text-[20px] sm:leading-normal">
                                                        {program.name}
                                                    </h3>

                                                    {/* Description */}
                                                    <p className="mt-0.5 text-[10px] leading-4 text-gray-400 sm:mt-1 sm:text-base sm:leading-5">
                                                        {program.description ||
                                                            "No description available."}
                                                    </p>

                                                    {/* Price */}
                                                    <div className="mt-2 mb-5 flex min-w-0 flex-wrap items-center gap-1.5 sm:mt-3 sm:mb-6 sm:gap-3">

                                                        <span className="text-sm font-bold text-white sm:text-xl">
                                                            ₹{program.sellingPrice}
                                                        </span>

                                                        {program.originalPrice >
                                                            program.sellingPrice && (
                                                                <span className="text-[9px] text-gray-500 line-through sm:text-sm">
                                                                    ₹{program.originalPrice}
                                                                </span>
                                                            )}

                                                    </div>

                                                    {/* Start Button */}
                                                    <Link
                                                        to={`/course/${program.slug}`}
                                                        className="mt-auto flex w-full items-center justify-center rounded-lg bg-cyan-500 px-2 py-2 text-[11px] font-semibold text-white transition-all duration-200 hover:bg-cyan-400 sm:rounded-xl sm:py-3.5 sm:text-lg"
                                                    >
                                                        Start →
                                                    </Link>

                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            )}

                    </div>
                </div>
            </div>
        </section>
    );
};

export default CoursesCards;