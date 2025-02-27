import { Link } from "react-router-dom";
import { Markdown } from "~/Markdown";
import { Theme } from "~/Theme";

export type Code = string;

export function Code({
  code,
  language,
  setLanguage,
  onClose,
  redirect,
  redirectReason,
}: {
  code: Code;
  language: Code.Language;
  setLanguage: (language: Code.Language) => void;
  onClose: () => void;
  redirect?: string;
  redirectReason?: string;
}) {
  const highlighting = Code.useHighlighting(code, language);

  return (
    <div
      ref={highlighting.ref}
      css={highlighting.css}
      className={classes(
        "relative flex w-full max-w-[50rem] shrink flex-col overflow-hidden overflow-x-auto rounded-xl"
      )}
    >
      {redirect && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="pointer-events-none flex flex-col items-center gap-2">
            <h1 className="text-lg text-white">
              {redirectReason ?? "Examples are not available for this engine"}
            </h1>
            <Link
              to={redirect}
              className="pointer-events-auto flex items-center gap-2 text-amber-300 hover:underline"
            >
              Learn more
              <Theme.Icon.ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
      <div
        className={classes(
          "flex w-full gap-1 border-b border-[#424242] bg-[#2b2b2b] p-2"
        )}
      >
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
        <div className="ml-auto flex items-center gap-1">
          {!redirect && (
            <button
              onClick={() => navigator.clipboard.writeText(code)}
              className="rounded border border-transparent p-1 text-xs text-white duration-100 hover:bg-white hover:text-black"
            >
              <Theme.Icon.Copy className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="aspect-square rounded border border-transparent p-0.5 px-1 text-xs text-white duration-100 hover:bg-white hover:text-black"
          >
            <Theme.Icon.X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        className={classes("h-full overflow-auto", redirect && "bg-[#2b2b2b]")}
      >
        {!redirect ? (
          <Markdown
            className={classes(
              "sandbox m-0 h-full max-w-full rounded-t-none p-0 text-[0.95rem] leading-3 sm:px-0"
            )}
          >
            {Code.toMarkdownCodeBlock(code, language)}
          </Markdown>
        ) : (
          <div className="sandbox h-full w-full" />
        )}
      </div>
    </div>
  );
}

export namespace Code {
  export type Language = "python" | "javascript";

  export const toMarkdownCodeBlock = (code: Code, language: Language) =>
    "```" + language + "\n" + code + "\n```";

  export const useHighlighting = (code: Code, language: Language) => {
    const fadeInSpeed = 100;
    const fadeOutSpeed = 750;
    const fadeOutDelay = 1000;

    const ref = useRef<HTMLDivElement>(null);
    const spans = useRef<HTMLSpanElement[]>([]);
    const previousContents = useRef<string[]>([]);
    const timeouts = useRef<NodeJS.Timeout[]>([]);

    useEffect(
      () => () => {
        timeouts.current.forEach(clearTimeout);
      },
      []
    );

    useEffect(() => {
      spans.current = [];
      previousContents.current = [];

      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
    }, [language]);

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
    }, [code]);

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
