import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import { DateTime } from "luxon";
import markdownItFootnote from "markdown-it-footnote";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/deco");
  eleventyConfig.addShortcode("excerpt", (post) => extractExcerpt(post));
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.amendLibrary("md", (mdLib) => mdLib.use(markdownItFootnote));
  eleventyConfig.addFilter("date", (value, format = "yyyy-MM-dd") => {
    const date = DateTime.isDateTime(value)
      ? value
      : DateTime.fromJSDate(new Date(value));
    return date.toFormat(format);
  });
  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "src/content",
      output: "_site",
      layouts: "../layouts",
      includes: "../layouts",
    },
  };
}

// Post excerpt function
const extractExcerpt = (post) => {
  if (post?.data?.excerpt) {
    return post.data.excerpt
      .trim()
      .split(/\n\s*\n/)
      .map((para) => `<p>${para.replace(/\n/g, "<br>")}</p>`)
      .join("");
  }

  const content = post?.templateContent || "";
  const markerIndex = content.indexOf("<!-- more -->");
  const preview = markerIndex >= 0 ? content.slice(0, markerIndex) : content;

  const withoutHeadings = preview.replace(
    /<h[1-6]\b[^>]*>[\s\S]*?<\/h[1-6]>/gi,
    "",
  );

  return (
    "<p>" +
    withoutHeadings
      .replace(/<[^>]*>/g, "")
      .trim()
      .slice(0, 300) +
    "...</p>"
  );
};
