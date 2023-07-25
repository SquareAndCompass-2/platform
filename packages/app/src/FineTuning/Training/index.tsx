import { Link } from "react-router-dom";

import { FineTuning } from "~/FineTuning";
import { GlobalState } from "~/GlobalState";
import { Theme } from "~/Theme";
import { User } from "~/User";

import { Create } from "./Create";
import { Progress } from "./Progress";

export function Training() {
  const create = Create.use();
  const percentage = Training.usePercentage();

  create;

  const { minMilliseconds, maxMilliseconds } =
    FineTuning.Mode.Duration.use() ?? {
      minMilliseconds: 0,
      maxMilliseconds: 0,
    };

  return (
    <FineTuning.Step
      disableNavigation
      className="max-w-[800px] grow items-center"
    >
      {percentage < 100 ? (
        <>
          <FineTuning.H1 className="flex items-center gap-1">
            Training&nbsp;
            <span className="opacity-muted font-light">
              {Math.round(percentage)}%
            </span>
          </FineTuning.H1>
          <Progress />
        </>
      ) : (
        <FineTuning.Card className="flex flex-col gap-8">
          <FineTuning.H1 className="flex items-center justify-center gap-1">
            <Theme.Icon.Check className="-ml-4 text-green-500" />
            Done Training
          </FineTuning.H1>
          <div>
            <p>
              You can manage your model on the&nbsp;
              <Link
                className="text-indigo-500 hover:underline"
                to={User.Account.Page.url()}
              >
                account page
              </Link>
              .
            </p>
            <p>
              Check out the&nbsp;
              <Link
                className="text-indigo-500 hover:underline"
                to={User.Account.Page.url()}
              >
                documentation
              </Link>
              &nbsp;for how to use your model through the API.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Theme.Button className="px-4" onClick={FineTuning.Steps.next}>
              New Model
            </Theme.Button>
            <Theme.Button
              variant="primary"
              className="px-4"
              onClick={FineTuning.Steps.next}
            >
              Try
              <FineTuning.ArrowRight className="ml-2" />
            </Theme.Button>
          </div>
        </FineTuning.Card>
      )}
      {percentage < 100 && (
        <div className="text-center">
          <p>We&apos;re fine-tuning your model now.</p>
          <p>
            This usually takes between {minMilliseconds / 1000 / 60} to&nbsp;
            {maxMilliseconds / 1000 / 60} minutes.
          </p>
        </div>
      )}
    </FineTuning.Step>
  );
}

export namespace Training {
  export const start = () => State.use.getState().start();
  export const stop = () => State.use.getState().stop();

  export const useStartedAt = () => State.use(({ startedAt }) => startedAt);
  export const useStoppedAt = () => State.use(({ stoppedAt }) => stoppedAt);

  export const usePercentage = () => {
    const [now, setNow] = useState(new Date());

    const { maxMilliseconds } = FineTuning.Mode.Duration.use() ?? {
      maxMilliseconds: Infinity,
    };

    const startedAt = useStartedAt();
    const stoppedAt = useStoppedAt();

    const elapsedMilliseconds = startedAt
      ? now.valueOf() - startedAt.valueOf()
      : 0;

    const percentage = Math.max(
      stoppedAt ? 100 : 0,
      Math.min(
        maxMilliseconds > 0 ? (elapsedMilliseconds / maxMilliseconds) * 100 : 0,
        100
      )
    );

    useEffect(() => {
      if (percentage === 100) return;

      const interval = setInterval(() => {
        setNow(new Date());
      }, 250);

      return () => clearInterval(interval);
    }, [percentage]);

    return percentage;
  };
}

type State = {
  startedAt?: Date;
  stoppedAt?: Date;

  start: () => void;
  stop: () => void;
};

namespace State {
  export const use = GlobalState.create<State>((set) => ({
    start: () => set(spy({ startedAt: new Date(), stoppedAt: undefined })),
    stop: () => set(spy({ stoppedAt: new Date() })),
  }));
}
