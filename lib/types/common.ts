// lib/types/common.ts
export interface Blog {
  sn?: string;
  title?: string;
  createdAt?: string;
  id?: string;
  projectLink?: string;
  slug?: string;
  metaDescription?: string;
  readtime: string;
  type?: string;
  by?: string;
  project?: string;
  category: string;
  featured?: string;
  heroImage?: string;
  otherImages?: string[];
  images?: FileList | null;
  content?: string;
  status?: string;
}