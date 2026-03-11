import { marked } from "marked";
import markedKatex from "marked-katex-extension";

marked.use(markedKatex({ throwOnError: false }));
marked.setOptions({ gfm: true });

export function renderMarkdown(content: string): string {
  return marked.parse(content, { async: false }) as string;
}
