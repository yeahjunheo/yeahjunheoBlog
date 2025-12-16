import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { format } from 'date-fns';
import readingTime from 'reading-time';

export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  link?: string;
  description?: string;
  tags?: string[];
  readingTime: string;
}

export interface Post extends PostMetadata {
  content: string;
}

const contentDirectory = path.join(process.cwd(), 'content');

/**
 * Get all posts from a specific category (e.g., 'code', 'thoughts')
 */
export function getAllPosts(category: string): PostMetadata[] {
  const categoryPath = path.join(contentDirectory, category);

  // Check if directory exists
  if (!fs.existsSync(categoryPath)) {
    return [];
  }

  const fileNames = fs.readdirSync(categoryPath);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(categoryPath, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      // Calculate reading time
      const stats = readingTime(content);

      // Format date
      const dateString = data.date ? formatDate(data.date) : '';

      const post: PostMetadata = {
        slug,
        title: data.title || slug,
        date: dateString,
        tags: data.tags || [],
        readingTime: stats.text,
      };

      // Only add optional fields if they exist
      if (data.link) post.link = data.link;
      if (data.description) post.description = data.description;

      return post;
    });

  // Sort posts by date (newest first)
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

/**
 * Get all slugs for a specific category
 */
export function getAllPostSlugs(category: string): string[] {
  const categoryPath = path.join(contentDirectory, category);

  if (!fs.existsSync(categoryPath)) {
    return [];
  }

  const fileNames = fs.readdirSync(categoryPath);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
}

/**
 * Get a single post by slug and category
 */
export async function getPostBySlug(category: string, slug: string): Promise<Post | null> {
  const fullPath = path.join(contentDirectory, category, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // Convert markdown to HTML
  const processedContent = await remark().use(html, { sanitize: false }).process(content);
  const contentHtml = processedContent.toString();

  // Calculate reading time
  const stats = readingTime(content);

  // Format date
  const dateString = data.date ? formatDate(data.date) : '';

  const post: Post = {
    slug,
    title: data.title || slug,
    date: dateString,
    tags: data.tags || [],
    readingTime: stats.text,
    content: contentHtml,
  };

  // Only add optional fields if they exist
  if (data.link) post.link = data.link;
  if (data.description) post.description = data.description;

  return post;
}

/**
 * Format date from YYYYMMDD to human-readable format
 */
function formatDate(dateInput: string | number): string {
  const dateStr = dateInput.toString();

  // Handle YYYYMMDD format
  if (dateStr.length === 8) {
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1; // JS months are 0-indexed
    const day = parseInt(dateStr.substring(6, 8));
    const date = new Date(year, month, day);
    return format(date, 'MMMM d, yyyy');
  }

  // Fallback: try to parse as regular date
  try {
    const date = new Date(dateStr);
    return format(date, 'MMMM d, yyyy');
  } catch {
    return dateStr;
  }
}
