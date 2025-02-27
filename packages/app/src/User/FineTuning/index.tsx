import { GRPC as Proto } from "@stability/sdk";
import { Link } from "react-router-dom";
import { FineTuning as GlobalFineTuning } from "~/FineTuning";
import { GRPC } from "~/GRPC";
import { Theme } from "~/Theme";

const statusMap = {
  Submitted: 0,
  "Not Started": 1,
  Running: 2,
  Completed: 3,
  Failed: 4,
};

function statusValue(status?: GlobalFineTuning.Model.Status) {
  return statusMap[status ?? "Not Started"];
}

export function FineTuning() {
  const models = GlobalFineTuning.Models.use();
  return (
    <div className="flex h-full w-full flex-col gap-5 pb-12">
      <Theme.Background
        className="h-fit min-h-0 w-full grow self-start overflow-x-auto truncate"
        title="Your Models"
      >
        {models.data || !models.isFetched ? (
          <div className="flex w-full flex-col gap-2 text-left">
            <div className="mb-2 grid grid-cols-6 border-b border-black/5 pb-2 text-xs uppercase text-neutral-500">
              <h1 className="col-span-3 truncate">Name</h1>
              <h1 className="truncate">Type</h1>
              <h1 className="truncate">Status</h1>
            </div>
            {!models.isFetched ? (
              <div className="grid grid-cols-6 text-sm text-neutral-700 dark:text-neutral-400">
                <h1 className="col-span-6 mt-6 truncate text-center">
                  Loading...
                </h1>
              </div>
            ) : (
              Object.values(models.data)
                .sort((a, b) => statusValue(a.status) - statusValue(b.status))
                .map((model) => <Model key={model.id} model={model} />)
            )}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <h1 className="text-center text-black/50">
              {"You don't have any fine-tuned models yet"}
            </h1>
            <Link
              to="/sandbox/fine-tuning"
              className="pointer-events-auto flex items-center gap-2 text-indigo-600 hover:underline"
            >
              Create a fine-tune
              <Theme.Icon.ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        )}
      </Theme.Background>

      <Link
        to="/sandbox/fine-tuning"
        className="pointer-events-auto flex items-center gap-2 text-indigo-600 hover:underline"
      >
        Create a fine-tune
        <Theme.Icon.ExternalLink className="h-4 w-4" />
      </Link>
    </div>
  );
}

function Model({ model }: { model: GlobalFineTuning.Model }) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isFailureReasonModelOpen, setIsFailureReasonModelOpen] =
    useState(false);
  const grpc = GRPC.use();
  return (
    <div className="grid grid-cols-6 items-center border-b border-zinc-200/50 pb-2 text-sm text-neutral-700 last:border-transparent last:pb-0 dark:text-neutral-400">
      <div className="col-span-3 flex flex-col gap-0.5 truncate">
        {model.status === "Completed" ? (
          <Link
            className="group flex w-fit items-center gap-1 text-lg hover:text-indigo-500 hover:underline"
            to={`/sandbox/text-to-image?fine-tune=${model.id}`}
          >
            {model.name}
            <Theme.Icon.ExternalLink className="hidden h-4 w-4 group-hover:block" />
          </Link>
        ) : (
          <h2 className="w-fit text-lg">{model.name}</h2>
        )}
        <p
          className="group flex w-fit items-center gap-1 text-xs opacity-50"
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(model.id);

            // select the text
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(e.target as Node);
            selection?.removeAllRanges();
            selection?.addRange(range);
          }}
        >
          {model.id}
          <Theme.Icon.Copy className="hidden h-3 w-3 group-hover:block" />
        </p>
      </div>
      <h1 className="w-fit truncate text-left text-sm opacity-75">
        {model.mode}
      </h1>
      <h1 className="flex items-center gap-2 truncate">
        <h1
          className={classes(
            "w-fit rounded border px-2 py-0.5 text-sm",
            model.status === "Completed"
              ? "border-green-600 text-green-600"
              : model.status === "Failed"
              ? "border-red-600 text-red-600"
              : "border-yellow-600 text-yellow-600"
          )}
        >
          {model.status}
        </h1>
        {model.status === "Failed" && model.failureReason && (
          <>
            <h1
              className="cursor-pointer truncate"
              onClick={() => setIsFailureReasonModelOpen(true)}
            >
              {model.failureReason}
            </h1>
            <FailureReasonModal
              open={isFailureReasonModelOpen}
              onClose={() => {
                setIsFailureReasonModelOpen(false);
              }}
              reason={model.failureReason}
            />
          </>
        )}
      </h1>
      <div className="flex items-center justify-end gap-2">
        <Theme.Button
          className="w-fit rounded p-0 transition-all duration-200 hover:text-red-600"
          onClick={() => setIsConfirmModalOpen(true)}
        >
          <Theme.Icon.X className="h-5 w-5" />
        </Theme.Button>
        <DeleteModal
          model={model}
          open={isConfirmModalOpen}
          onClose={() => {
            setIsConfirmModalOpen(false);
          }}
          onDelete={() => {
            grpc?.fineTuning.deleteModel(
              Proto.DeleteModelRequest.create({
                id: model.id,
              })
            );
          }}
        />
      </div>
    </div>
  );
}

export function DeleteModal({
  model,
  open,
  onClose,
  onDelete,
}: {
  model: GlobalFineTuning.Model;
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <Theme.Modal
      open={open}
      onClose={onClose}
      title="Delete this fine-tuned model?"
      className="flex w-full max-w-[25rem]"
      bottom={
        <div className="flex w-full items-center justify-end gap-3 p-4">
          <Theme.Button
            className="w-fit bg-transparent px-3 py-1.5 hover:bg-transparent hover:underline"
            onClick={onClose}
          >
            Cancel
          </Theme.Button>
          <Theme.Button
            className="w-fit bg-red-500 px-3 py-1.5 text-white hover:bg-red-600"
            onClick={() => {
              setLoading(true);
              onDelete();
            }}
            loading={loading}
          >
            Delete
          </Theme.Button>
        </div>
      }
    >
      <p className="whitespace-normal">
        This is a permanent action and cannot be undone. Services depending on{" "}
        <span className="rounded bg-black/10 p-1 py-0.5 font-mono text-black">
          {model.name}
        </span>{" "}
        will stop working.
      </p>
    </Theme.Modal>
  );
}

export function FailureReasonModal({
  open,
  onClose,
  reason,
}: {
  open: boolean;
  onClose: () => void;
  reason: string;
}) {
  return (
    <Theme.Modal
      open={open}
      onClose={onClose}
      title="Failure Reason"
      className="flex w-full max-w-[25rem]"
    >
      <p className="whitespace-normal">{reason}</p>
    </Theme.Modal>
  );
}

export namespace FineTuning {
  export const uri = () => "fine-tuning" as const;
  export const url = () => "/account/fine-tuning" as const;
}
