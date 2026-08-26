import { useState, useRef, useEffect, useMemo } from "react";
import { Search, X, Loader2, BookOpen, ArrowRight, Sparkles, Award } from "lucide-react";

/**
 * Highlights matching letters of query inside text
 */
const HighlightMatch = ({ text = "", query = "" }) => {
  if (!query.trim() || !text) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = String(text).split(regex);

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span
            key={i}
            className="text-cyan-400 font-bold underline decoration-cyan-400/40 decoration-1 underline-offset-2"
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

/**
 * Reusable Search Component
 */
const SearchComponent = ({
  variant = "expandable", // 'expandable' | 'center-out' | 'inline'
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
  width, // e.g. "w-72", "w-96", "w-[450px]", "max-w-lg"
  isOpen: controlledIsOpen,
  onClose,
}) => {
  const [internalQuery, setInternalQuery] = useState("");
  const isControlled = controlledValue !== undefined;
  const query = isControlled ? controlledValue : internalQuery;

  const isControlledOpen = controlledIsOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(variant === "inline");
  const isOpen = isControlledOpen ? controlledIsOpen : internalOpen;

  const setIsOpen = (nextState) => {
    if (typeof nextState === "function") {
      setInternalOpen((prev) => {
        const next = nextState(prev);
        if (!next) onClose?.();
        return next;
      });
    } else {
      if (!isControlledOpen) setInternalOpen(nextState);
      if (!nextState) onClose?.();
    }
  };

  const [cachedData, setCachedData] = useState([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const isLoading = externalLoading || internalLoading;

  // Sizes map
  const sizeStyles = {
    sm: {
      height: "h-9",
      closedWidth: "w-9",
      btnSize: "h-9 w-9",
      fontSize: "text-xs",
      icon: 15,
      openWidth: "w-56 sm:w-64",
    },
    md: {
      height: "h-10",
      closedWidth: "w-10",
      btnSize: "h-10 w-10",
      fontSize: "text-sm",
      icon: 18,
      openWidth: "w-64 sm:w-72 md:w-80",
    },
    lg: {
      height: "h-12",
      closedWidth: "w-12",
      btnSize: "h-12 w-12",
      fontSize: "text-base",
      icon: 20,
      openWidth: "w-72 sm:w-80 md:w-96",
    },
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  // Fetch data once when opened (if fetchResults is provided)
  useEffect(() => {
    if (isOpen && fetchResults && cachedData.length === 0) {
      setInternalLoading(true);
      fetchResults()
        .then((res) => {
          setCachedData(Array.isArray(res) ? res : []);
        })
        .catch(() => {
          setCachedData([]);
        })
        .finally(() => {
          setInternalLoading(false);
        });
    }
  }, [isOpen, fetchResults, cachedData.length]);

  // Handle focus when opened or autoFocus
  useEffect(() => {
    if (isOpen || autoFocus) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 120);
      return () => clearTimeout(timer);
    } else {
      if (!isControlled) setInternalQuery("");
      setSelectedIndex(-1);
    }
  }, [isOpen, autoFocus, isControlled]);

  // Click outside and Esc listener
  useEffect(() => {
    if (!isOpen && query.trim().length === 0) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (variant !== "inline") {
          setIsOpen(false);
        }
        setSelectedIndex(-1);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (variant !== "inline") {
          setIsOpen(false);
        }
        setSelectedIndex(-1);
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, variant, query, onClose]);

  // Filter items based on query
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const sourceList = fetchResults ? cachedData : data;

    if (filterFn) {
      return sourceList.filter((item) => filterFn(item, query));
    }

    const q = query.toLowerCase();
    return sourceList.filter((item) => {
      if (typeof item === "string") {
        return item.toLowerCase().includes(q);
      }
      const label = (item.name || item.title || item.label || item.value || "").toLowerCase();
      const cat = (item.category?.name || item.category || "").toLowerCase();
      const desc = (item.description || "").toLowerCase();
      return label.includes(q) || cat.includes(q) || desc.includes(q);
    });
  }, [query, data, cachedData, filterFn, fetchResults]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (!isControlled) setInternalQuery(val);
    onChange?.(val);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    if (!isControlled) setInternalQuery("");
    onChange?.("");
    inputRef.current?.focus();
  };

  const handleSelect = (item) => {
    if (variant !== "inline") setIsOpen(false);
    onSelect?.(item);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      } else if (results.length > 0) {
        handleSelect(results[0]);
      } else {
        onSearch?.(query);
      }
    }
  };

  // Variant styles
  const getContainerStyles = () => {
    const customOpenWidth = width || currentSize.openWidth;

    if (variant === "inline") {
      return `${width || "w-full"} ${currentSize.height} px-3 border border-cyan-400/30 bg-[#131b2e] rounded-full shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/20`;
    }

    if (variant === "center-out") {
      return `${width || "w-full"} ${currentSize.height} origin-center transition-all duration-300 ease-out ${isOpen
        ? "border border-cyan-400/35 bg-gradient-to-r from-[#0d1424] via-[#111d33] to-[#0d1424] rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.5),0_0_20px_rgba(6,182,212,0.18)] ring-1 ring-cyan-400/20 scale-100 opacity-100 px-3"
        : "w-10 max-w-[40px] border-transparent bg-transparent scale-x-0 opacity-0 px-0"
        }`;
    }

    // Default 'expandable'
    return `${currentSize.height} transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${isOpen
      ? `${customOpenWidth} border border-cyan-400/50 bg-[#0f172a]/95 shadow-[0_0_25px_rgba(6,182,212,0.22)] ring-1 ring-cyan-400/30 rounded-full backdrop-blur-xl pl-0 pr-3`
      : `${currentSize.closedWidth} border border-transparent bg-transparent rounded-full p-0`
      }`;
  };

  return (
    <div ref={containerRef} className={`relative flex items-center ${className}`}>
      {/* Search Input Pill */}
      <div
        className={`flex items-center overflow-hidden ${getContainerStyles()}`}
      >
        {/* Left Search Icon */}
        <button
          type="button"
          aria-label="Search"
          onClick={() => {
            if (variant === "inline") {
              onSearch?.(query);
            } else if (!isOpen) {
              setIsOpen(true);
            } else if (query.trim() && results.length > 0) {
              handleSelect(results[0]);
            } else {
              setIsOpen(false);
            }
          }}
          className={`shrink-0 ${currentSize.btnSize} flex items-center justify-center cursor-pointer transition-colors duration-200 ${isOpen
            ? "text-cyan-400 hover:text-cyan-300"
            : "text-gray-300 hover:text-cyan-400"
            }`}
        >
          <Search size={currentSize.icon} className="transition-transform duration-200" />
        </button>

        {/* Input Field with Progressive Reveal */}
        <div
          className={`flex flex-1 items-center min-w-0 overflow-hidden transition-all duration-200 ${isOpen ? "opacity-100 ml-1" : "w-0 opacity-0 pointer-events-none ml-0"
            }`}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={`w-full min-w-0 bg-transparent ${currentSize.fontSize} font-medium text-white placeholder:text-gray-400/70 outline-none select-none ${inputClassName}`}
          />

          {/* Loading Indicator */}
          {isLoading && (
            <Loader2
              size={15}
              className="mr-1.5 shrink-0 animate-spin text-cyan-400"
            />
          )}

          {/* Clear button */}
          {query.trim().length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full p-1 text-gray-400 transition hover:bg-white/10 hover:text-white shrink-0 ml-1"
              title="Clear"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Live Results Dropdown */}
      {showDropdown && isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 sm:left-auto sm:right-0 top-[calc(100%+8px)] z-50 w-full sm:w-auto sm:min-w-[360px] max-w-lg overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#0b1220]/98 p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-2xl transition-all duration-200 origin-top animate-dropdown-reveal">
          {/* Header */}
          <div className="flex items-center justify-between px-2.5 py-1 mb-1.5 border-b border-white/5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles size={12} className="text-cyan-400" />
              {results.length > 0
                ? `${dropdownTitle} (${results.length})`
                : "No Matches"}
            </span>
            <span className="text-[10px] text-gray-400 font-mono hidden sm:inline">
              <kbd className="bg-white/5 px-1 rounded">↑</kbd> <kbd className="bg-white/5 px-1 rounded">↓</kbd> to navigate
            </span>
          </div>

          <div className="max-h-68 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-cyan-500/20 pr-0.5">
            {results.length > 0 ? (
              results.map((item, idx) => {
                const isSelected = selectedIndex === idx;

                if (renderItem) {
                  return (
                    <div
                      key={item._id || item.id || item.slug || idx}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className="cursor-pointer"
                    >
                      {renderItem(item, idx, isSelected)}
                    </div>
                  );
                }

                const title =
                  typeof item === "string"
                    ? item
                    : item.name || item.title || item.label;
                const category =
                  typeof item === "object"
                    ? item.category?.name || item.category
                    : null;
                const price =
                  typeof item === "object" && item.sellingPrice
                    ? `₹${item.sellingPrice}`
                    : null;

                return (
                  <button
                    key={item._id || item.id || item.slug || idx}
                    type="button"
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`group flex w-full items-center justify-between gap-3 rounded-xl p-2.5 text-left transition-all ${isSelected
                      ? "bg-gradient-to-r from-cyan-500/25 via-blue-500/15 to-transparent border border-cyan-400/40 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                      : "border border-white/5 bg-[#131b2e]/60 text-gray-200 hover:border-cyan-400/40 hover:bg-cyan-500/10"
                      }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:border-cyan-400/40 group-hover:bg-cyan-500/20 group-hover:scale-105 transition-all">
                        <BookOpen size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white group-hover:text-cyan-300 transition">
                          <HighlightMatch text={title} query={query} />
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {category && (
                            <span className="inline-block rounded bg-cyan-500/10 border border-cyan-400/20 px-1.5 py-0.2 text-[10px] font-medium text-cyan-300">
                              {category}
                            </span>
                          )}
                          {price && (
                            <span className="text-[11px] font-semibold text-emerald-400">
                              {price}
                            </span>
                          )}
                          <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                            <Award size={10} className="text-cyan-400/80" />
                            Certificate
                          </span>
                        </div>
                      </div>
                    </div>

                    <ArrowRight
                      size={15}
                      className="shrink-0 text-cyan-400/70 transition-transform duration-200 group-hover:text-cyan-300 group-hover:translate-x-1"
                    />
                  </button>
                );
              })
            ) : (
              <div className="p-5 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
                  <Search size={18} />
                </div>
                <p className="text-sm font-medium text-gray-300">
                  No courses matching "
                  <span className="text-cyan-400 font-semibold">{query}</span>"
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Try searching for keywords like <span className="text-gray-300 font-mono">React</span>, <span className="text-gray-300 font-mono">Python</span>, or <span className="text-gray-300 font-mono">Design</span>.
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
