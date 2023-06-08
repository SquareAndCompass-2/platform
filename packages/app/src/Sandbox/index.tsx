import { Button } from "~/Theme";
import { Code, Languages } from "./Code";
import * as TextToImageSandbox from "./TextToImage";

export function Sandbox({ apiKey }: { apiKey?: string }) {
  const [showCode, setShowCode] = useState<boolean>(false);
  const [codeLanguage, setCodeLanguage] = useState<Languages>("typescript");
  const [options, setOptions] = useState<any>({});

  const code = useMemo(() => {
    const code = TextToImageSandbox.examples[codeLanguage]
      .trim()
      .replace("{apiKey}", apiKey ?? "YOUR API KEY");

    // replace {VALUE} with the value from the options object
    return Object.entries(options).reduce((acc, [key, value]) => {
      return acc.replace(`{${key}}`, `${value}`);
    }, code);
  }, [codeLanguage, apiKey, options]);

  return (
    <div className="flex h-full max-h-full min-h-0 w-full grow flex-col gap-6 p-6">
      <div className="flex min-h-0 grow gap-6">
        {showCode && (
          <Code
            content={code}
            language={codeLanguage}
            setLanguage={setCodeLanguage}
            onClose={() => setShowCode(false)}
          />
        )}
        <TextToImageSandbox.TextToImage
          apiKey={apiKey}
          setOptions={setOptions}
        />
      </div>
      <div className="flex min-h-0 shrink-0 gap-6">
        <Button onClick={() => setShowCode(!showCode)}>
          {showCode ? "Hide" : "Show"} code
        </Button>
        <Button
          link="https://github.com/Stability-AI/platform/blob/main/packages/app/src/Sandbox/TextToImage/index.tsx"
          variant="secondary"
        >
          View on GitHub
        </Button>
      </div>
    </div>
  );
}
