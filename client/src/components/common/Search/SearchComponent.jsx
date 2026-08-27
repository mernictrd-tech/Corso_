import { useState, useRef, useEffect, useMemo } from "react";

import {
  Search,
  X,
  Loader2,
  BookOpen,
  ArrowRight,
  Sparkles,
  Award,
} from "lucide-react";

/* =========================================================
   Highlight matching text
========================================================= */

const HighlightMatch = ({ text = "", query = "" }) => {
  if (!query.trim() || !text) {
    return <>{text}</>;
  }

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");

  const parts = String(text).split(regex);

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span
            key={index}
            className="font-bold text-cyan-400 underline decoration-cyan-400/40 decoration-1 underline-offset-2"
          >
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

/* =========================================================
   Search Component
========================================================= */

const SearchComponent = ({
  variant = "expandable",
  placeholder = "Search courses, skills, or topics...",
  value: controlledValue,
  onChange,
  onSearch,
  data = [],
  filterFn,
  fetchResults,
  onSelect,
  renderItem,
  loading: externalLoading = false,
  autoFocus = false,
  showDropdown = true,
  dropdownTitle = "Courses Found",
  className = "",
  inputClassName = "",
  size = "md",
  width,
  isOpen: controlledIsOpen,
  onClose,
}) => {
  const [internalQuery, setInternalQuery] = useState("");
  const [internalOpen, setInternalOpen] = useState(
    variant === "inline"
  );
  const [cachedData, setCachedData] = useState([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const isControlled =
    controlledValue !== undefined;

  const query = isControlled
    ? controlledValue
    : internalQuery;

  const isControlledOpen =
    controlledIsOpen !== undefined;

  const isOpen = isControlledOpen
    ? controlledIsOpen
    : internalOpen;

  const isLoading =
    externalLoading || internalLoading;

  /* =========================================================
     Open / Close
  ========================================================= */

  const setIsOpen = (nextState) => {
    if (typeof nextState === "function") {
      setInternalOpen((prev) => {
        const next = nextState(prev);

        if (!next) {
          onClose?.();
        }

        return next;
      });

      return;
    }

    if (!isControlledOpen) {
      setInternalOpen(nextState);
    }

    if (!nextState) {
      onClose?.();
    }
  };

  /* =========================================================
     Sizes
  ========================================================= */

  const sizeStyles = {
    sm: {
      height: "h-9",
      closedWidth: "w-9",
      button: "h-9 w-9",
      font: "text-xs",
      icon: 15,
    },

    md: {
      height: "h-10",
      closedWidth: "w-10",
      button: "h-10 w-10",
      font: "text-sm",
      icon: 18,
    },

    lg: {
      height: "h-12",
      closedWidth: "w-12",
      button: "h-12 w-12",
      font: "text-base",
      icon: 20,
    },
  };

  const currentSize =
    sizeStyles[size] || sizeStyles.md;

  /* =========================================================
     Fetch Programs
  ========================================================= */

  useEffect(() => {
    if (
      isOpen &&
      fetchResults &&
      cachedData.length === 0
    ) {
      setInternalLoading(true);

      fetchResults()
        .then((res) => {
          setCachedData(
            Array.isArray(res) ? res : []
          );
        })
        .catch(() => {
          setCachedData([]);
        })
        .finally(() => {
          setInternalLoading(false);
        });
    }
  }, [
    isOpen,
    fetchResults,
    cachedData.length,
  ]);

  /* =========================================================
     Focus
  ========================================================= */

  useEffect(() => {
    if (isOpen || autoFocus) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 120);

      return () => clearTimeout(timer);
    }

    if (!isControlled) {
      setInternalQuery("");
    }

    setSelectedIndex(-1);
  }, [
    isOpen,
    autoFocus,
    isControlled,
  ]);

  /* =========================================================
     Outside Click + Escape
  ========================================================= */

  useEffect(() => {
    if (
      !isOpen &&
      !query.trim()
    ) {
      return;
    }

    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target
        )
      ) {
        if (variant !== "inline") {
          setIsOpen(false);
        }

        setSelectedIndex(-1);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (variant !== "inline") {
          setIsOpen(false);
        }

        setSelectedIndex(-1);
        onClose?.();
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    document.addEventListener(
      "touchstart",
      handleClickOutside
    );

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

      document.removeEventListener(
        "touchstart",
        handleClickOutside
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    isOpen,
    variant,
    query,
    onClose,
  ]);

  /* =========================================================
     Filter Results
  ========================================================= */

  const results = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const sourceList = fetchResults
      ? cachedData
      : data;

    if (filterFn) {
      return sourceList.filter((item) =>
        filterFn(item, query)
      );
    }

    const q = query.toLowerCase();

    return sourceList.filter((item) => {
      if (typeof item === "string") {
        return item
          .toLowerCase()
          .includes(q);
      }

      const label = (
        item.name ||
        item.title ||
        item.label ||
        item.value ||
        ""
      ).toLowerCase();

      const category = (
        item.category?.name ||
        item.category ||
        ""
      ).toLowerCase();

      const description = (
        item.description || ""
      ).toLowerCase();

      return (
        label.includes(q) ||
        category.includes(q) ||
        description.includes(q)
      );
    });
  }, [
    query,
    data,
    cachedData,
    filterFn,
    fetchResults,
  ]);

  /* =========================================================
     Input Change
  ========================================================= */

  const handleInputChange = (event) => {
    const value = event.target.value;

    if (!isControlled) {
      setInternalQuery(value);
    }

    onChange?.(value);
    setSelectedIndex(-1);
  };

  /* =========================================================
     Clear
  ========================================================= */

  const handleClear = () => {
    if (!isControlled) {
      setInternalQuery("");
    }

    onChange?.("");

    inputRef.current?.focus();
  };

  /* =========================================================
     Select
  ========================================================= */

  const handleSelect = (item) => {
    if (variant !== "inline") {
      setIsOpen(false);
    }

    onSelect?.(item);
  };

  /* =========================================================
     Keyboard
  ========================================================= */

  const handleInputKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      setSelectedIndex((previous) =>
        previous < results.length - 1
          ? previous + 1
          : 0
      );

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setSelectedIndex((previous) =>
        previous > 0
          ? previous - 1
          : results.length - 1
      );

      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (
        selectedIndex >= 0 &&
        results[selectedIndex]
      ) {
        handleSelect(
          results[selectedIndex]
        );
      } else if (results.length > 0) {
        handleSelect(results[0]);
      } else {
        onSearch?.(query);
      }
    }
  };

  /* =========================================================
     Search Container
  ========================================================= */

  const getContainerStyles = () => {
    /* ---------- MOBILE / INLINE ---------- */

    if (variant === "inline") {
      return `
        w-full
        max-w-full
        ${currentSize.height}
        px-3
        border
        border-cyan-400/30
        bg-[#131b2e]
        rounded-full
        shadow-[0_0_20px_rgba(6,182,212,0.15)]
        ring-1
        ring-cyan-400/20
      `;
    }

    /* ---------- CENTER OUT ---------- */

    if (variant === "center-out") {
      return `
        ${width || "w-full"}
        ${currentSize.height}
        origin-center
        transition-all
        duration-300
        ease-out
        ${
          isOpen
            ? `
              border
              border-cyan-400/35
              bg-gradient-to-r
              from-[#0d1424]
              via-[#111d33]
              to-[#0d1424]
              rounded-2xl
              shadow-[0_4px_25px_rgba(0,0,0,0.5),0_0_20px_rgba(6,182,212,0.18)]
              ring-1
              ring-cyan-400/20
              scale-100
              opacity-100
              px-3
            `
            : `
              w-10
              max-w-[40px]
              border-transparent
              bg-transparent
              scale-x-0
              opacity-0
              px-0
            `
        }
      `;
    }

    /* ---------- DESKTOP EXPANDABLE ---------- */

    return `
      ${currentSize.height}
      shrink-0
      transition-[width]
      duration-300
      ease-[cubic-bezier(0.25,1,0.5,1)]
      ${
        isOpen
          ? `
            ${width || "w-52"}
            border
            border-cyan-400/50
            bg-[#0f172a]/95
            shadow-[0_0_25px_rgba(6,182,212,0.22)]
            ring-1
            ring-cyan-400/30
            rounded-full
            backdrop-blur-xl
            pl-0
            pr-3
          `
          : `
            ${currentSize.closedWidth}
            border-transparent
            bg-transparent
            rounded-full
            p-0
          `
      }
    `;
  };

  /* =========================================================
     JSX
  ========================================================= */

  return (
    <div
      ref={containerRef}
      className={`
        relative
        flex
        h-10
        shrink-0
        items-center
        ${className}
      `}
    >
      {/* SEARCH PILL */}

      <div
        className={`
          flex
          items-center
          overflow-visible
          ${getContainerStyles()}
        `}
      >
        {/* SEARCH ICON */}

        <button
          type="button"
          aria-label="Search"
          onClick={() => {
            if (variant === "inline") {
              onSearch?.(query);
              return;
            }

            if (!isOpen) {
              setIsOpen(true);
              return;
            }

            if (
              query.trim() &&
              results.length > 0
            ) {
              handleSelect(results[0]);
              return;
            }

            setIsOpen(false);
          }}
          className={`
            shrink-0
            ${currentSize.button}
            flex
            items-center
            justify-center
            cursor-pointer
            transition-colors
            duration-200
            ${
              isOpen
                ? "text-cyan-400 hover:text-cyan-300"
                : "text-gray-300 hover:text-cyan-400"
            }
          `}
        >
          <Search size={currentSize.icon} />
        </button>

        {/* INPUT */}

        <div
          className={`
            flex
            flex-1
            min-w-0
            items-center
            overflow-hidden
            transition-all
            duration-200
            ${
              isOpen
                ? "ml-1 w-full opacity-100"
                : "ml-0 w-0 opacity-0 pointer-events-none"
            }
          `}
        >
          <input
            ref={inputRef}
            type="text"
            value={query}
            placeholder={placeholder}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className={`
              w-full
              min-w-0
              bg-transparent
              ${currentSize.font}
              font-medium
              text-white
              placeholder:text-gray-400/70
              outline-none
              ${inputClassName}
            `}
          />

          {/* LOADER */}

          {isLoading && (
            <Loader2
              size={15}
              className="mr-1.5 shrink-0 animate-spin text-cyan-400"
            />
          )}

          {/* CLEAR */}

          {query.trim().length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="ml-1 shrink-0 rounded-full p-1 text-gray-400 transition hover:bg-white/10 hover:text-white"
              title="Clear"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* =====================================================
          DROPDOWN
      ===================================================== */}

      {showDropdown &&
        isOpen &&
        query.trim().length > 0 && (
          <div
            className="
              absolute
              left-0
              top-[calc(100%+8px)]
              z-[100]

              w-[360px]
              max-w-[calc(100vw-32px)]

              overflow-hidden
              rounded-2xl
              border
              border-cyan-500/30
              bg-[#0b1220]/98
              p-2.5

              shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.15)]

              backdrop-blur-2xl
              transition-all
              duration-200
              origin-top
              animate-dropdown-reveal
            "
          >
            {/* HEADER */}

            <div className="mb-1.5 flex items-center justify-between border-b border-white/5 px-2.5 py-1">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
                <Sparkles size={12} />

                {results.length > 0
                  ? `${dropdownTitle} (${results.length})`
                  : "No Matches"}
              </span>

              <span className="hidden font-mono text-[10px] text-gray-400 sm:inline">
                <kbd className="rounded bg-white/5 px-1">
                  ↑
                </kbd>{" "}
                <kbd className="rounded bg-white/5 px-1">
                  ↓
                </kbd>{" "}
                to navigate
              </span>
            </div>

            {/* RESULTS */}

            <div className="max-h-68 space-y-1.5 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-cyan-500/20">
              {results.length > 0 ? (
                results.map((item, index) => {
                  const isSelected =
                    selectedIndex === index;

                  /* CUSTOM ITEM */

                  if (renderItem) {
                    return (
                      <div
                        key={
                          item._id ||
                          item.id ||
                          item.slug ||
                          index
                        }
                        onClick={() =>
                          handleSelect(item)
                        }
                        onMouseEnter={() =>
                          setSelectedIndex(index)
                        }
                        className="cursor-pointer"
                      >
                        {renderItem(
                          item,
                          index,
                          isSelected
                        )}
                      </div>
                    );
                  }

                  /* DEFAULT ITEM */

                  const title =
                    typeof item === "string"
                      ? item
                      : item.name ||
                        item.title ||
                        item.label;

                  const category =
                    typeof item === "object"
                      ? item.category?.name ||
                        item.category
                      : null;

                  const price =
                    typeof item === "object" &&
                    item.sellingPrice
                      ? `₹${item.sellingPrice}`
                      : null;

                  return (
                    <button
                      key={
                        item._id ||
                        item.id ||
                        item.slug ||
                        index
                      }
                      type="button"
                      onClick={() =>
                        handleSelect(item)
                      }
                      onMouseEnter={() =>
                        setSelectedIndex(index)
                      }
                      className={`
                        group
                        flex
                        w-full
                        items-center
                        justify-between
                        gap-3
                        rounded-xl
                        p-2.5
                        text-left
                        transition-all

                        ${
                          isSelected
                            ? `
                              border
                              border-cyan-400/40
                              bg-gradient-to-r
                              from-cyan-500/25
                              via-blue-500/15
                              to-transparent
                              text-white
                              shadow-[0_0_15px_rgba(6,182,212,0.15)]
                            `
                            : `
                              border
                              border-white/5
                              bg-[#131b2e]/60
                              text-gray-200
                              hover:border-cyan-400/40
                              hover:bg-cyan-500/10
                            `
                        }
                      `}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {/* ICON */}

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 transition-all group-hover:scale-105 group-hover:border-cyan-400/40 group-hover:bg-cyan-500/20">
                          <BookOpen size={16} />
                        </div>

                        {/* INFO */}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white transition group-hover:text-cyan-300">
                            <HighlightMatch
                              text={title}
                              query={query}
                            />
                          </p>

                          <div className="mt-0.5 flex items-center gap-2">
                            {category && (
                              <span className="inline-block rounded border border-cyan-400/20 bg-cyan-500/10 px-1.5 py-0.2 text-[10px] font-medium text-cyan-300">
                                {category}
                              </span>
                            )}

                            {price && (
                              <span className="text-[11px] font-semibold text-emerald-400">
                                {price}
                              </span>
                            )}

                            <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                              <Award
                                size={10}
                                className="text-cyan-400/80"
                              />
                              Certificate
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* ARROW */}

                      <ArrowRight
                        size={15}
                        className="shrink-0 text-cyan-400/70 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-cyan-300"
                      />
                    </button>
                  );
                })
              ) : (
                /* NO RESULTS */

                <div className="p-5 text-center">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                    <Search size={18} />
                  </div>

                  <p className="text-sm font-medium text-gray-300">
                    No courses matching{" "}
                    <span className="font-semibold text-cyan-400">
                      "{query}"
                    </span>
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Try searching for keywords like{" "}
                    <span className="font-mono text-gray-300">
                      React
                    </span>
                    ,{" "}
                    <span className="font-mono text-gray-300">
                      Python
                    </span>
                    , or{" "}
                    <span className="font-mono text-gray-300">
                      Design
                    </span>
                    .
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default SearchComponent;