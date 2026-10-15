import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackMetaEvent } from "../utils/metaPixel";

const TRACKED_COURSE_SLUGS = [
  "generative-ai-fundamentals",
//   "digital-marketing-fundamentals",
//   "aws-fundamentals",
];

const MetaCoursePageViewTracker = () => {
  const { pathname } = useLocation();
  const previousPathRef = useRef(null);

  useEffect(() => {
    // Prevent duplicate events for the same pathname
    if (previousPathRef.current === pathname) return;

    previousPathRef.current = pathname;

    // Match /course/:slug
    const match = pathname.match(/^\/course\/([^/]+)\/?$/);

    if (!match) return;

    const slug = decodeURIComponent(match[1]);

    // Track only the selected course pages
    if (!TRACKED_COURSE_SLUGS.includes(slug)) return;

    trackMetaEvent("PageView");
  }, [pathname]);

  return null;
};

export default MetaCoursePageViewTracker;