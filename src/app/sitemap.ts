import type { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'http://localhost:3000';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/books`,
      lastModified: new Date(),
    },
  ];

  const bookRoutes: MetadataRoute.Sitemap = db.books.map((book) => ({
    url: `${baseUrl}/books/${book.id}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...bookRoutes];
}
