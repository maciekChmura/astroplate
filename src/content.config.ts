import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import fs from "node:fs";
import path from "node:path";
import { resolveSite } from "../scripts/siteResolver.js";

const selectedSite = resolveSite();
const contentBase = selectedSite.contentDir;
const useCasesBase = fs.existsSync(path.join(contentBase, "use-cases"))
  ? path.join(contentBase, "use-cases")
  : path.join(selectedSite.projectRoot, "src", "content-empty", "use-cases");
const audiencesBase = fs.existsSync(path.join(contentBase, "for"))
  ? path.join(contentBase, "for")
  : path.join(selectedSite.projectRoot, "src", "content-empty", "for");
const alternativesBase = fs.existsSync(path.join(contentBase, "alternatives"))
  ? path.join(contentBase, "alternatives")
  : path.join(selectedSite.projectRoot, "src", "content-empty", "alternatives");

const commonFields = {
  title: z.string(),
  description: z.string(),
  meta_title: z.string().optional(),
  // z.coerce.date() handles both Date objects and ISO string dates from frontmatter (Zod 4)
  date: z.coerce.date().optional(),
  image: z.string().optional(),
  draft: z.boolean(),
};

// Post collection schema
const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: `${contentBase}/blog` }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    image: z.string(),
    // Use factory functions for mutable array defaults (Zod 4 best practice)
    categories: z.array(z.string()).min(1),
    tags: z.array(z.string()).min(1),
    author: z.string().optional(),
    draft: z.boolean(),
  }),
});

// Prompt collection schema
const promptsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: `${contentBase}/prompts` }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    categories: z.array(z.string()).min(1),
    tags: z.array(z.string()).min(1),
    keywords: z.array(z.string()).default([]),
    author: z.string().optional(),
    what_it_does: z.string().optional(),
    best_input: z.string().optional(),
    prompt: z.string(),
    popular: z.boolean().optional(),
    draft: z.boolean(),
  }),
});

const imageField = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
});

const useCaseTextImageField = z.object({
  title: z.string(),
  description: z.string().optional(),
  image: imageField.optional(),
});

// Use case collection schema
const useCasesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: useCasesBase }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    meta_title: z.string().optional(),
    image: z.string().optional(),
    categories: z.array(z.string()).min(1),
    tags: z.array(z.string()).min(1),
    author: z.string().optional(),
    popular: z.boolean().optional(),
    draft: z.boolean(),
    software: z.string().optional(),
    workflow: z.string().optional(),
    rendering_intent: z.string().optional(),
    input_example: useCaseTextImageField
      .extend({
        accepted_formats: z.array(z.string()).default([]),
      })
      .optional(),
    style_selection: z
      .object({
        title: z.string(),
        description: z.string().optional(),
        image: imageField.optional(),
        styles: z
          .array(
            z.object({
              title: z.string(),
              description: z.string().optional(),
              image: imageField.optional(),
            }),
          )
          .default([]),
      })
      .optional(),
    result: useCaseTextImageField.optional(),
    video: z
      .object({
        title: z.string(),
        embed_url: z.string(),
        caption: z.string().optional(),
      })
      .optional(),
    hero_before: imageField.optional(),
    hero_after: imageField.optional(),
    steps: z
      .array(
        z.object({
          title: z.string(),
          description: z.string().optional(),
        }),
      )
      .default([]),
    examples: z
      .array(
        z.object({
          title: z.string(),
          description: z.string().optional(),
          before: imageField.optional(),
          after: imageField.optional(),
          image: imageField.optional(),
        }),
      )
      .default([]),
    preserved: z.array(z.string()).default([]),
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      )
      .default([]),
    cta: z
      .object({
        enable: z.boolean(),
        title: z.string().optional(),
        description: z.string().optional(),
        label: z.string(),
        link: z.string(),
      })
      .optional(),
  }),
});

const audienceWorkflowField = z.object({
  title: z.string(),
  description: z.string(),
  link: z.string().optional(),
  image: imageField.optional(),
});

const audienceFaqField = z.object({
  question: z.string(),
  answer: z.string(),
});

// Audience/persona collection schema
const audiencesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: audiencesBase }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    meta_title: z.string().optional(),
    image: z.string().optional(),
    categories: z.array(z.string()).min(1),
    tags: z.array(z.string()).min(1),
    author: z.string().optional(),
    popular: z.boolean().optional(),
    draft: z.boolean(),
    audience_label: z.string(),
    pain_points: z.array(z.string()).default([]),
    workflows: z.array(audienceWorkflowField).default([]),
    related_use_cases: z.array(z.string()).default([]),
    related_prompts: z.array(z.string()).default([]),
    faq: z.array(audienceFaqField).default([]),
    cta: z
      .object({
        enable: z.boolean(),
        title: z.string().optional(),
        description: z.string().optional(),
        label: z.string(),
        link: z.string(),
      })
      .optional(),
  }),
});

const comparisonRowField = z.object({
  label: z.string(),
  competitor: z.string(),
  quickarchviz: z.string(),
});

