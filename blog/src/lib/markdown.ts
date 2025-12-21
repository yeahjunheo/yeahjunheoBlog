import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { serialize } from "next-mdx-remote/serialize";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { format } from "date-fns";
import readingTime from "reading-time";

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
    mdxSource?: MDXRemoteSerializeResult; // For MDX files, contains serialized MDX
    isMdx?: boolean; // Flag to indicate if this is an MDX file
}

const contentDirectory = path.join(process.cwd(), "content");

/**
 * Get all posts from the content directory
 */
export function getAllPosts(): PostMetadata[] {
    // Check if directory exists
    if (!fs.existsSync(contentDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(contentDirectory);
    const allPostsData = fileNames
        .filter(
            (fileName) => fileName.endsWith(".md") || fileName.endsWith(".mdx")
        )
        .map((fileName) => {
            const slug = fileName.replace(/\.(md|mdx)$/, "");
            const fullPath = path.join(contentDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const { data, content } = matter(fileContents);

            // Calculate reading time
            const stats = readingTime(content);

            // Format date
            const dateString = data.date ? formatDate(data.date) : "";

            const post: PostMetadata & { rawDate: string | number } = {
                slug,
                title: data.title || slug,
                date: dateString,
                tags: data.tags || [],
                readingTime: stats.text,
                rawDate: data.date || "", // Keep raw date for sorting
            };

            // Only add optional fields if they exist
            if (data.link) post.link = data.link;
            if (data.description) post.description = data.description;

            return post;
        });

    // Sort posts by raw date (newest first) - YYYYMMDD format sorts correctly as numbers
    return allPostsData
        .sort((a, b) => {
            const dateA =
                typeof a.rawDate === "number"
                    ? a.rawDate
                    : parseInt(a.rawDate.toString()) || 0;
            const dateB =
                typeof b.rawDate === "number"
                    ? b.rawDate
                    : parseInt(b.rawDate.toString()) || 0;
            return dateB - dateA; // Descending order (newest first)
        })
        .map(({ rawDate: _, ...post }) => post); // Remove rawDate from final output
}

/**
 * Get all slugs from the content directory
 */
export function getAllPostSlugs(): string[] {
    if (!fs.existsSync(contentDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(contentDirectory);
    return fileNames
        .filter(
            (fileName) => fileName.endsWith(".md") || fileName.endsWith(".mdx")
        )
        .map((fileName) => fileName.replace(/\.(md|mdx)$/, ""));
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
    // Try both .md and .mdx extensions
    let fullPath = path.join(contentDirectory, `${slug}.md`);
    let isMdx = false;

    if (!fs.existsSync(fullPath)) {
        fullPath = path.join(contentDirectory, `${slug}.mdx`);
        isMdx = true;
    }

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Calculate reading time
    const stats = readingTime(content);

    // Format date
    const dateString = data.date ? formatDate(data.date) : "";

    let contentHtml = "";
    let mdxSource: MDXRemoteSerializeResult | null = null;

    if (isMdx) {
        // For MDX files, use next-mdx-remote
        mdxSource = await serialize(content, {
            mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                    rehypeSlug,
                    [
                        rehypeAutolinkHeadings,
                        {
                            behavior: "wrap",
                            properties: {
                                className: ["anchor-link"],
                            },
                        },
                    ],
                    [
                        rehypePrettyCode,
                        {
                            theme: "github-dark",
                            keepBackground: true,
                        },
                    ],
                ],
            },
        });
    } else {
        // For regular markdown files, use remark/rehype pipeline
        const processedContent = await remark()
            .use(remarkGfm) // GitHub Flavored Markdown (tables, strikethrough, task lists)
            .use(remarkRehype, { allowDangerousHtml: true }) // Convert markdown to HTML AST
            .use(rehypeSlug) // Add IDs to headings
            .use(rehypeAutolinkHeadings, {
                // Add clickable links to headings
                behavior: "wrap",
                properties: {
                    className: ["anchor-link"],
                },
            })
            .use(rehypePrettyCode, {
                // Enhanced syntax highlighting
                theme: "github-dark",
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
        return format(date, "MMMM d, yyyy");
    }

    // Fallback: try to parse as regular date
    try {
        const date = new Date(dateStr);
        return format(date, "MMMM d, yyyy");
    } catch {
        return dateStr;
    }
}
