import { getCollection, type CollectionEntry } from "astro:content";
import { siteConfig } from "@/lib/siteConfig";
import {
  getContentDir,
  slugSelector,
  stripLocaleFromId,
} from "./languageParser";
import { withSiteMountPath } from "./mountPath";
import { slugify } from "./textConverter";

type AuthorEntry = CollectionEntry<"authors">;

type SiteMetadata = typeof siteConfig.metadata & {
  default_author?: string;
};

type SocialItem = {
  name?: string;
  icon?: string;
  link?: string;
};

type AuthorFieldItem =
  | string
  | {
      name: string;
      organization?: string;
      year?: string | number;
    };

export type ResolvedAuthor = {
  entry?: AuthorEntry;
  slug?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  description?: string;
  statement?: string;
  jobTitle?: string;
  yearsExperience?: string | number;
  expertise: string[];
  education: AuthorFieldItem[];
  certificates: AuthorFieldItem[];
  achievements: string[];
  image?: string;
  imageUrl?: string;
  url?: string;
  absoluteUrl?: string;
  id?: string;
  sameAs: string[];
  social: SocialItem[];
  contact?: {
    email?: string;
    form_label?: string;
    form_action?: string;
  };
  personJsonLd: Record<string, unknown>;
};

const metadata = siteConfig.metadata as SiteMetadata;
const authorsCache = new Map<string, Promise<AuthorEntry[]>>();

function getDefaultAuthorSlug() {
  return metadata.default_author || slugify(metadata.meta_author || "");
}

function getAuthorName(author: AuthorEntry) {
  const { title, first_name, last_name } = author.data;
  return title || [first_name, last_name].filter(Boolean).join(" ");
}

function credentialJsonLd(item: AuthorFieldItem) {
  if (typeof item === "string") {
    return {
      "@type": "EducationalOccupationalCredential",
      name: item,
    };
  }

  return {
    "@type": "EducationalOccupationalCredential",
    name: item.name,
    recognizedBy: item.organization
      ? {
          "@type": "Organization",
          name: item.organization,
        }
      : undefined,
    dateCreated: item.year ? String(item.year) : undefined,
  };
}

function educationJsonLd(item: AuthorFieldItem) {
  if (typeof item === "string") {
    return {
      "@type": "EducationalOrganization",
      name: item,
    };
  }

  return {
    "@type": "EducationalOrganization",
    name: item.organization || item.name,
    description: item.organization ? item.name : undefined,
  };
}

export function cleanJsonLd<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .map((item) => cleanJsonLd(item))
      .filter(
        (item) => item !== undefined && item !== null && item !== "",
      ) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, item]) => [key, cleanJsonLd(item)])
        .filter(
          ([, item]) =>
            item !== undefined &&
            item !== null &&
            item !== "" &&
            (!Array.isArray(item) || item.length > 0),
        ),
    ) as T;
  }

  return value;
}

export async function getAuthors(lang?: string) {
  const contentDir = getContentDir(lang);
  const cachedAuthors = authorsCache.get(contentDir);

  if (cachedAuthors) {
    return cachedAuthors;
  }

  const authorsPromise = getCollection(
    "authors",
    ({ data, id }) => !data.draft && id.startsWith(contentDir),
  ).then((authors) =>
    authors.filter(({ id }) => {
      const entryName = id.split("/").pop() || "";
      return !entryName.startsWith("-");
    }),
  );

  authorsCache.set(contentDir, authorsPromise);
  return authorsPromise;
}

export async function getAuthorProfile({
  lang,
  authorSlug,
  siteUrl,
}: {
  lang?: string;
  authorSlug?: string;
  siteUrl?: URL;
}): Promise<ResolvedAuthor> {
  const authors = await getAuthors(lang);
  const preferredSlug = authorSlug || getDefaultAuthorSlug();
  const author =
    authors.find((item) => stripLocaleFromId(item.id) === preferredSlug) ||
    authors.find((item) => slugify(getAuthorName(item)) === preferredSlug) ||
    authors.find(
      (item) =>
        metadata.meta_author &&
        slugify(getAuthorName(item)) === slugify(metadata.meta_author),
    ) ||
    authors[0];

  if (!author) {
    const fallbackName = metadata.meta_author || siteConfig.site.title;

    return {
      name: fallbackName,
      expertise: [],
      education: [],
      certificates: [],
      achievements: [],
      sameAs: [],
      social: [],
      personJsonLd: cleanJsonLd({
        "@type": "Person",
        name: fallbackName,
      }),
    };
  }

  const slug = stripLocaleFromId(author.id);
  const path = slugSelector(`/authors/${slug}`, lang);
  const absoluteUrl = siteUrl ? new URL(path, siteUrl).toString() : undefined;
  const id = absoluteUrl ? `${absoluteUrl}#person` : `${path}#person`;
  const imageUrl =
    siteUrl && author.data.image
      ? new URL(withSiteMountPath(author.data.image), siteUrl).toString()
      : author.data.image;
  const social = (author.data.social || []).filter(
    (item) => item?.name && item.icon && item.link,
  ) as SocialItem[];
  const sameAs = social.map((item) => item.link).filter(Boolean) as string[];
  const name = getAuthorName(author);

  const personJsonLd = cleanJsonLd({
    "@type": "Person",
    "@id": id,
    name,
    givenName: author.data.first_name,
    familyName: author.data.last_name,
    description: author.data.statement || author.data.description,
    jobTitle: author.data.job_title,
    image: imageUrl,
    url: absoluteUrl || path,
    sameAs,
    knowsAbout: author.data.expertise,
    alumniOf: author.data.education.map(educationJsonLd),
    hasCredential: author.data.certificates.map(credentialJsonLd),
    award: author.data.achievements,
    contactPoint: author.data.contact?.email
      ? {
          "@type": "ContactPoint",
          email: author.data.contact.email,
          contactType: "editorial inquiries",
        }
      : undefined,
  });

  return {
    entry: author,
    slug,
    name,
    firstName: author.data.first_name,
    lastName: author.data.last_name,
    description: author.data.description,
    statement: author.data.statement,
    jobTitle: author.data.job_title,
    yearsExperience: author.data.years_experience,
    expertise: author.data.expertise,
    education: author.data.education,
    certificates: author.data.certificates,
    achievements: author.data.achievements,
    image: author.data.image,
    imageUrl,
    url: path,
    absoluteUrl,
    id,
    sameAs,
    social,
    contact: author.data.contact,
    personJsonLd,
  };
}

export function getAuthorDisplayItem(item: AuthorFieldItem) {
  if (typeof item === "string") {
    return item;
  }

  return [item.name, item.organization, item.year].filter(Boolean).join(" - ");
}

export function hasAuthoredContent(
  content: { data: { author?: string } },
  authorSlug: string,
) {
  return (content.data.author || getDefaultAuthorSlug()) === authorSlug;
}
