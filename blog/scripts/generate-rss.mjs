import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Feed } from 'feed';
import { format } from 'date-fns';
import readingTime from 'reading-time';

const contentDirectory = path.join(process.cwd(), 'content');
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yeahjunheo.com';

function formatDate(dateInput) {
  const dateStr = dateInput.toString();

  // Handle YYYYMMDD format
  if (dateStr.length === 8) {
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1;
    const day = parseInt(dateStr.substring(6, 8));
    const date = new Date(year, month, day);
    return format(date, 'MMMM d, yyyy');
  }

  try {
    const date = new Date(dateStr);
    return format(date, 'MMMM d, yyyy');
  } catch {
    return dateStr;
  }
}

function getAllPosts(category) {
  const categoryPath = path.join(contentDirectory, category);

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

      const stats = readingTime(content);
      const dateString = data.date ? formatDate(data.date) : '';

      return {
        slug,
        title: data.title || slug,
        date: dateString,
        tags: data.tags || [],
        readingTime: stats.text,
        description: data.description,
        link: data.link,
      };
    });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
  });
}

async function generateRssFeed() {
  const date = new Date();

  const feed = new Feed({
    title: 'yeahjunheo Blog',
    description: 'Code, thoughts, and everything in between',
    id: siteUrl,
    link: siteUrl,
    language: 'en',
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${date.getFullYear()}, yeahjunheo`,
    updated: date,
    feedLinks: {
      rss2: `${siteUrl}/feed.xml`,
      json: `${siteUrl}/feed.json`,
      atom: `${siteUrl}/atom.xml`,
    },
    author: {
      name: 'yeahjunheo',
      link: siteUrl,
    },
  });

  const codePosts = getAllPosts('code');
  const thoughtPosts = getAllPosts('thoughts');
  const allPosts = [...codePosts, ...thoughtPosts].sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
  });

  allPosts.forEach((post) => {
    const category = codePosts.includes(post) ? 'code' : 'thoughts';
    const url = `${siteUrl}/${category}/${post.slug}`;

    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.description || post.title,
      date: new Date(post.date),
      category: post.tags?.map((tag) => ({ name: tag })),
    });
  });

  const publicDir = path.join(process.cwd(), 'public');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'feed.xml'), feed.rss2());
  fs.writeFileSync(path.join(publicDir, 'atom.xml'), feed.atom1());
  fs.writeFileSync(path.join(publicDir, 'feed.json'), feed.json1());

  console.log('✅ RSS feeds generated successfully!');
}

generateRssFeed();
