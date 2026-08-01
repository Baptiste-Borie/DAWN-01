import { useContext } from "react";
import { DockContext } from "./dockContext";

export function useDock() {
  const ctx = useContext(DockContext);
  if (!ctx) throw new Error("useDock must be used within a DockProvider");
  return ctx;
}
