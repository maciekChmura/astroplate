import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { resolveSite } from "./siteResolver.js";

const JSON_FOLDER = "./.json";
const selectedSite = resolveSite();
const BLOG_FOLDER = path.join(selectedSite.contentDir, "blog");
const PROMPTS_FOLDER = path.join(selectedSite.contentDir, "prompts");
const languages = JSON.parse(
  fs.readFileSync(path.join(selectedSite.configDir, "language.json"), "utf8"),
);
const localeByContentDir = new Map(
  languages.map(({ contentDir, languageCode }) => [contentDir, languageCode]),
);

// get data from markdown
const getData = (folder, group, contentFolder = folder) => {
  if (!fs.existsSync(folder)) {
    return [];
  }

  const getPath = fs.readdirSync(folder);
  const removeIndex = getPath.filter((item) => !item.startsWith("-"));

  const getPaths = removeIndex.flatMap((filename) => {
    const filepath = path.join(folder, filename);
    const stats = fs.statSync(filepath);
    const isFolder = stats.isDirectory();

    if (isFolder) {
      return getData(filepath, group, contentFolder);
    } else if (filename.endsWith(".md")) {
      const file = fs.readFileSync(filepath, "utf-8");
      const { data, content } = matter(file);
      const relativePath = path.relative(contentFolder, filepath);
      const [contentDir, ...slugParts] = relativePath.split(path.sep);
      const slug = path
        .join(...slugParts)
        .replace(/\.[^/.]+$/, "")
        .replace(/\\/g, "/");
      const lang = localeByContentDir.get(contentDir);
      const searchableContent =
        group === "prompts" && data.prompt
          ? [data.prompt, content].filter(Boolean).join("\n\n")
          : content;

      return {
        lang,
        group,
        slug: slug,
        frontmatter: data,
        content: searchableContent,
      };
    } else {
      return [];
    }
  });

  return getPaths.filter((page) => page?.lang && !page.frontmatter?.draft);
};

try {
  if (!fs.existsSync(BLOG_FOLDER)) {
    throw new Error(`Blog folder not found for site "${selectedSite.id}"`);
  }

  // create folder if it doesn't exist
  if (!fs.existsSync(JSON_FOLDER)) {
    fs.mkdirSync(JSON_FOLDER);
  }

  // create json files
  fs.writeFileSync(
    `${JSON_FOLDER}/posts.json`,
    JSON.stringify(getData(BLOG_FOLDER, "blog")),
  );

  fs.writeFileSync(
    `${JSON_FOLDER}/prompts.json`,
    JSON.stringify(getData(PROMPTS_FOLDER, "prompts")),
  );

  // merger json files for search
  const postsPath = new URL(`../${JSON_FOLDER}/posts.json`, import.meta.url);
  const promptsPath = new URL(
    `../${JSON_FOLDER}/prompts.json`,
    import.meta.url,
  );
  const posts = JSON.parse(fs.readFileSync(postsPath, "utf8"));
  const prompts = JSON.parse(fs.readFileSync(promptsPath, "utf8"));
  const search = [...posts, ...prompts];
  fs.writeFileSync(`${JSON_FOLDER}/search.json`, JSON.stringify(search));
} catch (err) {
  console.error(err);
}
