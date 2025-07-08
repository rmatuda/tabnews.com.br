import { isTrustedDomain } from '@tabnews/helpers';
import { MarkdownEditor, MarkdownViewer } from '@tabnews/ui/markdown';

const shouldAddNofollow = (url) => !isTrustedDomain(url);

export const preprocessMarkdown = (markdown) => {
  return markdown.replace(/\((https?:\/\/[^)]+)\)/g, (match, url) => {
    try {
      const parsedUrl = new URL(url);
      
      const decodedPathname = decodeURIComponent(parsedUrl.pathname);
      const encodedPathname = encodeURI(decodedPathname);

      let encodedSearch = '';
      const params = [];
      for (const [key, value] of parsedUrl.searchParams.entries()) {
        params.push(`${encodeURIComponent(decodeURIComponent(key))}=${encodeURIComponent(decodeURIComponent(value))}`);
      }
      if (params.length > 0) {
        encodedSearch = '?' + params.join('&');
      }

      let reconstructedUrl = `${parsedUrl.origin}${encodedPathname}`;
      if (encodedSearch) {
        reconstructedUrl += encodedSearch;
      }
      if (parsedUrl.hash) {
        reconstructedUrl += parsedUrl.hash;
      }
      
      return `(${reconstructedUrl})`;
    } catch (e) {
      console.warn("Erro ao pré-processar URL:", url, e);
      return match;
    }
  });
};

export default function Viewer(props) {
  const preprocessedChildren = preprocessMarkdown(props.children);
  return MarkdownViewer({
    shouldAddNofollow,
    children: preprocessedChildren,
    ...props,
  });
}

export function Editor(props) {
  return MarkdownEditor({
    shouldAddNofollow,
    ...props,
  });
}


