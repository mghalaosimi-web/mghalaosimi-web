/** Shared, domain-independent contracts for the M.GH.AL bilingual website. */

export type SiteLanguage = "ar" | "en";
export type TextDirection = "rtl" | "ltr";

export interface LocalizedText {
  ar: string;
  en: string;
}

export interface SiteNavigationItem {
  id: string;
  href: string;
  label: LocalizedText;
}

export interface ProjectRecord {
  id: string;
  name: string;
  summary: LocalizedText;
  href?: string;
  repositoryUrl?: string;
  artwork?: string;
  technologies: readonly string[];
}

export interface CredentialRecord {
  id: string;
  title: LocalizedText;
  issuer: string;
  issuedAt?: string;
  credentialUrl?: string;
  artwork?: string;
}

export interface SiteEnvironment {
  /** Canonical public origin for the deployment; never used for local navigation. */
  siteUrl: string;
  /** Whether the current deployment is an indexable production environment. */
  isProduction: boolean;
}

export const SITE_DIRECTIONS: Readonly<Record<SiteLanguage, TextDirection>> = {
  ar: "rtl",
  en: "ltr",
};
