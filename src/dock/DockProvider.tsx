import { useMemo, useReducer, type ReactNode } from "react";
import { DockContext, type DockApi } from "./dockContext";
import { dockReducer, initialDockState } from "./dockReducer";

export function DockProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dockReducer, initialDockState);

  const value = useMemo<DockApi>(
    () => ({
      plugged: state.plugged,
      activeView: state.activeView,
      swapping: state.swapping,
      plug: (port, serviceId) => dispatch({ type: "PLUG", port, serviceId }),
      activate: (serviceId) => dispatch({ type: "ACTIVATE", serviceId }),
      goHome: () => dispatch({ type: "GO_HOME" }),
      swapComplete: () => dispatch({ type: "SWAP_COMPLETE" }),
    }),
    [state],
  );

  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}
