import { marked } from "marked";
import markedKatex from "marked-katex-extension";
import { createHighlighter } from "shiki";

const highlighter = await createHighlighter({
  themes: ["github-dark"],
  langs: [
    "javascript",
    "typescript",
    "python",
    "go",
    "html",
    "css",
    "json",
    "bash",
    "yaml",
    "sql",
    "markdown",
    "jsx",
    "tsx",
  ],
});

marked.use({
  renderer: {
    code({ text, lang }: { text: string; lang?: string }) {
      const language =
        lang && highlighter.getLoadedLanguages().includes(lang) ? lang : "text";
      return highlighter.codeToHtml(text, {
        lang: language,
        theme: "github-dark",
      });
    },
  },
});
marked.use(markedKatex({ throwOnError: false }));
marked.setOptions({ gfm: true });

export function renderMarkdown(content: string): string {
  return marked.parse(content, { async: false }) as string;
}
