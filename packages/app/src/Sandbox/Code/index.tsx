import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

import { Copy, X } from "~/Theme";

export type Code = string;

export function Code({
  code,
  language,
  setLanguage,
  onClose,
}: {
  code: Code;
  language: Code.Language;
  setLanguage: (language: Code.Language) => void;
  onClose: () => void;
}) {
  const highlighting = Code.useHighlighting(code);
  return (
    <div
      ref={highlighting.ref}
      css={highlighting.css}
      style={a11yDark}
      className="flex w-full max-w-[50rem] shrink flex-col overflow-hidden overflow-x-auto rounded-xl bg-[#2b2b2b]"
    >
      <div className="flex w-full gap-1 border-b border-[#424242] p-2">
        <LanguageButton
          language="Typescript"
          onClick={() => setLanguage("typescript")}
          active={language === "typescript"}
        />
        <LanguageButton
          language="Javascript"
          onClick={() => setLanguage("javascript")}
          active={language === "javascript"}
        />
        <LanguageButton
          language="Python"
          onClick={() => setLanguage("python")}
          active={language === "python"}
        />
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="ml-auto rounded border border-transparent p-1 text-xs text-white duration-100 hover:bg-white hover:text-black"
        >
          <Copy className="h-4 w-4" />
        </button>
        <button
          onClick={onClose}
          className="aspect-square rounded border border-transparent p-1 px-1.5 text-xs text-white duration-100 hover:bg-white hover:text-black"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
      <SyntaxHighlighter
        showLineNumbers
        className="code"
        language={language}
        style={a11yDark}
        lineNumberStyle={{ color: "#666666" }}
        customStyle={{
          width: "100%",
          height: "100%",
          fontSize: "0.85rem",
          textAlign: "left",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export namespace Code {
  export type Language = "python" | "javascript" | "typescript";

  export const useHighlighting = (content: string) => {
    const fadeInSpeed = 100;
    const fadeOutSpeed = 750;
    const fadeOutDelay = 1000;

    const ref = useRef<HTMLDivElement>(null);
    const spans = useRef<HTMLSpanElement[]>([]);
    const previousContents = useRef<string[]>([]);
    const timeouts = useRef<NodeJS.Timeout[]>([]);

    useEffect(() => {
      if (!ref.current) return;
      if (!spans.current.length)
        spans.current = [
          ...ref.current.querySelectorAll<HTMLSpanElement>("span"),
        ];

      const currentContents = spans.current.map(
        (span) => span.textContent ?? ""
      );

      currentContents.forEach((content, index) => {
        const previousContent = previousContents.current[index] ?? "";
        if (content === previousContent || previousContent === "") return;

        spans.current[index]?.classList.add("recently-edited");
        timeouts.current[index] && clearTimeout(timeouts.current[index]);
        timeouts.current[index] = setTimeout(() => {
          spans.current[index]?.classList.remove("recently-edited");
        }, fadeOutDelay);
      });

      previousContents.current = currentContents;
    }, [content]);

    return {
      ref,
      css: css`
        & span {
          position: relative;
          overflow: visible;

          &:before {
            content: "";
            position: absolute;
            top: -0.25em;
            left: -0.35em;
            bottom: -0.25em;
            right: -0.35em;

            opacity: 0;
            border: 0.1em solid rgb(99, 102, 241);
            border-radius: 0.25rem;
            box-shadow: inset 0 0 0.3em rgb(99, 102, 241),
              0 0 1em rgb(99, 102, 241), 0 0 5em rgb(99, 102, 241);

            transition: opacity ${fadeOutSpeed}ms ease-in;
          }
        }

        & .recently-edited:before {
          opacity: 1;
          transition: opacity ${fadeInSpeed}ms ease-out;
        }
      `,
    };
  };
}

function LanguageButton({
  language,
  onClick,
  active,
}: {
  language: string;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={classes(
        "flex items-center justify-center rounded border border-transparent px-1.5 text-xs text-white duration-100",
        active ? "bg-white text-black" : "hover:border-zinc-400"
      )}
    >
      {language}
    </button>
  );
}
