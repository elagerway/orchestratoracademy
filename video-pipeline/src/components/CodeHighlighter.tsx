import React from "react";

interface HighlightedToken {
  text: string;
  color: string;
}

const COLORS = {
  keyword: "#c792ea", // purple
  string: "#c3e88d", // green
  number: "#f78c6c", // orange
  comment: "#546e7a", // gray
  function: "#ffcb6b", // yellow
  builtin: "#82aaff", // blue
  operator: "#89ddff", // cyan
  default: "#eeffff", // white
  punctuation: "#89ddff", // cyan
};

const KEYWORDS = new Set([
  "def",
  "class",
  "import",
  "from",
  "if",
  "elif",
  "else",
  "for",
  "while",
  "return",
  "in",
  "not",
  "and",
  "or",
  "is",
  "with",
  "as",
  "try",
  "except",
  "finally",
  "raise",
  "yield",
  "async",
  "await",
  "lambda",
  "pass",
  "break",
  "continue",
  "True",
  "False",
  "None",
  // JavaScript
  "const",
  "let",
  "var",
  "function",
  "export",
  "default",
  "new",
  "typeof",
  "instanceof",
  "this",
  "super",
  "extends",
  "implements",
  "interface",
  "type",
  "enum",
  "abstract",
  "static",
  "public",
  "private",
  "protected",
  "readonly",
  "void",
  "null",
  "undefined",
  "true",
  "false",
  // Bash
  "sudo",
  "echo",
  "cd",
  "ls",
  "mkdir",
  "rm",
  "cp",
  "mv",
  "cat",
  "grep",
  "pip",
  "npm",
  "npx",
  "node",
  "python",
  "git",
]);

const BUILTINS = new Set([
  "print",
  "len",
  "range",
  "str",
  "int",
  "float",
  "list",
  "dict",
  "set",
  "tuple",
  "bool",
  "type",
  "isinstance",
  "hasattr",
  "getattr",
  "setattr",
  "open",
  "map",
  "filter",
  "zip",
  "enumerate",
  "sorted",
  "reversed",
  "any",
  "all",
  "min",
  "max",
  "sum",
  "abs",
  "round",
  "input",
  "super",
  "console",
  "require",
  "process",
  "JSON",
  "Math",
  "Object",
  "Array",
  "String",
  "Number",
  "Promise",
  "fetch",
  "setTimeout",
  "setInterval",
]);

export function tokenize(text: string): HighlightedToken[] {
  const tokens: HighlightedToken[] = [];
  let i = 0;

  while (i < text.length) {
    // Comments: # or //
    if (text[i] === "#" || (text[i] === "/" && text[i + 1] === "/")) {
      const rest = text.slice(i);
      const newlineIdx = rest.indexOf("\n");
      const comment = newlineIdx === -1 ? rest : rest.slice(0, newlineIdx);
      tokens.push({ text: comment, color: COLORS.comment });
      i += comment.length;
      continue;
    }

    // Strings: single or double quotes, including triple-quoted
    if (text[i] === '"' || text[i] === "'") {
      const quote = text[i];
      const isTriple =
        text[i + 1] === quote && text[i + 2] === quote;
      const delimiter = isTriple ? quote.repeat(3) : quote;
      let j = i + delimiter.length;
      while (j < text.length) {
        if (text[j] === "\\" && j + 1 < text.length) {
          j += 2;
          continue;
        }
        if (text.slice(j, j + delimiter.length) === delimiter) {
          j += delimiter.length;
          break;
        }
        j++;
      }
      tokens.push({ text: text.slice(i, j), color: COLORS.string });
      i = j;
      continue;
    }

    // Numbers
    if (/\d/.test(text[i]) && (i === 0 || /[\s(,=[\]:{+\-*/]/.test(text[i - 1]))) {
      let j = i;
      while (j < text.length && /[\d.]/.test(text[j])) j++;
      tokens.push({ text: text.slice(i, j), color: COLORS.number });
      i = j;
      continue;
    }

    // Words (identifiers, keywords)
    if (/[a-zA-Z_]/.test(text[i])) {
      let j = i;
      while (j < text.length && /[a-zA-Z0-9_]/.test(text[j])) j++;
      const word = text.slice(i, j);

      // Check if it's a function call (followed by parenthesis)
      const nextNonSpace = text.slice(j).match(/^\s*\(/);

      if (KEYWORDS.has(word)) {
        tokens.push({ text: word, color: COLORS.keyword });
      } else if (BUILTINS.has(word)) {
        tokens.push({ text: word, color: COLORS.builtin });
      } else if (nextNonSpace) {
        tokens.push({ text: word, color: COLORS.function });
      } else {
        tokens.push({ text: word, color: COLORS.default });
      }
      i = j;
      continue;
    }

    // Operators and punctuation
    if (/[=+\-*/<>!&|^~%]/.test(text[i])) {
      let j = i;
      while (j < text.length && /[=+\-*/<>!&|^~%]/.test(text[j])) j++;
      tokens.push({ text: text.slice(i, j), color: COLORS.operator });
      i = j;
      continue;
    }

    if (/[()[\]{},.:;@]/.test(text[i])) {
      tokens.push({ text: text[i], color: COLORS.punctuation });
      i++;
      continue;
    }

    // Whitespace and everything else
    tokens.push({ text: text[i], color: COLORS.default });
    i++;
  }

  return tokens;
}

export const CodeHighlighter: React.FC<{
  code: string;
  visibleChars: number;
}> = ({ code, visibleChars }) => {
  const tokens = tokenize(code);
  let charCount = 0;

  return (
    <>
      {tokens.map((token, idx) => {
        const tokenStart = charCount;
        charCount += token.text.length;

        if (tokenStart >= visibleChars) {
          return null;
        }

        const visibleText =
          charCount <= visibleChars
            ? token.text
            : token.text.slice(0, visibleChars - tokenStart);

        return (
          <span key={idx} style={{ color: token.color }}>
            {visibleText}
          </span>
        );
      })}
    </>
  );
};
