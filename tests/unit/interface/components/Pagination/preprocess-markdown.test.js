import { expect, test, describe } from 'vitest';
import { preprocessMarkdown } from 'pages/interface/components/Markdown';

describe('preprocessMarkdown', () => {
  test('should encode special characters in URLs within Markdown links', () => {
    const markdown = 'Este é um link com caracteres especiais: [Link](https://example.com/path?query=param&param2=valor com espaco#fragmento)';
    const expected = 'Este é um link com caracteres especiais: [Link](https://example.com/path?query=param&param2=valor%20com%20espaco#fragmento)';
    expect(preprocessMarkdown(markdown)).toBe(expected);
  });

  test('should encode parentheses in URLs within Markdown links', () => {
    const markdown = 'Este é um link com parênteses: [Link](https://example.com/path_(with_parentheses)/file.pdf)';
    const expected = 'Este é um link com parênteses: [Link](https://example.com/path_(with_parentheses)/file.pdf)';
    expect(preprocessMarkdown(markdown)).toBe(expected);
  });

  test('should encode multiple special characters in URLs within Markdown links', () => {
    const markdown = 'Outro link: [Google](https://www.google.com/search?q=testes de software&oq=testes de software&aqs=chrome..69i57j0l7.1234j0j7&sourceid=chrome&ie=UTF-8)';
    const expected = 'Outro link: [Google](https://www.google.com/search?q=testes%20de%20software&oq=testes%20de%20software&aqs=chrome..69i57j0l7.1234j0j7&sourceid=chrome&ie=UTF-8)';
    expect(preprocessMarkdown(markdown)).toBe(expected);
  });

  test('should not modify URLs that are already correctly encoded', () => {
    const markdown = 'Link já codificado: [Encoded](https://example.com/path%20with%20space)';
    const expected = 'Link já codificado: [Encoded](https://example.com/path%20with%20space)';
    expect(preprocessMarkdown(markdown)).toBe(expected);
  });

  test('should handle multiple links in the same markdown string', () => {
    const markdown = 'Primeiro [link](https://test.com/path with space) e segundo [link](https://another.com/query?param=value with space)';
    const expected = 'Primeiro [link](https://test.com/path%20with%20space) e segundo [link](https://another.com/query?param=value%20with%20space)';
    expect(preprocessMarkdown(markdown)).toBe(expected);
  });

  test('should not modify plain text without links', () => {
    const markdown = 'Isso é apenas um texto simples.';
    const expected = 'Isso é apenas um texto simples.';
    expect(preprocessMarkdown(markdown)).toBe(expected);
  });

  test('should handle URLs with mixed encoding', () => {
    const markdown = 'Link misto: [Mixed](https://example.com/path%20with%20space/another_path?q=param com espaço)';
    const expected = 'Link misto: [Mixed](https://example.com/path%20with%20space/another_path?q=param%20com%20espa%C3%A7o)';
    expect(preprocessMarkdown(markdown)).toBe(expected);
  });
});


