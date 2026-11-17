import { db } from './db';
import type { Book, Category } from '../types';

export interface BooksFilter {
  category?: string;
  q?: string;
}

export async function loadBooksShift(filter?: BooksFilter): Promise<Book[]> {
  // Hàm lấy danh sách phải chờ 800ms để giả lập truy vấn chậm
  await new Promise((resolve) => setTimeout(resolve, 800));

  let result = [...db.books];

  if (filter?.category && filter.category !== 'all' && filter.category.trim() !== '') {
    result = result.filter((b) => b.category === filter.category);
  }

  if (filter?.q && filter.q.trim() !== '') {
    const query = filter.q.trim().toLowerCase();
    result = result.filter((b) => b.title.toLowerCase().includes(query));
  }

  return result;
}

export async function getBookById(id: number): Promise<Book | undefined> {
  return db.books.find((b) => b.id === id);
}
