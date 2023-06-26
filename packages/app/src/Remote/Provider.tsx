import * as ReactQuery from "@tanstack/react-query";

import { Remote } from "~/Remote";

export function Provider({ children }: React.PropsWithChildren) {
  return (
    <ReactQuery.QueryClientProvider
      client={useMemo(() => Remote.Client.create(), [])}
    >
      {children}
    </ReactQuery.QueryClientProvider>
  );
}
