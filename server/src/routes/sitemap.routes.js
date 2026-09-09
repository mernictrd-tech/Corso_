const express = require("express");
const router = express.Router();

const Program = require("../models/program.model");

const baseUrl = "https://skilium.in";

const escapeXml = (value) => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

router.get("/sitemap.xml", async (req, res) => {
  try {
    const programs = await Program.find({
      slug: { $exists: true, $ne: "" },
    })
      .select("slug updatedAt")
      .lean();

    const staticUrls = [
      {
        url: "/",
        priority: "1.0",
      },
      {
        url: "/about",
        priority: "0.8",
      },
      {
        url: "/contact",
        priority: "0.7",
      },
      {
        url: "/courses",
        priority: "0.9",
      },
    ];

    const urls = [
      ...staticUrls.map((page) => ({
        loc: `${baseUrl}${page.url}`,
        priority: page.priority,
      })),

      ...programs.map((program) => ({
        loc: `${baseUrl}/course/${program.slug}`,
        lastmod: program.updatedAt
          ? new Date(program.updatedAt).toISOString()
          : null,
        priority: "0.8",
      })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (item) => `  <url>
    <loc>${escapeXml(item.loc)}</loc>
    ${item.lastmod ? `<lastmod>${item.lastmod}</lastmod>` : ""}
    <changefreq>weekly</changefreq>
    <priority>${item.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

    res.status(200).type("application/xml").send(xml);
  } catch (error) {
    console.error("Sitemap error:", error);

    res.status(500).send("Failed to generate sitemap");
  }
});

module.exports = router;