const featureComparisonField = z.object({
  title: z.string(),
  competitor: z.string(),
  quickarchviz: z.string(),
  summary: z.string().optional(),
});

const namedDescriptionField = z.object({
  title: z.string(),
  description: z.string(),
});

const alternativeFaqField = z.object({
  question: z.string(),
  answer: z.string(),
});

// Competitor alternatives collection schema
const alternativesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: alternativesBase }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    meta_title: z.string().optional(),
    image: z.string().optional(),
    categories: z.array(z.string()).min(1),
    tags: z.array(z.string()).min(1),
    author: z.string().optional(),
    popular: z.boolean().optional(),
    draft: z.boolean(),
    competitor_name: z.string(),
    competitor_url: z.string().optional(),
    competitor_summary: z.string(),
    quickarchviz_summary: z.string(),
    best_for_competitor: z.array(z.string()).default([]),
    best_for_quickarchviz: z.array(z.string()).default([]),
    comparison_rows: z.array(comparisonRowField).default([]),
    feature_comparison: z.array(featureComparisonField).default([]),
    pricing_comparison: z.array(namedDescriptionField).default([]),
    use_cases: z.array(namedDescriptionField).default([]),
    common_alternatives: z.array(namedDescriptionField).default([]),
    faq: z.array(alternativeFaqField).default([]),
    cta: z
      .object({
        enable: z.boolean(),
        title: z.string().optional(),
        description: z.string().optional(),
        label: z.string(),
        link: z.string(),
      })
      .optional(),
  }),
});

// Author collection schema
const authorsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: `${contentBase}/authors` }),
  schema: z.object({
    ...commonFields,
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    statement: z.string().optional(),
    job_title: z.string().optional(),
    years_experience: z.union([z.number(), z.string()]).optional(),
    expertise: z.array(z.string()).default([]),
    education: z
      .array(
        z.union([
          z.string(),
          z.object({
            name: z.string(),
            organization: z.string().optional(),
            year: z.union([z.number(), z.string()]).optional(),
          }),
        ]),
      )
      .default([]),
    certificates: z
      .array(
        z.union([
          z.string(),
          z.object({
            name: z.string(),
            organization: z.string().optional(),
            year: z.union([z.number(), z.string()]).optional(),
          }),
        ]),
      )
      .default([]),
    achievements: z.array(z.string()).default([]),
    contact: z
      .object({
        email: z.string().optional(),
        form_label: z.string().optional(),
        form_action: z.string().optional(),
      })
      .optional(),
    social: z
      .array(
        z
          .object({
            name: z.string().optional(),
            icon: z.string().optional(),
            link: z.string().optional(),
          })
          .optional(),
      )
      .optional(),
    draft: z.boolean().optional(),
  }),
});

// Pages collection schema
const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: `${contentBase}/pages` }),
  schema: z.object({
    ...commonFields,
  }),
});

// about collection schema
const aboutCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: `${contentBase}/about` }),
  schema: z.object({
    ...commonFields,
  }),
});

// contact collection schema
const contactCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: `${contentBase}/contact` }),
  schema: z.object({
    ...commonFields,
  }),
});

// Homepage collection schema
const homepageCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: `${contentBase}/homepage` }),
  schema: z.object({
    banner: z.object({
      title: z.string(),
      content: z.string(),
      image: z.string(),
      button: z.object({
        enable: z.boolean(),
        label: z.string(),
        link: z.string(),
      }),
    }),
    features: z.array(
      z.object({
        title: z.string(),
        image: z.string(),
        content: z.string(),
        bulletpoints: z.array(z.string()),
        button: z.object({
          enable: z.boolean(),
          label: z.string(),
          link: z.string(),
        }),
      }),
    ),
  }),
});

// Call to Action collection schema
const ctaSectionCollection = defineCollection({
  loader: glob({
    pattern: "**/call-to-action.{md,mdx}",
    base: `${contentBase}/sections`,
  }),
  schema: z.object({
    enable: z.boolean(),
    title: z.string(),
    description: z.string(),
    image: z.string(),
    button: z.object({
      enable: z.boolean(),
      label: z.string(),
      link: z.string(),
    }),
  }),
});

// Testimonials Section collection schema
const testimonialSectionCollection = defineCollection({
  loader: glob({
    pattern: "**/testimonial.{md,mdx}",
    base: `${contentBase}/sections`,
  }),
  schema: z.object({
    enable: z.boolean(),
    title: z.string(),
    description: z.string(),
    testimonials: z.array(
      z.object({
        name: z.string(),
        avatar: z.string(),
        designation: z.string(),
        content: z.string(),
      }),
    ),
  }),
});

// Export collections
export const collections = {
  // Pages
  homepage: homepageCollection,
  blog: blogCollection,
  prompts: promptsCollection,
  "use-cases": useCasesCollection,
  for: audiencesCollection,
  alternatives: alternativesCollection,
  authors: authorsCollection,
  pages: pagesCollection,
  about: aboutCollection,
  contact: contactCollection,

  // sections
  ctaSection: ctaSectionCollection,
  testimonialSection: testimonialSectionCollection,
};
