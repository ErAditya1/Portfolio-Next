import type { ISiteSettings } from "@/types";
import {
  SITE_URL,
  PERSON_ID,
  WEBSITE_ID,
  OWNER_NAME,
  OWNER_HANDLE,
  absUrl,
  headlineRole,
  currentRole,
  profileUrls,
  type ProfileExperience,
} from "./site";

type Node = Record<string, unknown>;

/** Services Aditya offers. Plain descriptions only: no unverified numbers. */
const SERVICES = [
  "Full stack web application development (Next.js, React, Node.js)",
  "MERN stack development",
  "Backend APIs and job queues (NestJS, Express, BullMQ, Redis)",
  "AI voice agents and WhatsApp Cloud API automation",
  "Startup MVP development",
];

function splitLocation(loc?: string) {
  // "Lucknow, Uttar Pradesh — India" → { locality: "Lucknow", region: "Uttar Pradesh", country: "IN" }
  if (!loc) return undefined;
  const parts = loc.split(/[,—–-]/).map((p) => p.trim()).filter(Boolean);
  if (!parts.length || /^remote$/i.test(parts[0])) return undefined;
  const country = parts.find((p) => /^india$/i.test(p)) ? "IN" : undefined;
  const rest = parts.filter((p) => !/^india$/i.test(p));
  return { locality: rest[0], region: rest[1] || (rest[0] === "Lucknow" ? "Uttar Pradesh" : undefined), country: country || "IN" };
}

const address = (l: { locality?: string; region?: string; country?: string }) => ({
  "@type": "PostalAddress",
  ...(l.locality && { addressLocality: l.locality }),
  ...(l.region && { addressRegion: l.region }),
  addressCountry: l.country || "IN",
});

export function personNode(s: ISiteSettings | undefined, exps: ProfileExperience[]): Node {
  const job = currentRole(exps);
  const workLoc = splitLocation(job?.location);
  const education = exps.filter((e) => e.type === "education");
  const skills = (s?.skills || []).map((k) => k.name).filter(Boolean);

  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: s?.ownerName || OWNER_NAME,
    alternateName: [OWNER_HANDLE, "Er. Aditya Kumar", "eraditya"],
    url: `${SITE_URL}/`,
    mainEntityOfPage: `${SITE_URL}/about`,
    ...(s?.avatarUrl && { image: { "@type": "ImageObject", url: absUrl(s.avatarUrl), caption: `${OWNER_NAME}, ${headlineRole(s)}` } }),
    jobTitle: headlineRole(s),
    ...(s?.ownerBio && { description: s.ownerBio }),
    ...(s?.ownerEmail && { email: `mailto:${s.ownerEmail}` }),
    ...(s?.ownerPhone && { telephone: s.ownerPhone.replace(/\s+/g, "") }),
    homeLocation: { "@type": "Place", address: address({ locality: "Barabanki", region: "Uttar Pradesh", country: "IN" }) },
    ...(workLoc && { workLocation: { "@type": "Place", address: address(workLoc) } }),
    ...(job && {
      worksFor: {
        "@type": "Organization",
        name: job.company,
        ...(/feeding trends/i.test(job.company) && { url: "https://feedingtrends.com" }),
      },
    }),
    ...(education.length && {
      alumniOf: education.map((e) => ({ "@type": "EducationalOrganization", name: e.company })),
    }),
    hasOccupation: {
      "@type": "Occupation",
      name: headlineRole(s),
      ...(workLoc && { occupationLocation: { "@type": "City", name: workLoc.locality } }),
      ...(skills.length && { skills: skills.join(", ") }),
    },
    ...(skills.length && { knowsAbout: skills }),
    knowsLanguage: ["English", "Hindi"],
    sameAs: profileUrls(s),
    makesOffer: SERVICES.map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name, provider: { "@id": PERSON_ID } },
      areaServed: [
        { "@type": "City", name: "Lucknow" },
        { "@type": "AdministrativeArea", name: "Uttar Pradesh" },
        { "@type": "Country", name: "India" },
        "Remote",
      ],
    })),
  };
}

export function websiteNode(s?: ISiteSettings): Node {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: s?.ownerName || OWNER_NAME,
    alternateName: s?.siteTitle || `${OWNER_NAME} Portfolio`,
    ...(s?.siteDescription && { description: s.siteDescription }),
    inLanguage: "en",
    publisher: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
  };
}

export function siteGraph(s: ISiteSettings | undefined, exps: ProfileExperience[]) {
  return { "@context": "https://schema.org", "@graph": [websiteNode(s), personNode(s, exps)] };
}

export function breadcrumbNode(items: { name: string; path: string }[]): Node {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absUrl(it.path) })),
  };
}

/** Page-level node referencing the site graph by @id. */
export function webPageNode(opts: {
  type?: string | string[];
  path: string;
  name: string;
  description?: string;
  mainEntity?: Node;
  dateModified?: string | Date;
  extra?: Node;
}): Node {
  const url = absUrl(opts.path);
  return {
    "@type": opts.type || "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: opts.name,
    ...(opts.description && { description: opts.description }),
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    ...(opts.mainEntity && { mainEntity: opts.mainEntity }),
    ...(opts.dateModified && { dateModified: new Date(opts.dateModified).toISOString() }),
    inLanguage: "en",
    ...opts.extra,
  };
}

export function itemListNode(items: { name: string; path: string }[]): Node {
  return {
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, url: absUrl(it.path), name: it.name })),
  };
}

export const graph = (...nodes: Node[]) => ({ "@context": "https://schema.org", "@graph": nodes });
