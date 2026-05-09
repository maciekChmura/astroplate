import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { resolveSite } from "./siteResolver.js";

const JSON_FOLDER = "./.json";
const selectedSite = resolveSite();
const BLOG_FOLDER = path.join(selectedSite.contentDir, "blog");
const PROMPTS_FOLDER = path.join(selectedSite.contentDir, "prompts");
const USE_CASES_FOLDER = path.join(selectedSite.contentDir, "use-cases");
const languages = JSON.parse(
  fs.readFileSync(path.join(selectedSite.configDir, "language.json"), "utf8"),
);
const localeByContentDir = new Map(
  languages.map(({ contentDir, languageCode }) => [contentDir, languageCode]),
);

function getSearchableContent(data, content, group) {
  if (group === "prompts" && data.prompt) {
    return [data.prompt, content].filter(Boolean).join("\n\n");
  }

  if (group === "use-cases") {
    const steps = (data.steps || []).flatMap((step) => [
      step.title,
      step.description,
    ]);
    const examples = (data.examples || []).flatMap((example) => [
      example.title,
      example.description,
      example.before?.alt,
      example.after?.alt,
      example.image?.alt,
    ]);
    const faq = (data.faq || []).flatMap((item) => [
      item.question,
      item.answer,
    ]);
    const structuredParts = [
      data.software,
      data.workflow,
      data.rendering_intent,
      data.hero_before?.alt,
      data.hero_after?.alt,
      ...(data.preserved || []),
      ...(data.best_for || []),
      ...steps,
      ...examples,
      ...faq,
    ];

    return [content, ...structuredParts].filter(Boolean).join("\n\n");
  }

  return content;
}

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
      const searchableContent = getSearchableContent(data, content, group);

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

  fs.writeFileSync(
    `${JSON_FOLDER}/use-cases.json`,
    JSON.stringify(getData(USE_CASES_FOLDER, "use-cases")),
  );

  // merger json files for search
  const postsPath = new URL(`../${JSON_FOLDER}/posts.json`, import.meta.url);
  const promptsPath = new URL(
    `../${JSON_FOLDER}/prompts.json`,
    import.meta.url,
  );
  const useCasesPath = new URL(
    `../${JSON_FOLDER}/use-cases.json`,
    import.meta.url,
  );
  const posts = JSON.parse(fs.readFileSync(postsPath, "utf8"));
  const prompts = JSON.parse(fs.readFileSync(promptsPath, "utf8"));
  const useCases = JSON.parse(fs.readFileSync(useCasesPath, "utf8"));
  const search = [...posts, ...prompts, ...useCases];
  fs.writeFileSync(`${JSON_FOLDER}/search.json`, JSON.stringify(search));
} catch (err) {
  console.error(err);
}
