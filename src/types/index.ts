export interface IProject {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  images: string[];
  featured: boolean;
  views: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  views: number;
  readTime: number;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ISiteSettings {
  _id: string;
  ownerName: string;
  ownerTitle: string;
  ownerBio: string;
  ownerEmail: string;
  ownerPhone?: string;
  ownerLocation?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  siteTitle: string;
  siteDescription: string;
  siteFavicon?: string;
  ogImage?: string;
  skills: string[];
  updatedAt: string | Date;
}
