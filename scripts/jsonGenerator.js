import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { resolveSite } from "./siteResolver.js";

const JSON_FOLDER = "./.json";
const selectedSite = resolveSite();
const BLOG_FOLDER = path.join(selectedSite.contentDir, "blog");
const PROMPTS_FOLDER = path.join(selectedSite.contentDir, "prompts");
const USE_CASES_FOLDER = path.join(selectedSite.contentDir, "use-cases");
const AUDIENCES_FOLDER = path.join(selectedSite.contentDir, "for");
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
    const inputExample = [
      data.input_example?.title,
      data.input_example?.description,
      data.input_example?.image?.alt,
      data.input_example?.image?.caption,
      ...(data.input_example?.accepted_formats || []),
    ];
    const styles = (data.style_selection?.styles || []).flatMap((style) => [
      style.title,
      style.description,
      style.image?.alt,
      style.image?.caption,
    ]);
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
    const result = [
      data.result?.title,
      data.result?.description,
      data.result?.image?.alt,
      data.result?.image?.caption,
    ];
    const structuredParts = [
      data.software,
      data.workflow,
      data.rendering_intent,
      ...inputExample,
      data.style_selection?.title,
      data.style_selection?.description,
      ...styles,
      ...result,
      data.video?.title,
      data.video?.caption,
      data.hero_before?.alt,
      data.hero_after?.alt,
      ...(data.preserved || []),
      ...steps,
      ...examples,
      ...faq,
    ];

    return [content, ...structuredParts].filter(Boolean).join("\n\n");
  }

  if (group === "for") {
    const workflows = (data.workflows || []).flatMap((workflow) => [
      workflow.title,
      workflow.description,
      workflow.link,
      workflow.image?.alt,
      workflow.image?.caption,
    ]);
    const faq = (data.faq || []).flatMap((item) => [
      item.question,
      item.answer,
    ]);
    const structuredParts = [
      data.audience_label,
      ...(data.pain_points || []),
      ...workflows,
      ...(data.related_use_cases || []),
      ...(data.related_prompts || []),
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

  fs.writeFileSync(
    `${JSON_FOLDER}/for.json`,
    JSON.stringify(getData(AUDIENCES_FOLDER, "for")),
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
  const audiencesPath = new URL(`../${JSON_FOLDER}/for.json`, import.meta.url);
  const posts = JSON.parse(fs.readFileSync(postsPath, "utf8"));
  const prompts = JSON.parse(fs.readFileSync(promptsPath, "utf8"));
  const useCases = JSON.parse(fs.readFileSync(useCasesPath, "utf8"));
  const audiences = JSON.parse(fs.readFileSync(audiencesPath, "utf8"));
  const search = [...posts, ...prompts, ...useCases, ...audiences];
  fs.writeFileSync(`${JSON_FOLDER}/search.json`, JSON.stringify(search));
} catch (err) {
  console.error(err);
}
