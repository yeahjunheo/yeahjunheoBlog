import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeStringify from 'rehype-stringify';
import { serialize } from 'next-mdx-remote/serialize';
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
  mdxSource?: any; // For MDX files, contains serialized MDX
  isMdx?: boolean; // Flag to indicate if this is an MDX file
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
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.(md|mdx)$/, '');
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
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => fileName.replace(/\.(md|mdx)$/, ''));
}

/**
 * Get a single post by slug and category
 */
export async function getPostBySlug(category: string, slug: string): Promise<Post | null> {
  // Try both .md and .mdx extensions
  let fullPath = path.join(contentDirectory, category, `${slug}.md`);
  let isMdx = false;

  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(contentDirectory, category, `${slug}.mdx`);
    isMdx = true;
  }

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // Calculate reading time
  const stats = readingTime(content);

  // Format date
  const dateString = data.date ? formatDate(data.date) : '';

  let contentHtml = '';
  let mdxSource = null;

  if (isMdx) {
    // For MDX files, use next-mdx-remote
    mdxSource = await serialize(content, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, {
            behavior: 'wrap',
            properties: {
              className: ['anchor-link'],
            },
          }],
          [rehypePrettyCode, {
            theme: 'github-dark',
            keepBackground: true,
          }],
        ],
      },
    });
  } else {
    // For regular markdown files, use remark/rehype pipeline
    const processedContent = await remark()
      .use(remarkGfm) // GitHub Flavored Markdown (tables, strikethrough, task lists)
      .use(remarkRehype, { allowDangerousHtml: true }) // Convert markdown to HTML AST
      .use(rehypeSlug) // Add IDs to headings
      .use(rehypeAutolinkHeadings, { // Add clickable links to headings
        behavior: 'wrap',
        properties: {
          className: ['anchor-link'],
        },
      })
      .use(rehypePrettyCode, { // Enhanced syntax highlighting
        theme: 'github-dark',
        keepBackground: true,
      })
      .use(rehypeStringify, { allowDangerousHtml: true }) // Convert HTML AST to string
      .process(content);
    contentHtml = processedContent.toString();
  }

  const post: Post = {
    slug,
    title: data.title || slug,
    date: dateString,
    tags: data.tags || [],
    readingTime: stats.text,
    content: contentHtml,
    isMdx,
  };

  // Add MDX source if it's an MDX file
  if (mdxSource) {
    post.mdxSource = mdxSource;
  }

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
