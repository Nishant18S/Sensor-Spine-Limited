export interface Product {
  _id: string;
  title: string;
  category: string;
  color: string;
  description: string;
  images: string[];
  features?: string[];
  specifications?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}